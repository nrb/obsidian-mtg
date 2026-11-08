// Scryfall bulk data: which files to fetch, and how to turn them into the compact index
// the views use. The raw .jsonl.gz files are cached as downloaded; the index is rebuilt
// from them whenever it is missing or its format version changes.

export const BULK_TYPES = ["default_cards", "oracle_tags"] as const;
export type BulkType = (typeof BULK_TYPES)[number];
export const BULK_API = "https://api.scryfall.com/bulk-data";
export const INDEX_VERSION = 1;

export interface BulkInfo {
	type: string;
	updated_at: string;
	jsonl_download_uri?: string;
	compressed_size?: number;
}

/** [set code, collector number, release date, finishes (n/f/e), USD price] — the bundled snapshot's row format. */
export type EaRow = [string, string, string, string, string];

/**
 * Per card name: [color letters or "L", double-pip color, mana cost, off-color needs,
 * land flag, substitute candidate flag, tag ids].
 */
export type CardRow = [string, string, string, string, 0 | 1, 0 | 1, number[]];

export interface BulkIndex {
	v: number;
	builtAt: string;
	sources: Record<string, string>;
	sets: Record<string, string>;
	ea: Record<string, EaRow[]>;
	cards: Record<string, CardRow>;
	/** Front-face name -> full name for double-faced and split cards. */
	alias: Record<string, string>;
	tagNames: string[];
	tagSize: number[];
	/** Per tag: names of Modern-legal nonland cards castable with black, green or colorless mana. */
	tagCands: string[][];
}

// Card objects that are not playable cards in their own right.
const SKIP_LAYOUTS = new Set(["art_series", "token", "double_faced_token", "emblem", "vanguard", "scheme", "planar", "reversible_card"]);
const ORDER = "WUBRG";
// Tags too broad to say what a card does, and cosmetic ones (cycles, puns).
export const MAX_TAG_SIZE = 3000;
export function cosmeticTag(slug: string): boolean {
	return /^cycle-|^punny-|-pun$|-name$|^name-|^flavor-|^art-|^reprint|^meme$/.test(slug);
}

interface ScryCard {
	name: string;
	layout: string;
	oracle_id?: string;
	lang?: string;
	set: string;
	set_name: string;
	collector_number: string;
	released_at: string;
	frame_effects?: string[];
	finishes?: string[];
	prices?: Record<string, string | null>;
	mana_cost?: string;
	type_line?: string;
	colors?: string[];
	produced_mana?: string[];
	legalities?: Record<string, string>;
	card_faces?: { mana_cost?: string; type_line?: string; colors?: string[]; oracle_id?: string }[];
}

function symbols(cost: string): string[] {
	return Array.from(cost.matchAll(/\{([^}]+)\}/g), (m) => m[1]);
}

/** W/U/R a cost needs that black or green mana cannot pay ({2/W} and Phyrexian symbols can be paid without the color). */
export function offColorNeeds(cost: string): string {
	const need = new Set<string>();
	for (const s of symbols(cost)) {
		const parts = s.split("/");
		if (parts.some((p) => p === "B" || p === "G" || p === "P" || /^\d+$/.test(p))) continue;
		for (const p of parts) if ("WUR".includes(p)) need.add(p);
	}
	return "WUR".split("").filter((c) => need.has(c)).join("");
}

/** Castable with black, green and colorless mana only. */
export function castableBG(cost: string, colors: string[]): boolean {
	if (colors.some((c) => c !== "B" && c !== "G")) return false;
	return offColorNeeds(cost) === "";
}

export function cardRowOf(c: ScryCard): Omit<CardRow, 6> & { oracle?: string } {
	const f = (c.card_faces && c.card_faces[0]) || c;
	const type = f.type_line || c.type_line || "";
	const colors = f.colors || c.colors || [];
	const cost = (f.mana_cost != null ? f.mana_cost : c.mana_cost) || "";
	const land = /\bLand\b/.test(type);
	const col = land && !colors.length ? "L" : ORDER.split("").filter((x) => colors.includes(x)).join("");
	const cnt: Record<string, number> = {};
	for (const s of symbols(cost)) if (s.length === 1 && ORDER.includes(s)) cnt[s] = (cnt[s] || 0) + 1;
	// Double pips only matter for colors other than black (fetch land needs), as in the artifact.
	const dbl = "WURG".split("").find((x) => cnt[x] >= 2) || "";
	const need = land ? "WUR".split("").filter((x) => (c.produced_mana || []).includes(x)).join("") : offColorNeeds(cost);
	const cand = !land && c.legalities?.modern === "legal" && castableBG(cost, colors) ? 1 : 0;
	const row = [col, dbl, cost, need, land ? 1 : 0, cand] as unknown as Omit<CardRow, 6> & { oracle?: string };
	row.oracle = c.oracle_id || f.oracle_id;
	return row;
}

function cnKey(cn: string): [number, string] {
	const m = /^(\d+)/.exec(cn);
	return [m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER, cn];
}

