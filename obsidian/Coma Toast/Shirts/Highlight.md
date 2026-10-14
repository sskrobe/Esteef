---
tags: [coma-toast, shirt, highlight, printful]
updated: 2026-10-13
status: v3 (three-marker shading), waiting on pick
---
# Highlight

Part of [[Coma Toast]]. The **Saint** mark (halo logo, see [[Logo Marks]]), large in the normal chest spot, filled with **layered highlighter strokes** under black fine-liner pen line art, after a pen-and-highlighter eye drawing the user shared. Named "Highlight" by the user. Store name if published: "Highlight King ComaToast Logo".

- **Status:** v1 approved 2026-10-13 ("i like this one!"); v2 adds a matte for dark shirts in two styles, waiting on the pick.
- **Local folder:** `G:\ComaToast\Highlight\`
- **Repo folder:** `tshirts/highlight/`

## v3: three-marker light and shadow (`shade.js`)
The user shared a marker tutorial ("Easiest Light and Shadows Tutorial With THREE Markers", Katie's Color Therapy) for the style they want: **layers of one color family build the shadows**. The technique: a light marker over everything (bare paper left where the light hits), a medium marker over the shadow areas, the darkest marker only in the deepest shadows, with flat, hard-edged cast shadows all falling the same way.
- **Light source:** the halo, upper left; every shadow falls down and to the right.
- **Light layer:** the whole mark, except a bare-paper highlight along the lit (upper-left) edges of the crust rim and halo.
- **Medium layer:** the toast's lower-right side; the crust rim shading the inside of the slice along its upper-left edge; the halo's lower-right band; the halo's cast shadow on the top of the toast.
- **Dark layer:** right at the lower-right edges, the deepest corner inside the rim, and small contact shadows under the X eyes and mouth.
- **Cast shadow** of the toast on the white sticker matte (it makes the mark stand up off the shirt).
- Each layer is marker strokes on one diagonal with small white "rain dash" gaps where strokes meet (the user likes them), multiplied over the one below; pen line art on top; sticker matte (0.3 in border) for dark shirts.
- **Colorways** (`files/shade-<blue|pink|rainbow>/`, 10.16 × 12 in): **Blue** (like the video: `#bfe3f7` / `#74b4e3` / `#2f6fb3`), **Pink** (`#ffd3e6` / `#ff92c0` / `#d9467f`), **Rainbow** (the v1 highlighter colors as the light layer, violet shadow layers).
- **Back:** `$DAILY BREAD$` shaded the same way (light letters, medium and dark on the lower-right edges, a cast shadow) on a small matte.
- Sample sheet: `shade-samples.png`. Regenerate with `node tshirts/highlight/shade.js`.

## v2: a matte behind it (for dark shirts)
Feedback on v1: on black it needs some kind of matte behind it; the strokes past the edges look messy. Either extend them more and make them part of the art, or shorten them to just past the lines. v2 does both, as two styles:
- **Sticker matte** (`files/sticker/`, **10.17 × 12 in**): the color stops about 0.1 in past the pen outline, on a clean white matte that follows the mark with an even 0.3 in border, like a die-cut sticker (the halo's center is filled white).
- **Page matte** (`files/page/`, **10.5 × 11.81 in**): the mark on a white sketchbook page turned slightly, with a torn (deckled) edge. A paler, sparser wash of the same strokes runs across the page (inset from the edge, ragged ends) and the mark keeps the full saturated layering, so the overflow reads as part of the artwork.
- Both: centered, top 1.5 in below the collar seam. Both work on black and white shirts.
- **Back:** `$DAILY BREAD$` now sits on its own small paper matte too (and the pen outline is fixed: a stray comment had dropped its color and weight). Same back for both styles.

## Look (v1)
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

## Files (`files/<sticker|page>/`)
- `front.png` (trimmed, 300 dpi, transparent), `back.png` (whole 12 × 16 in back area; fill it).
- `highlight-samples.png`: each style front and back on black and white shirts, plus close-ups.

## Printful setup
1. **Front print:** upload the chosen style's `front.png` and set it to its width (sticker 10.17 in, page 10.5 in), centered, top 1.5 in below the collar seam.
2. **Back print:** upload `back.png` and let it fill the area.

## Regenerating
`node tshirts/highlight/highlight.js` (needs Node and Playwright, or `playwright-core` with `PLAYWRIGHT_PATH` and `BROWSER_CHANNEL=msedge`). Highlighter colors, zones, stroke width and passes are in the script; change the seed (1219) for a different stroke layout.

## Change log
- **2026-10-13 — v3:** three-marker light and shadow (light / medium / dark layers of one color family, light from the halo, cast shadows), on the sticker matte; Blue, Pink and Rainbow colorways. The small white gaps where marker strokes meet ("rain dashes") are kept on purpose: the user likes them (a solid-fill variant was tried and dropped).
- **2026-10-13 — v2:** matte for dark shirts in two styles (sticker: color trimmed to just past the lines on a die-cut white matte; page: a torn-edge sketchbook page with a paler wash across it); back on a paper matte, pen outline fixed.
- **2026-10-13 — v1:** first pass (many short strokes in three directions) read as confetti and spiked too far past the outline; reworked into edge-to-edge parallel lanes with partial crossing passes, a paper base, and a clean halo center.

## Open items
- [ ] Pick v3 colorway (Blue / Pink / Rainbow), or v2 sticker / page.
- [ ] Pick the shirt color(s) to offer (recommended: black).
- [ ] Set up in Printful as "Highlight King ComaToast Logo".
- [ ] Women's (Queen) version?
