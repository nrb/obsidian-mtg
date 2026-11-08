// Bundled for the acceptance pages (see harness.mjs).
import { mountOverlap } from "../../src/overlap/overlap.js";
import overlapTemplate from "../../src/overlap/template.html";
import { mountExtendedArt } from "../../src/extended-art/finder.js";
import extendedArtTemplate from "../../src/extended-art/template.html";
import Plugin, { VIEW_OVERLAP, VIEW_EXTENDED_ART } from "../../src/main.ts";

window.T = { mountOverlap, overlapTemplate, mountExtendedArt, extendedArtTemplate };

/** Load the plugin against an in-memory vault, open both views and run onLayoutReady. */
window.bootPlugin = async () => {
	const leaves = {}, files = {};
	let ready = null;
	const adapter = {
		exists: async (p) => p in files || Object.keys(files).some((k) => k.startsWith(p + "/")),
		read: async (p) => files[p], write: async (p, d) => { files[p] = d; },
		readBinary: async (p) => files[p], writeBinary: async (p, d) => { files[p] = d; },
		mkdir: async () => {}, rmdir: async (p) => { for (const k of Object.keys(files)) if (k.startsWith(p)) delete files[k]; },
	};
	const app = {
		workspace: { getLeavesOfType: (t) => leaves[t] || [], getActiveFile: () => null, on: () => ({}), onLayoutReady: (f) => { ready = f; } },
		vault: { adapter, configDir: ".obsidian" },
	};
	const plugin = new Plugin(app, { id: "mtg-decks", dir: ".obsidian/plugins/mtg-decks" });
	await plugin.onload();
	for (const t of [VIEW_EXTENDED_ART, VIEW_OVERLAP]) {
		const view = plugin.views[t]({});
		await view.onOpen();
		document.getElementById("root").appendChild(view.contentEl);
		leaves[t] = [{ view }];
	}
	await ready();
	return { plugin, files, leaves };
};
