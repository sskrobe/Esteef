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

## T-shirt designs

- `tshirts/index.html` previews the tee concepts on shirt mockups.
- `tshirts/desk-graffiti/` is an all-over print where the whole shirt is a graffitied school desk (`desk-print.png`, 3000x4000).
- `tshirts/s-chain/` is a chest print of the 90s Cool S doodle as chain links over soda-can stripes (`s-chain-print.png`, 3600x3600, transparent).
- Re-render a print with `node tshirts/render.js <page.html> <output-name>` (needs Playwright). Handwriting fonts are in `tshirts/fonts/` (SIL Open Font License).
