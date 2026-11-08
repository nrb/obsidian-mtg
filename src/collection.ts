// ManaBox CSV collection import.
//
// ManaBox exports one row per printing/finish/condition with a header row. The columns
// this plugin reads are matched by header name (case-insensitive), so column order and
// extra columns do not matter:
//   Name, Set code, Collector number, Quantity            (required)
//   Foil, Scryfall ID, Binder Name, Binder Type, Language (optional)

export interface CollectionRow {
	name: string;
	set: string;
	cn: string;
	qty: number;
	foil: string;
	scryfallId: string;
	binder: string;
	binderType: string;
	language: string;
}

export interface StoredCollection {
	fileName: string;
	importedAt: string;
	rows: CollectionRow[];
}

export interface ImportResult {
	collection: StoredCollection;
	skippedLines: number;
}

/** RFC 4180 style CSV: quoted fields, doubled quotes, commas and newlines inside quotes. */
export function parseCsv(text: string): string[][] {
	const rows: string[][] = [];
	let row: string[] = [];
	let field = "";
	let quoted = false;
	if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
	for (let i = 0; i < text.length; i++) {
		const ch = text[i];
		if (quoted) {
			if (ch === '"') {
				if (text[i + 1] === '"') { field += '"'; i++; }
				else quoted = false;
			} else field += ch;
			continue;
		}
		if (ch === '"') quoted = true;
		else if (ch === ",") { row.push(field); field = ""; }
		else if (ch === "\n" || ch === "\r") {
			if (ch === "\r" && text[i + 1] === "\n") i++;
			row.push(field); field = "";
			rows.push(row); row = [];
		} else field += ch;
	}
	if (field !== "" || row.length) { row.push(field); rows.push(row); }
	return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

const REQUIRED = ["name", "set code", "collector number", "quantity"];

export function parseManaBoxCsv(text: string, fileName: string): ImportResult {
	const table = parseCsv(text);
	if (!table.length) throw new Error("The file is empty.");
	const header = table[0].map((h) => h.trim().toLowerCase());
	const col = (n: string) => header.indexOf(n);
	const missing = REQUIRED.filter((n) => col(n) < 0);
	if (missing.length) {
		throw new Error(
			"This does not look like a ManaBox CSV export. Missing column" +
				(missing.length > 1 ? "s: " : ": ") + missing.join(", ") + ".",
		);
	}
	const get = (r: string[], n: string) => { const i = col(n); return i >= 0 && i < r.length ? r[i].trim() : ""; };
	const rows: CollectionRow[] = [];
	let skippedLines = 0;
	for (const r of table.slice(1)) {
		const name = get(r, "name");
		const qty = parseInt(get(r, "quantity"), 10);
		if (!name || !isFinite(qty) || qty <= 0) { skippedLines++; continue; }
		rows.push({
			name,
			set: get(r, "set code").toUpperCase(),
			cn: get(r, "collector number"),
			qty,
			foil: get(r, "foil"),
			scryfallId: get(r, "scryfall id"),
			binder: get(r, "binder name"),
			binderType: get(r, "binder type"),
			language: get(r, "language"),
		});
	}
	return { collection: { fileName, importedAt: new Date().toISOString(), rows }, skippedLines };
}

/**
 * Rows that count as owned. With `skipWishlists`, rows in a ManaBox list (Binder Type
 * "list") or in a binder whose name contains "wish" are left out, matching the
 * artifact's "wishlists excluded" rule.
 */
export function ownedRows(c: StoredCollection | null, skipWishlists: boolean): CollectionRow[] {
	if (!c) return [];
	if (!skipWishlists) return c.rows;
	return c.rows.filter((r) => r.binderType.toLowerCase() !== "list" && !/wish/i.test(r.binder));
}

/** Owned copies keyed by "SET|collector number" (all finishes, conditions and languages summed). */
export function ownedByPrinting(rows: CollectionRow[]): Map<string, number> {
	const m = new Map<string, number>();
	for (const r of rows) {
		const k = r.set + "|" + r.cn;
		m.set(k, (m.get(k) || 0) + r.qty);
	}
	return m;
}

export function summarize(rows: CollectionRow[]) {
	const names = new Set<string>();
	let copies = 0;
	for (const r of rows) { names.add(r.name); copies += r.qty; }
	return { rows: rows.length, names: names.size, copies };
}
