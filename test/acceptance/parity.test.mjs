// The ported views must render exactly what the original artifacts render for the same
// input. Each test loads the artifact (fixtures/artifacts) and the port side by side.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { startHarness } from "./harness.mjs";

let h;
before(async () => { h = await startHarness(); });
after(async () => { await h.close(); });

const OVERLAP_SECTIONS = ["body", "foot", "poolbody", "tiles", "mbody", "mtbody", "pkbody", "sbbody", "tokbody", "cntbody",
	"sbxdecks", "fgbody", "sbxbody", "obody", "opool", "chartdecks", "chartpools", "trbody"];

function snapOverlap(page) {
	return page.evaluate((ids) => {
		const q = (id) => document.querySelector(`[id="${id}"]`);
		const o = {};
		for (const id of ids) o[id] = q(id) ? q(id).innerText : null;
		o.cltext = q("cltext").value;
		return o;
	}, OVERLAP_SECTIONS);
}

async function mountOverlapPort(page) {
	await page.goto(h.base + "/");
	await page.evaluate(() => {
		window.store = null; window.files = {};
		const r = document.getElementById("root");
		r.className = "mtg-overlap";
		r.innerHTML = T.overlapTemplate;
		T.mountOverlap(r, {
			load: () => window.store, save: (v) => { window.store = v; },
			saveFile: (n, d) => { window.files[n] = d; return Promise.resolve("MTG/" + n); },
			saveNote: () => Promise.resolve("MTG/note.md"),
			readActiveNote: () => Promise.resolve(null),
			owned: () => 0, collectionNote: () => "",
		});
	});
}

async function pickPort(page, names) {
	await page.evaluate((names) => {
		const sel = document.getElementById("pickbox");
		for (const o of sel.options) o.selected = names.some((n) => o.textContent === n || o.textContent.startsWith(n + " · "));
		sel.dispatchEvent(new Event("change"));
	}, names);
}

test("deck overlap: starts with no decks selected", async () => {
	const port = await h.page();
	await mountOverlapPort(port);
	assert.equal(await port.locator("#pickbox option:checked").count(), 0);
	assert.ok((await port.locator("#pickbox option").count()) >= 12);
	assert.match(await port.locator("#app").innerText(), /No decks are in the comparison yet/);
	assert.deepEqual(port.errors, []);
});

test("deck overlap: same output as the artifact for the same decks, and the same export", async () => {
	const orig = await h.page();
	await orig.goto(h.base + "/fixtures/artifacts/deck-overlap-matrix.html");
	const port = await h.page();
	await mountOverlapPort(port);

	const all = await orig.$$eval("#picker button", (bs) => bs.map((b) => b.textContent));
	const def = await orig.$$eval('#picker button[aria-pressed="true"]', (bs) => bs.map((b) => b.textContent));

	await pickPort(port, def);
	assert.deepEqual(await snapOverlap(port), await snapOverlap(orig), "artifact's default selection");

	await orig.click("#pickall"); await port.click("#pickall");
	assert.deepEqual(await snapOverlap(port), await snapOverlap(orig), "all decks");

	for (let i = all.length - 1; i >= 2; i--) await orig.click(`#picker button[data-pick="${i}"]`);
	await pickPort(port, all.slice(0, 2));
	assert.deepEqual(await snapOverlap(port), await snapOverlap(orig), "first two decks");

	await orig.click('#clfmt button[data-fmt="plain"]'); await port.click('#clfmt button[data-fmt="plain"]');
	assert.equal(await port.$eval("#cltext", (t) => t.value), await orig.$eval("#cltext", (t) => t.value), "plain checklist");

	await orig.click("#mgrtoggle"); await orig.click("#mexp");
	await port.click("#mgrtoggle"); await port.click("#mexp");
	await port.waitForFunction(() => window.files["mtg-decks.json"]);
	const strip = (j) => ({ ...j, decks: j.decks.map((d) => ({ ...d, on: undefined })) });
	const exported = JSON.parse(await port.evaluate(() => window.files["mtg-decks.json"]));
	assert.deepEqual(strip(exported), strip(JSON.parse(await orig.$eval("#ij", (t) => t.value))), "export JSON (selection flags aside)");

	assert.deepEqual(orig.errors, []);
	assert.deepEqual(port.errors, []);
});

test("extended art finder: same rewrite, picks and owned filter as the artifact", async () => {
	const orig = await h.page();
	await orig.goto(h.base + "/fixtures/artifacts/extended-art-finder.html");
	const owned = await orig.evaluate(() => {
		const m = {};
		for (const n in DATA.cards) for (const o of DATA.cards[n]) if (o[5]) m[o[0] + "|" + o[1]] = o[5];
		return m;
	});
	const port = await h.page();
	await port.goto(h.base + "/");
	await port.evaluate((owned) => {
		window.store = null;
		const r = document.getElementById("root");
		r.className = "mtg-eaf";
		r.innerHTML = T.extendedArtTemplate;
		T.mountExtendedArt(r, {
			load: () => window.store, save: (v) => { window.store = v; },
			owned: (s, c) => owned[s.toUpperCase() + "|" + c] || 0, collectionNote: () => "",
			saveNote: () => Promise.resolve("x"), readActiveNote: () => Promise.resolve(null),
		});
	}, owned);
	const snap = (p) => p.evaluate(() => Object.fromEntries(["out", "need", "auto", "summary", "none"].map((id) => {
		const e = document.getElementById(id);
		return [id, id === "out" ? e.value : e.innerText];
	})));
	assert.deepEqual(await snap(port), await snap(orig), "sample list");
	const names = await orig.$$eval("#need input[type=radio]", (xs) => [...new Set(xs.map((x) => x.name))]);
	for (const n of names) {
		await orig.click(`#need input[name="${n}"] >> nth=0`, { force: true });
		await port.click(`#need input[name="${n}"] >> nth=0`, { force: true });
	}
	assert.deepEqual(await snap(port), await snap(orig), "after picking printings");
	await orig.check("#owned"); await port.check("#owned");
	assert.deepEqual(await snap(port), await snap(orig), "only printings I own");
	assert.deepEqual(port.errors, []);
});
