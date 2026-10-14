---
tags: [coma-toast, shirt, bones, printful]
updated: 2026-10-13
status: v2 (outline made of bones), waiting on review
---
# Bones

Part of [[Coma Toast]]. The **Saint** mark (main halo logo, see [[Logo Marks]]) built entirely out of **little dog bones**. Name is a working title.

- **Status:** v1 and v2 made 2026-10-13; v2 is current.
- **Local folder:** `G:\ComaToast\Bones\`
- **Repo folder:** `tshirts/bones/`

## v2 (current): the outline is made of bones
Feedback on v1: the packed random fill wasn't good; make the outline out of the bones. v2 drops the fill: only the toast's edge, the inner crust line, the face (X eyes, mouth) and the halo are made of bones (about 161), so the shape reads clean. Render option: `BONE.fill` (false).

## Look (v1)
About 255 bones (each about 0.6 in long on the shirt):
- **Outline:** bones laid end to end along the toast's edge, nudged just inside it, so the silhouette stays crisp.
- **Inner crust line:** bones along the line, in the body color.
- **Face:** the X eyes and the Soft Pulse mouth as bones laid along each stroke, in the accent color.
- **Halo:** a ring of bones along the middle of the halo.
- **Fill:** bones at random angles packed inside the toast without touching (dart throwing with capsule collisions, fixed random seed so it renders the same every time).

| Version | Bones | Face | Halo | Shirts |
|---|---|---|---|---|
| **Dark** | bone white `#efe6d2` | red `#ff3b4a` | gold `#f2c230` | dark |
| **Light** | black `#111111` | red `#e3262f` | gold `#d4a017` | light |
| **Brand** | hot pink `#ff2e88` | white | lime `#c6ff00` | dark |

## Size and placement (chest standard)
Bella+Canvas 3001 (Printful product 71), DTG front: **10.17 × 12 in**, centered, top **1.5 in below the collar seam**.

## Back: $Daily Bread$
`$DAILY BREAD$` (Montserrat Black shapes) filled with about 437 tiny bones: words in the body color, dollar signs in the halo color. About 6.95 × 0.75 in, bottom-right corner of the 12 × 16 in back print area.

## Files (`files/<dark|light|brand>/`)
- `front.png` (trimmed, 300 dpi, transparent), `back.png` (whole 12 × 16 in back area; fill it).
- `bones-samples.png`: each version front and back on its shirt, plus close-ups.

## Printful setup
1. **Front print:** upload `front.png`, set it 10.17 in wide (12 in tall), center it, top 1.5 in below the collar seam.
2. **Back print:** upload `back.png` and let it fill the area.

## Regenerating
`node tshirts/bones/bones.js` (needs Node and Playwright, or `playwright-core` with `PLAYWRIGHT_PATH` and `BROWSER_CHANNEL=msedge`). Bone size, spacing and colors are at the top of the script.

## Change log
- **2026-10-13 — v1:** Saint built from dog bones (outline, face, halo, packed fill), dark / light / brand versions, with a bone-filled `$Daily Bread$` back.

- **v2:** fill removed; the outline (edge, inner crust line, face, halo) alone is made of bones.

## Open items
- [ ] Review; pick a version; confirm the name.
