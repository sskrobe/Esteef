---
tags: [coma-toast, shirt, equalizer, printful]
updated: 2026-10-13
status: v1 samples (2 colorways), waiting on review
---
# Equalizer

Part of [[Coma Toast]]. A pixel **audio equalizer** of square tiles in a gradient, with **all five Coma Toast marks** (plain, Saint, Little Devil, Heaven Sent, Raising Hell, see [[Logo Marks]]) standing in the bars and showing through the tiles, after a Psycho Bunny equalizer tee. Name is a working title.

- **Status:** v1 made 2026-10-13.
- **Local folder:** `G:\ComaToast\Equalizer\`
- **Repo folder:** `tshirts/equalizer/`

## Look
- **Bars:** 26 columns, up to 15 tiles tall (an equalizer profile: low at the edges, high in the middle, fixed random jitter). Tiles get dimmer toward the bottom and a touch lighter at the top. Gaps between tiles are transparent (shirt color).
- **Marks:** the official one-color marks (faces knocked out, so the bars show through the face), spaced out at staggered heights, each in a color that contrasts with its columns, then cut into the tiles with everything else.
- **Wordmark:** DAILY BREAD in small spaced Montserrat SemiBold capitals, right-aligned under the bars.

| Colorway | Bars (edge → middle → edge) | Marks (left → right: Heaven Sent, Little Devil, Saint, plain, Raising Hell) | Wordmark |
|---|---|---|---|
| **Sunset** | navy → blue → purple → magenta → red → orange | orange, pale yellow, navy, cream, coral | orange |
| **Brand (Hot Wire)** | deep purple → plum → hot pink → lime center | lime, white, deep purple, white, lime | lime |

For **dark shirts** (navy or black).

## Size and placement (chest standard)
Bella+Canvas 3001 (Printful product 71), DTG front: **10.5 × 6.85 in**, centered, top **1.5 in below the collar seam**.

## Back: $Daily Bread$
`$DAILY BREAD$` (Montserrat Black shapes) built from a fine tile grid in the bright middle of the bar gradient, about 7 × 0.85 in, bottom-right of the 12 × 16 in back print area.

## Files (`files/<sunset|brand>/`)
- `front.png` (300 dpi, transparent), `back.png` (whole 12 × 16 in back area; fill it).
- `equalizer-samples.png`: each colorway on a navy and a black tee, front and back, plus close-ups.

## Printful setup
1. **Front print:** upload `front.png`, set it 10.5 in wide, center it, top 1.5 in below the collar seam.
2. **Back print:** upload `back.png` and let it fill the area.

## Regenerating
`node tshirts/equalizer/equalizer.js` (needs Node and Playwright, or `playwright-core` with `PLAYWRIGHT_PATH` and `BROWSER_CHANNEL=msedge`). Bar heights, mark positions and colors are at the top of the script.

## Change log
- **2026-10-13 — v1:** first pass had the marks huge and overlapping (one blob) in colors too close to the bars; reworked to smaller, spaced, staggered marks in contrasting colors.

## Open items
- [ ] Review; pick a colorway; confirm the name.
