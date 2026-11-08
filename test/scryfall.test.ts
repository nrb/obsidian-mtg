import { test } from "node:test";
import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import { buildIndex, castableBG, cardInfo, gzipLines, offColorEntry, offColorNeeds } from "../src/scryfall.ts";

test("offColorNeeds ignores black/green hybrids, {2/W} and Phyrexian symbols", () => {
	assert.equal(offColorNeeds("{1}{U}{U}"), "U");
	assert.equal(offColorNeeds("{B/R}{B/R}{B/R}"), "");
	assert.equal(offColorNeeds("{W/U}"), "WU");
	assert.equal(offColorNeeds("{2/W}{U/P}"), "");
	assert.equal(offColorNeeds("{R}{W}{1}"), "WR");
	assert.equal(castableBG("{1}{G/U}", ["G", "U"]), false);
	assert.equal(castableBG("{2}{B}{G}", ["B", "G"]), true);
});

const card = (o: Record<string, unknown>) => JSON.stringify({ layout: "normal", set: "tst", set_name: "Test Set", collector_number: "1", released_at: "2026-01-01", legalities: { modern: "legal" }, prices: {}, colors: [], ...o });

async function* lines(arr: string[]) { for (const l of arr) yield l; }

test("buildIndex collects extended art printings, card colors and tag candidates", async () => {
	const def = [
		card({ name: "Blue Thing", oracle_id: "o1", mana_cost: "{U}{U}", colors: ["U"], type_line: "Instant", frame_effects: ["extendedart"], collector_number: "301", finishes: ["nonfoil", "foil"], prices: { usd: "1.50" } }),
		card({ name: "Blue Thing", oracle_id: "o1", mana_cost: "{U}{U}", colors: ["U"], type_line: "Instant", collector_number: "12" }),
		card({ name: "Black Thing", oracle_id: "o2", mana_cost: "{1}{B}", colors: ["B"], type_line: "Instant" }),
		card({ name: "Banned Thing", oracle_id: "o3", mana_cost: "{B}", colors: ["B"], type_line: "Instant", legalities: { modern: "banned" } }),
		card({ name: "Island Land", oracle_id: "o4", type_line: "Land", produced_mana: ["U"] }),
		card({ name: "Front // Back", oracle_id: "o5", card_faces: [{ mana_cost: "{G}", type_line: "Creature", colors: ["G"] }, { mana_cost: "", type_line: "Land" }] }),
		card({ name: "Blue Thing", layout: "art_series", oracle_id: "o9" }),
		"",
	];
	const tags = [
		JSON.stringify({ slug: "counterspell", taggings: [{ oracle_id: "o1" }, { oracle_id: "o2" }, { oracle_id: "o3" }] }),
		JSON.stringify({ slug: "cycle-test", taggings: [{ oracle_id: "o1" }, { oracle_id: "o2" }] }),
	];
	const ix = await buildIndex(lines(def), lines(tags), { default_cards: "2026-11-08" });
	assert.deepEqual(ix.ea["Blue Thing"], [["TST", "301", "2026-01-01", "nf", "1.50"]]);
	assert.equal(ix.sets.TST, "Test Set");
	assert.deepEqual(cardInfo(ix, "Blue Thing"), { c: "U", d: "U", k: [] });
	assert.deepEqual(cardInfo(ix, "Island Land"), { c: "L", d: "", k: [] });
	assert.deepEqual(cardInfo(ix, "Front"), { c: "G", d: "", k: [] });
	assert.deepEqual(ix.tagNames, ["counterspell"]);
	assert.deepEqual(ix.tagCands[0], ["Black Thing"]);
	assert.deepEqual(offColorEntry(ix, "Blue Thing", {}), { c: "U", l: 0, t: ["counterspell"], s: [["Black Thing", "{1}{B}"]], auto: 1 });
	assert.deepEqual(offColorEntry(ix, "Island Land", {}), { c: "U", l: 1, auto: 1 });
	assert.equal(offColorEntry(ix, "Black Thing", {}), null);
});

test("gzipLines streams lines out of a gzipped buffer", async () => {
	const gz = gzipSync(Buffer.from("a\nbb\n\nccc"));
	const out: string[] = [];
	for await (const l of gzipLines(gz.buffer.slice(gz.byteOffset, gz.byteOffset + gz.byteLength))) out.push(l);
	assert.deepEqual(out, ["a", "bb", "", "ccc"]);
});
