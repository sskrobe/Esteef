---
tags: [coma-toast, shirt, highlight, printful]
updated: 2026-10-13
status: v3.1 (all six colorways go forward, open halo)
---
# Highlight

Part of [[Coma Toast]]. The **Saint** mark (halo logo, see [[Logo Marks]]), large in the normal chest spot, filled with **layered highlighter strokes** under black fine-liner pen line art, after a pen-and-highlighter eye drawing the user shared. Named "Highlight" by the user. Store name if published: "Highlight King ComaToast Logo".

- **Status:** v1 approved 2026-10-13 ("i like this one!"); v2 adds a matte for dark shirts in two styles, waiting on the pick.
- **Local folder:** `G:\ComaToast\Highlight\`
- **Repo folder:** `tshirts/highlight/`

## Mashup back v2 (current): mixed colors on a highlighter background
Feedback on v1: mix up the colors (not all rainbow); fewer stickers so each reads better, but still busy; a background of wide, overlapping highlighter swipes (color bands and variances), stylish, covering the entire print area; make the stickers pop off the background.
- **Stickers:** 16 (2.5 to 3.9 in tall), all five marks used, each in one of the six colorways (Blue, Pink, Rainbow, Mint, Lavender, Tangerine) so every mark/color pair is different. Files: `stickers/<mark>-<colorway>.png`.
- **Background:** wide (1.3 in) highlighter swipes covering the whole 12 × 16 in area: diagonal lanes closer together than a swipe is wide, so neighbors overlap into darker color bands (multiplied like ink), rain dashes where swipes meet, plus a few crossing swipes for variance. Colors: hot pink `#ff4fa3`, yellow `#ffe23d`, orange `#ff9a3c`, aqua `#3fd8ec`, violet `#a98bff`.
- **Pop:** each sticker (and the `$DAILY BREAD$` tag) has a dark edge around its white matte and a soft drop shadow down and to the right.
- **Organic edge (v2.1):** the swipe panel is inset about 0.6 in from the print-area edges, and each swipe stops a little short of or bleeds up to about 0.55 in past the panel edge with its chisel tip showing, so the edge is ragged, not a cut rectangle. The shirt shows around the panel and through the rain-dash gaps. Drop shadows only print over art (never on bare shirt); no partial transparency.

## Rainbow back: mashup of all five marks (`mashup.js`, v1)
The user asked for a back that mashes up all of the logo designs in the rainbow color pattern.
- **The stickers:** all five marks (plain Coma Toast, Saint, Little Devil, Heaven Sent, Raising Hell), each shaded in the rainbow three-marker style (rainbow light layer, violet medium and dark shadows, bare-paper highlights, rain dashes, a cast shadow on a white sticker matte, pen outlines). Horns and wings sit behind the toast, with the toast shading them; halo marks get the open, cut-through halo. Saved one by one in `files/rainbow-products/stickers/<mark>.png` (about 6 in tall, 300 dpi), handy for other products.
- **The mashup** (`back-mashup.png`, whole 12 × 16 in back area): 30 stickers from 4 in down to 2.3 in tall, the five marks used equally, turned up to about ±24°, overlapping like a sticker-bombed laptop (biggest first, so smaller ones land on top), all inside the area. `$DAILY BREAD$` sits on top at the bottom right.
- Works on the tee, long sleeve and hoodie backs. Mockups: `mashup-samples.png`.

## Rainbow: long sleeves and hoodies (`products.js`)
The user asked for the Rainbow design on long sleeves, back patterns and hoodies. `products.js` builds a shared set of print files from the Rainbow front (run `shade.js` first), all shaded the same way, in `files/rainbow-products/` (300 dpi, transparent):

| File | What it is | Size |
|---|---|---|
| `front.png` | the Rainbow front | 10.16 × 12 in (tee / long sleeve); set it **7.62 × 9 in** on the hoodie |
| `back-small.png` | standard back: `$DAILY BREAD$` bottom-right | whole 12 × 16 in back area |
| `back-pattern.png` | "sticker bomb": 25 tossed rainbow toast stickers (1.9 to 3.1 in, turned up to about ±26°, no overlaps), bottom-right corner kept clear for `$DAILY BREAD$` | whole 12 × 16 in back area |
| `back-mashup.png` | **mashup of all five marks** as stickers in mixed colorways over a full highlighter-swipe background, `$DAILY BREAD$` bottom-right (from `mashup.js`) | whole 12 × 16 in back area |
| `back-big.png` | one big toast (8.46 × 10 in) on the upper back, top 1 in down, plus `$DAILY BREAD$` bottom-right | whole 12 × 16 in back area |
| `sleeve-left.png` | a small toast sticker at the shoulder, then **DAILY BREAD** running down the arm | 2.03 × 14.92 in |
| `sleeve-right.png` | the same with **COMA TOAST** | 2.03 × 15.01 in |

