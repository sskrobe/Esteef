// Highlight v3, "shade": the Saint mark colored the way marker artists build light and shadow with three markers of
// one color family (after the user's reference video, "Easiest Light and Shadows Tutorial With THREE Markers"):
//   1. a LIGHT base over the whole mark (left as bare paper where the light hits: a highlight along the lit edges),
//   2. a MEDIUM layer over the shadow areas, 3. the DARK marker only in the deepest shadows.
// The light comes from the halo, upper left, so every shadow falls down and to the right with flat, hard edges:
//   - the toast's lower-right sides (medium, then dark right at the edge),
//   - the crust rim shading the inside of the slice along its upper-left edge,
//   - the halo's own lower-right band, and the halo's cast shadow on the toast,
//   - small dark cast shadows under the X eyes and the mouth,
//   - the toast's cast shadow on the white sticker matte (it makes the mark stand up off the shirt).
// Each layer is a flat marker fill with visible stroke streaks, multiplied over the layer below (ink on paper).
// Black fine-liner pen line art on top. Sticker matte (white, 0.3 in border) for dark shirts.
// Colorways: blue (like the video), pink, rainbow (the v1 highlighter colors as the base, violet shadow layers), mint,
// lavender, tangerine. A transparent oval is cut through the halo's center (a thin matte rim kept inside it); the ring's
// back inner edge is shaded and the halo shades the top of that rim, so it still reads as a 3D ring.
// Back: $DAILY BREAD$ shaded the same way on a small matte, bottom-right of the 12 x 16 in back area.
// Size and placement (chest standard): fits a 10.5 x 12 in box, centered, top 1.5 in below the collar seam.
// Outputs: files/shade-<colorway>/front.png, back.png; shade-samples.png.
// Run: node tshirts/highlight/shade.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { logos } = require('../../logos/final/logos');
const { setDpi } = require('../paintshop/printful');

const DPI = 300, BOX_W = 10.5 * DPI, BOX_H = 12 * DPI, INK = '#161616';
const COLORWAYS = {
  blue: { name: 'Blue', light: '#bfe3f7', mid: '#74b4e3', dark: '#2f6fb3', cast: '#cfe3f2' },
  pink: { name: 'Pink', light: '#ffd3e6', mid: '#ff92c0', dark: '#d9467f', cast: '#f6d9e6' },
  rainbow: { name: 'Rainbow', rainbow: true, mid: '#c9b6ff', dark: '#8b6fe0', cast: '#e2dcf5' },
  mint: { name: 'Mint', light: '#c8f5df', mid: '#6fd6a8', dark: '#23926a', cast: '#d6efe3' },
  lavender: { name: 'Lavender', light: '#e3d6ff', mid: '#b294f5', dark: '#6a45c4', cast: '#e6dff5' },
  tangerine: { name: 'Tangerine', light: '#ffdcb8', mid: '#ffa45a', dark: '#dc5f16', cast: '#f6e2cf' },
};
const HL = { pink: '#ff6eb4', orange: '#ffa24a', yellow: '#ffec4a', cyan: '#55dcf0', blue: '#6aa8ff', purple: '#b388ff' };
const ZONES = [['yellow', 'orange'], ['pink', 'orange'], ['orange', 'yellow', 'pink'], ['cyan', 'blue', 'purple']];

