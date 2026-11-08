# obsidian-mtg

An Obsidian plugin for organizing Magic cards and decks. It adds two views and a
collection import:

- **Deck overlap** compares decklists card by card: the overlap matrix, best sets of
  decks, color distribution, sideboard-only cards, tokens, counters, trial cards, the
  card checklist, card finder, sleeve marks, packages, substitutes and the fetch land
  optimizer. Pick decks in the multi-select box at the top. No deck is in the
  comparison when the view opens; pick two or more to start.
- **Extended art finder** rewrites a decklist to extended art printings (Scryfall frame
  effect `extendedart`) and lets you pick a printing when there is more than one.
  "Only printings I own" uses your imported ManaBox collection.
- **ManaBox collection import** reads a CSV exported from ManaBox and stores it with the
  plugin. Importing a new file replaces the stored collection.
- **Scryfall card data for offline use**: downloads Scryfall's Default Cards and Oracle
  Tags bulk files (about 87 MB) and caches them in the vault. The plugin offers this on
  first launch.

Both views are ports of the "Deck Overlap Matrix" and "Extended Art Finder" artifacts.
Their logic is unchanged, including the deck list, the JSON, TSV and checklist exports,
and the deck marker color associations (palette, color names and marking order).

## Install

The plugin is not in the Obsidian community plugin directory. Build it and copy three
files into your vault.

Requirements: Node.js 18 or newer and npm.

1. Build:

   ```sh
   git clone https://github.com/nrb/obsidian-mtg.git
   cd obsidian-mtg
   npm install
   npm run build
   ```

   This writes `main.js` next to `manifest.json` and `styles.css`.

2. Copy into your vault. Create the folder `<your vault>/.obsidian/plugins/mtg-decks/`
   and copy `main.js`, `manifest.json` and `styles.css` into it:

   ```sh
   VAULT="$HOME/Documents/MyVault"   # change to your vault's folder
   mkdir -p "$VAULT/.obsidian/plugins/mtg-decks"
   cp main.js manifest.json styles.css "$VAULT/.obsidian/plugins/mtg-decks/"
   ```

   The `.obsidian` folder is hidden. On macOS press Cmd+Shift+. in Finder to show it; on
   Windows turn on "Hidden items" in File Explorer's View menu.

3. Enable it. In Obsidian open **Settings → Community plugins**, turn off Restricted
   mode if it is on, click the reload icon next to "Installed plugins", and turn on
   **MTG Decks**.

To update, pull, run `npm run build` again, copy the three files over the old ones and
reload Obsidian (or turn the plugin off and on).

**Mobile:** the plugin works on Obsidian mobile. Copy the same folder into the vault on
the phone, for example through Obsidian Sync (with "Installed community plugins" sync
turned on), iCloud or another file sync, then enable it the same way.

**Development:** `npm run dev` rebuilds `main.js` on every change. Symlink the repository
folder to `<vault>/.obsidian/plugins/mtg-decks` to try changes directly.

## Use

Open the views from the ribbon icons or the command palette:

- `MTG Decks: Open deck overlap`
- `MTG Decks: Open extended art finder`

### Import your collection

1. In ManaBox, export your collection as CSV.
2. In Obsidian open **Settings → MTG Decks** and click **Choose file** (any file on
   disk) or **From vault** (a CSV you already put in the vault). The commands
   `Import ManaBox collection CSV from disk` and `... from vault` do the same.

The CSV needs the columns `Name`, `Set code`, `Collector number` and `Quantity`. Owned
copies are counted per set code and collector number, with all finishes, conditions and
languages added together. With **Leave out lists and wishlists** on (the default), rows
whose `Binder Type` is `list` or whose `Binder Name` contains "wish" are not counted.
Each new import replaces the previous collection completely.

### Scryfall card data (offline)

On first launch the plugin asks whether to download Scryfall's bulk data. You can also
use **Settings → MTG Decks → Scryfall card data → Download** or the command
`Download or update Scryfall card data`. It downloads two files from the
[Scryfall bulk data API](https://scryfall.com/docs/api/bulk-data):

- **Default Cards** (about 81 MB compressed): every card printing.
- **Oracle Tags** (about 6 MB compressed): Scryfall's functional tags.

Both are stored compressed in `.obsidian/plugins/mtg-decks/cache/`, along with a
`index.json` built from them (about 4 MB). Everything then works offline. **Update**
downloads only the files Scryfall has changed since the last download, and **Delete
cache** removes the folder. If the index is missing it is rebuilt from the cached files
without going online.

With the data cached:

- The extended art finder uses the cached printings and prices instead of the bundled
  snapshot from 7 Nov 2026.
- The deck overlap view fills in colors and double pips for cards the built-in card info
  doesn't cover, so decks you add are charted correctly. Your own edits under Card info
  still come first.
- The Substitutes tab lists off-color cards the built-in suggestions don't cover. For
  these it suggests Modern-legal black, green or colorless cards that share the most
  specific Scryfall oracle tags, and marks them as coming from the cached data. Cards
  already in your decks get a boost. These suggestions are generated by matching tags,
  so treat them as a starting point.

### Deck overlap

- **Pick decks:** select decks in the "Compare" box (Ctrl/Cmd or Shift click for several;
  on a phone, tap each). Selected decks also show as color chips; click a chip's × to
  remove it. **Select all** and **Clear** do what they say. The selection is not saved,
  so the view always opens with no decks selected.
- **Edit decklists** opens the editor: edit a deck, set its marker color and color name,
  add decks by pasting a list, loading .txt files, or **Add from current note** (uses the
  open note; if it has fenced code blocks, only their contents are read).
- **Export JSON** writes `mtg-decks.json` to the output folder in your vault (default
  `MTG`). **Copy JSON**, JSON import (replace or merge) and **Reset to built-in decks**
  work as in the artifact.
- **Card checklist:** **Copy** it, or **Save as note** to create a Markdown note with
  checkboxes in the output folder.
- **Copy as TSV** copies the matrix rows you are viewing.

Decks, card info, trial cards and your substitute notes are saved with the plugin in
`.obsidian/plugins/mtg-decks/data.json`.

### Extended art finder

Paste a list, **Load .txt**, or **Load current note**. Copy the rewritten list, copy only
the extended art lines, or **Save as note**. Your printing picks and last list are saved
with the plugin. The extended art printings are a Scryfall snapshot from 7 Nov 2026
bundled with the plugin.

## Development

- `npm run build` type-checks and builds `main.js`.
- `npm test` runs the CSV import tests.
- Source: `src/main.ts` (plugin, settings, commands), `src/collection.ts` (ManaBox CSV),
  `src/overlap/` and `src/extended-art/` (the ported views and their markup).
