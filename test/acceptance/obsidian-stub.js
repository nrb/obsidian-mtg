// A small stand-in for the "obsidian" module: just enough of the API for the plugin to load
// in a plain browser page. Network requests are redirected to the local test server, and
// the vault adapter keeps files in memory.
const log = (window.__obsidian = { notices: [], modals: [], requests: [] });

export class Plugin {
	constructor(app, manifest) { this.app = app; this.manifest = manifest; this.views = {}; this.commands = []; this._data = null; }
	loadData() { return Promise.resolve(this._data); }
	saveData(d) { this._data = JSON.parse(JSON.stringify(d)); return Promise.resolve(); }
	registerView(type, factory) { this.views[type] = factory; }
	addRibbonIcon() {}
	addCommand(c) { this.commands.push(c); }
	registerEvent() {}
	addSettingTab(t) { this.settingTab = t; }
}

function decorate(el) {
	el.empty = function () { this.innerHTML = ""; };
	el.addClass = function (c) { this.classList.add(c); };
	el.setText = function (t) { this.textContent = t; };
	el.createDiv = function (o) { return this.createEl("div", o); };
	el.createEl = function (tag, o) { const e = createEl(tag, o); this.appendChild(e); return e; };
	return el;
}
window.createEl = function (tag, o = {}) {
	const e = decorate(document.createElement(tag));
	if (o.cls) e.className = o.cls;
	if (o.text) e.textContent = o.text;
	if (o.type) e.type = o.type;
	for (const [k, v] of Object.entries(o.attr || {})) e.setAttribute(k, v);
	return e;
};

export class ItemView { constructor(leaf) { this.leaf = leaf; this.contentEl = decorate(document.createElement("div")); } }
export class PluginSettingTab { constructor(app) { this.app = app; this.containerEl = decorate(document.createElement("div")); } }
export class Setting {
	setName() { return this; } setHeading() { return this; } setDesc() { return this; }
	addButton() { return this; } addToggle() { return this; } addText() { return this; }
}
export class Modal {
	constructor(app) { this.app = app; this.titleEl = decorate(document.createElement("div")); this.contentEl = decorate(document.createElement("div")); }
	open() { log.modals.push(this); this.onOpen(); }
	close() { if (this.onClose) this.onClose(); }
}
export class FuzzySuggestModal { constructor(app) { this.app = app; } setPlaceholder() {} open() {} }
export class Notice {
	constructor(m) { log.notices.push(m); }
	setMessage(m) { log.notices.push(m); return this; }
	hide() {}
}
export class TFile {}
export class WorkspaceLeaf {}
export function normalizePath(p) { return p.replace(/\/+/g, "/"); }
export function debounce(f) { const g = (...a) => f(...a); g.run = () => {}; g.cancel = () => g; return g; }

const ROUTES = [
	[/^https:\/\/api\.scryfall\.com\/bulk-data$/, "/fixtures/scryfall/bulk-data.json"],
	[/^https:\/\/data\.scryfall\.io\/default-cards\//, "/fixtures/scryfall/default_cards.jsonl.gz"],
	[/^https:\/\/data\.scryfall\.io\/oracle-tags\//, "/fixtures/scryfall/oracle_tags.jsonl.gz"],
];
export async function requestUrl(o) {
	log.requests.push(o.url);
	const route = ROUTES.find(([re]) => re.test(o.url));
	if (!route) throw new Error("Unexpected request in test: " + o.url);
	const r = await fetch(route[1]);
	if (!r.ok) throw new Error("HTTP " + r.status);
	const buf = await r.arrayBuffer();
	return { status: r.status, arrayBuffer: buf, get json() { return JSON.parse(new TextDecoder().decode(buf)); } };
}
