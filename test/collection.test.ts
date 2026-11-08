import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCsv, parseManaBoxCsv, ownedRows, ownedByPrinting, summarize } from "../src/collection.ts";

const CSV = [
	"Binder Name,Binder Type,Name,Set code,Set name,Collector number,Foil,Rarity,Quantity,ManaBox ID,Scryfall ID,Purchase price,Misprint,Altered,Condition,Language,Purchase price currency",
	'Main,binder,"Agadeem\'s Awakening // Agadeem, the Undercrypt",znr,Zendikar Rising,336,normal,mythic,1,1,abc,10.00,false,false,near_mint,en,USD',
	"Main,binder,Thoughtseize,2xm,Double Masters,107,normal,rare,2,2,def,1,false,false,near_mint,en,USD",
	"Main,binder,Thoughtseize,2XM,Double Masters,107,foil,rare,1,3,def,1,false,false,near_mint,en,USD",
	"Wants,list,Psychic Frog,MH3,Modern Horizons 3,199,normal,rare,4,4,ghi,1,false,false,near_mint,en,USD",
	"My wishlist,binder,Fatal Push,AER,Aether Revolt,57,normal,uncommon,3,5,jkl,1,false,false,near_mint,en,USD",
	"Main,binder,,,,,,,,,,,,,,,",
	"",
].join("\r\n");

test("parseCsv handles quotes, doubled quotes and embedded commas/newlines", () => {
	assert.deepEqual(parseCsv('a,"b,c","d ""e""",\n"x\ny",z\n'), [["a", "b,c", 'd "e"', ""], ["x\ny", "z"]]);
});

test("parseManaBoxCsv reads rows by header name and upper-cases set codes", () => {
	const { collection, skippedLines } = parseManaBoxCsv(CSV, "export.csv");
	assert.equal(collection.rows.length, 5);
	assert.equal(skippedLines, 1);
	assert.equal(collection.rows[0].name, "Agadeem's Awakening // Agadeem, the Undercrypt");
	assert.equal(collection.rows[0].set, "ZNR");
	assert.equal(collection.fileName, "export.csv");
});

test("owned counts sum finishes per printing and skip lists and wishlists", () => {
	const { collection } = parseManaBoxCsv(CSV, "export.csv");
	const owned = ownedByPrinting(ownedRows(collection, true));
	assert.equal(owned.get("2XM|107"), 3);
	assert.equal(owned.get("MH3|199"), undefined);
	assert.equal(owned.get("AER|57"), undefined);
	const all = ownedByPrinting(ownedRows(collection, false));
	assert.equal(all.get("MH3|199"), 4);
	assert.deepEqual(summarize(ownedRows(collection, true)), { rows: 3, names: 2, copies: 4 });
});

test("rejects files without the ManaBox columns", () => {
	assert.throws(() => parseManaBoxCsv("Card,Count\nThoughtseize,4\n", "x.csv"), /Missing columns: name, set code, collector number, quantity/);
});
