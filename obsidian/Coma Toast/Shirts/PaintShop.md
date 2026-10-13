---
tags: [coma-toast, shirt, paintshop, printful]
updated: 2026-10-13
status: v8 files sized to Printful template
colorways: [Hot Wire, Toxic, Riot]
---
# PaintShop

Part of [[Coma Toast]]. All-over print tee on a near-black shirt: a big outline toast framed on the chest, neon square paint blocks everywhere else, and the `$Daily Bread$` wordmark on the back hem.

- **Product:** Printful All-Over Print Men's Crew Neck T-Shirt.
- **Status:** approved 2026-10-13; v8 files re-rendered to Printful's real template for all three colorways (new paint roll, needs a look).
- **Local folder:** `G:\ComaToast\PaintShop\`
- **Repo folder:** `tshirts/paintshop/` (finals in `tshirts/paintshop/printful/<colorway>/`)
- **Preview page:** https://claude.ai/artifact/FEuGNCSemopBZvHJrQkZSL (font study: https://claude.ai/artifact/2c6xb6VoZ6tUteqhruJFmT)

## Colorways
Each shirt's paint uses only its own two colors plus white (`#f4f4f2`). Shirt base `#121214`.

| Colorway | Toast / words | Accent / dollar signs | Zip |
|---|---|---|---|
| Hot Wire | `#ff2e88` pink | `#c6ff00` lime | `paintshop-hot-wire.zip` |
| Toxic | `#ffe600` yellow | `#00e5ff` cyan | `paintshop-toxic.zip` |
| Riot | `#00e5ff` cyan | `#ff2e88` pink | `paintshop-riot.zip` |

## Front
- **Logo:** the plain Coma Toast (no halo), drawn **inverted**: the shirt fills the mark and the color is only the line work (outline, crust line, X eyes, Soft Pulse mouth). Outline band 4.6 units in the 200-unit drawing; face lines about 3.5.
- **Size and placement:** 10 in tall × about 9.7 in wide (stretched about 8% lengthwise and 3% widthwise from natural proportions). Centered across the chest, top edge 9.6 in below the top of the 36 in print file: the top of Printful's safe area, about 1.5 in below the neckline cut.
- **Frame:** a clean dark rounded-rectangle window around the toast (no paint within about 1.1 in of it); paint blocks ring the window evenly, so the toast reads as the centerpiece.
- **Collar:** nothing painted above the shoulder line (2.6 in down). That top strip is cut out as the collar band, so the collar comes out plain shirt color. Below it, a dark oval at the neckline, about 7.6 in to each side of center and 5.6 in deep, with no paint.
- **Paint:** about 46 blocks plus small chips (same density as v7, on the bigger panel).

