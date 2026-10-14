---
tags: [coma-toast, shirt, scanline, printful]
updated: 2026-10-13
status: v1 samples (ivory and ink), waiting on review
---
# Scanline

Part of [[Coma Toast]]. A quiet, **high-fashion** take on the 80s: the three character marks (see [[Logo Marks]]) **Saint**, plain **Coma Toast** and **Little Devil**, set like a fashion label. The 80s is only **alluded to** (CRT / VHS scan lines, one tracking slip, a sportswear pinstripe), never spelled out. Name is a working title. Replaces [[Retro]] (too obvious).

- **Status:** v1 made 2026-10-13.
- **Local folder:** `G:\ComaToast\Scanline\`
- **Repo folder:** `tshirts/scanline/`

## Look
- **Marks:** three equal marks in a row, each filled only with fine horizontal **scan lines** (about 24 per inch, like a CRT / VHS raster). The face (X eyes, Soft Pulse mouth) and inner crust line are drawn **solid** inside a clean gap, so they read clearly against the lines.
- **Tracking slip:** a thin band across all three is sheared sideways, with a muted ghost (rose above, teal below), like a VHS tape slipping. Subtle, only a few lines tall.
- **Pinstripe:** three hairlines (rose, mustard, teal) under the row, a nod to 80s sportswear stripes.
- **Type:** **COMA TOAST** (Montserrat SemiBold) left and **DAILY BREAD** (Montserrat Regular) right, small and widely tracked, like a label.
- Muted palette; solid colors only (DTG-safe).

| Version | Lines and type | Accents | Shirts |
|---|---|---|---|
| **Ivory** | ivory `#efe9dd` | rose `#d0607f`, mustard `#e0b04a`, teal `#3fa3a0` | black, navy |
| **Ink** | near-black `#1b1b1b` | rose `#b8456a`, mustard `#c9932c`, teal `#2c7f7d` | natural, white |

## Size and placement
Bella+Canvas 3001 (Printful product 71), DTG front: **9 × 3.95 in**, centered, top **2 in below the collar seam** (smaller and a little lower than the chest standard, for a more considered, high-fashion read).

## Back: $Daily Bread$
`$DAILY BREAD$` (Montserrat Black) in the same scan lines with its own small tracking slip, about 6.55 × 0.69 in, bottom-right of the 12 × 16 in back print area.

## Files (`files/<ivory|ink>/`)
- `front.png` (trimmed, 300 dpi, transparent), `back.png` (whole 12 × 16 in back area; fill it).
- `scanline-samples.png`: each version on its shirts, front and back, plus close-ups.

## Printful setup
1. **Front print:** upload `front.png`, set it 9 in wide, center it, top 2 in below the collar seam.
2. **Back print:** upload `back.png` and let it fill the area.

## Regenerating
`node tshirts/scanline/scanline.js` (needs Node and Playwright, or `playwright-core` with `PLAYWRIGHT_PATH` and `BROWSER_CHANNEL=msedge`). Line pitch and weight, the slips, colors and the cast are at the top of the script.

## Change log
- **2026-10-13 — v1:** scan-line marks with solid faces, tracking slip, pinstripe and label type; ivory and ink versions; scan-line `$Daily Bread$` back.

## Open items
- [ ] Review; pick ivory, ink or both; confirm the name.