/** Build the index from the lines of default-cards.jsonl and oracle-tags.jsonl. */
export async function buildIndex(
	defaultLines: AsyncIterable<string>,
	tagLines: AsyncIterable<string> | null,
	sources: Record<string, string>,
	progress?: (n: number) => void,
): Promise<BulkIndex> {
	const sets: Record<string, string> = {};
	const ea: Record<string, EaRow[]> = {};
	const cards: Record<string, CardRow> = {};
	const alias: Record<string, string> = {};
	const byOracle = new Map<string, string>();
	let n = 0;
	for await (const line of defaultLines) {
		if (!line.trim()) continue;
		const c = JSON.parse(line) as ScryCard;
		if (++n % 5000 === 0 && progress) progress(n);
		if (SKIP_LAYOUTS.has(c.layout)) continue;
		if ((c.frame_effects || []).includes("extendedart")) {
			const set = c.set.toUpperCase();
			sets[set] = c.set_name;
			const fin = (c.finishes || []).map((x) => ({ nonfoil: "n", foil: "f", etched: "e" } as Record<string, string>)[x] || "").join("");
			const p = c.prices || {};
			(ea[c.name] = ea[c.name] || []).push([set, c.collector_number, c.released_at, fin, p.usd || p.usd_foil || p.usd_etched || ""]);
		}
		if (!cards[c.name]) {
			const r = cardRowOf(c);
			const oracle = r.oracle;
			delete r.oracle;
			cards[c.name] = [...(r as unknown as unknown[]), []] as unknown as CardRow;
			if (oracle) byOracle.set(oracle, c.name);
			const front = c.name.split(" // ")[0];
			if (front !== c.name && !alias[front]) alias[front] = c.name;
		}
	}
	for (const k of Object.keys(ea)) {
		ea[k].sort((a, b) => b[2].localeCompare(a[2]) || a[0].localeCompare(b[0]) || cnKey(a[1])[0] - cnKey(b[1])[0] || a[1].localeCompare(b[1]));
	}

	const tagNames: string[] = [], tagSize: number[] = [], tagCands: string[][] = [];
	if (tagLines) {
		for await (const line of tagLines) {
			if (!line.trim()) continue;
			const t = JSON.parse(line) as { slug: string; taggings?: { oracle_id: string }[] };
			const members = (t.taggings || []).map((x) => byOracle.get(x.oracle_id)).filter((x): x is string => !!x);
			if (!members.length || members.length > MAX_TAG_SIZE || cosmeticTag(t.slug)) continue;
			const id = tagNames.length;
			tagNames.push(t.slug);
			tagSize.push(members.length);
			tagCands.push(members.filter((m) => cards[m][5] === 1));
			for (const m of members) cards[m][6].push(id);
		}
	}
	return { v: INDEX_VERSION, builtAt: new Date().toISOString(), sources, sets, ea, cards, alias, tagNames, tagSize, tagCands };
}

/** Lines of a gzipped JSONL buffer, decompressed as a stream. */
export async function* gzipLines(buf: ArrayBuffer): AsyncGenerator<string> {
	const stream = new Blob([buf]).stream().pipeThrough(new DecompressionStream("gzip")).pipeThrough(new TextDecoderStream());
	const reader = stream.getReader();
	let rest = "";
	for (;;) {
		const { value, done } = await reader.read();
		if (done) break;
		rest += value;
		let i: number;
		while ((i = rest.indexOf("\n")) >= 0) {
			yield rest.slice(0, i);
			rest = rest.slice(i + 1);
		}
	}
	if (rest) yield rest;
}

// ---- Lookups used by the views ----

export function lookup(ix: BulkIndex, name: string): CardRow | null {
	return ix.cards[name] || (ix.alias[name] && ix.cards[ix.alias[name]]) || null;
}

/** Card info in the overlap view's format: { c: colors or "L", d: double pip, k: counters }. */
export function cardInfo(ix: BulkIndex, name: string): { c: string; d: string; k: string[] } | null {
	const r = lookup(ix, name);
	return r ? { c: r[0], d: r[1], k: [] } : null;
}

/**
 * Off-color entry in the overlap view's OFFCOLOR format, built from the cached tags:
 * c = colors needed, l = land, t = the card's most specific tags, s = [name, mana cost]
 * of up to five Modern-legal black/green/colorless cards sharing those tags, cards in
 * by how specific the shared tags are, with a 1.5x boost for cards already in `pool`.
 */
export function offColorEntry(ix: BulkIndex, name: string, pool: Record<string, unknown>) {
	const r = lookup(ix, name);
	if (!r || !r[3]) return null;
	if (r[4]) return { c: r[3], l: 1, auto: 1 };
	const own = r[6].slice().sort((a, b) => ix.tagSize[a] - ix.tagSize[b]);
	const score = new Map<string, number>();
	for (const t of own) {
		const w = 1 / Math.log2(ix.tagSize[t] + 1);
		for (const m of ix.tagCands[t]) if (m !== name) score.set(m, (score.get(m) || 0) + w);
	}
	const boosted = (e: [string, number]) => e[1] * (pool[e[0]] ? 1.5 : 1);
	const s = [...score.entries()]
		.sort((a, b) => boosted(b) - boosted(a) || a[0].localeCompare(b[0]))
		.slice(0, 5)
		.map(([n]) => [n, ix.cards[n][2]]);
	return { c: r[3], l: 0, t: own.slice(0, 6).map((t) => ix.tagNames[t]), s, auto: 1 };
}
