// Loads the whole plugin (src/main.ts) against a stubbed Obsidian API and in-memory vault,
// and walks through first launch, collection import and the Scryfall cache.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { startHarness } from "./harness.mjs";

let h, page;
before(async () => {
	h = await startHarness();
	page = await h.page();
	await page.goto(h.base + "/");
	await page.evaluate(async () => { window.P = await window.bootPlugin(); });
});
after(async () => { await h.close(); });

test("registers its commands and opens with no decks selected", async () => {
	const r = await page.evaluate(() => ({
		commands: P.plugin.commands.map((c) => c.id),
		picked: document.querySelectorAll(".mtg-overlap #pickbox option:checked").length,
	}));
	assert.deepEqual(r.commands.sort(), ["download-scryfall-data", "import-manabox-csv", "import-manabox-csv-vault", "open-deck-overlap", "open-extended-art-finder"]);
	assert.equal(r.picked, 0);
});

test("asks once on first launch to download Scryfall data", async () => {
	const r = await page.evaluate(() => ({ modals: window.__obsidian.modals.map((m) => m.titleEl.textContent), prompted: P.plugin.data.settings.bulkPrompted }));
	assert.deepEqual(r.modals, ["Download Scryfall card data?"]);
	assert.equal(r.prompted, true);
});

test("a ManaBox CSV import replaces the stored collection; a bad file keeps it", async () => {
	const r = await page.evaluate(async () => {
		const p = P.plugin;
		await p.importCsvText("Binder Name,Binder Type,Name,Set code,Collector number,Foil,Quantity\nA,binder,Champion of the Perished,mid,344,normal,3\nW,list,Boseiju Who Endures,NEO,501,normal,1\n", "one.csv");
		const first = [p.ownedCount("MID", "344"), p.ownedCount("NEO", "501")];
		await p.importCsvText('Name,Set code,Collector number,Quantity\n"Boseiju, Who Endures",NEO,501,2\n', "two.csv");
		const second = [p.ownedCount("MID", "344"), p.ownedCount("NEO", "501"), p.data.collection.fileName];
		await p.importCsvText("foo,bar\n1,2\n", "bad.csv");
		return { first, second, after: p.data.collection.fileName, note: document.querySelector(".mtg-eaf #collnote").textContent, last: window.__obsidian.notices.at(-1) };
	});
	assert.deepEqual(r.first, [3, 0]);
	assert.deepEqual(r.second, [0, 2, "two.csv"]);
	assert.equal(r.after, "two.csv");
	assert.match(r.note, /^2 cards \(1 unique name\) from two\.csv/);
	assert.match(r.last, /^Import failed: This does not look like a ManaBox CSV export/);
});

test("downloads and caches Scryfall bulk data, then uses it offline", async () => {
	const r = await page.evaluate(async () => {
		const p = P.plugin, log = window.__obsidian;
		log.requests.length = 0;
		await p.bulk.download();
		const first = { requests: log.requests.slice(), files: Object.keys(P.files).sort(), eadate: document.querySelector(".mtg-eaf #eadate").textContent };
		log.requests.length = 0;
		await p.bulk.download();
		const second = { requests: log.requests.slice(), last: log.notices.at(-1) };
		p.bulk.index = null;
		await p.bulk.load();
		return { first, second, reloaded: !!p.bulk.index, summary: p.bulk.summary() };
	});
	assert.equal(r.first.requests.length, 3);
	assert.deepEqual(r.first.files, [
		".obsidian/plugins/mtg-decks/cache/default_cards.jsonl.gz",
		".obsidian/plugins/mtg-decks/cache/index.json",
		".obsidian/plugins/mtg-decks/cache/oracle_tags.jsonl.gz",
	]);
	assert.match(r.first.eadate, /^your cached Scryfall data from /);
	assert.deepEqual(r.second.requests, ["https://api.scryfall.com/bulk-data"]);
	assert.equal(r.second.last, "Scryfall data is already up to date.");
	assert.equal(r.reloaded, true);
	assert.match(r.summary, /cards indexed/);
});

test("cached data fills card colors and substitute suggestions for a new deck", async () => {
	const r = await page.evaluate(() => {
		const ov = P.leaves["mtg-deck-overlap"][0].view.contentEl;
		const q = (id) => ov.querySelector(`[id="${id}"]`);
		q("mgrtoggle").click();
		q("lname").value = "Izzet test";
		q("lt").value = "4 Ragavan, Nimble Pilferer\n4 Counterspell\n4 Fable of the Mirror-Breaker\n4 Lightning Bolt\n44 Island";
		q("ladd").click();
		const sel = q("pickbox");
		[...sel.options].forEach((o, i) => { o.selected = i === 0 || o.textContent.startsWith("Izzet test"); });
		sel.dispatchEvent(new Event("change"));
		const rows = [...q("sbxbody").querySelectorAll("tr")].map((tr) => tr.innerText);
		return { unknown: q("infsum").textContent, counterspell: rows.find((t) => t.startsWith("Counterspell")) || "" };
	});
	assert.equal(r.unknown, "Every card in these lists has color info.");
	assert.match(r.counterspell, /from the cached Scryfall data/);
	assert.deepEqual(page.errors, []);
});