const saint = logos.find(l => l.id === 'saint');
const isToast = p => p.shape.includes('scale(0.78)');
const VB = '30 36 140 160';
const svg = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" width="__W__" height="__H__">${inner}</svg>`;
const toastPart = saint.parts.find(isToast), haloPart = saint.parts.find(p => !isToast(p));
const crustRe = /<path d="(M62,108[^"]*)"[^>]*\/>/;
const crustD = toastPart.detail.match(crustRe)[1];
const TG = '<g transform="translate(100,130) scale(0.78) translate(-100,-118)">';
const SVGS = {
  toast: svg(`<g fill="#fff">${toastPart.shape}</g>`),
  halo: svg(`<g fill="#fff">${haloPart.shape}</g>`),
  crumb: svg(`${TG}<path d="${crustD}" fill="#fff"/></g>`),   // inside the crust line
  face: svg(toastPart.detail.replace(crustRe, '').replace(/#000/g, '#fff')),   // X eyes and mouth
  haloFull: svg('<g fill="#fff">' + haloPart.shape.replace(/fill-rule="evenodd"/g, '') + '</g>'),
};
const outline = (w, extra = '') => saint.parts.map(p => `<g fill="none" stroke="${INK}" stroke-width="${isToast(p) ? w / 0.78 : w}" stroke-linejoin="round" ${extra}>${p.shape.replace(/fill-rule="evenodd"/g, '')}</g>`).join('');
const DETAIL = saint.parts.map(p => (p.detail || '').replace(/stroke="#000"/g, `stroke="${INK}"`).replace(/stroke-width="([\d.]+)"/g, (m, n) => `stroke-width="${(n * 0.62).toFixed(2)}"`)).join('');
SVGS.pen = svg(outline(1.25) + `<g transform="translate(0.7,-0.5) rotate(0.5 100 120)">${outline(0.6)}</g>` + DETAIL);

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  await page.setContent('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=block"><body></body>');
  await page.evaluate(async () => { await document.fonts.load('900 100px "Montserrat"', '$DAILY BREAD$'); });
  await page.addScriptTag({ content: `
    window.loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
    window.canvas = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return c; };
    window.rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    window.hard = c => { const x = c.getContext('2d'), d = x.getImageData(0, 0, c.width, c.height); for (let i = 3; i < d.data.length; i += 4) d.data[i] = d.data[i] > 100 ? 255 : 0; x.putImageData(d, 0, 0); return c; };
    window.trim = c => { const W = c.width, H = c.height, d = c.getContext('2d').getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = 0, y1 = 0;
      for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) if (d[(y * W + i) * 4 + 3] > 8) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      const t = canvas(x1 - x0 + 1, y1 - y0 + 1); t.getContext('2d').drawImage(c, -x0, -y0); return t; };
    // mask algebra
    window.copy = m => { const c = canvas(m.width, m.height); c.getContext('2d').drawImage(m, 0, 0); return c; };
    window.shift = (m, dx, dy) => { const c = canvas(m.width, m.height); c.getContext('2d').drawImage(m, dx, dy); return c; };
    window.minus = (a, b) => { const c = copy(a), x = c.getContext('2d'); x.globalCompositeOperation = 'destination-out'; x.drawImage(b, 0, 0); return c; };
    window.and = (a, b) => { const c = copy(a), x = c.getContext('2d'); x.globalCompositeOperation = 'destination-in'; x.drawImage(b, 0, 0); return c; };
    window.or = (...ms) => { const c = canvas(ms[0].width, ms[0].height), x = c.getContext('2d'); ms.forEach(m => x.drawImage(m, 0, 0)); return c; };
    window.grow = (m, r) => { const c = canvas(m.width, m.height), x = c.getContext('2d'); for (let a = 0; a < 360; a += 5) for (const f of [0.34, 0.67, 1]) x.drawImage(m, Math.cos(a * Math.PI / 180) * r * f, Math.sin(a * Math.PI / 180) * r * f); x.drawImage(m, 0, 0); return hard(c); };
    // a pen outline centered on a mask's edge, r each side (ink color)
    window.edge = (m, r) => { const inv = canvas(m.width, m.height), ix = inv.getContext('2d'); ix.fillStyle = '#fff'; ix.fillRect(0, 0, inv.width, inv.height); ix.globalCompositeOperation = 'destination-out'; ix.drawImage(m, 0, 0);
      const ring = minus(grow(m, r), minus(m, grow(inv, r))), x = ring.getContext('2d'); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#161616'; x.fillRect(0, 0, ring.width, ring.height); return ring; };
    // one marker stroke (chisel ends, slight bow, faint lighter streaks) drawn onto ctx in color col
    window.marker = (cx, x0, y0, x1, y1, w, col, R, alpha) => {
      const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux, sl = w * 0.35, bow = (R() - 0.5) * w * 0.6;
      const P = (t, s) => [x0 + ux * t + nx * s + nx * bow * 4 * (t / L) * (1 - t / L), y0 + uy * t + ny * s + ny * bow * 4 * (t / L) * (1 - t / L)];
      const shape = x => { x.beginPath(); const N = 16; for (let i = 0; i <= N; i++) { const [a, b] = P(sl + (L - sl) * i / N, -w / 2); i ? x.lineTo(a, b) : x.moveTo(a, b); }
        for (let i = N; i >= 0; i--) { const [a, b] = P((L - sl) * i / N, w / 2); x.lineTo(a, b); } x.closePath(); };
      cx.save(); cx.globalAlpha = alpha; cx.fillStyle = col; shape(cx); cx.fill();
      cx.globalAlpha = 0.18; cx.strokeStyle = '#ffffff'; cx.lineWidth = Math.max(2, w * 0.03); shape(cx); cx.clip();
      for (let k = 0; k < 3; k++) { const s = (R() - 0.5) * w * 0.8; cx.beginPath(); for (let i = 0; i <= 12; i++) { const [a, b] = P(L * i / 12, s); i ? cx.lineTo(a, b) : cx.moveTo(a, b); } cx.stroke(); }
      cx.restore(); };
    // one marker LAYER over a region: a flat fill plus streaky strokes on one diagonal, clipped to the region, then
    // multiplied onto the paper (layers of the same family darken like real marker). colorAt(x, y) picks the color.
    window.layer = (paper, region, colorAt, R, ang, w) => {
      const W = paper.width, H = paper.height, t = canvas(W, H), tx = t.getContext('2d');
      const ux = Math.cos(ang), uy = Math.sin(ang), nx = -uy, ny = ux, D = Math.hypot(W, H);
      for (let s = -D / 2; s < D / 2; s += w * 0.7) { let p = -D / 2;
        while (p < D / 2) { const l = (1 + R() * 2.2) * 300, a = [W / 2 + nx * s + ux * p, H / 2 + ny * s + uy * p], b = [a[0] + ux * l, a[1] + uy * l];
          marker(tx, a[0], a[1], b[0], b[1], w * (0.95 + R() * 0.1), colorAt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2), R, 0.82 + R() * 0.12); p += l - w * 0.25; } }   // the small gaps where strokes meet leave white "rain" dashes (the user likes them)
      const clipped = and(t, region), px = paper.getContext('2d'); px.save(); px.globalCompositeOperation = 'multiply'; px.drawImage(clipped, 0, 0); px.restore(); };
  ` });

  const root = path.join(__dirname, 'files'), sizes = {};
  for (const [cid, cw] of Object.entries(COLORWAYS)) {
    const res = await page.evaluate(async ({ cw, SVGS, HL, ZONES, BOX_W, BOX_H }) => {
      const IN = 300, MH = 13.2 * IN, MW = MH * 140 / 160, PM = 0.7 * IN, W = Math.ceil(MW + 2 * PM), H = Math.ceil(MH + 2 * PM), R = rng(2024);
      const place = async s => { const i = await loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s.replace('__W__', MW).replace('__H__', MH)));
        const c = canvas(W, H); c.getContext('2d').drawImage(i, PM, PM, MW, MH); return hard(c); };
      const haloFull = await place(SVGS.haloFull), toast = await place(SVGS.toast), halo = await place(SVGS.halo), crumb = await place(SVGS.crumb), face = await place(SVGS.face);
      const sil = or(toast, halo);
      // light from the upper left: shadows fall along v (down and to the right)
      const vx = 0.62, vy = 0.78, sh = d => [vx * d * IN, vy * d * IN];
      const away = (m, d) => { const [dx, dy] = sh(d); return minus(m, shift(m, -dx, -dy)); };   // band along the edges facing away from the light
      const toward = (m, d) => { const [dx, dy] = sh(d); return minus(m, shift(m, dx, dy)); };  // band along the edges facing the light
      const cast = (m, d) => { const [dx, dy] = sh(d); return shift(m, dx, dy); };
      const rim = minus(toast, crumb);
      const hole = minus(haloFull, halo);
      const shrink = (m, r) => { const inv = canvas(W, H), ix = inv.getContext('2d'); ix.fillStyle = '#fff'; ix.fillRect(0, 0, W, H); ix.globalCompositeOperation = 'destination-out'; ix.drawImage(m, 0, 0); return minus(m, grow(inv, r)); };
      const holeCut = shrink(hole, 0.1 * IN), holeRim = minus(hole, holeCut);
      const down = (m, d) => shift(m, 0, -d * IN);   // p is in down(m, d) when the point d below p is in m
      // highlight: bare paper along the lit edges of the crust rim and the halo
      const highlight = or(and(toward(toast, 0.13), rim), toward(halo, 0.06));
      // medium shadows
      const mid = or(
        away(toast, 0.95),                         // the toast's shadow side
        and(toward(crumb, 0.42), crumb),           // the rim shading the inside of the slice
        away(halo, 0.16),                          // the halo's own shadow side
        and(minus(cast(halo, 1.25), halo), toast), // the halo's cast shadow on the toast
        and(down(hole, 0.16), halo),               // the ring's back inner edge, seen through the hole
      );
      // darkest shadows
      const dark = or(
        away(toast, 0.3),
        and(toward(crumb, 0.13), crumb),
        and(minus(cast(face, 0.11), face), toast), // under the X eyes and the mouth
        and(down(hole, 0.055), halo),              // the deepest part of that inner edge
      );
      // paper: the sticker matte, grown around the mark and its cast shadow on the matte
      const castOnMatte = minus(cast(sil, 0.32), sil);
      const matte = grow(or(sil, castOnMatte), 0.3 * IN);
      const paper = canvas(W, H), p = paper.getContext('2d'); p.drawImage(matte, 0, 0); p.globalCompositeOperation = 'source-in'; p.fillStyle = '#fff'; p.fillRect(0, 0, W, H); p.globalCompositeOperation = 'source-over';
      // the light base
      let y0 = H, y1 = 0; { const d = sil.getContext('2d').getImageData(0, 0, W, H).data; for (let y = 0; y < H; y += 6) for (let x = 0; x < W; x += 6) if (d[(y * W + x) * 4 + 3]) { if (y < y0) y0 = y; if (y > y1) y1 = y; } }
      const zone = (x, y) => { let t = (y - y0) / (y1 - y0) + 0.08 * Math.sin(x / W * 6) + (R() - 0.5) * 0.1; const z = t < 0.17 ? 0 : t < 0.42 ? 1 : t < 0.68 ? 2 : 3; const pal = ZONES[z]; return HL[pal[(R() * pal.length) | 0]]; };
      const w = 0.42 * IN;
      layer(paper, minus(sil, highlight), cw.rainbow ? zone : () => cw.light, R, -0.62, w);
      layer(paper, castOnMatte, () => cw.cast, R, -0.62, w);
      layer(paper, and(shift(halo, 0, 0.12 * IN), holeRim), () => cw.cast, R, -0.62, w);   // the halo shading the top of the inner rim
      layer(paper, mid, () => cw.mid, R, -0.62, w);
      layer(paper, dark, () => cw.dark, R, -0.62, w * 0.8);
      // pen line art on top
      const pen = canvas(W, H); { const i = await loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(SVGS.pen.replace('__W__', MW).replace('__H__', MH))); pen.getContext('2d').drawImage(i, PM, PM, MW, MH); }
      p.drawImage(pen, 0, 0);
      // cut the oval through: the shirt shows inside the halo
      p.globalCompositeOperation = 'destination-out'; p.drawImage(holeCut, 0, 0); p.globalCompositeOperation = 'source-over';
      const art = trim(paper), f = Math.min(BOX_W / art.width, BOX_H / art.height), r = canvas(Math.round(art.width * f), Math.round(art.height * f));
      const rx = r.getContext('2d'); rx.imageSmoothingQuality = 'high'; rx.drawImage(art, 0, 0, r.width, r.height); hard(r);
      return { png: r.toDataURL('image/png'), w: r.width, h: r.height };
    }, { cw, SVGS, HL, ZONES, BOX_W, BOX_H });
    const dir = path.join(root, 'shade-' + cid); fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'front.png'), setDpi(Buffer.from(res.png.split(',')[1], 'base64'), true));

    // BACK: $DAILY BREAD$ shaded the same way (light letters, medium and dark on the lower-right edges, a cast
    // shadow on the matte), pen outline, on a small matte, bottom-right of the 12 x 16 in back area
    const back = await page.evaluate(({ cw, HL, DPI }) => {
      const AREA_W = 12 * DPI, AREA_H = 16 * DPI, INSET = 0.1 * DPI, TW = 7 * DPI, t = '$DAILY BREAD$', R = rng(88);
      const m = canvas(10, 10).getContext('2d'); m.font = '900 100px "Montserrat"'; const px = 100 * TW / m.measureText(t).width;
      const W = TW + 0.6 * DPI, H = px * 1.3 + 0.5 * DPI, X = 0.25 * DPI, Y = H / 2 + px * 0.36;
      const T = canvas(W, H), tx = T.getContext('2d'); tx.font = '900 ' + px + 'px "Montserrat"'; tx.fillStyle = '#fff'; tx.fillText(t, X, Y); hard(T);
      const k = px / 300, sh = d => [0.62 * d * k * 300, 0.78 * d * k * 300];
      const away = (mm, d) => { const [dx, dy] = sh(d); return minus(mm, shift(mm, -dx, -dy)); };
      const castM = minus(shift(T, ...sh(0.07)), T);
      const paper = canvas(W, H), p = paper.getContext('2d'); p.drawImage(grow(or(T, castM), 0.07 * DPI), 0, 0); p.globalCompositeOperation = 'source-in'; p.fillStyle = '#fff'; p.fillRect(0, 0, W, H); p.globalCompositeOperation = 'source-over';
      const cols = [HL.pink, HL.orange, HL.yellow, HL.cyan, HL.blue, HL.purple];
      layer(paper, T, cw.rainbow ? (x => cols[Math.min(5, (x / W * 6) | 0)]) : () => cw.light, R, -0.62, px * 0.35);
      layer(paper, castM, () => cw.cast, R, -0.62, px * 0.35);
      layer(paper, away(T, 0.1), () => cw.mid, R, -0.62, px * 0.35);
      layer(paper, away(T, 0.035), () => cw.dark, R, -0.62, px * 0.3);
      p.drawImage(edge(T, px * 0.0225), 0, 0);   // pen outline from the letter silhouette (strokeText traces the font's overlapping contours)
      const art = trim(hard(paper)), f = canvas(AREA_W, AREA_H);
      f.getContext('2d').drawImage(art, AREA_W - INSET - art.width, AREA_H - INSET - art.height);
      return { png: f.toDataURL('image/png'), w: art.width, h: art.height };
    }, { cw, HL, DPI });
    fs.writeFileSync(path.join(dir, 'back.png'), setDpi(Buffer.from(back.png.split(',')[1], 'base64'), true));
    sizes[cid] = { front: { wIn: +(res.w / DPI).toFixed(2), hIn: +(res.h / DPI).toFixed(2) }, back: { wIn: +(back.w / DPI).toFixed(2), hIn: +(back.h / DPI).toFixed(2) } };
  }
  fs.writeFileSync(path.join(root, 'shade-sizes.json'), JSON.stringify(sizes, null, 2) + '\n');

  // Sheet: each colorway, front and back on black and white shirts (size L, true scale), plus a close-up.
  const PX = 13, href = p => 'file:///' + p.replace(/\\/g, '/');
  const TEE = 'M-3.6,0 L-9.8,1.2 L-15.6,7.6 L-12.6,10.8 L-11,9.3 L-11,30 L11,30 L11,9.3 L12.6,10.8 L15.6,7.6 L9.8,1.2 L3.6,0 Q0,6 -3.6,0 Z';
  const cells = [], fig = (inner, cap) => `<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333">${inner}<figcaption>${cap}</figcaption></figure>`;
  const BK = '#17171a', BKC = '#26262a';
  for (const [cid, cw] of Object.entries(COLORWAYS)) {
    const z = sizes[cid].front, fp = href(path.join(root, 'shade-' + cid, 'front.png')), bp = href(path.join(root, 'shade-' + cid, 'back.png'));
    cells.push(fig(`<svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE}" fill="${BK}"/><path d="M-3.6,0 Q0,6 3.6,0" fill="none" stroke="${BKC}" stroke-width="0.75"/><image href="${fp}" x="${-z.wIn / 2}" y="4.5" width="${z.wIn}" height="${z.hIn}"/></svg>`, `${cw.name} on black · front · ${z.wIn} × ${z.hIn} in`));
    cells.push(fig(`<svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE.replace('Q0,6', 'Q0,2')}" fill="${BK}"/><path d="M-3.6,0 Q0,2 3.6,0" fill="none" stroke="${BKC}" stroke-width="0.75"/><image href="${bp}" x="-6" y="3" width="12" height="16"/></svg>`, 'back'));
    for (const c of [BK, '#f7f7f5']) cells.push(fig(`<div style="background:${c};padding:14px;width:${33 * PX - 28}px;height:${33.5 * PX - 28}px;display:flex;align-items:center;justify-content:center"><img src="${fp}" style="max-width:100%;max-height:100%"></div>`, c === BK ? 'close-up on black' : 'close-up on white'));
  }
  const tmp = path.join(root, '_sheet.html');
  fs.writeFileSync(tmp, `<body style="margin:0;padding:10px;background:#ececea;display:grid;grid-template-columns:repeat(4,auto);gap:8px 12px">${cells.join('')}</body>`);
  await page.setViewportSize({ width: 4 * (33 * PX + 12) + 30, height: 400 });
  await page.goto(href(tmp)); await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(__dirname, 'shade-samples.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log(JSON.stringify(sizes));
})();
