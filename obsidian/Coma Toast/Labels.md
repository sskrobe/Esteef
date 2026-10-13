---
tags: [coma-toast, labels, printful]
updated: 2026-10-13
status: v1 options made, waiting on pick
---
# Labels

Part of [[Coma Toast]]. Inside and outside neck labels for the tees, with a Daily Bread logo. Made 2026-10-13; waiting on a pick of logo and style.

- **Local folder:** `G:\ComaToast\Labels\`
- **Repo folder:** `tshirts/labels/` (files in `files/`)

## Print areas (Printful, Bella+Canvas 3001)
- **Inside label:** 3 × 3 in, on the inside back neck. The shirt has a tear-away tag so a custom inside label is allowed. Printful **adds the legally required text itself** (size, material, care, country of origin) from the product variant, so the design only carries the logo, in the top of the square, with the bottom left clear for that text. English only. About $0.99–$1.25 per shirt.
- **Outside label:** 3 × 3 in, on the outside back, just under the collar.

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

## Open items
- [ ] Pick the logo and style for the inside label and for the outside label.
- [ ] Check both in Printful's mockup.
