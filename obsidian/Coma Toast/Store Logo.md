---
tags: [coma-toast, brand, store, printful]
updated: 2026-10-13
status: v1 options, waiting on pick
---
# Store Logo

Part of [[Coma Toast]]. The header logo for the Printful quick store **Esteef.co** (https://esteef.printful.me/). As of 2026-10-13 the store header had no logo, just the menu (All products, Men's clothing, Women's clothing); products listed: Blurry King, Argyle King, Stippleton King, Stippleton Queen.

- **Local folder:** `G:\ComaToast\Store\`
- **Repo folder:** `brand/store/` (files in `files/`)

## Options
All use **ESTEEF** in the brand font (**Montserrat ExtraBold**, capitals, tracked +0.12em, see [[Labels]]) and the main halo logo (Saint, see [[Logo Marks]]). One color: **black** for the store's white header, **white** for dark backgrounds.

| Option | What |
|---|---|
| `mark` | The Saint toast beside ESTEEF. |
| `halo` | ESTEEF alone with the Saint halo floating over the first E. Cleanest, most high-fashion. |
| `tagline` | The Saint toast beside ESTEEF, with DAILY BREAD in Montserrat SemiBold under it, letter-spaced to exactly the wordmark's width. |

## Files (`files/`)
- `store-logo-<mark|halo|tagline>-<black|white>.png`: wide header logo, transparent, artwork 300 px tall (plus padding), so it stays sharp on high-resolution screens.
- `store-icon-<black|white>.png`: 1024 × 1024 square of the Saint mark, for a favicon or profile picture.
- `store-logo-options.png`: every option in a mock of the store header (white) and on black.

Printful doesn't publish an exact quick-store logo size; these are high-resolution transparent PNGs that scale down cleanly. Upload the black version where the store's settings take the logo, then check it on desktop and phone.

## Regenerating
`node brand/store/store-logo.js` (needs Node and Playwright, or `playwright-core` with `PLAYWRIGHT_PATH` and `BROWSER_CHANNEL=msedge`).

## Change log
- **2026-10-13 — v1:** three options (mark, halo, tagline) in black and white, plus a square icon.

## Open items
- [ ] Pick the option and upload it to the store.
