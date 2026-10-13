---
tags: [coma-toast, labels, printful]
updated: 2026-10-13
status: inside label final (Montserrat, tall square block)
---
# Labels

Part of [[Coma Toast]]. Inside and outside neck labels for the tees, with a Daily Bread logo. Made 2026-10-13. **Direction (v2): inside label only, "Daily Bread" (just the words), outline only so the shirt color shows through, in the brand font, Montserrat.** The drip font (Rubik Wet Paint) is design-specific and is not used on labels. **Final: the `tall` variant** (picked 2026-10-13).

- **Local folder:** `G:\ComaToast\Labels\`
- **Repo folder:** `tshirts/labels/` (files in `files/`)

## Print areas (Printful, Bella+Canvas 3001)
- **Inside label:** 3 × 3 in, on the inside back neck. The shirt has a tear-away tag so a custom inside label is allowed. Printful **adds the legally required text itself** (size, material, care, country of origin) from the product variant, so the design only carries the logo, in the top of the square, with the bottom left clear for that text. English only. About $0.99–$1.25 per shirt.
- **Outside label:** 3 × 3 in, on the outside back, just under the collar.

## Brand font: Montserrat (picked 2026-10-13)
**Montserrat ExtraBold (800)**, set in capitals, is the go-forward corporate brand font for labels and other brand pieces. Free under the SIL Open Font License (Google Fonts).

## Inside label: FINAL
**`tall`**: DAILY over BREAD in Montserrat ExtraBold capitals, outline only, the two words filling a 1.25 in square, at the top of Printful's 3 × 3 in inside label.
- Upload `inside-label-white.png` for dark shirts or `inside-label-black.png` for light shirts to the **Inside label** placement (fill the area). Printful adds the size / material / care / origin text below it.
- Files: `tshirts/labels/inside-label-black.png`, `tshirts/labels/inside-label-white.png` (copies of `inside/final/montserrat-tall-<color>.png`), and in `G:\ComaToast\Labels\`.

## Inside label (v3, variants)
- **Text:** DAILY over BREAD, Montserrat ExtraBold capitals, outline only (about 0.022 in, 1.6 pt, even all round; the letters are open so the shirt color shows through). Black for light shirts, white for dark shirts.
- **Justified block:** each line is spaced so its first and last letters sit exactly on the same left and right edges as the other line, with a little extra modern tracking.
- **Variants:**
  - `block`: the justified block, 2.1 in wide.
  - `framed`: the block in a thin square frame (same line weight), 1.35 in square.
  - `tall`: the letters drawn taller so the two words alone fill a 1.25 in square (condensed, fashion-label look). Closest to "a square block".
- **Placement:** top of Printful's 3 × 3 in inside label, centered, top 0.2 in down; the bottom stays clear for Printful's size/material/care/origin text.
- **Files:** `inside/final/montserrat-<block|framed|tall>-<black|white>.png` (900 × 900 px, 300 dpi, transparent) and the review sheet `inside-label-final.png`. Re-render with `node tshirts/labels/inside-final.js`.

## Inside label (v2, font study)
- **Text:** Daily Bread, words only.
- **Style:** outline only. The outline sits outside each letter's edge (about 0.022 in, 1.6 pt, safe for DTG) and the inside of the letter is left open, so the shirt color shows through. Black for light shirts, white for dark shirts.
- **Layouts:** one line, or stacked (Daily over Bread).
- **Placement:** fitted into a 2.5 × 1.2 in box at the top of Printful's 3 × 3 in inside label, centered, top 0.25 in down; the bottom stays clear for Printful's size/material/care/origin text.
- **Files:** `inside/<font>-<line|stacked>-<black|white>.png` (900 × 900 px, 3 × 3 in at 300 dpi, transparent) and the review sheet `inside-label-fonts.png`. Re-render with `node tshirts/labels/inside.js`.

### Brand font candidates (Montserrat picked)
| Font | Character |
|---|---|
| **Bodoni Moda** (ExtraBold, small-text cut) | High-fashion serif, the Vogue/luxury look; fits "expensive, better than you". Also the font of the hidden Esteef signature on [[PaintShop]]. |
| Cinzel (ExtraBold) | Roman capitals; classic, premium. |
| Syne (ExtraBold) | Fashion-forward, very wide. |
| Archivo Black | Sturdy grotesk; streetwear-corporate, most legible small. |
| Unbounded (Bold) | Wide, modern. |
| Montserrat (ExtraBold) | Classic corporate sans; safe. |

All are free under the SIL Open Font License (Google Fonts). Once one is picked, its font file goes into `tshirts/fonts/` with the others.

## v1 options (superseded)
The first round used the drip font, which is now design-only. Kept for reference.

## Logo options
All in **Rubik Wet Paint** (the brand wordmark font, see [[PaintShop]] and [[Benday Logo]]).

| Option | What |
|---|---|
| Daily Bread | The words |
| $Daily Bread$ | The full wordmark |
| DB | Monogram |
| $DB$ | Monogram with dollar signs |
| Reversed DB | The D flipped backwards, back to back with the B (bowls facing out), small gap between the stems. A shared stem was tried and dropped: it turned the pair into a blob at label size. |
| Reversed DB + halo | The reversed DB with the Saint halo from the [[Logo Marks]] over it |

## Styles
- **plain-black:** solid black, for light shirts.
- **plain-white:** solid white, for dark shirts.
- **benday:** white letters with a bold black outline, blue dollar signs, white halo, on the blue Ben-Day stipple swatch from the [[Benday Logo]] tee (black, white and blue). Works on any shirt color.

## Size and placement
| Label | Logo box (fitted, keeps proportions) | Position |
|---|---|---|
| Inside | up to 2.5 × 1.2 in | centered, top 0.25 in down; bottom ~1.5 in left for Printful's text |
| Outside | up to 2 × 1 in | centered, top 0.2 in down (right under the collar) |

The wide wordmarks come out short at these widths (Daily Bread about 0.45 in tall inside, 0.36 in outside); the monograms fill the height (1.2 in inside, 1 in outside), so they read best on the small outside label.

## Files (`files/`)
- `<logo>-<style>-inside.png`, `<logo>-<style>-outside.png`: 900 × 900 px (3 × 3 in at 300 dpi), transparent, logo already placed. Upload to the Inside label / Outside label placement and fill the area.
- `<logo>-<style>.png`: the logo alone, trimmed.
- `labels-inside.png`, `labels-outside.png`: review sheets (inside labels with placeholder Printful text; outside labels on the back of a tee at true scale).

Logo ids: `daily-bread`, `dollar-daily-bread`, `db`, `dollar-db`, `reversed-db`, `halo-db`. Styles: `plain-black`, `plain-white`, `benday`.

## Regenerating
From the repo root (needs Node and Playwright, or `playwright-core` with `PLAYWRIGHT_PATH` and `BROWSER_CHANNEL=msedge`): `node tshirts/labels/labels.js`.

## Change log
- **2026-10-13 — v1:** six logo options in three styles, as inside and outside labels.
- **v2:** inside label only; "Daily Bread" in outline, no drip font; six corporate brand font candidates, one line and stacked, black and white.
- **v3:** Montserrat picked as the brand font. DAILY / BREAD as a justified block, a little more modern (caps, tracked), in three variants: block, framed, tall (square). Outline made by spreading the letter shape, so it is even everywhere.
- **Final:** the tall variant picked as the inside label.

## Open items
- [x] Brand font: Montserrat, stacked.
- [x] Inside label variant: tall.
- [ ] Check both in Printful's mockup.
