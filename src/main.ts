import {
	App,
	FuzzySuggestModal,
	ItemView,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
	WorkspaceLeaf,
	debounce,
	normalizePath,
} from "obsidian";
import { mountOverlap } from "./overlap/overlap.js";
import overlapTemplate from "./overlap/template.html";
import { mountExtendedArt } from "./extended-art/finder.js";
import extendedArtTemplate from "./extended-art/template.html";
import {
	StoredCollection,
	ownedByPrinting,
	ownedRows,
	parseManaBoxCsv,
	summarize,
} from "./collection";
import { BulkCache, BulkMeta, BulkPromptModal, EMPTY_META } from "./bulk";

export const VIEW_OVERLAP = "mtg-deck-overlap";
export const VIEW_EXTENDED_ART = "mtg-extended-art";

interface MtgSettings {
	outputFolder: string;
	skipWishlists: boolean;
	/** Set once the first-launch Scryfall download prompt has been shown. */
	bulkPrompted: boolean;
}

const DEFAULT_SETTINGS: MtgSettings = {
	outputFolder: "MTG",
	skipWishlists: true,
	bulkPrompted: false,
};

interface MtgData {
	settings: MtgSettings;
	collection: StoredCollection | null;
	overlap: unknown;
	extendedArt: unknown;
	bulk: BulkMeta;
}

interface Mounted { refresh(): void; destroy(): void }

/** What the ported views need from Obsidian. */
interface ViewHost {
	load(): unknown;
	save(v: unknown): void;
	saveFile(name: string, data: string): Promise<string>;
	saveNote(title: string, body: string): Promise<string>;
	readActiveNote(): Promise<{ name: string; text: string } | null>;
	owned(set: string, cn: string): number;
	collectionNote(): string;
	extendedArtData(): unknown;
	cardInfo(name: string): unknown;
	offColor(name: string, pool: Record<string, unknown>): unknown;
}

export default class MtgPlugin extends Plugin {
	data!: MtgData;
	bulk!: BulkCache;
	private owned = new Map<string, number>();
	private lastMarkdown: TFile | null = null;
	private saveSoon = debounce(() => { void this.saveData(this.data); }, 500, true);

	async onload() {
		const raw = ((await this.loadData()) || {}) as Partial<MtgData>;
		this.data = {
			settings: Object.assign({}, DEFAULT_SETTINGS, raw.settings || {}),
			collection: raw.collection || null,
			overlap: raw.overlap ?? null,
			extendedArt: raw.extendedArt ?? null,
			bulk: raw.bulk || { ...EMPTY_META, updated: {}, sizes: {} },
		};
		this.rebuildOwned();

		this.bulk = new BulkCache(
			this.app,
			normalizePath(`${this.manifest.dir || `${this.app.vault.configDir}/plugins/${this.manifest.id}`}/cache`),
			this.data.bulk,
			async (m) => { this.data.bulk = m; await this.saveData(this.data); },
			() => { this.refreshViews(VIEW_OVERLAP); this.refreshViews(VIEW_EXTENDED_ART, true); },
		);
		this.app.workspace.onLayoutReady(async () => {
			await this.bulk.load();
			if (!this.data.settings.bulkPrompted && !(await this.bulk.hasCache())) {
				this.data.settings.bulkPrompted = true;
				await this.saveData(this.data);
				new BulkPromptModal(this.app, () => void this.bulk.download()).open();
			}
		});

		this.registerView(VIEW_OVERLAP, (leaf) => new OverlapView(leaf, this));
		this.registerView(VIEW_EXTENDED_ART, (leaf) => new ExtendedArtView(leaf, this));

		this.addRibbonIcon("layers", "Open deck overlap", () => this.activate(VIEW_OVERLAP));
		this.addRibbonIcon("image", "Open extended art finder", () => this.activate(VIEW_EXTENDED_ART));

		this.addCommand({ id: "open-deck-overlap", name: "Open deck overlap", callback: () => this.activate(VIEW_OVERLAP) });
		this.addCommand({ id: "open-extended-art-finder", name: "Open extended art finder", callback: () => this.activate(VIEW_EXTENDED_ART) });
		this.addCommand({ id: "download-scryfall-data", name: "Download or update Scryfall card data", callback: () => void this.bulk.download() });
		this.addCommand({ id: "import-manabox-csv", name: "Import ManaBox collection CSV from disk", callback: () => this.pickCsvFromDisk() });
		this.addCommand({
			id: "import-manabox-csv-vault",
			name: "Import ManaBox collection CSV from vault",
			callback: () => new CsvFileModal(this.app, (f) => void this.importVaultCsv(f)).open(),
		});

		// Remember the last markdown note so "Add from current note" works while a plugin view has focus.
		this.registerEvent(this.app.workspace.on("active-leaf-change", () => {
			const f = this.app.workspace.getActiveFile();
			if (f && f.extension === "md") this.lastMarkdown = f;
		}));

		this.addSettingTab(new MtgSettingTab(this.app, this));
	}

