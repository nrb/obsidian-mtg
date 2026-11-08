import { App, Modal, Notice, Setting, requestUrl } from "obsidian";
import { BULK_API, BULK_TYPES, BulkIndex, BulkInfo, BulkType, INDEX_VERSION, buildIndex, cardInfo, gzipLines, offColorEntry } from "./scryfall";

export interface BulkMeta {
	/** Scryfall's updated_at for each cached file. */
	updated: Partial<Record<BulkType, string>>;
	sizes: Partial<Record<BulkType, number>>;
	downloadedAt: string | null;
}

export const EMPTY_META: BulkMeta = { updated: {}, sizes: {}, downloadedAt: null };

const HEADERS = { Accept: "application/json", "User-Agent": "obsidian-mtg-plugin/0.2" };

/**
 * Downloads Scryfall bulk files into the plugin's cache folder, keeps the raw .jsonl.gz
 * files for offline use, and builds the index the views read.
 */
export class BulkCache {
	index: BulkIndex | null = null;
	busy = false;

	constructor(
		private app: App,
		private dir: string,
		public meta: BulkMeta,
		private saveMeta: (m: BulkMeta) => Promise<void>,
		private onIndex: () => void,
	) {}

	private file(t: BulkType) { return `${this.dir}/${t}.jsonl.gz`; }
	private get indexPath() { return `${this.dir}/index.json`; }

	async hasCache(): Promise<boolean> {
		return this.app.vault.adapter.exists(this.file("default_cards"));
	}

	/** Load the index; rebuild it from the cached files if it is missing or outdated. */
	async load(): Promise<void> {
		const a = this.app.vault.adapter;
		try {
			if (await a.exists(this.indexPath)) {
				const ix = JSON.parse(await a.read(this.indexPath)) as BulkIndex;
				if (ix.v === INDEX_VERSION) { this.index = ix; this.onIndex(); return; }
			}
			if (await this.hasCache()) await this.rebuild();
		} catch (e) {
			console.error("MTG Decks: could not load the Scryfall cache", e);
		}
	}

	private async rebuild(buffers?: Partial<Record<BulkType, ArrayBuffer>>, note?: Notice): Promise<void> {
		const a = this.app.vault.adapter;
		const get = async (t: BulkType) => buffers?.[t] ?? ((await a.exists(this.file(t))) ? await a.readBinary(this.file(t)) : null);
		const def = await get("default_cards");
		if (!def) return;
		const tags = await get("oracle_tags");
		const sources: Record<string, string> = {};
		for (const t of BULK_TYPES) { const u = this.meta.updated[t]; if (u) sources[t] = u; }
		const ix = await buildIndex(gzipLines(def), tags ? gzipLines(tags) : null, sources, (n) => note?.setMessage(`Scryfall data: indexing ${n.toLocaleString()} cards…`));
		await a.write(this.indexPath, JSON.stringify(ix));
		this.index = ix;
		this.onIndex();
	}