## Back
- **Paint:** two staggered mid-sized blocks across the upper middle (replacing one big center block) plus about 39 more blocks. Nothing painted above the shoulder line; collar oval 4 in deep kept clear.
- **Wordmark:** `$Daily Bread$` in **Rubik Wet Paint**, words in the toast color, dollar signs in the accent color. About 5.6 in wide, right edge 8.2 in right of center (about 5 in from the side seam, so about 1 in past the safe area's right edge), lowest drip 2.5 in above the bottom edge (bottom of the safe area, clear of the hem). Paint keeps a dark margin around it.
- **Hidden signature:** "Esteef" in black (`#0b0b0c`) Bodoni Moda Black Italic, about 0.17 in tall, running vertically along the inner edge of one block low on the right side of the back, just above and right of the wordmark. It lands on the same block in every colorway (lime on Hot Wire, cyan on Toxic, pink on Riot).

## Paint style
Chunky, slightly tilted square blocks with rough edges; some have a second color knocked off-register behind them. Square chips thrown around each block, straight drips ending in a small square, trails of shrinking squares, and square "pixel" mist.

## Files (per colorway)
| File | Size | Use |
|---|---|---|
| `front.jpg` | 4200 × 5400 (28 × 36 in, 150 dpi) | Front, toast built in |
| `front-no-logo.jpg` | 4200 × 5400 | Front without the toast (layer the PNG instead) |
| `back.jpg` | 4200 × 5400 (28 × 36 in) | Back, wordmark and signature built in |
| `sleeve-left.jpg`, `sleeve-right.jpg` | 3000 × 1800 (20 × 12 in) | Sleeves |
| `coma-toast-<colorway>.png` | 3000 × 3000, transparent | Toast alone |
| `daily-bread-<colorway>.png` | 3000 × 900, transparent | Wordmark alone |

All print files and logo PNGs are tagged 150 dpi.

## Printful template (read from the design maker, 2026-10-13)
Product: **All-Over Print Men's Crew Neck T-Shirt** (Printful product 257). Technique: all-over synthetic (cut and sew). Each placement is filled edge to edge ("cover"), 150 dpi recommended (75 minimum).

| Placement | Print file | Notes |
|---|---|---|
| Front print | 28 × 36 in, 4200 × 5400 px | Top strip (0–2.3 in down, 2.9–25.2 in across) is cut out as the **collar band**. Shoulder line at the neck 2.6 in down; neck opening 10.5–17.5 in across; neckline bottom 8.1 in down. Safe area 6.9–21.1 in across, 9.5–33.5 in down. |
| Back print | 28 × 36 in, 4200 × 5400 px | Neckline bottom 4.1 in down. Safe area 7.0–20.9 in across, 6.3–33.5 in down. |
| Left / right sleeve | 20 × 12 in, 3000 × 1800 px | |

Side seams sit about 0.7 in in from each edge of the front and back; the hem is at about 35.9 in. There is **no collar placement**; the only related option is **Stitch color** (white or black), so pick **Black**.

## Printful setup

1. Printful → Product templates (or Stores → your store → Add product) → All-Over Print Men's Crew Neck T-Shirt.
2. Pick the colorway folder (`hot-wire`, `toxic` or `riot`) and upload:
   - **Front** → `front.jpg`
   - **Back** → `back.jpg`
   - **Left sleeve** → `sleeve-left.jpg`
   - **Right sleeve** → `sleeve-right.jpg`
3. Each file is exactly the placement size, so it should fill the area on its own. If it doesn't, use **Fill**, centered, and don't scale it by hand.
4. Set the **background color** to `#121214` (if the tool offers it) so any gap is the shirt color, not white.
5. Product options: **Stitch color → Black**.
6. Check the mockups: the collar is plain dark, the toast clears the neckline on the front, `$Daily Bread$` clears the hem on the back, and nothing important sits on a side seam or the underarm.
7. Save as a template, then order one sample before publishing.

Fallback if the toast or wordmark lands wrong: upload `front-no-logo.jpg` as the front, then add `coma-toast-<colorway>.png` as a second layer at 10 in tall, centered, top edge 9.6 in below the top of the print area. Placing `daily-bread-<colorway>.png` (about 5.6 in wide) on the back works the same way.

## Regenerating
From the repo root (needs Node and Playwright): `node tshirts/paintshop/make-logo.js`, then `node tshirts/paintshop/printful.js`. Random seeds: front 3, back 11, sleeves 21 and 34. `CW=toxic` renders one colorway. Without full Playwright, install `playwright-core` anywhere and set `PLAYWRIGHT_PATH` to it plus `BROWSER_CHANNEL=msedge` to render with the installed Edge.

## Fonts considered for the wordmark
Chosen: **Wet Paint** (Rubik Wet Paint). Also tried: Blackletter (Pirata One), Couture (Bodoni Moda Black Italic), Neon (Monoton), Pixel (Press Start 2P), Signature (Mr Dafoe), Block (Rubik Mono One), Spray Paint (Rubik Spray Paint), Handstyle (Sedgwick Ave Display), Throw-Up (Knewave with 3D shadow), Pixel Tag, Pixel Drip and Pixel Throw-Up (graffiti fonts rebuilt from square pixels).

## Change log
- **2026-10-13 — v1:** started after the [[Desk Tee]] was rejected. Large middle-chest Saint (filled, bright two-color), round paint splats, colorways Hot Wire / Toxic / Riot.
- **v2:** logo lowered away from the collar; logo inverted to outline only; splats changed to square blocks; more color on the front.
- **v3:** three versions, one per colorway, each painted in its own colors; halo removed (plain toast); back's big center block split into two; `$Daily Bread$` added at bottom right; first six fonts reviewed; logo a little longer and wider, top fixed.
- **v4:** seven more fonts (graffiti, graffiti × pixel); logo 10 in tall; clean framed window around the toast.
- **v5:** Wet Paint chosen; fewer blocks around the logo, moved to the back; wordmark lowered to the hem with 1.5 in clearance; print cleared around the collar.
- **v6:** hidden "Esteef" signature added on the back; whole-shirt mockup reviewed.
- **v7 (final):** approved; final Printful files and a zip per colorway. Shirt named **PaintShop**.
- **v7.1:** print files and logo PNGs re-tagged at 150 dpi (they were 96 dpi or untagged, so Printful could misread the print size). `printful.js` now does this on every render. Printful setup corrected: no collar placement exists on product 257, so set Stitch color to Black. Step-by-step Printful setup added. Zips rebuilt. Artwork unchanged.
- **v8 (2026-10-13):** re-rendered to Printful's real template, read from the design maker while logged in. The old 24 × 32 in files would have been scaled up about 17% to fill the 28 × 36 in panel, so the toast would have printed about 11.7 in tall and run into the neck opening. Paint would also have covered the top strip, which becomes the collar band. Now: front and back are 4200 × 5400 and sleeves 3000 × 1800; nothing is painted above the shoulder line, so the collar stays plain; the toast top moved to 9.6 in down (top of the safe area, about 1.5 in below the neckline cut); the wordmark sits at the bottom of the safe area. Paint counts scale with the panel area, so the paint pattern is a new roll in the same style.

## Open items
- [ ] Check every placement in Printful's mockup preview (collar, hem, side seams), then order a sample.
- [x] Printful's exact print-area sizes checked (see Printful template above); files re-rendered to match.
- [ ] Look over the v8 front and back (new paint roll) before building the Printful template.
