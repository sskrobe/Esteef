# Esteef

Clothing brand workspace (t-shirts and sweatshirts to start).

## Logo concepts

- `logos/round-1/` holds ten mascot logo concepts: a cute animal with a villain twist.
  - `index.html` is the gallery page with shirt-color previews.
  - `svg/` has one standalone 1000px SVG per concept.
  - `logos.js` holds the artwork; `build.js` regenerates the gallery and SVGs (`node logos/round-1/build.js`).
- `logos/round-2/` keeps four Round 1 marks (Nine Lives, Bamboo Bandit, The Don, Captain Quack) and adds ten new ones aimed at MMA, gaming and hip hop, with a "Daily Bread" name preview. Same layout; rebuild with `node logos/round-2/build.js`.
- `logos/round-3/` keeps six marks (Nine Lives, Bamboo Bandit, The Don, Captain Quack, Ground & Pound, Toast) and adds eight food characters and six tough cute animals. Rebuild with `node logos/round-3/build.js`.
- `logos/round-4/` redraws every mark to one formula (distinctive head over two crossed objects) with smug, unimpressed faces, and adds an outline-only test view. Rebuild with `node logos/round-4/build.js`.
- `logos/round-5/` gives each mark its own second section (halo, bow tie, suit, anchor, belt, toaster, laurel, trophy, eggshell, saucer, steamer, chain, rising sun, barbell, skateboard, claw marks). Rebuild with `node logos/round-5/build.js`.
- `logos/round-6/` keeps all Round 5 marks (Ronin now holds a calligraphy brush, so the set has no weapons) and adds ten more. Rebuild with `node logos/round-6/build.js`.
- `logos/round-7/` strips the cute out: plain generic heads where the accessory (crown, detective hat, top hat, beret) carries the mark. Rebuild with `node logos/round-7/build.js`.

- `logos/round-8/` keeps Daily Bread, Off Duty and The Inspector, gives every face a tiny straight-line mouth, and adds more guinea pigs and foods. Rebuild with `node logos/round-8/build.js`.

- `logos/round-9/` is 10 "Coma Toast" options: a plain slice of toast, out cold, with a different sleepy or hospital accessory each. Rebuild with `node logos/round-9/build.js`.

- `logos/round-10/` combines X'd-out eyes with a heartbeat line (as the mouth or along the bottom) under compact, symmetrical medical and sleep accessories. Rebuild with `node logos/round-10/build.js`.

- `logos/round-11/` is the settled Coma Toast face (X eyes, heartbeat mouth) with every combination of halo, devil horns, angel wings and devil wings (15 marks). Rebuild with `node logos/round-11/build.js`.

- `logos/round-12/` is the same fifteen marks as Round 11 with a more mouth-like heartbeat (flat line, one small blip). Rebuild with `node logos/round-12/build.js`.

- `logos/round-13/` is a mouth study: the four go-forward designs (Saint, Little Devil, Heaven Sent, Raising Hell) with seven heartbeat mouths, shown at full and chest-logo size. Rebuild with `node logos/round-13/build.js`.

## Official marks (v1)

`logos/final/` holds the official Coma Toast marks: the plain toast (no topper) plus Saint, Little Devil, Heaven Sent and Raising Hell. Each has X'd-out eyes and the Soft Pulse heartbeat mouth (Round 13, option E).

- `logos/final/files/svg/`: one-color SVGs in black and white (cut-outs are transparent).
- `logos/final/files/png/`: 3000 x 3000 transparent PNGs in black and white.
- `logos/final/coma-toast-logos.zip`: everything in one download, with 6000 x 6000 transparent PNGs tagged at 300 dpi plus the SVGs.
- `logos/final/index.html`: gallery with shirt-color previews. Rebuild with `node logos/final/build.js`; re-export files with `node logos/final/export.js` (needs Playwright).

## T-shirt designs

- `tshirts/index.html` previews the tee concepts on shirt mockups.
- `tshirts/desk-graffiti/` is an all-over print where the whole shirt is a graffitied school desk (`desk-print.png`, 3000x4000).
- `tshirts/s-chain/` is a chest print of the 90s Cool S doodle as chain links over soda-can stripes (`s-chain-print.png`, 3600x3600, transparent).
- Re-render a print with `node tshirts/render.js <page.html> <output-name>` (needs Playwright). Handwriting fonts are in `tshirts/fonts/` (SIL Open Font License).
- `tshirts/desk-graffiti/printful/` holds the Printful all-over print files for the desk tee with a hand-drawn Raising Hell on the left chest: front, back and sleeve panels, the logo patch as a transparent PNG, and two zips. Re-render with `node tshirts/desk-graffiti/make-logo.js` then `node tshirts/desk-graffiti/printful.js` (needs Playwright). `desk.html` takes `seed`, `w`, `h`, `s`, `logo` and `only=logo` query options.
- `tshirts/paintshop/` is the PaintShop all-over print tee in three colorways (Hot Wire, Toxic, Riot): a near-black shirt with a 10 in outline Coma Toast framed on the chest, square neon paint blocks, $Daily Bread$ in Wet Paint at the back hem, and a hidden "Esteef" on one back block. Final Printful files and a zip per colorway are in `tshirts/paintshop/printful/<colorway>/`; `review/` holds the font study. Re-render with `node tshirts/paintshop/make-logo.js` then `node tshirts/paintshop/printful.js` (needs Playwright).

