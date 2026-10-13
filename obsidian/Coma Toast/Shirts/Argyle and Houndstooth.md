---
tags: [coma-toast, shirt, argyle, houndstooth, printful]
updated: 2026-10-13
status: argyle v2 (calmer, no extra borders), waiting on pick
---
# Argyle and Houndstooth

Part of [[Coma Toast]]. Two designs that mix the **main halo logo** (Saint, see [[Logo Marks]]) with a classic fabric pattern, for a preppy-luxury look. Made 2026-10-13 after [[Looney]] was rejected.

- **Local folders:** `G:\ComaToast\Argyle\`, `G:\ComaToast\Houndstooth\`
- **Repo folder:** `tshirts/patterns/` (files in `files/<design>-<colorway>/`)

## Argyle v2 (current, 2026-10-13)
Feedback on v1: "a nice start, but a little busy", and no extra border. Changes:
- The **whole toast is argyle** (no solid crust band) with **one black outline**; no light keylines.
- **Bigger diamonds** (about three across the toast), **no accent diamonds**, a **thin dashed overcheck**.
- **Lighter diamond colors** so the black face reads without a keyline.
- Variants with the logo's inner crust line (`-line`) were made for comparison; it reads as a second border, so the plain ones are recommended.

| Design | Diamonds | Overcheck | Halo |
|---|---|---|---|
| **Argyle · Classic** (`argyle-classic`) | pale blue `#9fb0c8` and cream `#f3ecdc` | navy `#1d2a4d` | gold `#d4af37` |
| **Argyle · Brand** (`argyle-brand`) | hot pink `#ff2e88` and white | black | lime `#c6ff00` |

Files: `files/argyle-classic/`, `files/argyle-brand/` (and `-line` variants). Locally in `G:\ComaToast\Argyle\`.

## Look (v1)
- The toast's **face is filled with the pattern**; the **crust is solid** and frames it; the **halo is solid**.
- The face (X eyes, Soft Pulse mouth, inner crust line) is black with a thin light keyline so it reads over the pattern.
- Thick black outline around everything (6.5 units; 9 was too heavy and merged the halo into the toast).
- **Argyle:** diamonds in two colors with a dashed overcheck line through them and a small accent diamond at each center.
- **Houndstooth:** the real woven structure, a 2/2 twill with 4 dark and 4 light threads each way, so the teeth are authentic.

| Design | Crust | Halo | Pattern |
|---|---|---|---|
| **Argyle · Classic** | navy `#1d2a4d` | gold `#d4af37` | navy and slate `#6f7f99` diamonds, cream `#f3ecdc` accents, burgundy `#8c1d2b` overcheck |
| **Argyle · Brand** | black | lime `#c6ff00` | hot pink `#ff2e88` and black diamonds, white accents, lime overcheck |
| **Houndstooth · Classic** | white `#f4f4f2` | gold `#d4af37` | black and white |
| **Houndstooth · Brand** | hot pink `#ff2e88` | lime `#c6ff00` | black and hot pink |

## Size and placement (go-forward chest standard)
Bella+Canvas 3001 (Printful product 71), DTG front: the art is **10.08 × 12 in** (fits the 10.5 × 12 in box), centered, top **1.5 in below the collar seam**.

## Back: $Daily Bread$
`$Daily Bread$` in **Bodoni Moda Black Italic** (luxury serif, design-specific here): words in the light color with a thin black outline, dollar signs in the halo color, and a **woven-tape strip of the pattern** under it with black edges. About 6.86 × 1.36 in, in the bottom-right corner of the 12 × 16 in back print area.

## Files (`files/<design>-<colorway>/`)
- `front.png` (trimmed, 300 dpi, transparent), `front.svg`, `back.png` (whole 12 × 16 in back area; fill it).
- `patterns-samples.png`: every design, front and back, on a black and a white size L tee.

## Printful setup
1. **Front print:** upload `front.png`, set it 10.08 in wide (12 in tall), center it, top 1.5 in below the collar seam.
2. **Back print:** upload `back.png` and let it fill the area.

## Regenerating
`node tshirts/patterns/patterns.js` (needs Node and Playwright, or `playwright-core` with `PLAYWRIGHT_PATH` and `BROWSER_CHANNEL=msedge`).

## Change log
- **2026-10-13 — v1:** Saint × argyle and Saint × houndstooth, Classic and Brand colorways each, with the `$Daily Bread$` back.
- **Argyle v2:** calmer: whole toast argyle, one outline, bigger diamonds, no accents, thin overcheck, lighter colors; inner-line variants for comparison.

## Open items
- [ ] Pick the pattern and colorway.
- [ ] Pick shirt colors.
- [ ] Women's version?
