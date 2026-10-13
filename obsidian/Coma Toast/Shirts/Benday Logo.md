---
tags: [coma-toast, shirt, benday-logo, printful]
updated: 2026-10-13
status: v3 front samples + $Daily Bread$ back, waiting on mark choice
---
# Benday Logo

Part of [[Coma Toast]]. A single chest graphic (no all-over print), styled like a Psycho Bunny chest graphic: the official Coma Toast mark, drawn **filled** in bold comic inking, on a rough **paint swatch made of Ben-Day stipple** (a medley of our looks: the Ben-Day dots, plus the rough square-chip paint from [[PaintShop]]). The size and placement set here are the go-forward standard for this design on every tee.

- **Status:** v2 samples of all five official marks made 2026-10-13; waiting on the pick. Shirt colors to be chosen later.
- **Local folder:** `G:\ComaToast\Benday Logo\`
- **Repo folder:** `tshirts/benday-logo/`

## Look (v2, swatch style)
- **Colors:** black `#111111`, white `#ffffff`, blue `#1e63d6`. Nothing else.
- **Swatch:** a slightly tilted, taller-than-wide blue block behind the toast, made of Ben-Day dots on a 45° grid (nearly solid at the bottom right, opening up toward the top left). Rough edges, dry-brush scratches through it, short brush streaks off its sides, and square paint chips along its top and bottom. Between the dots the shirt shows through.
- **Mark:** bold black outline (no white keyline), mostly white with light blue dots for shading (face lightest, crust a bit heavier), black face (X eyes, Soft Pulse mouth, inner crust line), white comic shine on the crust, solid blue horns.
- **Breaking the frame:** the swatch hugs the toast; the halo and horns break out of its top and the wings overhang its sides, like the bunny's ears and crossbones.

## Size and placement (go-forward standard)
- **Size:** the whole graphic fits a **10.5 in wide × 12 in tall box**, about the size of a Psycho Bunny chest graphic. That fits Printful's smallest front print area on the Bella+Canvas 3001 (XS–M: 11.5 × 13.8 in; L and up: 15 × 18 in), so it is the same size on every shirt size.
- **Placement:** centered left to right; top of the graphic **1.5 in below the front collar seam** (high on the chest, like the reference).

| Mark | Printed size |
|---|---|
| Coma Toast (plain) | 10.5 × 11.23 in |
| Saint | 10.5 × 11.23 in |
| Little Devil | 10.5 × 11.64 in |
| Heaven Sent | 10.5 × 8.91 in |
| Raising Hell | 10.5 × 9.48 in |

## Back print: $Daily Bread$
Every design gets this (standing rule). Here it matches the front: white **Rubik Wet Paint** lettering (the brand wordmark font from [[PaintShop]]) with a bold black outline, dollar signs in solid blue, on a small rough blue Ben-Day stipple swatch with the same dot size, brush streaks and square chips as the front.
- **Size:** lettering 7 in wide; with the swatch the art is about 8.94 × 3.4 in.
- **Placement:** the bottom-right corner of the back print area, 0.1 in in from its bottom and right edges, which is as low and as far right as the back print can go.
- **File:** `back-daily-bread.png` is the whole 12 × 16 in back print area (3600 × 4800 px, 300 dpi, transparent) with the wordmark already in the corner. Upload it to **Back print** and let it fill the area, so the position is locked. `daily-bread-benday.png` is the wordmark alone.
- **Limit:** Printful's back print area on the Bella+Canvas 3001 is 12 × 16 in on every size and starts near the back collar, so its bottom edge ends roughly 11 in above the hem: the wordmark lands on the lower-middle back, not at the hem like PaintShop. To get it down at the hem, the shirt would need a product with a lower back print area, or an all-over print tee.

## Files
| File | What |
|---|---|
| `benday-<mark>.png` | Transparent PNG, trimmed to the art, 300 dpi |
| `benday-<mark>.svg` | Vector source |
| `benday-logo-samples.png` | All five on a size L tee at true scale (white and black) |
| `back-daily-bread.png` | Back print: the full 12 × 16 in area with `$Daily Bread$` in the bottom-right corner |
| `daily-bread-benday.png` | The `$Daily Bread$` back art alone |
| `benday-back-sample.png` | The back on a size L tee (white and black), print area dashed |

## Printful setup (once a mark is picked)
Product: **Unisex Staple T-Shirt | Bella + Canvas 3001** (Printful product 71), DTG front print.
1. Upload `benday-<mark>.png` to **Front print**.
2. Set its width to 10.5 in (it keeps its proportions), center it left to right, and move it so its top sits 1.5 in below the collar seam in the mockup.
3. Upload `back-daily-bread.png` to **Back print**, filling the area.
4. Check the mockup on one XS–M size and one L-and-up size, since the front print area changes at L.

Printful notes: files at least 150 dpi (these are 300); semi-transparent graphics print poorly (these have none; the stipple is solid dots); black ink looks gray on black shirts because of the white underbase.

## Regenerating
From the repo root (needs Node and Playwright, or `playwright-core` with `PLAYWRIGHT_PATH` and `BROWSER_CHANNEL=msedge`): `node tshirts/benday-logo/make.js`, then `node tshirts/benday-logo/back.js`, then `node tshirts/benday-logo/mockup.js`. The look is in `tshirts/benday-logo/benday.js` (`style: 'swatch'`; the v1 look is `style: 'sticker'`).

## Change log
- **2026-10-13 — v1:** "sticker" style: the filled mark with blue Ben-Day dot fills and a white keyline, fitted to a 10 × 10 in box, 3 in below the collar.
- **v2:** size and placement matched to Psycho Bunny chest graphics (about 12 in tall, high on the chest): 10.5 × 12 in box, 1.5 in below the collar. Restyled after a Psycho Bunny reference with a paint block behind the character: the mark now sits on a rough blue Ben-Day stipple swatch with PaintShop-style chips and brush streaks; the mark goes mostly white with a bolder outline; toppers break out of the swatch.

- **v3:** `$Daily Bread$` back print added in the front's style, in the bottom-right corner of the back print area.

## Open items
- [ ] Pick the mark.
- [ ] Pick shirt colors.
- [ ] Confirm placement in Printful's mockup, then order a sample.
