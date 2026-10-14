---
tags: [coma-toast, shirt, scrambled, printful]
updated: 2026-10-13
status: v2 (sharp logo over a scrambled background), waiting on review
---
# Scrambled

Part of [[Coma Toast]]. The **Saint** mark (halo logo, see [[Logo Marks]]) as a full chest print of an **80s scrambled cable channel**: TV static plus the wavy, torn, false-colored picture of a premium channel you didn't pay for (after the user's scrambled-TV screenshots). Name is a working title. Replaces [[Scanline]] (rejected), keeping its scan-line / VHS idea.

- **Status:** v1 and v2 made 2026-10-13; v2 is current.
- **Local folder:** `G:\ComaToast\Scrambled\`
- **Repo folder:** `tshirts/scrambled/`

## v2 (current): sharp logo, scrambled background
Feedback on v1: put the blur in the background; the logo should be clearly visible in the foreground; the static should affect the logo. v2 splits it into layers:
- **Background:** the scramble (waves, tears, rolls, red / blue split, drifting false color) on a swirling field with a big, faint echo of the Saint in it.
- **Foreground:** the Saint, sharp and undistorted: cream toast `#fbf6ea`, gold halo `#ffe45c`, black face and dark keyline, with a thin red / cyan fringe (Static version: white toast and halo). Only a few thin jitter slices nudge it sideways.
- **Static over everything, logo included:** grain, snow bands, white dropout streaks, dim scan lines.
- **Back:** `$DAILY BREAD$` sharp (cream, keyline, fringe) on a small scrambled strip with the static over it.

## Look (v1)
The picture (the Saint big and centered, with a dark keyline, over a swirling background) is pushed through a "lost sync" pass:
- **Wavy tearing:** every scan line is shoved sideways by stacked sine waves, plus a few hard tearing bands with a slant; two thin bands roll vertically.
- **Rainbow fringes:** the red and blue channels are pulled apart.
- **False color:** the picture's brightness is mapped to colors that drift in bands: **acid green**, **magenta** and **violet** (the halo stays near white).
- **Static:** fine grain everywhere, a few bands of snow, white dropout streaks, and dim scan lines.
- **Frayed edges:** the screen's left and right edges fray row by row and follow the tears, so it dissolves into the shirt instead of a hard rectangle.
- Fixed random seed, so it renders the same every time. Full-color raster, no partial transparency (DTG).

| Version | Colors | Shirts |
|---|---|---|
| **Scrambled** | acid green / magenta / violet false color | black (best), white |
| **Static** | black and white with red / cyan fringes | black, white |

## Size and placement (chest standard)
Bella+Canvas 3001 (Printful product 71), DTG front: **10.5 × 9.66 in**, centered, top **1.5 in below the collar seam**.

## Back: $Daily Bread$
`$DAILY BREAD$` (Montserrat Black) as a small scrambled strip in the same treatment, 7.2 × 1.25 in, bottom-right of the 12 × 16 in back print area.

## Files (`files/<scrambled|static>/`)
- `front.png` (300 dpi), `back.png` (whole 12 × 16 in back area; fill it).
- `scrambled-samples.png`: each version on black and white, front and back, plus close-ups.

## Printful setup
1. **Front print:** upload `front.png`, set it 10.5 in wide, center it, top 1.5 in below the collar seam.
2. **Back print:** upload `back.png` and let it fill the area.

## Regenerating
`node tshirts/scrambled/scrambled.js` (needs Node and Playwright, or `playwright-core` with `PLAYWRIGHT_PATH` and `BROWSER_CHANNEL=msedge`). Color maps are at the top; tear, roll, snow and wave amounts are in `scramble()`. Change the seed (1986) for a different scramble.

## Change log
- **2026-10-13 — v2:** scramble moved to the background, the Saint sharp in the foreground, static over everything (logo included); back text sharp too.
- **2026-10-13 — v1:** scrambled-channel Saint, scrambled and static versions, scrambled `$Daily Bread$` back. Rolling bands toned down so the face stays readable.

## Open items
- [ ] Review; pick scrambled, static or both; confirm the name.