**Placement:**
- **Long sleeve tee:** front as on the tee (10.16 in wide, top 1.5 in below the collar seam); back: `back-small`, `back-pattern` or `back-big`; left and right sleeve files on the sleeves, sticker end at the shoulder.
- **Hoodie:** front set **7.62 in wide (9 in tall), top about 3 in below the collar seam**, so it clears the hood and sits above the front pocket; back: `back-big` (recommended) or `back-pattern`; sleeves as on the long sleeve.
- **Check the sleeve print area** for the exact product in Printful's design maker: if it is shorter than 15 in, scale the sleeve file down to fit (keep it centered on the sleeve, sticker toward the shoulder).
- Mockups: `products-samples.png` (long sleeve and hoodie, front and back options, plus the flat files).
- Also fixed: the pen outline on all text (back tags and sleeves) is now drawn from the letter silhouette; the font's overlapping contours had shown as stray lines inside A, Y and R.

## v3.1: six colorways, open halo
Feedback on v3: keep all three colorways plus three more; cut a little transparent oval inside the halo so the background comes through, keeping the 3D look.
- **Colorways (all go forward):** Blue, Pink, Rainbow, plus **Mint** (`#c8f5df` / `#6fd6a8` / `#23926a`), **Lavender** (`#e3d6ff` / `#b294f5` / `#6a45c4`) and **Tangerine** (`#ffdcb8` / `#ffa45a` / `#dc5f16`). Files in `files/shade-<colorway>/`.
- **Open halo:** a transparent oval is cut through the halo's center, keeping a thin (0.1 in) white matte rim inside it. To keep it 3D, the ring's back inner edge (just above the opening) gets the medium and dark layers, and the halo shades the top of that inner rim.
- Sample sheet `shade-samples.png`: each colorway front and back on a black shirt, plus close-ups on black and white.

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
- **2026-10-13 — mashup v2.1:** background pulled in from the edges with ragged, bleeding swipe ends (organic on the shirt) instead of a full crisp rectangle.
- **2026-10-13 — mashup v2:** mixed colorways, 16 stickers instead of 30, a full-area wide-highlighter-swipe background, dark matte edges and drop shadows so the stickers pop.
- **2026-10-13 — Rainbow mashup back:** all five marks as shaded rainbow stickers, overlapped across the back; individual sticker files too.
- **2026-10-13 — Rainbow products:** long sleeve and hoodie files (sleeve prints, sticker-pattern back, big-toast back, hoodie front size); clean pen outline on all text.
- **2026-10-13 — v3.1:** all of Blue, Pink, Rainbow go forward, plus Mint, Lavender, Tangerine; transparent oval cut through the halo with a shaded inner edge.
- **2026-10-13 — v3:** three-marker light and shadow (light / medium / dark layers of one color family, light from the halo, cast shadows), on the sticker matte; Blue, Pink and Rainbow colorways. The small white gaps where marker strokes meet ("rain dashes") are kept on purpose: the user likes them (a solid-fill variant was tried and dropped).
- **2026-10-13 — v2:** matte for dark shirts in two styles (sticker: color trimmed to just past the lines on a die-cut white matte; page: a torn-edge sketchbook page with a paler wash across it); back on a paper matte, pen outline fixed.
- **2026-10-13 — v1:** first pass (many short strokes in three directions) read as confetti and spiked too far past the outline; reworked into edge-to-edge parallel lanes with partial crossing passes, a paper base, and a clean halo center.

## Open items
- [ ] Set up the six colorways in Printful.
- [ ] Set up the Rainbow long sleeve and hoodie in Printful (pick the back option).
- [ ] Pick the shirt color(s) to offer (recommended: black).
- [ ] Set up in Printful as "Highlight King ComaToast Logo".
- [ ] Women's (Queen) version?
