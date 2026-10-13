---
tags: [coma-toast, shirt, benday-logo, printful]
updated: 2026-10-13
status: v2 samples (swatch style), waiting on mark choice
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

## Files
| File | What |
|---|---|
| `benday-<mark>.png` | Transparent PNG, trimmed to the art, 300 dpi |
| `benday-<mark>.svg` | Vector source |
| `benday-logo-samples.png` | All five on a size L tee at true scale (white and black) |

## Printful setup (once a mark is picked)
Product: **Unisex Staple T-Shirt | Bella + Canvas 3001** (Printful product 71), DTG front print.
1. Upload `benday-<mark>.png` to **Front print**.
2. Set its width to 10.5 in (it keeps its proportions), center it left to right, and move it so its top sits 1.5 in below the collar seam in the mockup.
3. Check the mockup on one XS–M size and one L-and-up size, since the print area changes at L.

Printful notes: files at least 150 dpi (these are 300); semi-transparent graphics print poorly (these have none; the stipple is solid dots); black ink looks gray on black shirts because of the white underbase.

## Regenerating
From the repo root (needs Node and Playwright, or `playwright-core` with `PLAYWRIGHT_PATH` and `BROWSER_CHANNEL=msedge`): `node tshirts/benday-logo/make.js`, then `node tshirts/benday-logo/mockup.js`. The look is in `tshirts/benday-logo/benday.js` (`style: 'swatch'`; the v1 look is `style: 'sticker'`).

## Change log
- **2026-10-13 — v1:** "sticker" style: the filled mark with blue Ben-Day dot fills and a white keyline, fitted to a 10 × 10 in box, 3 in below the collar.
- **v2:** size and placement matched to Psycho Bunny chest graphics (about 12 in tall, high on the chest): 10.5 × 12 in box, 1.5 in below the collar. Restyled after a Psycho Bunny reference with a paint block behind the character: the mark now sits on a rough blue Ben-Day stipple swatch with PaintShop-style chips and brush streaks; the mark goes mostly white with a bolder outline; toppers break out of the swatch.

## Open items
- [ ] Pick the mark.
- [ ] Pick shirt colors.
- [ ] Confirm placement in Printful's mockup, then order a sample.