	onunload() {
		this.saveSoon.run();
	}

	persist() { this.saveSoon(); }

	async activate(type: string) {
		const { workspace } = this.app;
		let leaf = workspace.getLeavesOfType(type)[0];
		if (!leaf) {
			leaf = workspace.getLeaf("tab");
			await leaf.setViewState({ type, active: true });
		}
		await workspace.revealLeaf(leaf);
	}

	// ---- Collection ----

	rebuildOwned() {
		this.owned = ownedByPrinting(ownedRows(this.data.collection, this.data.settings.skipWishlists));
	}

	ownedCount(set: string, cn: string): number {
		return this.owned.get(set.toUpperCase() + "|" + cn) || 0;
	}

	collectionSummary(): string {
		const c = this.data.collection;
		if (!c) return "No collection imported yet.";
		const s = summarize(ownedRows(c, this.data.settings.skipWishlists));
		const when = new Date(c.importedAt).toLocaleString();
		return `${s.copies} ${s.copies === 1 ? "card" : "cards"} (${s.names} unique ${s.names === 1 ? "name" : "names"}) from ${c.fileName}, imported ${when}` +
			(this.data.settings.skipWishlists ? ", lists and wishlists excluded." : ".");
	}

	async importCsvText(text: string, fileName: string) {
		try {
			const { collection, skippedLines } = parseManaBoxCsv(text, fileName);
			// A new import replaces the stored collection entirely.
			this.data.collection = collection;
			this.rebuildOwned();
			await this.saveData(this.data);
			this.refreshViews(VIEW_EXTENDED_ART);
			new Notice(`Collection replaced: ${this.collectionSummary()}` + (skippedLines ? ` ${skippedLines} rows skipped.` : ""), 8000);
		} catch (e) {
			new Notice("Import failed: " + (e instanceof Error ? e.message : String(e)), 8000);
		}
	}

	async importVaultCsv(f: TFile) {
		await this.importCsvText(await this.app.vault.read(f), f.name);
	}

	pickCsvFromDisk() {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".csv,text/csv";
		input.addEventListener("change", async () => {
			const f = input.files && input.files[0];
			if (f) await this.importCsvText(await f.text(), f.name);
		});
		input.click();
	}

	async clearCollection() {
		this.data.collection = null;
		this.rebuildOwned();
		await this.saveData(this.data);
		this.refreshViews(VIEW_EXTENDED_ART);
	}

	refreshViews(type: string, remount = false) {
		for (const leaf of this.app.workspace.getLeavesOfType(type)) {
			const v = leaf.view;
			if (v instanceof MountedView) { if (remount) void v.onOpen(); else v.refresh(); }
		}
	}

	// ---- Files in the vault ----

	private async ensureFolder(): Promise<string> {
		const folder = normalizePath(this.data.settings.outputFolder.trim() || "/");
		if (folder !== "/" && !this.app.vault.getAbstractFileByPath(folder)) {
			await this.app.vault.createFolder(folder);
		}
		return folder === "/" ? "" : folder + "/";
	}

