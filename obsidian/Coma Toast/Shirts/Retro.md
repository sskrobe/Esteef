---
tags: [coma-toast, shirt, retro, printful]
updated: 2026-10-13
status: rejected
---
# Retro

Part of [[Coma Toast]]. An **80s synthwave / outrun** scene starring the three character marks (see [[Logo Marks]]): the **Saint** (left), the plain **Coma Toast** (center, biggest) and the **Little Devil** (right). Name is a working title. Replaces [[Bones]] and [[Equalizer]] (both rejected).

- **Status:** **rejected** 2026-10-13 (the user wanted something more unique and high fashion that only alludes to the 80s). Replaced by [[Scanline]]. Files kept for reference.
- **Local folder:** `G:\ComaToast\Retro\`
- **Repo folder:** `tshirts/retro/`

## Look
- **Sun:** a big gradient sun setting on the horizon, sliced by stripes that get wider toward the horizon (the stripes are cut out, so the shirt shows through).
- **Grid:** a perspective laser grid floor; lines get thinner and closer toward the horizon.
- **Characters:** standing on the horizon in front of the sun, as dark figures with **neon-tube outlines**; inner crust line, X eyes and Soft Pulse mouth drawn as neon; halo and horns in their own colors. A clear gap is cut around each figure so it pops.
- **Text:** **DAILY BREAD** in 80s chrome (Montserrat Black Italic, sky-over-sunset chrome fill, extruded down-right, dark keyline), with **Coma Toast** in a neon script (Mr Dafoe) slashed under it.
- Solid colors and gradients only, no soft glows or partial transparency (DTG-safe).

| Colorway | Sun | Grid | Tubes / script | Face | Halo / horns | Shirts |
|---|---|---|---|---|---|---|
| **Outrun** | yellow → orange → magenta | hot pink `#ff2e88` | cyan `#27f4ff` / pink script | hot pink | yellow / red | black, navy |
| **Miami** | pale pink → pink → violet → teal | teal `#16d9c5` | pink `#ff6fb5` / teal script | teal | pale yellow / pink-red | black, navy |

The characters can be swapped (for example Heaven Sent and Raising Hell, the winged versions) in `CAST` at the top of the script.

## Size and placement (chest standard)
Bella+Canvas 3001 (Printful product 71), DTG front: **10.5 × 10.94 in**, centered, top **1.5 in below the collar seam**.

## Back: $Daily Bread$
`$DAILY BREAD$` in the same chrome (extrude in the colorway's accent), about 7.17 × 0.9 in, bottom-right of the 12 × 16 in back print area.

## Files (`files/<outrun|miami>/`)
- `front.png` (trimmed, 300 dpi, transparent), `back.png` (whole 12 × 16 in back area; fill it).
- `retro-samples.png`: each colorway on black and navy, front and back, plus close-ups.

## Printful setup
1. **Front print:** upload `front.png`, set it 10.5 in wide, center it, top 1.5 in below the collar seam.
2. **Back print:** upload `back.png` and let it fill the area.

## Regenerating
`node tshirts/retro/retro.js` (needs Node and Playwright, or `playwright-core` with `PLAYWRIGHT_PATH` and `BROWSER_CHANNEL=msedge`). Colors, cast, sun stripes and grid are in the script.

## Change log
- **2026-10-13 — rejected:** too obvious; replaced by [[Scanline]].
- **2026-10-13 — v1:** synthwave sun, laser grid, the three characters in neon outlines, chrome DAILY BREAD with neon Coma Toast script; Outrun and Miami colorways; chrome `$Daily Bread$` back.

## Open items
- None (rejected).
