---
tags: [coma-toast, shirt, benday-logo, printful]
updated: 2026-10-13
status: samples made, waiting on mark choice
---
# Benday Logo

Part of [[Coma Toast]]. A single chest logo (no all-over print): the official Coma Toast mark drawn **filled**, in comic-book inking with **Ben-Day dot** color, like 1950s–60s comics and Lichtenstein. The size and placement set here are the go-forward standard for this design on every tee.

- **Status:** samples of all five official marks made 2026-10-13; waiting on the pick. Shirt colors to be chosen later.
- **Local folder:** `G:\ComaToast\Benday Logo\`
- **Repo folder:** `tshirts/benday-logo/`

## Look
- **Colors:** black `#111111`, white `#ffffff`, blue `#1e63d6`. Nothing else.
- **Inking:** a black outline on every part, the black face (X eyes, Soft Pulse mouth, inner crust line), and a thin **white keyline** outside the black outline so the mark reads on any shirt color.
- **Ben-Day fill:** blue dots on a white base, on a 45° grid, about 0.23 in apart on a 10 in mark. Dots grow from top left (light) to bottom right (dark) for comic shading.
  - Toast crust: big, dense dots. Face: small, light dots.
  - A white comic shine on the top-left of the crust.
  - Halo: small dots. Angel wings: light dots. Bat wings: dense dots. Horns: solid blue.
- Gaps between dots are white, not transparent, so the fill looks the same on every shirt color.

## Size and placement (go-forward standard)
- **Size:** the mark fits a **10 × 10 in box** (its longer side is 10 in). That fits Printful's smallest front print area on the Bella+Canvas 3001 (XS–M: 11.5 × 13.8 in; L and up: 15 × 18 in), so the logo is the same size on every shirt size.
- **Placement:** centered left to right; top of the mark **3 in below the front collar seam**.

| Mark | Printed size |
|---|---|
| Coma Toast (plain) | 10 × 9.88 in |
| Saint | 8.42 × 10 in |
| Little Devil | 9.13 × 10 in |
| Heaven Sent | 10 × 7.06 in |
| Raising Hell | 10 × 7.71 in |

## Files
| File | What |
|---|---|
| `benday-<mark>.png` | Transparent PNG, trimmed to the mark, 300 dpi, 3000 px on the longer side |
| `benday-<mark>.svg` | Vector source |
| `benday-logo-samples.png` | All five on a size L tee at true scale (heather gray and black) |

## Printful setup (once a mark is picked)
Product: **Unisex Staple T-Shirt | Bella + Canvas 3001** (Printful product 71), DTG front print.
1. Upload `benday-<mark>.png` to **Front print**.
2. Set its width to the size in the table above (it keeps its proportions), center it left to right, and move it so its top sits 3 in below the collar seam in the mockup.
3. Check the mockup on one XS–M size and one L-and-up size, since the print area changes at L.

Printful notes: files at least 150 dpi (these are 300); semi-transparent graphics print poorly (these have none); black ink looks gray on black shirts because of the white underbase. If a black shirt is chosen, consider a version with the black outline knocked out to the shirt.

## Regenerating
From the repo root (needs Node and Playwright, or `playwright-core` with `PLAYWRIGHT_PATH` and `BROWSER_CHANNEL=msedge`): `node tshirts/benday-logo/make.js`, then `node tshirts/benday-logo/mockup.js`. The look is in `tshirts/benday-logo/benday.js`.

## Change log
- **2026-10-13 — v1:** samples of all five official marks in black, white and blue Ben-Day dots; size and placement standard set (10 × 10 in box, 3 in below the collar).

## Open items
- [ ] Pick the mark.
- [ ] Pick shirt colors.
- [ ] Confirm placement in Printful's mockup, then order a sample.