	async writeVaultFile(name: string, data: string): Promise<string> {
		const path = normalizePath((await this.ensureFolder()) + name);
		const existing = this.app.vault.getAbstractFileByPath(path);
		if (existing instanceof TFile) await this.app.vault.modify(existing, data);
		else await this.app.vault.create(path, data);
		return path;
	}

	async writeNote(title: string, body: string): Promise<string> {
		const d = new Date(), p = (n: number) => String(n).padStart(2, "0");
		const stamp = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
		const path = normalizePath((await this.ensureFolder()) + `${title} ${stamp}.md`);
		const f = await this.app.vault.create(path, body);
		await this.app.workspace.getLeaf("tab").openFile(f);
		return path;
	}

	async readNote(): Promise<{ name: string; text: string } | null> {
		const active = this.app.workspace.getActiveFile();
		const f = active && active.extension === "md" ? active : this.lastMarkdown;
		if (!f) return null;
		return { name: f.basename, text: deckTextFromNote(await this.app.vault.read(f)) };
	}

	host(key: "overlap" | "extendedArt", collection: boolean): ViewHost {
		return {
			load: () => this.data[key],
			save: (v) => { this.data[key] = v; this.persist(); },
			saveFile: (name, data) => this.writeVaultFile(name, data),
			saveNote: (title, body) => this.writeNote(title, key === "extendedArt" ? "```\n" + body.replace(/\n*$/, "\n") + "```\n" : body),
			readActiveNote: () => this.readNote(),
			owned: (set, cn) => (collection ? this.ownedCount(set, cn) : 0),
			collectionNote: () => this.collectionSummary(),
			extendedArtData: () => this.bulk.extendedArtData(),
			cardInfo: (n) => this.bulk.cardInfo(n),
			offColor: (n, pool) => this.bulk.offColor(n, pool),
		};
	}
}

