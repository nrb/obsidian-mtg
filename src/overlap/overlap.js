// Ported from the "Deck Overlap Matrix" artifact. Logic is kept as-is; only storage,
// deck picking, file export and DOM scoping were adapted for Obsidian.
/* eslint-disable */
export function mountOverlap(root, host) {
  var BASE_DATA = [["Swamp",[1,0],[2,0],[3,0],[1,0],[2,0],[5,0],[3,0],[4,0],[2,0],[3,0],[3,0],[4,0]],["Thoughtseize",[0,3],[4,0],[4,0],[3,0],[4,0],[4,0],[0,0],[0,0],[4,0],[4,0],[4,0],[0,3]],["Polluted Delta",[0,0],[4,0],[0,0],[4,0],[1,0],[4,0],[0,0],[4,0],[4,0],[4,0],[0,0],[0,0]],["Break the Ice",[0,0],[0,1],[0,0],[0,3],[0,0],[0,3],[0,2],[0,0],[0,1],[0,3],[0,0],[0,0]],["Consign to Memory",[0,0],[0,4],[0,0],[0,3],[0,0],[0,0],[0,3],[0,4],[0,4],[0,4],[0,0],[0,0]],["Fatal Push",[0,3],[3,0],[0,0],[0,0],[1,1],[4,0],[0,2],[0,0],[0,0],[2,0],[0,0],[0,0]],["Surgical Extraction",[0,0],[0,1],[0,2],[0,0],[0,1],[0,2],[0,0],[0,0],[0,3],[0,2],[0,0],[0,0]],["Watery Grave",[0,0],[2,0],[0,0],[1,0],[0,0],[0,0],[1,0],[1,0],[2,0],[2,0],[0,0],[0,0]],["Overgrown Tomb",[3,0],[0,0],[2,0],[0,0],[0,0],[2,0],[2,0],[0,0],[2,0],[0,0],[4,0],[2,0]],["Verdant Catacombs",[4,0],[0,0],[3,0],[0,0],[0,0],[3,0],[4,0],[0,0],[4,0],[0,0],[4,0],[4,0]],["Bloodstained Mire",[0,0],[4,0],[4,0],[0,0],[4,0],[0,0],[4,0],[4,0],[0,0],[4,0],[3,0],[0,0]],["Island",[0,0],[1,0],[0,0],[1,0],[0,0],[0,0],[0,0],[0,0],[2,0],[3,0],[0,0],[0,0]],["Psychic Frog",[0,0],[4,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[4,0],[4,0],[0,0],[0,0]],["Undercity Sewers",[0,0],[1,0],[0,0],[1,0],[0,0],[0,0],[0,0],[0,0],[2,0],[1,0],[0,0],[0,0]],["Dark Matter Manipulator",[0,0],[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[4,0],[4,0],[0,0],[0,0]],["End of the Hunt",[0,0],[0,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,1],[0,1],[0,0],[0,0]],["Mishra's Bauble",[0,0],[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[4,0],[4,0],[0,0],[0,0]],["Moonshadow",[0,0],[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[4,0],[4,0],[4,0],[0,0]],["Nethergoyf",[0,0],[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[4,0],[4,0],[0,0],[0,0]],["Orcish Bowmasters",[0,0],[0,0],[0,0],[0,0],[0,0],[3,0],[4,0],[0,0],[0,0],[4,0],[0,0],[3,0]],["Street Wraith",[0,0],[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[4,0],[4,0],[0,0],[0,0]],["Blood Crypt",[0,0],[1,0],[0,0],[0,0],[3,0],[0,0],[0,0],[2,0],[0,0],[2,0],[0,0],[0,0]],["Malevolent Rumble",[4,0],[0,0],[4,0],[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Mystical Dispute",[0,0],[0,2],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,1],[0,0],[0,0]],["Nameless Inversion",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[3,0],[2,0],[0,0],[0,0]],["Sheoldred's Edict",[0,0],[0,0],[0,0],[0,0],[0,0],[0,2],[0,0],[0,0],[0,0],[0,1],[0,0],[0,0]],["Thought Scour",[0,0],[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[4,0],[1,0],[0,0],[0,0]],["Underground Mortuary",[1,0],[0,0],[2,0],[0,0],[0,0],[2,0],[1,0],[0,0],[0,0],[0,0],[1,0],[1,0]],["Culling Ritual",[0,0],[0,0],[0,4],[0,0],[0,0],[0,2],[0,1],[0,0],[0,0],[0,0],[0,0],[0,1]],["Flare of Malice",[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[4,0],[4,0],[0,0],[0,0],[4,0],[4,0]],["Force of Despair",[0,0],[0,0],[0,0],[0,0],[0,0],[2,1],[0,1],[4,0],[0,0],[0,0],[0,1],[0,1]],["Forest",[2,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[1,0],[0,0],[0,0],[0,0]],["Gravecrawler",[0,0],[0,0],[3,0],[0,0],[0,0],[0,0],[3,0],[4,0],[0,0],[0,0],[3,0],[0,0]],["Meltdown",[0,0],[0,1],[0,0],[0,0],[0,2],[0,0],[0,0],[0,0],[0,0],[0,1],[0,0],[0,0]],["Otherworldly Gaze",[0,0],[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[3,0],[0,0],[0,0],[0,0]],["Phoenix Fleet Airship",[0,0],[0,0],[0,3],[0,0],[0,0],[0,0],[4,0],[0,3],[0,0],[0,0],[0,0],[0,0]],["Phyrexian Tower",[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[3,0],[2,0],[0,0],[0,0],[3,0],[4,0]],["Raucous Theater",[0,0],[1,0],[0,0],[0,0],[2,0],[0,0],[0,0],[1,0],[0,0],[0,0],[0,0],[0,0]],["Requiting Hex",[0,0],[0,0],[0,0],[0,0],[0,0],[0,2],[0,0],[0,0],[0,0],[0,1],[0,0],[0,0]],["Shambling Ghast",[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[4,0],[4,0],[0,0],[0,0],[0,0],[0,0]],["Spymaster's Vault",[3,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[3,0],[0,0],[0,0],[0,0],[2,0]],["Unholy Heat",[0,0],[1,0],[0,0],[0,0],[2,0],[0,0],[0,0],[0,0],[0,0],[1,0],[0,0],[0,0]],["Witherbloom Charm",[0,0],[0,0],[0,0],[0,0],[0,0],[2,0],[0,0],[0,0],[0,2],[0,0],[0,0],[0,0]],["Archon of Cruelty",[0,0],[4,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[4,0]],["Ashiok, Dream Render",[0,0],[0,0],[0,0],[0,0],[0,0],[0,1],[0,1],[0,0],[0,0],[0,0],[0,0],[0,0]],["Assassin's Trophy",[0,0],[0,0],[0,0],[0,0],[0,0],[2,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,1]],["Boggart Trawler",[0,0],[0,0],[0,0],[0,0],[0,0],[4,0],[4,0],[0,0],[0,0],[0,0],[0,0],[3,0]],["Dauthi Voidwalker",[0,0],[0,0],[0,0],[0,0],[0,0],[3,1],[0,0],[0,0],[0,0],[0,0],[0,2],[0,1]],["Emperor of Bones",[0,0],[4,0],[0,0],[3,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[4,0]],["Faithless Looting",[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[3,0],[0,0],[0,0]],["Inquisition of Kozilek",[0,0],[2,0],[0,0],[0,0],[0,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Marionette Apprentice",[0,0],[0,0],[3,0],[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Marsh Flats",[0,0],[0,0],[0,0],[4,0],[3,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Nihil Spellbomb",[0,0],[0,0],[0,0],[0,0],[1,1],[0,0],[0,0],[0,0],[0,1],[0,0],[0,0],[0,0]],["Persist",[0,0],[4,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[4,0]],["Pyroclasm",[0,0],[0,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,1],[0,0],[0,0]],["Rotten Reunion",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[2,0],[4,0],[0,0],[0,0],[0,0],[0,0]],["Sephiroth, Fabled SOLDIER",[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[1,0],[0,0],[0,0],[0,0],[0,0]],["Vexing Bauble",[0,2],[0,0],[0,0],[0,0],[0,0],[0,0],[0,3],[0,0],[0,0],[0,0],[0,2],[0,0]],["Warren Soultrader",[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Abhorrent Oculus",[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Agatha's Soul Cauldron",[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Avengers Disassembled",[0,0],[0,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Badgermole Cub",[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Blood Moon",[0,0],[0,0],[0,0],[0,0],[1,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Bone Shards",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[1,0],[0,0],[0,0],[1,0]],["Boseiju, Who Endures",[2,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[1,0],[0,0]],["Buried Alive",[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Carrion Feeder",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[2,0],[0,0]],["Champion of the Perished",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0]],["Chthonian Nightmare",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[1,0],[0,0],[0,0],[0,0],[0,0],[1,0]],["Clarion Conqueror",[0,0],[0,0],[0,0],[0,2],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Cling to Dust",[0,0],[0,0],[0,0],[0,0],[0,0],[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Crime // Punishment",[0,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Cryptbreaker",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0]],["Dai Li Indoctrination",[0,0],[0,0],[0,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,1]],["Damping Sphere",[0,0],[0,2],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,2],[0,0]],["Darklight Phoenix",[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[4,0]],["Deathcap Glade",[0,0],[0,0],[0,0],[0,0],[0,0],[2,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Decorum Dissertation",[0,0],[0,0],[0,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,1]],["Delighted Halfling",[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Detective's Phoenix",[0,0],[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Dredger's Insight",[3,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Dress Down",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,1],[0,0],[0,0],[0,0]],["Dryad Arbor",[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Endurance",[1,2],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Ephemerate",[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Eyetwitch",[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[4,0]],["Faithful Mending",[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Fear of Missing Out",[0,0],[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Fell the Profane",[0,0],[0,0],[0,0],[0,0],[0,0],[2,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Flooded Strand",[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Force of Negation",[0,0],[0,0],[0,0],[0,3],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Force of Vigor",[0,2],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Formidable Speaker",[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Forsaken Miner",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,3],[0,0],[0,0],[0,0],[0,0]],["Fulminator Mage",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,2],[0,0],[0,0],[0,0]],["Glistening Deluge",[0,0],[0,0],[0,0],[0,0],[0,2],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Goblin Bombardment",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0]],["Godless Shrine",[0,0],[0,0],[0,0],[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Grafdigger's Cage",[0,0],[0,0],[0,0],[0,0],[0,2],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Green Sun's Zenith",[3,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Grist, the Hunger Tide",[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,1],[0,0]],["Hallowed Fountain",[0,0],[0,0],[0,0],[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Haywire Mite",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,2],[0,0],[0,0],[0,0],[0,0],[0,0]],["Ingot Chewer",[0,0],[0,0],[0,0],[0,0],[0,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Lightning Bolt",[0,0],[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Liliana, Untouched by Death",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[2,0],[0,0],[0,0],[0,0],[0,0]],["March of Wretched Sorrow",[0,0],[0,0],[0,0],[0,0],[0,0],[3,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Meticulous Archive",[0,0],[0,0],[0,0],[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Mountain",[0,0],[0,0],[0,0],[0,0],[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Necrodominance",[0,0],[0,0],[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Obsidian Charmaw",[0,0],[0,0],[0,0],[0,0],[0,3],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Origin of Metalbending",[0,0],[0,0],[0,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,1]],["Ouroboroid",[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Outland Liberator",[0,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Overlord of the Balemurk",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[2,0],[0,0],[0,0],[0,0],[4,0],[4,0]],["Ozai's Cruelty",[0,0],[0,0],[0,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,1]],["Plains",[0,0],[0,0],[0,0],[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Prismatic Ending",[0,0],[0,0],[0,0],[3,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Professor Dellian Fel",[0,0],[0,0],[0,0],[0,0],[0,0],[2,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Quantum Riddler",[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Ruinous Waterbending",[0,0],[0,0],[0,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,1]],["Shadowy Backstreet",[0,0],[0,0],[0,0],[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Sheoldred, the Apocalypse",[0,0],[0,0],[0,0],[0,0],[0,0],[2,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Shipwreck Marsh",[0,0],[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Solitude",[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Soul Spike",[0,0],[0,0],[0,0],[0,0],[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Soulless Jailer",[0,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Spell Pierce",[0,0],[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Spell Snare",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[2,0],[0,0],[0,0],[0,0]],["Steam Vents",[0,0],[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Strangleroot Geist",[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Teferi, Time Raveler",[0,0],[0,0],[0,0],[2,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["The Sackville-Bagginses",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[2,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Thorn of Amethyst",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,4],[0,0],[0,0],[0,0],[0,0]],["Thundering Falls",[0,0],[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Toxic Deluge",[0,0],[0,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Troll of Khazad-dûm",[0,0],[0,0],[0,0],[0,0],[2,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["True Ancestry",[0,0],[0,0],[0,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,1]],["Unearth",[0,0],[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Vile Rebirth",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,1],[0,0],[0,0],[0,0],[0,0]],["Walking Ballista",[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Windswept Heath",[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Wooded Foothills",[0,0],[0,0],[0,0],[0,0],[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Wrath of the Skies",[0,0],[0,0],[0,0],[0,4],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Yawgmoth, Thran Physician",[3,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Young Wolf",[4,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],["Mabel, Bitter Recluse",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[1,0],[0,0]],["Stitcher's Supplier",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[4,0],[4,0]],["Sylvan Safekeeper",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[3,0],[0,0]],["Vengevine",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[4,0],[0,0]],["Wight of the Reliquary",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[4,0],[0,0]],["Obsessive Pursuit",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[2,0],[0,0]],["Blooming Marsh",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[2,0],[0,0]],["Bojuka Bog",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,1],[0,0]],["Extirpate",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,2],[0,0]],["Life from the Loam",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,1],[0,0]],["Pick Your Poison",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,2],[0,0]],["Vampire Hexmage",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,1],[0,0]],["Baron Helmut Zemo",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[1,0]],["Crypt of Agadeem",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[2,0]],["Faerie Macabre",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,1]],["Inside Information",[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,1]]];
  var BASE_COLORS = {"Ephemerate":"W","Solitude":"W","Prismatic Ending":"W","Wrath of the Skies":"W","Clarion Conqueror":"W","Abhorrent Oculus":"U","Otherworldly Gaze":"U","Spell Pierce":"U","Thought Scour":"U","Consign to Memory":"U","Mystical Dispute":"U","Quantum Riddler":"U","Force of Negation":"U","Spell Snare":"U","Boomerang Basics":"U","Dress Down":"U","Archon of Cruelty":"B","Emperor of Bones":"B","Fatal Push":"B","Inquisition of Kozilek":"B","Persist":"B","Thoughtseize":"B","Unearth":"B","Toxic Deluge":"B","Surgical Extraction":"B","Sephiroth, Fabled SOLDIER":"B","Yawgmoth, Thran Physician":"B","Darklight Phoenix":"B","Eyetwitch":"B","Gravecrawler":"B","Marionette Apprentice":"B","Shambling Ghast":"B","Warren Soultrader":"B","Flare of Malice":"B","Buried Alive":"B","Dai Li Indoctrination":"B","Decorum Dissertation":"B","Ozai's Cruelty":"B","Phoenix Fleet Airship":"B","Ruinous Waterbending":"B","Break the Ice":"B","End of the Hunt":"B","Dark Matter Manipulator":"B","Moonshadow":"B","Nethergoyf":"B","Street Wraith":"B","Troll of Khazad-dûm":"B","Glistening Deluge":"B","Cling to Dust":"B","Dauthi Voidwalker":"B","Fell the Profane":"B","Force of Despair":"B","March of Wretched Sorrow":"B","Necrodominance":"B","Orcish Bowmasters":"B","Sheoldred, the Apocalypse":"B","Soul Spike":"B","Boggart Trawler":"B","Requiting Hex":"B","Sheoldred's Edict":"B","Chthonian Nightmare":"B","Overlord of the Balemurk":"B","Rotten Reunion":"B","The Sackville-Bagginses":"B","Bone Shards":"B","Nameless Inversion":"B","Vraska's Final Mercy":"B","Carrion Feeder":"B","Champion of the Perished":"B","Cryptbreaker":"B","Liliana, Untouched by Death":"B","Forsaken Miner":"B","Vile Rebirth":"B","Faithless Looting":"R","Unholy Heat":"R","Pyroclasm":"R","Meltdown":"R","Avengers Disassembled":"R","Lightning Bolt":"R","Blood Moon":"R","Detective's Phoenix":"R","Goblin Bombardment":"R","Fear of Missing Out":"R","Obsidian Charmaw":"R","Ingot Chewer":"R","Badgermole Cub":"G","Delighted Halfling":"G","Dredger's Insight":"G","Dryad Arbor":"G","Endurance":"G","Formidable Speaker":"G","Green Sun's Zenith":"G","Ouroboroid":"G","Chomping Changeling":"G","Strangleroot Geist":"G","Young Wolf":"G","Force of Vigor":"G","Outland Liberator":"G","Malevolent Rumble":"G","Origin of Metalbending":"G","True Ancestry":"G","Grist, the Hunger Tide":"M","Psychic Frog":"M","Faithful Mending":"M","Teferi, Time Raveler":"M","Crime // Punishment":"M","Assassin's Trophy":"M","Witherbloom Charm":"M","Professor Dellian Fel":"M","Culling Ritual":"M","Ashiok, Dream Render":"M","Theorix Charm":"M","Fulminator Mage":"M","Agatha's Soul Cauldron":"C","Walking Ballista":"C","Vexing Bauble":"C","Soulless Jailer":"C","Damping Sphere":"C","Mishra's Bauble":"C","Nihil Spellbomb":"C","Grafdigger's Cage":"C","Haywire Mite":"C","Thorn of Amethyst":"C","Blood Crypt":"L","Bloodstained Mire":"L","Darkslick Shores":"L","Island":"L","Polluted Delta":"L","Raucous Theater":"L","Steam Vents":"L","Swamp":"L","Thundering Falls":"L","Undercity Sewers":"L","Watery Grave":"L","Boseiju, Who Endures":"L","Forest":"L","Overgrown Tomb":"L","Spymaster's Vault":"L","Underground Mortuary":"L","Verdant Catacombs":"L","Windswept Heath":"L","Marsh Flats":"L","Phyrexian Tower":"L","Flooded Strand":"L","Godless Shrine":"L","Hallowed Fountain":"L","Meticulous Archive":"L","Plains":"L","Shadowy Backstreet":"L","Shipwreck Marsh":"L","Deathcap Glade":"L","Mountain":"L","Wooded Foothills":"L","Blooming Marsh":"L","Mabel, Bitter Recluse":"B","Stitcher's Supplier":"B","Sylvan Safekeeper":"G","Vengevine":"G","Wight of the Reliquary":"M","Obsessive Pursuit":"B","Bojuka Bog":"L","Extirpate":"B","Life from the Loam":"G","Pick Your Poison":"G","Vampire Hexmage":"B","Baron Helmut Zemo":"B","Crypt of Agadeem":"L","Faerie Macabre":"B","Inside Information":"B"};
  var BASE_CARDCOLS = {"Agatha's Soul Cauldron":"","Badgermole Cub":"G","Delighted Halfling":"G","Dredger's Insight":"G","Dryad Arbor":"G","Endurance":"G","Formidable Speaker":"G","Green Sun's Zenith":"G","Grist, the Hunger Tide":"BG","Malevolent Rumble":"G","Ouroboroid":"G","Sephiroth, Fabled SOLDIER":"B","Strangleroot Geist":"G","Walking Ballista":"","Yawgmoth, Thran Physician":"B","Young Wolf":"G","Crime // Punishment":"WBG","Fatal Push":"B","Force of Vigor":"G","Outland Liberator":"G","Soulless Jailer":"","Thoughtseize":"B","Vexing Bauble":"","Abhorrent Oculus":"U","Archon of Cruelty":"B","Emperor of Bones":"B","Faithless Looting":"R","Inquisition of Kozilek":"B","Otherworldly Gaze":"U","Persist":"B","Psychic Frog":"UB","Spell Pierce":"U","Thought Scour":"U","Unearth":"B","Unholy Heat":"R","Avengers Disassembled":"R","Break the Ice":"B","Consign to Memory":"U","Damping Sphere":"","End of the Hunt":"B","Meltdown":"R","Mystical Dispute":"U","Pyroclasm":"R","Surgical Extraction":"B","Toxic Deluge":"B","Buried Alive":"B","Darklight Phoenix":"B","Eyetwitch":"B","Flare of Malice":"B","Gravecrawler":"B","Marionette Apprentice":"B","Shambling Ghast":"B","Warren Soultrader":"B","Culling Ritual":"BG","Dai Li Indoctrination":"B","Decorum Dissertation":"B","Origin of Metalbending":"G","Ozai's Cruelty":"B","Phoenix Fleet Airship":"B","Ruinous Waterbending":"B","True Ancestry":"G","Ephemerate":"W","Faithful Mending":"WU","Prismatic Ending":"W","Quantum Riddler":"U","Solitude":"W","Teferi, Time Raveler":"WU","Clarion Conqueror":"W","Force of Negation":"U","Wrath of the Skies":"W","Blood Moon":"R","Dark Matter Manipulator":"B","Detective's Phoenix":"R","Fear of Missing Out":"R","Lightning Bolt":"R","Mishra's Bauble":"","Moonshadow":"B","Nethergoyf":"B","Nihil Spellbomb":"","Street Wraith":"B","Troll of Khazad-dûm":"B","Glistening Deluge":"B","Grafdigger's Cage":"","Ingot Chewer":"R","Obsidian Charmaw":"R","Assassin's Trophy":"BG","Boggart Trawler":"B","Cling to Dust":"B","Dauthi Voidwalker":"B","Fell the Profane":"B","Force of Despair":"B","March of Wretched Sorrow":"B","Necrodominance":"B","Orcish Bowmasters":"B","Professor Dellian Fel":"BG","Sheoldred, the Apocalypse":"B","Soul Spike":"B","Witherbloom Charm":"BG","Ashiok, Dream Render":"UB","Requiting Hex":"B","Sheoldred's Edict":"B","Chthonian Nightmare":"B","Overlord of the Balemurk":"B","Rotten Reunion":"B","The Sackville-Bagginses":"B","Haywire Mite":"","Carrion Feeder":"B","Champion of the Perished":"B","Cryptbreaker":"B","Goblin Bombardment":"R","Liliana, Untouched by Death":"B","Forsaken Miner":"B","Thorn of Amethyst":"","Vile Rebirth":"B","Bone Shards":"B","Nameless Inversion":"B","Spell Snare":"U","Dress Down":"U","Fulminator Mage":"BR","Wight of the Reliquary":"BG"};
  var BASE_DBL = {"Solitude":"W","Wrath of the Skies":"W","Abhorrent Oculus":"U","Quantum Riddler":"U","Force of Negation":"U","Obsidian Charmaw":"R","Avengers Disassembled":"R","Endurance":"G","Ouroboroid":"G","Strangleroot Geist":"G","Force of Vigor":"G","Vengevine":"G"};
  var BASE_TOKENS = [
    ["Clue", [0, 0, 1, 0, 0, 0, 1, 0]],
    ["Copy", [0, 0, 1, 0, 0, 0, 1, 1]],
    ["Day // Night", [1, 0, 0, 0, 0, 0, 0, 0]],
    ["Eldrazi Spawn (0/1)", [1, 0, 1, 0, 0, 0, 1, 0]],
    ["Energy reserve", [0, 0, 0, 0, 0, 0, 1, 0]],
    ["Insect (1/1, black and green)", [1, 0, 0, 0, 0, 0, 0, 0]],
    ["Manifest (2/2)", [0, 1, 0, 0, 0, 0, 0, 0]],
    ["Orc Army (0/0, black)", [0, 0, 0, 0, 0, 1, 1, 0]],
    ["Professor Dellian Fel Emblem", [0, 0, 0, 0, 0, 1, 0, 0]],
    ["Sephiroth, One-Winged Angel Emblem", [1, 0, 0, 0, 0, 0, 0, 1]],
    ["Servo (1/1)", [0, 0, 1, 0, 0, 0, 1, 0]],
    ["Treasure", [0, 0, 1, 0, 0, 0, 1, 1]],
    ["Zombie (2/2, black)", [0, 0, 0, 0, 0, 0, 0, 1]],
    ["Zombie (2/2, black, decayed)", [0, 0, 0, 0, 0, 0, 1, 1]]
  ];
  var BASE_COUNTERS = {
    "Agatha's Soul Cauldron": ["+1/+1"], "Badgermole Cub": ["+1/+1"], "Ouroboroid": ["+1/+1"],
    "Strangleroot Geist": ["+1/+1"], "Walking Ballista": ["+1/+1"], "Young Wolf": ["+1/+1"],
    "Psychic Frog": ["+1/+1"], "Orcish Bowmasters": ["+1/+1"], "Marionette Apprentice": ["+1/+1"],
    "Dai Li Indoctrination": ["+1/+1"], "Origin of Metalbending": [],
    "Emperor of Bones": ["+1/+1", "Finality"], "Yawgmoth, Thran Physician": ["-1/-1"], "Persist": ["-1/-1"],
    "Moonshadow": ["-1/-1"], "Grist, the Hunger Tide": ["Loyalty"], "Teferi, Time Raveler": ["Loyalty"],
    "Professor Dellian Fel": ["Loyalty"], "Ashiok, Dream Render": ["Loyalty"],
    "Dauthi Voidwalker": ["Void"], "Carrion Feeder": ["+1/+1"], "Vraska's Final Mercy": ["Loyalty"], "Champion of the Perished": ["+1/+1"], "Liliana, Untouched by Death": ["Loyalty"], "Wrath of the Skies": ["Energy"],
    "Chthonian Nightmare": ["Energy"], "Overlord of the Balemurk": ["Time"], "Obsessive Pursuit": ["+1/+1"]
  };
  // Cards needing W/U/R beyond what black or green can pay (c = colors needed, l = land), with Scryfall tags (t) and tag-matched B/G substitutes (s)
  var OFFCOLOR = {"Consign to Memory":{"c":"U","l":0,"t":["counterspell-ability","hate-colorless"],"s":[["Invasion of Ravnica // Guildpact Paragon","{5}"],["Void Mirror","{2}"],["Pathway Arrows","{1}"],["Hedron Blade","{1}"],["Infernal Reckoning","{B}"]]},"Watery Grave":{"c":"U","l":1},"Island":{"c":"U","l":1},"Psychic Frog":{"c":"U","l":0,"t":["draw-engine","graveyard-fuel","free-discard-outlet","repeatable-pp-counters"],"s":[["Agatha's Soul Cauldron","{2}"],["Scavenging Ooze","{1}{G}"],["Camellia, the Seedmiser","{1}{B}{G}"],["The Ooze","{2}"],["Obsessive Pursuit","{1}{B}"]]},"Undercity Sewers":{"c":"U","l":1},"Blood Crypt":{"c":"R","l":1},"Mystical Dispute":{"c":"U","l":0,"t":["hate-blue","counterspell-soft"],"s":[["Veil of Summer","{G}"],["Sword of Fire and Ice","{3}"],["Sword of Truth and Justice","{3}"],["Autumn's Veil","{G}"],["Sword of Body and Mind","{3}"]]},"Thought Scour":{"c":"U","l":0,"t":["mill-any","cantrip"],"s":[["Ashiok, Dream Render","{1}{U/B}{U/B}"],["Archon of Cruelty","{6}{B}{B}"],["The Sackville-Bagginses","{1}{B}"],["Cling to Dust","{B}"],["Altar of Dementia","{2}"]]},"Meltdown":{"c":"R","l":0,"t":["sweeper","removal-artifact"],"s":[["Culling Ritual","{2}{B}{G}"],["Liliana, Dreadhorde General","{4}{B}{B}"],["All Is Dust","{7}"],["Steel Hellkite","{6}"],["Ugin, the Spirit Dragon","{8}"]]},"Otherworldly Gaze":{"c":"U","l":0,"t":["surveil"],"s":[["Umbral Collar Zealot","{1}{B}"],["Doom Whisperer","{3}{B}{B}"],["Grave Researcher // Reanimate","{2}{B}"],["Diresight","{2}{B}"],["Twilight Diviner","{2}{B}"]]},"Raucous Theater":{"c":"R","l":1},"Unholy Heat":{"c":"R","l":0,"t":["burn-creature","burn-planeswalker"],"s":[["Orcish Bowmasters","{1}{B}"],["Walking Ballista","{X}{X}"],["March of Wretched Sorrow","{X}{B}"],["Aetherflux Reservoir","{4}"],["Sword of Fire and Ice","{3}"]]},"Faithless Looting":{"c":"R","l":0,"t":["loot"],"s":[["Baron Helmut Zemo","{B}{B}{B}"],["Greater Good","{2}{G}{G}"],["Mask of Memory","{2}"],["Call of the Ring","{1}{B}"],["Collector's Vault","{2}"]]},"Pyroclasm":{"c":"R","l":0,"t":["burn-creature","sweeper"],"s":[["Ugin, the Spirit Dragon","{8}"],["Extinguisher Battleship","{8}"],["Crypt Rats","{2}{B}"],["Nylea's Intervention","{X}{G}{G}"],["Silklash Spider","{3}{G}{G}"]]},"Abhorrent Oculus":{"c":"U","l":0,"t":["graveyard-fuel","mill-self"],"s":[["Molt Tender","{G}"],["Tasigur, the Golden Fang","{5}{B}"],["The Binding of the Titans","{1}{G}"],["Egon, God of Death // Throne of Death","{2}{B}"],["Trystan, Callous Cultivator // Trystan, Penitent Culler","{2}{G}"]]},"Avengers Disassembled":{"c":"R","l":0,"t":["burn-creature","sweeper","swap-removal","modal","tutor-land-basic","removal-land","tutor-to-battlefield"],"s":[["Reap and Sow","{3}{G}"],["Return from the Wilds","{2}{G}"],["Glimpse the Core","{1}{G}"],["Dance of the Tumbleweeds","{1}{G}"],["Journey of Discovery","{2}{G}"]]},"Blood Moon":{"c":"R","l":0,"t":["land-conversion","universal-type-change","blood-moon-effect","mass-land-denial","hate-nonbasic-land"],"s":[["Quicksilver Fountain","{3}"],["Gaea's Liege","{3}{G}{G}{G}"],["Break the Ice","{B}{B}"],["Dryad of the Ilysian Grove","{2}{G}"],["Leyline of the Guildpact","{G/W}{G/U}{B/G}{R/G}"]]},"Clarion Conqueror":{"c":"W","l":0,"t":["null-rod","hate-planeswalker"],"s":[["Karn, the Great Creator","{4}"],["Collector Ouphe","{1}{G}"],["Damping Matrix","{3}"],["The Immortal Sun","{6}"],["Questing Beast","{2}{G}{G}"]]},"Crime // Punishment":{"c":"W","l":0,"t":["theft-enchantment","sweeper","reanimate-from-opponent","reanimate-enchantment","reanimate-creature","theft-creature","removal-creature","removal-artifact","removal-enchantment"],"s":[["Tergrid, God of Fright // Tergrid's Lantern","{3}{B}{B}"],["The Eldest Reborn","{4}{B}"],["Culling Ritual","{2}{B}{G}"],["Artisan of Kozilek","{9}"],["Liliana, Dreadhorde General","{4}{B}{B}"]]},"Detective's Phoenix":{"c":"R","l":0,"t":["graveyard-fuel","reanimate-self","reanimate-cast"],"s":[["Nethergoyf","{B}"],["Woe Strider","{2}{B}"],["Chainweb Aracnir","{G}"],["Polukranos, Unchained","{2}{B}{G}"],["Pharika's Spawn","{3}{B}"]]},"Dress Down":{"c":"U","l":0,"t":["cantrip"],"s":[["Archon of Cruelty","{6}{B}{B}"],["The Sackville-Bagginses","{1}{B}"],["Cling to Dust","{B}"],["Garruk's Uprising","{2}{G}"],["Explore","{1}{G}"]]},"Ephemerate":{"c":"W","l":0,"t":["protects-creature","flicker-creature"],"s":[["Voyager Staff","{1}"],["Rescue from the Underworld","{4}{B}"],["Conjurer's Closet","{5}"],["Sword of Hearth and Home","{3}"],["Golden Argosy","{4}"]]},"Faithful Mending":{"c":"WU","l":0,"t":["loot","lifegain"],"s":[["Baron Helmut Zemo","{B}{B}{B}"],["Greater Good","{2}{G}{G}"],["Mask of Memory","{2}"],["Call of the Ring","{1}{B}"],["Collector's Vault","{2}"]]},"Fear of Missing Out":{"c":"R","l":0,"t":["extra-combat-phase","rummage"],"s":[["Eyetwitch","{B}"],["Genji Glove","{5}"],["Key to the City","{2}"],["Hazoret's Monument","{3}"],["Transmutation Font","{5}"]]},"Force of Negation":{"c":"U","l":0,"t":["counterspell-noncreature","counterspell-free","counterspell-exile"],"s":[["Not of This World","{7}"],["Nullstone Gargoyle","{9}"],["Sundial of the Infinite","{2}"],["Shell of the Last Kappa","{3}"]]},"Goblin Bombardment":{"c":"R","l":0},"Godless Shrine":{"c":"W","l":1},"Hallowed Fountain":{"c":"WU","l":1},"Ingot Chewer":{"c":"R","l":0,"t":["removal-artifact"],"s":[["Assassin's Trophy","{B}{G}"],["Culling Ritual","{2}{B}{G}"],["Haywire Mite","{1}"],["Force of Vigor","{2}{G}{G}"],["Origin of Metalbending","{1}{G}"]]},"Lightning Bolt":{"c":"R","l":0,"t":["burn-any"],"s":[["Orcish Bowmasters","{1}{B}"],["Walking Ballista","{X}{X}"],["Soul Spike","{5}{B}{B}"],["Aetherflux Reservoir","{4}"],["Sword of Fire and Ice","{3}"]]},"Meticulous Archive":{"c":"WU","l":1},"Mountain":{"c":"R","l":1},"Obsidian Charmaw":{"c":"R","l":0,"t":["removal-land","hate-nonbasic-land"],"s":[["Fulminator Mage","{1}{B/R}{B/R}"],["Break the Ice","{B}{B}"],["Helldozer","{3}{B}{B}{B}"],["Bedeck // Bedazzle","{B/R}{B/R}"],["Ray of Ruin","{4}{B}"]]},"Plains":{"c":"W","l":1},"Prismatic Ending":{"c":"W","l":0,"t":["removal-nonland"],"s":[["Culling Ritual","{2}{B}{G}"],["Witherbloom Charm","{B}{G}"],["Torment of Hailfire","{X}{B}{B}"],["Abrupt Decay","{B}{G}"],["Meteor Golem","{7}"]]},"Quantum Riddler":{"c":"U","l":0,"t":["draw-engine","cantrip"],"s":[["Archon of Cruelty","{6}{B}{B}"],["Garruk's Uprising","{2}{G}"],["Eidolon of Blossoms","{2}{G}{G}"],["The Sackville-Bagginses","{1}{B}"],["Cling to Dust","{B}"]]},"Shadowy Backstreet":{"c":"W","l":1},"Shipwreck Marsh":{"c":"U","l":1},"Solitude":{"c":"W","l":0,"t":["repeatable-lifegain","removal-creature"],"s":[["Archon of Cruelty","{6}{B}{B}"],["Aetherflux Reservoir","{4}"],["The Meathook Massacre","{X}{B}{B}"],["Ugin, the Spirit Dragon","{8}"],["Ugin, Eye of the Storms","{7}"]]},"Spell Pierce":{"c":"U","l":0,"t":["counterspell-noncreature","mana-leak-series"],"s":[["Nullstone Gargoyle","{9}"]]},"Spell Snare":{"c":"U","l":0,"t":["counterspell"],"s":[["Vexing Bauble","{1}"],["Null Elemental Blast","{C}"],["Kozilek, the Great Distortion","{8}{C}{C}"],["Warping Wail","{1}{C}"],["Not of This World","{7}"]]},"Steam Vents":{"c":"UR","l":1},"Teferi, Time Raveler":{"c":"WU","l":0,"t":["draw-engine","removal-bounce","hate-flash","hate-off-turn-cast","repeatable-removal","removal-creature","hate-instant","removal-artifact","removal-enchantment","hate-counterspell"],"s":[["Liliana, Dreadhorde General","{4}{B}{B}"],["Ugin, Eye of the Storms","{7}"],["Abrupt Decay","{B}{G}"],["Vraska, Golgari Queen","{2}{B}{G}"],["Ugin, the Ineffable","{6}"]]},"Thundering Falls":{"c":"UR","l":1},"Wrath of the Skies":{"c":"W","l":0,"t":["sweeper","removal-creature","removal-artifact","removal-enchantment"],"s":[["Culling Ritual","{2}{B}{G}"],["Liliana, Dreadhorde General","{4}{B}{B}"],["All Is Dust","{7}"],["Steel Hellkite","{6}"],["Ugin, the Spirit Dragon","{8}"]]}};
  // Interchangeable cards: same function per Scryfall oracle tags (tag families chosen by you); c = pool cards, x = left out on purpose
  var FGROUPS = [{"n":"Colorless and nonbasic-land hate","t":["hate-colorless","hate-nonbasic-land"],"c":["Blood Moon","Break the Ice","Consign to Memory","Fulminator Mage","Obsidian Charmaw"],"x":[],"k":1,"mv":{"Blood Moon":3,"Break the Ice":2,"Consign to Memory":1,"Fulminator Mage":3,"Obsidian Charmaw":5}},{"n":"Artifact, enchantment and permanent removal","t":["removal-artifact","removal-enchantment","removal-permanent"],"c":["Assassin's Trophy","Force of Vigor","Haywire Mite","Ingot Chewer","Origin of Metalbending","Outland Liberator","Pick Your Poison","Prismatic Ending","Teferi, Time Raveler","Witherbloom Charm"],"x":[],"k":1,"mv":{"Assassin's Trophy":2,"Force of Vigor":4,"Haywire Mite":1,"Ingot Chewer":5,"Origin of Metalbending":2,"Outland Liberator":2,"Pick Your Poison":1,"Prismatic Ending":1,"Teferi, Time Raveler":3,"Witherbloom Charm":2}},{"n":"Artifact, enchantment and permanent removal, limited by mana value","t":["removal-artifact","removal-enchantment","removal-permanent","mana-value-matters"],"c":["Crime // Punishment","Culling Ritual","Meltdown","Wrath of the Skies"],"x":[],"k":1,"mv":{"Crime // Punishment":7,"Culling Ritual":4,"Meltdown":1,"Wrath of the Skies":2}},{"n":"Graveyard seal","t":["graveyard-seal"],"c":["Dauthi Voidwalker","Grafdigger's Cage","Soulless Jailer"],"x":["Necrodominance"],"k":1,"mv":{"Dauthi Voidwalker":2,"Grafdigger's Cage":1,"Soulless Jailer":2}},{"n":"Named-card hate and lobotomy","t":["hate-named","lobotomy"],"c":["Extirpate","Surgical Extraction"],"x":[],"k":1,"mv":{"Extirpate":1,"Surgical Extraction":1}},{"n":"Thoughtseize effects","t":["thoughtseize"],"c":["Inquisition of Kozilek","Thoughtseize"],"x":["Dai Li Indoctrination"],"k":1,"mv":{"Inquisition of Kozilek":1,"Thoughtseize":1}},{"n":"Self-mill","t":["mill-self"],"c":["Abhorrent Oculus","Dark Matter Manipulator","Grist, the Hunger Tide","Liliana, Untouched by Death","Overlord of the Balemurk","Stitcher's Supplier"],"x":["Life from the Loam"],"k":2,"mv":{"Abhorrent Oculus":3,"Dark Matter Manipulator":1,"Grist, the Hunger Tide":3,"Liliana, Untouched by Death":4,"Overlord of the Balemurk":5,"Stitcher's Supplier":1},"alt":{"Overlord of the Balemurk":[2,"impending {1}{B}"]}}];
  var KEEPCOLORS = { "Zombardment": "R" };
  var NOSUB = { "Goblin Bombardment": 1 };
  var SUB_SEED = { "Consign to Memory": "Break the Ice; Fulminator Mage (its {B/R} hybrid cost is castable with black)" };
  var CTYPE_BASE = ["+1/+1", "-1/-1", "Loyalty", "Finality", "Void", "Energy", "Time"];
  var ALLDATA = [], COLORS = {}, CARDCOLS = {}, DBL = {}, COUNTERS = {}, TOKROWS = [], UNK = [];
  var BASE_DECKS = [
    { n: "Yawgmoth", v: "--y", s: "Yawgmoth engine", b: "Combo", off: true },
    { n: "Grixis Reanimator", v: "--g", s: "Reanimator", b: "Combo" },
    { n: "Darklight Soultrader", v: "--d", s: "Aristocrats / recursion", b: "Midrange" },
    { n: "Esper Archon", v: "--e", s: "Reanimator", b: "Combo", off: true },
    { n: "Rakdos (Viable)", v: "--r", s: "Aggro-tempo", b: "Aggro", off: true },
    { n: "Golgari Necro", v: "--w", s: "Necro midrange", b: "Midrange" },
    { n: "Shiptrader", v: "--s", s: "Aristocrats / recursion", b: "Midrange" },
    { n: "Zombardment", v: "--z", s: "Zombie sacrifice", b: "Aggro" },
    { n: "Dimir Shadow Aggro", v: "--m", s: "Shadow aggro", b: "Aggro" },
    { n: "Grixis Aggro", v: "--ub", s: "Shadow aggro", b: "Aggro", off: true },
    { n: "Golgari Sac Aggro", v: "--dk10", s: "Sacrifice aggro", b: "Aggro", tk: ["Clue", "Insect (1/1, black and green)"] },
    { n: "Mono black lessons reanimator", v: "--dk11", s: "Reanimator", b: "Combo", tk: ["Clue", "Energy reserve", "Orc Army (0/0, black)"] }
  ];
  var NUMW = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
  var $ = function (id) { return root.querySelector("[id=\"" + id + "\"]"); };
  var fitLabelsFn = null, tip0 = null;
  function onResize() { if (fitLabelsFn) fitLabelsFn(); }
  window.addEventListener("resize", onResize);
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  var APP = $("app").innerHTML;
  var ALLDECKS = [], picked = [], pickedNames = {};
  var curTab = "main", finderSel = [];
  var FETCH = { "Polluted Delta": "U", "Bloodstained Mire": "R", "Verdant Catacombs": "G", "Marsh Flats": "W" };
  var NEEDC = ["W", "U", "R", "G"];
  var CNAME = { W: "white", U: "blue", R: "red", G: "green" };
  var useOpt = false, optThr = 20, markSort = "group", markBas = false, pkAll = false, clFmt = "md";

  function analyze(AI, thr) {
    var names = Object.keys(FETCH), rowOf = {};
    ALLDATA.forEach(function (r) { rowOf[r[0]] = r; });
    var present = names.filter(function (n) { return rowOf[n] && AI.some(function (i) { return rowOf[n][i + 1][0] > 0; }); });
    var fOf = {};
    names.forEach(function (n) { fOf[FETCH[n]] = n; });
    var decks = [];
    AI.forEach(function (i) {
      var before = {}, side = {}, sum = 0;
      names.forEach(function (n) { var c = rowOf[n] ? rowOf[n][i + 1] : [0, 0]; before[n] = c[0]; side[n] = c[1]; sum += c[0]; });
      if (!sum) return;
      var tot = 0, cc = { W: 0, U: 0, R: 0, G: 0 }, dbl = {};
      ALLDATA.forEach(function (r) {
        var cols = CARDCOLS[r[0]]; if (cols === undefined) return;
        var m = r[i + 1][0]; if (!m) return;
        tot += m;
        NEEDC.forEach(function (c) { if (cols.indexOf(c) >= 0) cc[c] += m; });
        if (DBL[r[0]]) dbl[DBL[r[0]]] = (dbl[DBL[r[0]]] || 0) + m;
      });
      var need = [], why = {}, req = {};
      NEEDC.forEach(function (c) {
        var share = tot ? cc[c] / tot * 100 : 0, cover = 0;
        names.forEach(function (n) { if (FETCH[n] === c) cover += before[n]; });
        why[c] = { share: share, dbl: dbl[c] || 0 };
        if (share >= thr || dbl[c]) { need.push(c); req[c] = cover; }
      });
      decks.push({ i: i, before: before, side: side, s: sum, need: need, why: why, req: req, after: null });
    });
    var R = {}, maxS = 0;
    decks.forEach(function (d) { maxS = Math.max(maxS, d.s); d.need.forEach(function (c) { R[c] = Math.max(R[c] || 0, d.req[c]); }); });
    var y = {}, sumR = 0;
    names.forEach(function (n) { y[n] = 0; });
    NEEDC.forEach(function (c) { if (R[c] && fOf[c]) { y[fOf[c]] = R[c]; sumR += R[c]; } });
    var extra = Math.max(maxS, sumR) - sumR;
    var usage = {};
    names.forEach(function (n) { usage[n] = decks.reduce(function (a, d) { return a + d.before[n]; }, 0); });
    present.slice().sort(function (a, b) { return y[b] - y[a] || usage[b] - usage[a]; }).forEach(function (n) {
      var t = Math.min(extra, 4 - y[n]); if (t > 0) { y[n] += t; extra -= t; }
    });
    decks.forEach(function (d) {
      var x = {}, rem = d.s;
      names.forEach(function (n) { x[n] = 0; });
      var cap = function (n) { return Math.max(0, Math.min(y[n], 4 - d.side[n])); };
      d.need.forEach(function (c) { var f = fOf[c]; if (!f) return; var t = Math.min(d.req[c], cap(f)); x[f] += t; rem -= t; });
      present.slice().sort(function (a, b) { return d.before[b] - d.before[a] || y[b] - y[a]; }).forEach(function (n) {
        if (rem <= 0) return;
        var t = Math.min(rem, cap(n) - x[n]); if (t > 0) { x[n] += t; rem -= t; }
      });
      if (rem > 0) names.forEach(function (n) { x[n] = d.before[n]; });
      d.after = x;
    });
    var pb = {}, pa = {};
    names.forEach(function (n) {
      pb[n] = Math.max.apply(null, [0].concat(decks.map(function (d) { return d.before[n]; })));
      pa[n] = Math.max.apply(null, [0].concat(decks.map(function (d) { return d.after[n]; })));
    });
    return { names: names, decks: decks, poolBefore: pb, poolAfter: pa };
  }
  function poolPhys(rowsData, AI, ovr) {
    var BASIC = ["Swamp", "Island", "Plains", "Mountain", "Forest"], total = 0;
    rowsData.forEach(function (r) {
      if (BASIC.indexOf(r[0]) >= 0) return;
      var m = 0;
      AI.forEach(function (i) {
        var c = r[i + 1], k = r[0] + "|" + i;
        var v = (ovr && k in ovr ? ovr[k] : c[0]) + c[1];
        if (v > m) m = v;
      });
      total += m;
    });
    return total;
  }

  function start() {
  var AI = [];
  picked.forEach(function (on, i) { if (on) AI.push(i); });
  if (AI.length < 2) {
    $("sub").textContent = "Pick two or more decks above to compare them.";
    $("app").innerHTML = '<p class="note empty-pick">' + (AI.length ? "Pick at least one more deck to start the comparison." : "No decks are in the comparison yet. Pick two or more decks in the box above.") + "</p>";
    if (tip0) { tip0.remove(); tip0 = null; }
    return;
  }
  $("app").innerHTML = APP;
  var DECKS = AI.map(function (i) { return ALLDECKS[i]; });
  var an = analyze(AI, optThr), ovr = {};
  an.decks.forEach(function (d) { an.names.forEach(function (n) { ovr[n + "|" + d.i] = d.after[n]; }); });
  var DATA = ALLDATA.map(function (r) {
      return [r[0]].concat(AI.map(function (i) {
        var c = r[i + 1], k = r[0] + "|" + i;
        return useOpt && (k in ovr) ? [ovr[k], c[1]] : c;
      }));
    })
    .filter(function (r) { return r.slice(1).some(function (x) { return x[0] + x[1] > 0; }); });
  $("sub").textContent = (NUMW[DECKS.length] || DECKS.length) + " decklists compared card by card. Counts combine main deck and sideboard unless you turn on the split." + (useOpt ? " Fetch lands are optimized." : "");
  var CATS = [
    { k: "all", l: "All cards" },
    { k: "four", l: "In all " + DECKS.length + " decks" },
    { k: "multi", l: "In 2+ decks" },
    { k: "unique", l: "Unique to one deck" },
    { k: "sb1", l: "In exactly one sideboard" },
    { k: "sbonly", l: "Sideboard only" }
  ];
  var rows = DATA.map(function (r) {
    var c = r.slice(1);
    var tot = c.map(function (x) { return x[0] + x[1]; });
    return {
      name: r[0], c: c, tot: tot,
      decks: tot.filter(Boolean).length,
      sbDecks: c.filter(function (x) { return x[1] > 0; }).length,
      sbOnly: c.every(function (x) { return !x[0]; }) && c.some(function (x) { return x[1] > 0; })
    };
  });
  var state = { q: "", cat: "all", sel: DECKS.map(function () { return false; }), split: false, key: "decks", dir: -1 };

  // Deck tiles
  $("tiles").innerHTML = DECKS.map(function (d, i) {
    var ur = rows.filter(function (r) { return r.decks === 1 && r.tot[i] > 0; });
    var un = ur.length, uc = ur.reduce(function (a, r) { return a + r.tot[i]; }, 0);
    return '<div class="deck-tile" style="--dc:var(' + d.v + ')"><b>' + esc(d.n) + '</b><small class="arch">' + esc(d.s) + ' · ' + esc(d.b) + '</small><span>' +
      un + (un === 1 ? ' unique card' : ' unique cards') + ' (' + uc + (uc === 1 ? ' copy' : ' copies') + ')</span></div>';
  }).join("");

  // Category chips
  CATS.forEach(function (c) {
    var b = document.createElement("button");
    b.type = "button"; b.textContent = c.l; b.dataset.cat = c.k;
    b.setAttribute("aria-pressed", c.k === state.cat ? "true" : "false");
    $("cats").appendChild(b);
  });
  // Deck chips
  DECKS.forEach(function (d, i) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "deck-chip"; b.dataset.deck = i;
    b.style.setProperty("--dc", "var(" + d.v + ")");
    b.innerHTML = "<i></i>" + esc(d.n);
    b.setAttribute("aria-pressed", "false");
    $("decksel").appendChild(b);
  });

  var hr = '<th scope="col" aria-sort="none"><button type="button" data-sort="name">Card <span class="arrow"></span></button></th>';
  DECKS.forEach(function (d, i) {
    hr += '<th scope="col" class="deckcol" style="--dc:var(' + d.v + ')" aria-sort="none"><button type="button" data-sort="' + i + '">' + esc(d.n) + ' <span class="arrow"></span></button></th>';
  });
  hr += '<th scope="col" aria-sort="none"><button type="button" data-sort="decks">Decks <span class="arrow"></span></button></th>';
  $("headrow").innerHTML = hr;
  var th2 = '<th scope="col"><button type="button" disabled style="cursor:default">Token</button></th>';
  DECKS.forEach(function (d) {
    th2 += '<th scope="col" class="deckcol" style="--dc:var(' + d.v + ')"><button type="button" disabled style="cursor:default">' + esc(d.n) + '</button></th>';
  });
  $("tokhead").innerHTML = th2;
  $("cnthead").innerHTML = th2.replace(">Token<", ">Counter<");

  function matches(r) {
    if (state.q && r.name.toLowerCase().indexOf(state.q) === -1) return false;
    for (var i = 0; i < DECKS.length; i++) if (state.sel[i] && !r.tot[i]) return false;
    switch (state.cat) {
      case "four": return r.decks === DECKS.length;
      case "multi": return r.decks >= 2;
      case "unique": return r.decks === 1;
      case "sb1": return r.sbDecks === 1;
      case "sbonly": return r.sbOnly;
    }
    return true;
  }
  function cmp(a, b) {
    var k = state.key, d = state.dir, v;
    if (k === "name") v = a.name.localeCompare(b.name);
    else if (k === "decks") v = a.decks - b.decks;
    else v = a.tot[+k] - b.tot[+k];
    if (v !== 0) return v * d;
    return a.name.localeCompare(b.name);
  }
  function cell(r, i) {
    var t = r.tot[i];
    if (!t) return '<td class="zero">–</td>';
    var m = r.c[i][0], s = r.c[i][1], inner;
    if (state.split) {
      inner = (m ? m : "0") + (s ? '<span class="sb">+' + s + " SB</span>" : "");
    } else inner = t;
    return '<td class="n" style="--dc:var(' + DECKS[i].v + ');--i:' + t + '">' + inner + "</td>";
  }

  var current = [];
  function render() {
    current = rows.filter(matches).sort(cmp);
    var html = current.map(function (r) {
      return "<tr><td>" + esc(r.name) + "</td>" + DECKS.map(function (d, i) { return cell(r, i); }).join("") +
        '<td class="cnt">' + r.decks + "</td></tr>";
    }).join("");
    $("body").innerHTML = html || '<tr><td class="empty" colspan="' + (DECKS.length + 2) + '">No cards match these filters.</td></tr>';
    var sums = DECKS.map(function () { return 0; });
    current.forEach(function (r) { r.tot.forEach(function (t, i) { sums[i] += t; }); });
    $("foot").innerHTML = "<tr><td>Copies shown</td>" + sums.map(function (s) { return "<td>" + s + "</td>"; }).join("") + "<td></td></tr>";
    $("status").textContent = current.length + " of " + rows.length + " cards";
    var ths = root.querySelectorAll("#mat thead th");
    Array.prototype.forEach.call(ths, function (th) {
      var b = th.querySelector("button"), on = b.dataset.sort === String(state.key);
      th.setAttribute("aria-sort", on ? (state.dir === 1 ? "ascending" : "descending") : "none");
      b.querySelector(".arrow").textContent = on ? (state.dir === 1 ? "▲" : "▼") : "";
    });
  }

  $("q").addEventListener("input", function (e) { state.q = e.target.value.trim().toLowerCase(); render(); });
  $("cats").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-cat]"); if (!b) return;
    state.cat = b.dataset.cat;
    Array.prototype.forEach.call($("cats").querySelectorAll("button"), function (x) {
      x.setAttribute("aria-pressed", x === b ? "true" : "false");
    });
    render();
  });
  $("decksel").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-deck]"); if (!b) return;
    var i = +b.dataset.deck; state.sel[i] = !state.sel[i];
    b.setAttribute("aria-pressed", state.sel[i] ? "true" : "false");
    render();
  });
  $("split").addEventListener("click", function (e) {
    state.split = !state.split;
    e.currentTarget.setAttribute("aria-pressed", state.split ? "true" : "false");
    render();
  });
  $("mat").querySelector("thead").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-sort]"); if (!b) return;
    var k = b.dataset.sort;
    if (String(state.key) === k) state.dir = -state.dir;
    else { state.key = k; state.dir = k === "name" ? 1 : -1; }
    render();
  });
  $("copy").addEventListener("click", function () {
    var head = ["Card"].concat(DECKS.map(function (d) { return d.n; }), ["Decks"]).join("\t");
    var lines = current.map(function (r) {
      return [r.name].concat(r.tot.map(function (t) { return t || ""; }), [r.decks]).join("\t");
    });
    var text = [head].concat(lines).join("\n");
    var done = function (msg) {
      $("status").textContent = msg;
      setTimeout(render, 1800);
    };
    try {
      navigator.clipboard.writeText(text).then(
        function () { done("Copied " + current.length + " rows"); },
        function () { done("Copy blocked here"); }
      );
    } catch (err) { done("Copy blocked here"); }
  });

  // Sideboard-only cards
  (function () {
    var sb = rows.filter(function (r) { return r.sbOnly; }).map(function (r) {
      var tot = 0, mx = 0;
      r.c.forEach(function (x) { tot += x[1]; if (x[1] > mx) mx = x[1]; });
      return { r: r, n: r.sbDecks, tot: tot, mx: mx };
    }).sort(function (a, b) { return b.n - a.n || b.tot - a.tot || a.r.name.localeCompare(b.r.name); });
    var dist = {}, own = 0, copies = 0;
    sb.forEach(function (x) { dist[x.n] = (dist[x.n] || 0) + 1; own += x.mx; copies += x.tot; });
    var parts = Object.keys(dist).sort(function (a, b) { return b - a; }).map(function (k) { return dist[k] + " in " + k + (k === "1" ? " sideboard" : " sideboards"); });
    $("sbsum").textContent = sb.length ? sb.length + (sb.length === 1 ? " card is" : " cards are") + " only in sideboards across the " + DECKS.length + " selected decks: " + parts.join(", ") +
      ". That is " + copies + " sideboard copies in all; owning " + own + " copies covers whichever deck you build." : "Every sideboard card in the selected decks is also in some main deck.";
    $("sbbody").innerHTML = sb.map(function (x) {
      var chips = DECKS.map(function (d, i) { var s = x.r.c[i][1]; return s ? '<span class="dk" style="--dc:var(' + d.v + ')"><i></i>' + esc(d.n) + " ×" + s + "</span>" : ""; }).join("");
      return "<tr><td>" + esc(x.r.name) + '</td><td class="cnt">' + x.n + " of " + DECKS.length + '</td><td class="cnt">' + x.tot + '</td><td class="cnt">' + x.mx + '</td><td class="l fdecks">' + chips + "</td></tr>";
    }).join("") || '<tr><td class="empty" colspan="5">None.</td></tr>';
  })();

  // Marker colors: each card's decks in a fixed spectrum order
  var MRANK = {};
  MORD.forEach(function (di, k) { MRANK[di] = k; });
  function marksOf(r) {
    var l = [];
    r.tot.forEach(function (t, i) { if (t) l.push(i); });
    return l.sort(function (a, b) { return MRANK[AI[a]] - MRANK[AI[b]]; });
  }
  function swatches(list) {
    return '<span class="mks">' + list.map(function (i) {
      var d = DECKS[i];
      return '<span class="mk" style="background:' + d.col + '" title="' + esc(d.cn + " = " + d.n) + '"></span>';
    }).join("") + "</span>";
  }
  function markNames(list) { return list.map(function (i) { return DECKS[i].cn; }).join(" · "); }

  // Tokens (from each deck file's token section)
  var TOKENS = TOKROWS.filter(function (t) { return AI.some(function (oi) { return t[1][oi]; }); });
  function tokMarks(t) {
    var l = [];
    DECKS.forEach(function (d, i) { if (t[1][AI[i]]) l.push(i); });
    return l.sort(function (a, b) { return MRANK[AI[a]] - MRANK[AI[b]]; });
  }
  $("tokhead").insertAdjacentHTML("beforeend", '<th scope="col" class="l"><button type="button" disabled style="cursor:default">Marks</button></th>');
  $("tokbody").innerHTML = TOKENS.map(function (t) {
    var ml = tokMarks(t);
    return "<tr><td>" + esc(t[0]) + "</td>" + DECKS.map(function (d, i) {
      var x = t[1][AI[i]];
      return x ? '<td class="mark" style="--dc:var(' + DECKS[i].v + ')">✓</td>' : '<td class="none">–</td>';
    }).join("") + '<td class="l"><div class="mkrow">' + swatches(ml) + '<span class="mkn">' + esc(markNames(ml)) + "</span></div></td></tr>";
  }).join("");
  var tc = DECKS.map(function () { return 0; });
  TOKENS.forEach(function (t) { AI.forEach(function (oi, i) { tc[i] += t[1][oi] || 0; }); });
  Array.prototype.forEach.call($("tiles").children, function (el, i) {
    el.querySelector("span").textContent += " · " + (DECKS[i].tk === null ? "tokens not provided" : !tc[i] ? "no tokens listed" : tc[i] + (tc[i] === 1 ? " token" : " tokens"));
  });

  // Counters (from oracle text of every nonland card in the six lists)
  var CTYPES = CTYPE_BASE.slice();
  Object.keys(COUNTERS).forEach(function (n) { COUNTERS[n].forEach(function (t) { if (CTYPES.indexOf(t) < 0) CTYPES.push(t); }); });
  var cmap = {}, cn = DECKS.map(function () { return 0; });
  CTYPES.forEach(function (t) { cmap[t] = DECKS.map(function () { return []; }); });
  rows.forEach(function (r) {
    (COUNTERS[r.name] || []).forEach(function (t) {
      r.c.forEach(function (x, i) { if (x[0] + x[1]) cmap[t][i].push(r.name); });
    });
  });
  CTYPES.forEach(function (t) { cmap[t].forEach(function (l, i) { if (l.length) cn[i]++; }); });
  CTYPES = CTYPES.filter(function (t) { return cmap[t].some(function (l) { return l.length; }); });
  $("cntbody").innerHTML = CTYPES.map(function (t) {
    return "<tr><td>" + esc(t) + "</td>" + DECKS.map(function (d, i) {
      var l = cmap[t][i];
      return l.length ? '<td class="mark" style="--dc:var(' + d.v + ')" title="' + esc(l.join(", ")) + '">✓ ' + l.length + '</td>' : '<td class="none">–</td>';
    }).join("") + "</tr>";
  }).join("");
  Array.prototype.forEach.call($("tiles").children, function (el, i) {
    el.querySelector("span").textContent += " · " + cn[i] + (cn[i] === 1 ? " counter type" : " counter types");
  });

  // Tabs and card finder
  (function () {
    var TABS = [["main", "Comparison"], ["find", "Card finder"], ["mark", "Sleeve marks"], ["pkg", "Packages"], ["sub", "Substitutes"], ["opt", "Fetch optimizer"]];
    function showTab() {
      TABS.forEach(function (t) {
        $("tab-" + t[0]).hidden = t[0] !== curTab;
        $("tabbtn-" + t[0]).setAttribute("aria-selected", t[0] === curTab ? "true" : "false");
      });
    }
    TABS.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button"; b.id = "tabbtn-" + t[0]; b.textContent = t[1]; b.dataset.tab = t[0];
      b.setAttribute("role", "tab"); b.setAttribute("aria-controls", "tab-" + t[0]);
      $("tabs").appendChild(b);
    });
    $("tabs").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-tab]"); if (!b) return;
      curTab = b.dataset.tab; showTab();
      if (curTab === "find") $("fq").focus();
    });
    showTab();

    var rowBy = {};
    rows.forEach(function (r) { rowBy[r.name] = r; });
    finderSel = finderSel.filter(function (n) { return rowBy[n]; });
    function addCard(n) { if (finderSel.indexOf(n) < 0) finderSel.push(n); $("fq").value = ""; renderFinder(); $("fq").focus(); }
    function suggestions() {
      var q = $("fq").value.trim().toLowerCase();
      if (!q) return [];
      return rows.filter(function (r) { return finderSel.indexOf(r.name) < 0 && r.name.toLowerCase().indexOf(q) >= 0; })
        .map(function (r) { return r.name; }).sort(function (a, b) { return a.localeCompare(b); });
    }
    function renderFinder() {
      var q = $("fq").value.trim(), sg = suggestions();
      $("fsug").innerHTML = (q && !sg.length ? '<span class="status">No matching cards in the selected decks</span>' : "") +
        sg.slice(0, 12).map(function (n) { return '<button type="button" data-add="' + esc(n) + '">+ ' + esc(n) + "</button>"; }).join("") +
        (sg.length > 12 ? '<span class="status">' + (sg.length - 12) + " more, keep typing</span>" : "");
      $("fsel").innerHTML = finderSel.map(function (n) {
        return '<button type="button" data-rm="' + esc(n) + '" aria-label="Remove ' + esc(n) + '" aria-pressed="true">' + esc(n) + " ×</button>";
      }).join("");
      $("fbody").innerHTML = finderSel.length ? finderSel.map(function (n) {
        var r = rowBy[n];
        if (!r) return "<tr><td>" + esc(n) + '</td><td class="l fdecks none" colspan="2">Not in any of the selected decks</td></tr>';
        var chips = DECKS.map(function (d, i) {
          if (!r.tot[i]) return "";
          var sb = r.c[i][1];
          return '<span class="dk" style="--dc:var(' + d.v + ')"><i></i>' + esc(d.n) + " ×" + r.tot[i] + (sb ? " (" + r.c[i][0] + " main + " + sb + " SB)" : "") + "</span>";
        }).join("");
        var ml = marksOf(r);
        return "<tr><td>" + esc(n) + '<div class="mkrow">' + swatches(ml) + '<span class="mkn">' + esc(markNames(ml)) + "</span></div>" + '</td><td class="l fdecks">' + chips + '</td><td class="cnt">' + r.decks + " of " + DECKS.length + "</td></tr>";
      }).join("") : '<tr><td class="empty" colspan="3">Type a card name above and pick it to see which decks include it.</td></tr>';
      var sm = "";
      if (finderSel.length > 1) {
        var all = DECKS.filter(function (d, i) { return finderSel.every(function (n) { return rowBy[n] && rowBy[n].tot[i] > 0; }); });
        sm = "Decks that include all " + finderSel.length + " selected cards: " + (all.length ? all.map(function (d) { return d.n; }).join(", ") : "none") + ".";
      }
      $("fsummary").textContent = sm;
    }
    $("fq").addEventListener("input", renderFinder);
    $("fq").addEventListener("keydown", function (e) {
      if (e.key === "Enter") { var sg = suggestions(); if (sg.length) { e.preventDefault(); addCard(sg[0]); } }
    });
    $("fsug").addEventListener("click", function (e) { var b = e.target.closest("button[data-add]"); if (b) addCard(b.dataset.add); });
    $("fsel").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-rm]"); if (!b) return;
      finderSel = finderSel.filter(function (n) { return n !== b.dataset.rm; }); renderFinder();
    });
    $("fclear").addEventListener("click", function () { finderSel = []; $("fq").value = ""; renderFinder(); });
    renderFinder();
  })();

  // Sleeve marks
  (function () {
    var BAS = ["Swamp", "Island", "Plains", "Mountain", "Forest"];
    var order = DECKS.map(function (d, i) { return i; }).sort(function (a, b) { return MRANK[AI[a]] - MRANK[AI[b]]; });
    $("mlegend").innerHTML = '<span class="lbl">Order</span>' + order.map(function (i) {
      var d = DECKS[i];
      return '<span class="dk" style="--dc:' + d.col + '"><i></i><b>' + esc(d.cn) + "</b>&nbsp;" + esc(d.n) + "</span>";
    }).join("");
    $("mbas").checked = markBas;
    Array.prototype.forEach.call($("msorts").querySelectorAll("button[data-msort]"), function (b) { b.setAttribute("aria-pressed", b.dataset.msort === markSort ? "true" : "false"); });
    var list = rows.filter(function (r) { return markBas || BAS.indexOf(r.name) < 0; }).map(function (r) {
      return { name: r.name, m: marksOf(r), n: Math.max.apply(null, r.tot) };
    });
    var key = function (x) { return x.m.map(function (i) { return String.fromCharCode(65 + MRANK[AI[i]]); }).join(""); };
    if (markSort === "group") list.sort(function (a, b) { return b.m.length - a.m.length || (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0) || a.name.localeCompare(b.name); });
    else list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    var h = "", last = null, groups = 0, copies = 0, marks = 0;
    list.forEach(function (x, j) {
      copies += x.n; marks += x.n * x.m.length;
      if (markSort === "group" && key(x) !== last) {
        last = key(x); groups++;
        var g = list.filter(function (y) { return key(y) === last; }), gc = g.reduce(function (a, y) { return a + y.n; }, 0);
        h += '<tr class="mgrp"><th scope="rowgroup" colspan="3" class="l">' + swatches(x.m) + " " + esc(markNames(x.m)) + ' <span class="status">' + g.length + (g.length === 1 ? " card, " : " cards, ") + gc + (gc === 1 ? " sleeve" : " sleeves") + "</span></th></tr>";
      }
      h += '<tr><td class="l">' + esc(x.name) + '</td><td class="l"><div class="mkrow">' + swatches(x.m) + '<span class="mkn">' + esc(markNames(x.m)) + '</span></div></td><td class="big">' + x.n + "</td></tr>";
    });
    $("mbody").innerHTML = h || '<tr><td class="empty" colspan="3">No cards.</td></tr>';
    $("msum").textContent = list.length + " cards, " + copies + " sleeves, " + marks + " marks in all" + (markSort === "group" ? ", in " + groups + " mark combinations" : "") + ".";
    var tl = TOKENS.map(function (t) { return { name: t[0], m: tokMarks(t) }; });
    if (markSort === "group") tl.sort(function (a, b) { return b.m.length - a.m.length || (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0) || a.name.localeCompare(b.name); });
    else tl.sort(function (a, b) { return a.name.localeCompare(b.name); });
    var th = "", tlast = null;
    tl.forEach(function (x) {
      if (markSort === "group" && key(x) !== tlast) {
        tlast = key(x);
        var n = tl.filter(function (y) { return key(y) === tlast; }).length;
        th += '<tr class="mgrp"><th scope="rowgroup" colspan="2" class="l">' + swatches(x.m) + " " + esc(markNames(x.m)) + ' <span class="status">' + n + (n === 1 ? " token" : " tokens") + "</span></th></tr>";
      }
      th += '<tr><td class="l">' + esc(x.name) + '</td><td class="l"><div class="mkrow">' + swatches(x.m) + '<span class="mkn">' + esc(markNames(x.m)) + "</span></div></td></tr>";
    });
    $("mtbody").innerHTML = th || '<tr><td class="empty" colspan="2">None of the selected decks list tokens.</td></tr>';
    var nolist = DECKS.filter(function (d) { return d.tk === null; }).map(function (d) { return d.n; });
    $("mtsum").textContent = tl.length + (tl.length === 1 ? " token" : " tokens") + "." + (nolist.length ? " No token list for " + nolist.join(", ") + ", so their marks are missing here; add one under Edit decklists." : "");
    $("msorts").addEventListener("click", function (e) { var b = e.target.closest("button[data-msort]"); if (!b) return; markSort = b.dataset.msort; start(); });
    $("mbas").addEventListener("change", function () { markBas = $("mbas").checked; start(); });
  })();

  // Packages: cards grouped by the exact set of selected decks that play them
  (function () {
    var BAS = ["Swamp", "Island", "Plains", "Mountain", "Forest"], groups = {};
    rows.forEach(function (r) {
      if (BAS.indexOf(r.name) >= 0 || r.decks < 2) return;
      var key = r.tot.map(function (t) { return t ? 1 : 0; }).join("");
      (groups[key] = groups[key] || []).push(r);
    });
    var all = Object.keys(groups).map(function (k) {
      var ds = []; k.split("").forEach(function (x, i) { if (x === "1") ds.push(i); });
      var cards = groups[k].sort(function (a, b) { return a.name.localeCompare(b.name); });
      var copies = Math.max.apply(null, ds.map(function (i) { return cards.reduce(function (a, r) { return a + r.tot[i]; }, 0); }));
      return { ds: ds, cards: cards, copies: copies };
    }).filter(function (p) { return p.cards.length >= 2; }).sort(function (a, b) { return b.ds.length - a.ds.length || b.cards.length - a.cards.length || a.cards[0].name.localeCompare(b.cards[0].name); });
    $("pkall").checked = pkAll;
    var list = all.filter(function (p) { return pkAll || p.ds.length < DECKS.length; });
    var hidden = all.length - list.length;
    $("pksum").textContent = list.length + (list.length === 1 ? " package" : " packages") + " shared by two or more of the " + DECKS.length + " selected decks" +
      (hidden ? " (plus 1 in every selected deck, hidden)" : "") + ".";
    $("pkbody").innerHTML = list.map(function (p) {
      var cards = p.cards.map(function (r) {
        var cs = p.ds.map(function (i) { var c = r.c[i]; return c[0] && c[1] ? c[0] + "+" + c[1] + "SB" : c[0] ? String(c[0]) : c[1] + "SB"; });
        var same = cs.every(function (x) { return x === cs[0]; });
        return "<div>" + esc(r.name) + ' <span class="status">' + esc(same ? cs[0] + (p.ds.length > 1 ? " each" : "") : cs.join(" · ")) + "</span></div>";
      }).join("");
      var chips = p.ds.map(function (i) { return '<span class="dk" style="--dc:var(' + DECKS[i].v + ')"><i></i>' + esc(DECKS[i].n) + "</span>"; }).join("");
      return '<tr><td class="l">' + cards + '</td><td class="l fdecks">' + chips + '</td><td class="cnt">' + p.cards.length + '</td><td class="cnt">' + p.copies + "</td></tr>";
    }).join("") || '<tr><td class="empty" colspan="4">No two cards are always in the same two or more selected decks.</td></tr>';
    $("pkall").addEventListener("change", function () { pkAll = $("pkall").checked; start(); });
  })();

  // Substitutes
  (function () {
    var CN = { W: "white", U: "blue", R: "red" };
    var inPool = {}; ALLDATA.forEach(function (r) { inPool[r[0]] = 1; });
    var perDeck = DECKS.map(function () { return { cols: {}, cards: [] }; }), list = [];
    rows.forEach(function (r) {
      var o = OFFCOLOR[r.name]; if (!o || NOSUB[r.name]) return;
      var ds = [];
      r.tot.forEach(function (t, i) {
        if (!t) return;
        var keep = KEEPCOLORS[DECKS[i].n] || "", need = o.c.split("").filter(function (c) { return keep.indexOf(c) < 0; });
        if (!need.length) return;
        ds.push(i); need.forEach(function (c) { perDeck[i].cols[c] = 1; }); perDeck[i].cards.push(r.name);
      });
      if (ds.length) list.push({ r: r, o: o, ds: ds });
    });
    list.sort(function (a, b) { return b.ds.length - a.ds.length || a.o.l - b.o.l || a.r.name.localeCompare(b.r.name); });
    var clean = DECKS.filter(function (d, i) { return !perDeck[i].cards.length; }).map(function (d) { return d.n; });
    $("sbxsum").textContent = list.length + (list.length === 1 ? " card needs" : " cards need") + " colors beyond black and green in the selected decks. " +
      (clean.length ? "Already black and green only (apart from kept colors): " + clean.join(", ") + "." : "");
    $("sbxdecks").innerHTML = DECKS.map(function (d, i) {
      var p = perDeck[i], cols = Object.keys(p.cols).map(function (c) { return CN[c]; }).join(", ");
      return '<tr><td class="l"><span class="dk" style="--dc:var(' + d.v + ')"><i></i>' + esc(d.n) + '</span></td><td class="l">' + (cols ? esc(cols) : "none") +
        (KEEPCOLORS[d.n] ? ' <span class="status">(keeps ' + CN[KEEPCOLORS[d.n]] + ")</span>" : "") + '</td><td class="l">' + (p.cards.length ? p.cards.length + ": " + esc(p.cards.join(", ")) : "–") + "</td></tr>";
    }).join("");
    var fgSaved = 0;
    $("fgbody").innerHTML = FGROUPS.map(function (g) {
      var cs = g.c.map(function (n) { return rows.filter(function (r) { return r.name === n; })[0]; }).filter(function (r) { return r && r.decks; });
      if (cs.length < 2) return "";
      var now = 0, per = DECKS.map(function () { return 0; });
      cs.forEach(function (r) { now += Math.max.apply(null, r.tot); r.tot.forEach(function (t, i) { per[i] += t; }); });
      var one = Math.max.apply(null, per), k = g.k || 1;
      var ranked = cs.filter(function (r) { return !OFFCOLOR[r.name]; }).sort(function (a, b) {
        var sa = a.tot.reduce(function (x, y) { return x + y; }, 0), sb2 = b.tot.reduce(function (x, y) { return x + y; }, 0);
        return b.decks - a.decks || sb2 - sa || a.name.localeCompare(b.name); });
      var picks = [], alt = g.alt || {}, cost = function (n) { return alt[n] ? alt[n][0] : g.mv[n]; };
      if (k > 1) {
        [1, 2].forEach(function (v) { var r = ranked.filter(function (x) { return cost(x.name) === v; })[0]; if (r && picks.length < k) picks.push(r); });
        ranked.forEach(function (r) { if (picks.length < k && picks.indexOf(r) < 0 && !picks.some(function (q) { return cost(q.name) === cost(r.name); })) picks.push(r); });
      } else if (ranked[0]) picks.push(ranked[0]);
      if (cs.length <= k) return "";
      fgSaved += Math.max(0, now - Math.max(one, 0));
      var list = cs.map(function (r) {
        var dl = []; r.tot.forEach(function (t, i) { if (t) dl.push('<span class="dk" style="--dc:var(' + DECKS[i].v + ')"><i></i>' + esc(DECKS[i].n) + " ×" + t + "</span>"); });
        return '<div class="fgc"><b>' + esc(r.name) + "</b>" + (OFFCOLOR[r.name] ? ' <span class="status">needs ' + esc(OFFCOLOR[r.name].c) + "</span>" : "") + "<br>" + dl.join("") + "</div>";
      }).join("");
      return '<tr><td class="l">' + esc(g.n) + '<div class="status">' + esc(g.t.join(", ")) + (g.x.length ? "; not counted: " + esc(g.x.join(", ")) : "") + '</div></td><td class="l fdecks">' + list +
        '</td><td class="big">' + now + '</td><td class="big">' + one + (one > 4 * k ? ' <span class="status">(over ' + 4 * k + ")</span>" : "") + (k > 1 ? ' <span class="status">with ' + k + " cards</span>" : "") +
        '</td><td class="l">' + (picks.length ? picks.map(function (r) { return "<div>" + esc(r.name) + ' <span class="status">MV ' + g.mv[r.name] + (alt[r.name] ? ", " + esc(alt[r.name][1]) : "") + "</span></div>"; }).join("") : "–") + "</td></tr>";
    }).join("") || '<tr><td class="empty" colspan="5">No function has two or more different cards in the selected decks.</td></tr>';
    $("fgsum").textContent = "Playing one card per job instead of several would save up to " + fgSaved + " physical cards across the selected decks.";
    function draw() {
      var q = $("sbxq").value.trim().toLowerCase();
      $("sbxbody").innerHTML = list.filter(function (x) { return !q || x.r.name.toLowerCase().indexOf(q) >= 0; }).map(function (x) {
        var o = x.o, sug;
        if (o.l) sug = '<span class="status">Swamp or a black/green land, once the deck has no other ' + esc(o.c.split("").map(function (c) { return CN[c]; }).join(" or ")) + " cards</span>";
        else if (o.s && o.s.length) sug = o.s.map(function (z) { return "<div>" + (inPool[z[0]] ? "★ " : "") + esc(z[0]) + ' <span class="status">' + esc(z[1]) + "</span></div>"; }).join("") +
          '<div class="status">tags: ' + esc((o.t || []).join(", ")) + "</div>";
        else sug = '<span class="status">No Scryfall tag match; add your own</span>';
        var chips = x.ds.map(function (i) { return '<span class="dk" style="--dc:var(' + DECKS[i].v + ')"><i></i>' + esc(DECKS[i].n) + "</span>"; }).join("");
        var mine = S.subs && S.subs[x.r.name] || "";
        return '<tr><td class="l">' + esc(x.r.name) + '</td><td class="cnt">' + esc(o.c) + '</td><td class="l fdecks">' + chips + '</td><td class="l">' + sug +
          '</td><td class="l"><textarea data-sub="' + esc(x.r.name) + '" rows="2" aria-label="Your substitutes for ' + esc(x.r.name) + '">' + esc(mine) + "</textarea></td></tr>";
      }).join("") || '<tr><td class="empty" colspan="5">Every selected deck is black and green only.</td></tr>';
    }
    draw();
    $("sbxq").addEventListener("input", draw);
    $("sbxbody").addEventListener("change", function (e) {
      var t = e.target.closest("textarea[data-sub]"); if (!t) return;
      S.subs = S.subs || {}; var v = t.value.trim().slice(0, 500);
      if (v) S.subs[t.dataset.sub] = v; else delete S.subs[t.dataset.sub];
      persist();
    });
  })();

  // Fetch optimizer report
  (function () {
    $("othr").value = optThr;
    $("oapply").setAttribute("aria-pressed", useOpt ? "true" : "false");
    var fmt = function (o) {
      var l = an.names.filter(function (n) { return o[n]; }).map(function (n) { return o[n] + " " + n; });
      return l.length ? l.join(", ") : "none";
    };
    $("obody").innerHTML = an.decks.map(function (d) {
      var nd = d.need.map(function (c) {
        var w = d.why[c], bits = [Math.round(w.share) + "%"];
        if (w.dbl) bits.push("double " + CNAME[c] + " cards");
        return CNAME[c] + " (" + bits.join(", ") + ")";
      }).join("; ") || "nothing, Swamp fetches only";
      var a = fmt(d.after), b = fmt(d.before);
      var shs = NEEDC.filter(function (c) { return d.why[c].share > 0; }).map(function (c) { return CNAME[c] + " " + Math.round(d.why[c].share) + "%"; }).join(", ") || "black or colorless only";
      return "<tr><td class=\"l\">" + esc(ALLDECKS[d.i].n) + "</td><td class=\"l\">" + esc(shs) + "</td><td class=\"l\">" + esc(nd) + "</td><td class=\"l\">" + esc(b) +
        "</td><td class=\"l\">" + esc(a === b ? a + " (unchanged)" : a) + "</td></tr>";
    }).join("") || '<tr><td class="empty" colspan="5">None of the selected decks play a fetch land that finds a Swamp.</td></tr>';
    $("opool").innerHTML = an.names.filter(function (n) { return an.poolBefore[n] || an.poolAfter[n]; }).map(function (n) {
      return "<tr><td class=\"l\">" + esc(n) + "</td><td>" + CNAME[FETCH[n]] + "</td><td class=\"big\">" + an.poolBefore[n] + "</td><td class=\"big\">" + an.poolAfter[n] + "</td></tr>";
    }).join("");
    var fb = an.names.reduce(function (a, n) { return a + an.poolBefore[n]; }, 0), fa = an.names.reduce(function (a, n) { return a + an.poolAfter[n]; }, 0);
    var o2 = {};
    an.decks.forEach(function (d) { an.names.forEach(function (n) { o2[n + "|" + d.i] = d.after[n]; }); });
    var pb = poolPhys(ALLDATA, AI, null), pa = poolPhys(ALLDATA, AI, o2);
    $("osummary").textContent = "Fetch lands in the pool: " + fb + " now, " + fa + " optimized (" + (fa - fb) + "). Physical cards for the selected decks without basics: " + pb + " now, " + pa + " optimized (" + (pa - pb) + ").";
    $("othr").addEventListener("change", function (e) {
      var v = parseInt(e.target.value, 10);
      optThr = isFinite(v) ? Math.max(1, Math.min(60, v)) : optThr; start();
    });
    $("oapply").addEventListener("click", function () { useOpt = !useOpt; start(); });
  })();

  // Trial cards
  var TRIAL = (function () {
    var p = parseList((S && S.trial) || ""), o = {};
    [p.main, p.side].forEach(function (m) { Object.keys(m).forEach(function (n) { o[n] = (o[n] || 0) + m[n]; }); });
    return Object.keys(o).sort(function (a, b) { return a.localeCompare(b); }).map(function (n) { return [n, o[n]]; });
  })();
  (function () {
    var all = {}; ALLDATA.forEach(function (r) { all[r[0]] = r; });
    $("trtext").value = (S && S.trial) || "";
    $("trbody").innerHTML = TRIAL.map(function (t) {
      var r = all[t[0]], ds = [];
      if (r) ALLDECKS.forEach(function (d, i) { if (r[i + 1][0] + r[i + 1][1]) ds.push(d.n); });
      return '<tr><td class="l">' + esc(t[0]) + '</td><td class="cnt">' + t[1] + '</td><td class="l">' + (ds.length ? esc(ds.join(", ")) + ' <span class="status">(trial copies are extra)</span>' : "–") + "</td></tr>";
    }).join("") || '<tr><td class="empty" colspan="3">No trial cards yet.</td></tr>';
    $("trsave").addEventListener("click", function () {
      S.trial = $("trtext").value.slice(0, 20000); persist();
      var n = parseList(S.trial); start();
      $("trstatus").textContent = "Saved " + (Object.keys(n.main).length + Object.keys(n.side).length) + " cards";
    });
  })();

  // Markdown checklist
  (function () {
    var BAS = ["Swamp", "Island", "Plains", "Mountain", "Forest"];
    var MKS = {};
    rows.forEach(function (r) { MKS[r.name] = marksOf(r).map(function (i) { return DECKS[i].cn; }).join(", "); });
    var legend = DECKS.map(function (d, i) { return i; }).sort(function (a, b) { return MRANK[AI[a]] - MRANK[AI[b]]; })
      .map(function (i) { return DECKS[i].cn + " = " + DECKS[i].n; }).join("; ");
    var common = [], shared = [], uniq = DECKS.map(function () { return []; });
    rows.forEach(function (r) {
      var order = r.tot.map(function (t, i) { return [t, i]; }).sort(function (x, y) { return y[0] - x[0]; });
      var a1 = order[0][0], a2 = order[1] ? order[1][0] : 0;
      var cm = Math.min.apply(null, r.tot);
      if (cm > 0) common.push([r.name, cm]);
      if (a2 - cm > 0) {
        var users = [];
        r.tot.forEach(function (t, i) { if (t > cm) users.push(DECKS[i].n); });
        shared.push([r.name, a2 - cm, users.join(", ")]);
      }
      if (a1 - a2 > 0) uniq[order[0][1]].push([r.name, a1 - a2]);
    });
    function count(items) { return items.reduce(function (a, x) { return a + x[1]; }, 0); }
    function sec(title, items) {
      var n = count(items);
      var out = ["## " + title + " (" + n + (n === 1 ? " card" : " cards") + ")", ""];
      if (!items.length) out.push("_None._");
      items.forEach(function (x) { out.push("- [ ] " + x[1] + " " + x[0] + (x[2] ? " (" + x[2] + ")" : "") + (MKS[x[0]] ? " · Marks: " + MKS[x[0]] : "")); });
      return out.join("\n");
    }
    var byName2 = function (x, y) { return x[0].localeCompare(y[0]); };
    var all = common.concat(shared, [].concat.apply([], uniq));
    var basics = all.filter(function (x) { return BAS.indexOf(x[0]) >= 0; });
    var total = count(all), nb = count(basics), ntr = count(TRIAL);
    var parts = ["# Card checklist", "", "Decks: " + DECKS.map(function (d) { return d.n; }).join(", "), "",
      "Marker colors, in marking order: " + legend, "",
      "**Total physical cards: " + (total + ntr) + "** (" + (total - nb) + " without basic lands, " + nb + " basic lands" + (ntr ? ", " + ntr + " trial cards" : "") + ")", ""];
    parts.push(sec("Common to all decks", common.sort(byName2)), "");
    parts.push(sec("Shared by some decks", shared.sort(byName2)), "");
    DECKS.forEach(function (d, i) { parts.push(sec(d.n + " only", uniq[i].sort(byName2)), ""); });
    if (TRIAL.length) parts.push(sec("Trial cards (not in a deck yet)", TRIAL.slice()), "");
    if (TOKENS.length) {
      parts.push("## Tokens (" + TOKENS.length + ", not counted in the totals)", "");
      TOKENS.slice().sort(function (a, b) { return a[0].localeCompare(b[0]); }).forEach(function (t) {
        var ml = tokMarks(t);
        parts.push("- [ ] " + t[0] + " (" + ml.map(function (i) { return DECKS[i].n; }).join(", ") + ") · Marks: " + ml.map(function (i) { return DECKS[i].cn; }).join(", "));
      });
      parts.push("");
    }
    var pc = {};
    rows.forEach(function (r) { var m = Math.max.apply(null, r.tot); if (m > 0) pc[r.name] = m; });
    TRIAL.forEach(function (t) { pc[t[0]] = (pc[t[0]] || 0) + t[1]; });
    var plain = Object.keys(pc).map(function (n) { return [n, pc[n]]; })
      .sort(byName2).map(function (x) { return x[1] + " " + x[0]; }).join("\n") + "\n";
    $("cltext").value = clFmt === "plain" ? plain : parts.join("\n").replace(/\n+$/, "") + "\n";
    Array.prototype.forEach.call($("clfmt").querySelectorAll("button"), function (b) { b.setAttribute("aria-pressed", b.dataset.fmt === clFmt ? "true" : "false"); });
    $("clfmt").addEventListener("click", function (e) { var b = e.target.closest("button[data-fmt]"); if (!b) return; clFmt = b.dataset.fmt; start(); });
    $("clcopy").addEventListener("click", function () {
      var done = function (m) { $("clstatus").textContent = m; setTimeout(function () { $("clstatus").textContent = ""; }, 1800); };
      try {
        navigator.clipboard.writeText($("cltext").value).then(function () { done("Copied"); }, function () { $("cltext").select(); done("Copy blocked here, text selected"); });
      } catch (err) { $("cltext").select(); done("Copy blocked here, text selected"); }
    });
  })();

  // Smallest three-deck card pool
  var BASICS = ["Swamp", "Island", "Plains", "Mountain", "Forest"];
  var byName = {};
  rows.forEach(function (r) { byName[r.name] = r; });
  var K = Math.min(3, DECKS.length);
  var budget = 0;
  var NA = 1;
  function maxOf(r, cb) { var m = 0; cb.forEach(function (d) { if (r.tot[d] > m) m = r.tot[d]; }); return m; }
  function distinct(cb, key) { var seen = {}; cb.forEach(function (d) { seen[DECKS[d][key]] = 1; }); return Object.keys(seen).length; }
  function atN(p, n) {
    p.an = p.an || {};
    if (p.an[n]) return p.an[n];
    var phys = 0, btot = 0;
    rows.forEach(function (r) {
      var c = p.cb.map(function (d) { return r.tot[d]; }).sort(function (x, y) { return y - x; });
      var need = 0; for (var j = 0; j < n && j < c.length; j++) need += c[j];
      if (BASICS.indexOf(r.name) >= 0) btot += need; else phys += need;
    });
    return (p.an[n] = { phys: phys, total: phys + btot });
  }
  function nCells(p) {
    if (NA < 2) return "";
    var a = atN(p, NA);
    return '<td class="big">' + a.phys + '</td><td class="big">' + a.total + "</td>";
  }
  function atOnce(p, b) { for (var n = p.cb.length; n > 1; n--) if (p.ms[n] <= b) return n; return 1; }
  function computePools(k) {
    var out = [];
    (function pick(start, cb) {
      if (cb.length === k) {
        var phys = 0, uniq = 0, sum = 0, btot = 0, bas = [];
        rows.forEach(function (r) {
          if (BASICS.indexOf(r.name) >= 0) return;
          var m = maxOf(r, cb);
          if (m) { phys += m; uniq++; cb.forEach(function (d) { sum += r.tot[d]; }); }
        });
        BASICS.forEach(function (n) {
          var r = byName[n]; if (!r) return;
          var m = maxOf(r, cb);
          if (m) { bas.push(m + " " + n); btot += m; }
        });
        var pm = rows.map(function (r) { return maxOf(r, cb); });
        var ms = [];
        for (var mask = 1; mask < (1 << cb.length); mask++) {
          var sz = 0, sh = 0, mem = [];
          cb.forEach(function (d, j) { if (mask & (1 << j)) { sz++; mem.push(d); } });
          rows.forEach(function (r, ri) {
            var sm = 0; mem.forEach(function (d) { sm += r.tot[d]; });
            if (sm > pm[ri]) sh += sm - pm[ri];
          });
          if (ms[sz] === undefined || sh < ms[sz]) ms[sz] = sh;
        }
        out.push({ ms: ms, extra: ms[cb.length], cb: cb.slice(), phys: phys, btot: btot, total: phys + btot, uniq: uniq, sum: sum, shared: sum - phys, bas: bas, ns: distinct(cb, "s"), nb: distinct(cb, "b") });
        return;
      }
      for (var d = start; d < DECKS.length; d++) { cb.push(d); pick(d + 1, cb); cb.pop(); }
    })(0, []);
    return out;
  }
  var pools = computePools(K);
  // Color distribution
  var SEG = [["W", "White"], ["U", "Blue"], ["B", "Black"], ["R", "Red"], ["G", "Green"], ["M", "Multicolor"], ["C", "Colorless"]];
  var cs = { view: "chart", scope: "both", scale: "count" };
  function zeroT() { return { W: 0, U: 0, B: 0, R: 0, G: 0, M: 0, C: 0, L: 0 }; }
  function copies(r, i) { return cs.scope === "main" ? r.c[i][0] : cs.scope === "side" ? r.c[i][1] : r.tot[i]; }
  function tallyDeck(i) {
    var t = zeroT();
    rows.forEach(function (r) { var n = copies(r, i); if (n) t[COLORS[r.name]] += n; });
    return t;
  }
  function tallyPool(cb) {
    var t = zeroT();
    rows.forEach(function (r) {
      if (BASICS.indexOf(r.name) >= 0) return;
      var n = 0; cb.forEach(function (d) { n = Math.max(n, copies(r, d)); });
      if (n) t[COLORS[r.name]] += n;
    });
    return t;
  }
  function nonland(t) { return SEG.reduce(function (a, s) { return a + t[s[0]]; }, 0); }
  function tableHTML(list) {
    var h = '<div class="tablewrap"><table class="ctable"><thead><tr><th scope="col" class="l">Deck or pool</th>';
    SEG.forEach(function (s) { h += '<th scope="col"><span class="dot" style="background:var(--c' + s[0] + ')"></span>' + s[1] + "</th>"; });
    h += '<th scope="col">Nonland</th><th scope="col">Lands</th></tr></thead><tbody>';
    list.forEach(function (r) {
      h += "<tr><td>" + esc(r.label) + "</td>";
      SEG.forEach(function (s) { h += "<td>" + (r.t[s[0]] || "–") + "</td>"; });
      h += '<td class="big">' + nonland(r.t) + "</td><td>" + r.t.L + (r.pool ? " + basics" : "") + "</td></tr>";
    });
    return h + "</tbody></table></div>";
  }
  function drawChart(el, list) {
    if (cs.view === "table") { el.innerHTML = tableHTML(list); return; }
    var max = Math.max.apply(null, list.map(function (r) { return nonland(r.t); }).concat([1]));
    el.innerHTML = list.map(function (r) {
      var tot = nonland(r.t);
      var width = cs.scale === "percent" ? 100 : tot / max * 100;
      var segs = SEG.filter(function (sg) { return r.t[sg[0]]; }).map(function (sg) {
        var n = r.t[sg[0]];
        return '<span class="seg" tabindex="0" role="img" data-k="' + sg[0] + '" data-n="' + n + '" data-t="' + tot +
          '" aria-label="' + sg[1] + ": " + n + " of " + tot + ' nonland cards" style="flex:' + n + " 1 0px;background:var(--c" + sg[0] +
          ");color:var(--on" + sg[0] + ')"><b>' + n + "</b></span>";
      }).join("");
      return '<div class="crow"><div class="cname">' + esc(r.label) + '</div><div class="cbarwrap"><div class="cbarbox"><div class="cbar" style="width:' + width + '%">' + segs +
        '</div></div><span class="ctot">' + tot + " nonland · " + r.t.L + (r.pool ? " lands + basics" : " lands") + "</span></div></div>";
    }).join("");
  }
  function fitLabels() {
    Array.prototype.forEach.call(root.querySelectorAll(".colors .seg"), function (sg) {
      var b = sg.firstChild;
      b.style.visibility = "visible";
      if (sg.clientWidth < b.getBoundingClientRect().width + 10) b.style.visibility = "hidden";
    });
  }
  fitLabelsFn = fitLabels;
  function renderColors(poolList) {
    drawChart($("chartdecks"), DECKS.map(function (d, i) { return { label: d.n, t: tallyDeck(i) }; }));
    drawChart($("chartpools"), poolList.map(function (p) {
      return { label: p.cb.map(function (d) { return DECKS[d].n; }).join(" + "), t: tallyPool(p.cb), pool: true };
    }));
    requestAnimationFrame(fitLabels);
  }
  $("clegend").innerHTML = SEG.map(function (sg) { return '<span class="lg"><i style="background:var(--c' + sg[0] + ')"></i>' + sg[1] + "</span>"; }).join("");
  var lastPoolList = [];
  function makeToggle(id, key, opts) {
    opts.forEach(function (o) {
      var bt = document.createElement("button");
      bt.type = "button"; bt.textContent = o[1]; bt.dataset.v = o[0];
      bt.setAttribute("aria-pressed", cs[key] === o[0] ? "true" : "false");
      $(id).appendChild(bt);
    });
    $(id).addEventListener("click", function (e) {
      var bt = e.target.closest("button[data-v]"); if (!bt) return;
      cs[key] = bt.dataset.v;
      Array.prototype.forEach.call($(id).querySelectorAll("button"), function (x) { x.setAttribute("aria-pressed", x === bt ? "true" : "false"); });
      renderColors(lastPoolList);
    });
  }
  makeToggle("cview", "view", [["chart", "Chart"], ["table", "Table"]]);
  makeToggle("cscope", "scope", [["both", "Main + sideboard"], ["main", "Main deck"], ["side", "Sideboard"]]);
  makeToggle("cscale", "scale", [["count", "Card count"], ["percent", "Percent"]]);
  Array.prototype.forEach.call(root.querySelectorAll(".ctip"), function (o) { o.remove(); });
  var tip = document.createElement("div");
  tip.className = "ctip"; tip.hidden = true; root.appendChild(tip); tip0 = tip;
  function showTip(sg, x, y) {
    var n = +sg.dataset.n, t = +sg.dataset.t, name = SEG.filter(function (q) { return q[0] === sg.dataset.k; })[0][1];
    tip.textContent = "";
    var st = document.createElement("strong"); st.textContent = String(n);
    tip.appendChild(st);
    tip.appendChild(document.createTextNode(" " + name + " · " + Math.round(n / t * 100) + "% of nonland cards"));
    tip.hidden = false;
    var w = tip.offsetWidth, h = tip.offsetHeight;
    tip.style.left = Math.max(8, Math.min(x + 12, window.innerWidth - w - 8)) + "px";
    tip.style.top = (y - h - 12 < 8 ? y + 18 : y - h - 12) + "px";
  }
  var csec = root.querySelector(".colors");
  csec.addEventListener("pointermove", function (e) { var sg = e.target.closest(".seg"); if (sg) showTip(sg, e.clientX, e.clientY); else tip.hidden = true; });
  csec.addEventListener("pointerleave", function () { tip.hidden = true; });
  csec.addEventListener("focusin", function (e) { var sg = e.target.closest(".seg"); if (sg) { var r = sg.getBoundingClientRect(); showTip(sg, r.left + r.width / 2, r.top); } });
  csec.addEventListener("focusout", function () { tip.hidden = true; });

  var showAll = false;
  var mode = "balance";
  var MODES = [["balance", "Best balance"], ["smallest", "Smallest pool"], ["total", "Smallest total"], ["diverse", "Most diverse"], ["least", "Least overlap"], ["once", "Most built at once"]];
  function dominated(p) {
    return pools.some(function (o) {
      return o !== p && o.ns >= p.ns && o.nb >= p.nb && o.phys <= p.phys &&
        (o.ns > p.ns || o.nb > p.nb || o.phys < p.phys);
    });
  }
  function ordered() {
    var l = pools.slice();
    if (mode === "balance") l = l.filter(function (p) { return !dominated(p); });
    l.sort(function (x, y) {
      if (mode === "once") return atOnce(y, budget) - atOnce(x, budget) || x.extra - y.extra || x.total - y.total;
      if (mode === "least") return x.shared - y.shared || y.ns - x.ns || x.phys - y.phys;
      if (mode === "total") return (NA > 1 ? atN(x, NA).total - atN(y, NA).total : 0) || x.total - y.total || x.uniq - y.uniq;
      if (mode === "smallest") return (NA > 1 ? atN(x, NA).phys - atN(y, NA).phys : 0) || x.phys - y.phys || x.uniq - y.uniq;
      return y.ns - x.ns || y.nb - x.nb || x.phys - y.phys || x.uniq - y.uniq;
    });
    return l;
  }
  function drawAtOnce() {
    var box = $("atonce");
    Array.prototype.forEach.call(box.querySelectorAll("button"), function (b) { b.remove(); });
    for (var n = 1; n <= K; n++) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = String(n); b.dataset.n = String(n);
      b.setAttribute("aria-label", n + (n === 1 ? " deck" : " decks") + " built at once");
      b.setAttribute("aria-pressed", n === NA ? "true" : "false");
      box.appendChild(b);
    }
  }
  $("atonce").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-n]"); if (!b) return;
    NA = +b.dataset.n; drawAtOnce(); renderPool();
  });
  function renderPool() {
    $("thn1").hidden = $("thn2").hidden = NA < 2;
    $("thn1").textContent = "Cards, " + NA + " at once, no basics";
    $("thn2").textContent = "Total with basics, " + NA + " at once";
    var all = ordered();
    var list = showAll && mode !== "balance" ? all : all.slice(0, 5);
    $("poolbody").innerHTML = list.map(function (p, i) {
      return "<tr" + (i === 0 ? ' class="best"' : "") + '><td class="rk">' + (i + 1) + '</td><td class="combo">' +
        p.cb.map(function (d) { return '<span class="dk" style="--dc:var(' + DECKS[d].v + ')"><i></i>' + esc(DECKS[d].n) + "</span>"; }).join("") +
        '</td><td class="big">' + p.ns + '</td><td class="big">' + p.nb + '</td><td class="big">' + p.phys + '</td><td class="big">' + p.total + '</td>' + nCells(p) + '<td class="big">' + p.uniq + '</td><td class="big">' + p.shared + ' <span class="pct">(' + Math.round(p.shared / p.sum * 100) + '%)</span></td><td class="big">' + atOnce(p, budget) + ' <span class="pct">of ' + p.cb.length + '</span></td><td class="big">' + p.extra + '</td><td class="bas">' + esc(p.bas.join(", ")) + "</td></tr>";
    }).join("");
    $("poolmore").hidden = mode === "balance" || all.length <= 5;
    $("poolmore").textContent = showAll ? "Show top 5 only" : "Show all " + all.length + " combinations";
    lastPoolList = list;
    renderColors(list);
  }
  $("poolmore").addEventListener("click", function () { showAll = !showAll; renderPool(); });
  for (var kk = 2; kk <= DECKS.length; kk++) {
    var kb = document.createElement("button");
    kb.type = "button"; kb.textContent = String(kk); kb.dataset.k = String(kk);
    kb.setAttribute("aria-label", kk + " decks per set");
    kb.setAttribute("aria-pressed", kk === K ? "true" : "false");
    $("poolsize").appendChild(kb);
  }
  $("budget").addEventListener("input", function (e) {
    budget = Math.max(0, parseInt(e.target.value, 10) || 0);
    renderPool();
  });
  $("poolsize").addEventListener("click", function (e) {
    var kb2 = e.target.closest("button[data-k]"); if (!kb2) return;
    K = +kb2.dataset.k; pools = computePools(K); showAll = false; NA = Math.min(NA, K); drawAtOnce();
    Array.prototype.forEach.call($("poolsize").querySelectorAll("button"), function (x) { x.setAttribute("aria-pressed", x === kb2 ? "true" : "false"); });
    renderPool();
  });
  MODES.forEach(function (m) {
    var bt = document.createElement("button");
    bt.type = "button"; bt.textContent = m[1]; bt.dataset.mode = m[0];
    bt.setAttribute("aria-pressed", m[0] === mode ? "true" : "false");
    $("poolmodes").appendChild(bt);
  });
  $("poolmodes").addEventListener("click", function (e) {
    var bt = e.target.closest("button[data-mode]"); if (!bt) return;
    mode = bt.dataset.mode;
    Array.prototype.forEach.call($("poolmodes").querySelectorAll("button"), function (x) {
      x.setAttribute("aria-pressed", x === bt ? "true" : "false");
    });
    renderPool();
  });
  drawAtOnce();
  renderPool();

  render();
  }

  // ---- Runtime deck store: defaults, localStorage, editor, import/export ----
  var MPAL = [["#d62828", "Red"], ["#f77f00", "Orange"], ["#f6c90e", "Yellow"], ["#7bc043", "Light green"], ["#1a7f37", "Dark green"], ["#0fa3a3", "Teal"],
    ["#4cc9f0", "Light blue"], ["#1d4ed8", "Blue"], ["#7b2cbf", "Purple"], ["#f15bb5", "Pink"], ["#8b5a2b", "Brown"], ["#8d99ae", "Gray"],
    ["#ffffff", "White"], ["#111111", "Black"], ["#c0c0c0", "Silver"], ["#c9a227", "Gold"]];
  var MORD = [];
  function hslOf(hex) {
    var r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn, h = 0, sat = 0;
    if (d) {
      sat = d / (1 - Math.abs(2 * l - 1));
      h = mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
    }
    return [h, sat, l];
  }
  // Spectrum order: chromatic colors by hue (red, orange, yellow, green, blue, violet, pink), then neutrals light to dark.
  function specCmp(a, b) {
    var x = hslOf(a), y = hslOf(b), nx = x[1] < 0.2, ny = y[1] < 0.2;
    if (nx !== ny) return nx ? 1 : -1;
    if (nx) return y[2] - x[2];
    return x[0] - y[0] || x[2] - y[2];
  }
  function nextColor(skip) {
    var used = {};
    S.decks.forEach(function (d, i) { if (d.col && i !== skip) used[d.col] = 1; });
    for (var k = 0; k < MPAL.length; k++) if (!used[MPAL[k][0]]) return MPAL[k];
    return MPAL[S.decks.length % MPAL.length];
  }
  function palName(hex) { for (var k = 0; k < MPAL.length; k++) if (MPAL[k][0] === hex) return MPAL[k][1]; return hex; }
  var KEY = "mtg-deck-matrix-v1", S = null, storageOK = true, DL = null, cur = 0;
  var PAL = ["--y", "--g", "--d", "--e", "--r", "--w", "--s", "--z", "--m", "--ua", "--ub", "--uc"];
  var BASICSET = { Swamp: 1, Island: 1, Plains: 1, Mountain: 1, Forest: 1 };
  var LINE = /^(\d+)x?\s+(.*?)(?:\s+\([A-Za-z0-9]+\)\s+\S+(?:\s+\*\w+\*)?)?\s*$/;
  function str(x, max) { return typeof x === "string" ? x.slice(0, max) : ""; }
  function sumOf(o) { return Object.keys(o).reduce(function (a, k) { return a + o[k]; }, 0); }
  function parseList(text) {
    var main = {}, side = {}, tok = [], mode = "m";
    String(text).split(/\r?\n/).forEach(function (raw) {
      var l = raw.trim();
      // Section headings: "// Sideboard", "[SIDEBOARD]", "Sideboard:", ManaBox-style "Sideboard (15)", and the same for the others
      var head = /^(?:\/\/\s*|\[)?\s*([a-z ]+?)\s*\]?\s*(?:\(\d+\))?\s*:?\s*$/i.exec(l), hw = head ? head[1].toLowerCase() : "";
      if (/^(\/\/\s*|\[)\s*tokens?\b/i.test(l) || hw === "tokens" || hw === "token") { mode = "t"; return; }
      if (/^(\/\/\s*|\[)\s*maybeboard\b/i.test(l) || hw === "maybeboard" || hw === "maybe") { mode = "x"; return; }
      if (hw === "sideboard" || hw === "sb") { mode = "s"; return; }
      if (hw === "deck" || hw === "mainboard" || hw === "main" || hw === "main deck") { mode = "m"; return; }
      var m = LINE.exec(l); if (!m) return;
      var n = canonName(m[2].trim()), c = +m[1]; if (!n || !c) return;
      if (mode === "m") main[n] = (main[n] || 0) + c;
      else if (mode === "s") side[n] = (side[n] || 0) + c;
      else if (mode === "t" && tok.indexOf(n) < 0) tok.push(n);
    });
    return { main: main, side: side, tokens: tok };
  }
  // "Front // Back" (as ManaBox writes double-faced cards) becomes "Front" when only the front-face name is known
  function canonName(n) {
    var k = n.indexOf(" // ");
    if (k < 0 || !S || S.info[n] || BASE_INFO[n]) return n;
    var f = n.slice(0, k);
    return S.info[f] || BASE_INFO[f] ? f : n;
  }
  function toText(p) {
    var a = Object.keys(p.main).map(function (n) { return p.main[n] + " " + n; });
    var b = Object.keys(p.side).map(function (n) { return p.side[n] + " " + n; });
    return a.join("\n") + (b.length ? "\n\nSideboard\n" + b.join("\n") : "");
  }
  var BASE_INFO = {};
  Object.keys(BASE_COLORS).forEach(function (n) {
    var c = BASE_COLORS[n];
    BASE_INFO[n] = { c: c === "L" ? "L" : c === "M" ? BASE_CARDCOLS[n] : c === "C" ? "" : c, d: BASE_DBL[n] || "", k: BASE_COUNTERS[n] || [] };
  });
  function builtinText(i) {
    var m = [], sd = [];
    BASE_DATA.forEach(function (r) { var c = r[i + 1]; if (c[0]) m.push([r[0], c[0]]); if (c[1]) sd.push([r[0], c[1]]); });
    var byName = function (a, b) { return a[0].localeCompare(b[0]); };
    var f = function (x) { return x[1] + " " + x[0]; };
    return m.sort(byName).map(f).join("\n") + (sd.length ? "\n\nSideboard\n" + sd.sort(byName).map(f).join("\n") : "");
  }
  function builtinDeck(i) {
    var d = BASE_DECKS[i];
    return { n: d.n, s: d.s, b: d.b, on: !d.off, col: MPAL[i] ? MPAL[i][0] : null, cn: MPAL[i] ? MPAL[i][1] : "", t: builtinText(i),
      tk: d.tk ? d.tk.slice() : i < 8 ? BASE_TOKENS.filter(function (t) { return t[1][i]; }).map(function (t) { return t[0]; }) : null };
  }
  function defaults() {
    var bh = {};
    BASE_DECKS.forEach(function (d, i) { bh[d.n] = builtinText(i); });
    return { v: 1, info: {}, bh: bh, subs: JSON.parse(JSON.stringify(SUB_SEED)), decks: BASE_DECKS.map(function (d, i) { return builtinDeck(i); }) };
  }
  // Built-in decks added or changed after this browser saved its own copy (decks imported from ManaBox links by Claude).
  // bh remembers each built-in list as last seen: a new built-in is appended unless you already have a deck by that name,
  // and a changed built-in replaces your copy only if you never edited it. Decks you deleted stay deleted.
  var ORIG_BUILTINS = ["Yawgmoth", "Grixis Reanimator", "Darklight Soultrader", "Esper Archon", "Rakdos (Viable)", "Golgari Necro", "Shiptrader", "Zombardment", "Dimir Shadow Aggro", "Dimir Aggro (Shared)", "Grixis Aggro", "Golgari Aggro"];
  function canonList(t) {
    var p = parseList(t), f = function (o) { return Object.keys(o).sort().map(function (n) { return o[n] + " " + n; }).join("\n"); };
    return f(p.main) + "\n--\n" + f(p.side);
  }
  function syncBuiltins() {
    var first = !S.bh, bh = S.bh || {}, added = [], updated = [], changed = false;
    BASE_DECKS.forEach(function (b, i) {
      var bt = builtinText(i), j = -1;
      S.decks.forEach(function (d, k) { if (j < 0 && d.n === b.n) j = k; });
      if (!(b.n in bh)) {
        if (j < 0 && !(first && ORIG_BUILTINS.indexOf(b.n) >= 0) && S.decks.length < 60) {
          var nd = builtinDeck(i); nd.col = null; nd.cn = ""; S.decks.push(nd); added.push(b.n);
        }
      } else if (bh[b.n] !== bt && j >= 0 && canonList(S.decks[j].t) === canonList(bh[b.n])) {
        S.decks[j].t = bt; updated.push(b.n);
      }
      if (bh[b.n] !== bt) { bh[b.n] = bt; changed = true; }
    });
    // Built-in decks that were removed: drop your copy unless you edited it
    var removed = [];
    Object.keys(bh).forEach(function (n) {
      if (BASE_DECKS.some(function (b) { return b.n === n; })) return;
      var j = -1; S.decks.forEach(function (d, k) { if (j < 0 && d.n === n) j = k; });
      if (j >= 0 && S.decks.length > 2 && canonList(S.decks[j].t) === canonList(bh[n])) { S.decks.splice(j, 1); removed.push(n); }
      delete bh[n]; changed = true;
    });
    S.bh = bh;
    if (changed) persist();
    var out = [];
    if (added.length) out.push("Added " + added.join(", "));
    if (updated.length) out.push("Updated " + updated.join(", "));
    if (removed.length) out.push("Removed " + removed.join(", "));
    return out.length ? out.join(". ") + " from the built-in decks." : "";
  }
  function cleanInfo(v) {
    if (!v || typeof v !== "object") return null;
    var c = str(v.c, 12).toUpperCase();
    c = /L/.test(c) ? "L" : c.replace(/[^WUBRG]/g, "").split("").filter(function (x, i, a) { return a.indexOf(x) === i; }).join("");
    var d = str(v.d, 4).toUpperCase().replace(/[^WUBRG]/g, "").slice(0, 1);
    var k = Array.isArray(v.k) ? v.k.map(function (x) { return str(x, 16).trim(); }).filter(Boolean).slice(0, 8) : [];
    return { c: c, d: d, k: k };
  }
  function sanitize(o) {
    if (!o || typeof o !== "object" || !Array.isArray(o.decks) || o.decks.length < 2 || o.decks.length > 60) return null;
    var decks = [];
    for (var i = 0; i < o.decks.length; i++) {
      var d = o.decks[i];
      if (!d || typeof d.n !== "string" || !d.n.trim() || typeof d.t !== "string") return null;
      decks.push({ n: str(d.n, 80).trim(), s: str(d.s, 80), b: str(d.b, 40) || "Other", on: d.on !== false, t: str(d.t, 30000),
        col: typeof d.col === "string" && /^#[0-9a-f]{6}$/i.test(d.col) ? d.col.toLowerCase() : null, cn: str(d.cn, 24).trim(),
        tk: Array.isArray(d.tk) ? d.tk.map(function (x) { return str(x, 80).trim(); }).filter(Boolean).slice(0, 40) : null });
    }
    var info = {};
    if (o.info && typeof o.info === "object") Object.keys(o.info).slice(0, 3000).forEach(function (n) {
      var v = cleanInfo(o.info[n]); if (v && n.length < 120) info[n] = v;
    });
    var bh = null;
    if (o.bh && typeof o.bh === "object") { bh = {}; Object.keys(o.bh).slice(0, 200).forEach(function (n) { if (typeof o.bh[n] === "string") bh[n] = o.bh[n].slice(0, 30000); }); }
    var subs = null;
    if (o.subs && typeof o.subs === "object") { subs = {}; Object.keys(o.subs).slice(0, 500).forEach(function (n) { if (typeof o.subs[n] === "string" && n.length < 120) subs[n] = o.subs[n].slice(0, 500); }); }
    return { v: 1, decks: decks, info: info, bh: bh, subs: subs, trial: typeof o.trial === "string" ? o.trial.slice(0, 20000) : "" };
  }
  function persist() {
    try { host.save(JSON.parse(JSON.stringify(S))); storageOK = true; } catch (e) { storageOK = false; }
  }
  function loadStore() {
    try { var raw = host.load(); if (raw) { var o = sanitize(JSON.parse(JSON.stringify(raw))); if (o) return o; } } catch (e) { storageOK = false; }
    return null;
  }
  function effInfo(n) { return S.info[n] || BASE_INFO[n] || null; }
  function derive() {
    var cards = {};
    S.decks.forEach(function (d, i) {
      var p = parseList(d.t);
      [p.main, p.side].forEach(function (o, k) {
        Object.keys(o).forEach(function (n) {
          if (!cards[n]) cards[n] = S.decks.map(function () { return [0, 0]; });
          cards[n][i][k] += o[n];
        });
      });
    });
    var cnt = function (r) { return r.slice(1).filter(function (x) { return x[0] + x[1] > 0; }).length; };
    ALLDATA = Object.keys(cards).map(function (n) { return [n].concat(cards[n]); });
    ALLDATA.sort(function (a, b) { return cnt(b) - cnt(a) || a[0].toLowerCase().localeCompare(b[0].toLowerCase()); });
    COLORS = {}; CARDCOLS = {}; DBL = {}; COUNTERS = {}; UNK = [];
    Object.keys(cards).forEach(function (n) {
      var inf = effInfo(n);
      if (!inf) { UNK.push(n); inf = { c: "", d: "", k: [] }; }
      if (inf.c === "L") COLORS[n] = "L";
      else {
        var ls = inf.c.replace(/[^WUBRG]/g, "");
        COLORS[n] = ls.length > 1 ? "M" : ls.length === 1 ? ls : "C"; CARDCOLS[n] = ls;
      }
      if (inf.d) DBL[n] = inf.d;
      if (inf.k && inf.k.length) COUNTERS[n] = inf.k;
    });
    UNK.sort(function (a, b) { return a.localeCompare(b); });
    var tm = {};
    S.decks.forEach(function (d, i) {
      (d.tk || []).forEach(function (t) { if (!tm[t]) tm[t] = S.decks.map(function () { return 0; }); tm[t][i] = 1; });
    });
    TOKROWS = Object.keys(tm).sort(function (a, b) { return a.localeCompare(b); }).map(function (t) { return [t, tm[t]]; });
    S.decks.forEach(function (d, i) {
      if (!d.col) { var c = nextColor(i); d.col = c[0]; if (!d.cn) d.cn = c[1]; }
      if (!d.cn) d.cn = palName(d.col);
      root.style.setProperty("--dk" + i, d.col);
    });
    ALLDECKS = S.decks.map(function (d, i) { return { n: d.n, v: "--dk" + i, s: d.s, b: d.b, tk: d.tk, col: d.col, cn: d.cn }; });
    MORD = S.decks.map(function (d, i) { return i; }).sort(function (a, b) { return specCmp(S.decks[a].col, S.decks[b].col) || a - b; });
    picked = S.decks.map(function (d) { return !!pickedNames[d.n]; });
  }
  function syncPicked() { pickedNames = {}; S.decks.forEach(function (d, i) { if (picked[i]) pickedNames[d.n] = 1; }); }
  function msg(t) { $("mgrmsg").textContent = t; }
  function commit(note) {
    persist(); derive(); drawPicker(); start(); fillSel(); renderInfo();
    msg(note ? note + (storageOK ? "" : " (not saved: browser storage is unavailable, so export to keep it)") : "");
  }
  function fillSel() {
    var sel = $("msel");
    sel.innerHTML = S.decks.map(function (d, i) { return '<option value="' + i + '">' + esc(d.n) + "</option>"; }).join("");
    if (cur >= S.decks.length) cur = S.decks.length - 1;
    sel.value = String(cur);
  }
  function loadForm() {
    var d = S.decks[cur];
    $("mn").value = d.n; $("ms").value = d.s; $("mb").value = d.b; $("mt").value = d.t; $("mcol").value = d.col; $("mcn").value = d.cn;
    $("mtkon").checked = d.tk !== null; $("mtk").value = (d.tk || []).join("\n"); $("mtk").disabled = d.tk === null;
    checkForm();
  }
  function checkForm() {
    var p = parseList($("mt").value), mt = sumOf(p.main), st = sumOf(p.side), w = [];
    if (mt !== 60) w.push("main deck has " + mt + " cards (60 expected)");
    if (st !== 15 && st !== 0) w.push("sideboard has " + st + " cards (15 expected)");
    var over = Object.keys(p.main).concat(Object.keys(p.side)).filter(function (n, i, a) { return a.indexOf(n) === i && !BASICSET[n] && (p.main[n] || 0) + (p.side[n] || 0) > 4; });
    if (over.length) w.push("more than 4 copies of " + over.join(", "));
    var col = $("mcol").value.toLowerCase(), cn = $("mcn").value.trim().toLowerCase();
    S.decks.forEach(function (d, i) {
      if (i === cur) return;
      if (d.col === col) w.push("same marker color as " + d.n);
      else if (cn && d.cn.toLowerCase() === cn) w.push("same color name as " + d.n);
    });
    $("mcheck").textContent = "Main " + mt + ", sideboard " + st + ". " + (w.length ? "Check: " + w.join("; ") + "." : "No problems found.");
    $("mcheck").className = "note" + (w.length ? " mwarn" : "");
  }
  function sideboardFix(p) { return toText(p); }
  function addDeck(name, text) {
    var p = parseList(text);
    if (!sumOf(p.main) && !sumOf(p.side)) { msg("No card lines found in that list"); return false; }
    if (S.decks.length >= 60) { msg("Deck limit (60) reached"); return false; }
    var nc = nextColor(-1);
    S.decks.push({ n: (name || "").trim().slice(0, 80) || "Imported deck " + (S.decks.length + 1), s: "", b: "Other", on: true, t: toText(p), tk: p.tokens.length ? p.tokens : null, col: nc[0], cn: nc[1] });
    cur = S.decks.length - 1; return true;
  }
  function readForm() {
    var name = $("mn").value.trim();
    if (!name) { msg("Give the deck a name"); return null; }
    var p = parseList($("mt").value);
    var col = /^#[0-9a-f]{6}$/i.test($("mcol").value) ? $("mcol").value.toLowerCase() : S.decks[cur].col;
    return { n: name.slice(0, 80), s: $("ms").value.slice(0, 80), b: $("mb").value.trim().slice(0, 40) || "Other", on: S.decks[cur].on, t: toText(p),
      col: col, cn: $("mcn").value.trim().slice(0, 24) || palName(col),
      tk: $("mtkon").checked ? $("mtk").value.split(/\r?\n/).map(function (x) { return x.trim().slice(0, 80); }).filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 40) : null };
  }
  function infoRow(n) {
    var inf = effInfo(n), unk = !inf; inf = inf || { c: "", d: "", k: [] };
    var tr = document.createElement("tr"); tr.dataset.card = n; if (unk) tr.className = "unk";
    var td = document.createElement("td"); td.className = "l"; td.textContent = n; tr.appendChild(td);
    [["c", inf.c, "WUBRG, C, or L"], ["d", inf.d, "e.g. U"], ["k", inf.k.join(", "), "+1/+1, Loyalty"]].forEach(function (f) {
      var c = document.createElement("td"), i = document.createElement("input");
      i.type = "text"; i.value = f[1]; i.placeholder = f[2]; i.dataset.f = f[0]; i.setAttribute("aria-label", n + " " + f[0]);
      c.appendChild(i); tr.appendChild(c);
    });
    return tr;
  }
  function renderInfo() {
    var q = $("inf").value.trim().toLowerCase(), names = Object.keys(S.info).length;
    $("infsum").textContent = UNK.length ? UNK.length + " card" + (UNK.length === 1 ? " has" : "s have") + " no color info yet and count as colorless until you set it (marked in red below)." : "Every card in these lists has color info.";
    var list = UNK.slice(), seen = {};
    list.forEach(function (n) { seen[n] = 1; });
    if (q) ALLDATA.forEach(function (r) { if (!seen[r[0]] && r[0].toLowerCase().indexOf(q) >= 0 && list.length < 60) list.push(r[0]); });
    var tb = $("infbody"); tb.textContent = "";
    list.slice(0, 80).forEach(function (n) { tb.appendChild(infoRow(n)); });
  }
  function exportJSON() { return JSON.stringify({ app: "mtg-deck-matrix", version: 1, decks: S.decks, info: S.info, bh: S.bh, subs: S.subs, trial: S.trial || "" }, null, 1); }
  function doImport(text, mode) {
    var o;
    try { o = sanitize(JSON.parse(text)); } catch (e) { o = null; }
    if (!o) { msg("Import failed: not a valid deck export (needs at least 2 decks)"); return; }
    if (mode === "merge") {
      o.decks.forEach(function (d) {
        var j = -1; S.decks.forEach(function (x, i) { if (j < 0 && x.n === d.n) j = i; });
        if (j >= 0) S.decks[j] = d; else if (S.decks.length < 60) S.decks.push(d);
      });
      Object.keys(o.info).forEach(function (n) { S.info[n] = o.info[n]; });
      if (o.trial) S.trial = o.trial;
      if (o.subs) { S.subs = S.subs || {}; Object.keys(o.subs).forEach(function (n) { S.subs[n] = o.subs[n]; }); }
    } else S = o;
    cur = 0; loadForm(); commit("Imported " + o.decks.length + " deck" + (o.decks.length === 1 ? "" : "s") + (mode === "merge" ? " (merged)" : " (replaced everything)"));
  }
  function twoClick(btn, label, action) {
    var armed = false, t = null;
    btn.addEventListener("click", function () {
      if (!armed) { armed = true; btn.textContent = "Click again to confirm"; t = setTimeout(function () { armed = false; btn.textContent = label; }, 4000); return; }
      clearTimeout(t); armed = false; btn.textContent = label; action();
    });
  }
  function initMgr() {
    S = loadStore() || defaults();
    var syncNote = syncBuiltins();
    if (!S.subs) { S.subs = JSON.parse(JSON.stringify(SUB_SEED)); persist(); }
    derive();
    if (syncNote) persist();
    DL = host.saveFile ? { save: function (o) { return host.saveFile(o.filename, o.data); } } : null;
    fillSel(); loadForm(); renderInfo();
    if (syncNote) msg(syncNote);
    $("mgrtoggle").addEventListener("click", function () {
      var open = $("mgrbody").hidden; $("mgrbody").hidden = !open;
      $("mgrtoggle").setAttribute("aria-expanded", open ? "true" : "false");
      $("mgrtoggle").textContent = open ? "Hide decklist editor" : "Edit decklists";
      if (open && !storageOK) msg("Browser storage is unavailable here, so edits last only until you close the page. Export to keep them.");
    });
    $("msel").addEventListener("change", function () { cur = +$("msel").value; loadForm(); });
    $("mt").addEventListener("input", checkForm);
    $("mcol").addEventListener("input", function () { var nm = palName($("mcol").value.toLowerCase()); if (nm.charAt(0) !== "#") $("mcn").value = nm; checkForm(); });
    $("mcn").addEventListener("input", checkForm);
    $("mtkon").addEventListener("change", function () { $("mtk").disabled = !$("mtkon").checked; });
    $("mrevert").addEventListener("click", function () { loadForm(); msg("Form reverted"); });
    $("msave").addEventListener("click", function () { var d = readForm(); if (!d) return; if (pickedNames[S.decks[cur].n]) { delete pickedNames[S.decks[cur].n]; pickedNames[d.n] = 1; } S.decks[cur] = d; commit("Saved " + d.n); loadForm(); });
    $("mnew").addEventListener("click", function () {
      if (S.decks.length >= 60) { msg("Deck limit (60) reached"); return; }
      var nc = nextColor(-1);
      S.decks.push({ n: "New deck", s: "", b: "Other", on: false, t: "", tk: null, col: nc[0], cn: nc[1] }); cur = S.decks.length - 1; commit("Added an empty deck"); loadForm(); $("mn").focus();
    });
    $("mdup").addEventListener("click", function () {
      if (S.decks.length >= 60) { msg("Deck limit (60) reached"); return; }
      var d = JSON.parse(JSON.stringify(S.decks[cur])); d.n = (d.n + " (copy)").slice(0, 80); d.on = false;
      var nc = nextColor(-1); d.col = nc[0]; d.cn = nc[1];
      S.decks.push(d); cur = S.decks.length - 1; commit("Duplicated"); loadForm();
    });
    twoClick($("mdel"), "Delete", function () {
      if (S.decks.length <= 2) { msg("Keep at least 2 decks"); return; }
      var n = S.decks[cur].n; S.decks.splice(cur, 1); cur = Math.max(0, cur - 1); commit("Deleted " + n); loadForm();
    });
    $("lpaste").addEventListener("click", function () {
      if ($("mgrbody").hidden) $("mgrtoggle").click();
      var box = $("lt"), done = function (t) {
        if (t && t.trim()) { box.value = t; $("lname").focus(); $("lname").scrollIntoView({ block: "center" }); msg("Pasted. Give it a name, then tap Add as new deck."); }
        else { box.focus(); box.scrollIntoView({ block: "center" }); msg("Clipboard is blocked here: tap and hold the box below, choose Paste, then tap Add as new deck."); }
      };
      try { navigator.clipboard.readText().then(done, function () { done(""); }); } catch (e) { done(""); }
    });
    $("ladd").addEventListener("click", function () {
      if (addDeck($("lname").value, $("lt").value)) { var n = S.decks[cur].n; $("lt").value = ""; $("lname").value = ""; commit("Added " + n); loadForm(); }
    });
    $("lfile").addEventListener("change", function () {
      var files = Array.prototype.slice.call($("lfile").files || []).slice(0, 20), left = files.length, added = 0;
      if (!left) return;
      files.forEach(function (f) {
        var r = new FileReader();
        r.onload = function () { if (addDeck(f.name.replace(/\.[^.]+$/, "").replace(/[_]+/g, " "), String(r.result).slice(0, 200000))) added++; if (--left === 0) { $("lfile").value = ""; commit("Loaded " + added + " of " + files.length + " file" + (files.length === 1 ? "" : "s")); loadForm(); } };
        r.onerror = function () { if (--left === 0) { commit("Loaded " + added + " of " + files.length + " files"); loadForm(); } };
        r.readAsText(f);
      });
    });
    $("inf").addEventListener("input", renderInfo);
    $("infbody").addEventListener("change", function (e) {
      var tr = e.target.closest("tr[data-card]"); if (!tr) return;
      var v = {};
      Array.prototype.forEach.call(tr.querySelectorAll("input"), function (i) { v[i.dataset.f] = i.value; });
      v.k = v.k.split(",");
      S.info[tr.dataset.card] = cleanInfo(v);
      persist(); derive(); drawPicker(); start();
      tr.classList.remove("unk");
      $("infsum").textContent = UNK.length ? UNK.length + " card" + (UNK.length === 1 ? " has" : "s have") + " no color info yet and count as colorless until you set it." : "Every card in these lists has color info.";
      msg("Saved " + tr.dataset.card);
    });
    $("mexp").addEventListener("click", function () {
      var data = exportJSON();
      if (!DL) { $("ij").value = data; $("ij").select(); msg("File download is not available here. The JSON is in the box below; copy it and save it as a .json file."); return; }
      DL.save({ filename: "mtg-decks.json", data: data }).then(function () { msg("Exported to " + (arguments[0] || "the vault")); }, function (err) {
        if (err && err.code === "declined") { msg("Export cancelled"); return; }
        $("ij").value = data; msg("Download failed (" + ((err && err.code) || "error") + "). The JSON is in the box below instead.");
      });
    });
    $("mcopy").addEventListener("click", function () {
      var data = exportJSON();
      var fb = function () { $("ij").value = data; $("ij").select(); msg("Copy blocked here. The JSON is in the box below; copy it from there."); };
      try { navigator.clipboard.writeText(data).then(function () { msg("JSON copied"); }, fb); } catch (e) { fb(); }
    });
    $("ipaste").addEventListener("click", function () { doImport($("ij").value, $("imode").value); });
    $("ifile").addEventListener("change", function () {
      var f = ($("ifile").files || [])[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () { $("ifile").value = ""; doImport(String(r.result).slice(0, 5000000), $("imode").value); };
      r.readAsText(f);
    });
    twoClick($("mreset"), "Reset to built-in decks", function () {
      try { host.save(null); } catch (e) {}
      S = defaults(); cur = 0; loadForm(); commit("Reset to the built-in decks");
    });
  }

  function drawPicker() {
    var sel = $("pickbox"), n = picked.filter(Boolean).length;
    sel.innerHTML = ALLDECKS.map(function (d, i) {
      return '<option value="' + i + '"' + (picked[i] ? " selected" : "") + ">" + esc(d.n) + (d.s ? " · " + esc(d.s) : "") + "</option>";
    }).join("");
    sel.size = Math.min(Math.max(ALLDECKS.length, 4), 12);
    $("pickchips").innerHTML = ALLDECKS.map(function (d, i) {
      return picked[i] ? '<button type="button" class="deck-chip" data-unpick="' + i + '" style="--dc:var(' + d.v + ')" aria-label="Remove ' + esc(d.n) + ' from the comparison"><i></i>' + esc(d.n) + " ×</button>" : "";
    }).join("");
    $("pickstatus").textContent = n + " of " + ALLDECKS.length + " decks selected" + (n < 2 ? " (at least 2 needed)" : "");
    $("pickall").disabled = n === ALLDECKS.length;
    $("picknone").disabled = n === 0;
  }
  $("pickbox").addEventListener("change", function () {
    var opts = $("pickbox").options;
    picked = ALLDECKS.map(function (d, i) { return !!(opts[i] && opts[i].selected); }); syncPicked();
    drawPicker(); start();
  });
  $("pickchips").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-unpick]"); if (!b) return;
    picked[+b.dataset.unpick] = false; syncPicked();
    drawPicker(); start();
  });
  $("pickall").addEventListener("click", function () {
    picked = ALLDECKS.map(function () { return true; }); syncPicked();
    drawPicker(); start();
  });
  $("picknone").addEventListener("click", function () {
    picked = ALLDECKS.map(function () { return false; }); syncPicked();
    drawPicker(); start();
  });
  $("lnote").addEventListener("click", function () {
    Promise.resolve(host.readActiveNote ? host.readActiveNote() : null).then(function (r) {
      if (!r) { msg("Open a note with a decklist first"); return; }
      if (addDeck($("lname").value || r.name, r.text)) { var n = S.decks[cur].n; $("lname").value = ""; commit("Added " + n + " from the note"); loadForm(); }
    });
  });
  root.addEventListener("click", function (e) {
    if (!e.target.closest("#clnote")) return;
    if (!host.saveNote) return;
    host.saveNote("Card checklist", $("cltext").value).then(function (p) { $("clstatus").textContent = "Saved to " + p; }, function (err) { $("clstatus").textContent = "Could not save: " + (err && err.message || err); });
  });
  initMgr();
  drawPicker();
  start();
  return { refresh: function () { start(); }, destroy: function () { window.removeEventListener("resize", onResize); if (tip0) tip0.remove(); } };
}
