---
tags: [coma-toast, shirt, highlight, printful]
updated: 2026-10-13
status: approved (user likes it), ready for Printful
---
# Highlight

Part of [[Coma Toast]]. The **Saint** mark (halo logo, see [[Logo Marks]]), large in the normal chest spot, filled with **layered highlighter strokes** under black fine-liner pen line art, after a pen-and-highlighter eye drawing the user shared. Named "Highlight" by the user. Store name if published: "Highlight King ComaToast Logo".

- **Status:** v1 made and **approved** 2026-10-13 ("i like this one!"). Ready to set up in Printful.
- **Local folder:** `G:\ComaToast\Highlight\`
- **Repo folder:** `tshirts/highlight/`

## Look
- **Highlighter fill:** broad chisel-tip swipes (about 0.44 in wide) in highlighter pink, orange, yellow, cyan, blue and purple, layered like real ink (they darken where they cross):
  - **Pass 1:** parallel diagonal lanes running edge to edge across the mark, with a little overshoot past the outline; long runs sometimes switch color partway.
  - **Pass 2:** partial strokes at a crossing angle.
  - **Pass 3:** a few steep accents.
  - Each stroke has slanted chisel ends, a slight bow, ink pooling at the ends and faint lighter streaks.
  - **Color zones** top to bottom: halo yellow / orange; crust pink / purple / orange; face orange / yellow / pink; bottom cyan / blue / purple; with some mixing between zones.
- **Paper base:** the highlighter sits on white "paper" covering the whole mark, so it prints the same on any shirt color. The shirt only shows past the ragged stroke ends and in the halo's open center.
- **Pen line art** (near-black `#161616`): a sketchy double outline, the inner crust line, the X eyes and Soft Pulse mouth, and four small clusters of pen hatching.
- Fixed random seed, so it renders the same every time. Solid colors, no partial transparency (DTG).

## Size and placement (chest standard)
Bella+Canvas 3001 (Printful product 71), DTG front: **9.74 × 12 in**, centered, top **1.5 in below the collar seam**. Works on white, black and heather shirts.

## Back: $Daily Bread$
`$DAILY BREAD$` in Montserrat Black: paper-white letters with a pen outline (doubled) over six highlighter swipes, about 7.6 × 0.91 in, bottom-right of the 12 × 16 in back print area.

## Files (`files/`)
- `front.png` (trimmed, 300 dpi, transparent), `back.png` (whole 12 × 16 in back area; fill it).
- `highlight-samples.png`: front and back on white, black and athletic heather shirts, plus close-ups.

## Printful setup
1. **Front print:** upload `front.png`, set it 9.74 in wide (12 in tall), center it, top 1.5 in below the collar seam.
2. **Back print:** upload `back.png` and let it fill the area.

## Regenerating
`node tshirts/highlight/highlight.js` (needs Node and Playwright, or `playwright-core` with `PLAYWRIGHT_PATH` and `BROWSER_CHANNEL=msedge`). Highlighter colors, zones, stroke width and passes are in the script; change the seed (1219) for a different stroke layout.

## Change log
- **2026-10-13 — v1:** first pass (many short strokes in three directions) read as confetti and spiked too far past the outline; reworked into edge-to-edge parallel lanes with partial crossing passes, a paper base, and a clean halo center.

## Open items
- [ ] Pick the shirt color(s) to offer (recommended: black).
- [ ] Set up in Printful as "Highlight King ComaToast Logo".
- [ ] Women's (Queen) version?