/** Strip frontmatter; if the note has fenced code blocks, use only their contents. */
export function deckTextFromNote(text: string): string {
	text = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
	const blocks = [...text.matchAll(/^(```|~~~)[^\n]*\n([\s\S]*?)^\1\s*$/gm)].map((m) => m[2]);
	return blocks.length ? blocks.join("\n") : text;
}

abstract class MountedView extends ItemView {
	protected mounted: Mounted | null = null;
	constructor(leaf: WorkspaceLeaf, protected plugin: MtgPlugin) { super(leaf); }
	protected abstract mount(root: HTMLElement): Mounted;
	protected abstract rootClass: string;

	async onOpen() {
		if (this.mounted) this.mounted.destroy();
		const el = this.contentEl;
		el.empty();
		el.addClass("mtg-view");
		const root = el.createDiv({ cls: this.rootClass });
		this.mounted = this.mount(root);
	}

	async onClose() {
		if (this.mounted) this.mounted.destroy();
		this.mounted = null;
		this.contentEl.empty();
	}

	refresh() { if (this.mounted) this.mounted.refresh(); }
}

class OverlapView extends MountedView {
	protected rootClass = "mtg-overlap";
	getViewType() { return VIEW_OVERLAP; }
	getDisplayText() { return "Deck overlap"; }
	getIcon() { return "layers"; }
	protected mount(root: HTMLElement): Mounted {
		root.innerHTML = overlapTemplate;
		return mountOverlap(root, this.plugin.host("overlap", false));
	}
}

class ExtendedArtView extends MountedView {
	protected rootClass = "mtg-eaf";
	getViewType() { return VIEW_EXTENDED_ART; }
	getDisplayText() { return "Extended art finder"; }
	getIcon() { return "image"; }
	protected mount(root: HTMLElement): Mounted {
		root.innerHTML = extendedArtTemplate;
		return mountExtendedArt(root, this.plugin.host("extendedArt", true));
	}
}

class CsvFileModal extends FuzzySuggestModal<TFile> {
	constructor(app: App, private onPick: (f: TFile) => void) {
		super(app);
		this.setPlaceholder("Pick a ManaBox CSV export in the vault");
	}
	getItems() { return this.app.vault.getFiles().filter((f) => f.extension.toLowerCase() === "csv"); }
	getItemText(f: TFile) { return f.path; }
	onChooseItem(f: TFile) { this.onPick(f); }
}

class MtgSettingTab extends PluginSettingTab {
	constructor(app: App, private plugin: MtgPlugin) { super(app, plugin); }

	display() {
		const { containerEl } = this;
		containerEl.empty();
		const s = this.plugin.data.settings;

		new Setting(containerEl).setName("Collection").setHeading();
		const summary = containerEl.createEl("p", { text: this.plugin.collectionSummary(), cls: "setting-item-description" });
		const redraw = () => this.display();

		new Setting(containerEl)
			.setName("Import ManaBox CSV")
			.setDesc("Export your collection from ManaBox as CSV and pick the file. A new import replaces the stored collection.")
			.addButton((b) => b.setButtonText("Choose file").setCta().onClick(() => {
				const input = document.createElement("input");
				input.type = "file";
				input.accept = ".csv,text/csv";
				input.addEventListener("change", async () => {
					const f = input.files && input.files[0];
					if (!f) return;
					await this.plugin.importCsvText(await f.text(), f.name);
					redraw();
				});
				input.click();
			}))
			.addButton((b) => b.setButtonText("From vault").onClick(() => {
				new CsvFileModal(this.app, async (f) => { await this.plugin.importVaultCsv(f); redraw(); }).open();
			}));

		new Setting(containerEl)
			.setName("Leave out lists and wishlists")
			.setDesc("Skip rows whose ManaBox binder type is \"list\", or whose binder name contains \"wish\", when counting owned cards.")
			.addToggle((t) => t.setValue(s.skipWishlists).onChange(async (v) => {
				s.skipWishlists = v;
				this.plugin.rebuildOwned();
				await this.plugin.saveData(this.plugin.data);
				this.plugin.refreshViews(VIEW_EXTENDED_ART);
				summary.setText(this.plugin.collectionSummary());
			}));

		new Setting(containerEl)
			.setName("Clear collection")
			.setDesc("Remove the stored collection from this vault.")
			.addButton((b) => b.setButtonText("Clear").setWarning().setDisabled(!this.plugin.data.collection).onClick(async () => {
				await this.plugin.clearCollection();
				redraw();
			}));

		new Setting(containerEl).setName("Scryfall card data").setHeading();
		const bulkDesc = containerEl.createEl("p", { text: this.plugin.bulk.summary(), cls: "setting-item-description" });
		new Setting(containerEl)
			.setName("Download for offline use")
			.setDesc("Downloads Scryfall's Default Cards and Oracle Tags bulk files (about 87 MB) into the plugin folder. Updating only fetches files Scryfall has changed.")
			.addButton((b) => b.setButtonText(this.plugin.data.bulk.downloadedAt ? "Update" : "Download").setCta().onClick(async () => {
				b.setDisabled(true);
				await this.plugin.bulk.download();
				redraw();
			}))
			.addButton((b) => b.setButtonText("Delete cache").setWarning().setDisabled(!this.plugin.data.bulk.downloadedAt).onClick(async () => {
				await this.plugin.bulk.clear();
				bulkDesc.setText(this.plugin.bulk.summary());
				redraw();
			}));

		new Setting(containerEl).setName("Files").setHeading();
		new Setting(containerEl)
			.setName("Output folder")
			.setDesc("Where exported JSON and saved notes (checklists, rewritten lists) go.")
			.addText((t) => t.setPlaceholder("MTG").setValue(s.outputFolder).onChange(async (v) => {
				s.outputFolder = v;
				await this.plugin.saveData(this.plugin.data);
			}));
	}
}
