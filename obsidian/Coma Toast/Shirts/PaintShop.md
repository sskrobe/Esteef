---
tags: [coma-toast, shirt, paintshop, printful]
updated: 2026-10-13
status: final files done
colorways: [Hot Wire, Toxic, Riot]
---
# PaintShop

Part of [[Coma Toast]]. All-over print tee on a near-black shirt: a big outline toast framed on the chest, neon square paint blocks everywhere else, and the `$Daily Bread$` wordmark on the back hem.

- **Product:** Printful All-Over Print Men's Crew Neck T-Shirt.
- **Status:** approved 2026-10-13; final files made for all three colorways.
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
- **Size and placement:** 10 in tall × about 9.7 in wide (stretched about 8% lengthwise and 3% widthwise from natural proportions). Top edge about 6.1 in below the top of the print file, centered on the chest.
- **Frame:** a clean dark rounded-rectangle window around the toast (no paint within about 1.1 in of it); paint blocks ring the window evenly, so the toast reads as the centerpiece.
- **Collar:** dark oval at the neckline, about 7.6 in to each side of center and 5.6 in deep, with no paint.
- **Paint:** about 38 blocks plus small chips.

## Back
- **Paint:** two staggered mid-sized blocks across the upper middle (replacing one big center block) plus about 32 more blocks. Collar oval 4 in deep kept clear.
- **Wordmark:** `$Daily Bread$` in **Rubik Wet Paint**, words in the toast color, dollar signs in the accent color. About 5.6 in wide, right edge about 3.8 in in from the right edge of the file, lowest drip 1.5 in above the bottom edge (hem and trim clearance). Paint keeps a dark margin around it.
- **Hidden signature:** "Esteef" in black (`#0b0b0c`) Bodoni Moda Black Italic, about 0.17 in tall, running vertically along the inner edge of one block low on the right side of the back, just above and right of the wordmark. It lands on the same block in every colorway (lime on Hot Wire, cyan on Toxic, pink on Riot).

## Paint style
Chunky, slightly tilted square blocks with rough edges; some have a second color knocked off-register behind them. Square chips thrown around each block, straight drips ending in a small square, trails of shrinking squares, and square "pixel" mist.

## Files (per colorway)
| File | Size | Use |
|---|---|---|
| `front.jpg` | 3600 × 4800 (24 × 32 in, 150 dpi) | Front, toast built in |
| `front-no-logo.jpg` | 3600 × 4800 | Front without the toast (layer the PNG instead) |
| `back.jpg` | 3600 × 4800 | Back, wordmark and signature built in |
| `sleeve-left.jpg`, `sleeve-right.jpg` | 3600 × 2400 | Sleeves |
| `coma-toast-<colorway>.png` | 3000 × 3000, transparent | Toast alone |
| `daily-bread-<colorway>.png` | 3000 × 900, transparent | Wordmark alone |

**Printful setup:** upload front, back and both sleeves to their placements, each set to fill; set a separate collar placement to `#121214`; check in the mockup preview that the toast clears the collar and the wordmark clears the hem. Panels are oversized because Printful's template couldn't be checked.

## Regenerating
From the repo root (needs Node and Playwright): `node tshirts/paintshop/make-logo.js`, then `node tshirts/paintshop/printful.js`. Random seeds: front 3, back 11, sleeves 21 and 34. `CW=toxic` renders one colorway.

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

## Open items
- [ ] Check every placement in Printful's mockup preview (collar, hem, side seams), then order a sample.