- `tshirts/benday-logo/` is the Benday Logo tee: a single chest graphic, the official mark in bold comic inking on a rough blue Ben-Day stipple paint swatch (black, white, blue), on a transparent background. `files/` has a 300 dpi PNG and an SVG per mark (sized to a 10.5 x 12 in box, placed 1.5 in below the collar) and `benday-logo-samples.png` shows all five at true scale. `files/back-daily-bread.png` is the 12 x 16 in back print with `$Daily Bread$` in the bottom-right corner in the same style. Re-render with `node tshirts/benday-logo/make.js`, `back.js`, then `mockup.js` (needs Playwright). The women's version (Bella+Canvas 6400, Hot Pink / Blush / Lilac) is in `women/<palette>/`: `node tshirts/benday-logo/women.js` then `mockup-women.js`.

- `tshirts/retro/` is Retro: an 80s synthwave scene with the three characters (Saint, plain Coma Toast, Little Devil) as neon-outlined figures on the horizon in front of a striped sunset sun over a laser grid, with DAILY BREAD in 80s chrome and "Coma Toast" in neon script (Outrun and Miami colorways), and a chrome `$DAILY BREAD$` back. Re-render with `node tshirts/retro/retro.js` (needs Playwright).
- `tshirts/equalizer/` is the Equalizer tee (rejected): a pixel audio-equalizer of tiles in a gradient with all five marks showing through the tiles (Sunset and Brand colorways), DAILY BREAD under it, and a tiled `$DAILY BREAD$` back. Re-render with `node tshirts/equalizer/equalizer.js` (needs Playwright).

- `tshirts/bones/` is the Bones tee (rejected): the Saint mark with its outline (edge, inner crust, face, halo) made of little dog bones, in dark, light and brand versions, with a bone-filled `$DAILY BREAD$` back. Re-render with `node tshirts/bones/bones.js` (needs Playwright).

- `tshirts/3d/` is 3D: the red/blue 3D-movie look, a stacked DAILY / BREAD block in offset red and cyan behind the solid Saint mark, in light- and dark-shirt versions, with a matching `$DAILY BREAD$` back. Re-render with `node tshirts/3d/3d.js` (needs Playwright).

- `tshirts/blurry/` is Blurry: the Saint mark as double-vision line art (two off-register copies, overlap color where they cross) in Anaglyph, Brand and Mono colorways, single or double line, with a matching `$DAILY BREAD$` back. Re-render with `node tshirts/blurry/blurry.js` (needs Playwright).

- `tshirts/patterns/` holds Argyle and Houndstooth: the Saint mark with its face filled with an argyle or a (true woven) houndstooth pattern, Classic and Brand colorways, with a Bodoni `$Daily Bread$` back over a pattern tape. Re-render with `node tshirts/patterns/patterns.js` (needs Playwright).

- `tshirts/looney/` is the Looney tee (rejected): the Saint mark as a flat cartoon character over a bullseye of concentric rings (Neon, Classic and Brand colorways), with a `$Daily Bread$` back in a cartoon font. Files per colorway in `files/<colorway>/`; re-render with `node tshirts/looney/looney.js` (needs Playwright).

- `tshirts/labels/` holds the inside and outside neck label options (3 x 3 in each): Daily Bread, `$Daily Bread$`, DB, `$DB$`, a reversed DB and a reversed DB with a halo, each in plain black, plain white and the Benday style. Re-render with `node tshirts/labels/labels.js` (needs Playwright). `tshirts/labels/inside.js` renders the current inside label direction: Daily Bread in outline in six brand font candidates (`inside/`, `inside-label-fonts.png`); Montserrat was picked, and `inside-final.js` renders the final DAILY / BREAD justified block variants (`inside/final/`, `inside-label-final.png`).

- `brand/store/` holds the store header logo options for the Printful quick store Esteef.co: ESTEEF in Montserrat with the Saint mark (mark, halo and tagline options, black and white) and a square icon. Re-render with `node brand/store/store-logo.js` (needs Playwright).

## Notes and local copies

- `obsidian/Coma Toast/` holds the Obsidian notes: the project hub (`Coma Toast.md`), `Logo Marks.md`, and one note per shirt in `Shirts/` (`PaintShop.md` has every spec and the change log).
- `sync-local.cmd` (Command Prompt) or `sync-local.ps1` (PowerShell), from the repo root, pulls the latest and copies the PaintShop files to `G:\ComaToast\PaintShop\`, and the notes into your vault with `-Vault "<vault path>"`.
