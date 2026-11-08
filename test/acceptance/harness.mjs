// Shared setup for the browser acceptance tests: bundles the sources, serves them with the
// fixtures over local HTTP, and launches Chromium through Playwright.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";
import { chromium } from "playwright";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(HERE, "..", "..");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".gz": "application/gzip" };

const PAGE = `<!doctype html><html><head><meta charset="utf-8">
<style>body{--font-interface:sans-serif;--font-monospace:monospace;margin:0}</style>
<link rel="stylesheet" href="/styles.css"></head>
<body class="theme-light"><div class="mtg-view" id="root"></div><script src="/bundle.js"></script></body></html>`;

export async function startHarness() {
	const built = await esbuild.build({
		entryPoints: [join(HERE, "entries.js")],
		bundle: true, write: false, format: "iife", target: "es2020",
		loader: { ".html": "text", ".txt": "text" },
		alias: { obsidian: join(HERE, "obsidian-stub.js") },
		logLevel: "silent",
	});
	const bundle = built.outputFiles[0].contents;
	const server = createServer(async (req, res) => {
		const url = new URL(req.url, "http://x");
		try {
			let body, type;
			if (url.pathname === "/" || url.pathname === "/index.html") { body = PAGE; type = TYPES[".html"]; }
			else if (url.pathname === "/bundle.js") { body = bundle; type = TYPES[".js"]; }
			else if (url.pathname === "/styles.css") { body = await readFile(join(ROOT, "styles.css")); type = TYPES[".css"]; }
			else if (url.pathname.startsWith("/fixtures/")) {
				const p = normalize(join(HERE, url.pathname));
				if (!p.startsWith(join(HERE, "fixtures"))) throw new Error("bad path");
				body = await readFile(p); type = TYPES[extname(p)] || "application/octet-stream";
			} else { res.writeHead(404); res.end(); return; }
			res.writeHead(200, { "content-type": type }); res.end(body);
		} catch { res.writeHead(404); res.end(); }
	});
	await new Promise((r) => server.listen(0, "127.0.0.1", r));
	const base = `http://127.0.0.1:${server.address().port}`;
	const browser = await chromium.launch();
	const context = await browser.newContext({ viewport: { width: 1200, height: 900 } });
	await context.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
	return {
		base,
		async page() {
			const page = await context.newPage();
			page.errors = [];
			page.on("pageerror", (e) => page.errors.push(e.message));
			page.on("console", (m) => { if (m.type() === "error" && !/fonts\.g/.test(m.text()) && !/ERR_FAILED/.test(m.text())) page.errors.push(m.text()); });
			return page;
		},
		async close() { await browser.close(); server.close(); },
	};
}
