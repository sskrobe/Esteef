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

`logos/final/` holds the four go-forward Coma Toast marks: Saint, Little Devil, Heaven Sent and Raising Hell. Each has X'd-out eyes and the Soft Pulse heartbeat mouth (Round 13, option E).

- `logos/final/files/svg/`: one-color SVGs in black and white (cut-outs are transparent).
- `logos/final/files/png/`: 3000 x 3000 transparent PNGs in black and white.
- `logos/final/index.html`: gallery with shirt-color previews. Rebuild with `node logos/final/build.js`; re-export files with `node logos/final/export.js` (needs Playwright).

## T-shirt designs

- `tshirts/index.html` previews the tee concepts on shirt mockups.
- `tshirts/desk-graffiti/` is an all-over print where the whole shirt is a graffitied school desk (`desk-print.png`, 3000x4000).
- `tshirts/s-chain/` is a chest print of the 90s Cool S doodle as chain links over soda-can stripes (`s-chain-print.png`, 3600x3600, transparent).
- Re-render a print with `node tshirts/render.js <page.html> <output-name>` (needs Playwright). Handwriting fonts are in `tshirts/fonts/` (SIL Open Font License).
