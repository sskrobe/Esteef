---
tags: [coma-toast, shirt, metal, printful]
updated: 2026-10-14
status: v2 (no wordmark), waiting on colorway pick
---
# Metal

Part of [[Coma Toast]]. The **Saint** mark (halo logo, see [[Logo Marks]]) as a bone-white **outline** over a wall of **tiny type**, made darker, scarier and more **heavy metal**. Uses the subtle-background technique from [[Highlight]] (the "Tiny type" option). Name is a working title.

- **Status:** v1 and v2 made 2026-10-14; v2 is current (the big COMA TOAST wordmark removed).
- **Local folder:** `G:\ComaToast\Metal\`
- **Repo folder:** `tshirts/metal/`

## Look
- **Text wall:** rows of `COMA TOAST ✕ DAILY BREAD ✕` in a blackletter face (Pirata One, about 0.2 in tall) across the whole art box. **Dark gray outside** the mark, fading out word by word toward the edges; **blood red inside the toast**, so the mark is drawn by the change in color of the text (the rows run straight through). A clean gap is kept around every line.
- **The mark:** bone-white outline, inner crust line, X eyes and Soft Pulse mouth; the **halo is solid bone with thorn spikes** all around it; **blood drips** hang from the bottom edge of the toast.
- **Wordmark:** v1 had a big COMA TOAST band wordmark (Metal Mania) under the mark; **removed in v2** (the user found it too much). The text wall now surrounds the mark on all sides.
- Solid colors only (DTG). Made for black shirts.

| Colorway | Text outside | Text inside | Line art | Drips / drop |
|---|---|---|---|---|
| **Blood** | dark gray `#3b3b40` | blood red `#a3121b` | bone `#e6dcc4` | blood red |
| **Ash** | dark gray `#36363b` | gray `#5f5b52` | bone | gray |

## Size and placement (chest standard)
Bella+Canvas 3001 (Printful product 71), DTG front: **10.27 × 10.42 in**, centered, top **1.5 in below the collar seam**.

## Back: $Daily Bread$
`$DAILY BREAD$` in the metal-band face, bone with the red (Ash: gray) drop, about 7 × 1.1 in, bottom-right of the 12 × 16 in back print area.

## Files (`files/<blood|ash>/`)
- `front.png` (trimmed, 300 dpi, transparent), `back.png` (whole 12 × 16 in back area; fill it).
- `metal-samples.png`: each colorway on a black tee, front and back, plus a close-up.

## Printful setup
1. **Front print:** upload `front.png`, set it 10.27 in wide (10.42 in tall), center it, top 1.5 in below the collar seam.
2. **Back print:** upload `back.png` and let it fill the area.

## Regenerating
`node tshirts/metal/metal.js` (needs Node and Playwright, or `playwright-core` with `PLAYWRIGHT_PATH` and `BROWSER_CHANNEL=msedge`). Text, colors, spikes and drips are at the top of the script.

## Change log
- **2026-10-14 — v2:** big COMA TOAST wordmark removed; the text wall frames the mark on all sides.
- **2026-10-14 — v1:** outline Saint over a blackletter tiny-type wall (gray outside, red inside), thorn halo, blood drips, metal wordmark; Blood and Ash; drips moved to hang from the outer edge.

## Open items
- [ ] Pick Blood or Ash; confirm the name.
