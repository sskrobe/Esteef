---
tags: [coma-toast, shirt, looney, printful]
updated: 2026-10-13
status: v1 samples (3 colorways), waiting on colorway pick
---
# Looney

Part of [[Coma Toast]]. The **Saint** mark (toast + halo, see [[Logo Marks]]) as a flat cartoon character over a classic cartoon **bullseye of concentric rings**, inspired by old cartoon end cards and a Psycho Bunny ring tee. Only the ring motif is borrowed, no cartoon text or characters.

- **Status:** v1 samples made 2026-10-13; waiting on the colorway pick.
- **Local folder:** `G:\ComaToast\Looney\`
- **Repo folder:** `tshirts/looney/`

## Look
- **Rings:** 7 concentric rings with transparent gaps between them, so the shirt color shows through.
- **Character:** the Saint toast drawn flat in one color with a thick black cartoon outline, a black face (X eyes, Soft Pulse mouth, inner crust line) and the halo in a second color. It is drawn 1.3× over the rings: the toast fills the middle of the bullseye, rings show all around it, and the halo reaches toward the outer rings.

| Colorway | Toast | Halo | Rings (inside → out) |
|---|---|---|---|
| **Neon** | cyan `#00e5ff` | yellow `#ffe600` | yellow, lime, orange, pink, purple, blue, pink |
| **Classic** | toast gold `#f7c26b` | `#ffe14d` | red `#e3262f` / gold `#ffb400` alternating, deep blue center `#173a8c` |
| **Brand (Hot Wire)** | white `#f4f4f2` | lime `#c6ff00` | lime / pink `#ff2e88` alternating |

## Size and placement (go-forward chest standard)
Bella+Canvas 3001 (Printful product 71), DTG front: the art is **10.5 × 10.5 in** (fits the 10.5 × 12 in standard box), centered, top **1.5 in below the collar seam**.

## Back: $Daily Bread$
`$DAILY BREAD$` in **Luckiest Guy** (a cartoon display font, design-specific; SIL OFL via Google Fonts), words in the toast color, dollar signs in the halo color, thick black outline, and two offset "echo" shadows in ring colors (the cartoon 3D look). Lettering 7 in wide (about 7.42 × 1.35 in with the echoes), in the bottom-right corner of the 12 × 16 in back print area.

## Files (`files/<neon|classic|brand>/`)
| File | What |
|---|---|
| `front.png` | Front art, trimmed, 300 dpi, transparent, 10.5 × 10.5 in |
| `front.svg` | Vector source |
| `back.png` | The whole 12 × 16 in back print area with `$Daily Bread$` in the bottom-right corner (fill the area) |
| `../../looney-samples.png` | Every colorway, front and back, on a black and a white size L tee |

## Printful setup
1. **Front print:** upload `front.png`, set it 10.5 in wide, center it, top 1.5 in below the collar seam.
2. **Back print:** upload `back.png` and let it fill the area.

## Regenerating
`node tshirts/looney/looney.js` (needs Node and Playwright, or `playwright-core` with `PLAYWRIGHT_PATH` and `BROWSER_CHANNEL=msedge`). Colorways, ring sizes and the character scale are at the top of the script.

## Change log
- **2026-10-13 — v1:** Saint over concentric rings in Neon, Classic and Brand colorways; `$Daily Bread$` back with ring-colored echoes. Character scale tried at 1.0 (too small), 1.55 (covered the rings), settled at 1.3.

## Open items
- [ ] Pick the colorway.
- [ ] Pick shirt colors.
- [ ] Women's version?
