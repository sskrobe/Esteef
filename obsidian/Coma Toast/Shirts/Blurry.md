---
tags: [coma-toast, shirt, blurry, printful]
updated: 2026-10-13
status: v1 samples (4 colorways × 2 line styles), waiting on pick
---
# Blurry

Part of [[Coma Toast]]. A double-vision line-art design: the **Saint** mark (main halo logo, see [[Logo Marks]]) drawn as line art **twice, slightly off register**, so it looks like you're seeing double.

- **Status:** v1 samples made 2026-10-13; waiting on the colorway and line style.
- **Local folder:** `G:\ComaToast\Blurry\`
- **Repo folder:** `tshirts/blurry/` (files in `files/<colorway>-<style>/`)

## Look
- **Line art:** outline only (toast silhouette, inner crust line, halo, X eyes, Soft Pulse mouth), every line the same weight.
- **The double:** a second "ghost" copy is shifted right and up (6.5 and 2.5 drawing units, about 0.45 in and 0.17 in on the shirt) and turned 1.6°. The main copy sits on top; **where the two cross, a third overlap color** shows, like misregistered print. All colors are solid (no transparency), so it's safe for DTG.
- **Line styles:**
  - `single`: one line per stroke (about 0.25 in): cleanest, reads best from a distance.
  - `double`: every line is itself two thin parallel lines (about 0.12 in each), so the doubling doubles: more trippy, busier.

| Colorway | Main | Ghost | Overlap | Shirts |
|---|---|---|---|---|
| **Anaglyph** | red `#ff2d55` | cyan `#00d1ff` | violet `#4b2bd6` | dark or light (3D-glasses look) |
| **Brand** | hot pink `#ff2e88` | lime `#c6ff00` | white | dark or light |
| **Mono (dark shirts)** | white | gray `#7a7a7a` | white | dark |
| **Mono (light shirts)** | black `#111111` | gray `#9a9a9a` | black | light |

## Size and placement (go-forward chest standard)
Bella+Canvas 3001 (Printful product 71), DTG front: about **10.45 × 12 in**, centered, top **1.5 in below the collar seam**.

## Back: large DAILY BREAD (current back print)
Asked for 2026-10-13: a **large back print, in addition to the front art**: **DAILY** over **BREAD** in **Rubik Mono One** (a heavy monospaced block face, so the two five-letter words make a perfectly justified block), as line art with the same double-vision ghost, colors and line style as the front. About **11.1 × 4.4 in**, centered across the upper back, its top 1 in below the top of the 12 × 16 in back print area. File: `back-large.png` (whole back area; fill it). For Blurry this replaces the small bottom-right `$Daily Bread$`, which is kept as `back.png` in case it's wanted too.

## Back: small $Daily Bread$ (alternate)
`$DAILY BREAD$` in **Montserrat ExtraBold** (the brand font) as line art with the same double-vision ghost, colors and line style; about 7.1 × 0.93 in, in the bottom-right corner of the 12 × 16 in back print area.

## Files (`files/<colorway>-<style>/`)
- `front.png` (trimmed, 300 dpi, transparent), `back-large.png` (the large block back; whole 12 × 16 in back area, fill it), `back.png` (the small bottom-right alternate).
- `blurry-samples.png`: every colorway and style, front and back, on the shirt colors it suits; `blurry-fronts.png`: the fronts up close.

## Printful setup
1. **Front print:** upload `front.png`, set it about 10.45 in wide (12 in tall), center it, top 1.5 in below the collar seam.
2. **Back print:** upload `back-large.png` and let it fill the area.

## Regenerating
`node tshirts/blurry/blurry.js` (needs Node and Playwright, or `playwright-core` with `PLAYWRIGHT_PATH` and `BROWSER_CHANNEL=msedge`). The ghost offset, line widths and colorways are at the top of the script.

## Change log
- **2026-10-13 — v1:** Saint in double-vision line art, four colorways, single and double line, with the `$Daily Bread$` back.

- **Large back:** DAILY / BREAD in Rubik Mono One block letters, double-vision line art, across the upper back, in addition to the front.

## Open items
- [ ] Pick the colorway and line style.
- [ ] Pick shirt colors.
- [ ] Other marks (plain, Little Devil, Heaven Sent, Raising Hell) or a women's version?