	/** Download the bulk files (only those Scryfall has updated, unless forced) and rebuild the index. */
	async download(force = false): Promise<void> {
		if (this.busy) { new Notice("Scryfall data is already downloading."); return; }
		this.busy = true;
		const note = new Notice("Scryfall data: checking for updates…", 0);
		try {
			const list = (await requestUrl({ url: BULK_API, headers: HEADERS })).json as { data: BulkInfo[] };
			const a = this.app.vault.adapter;
			if (!(await a.exists(this.dir))) await a.mkdir(this.dir);
			const buffers: Partial<Record<BulkType, ArrayBuffer>> = {};
			const meta: BulkMeta = { updated: { ...this.meta.updated }, sizes: { ...this.meta.sizes }, downloadedAt: this.meta.downloadedAt };
			for (const t of BULK_TYPES) {
				const info = list.data.find((d) => d.type === t);
				if (!info || !info.jsonl_download_uri) throw new Error(`Scryfall did not list the ${t} file.`);
				if (!force && meta.updated[t] === info.updated_at && (await a.exists(this.file(t)))) continue;
				const mb = info.compressed_size ? ` (${Math.round(info.compressed_size / 1e6)} MB)` : "";
				note.setMessage(`Scryfall data: downloading ${t.replace("_", " ")}${mb}…`);
				const buf = (await requestUrl({ url: info.jsonl_download_uri, headers: { "User-Agent": HEADERS["User-Agent"] } })).arrayBuffer;
				await a.writeBinary(this.file(t), buf);
				buffers[t] = buf;
				meta.updated[t] = info.updated_at;
				meta.sizes[t] = buf.byteLength;
			}
			if (!Object.keys(buffers).length && this.index) {
				note.setMessage("Scryfall data is already up to date.");
			} else {
				meta.downloadedAt = new Date().toISOString();
				this.meta = meta;
				await this.saveMeta(meta);
				note.setMessage("Scryfall data: building the card index…");
				await this.rebuild(buffers, note);
				note.setMessage("Scryfall data downloaded and cached for offline use.");
			}
			window.setTimeout(() => note.hide(), 5000);
		} catch (e) {
			note.setMessage("Scryfall download failed: " + (e instanceof Error ? e.message : String(e)) + ". The cached data, if any, is unchanged.");
			window.setTimeout(() => note.hide(), 10000);
		} finally {
			this.busy = false;
		}
	}

	async clear(): Promise<void> {
		const a = this.app.vault.adapter;
		if (await a.exists(this.dir)) await a.rmdir(this.dir, true);
		this.index = null;
		this.meta = { ...EMPTY_META, updated: {}, sizes: {} };
		await this.saveMeta(this.meta);
		this.onIndex();
	}

	summary(): string {
		if (!this.meta.downloadedAt) return "Not downloaded. The views use the data bundled with the plugin.";
		const mb = Object.values(this.meta.sizes).reduce((x: number, y) => x + (y || 0), 0) / 1e6;
		const upd = BULK_TYPES.map((t) => `${t.replace("_", " ")} ${(this.meta.updated[t] ? new Date(this.meta.updated[t] ?? "").toLocaleDateString() : "missing")}`).join(", ");
		return `Cached ${mb.toFixed(0)} MB (${upd}).` + (this.index ? ` ${Object.keys(this.index.cards).length.toLocaleString()} cards indexed.` : " Index not built yet.");
	}

	// ---- Data for the views ----

	extendedArtData() {
		const ix = this.index;
		if (!ix) return null;
		const d = ix.sources.default_cards ? new Date(ix.sources.default_cards).toLocaleDateString() : new Date(ix.builtAt).toLocaleDateString();
		return { refreshed: d, sets: ix.sets, cards: ix.ea };
	}
	cardInfo(name: string) { return this.index ? cardInfo(this.index, name) : null; }
	offColor(name: string, pool: Record<string, unknown>) {
		return this.index ? offColorEntry(this.index, name, pool) : null;
	}
}

/** First-launch prompt. */
export class BulkPromptModal extends Modal {
	constructor(app: App, private onDownload: () => void) { super(app); }
	onOpen() {
		this.titleEl.setText("Download Scryfall card data?");
		this.contentEl.createEl("p", {
			text: "MTG Decks can download Scryfall's Default Cards and Oracle Tags bulk files (about 87 MB) and cache them in this vault for offline use. " +
				"They keep the extended art printings and prices current, fill in card colors for decks you add, and suggest substitutes for off-color cards.",
		});
		this.contentEl.createEl("p", { text: "You can do this later from Settings → MTG Decks.", cls: "setting-item-description" });
		new Setting(this.contentEl)
			.addButton((b) => b.setButtonText("Not now").onClick(() => this.close()))
			.addButton((b) => b.setButtonText("Download").setCta().onClick(() => { this.close(); this.onDownload(); }));
	}
	onClose() { this.contentEl.empty(); }
}
