// Metal: the Saint mark (halo logo) as a bone-white OUTLINE over a wall of TINY TYPE, darker and more heavy metal.
// The tiny type (rows of COMA TOAST ✕ DAILY BREAD ✕ in a blackletter face) fills the art box: dark gray outside the
// mark, blood red inside the toast, so the mark is drawn by the change in color of the text; it fades out toward the
// box edges (the subtle-background technique), with a clean gap kept around the outline. The halo is solid bone with
// thorn spikes all around it; blood drips hang from the bottom of the toast; a metal-band style COMA TOAST wordmark
// (Metal Mania) sits underneath, bone white with a red drop.
// Colorways: blood (red text inside, red drips and drop) and ash (all grays and bone).
// Back: $DAILY BREAD$ in the band font, bone with the red (or gray) drop, bottom-right of the 12 x 16 in back area.
// Size and placement (chest standard, Bella+Canvas 3001): fits a 10.5 x 12 in box, centered, top 1.5 in below the
// collar seam. Solid colors only (DTG).
// Outputs: files/<blood|ash>/front.png, back.png; metal-samples.png.
// Run: node tshirts/metal/metal.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { logos } = require('../../logos/final/logos');
const { setDpi } = require('../paintshop/printful');

const COLORWAYS = {
  blood: { name: 'Blood', outside: '#3b3b40', inside: '#a3121b', bone: '#e6dcc4', drip: '#a3121b', drop: '#8a0f17' },
  ash: { name: 'Ash', outside: '#36363b', inside: '#5f5b52', bone: '#e6dcc4', drip: '#7a766c', drop: '#4a4740' },
};
const TEXT = 'COMA TOAST  ✕  DAILY BREAD  ✕  ';
const DPI = 300, BOX_W = 10.5 * DPI, BOX_H = 12 * DPI;
const saint = logos.find(l => l.id === 'saint');
const isToast = p => p.shape.includes('scale(0.78)');
const VB = [30, 34, 140, 166];
const svg = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB.join(' ')}" width="__W__" height="__H__">${inner}</svg>`;
const toastPart = saint.parts.find(isToast), haloPart = saint.parts.find(p => !isToast(p));
// the halo: center and radii (round-11 halo: A38,9 outer, A28,4.5 inner, shifted down by the final tweak)
const hy = +haloPart.shape.match(/translate\(0,([\d.]+)\)/)[1] + 65.96, HCX = 100;
const spikes = (fill) => { let s = ''; for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2, len = i % 2 ? 7 : 12, w = 0.09;
  const p = (ang, r) => [HCX + Math.cos(ang) * 38 * r, hy + Math.sin(ang) * 9 * r];
  const b1 = p(a - w, 0.98), b2 = p(a + w, 0.98), tip = [HCX + Math.cos(a) * (38 + len), hy + Math.sin(a) * (9 + len * 0.42)];
  if (Math.sin(a) > 0.55) continue;   // none hanging down into the toast
  s += `<path d="M ${b1[0].toFixed(2)} ${b1[1].toFixed(2)} L ${tip[0].toFixed(2)} ${tip[1].toFixed(2)} L ${b2[0].toFixed(2)} ${b2[1].toFixed(2)} Z" fill="${fill}"/>`; } return s; };
const drips = (fill) => { const xs = [[66, 10], [74, 20], [83, 7], [92, 15], [104, 24], [113, 9], [122, 17], [131, 11]]; const by = 179.5;   // just inside the outer bottom edge, so the outline covers the top of each drip
  return xs.map(([x, l]) => `<path d="M ${x - 2.6} ${by} L ${x - 2.2} ${by + l} A 2.4 2.4 0 0 0 ${x + 2.2} ${by + l} L ${x + 2.6} ${by} Z" fill="${fill}"/>`).join(''); };
const outline = (col, w) => saint.parts.map(p => `<g fill="none" stroke="${col}" stroke-width="${isToast(p) ? w / 0.78 : w}" stroke-linejoin="round">${p.shape.replace(/fill-rule="evenodd"/g, '')}</g>`).join('');
const details = (col, k) => toastPart.detail.replace(/stroke="#000"/g, `stroke="${col}"`).replace(/stroke-width="([\d.]+)"/g, (m, n) => `stroke-width="${(n * k).toFixed(2)}"`);
const SVGS = cw => ({
  sil: svg(saint.parts.map(p => `<g fill="#fff">${p.shape}</g>`).join('')),
  toast: svg(`<g fill="#fff">${toastPart.shape}</g>`),
  gap: svg(outline('#fff', 7) + details('#fff', 1.9) + spikes('#fff').replace(/<path /g, '<path stroke="#fff" stroke-width="5" ') + drips('#fff').replace(/<path /g, '<path stroke="#fff" stroke-width="4" ')),
  art: svg(drips(cw.drip) + spikes(cw.bone) + `<g fill="${cw.bone}">${haloPart.shape}</g>` + outline(cw.bone, 2.6) + details(cw.bone, 0.85)),
});

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  await page.setContent('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Pirata+One&family=Metal+Mania&display=block"><body></body>');
  await page.evaluate(async () => { await document.fonts.load('100px "Pirata One"', 'COMA TOAST ✕ DAILY BREAD'); await document.fonts.load('100px "Metal Mania"', '$COMA TOAST DAILY BREAD$'); });
  const root = path.join(__dirname, 'files'), sizes = {};
  for (const [cid, cw] of Object.entries(COLORWAYS)) {
    const res = await page.evaluate(async ({ cw, S, VB, TEXT, BOX_W, BOX_H }) => {
      const IN = 300, W = BOX_W, H = BOX_H;
      const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return c; };
      const load = s => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s); });
      // the mark: 9.4 in tall, centered, near the top; the wordmark goes under it
      const MH = 9.4 * IN, MW = MH * VB[2] / VB[3], MX = (W - MW) / 2, MY = 0.05 * IN;
      const lay = async s => { const c = canvas(W, H); c.getContext('2d').drawImage(await load(s.replace('__W__', MW).replace('__H__', MH)), MX, MY, MW, MH); return c; };
      const sil = await lay(S.sil), toast = await lay(S.toast), gap = await lay(S.gap), art = await lay(S.art);
      // the text wall: rows over the whole box; outside the mark it fades out toward the edges (word by word)
      let seed = 66; const R = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
      const M = 0.1 * IN, F = 1.7 * IN;
      const fade = (px, py) => { const d = Math.min(px - M, W - M - px, py - M, H - M - py) + Math.sin(px * 0.004 + py * 0.003) * 0.25 * IN; if (d <= 0) return 0; const t = Math.min(1, d / F); return t * t * (3 - 2 * t); };
      const fs = 0.2 * IN, lh = 0.27 * IN, font = fs + 'px "Pirata One"';
      const wall = (color, faded) => { const c = canvas(W, H), x = c.getContext('2d'); x.fillStyle = color; x.font = font; x.textBaseline = 'alphabetic';
        const words = TEXT.split(/(?<=  )/); const ww = words.map(w => x.measureText(w).width); const total = ww.reduce((a, b) => a + b, 0);
        for (let row = 0, y = lh * 0.9; y < H + lh; row++, y += lh) { let px = -((row * 0.37) % 1) * total;
          for (let k = 0; px < W; k++) { const w = words[k % words.length], wd = ww[k % words.length];
            if (!faded || fade(px + wd / 2, y) > R() * 0.9 + 0.05) x.fillText(w, px, y); px += wd; } }
        return c; };
      const out = canvas(W, H), o = out.getContext('2d');
      // outside: the gray wall, minus the mark
      o.drawImage(wall(cw.outside, true), 0, 0); o.globalCompositeOperation = 'destination-out'; o.drawImage(sil, 0, 0); o.globalCompositeOperation = 'source-over';
      // inside the toast: the red wall (same rows, so the text runs straight through)
      { const r = wall(cw.inside, false), rx = r.getContext('2d'); rx.globalCompositeOperation = 'destination-in'; rx.drawImage(toast, 0, 0); o.drawImage(r, 0, 0); }
      // a clean gap around every line, then the bone line art, halo, spikes and drips
      o.globalCompositeOperation = 'destination-out'; o.drawImage(gap, 0, 0); o.globalCompositeOperation = 'source-over';
      o.drawImage(art, 0, 0);
      // the wordmark under the mark: band-logo style, bone with a red drop
      const wm = 'COMA TOAST', wy = MY + MH + 1.25 * IN; o.font = '100px "Metal Mania"'; const k = (W * 0.86) / o.measureText(wm).width; o.font = (100 * k) + 'px "Metal Mania"'; o.textAlign = 'center';
      o.lineJoin = 'round';
      // keep the wall clear behind it
      o.globalCompositeOperation = 'destination-out'; o.strokeStyle = '#000'; o.lineWidth = 0.18 * IN; o.strokeText(wm, W / 2, wy); o.fillText(wm, W / 2, wy); o.strokeText(wm, W / 2 + 0.07 * IN, wy + 0.07 * IN); o.globalCompositeOperation = 'source-over';
      o.fillStyle = cw.drop; o.fillText(wm, W / 2 + 0.07 * IN, wy + 0.07 * IN);
      o.fillStyle = cw.bone; o.fillText(wm, W / 2, wy);
      // trim, fit the box, no partial transparency
      const d0 = o.getImageData(0, 0, W, H); for (let i = 3; i < d0.data.length; i += 4) d0.data[i] = d0.data[i] > 110 ? 255 : 0; o.putImageData(d0, 0, 0);
      let x0 = W, y0 = H, x1 = 0, y1 = 0; for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (d0.data[(y * W + x) * 4 + 3]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      const t = canvas(x1 - x0 + 2, y1 - y0 + 2); t.getContext('2d').drawImage(out, -x0, -y0);
      return { png: t.toDataURL('image/png'), w: t.width, h: t.height };
    }, { cw, S: SVGS(cw), VB, TEXT, BOX_W, BOX_H });
    const dir = path.join(root, cid); fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'front.png'), setDpi(Buffer.from(res.png.split(',')[1], 'base64'), true));
    // BACK: $DAILY BREAD$ in the band font, bottom-right of the 12 x 16 in back area
    const back = await page.evaluate(({ cw, DPI }) => {
      const AW = 12 * DPI, AH = 16 * DPI, INSET = 0.1 * DPI, TW = 7 * DPI, t = '$DAILY BREAD$';
      const c = document.createElement('canvas'); c.width = AW; c.height = AH; const x = c.getContext('2d');
      x.font = '100px "Metal Mania"'; const px = 100 * TW / x.measureText(t).width; x.font = px + 'px "Metal Mania"'; x.textAlign = 'right'; x.textBaseline = 'alphabetic';
      const m = x.measureText(t), bx = AW - INSET - 0.05 * DPI, by = AH - INSET - m.actualBoundingBoxDescent - 0.05 * DPI;
      x.fillStyle = cw.drop; x.fillText(t, bx + 0.05 * DPI, by + 0.05 * DPI); x.fillStyle = cw.bone; x.fillText(t, bx, by);
      const d = x.getImageData(0, 0, AW, AH); for (let i = 3; i < d.data.length; i += 4) d.data[i] = d.data[i] > 110 ? 255 : 0; x.putImageData(d, 0, 0);
      return { png: c.toDataURL('image/png'), w: (m.actualBoundingBoxLeft + m.actualBoundingBoxRight) / DPI, h: (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) / DPI };
    }, { cw, DPI });
    fs.writeFileSync(path.join(dir, 'back.png'), setDpi(Buffer.from(back.png.split(',')[1], 'base64'), true));
    sizes[cid] = { front: { wIn: +(res.w / DPI).toFixed(2), hIn: +(res.h / DPI).toFixed(2) }, back: { wIn: +back.w.toFixed(2), hIn: +back.h.toFixed(2) } };
  }
  fs.writeFileSync(path.join(root, 'sizes.json'), JSON.stringify(sizes, null, 2) + '\n');

  // Sheet: each colorway on a black tee, front and back (size L, true scale), plus a close-up
  const PX = 13, href = p => 'file:///' + p.replace(/\\/g, '/');
  const TEE = 'M-3.6,0 L-9.8,1.2 L-15.6,7.6 L-12.6,10.8 L-11,9.3 L-11,30 L11,30 L11,9.3 L12.6,10.8 L15.6,7.6 L9.8,1.2 L3.6,0 Q0,6 -3.6,0 Z';
  const fig = (inner, cap) => `<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333">${inner}<figcaption>${cap}</figcaption></figure>`;
  const cells = [];
  for (const [cid, cw] of Object.entries(COLORWAYS)) {
    const z = sizes[cid].front, fp = href(path.join(root, cid, 'front.png')), bp = href(path.join(root, cid, 'back.png'));
    cells.push(fig(`<svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE}" fill="#141416"/><path d="M-3.6,0 Q0,6 3.6,0" fill="none" stroke="#242428" stroke-width="0.75"/><image href="${fp}" x="${-z.wIn / 2}" y="4.5" width="${z.wIn}" height="${z.hIn}"/></svg>`, `${cw.name} · front · ${z.wIn} × ${z.hIn} in`));
    cells.push(fig(`<svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE.replace('Q0,6', 'Q0,2')}" fill="#141416"/><path d="M-3.6,0 Q0,2 3.6,0" fill="none" stroke="#242428" stroke-width="0.75"/><image href="${bp}" x="-6" y="3" width="12" height="16"/></svg>`, 'back'));
    cells.push(fig(`<div style="background:#141416;padding:14px;width:${33 * PX - 28}px;height:${33.5 * PX - 28}px;display:flex;align-items:center;justify-content:center"><img src="${fp}" style="max-width:100%;max-height:100%"></div>`, 'close-up'));
  }
  const tmp = path.join(root, '_sheet.html');
  fs.writeFileSync(tmp, `<body style="margin:0;padding:10px;background:#ececea;display:grid;grid-template-columns:repeat(3,auto);gap:8px 12px">${cells.join('')}</body>`);
  await page.setViewportSize({ width: 3 * (33 * PX + 12) + 30, height: 400 });
  await page.goto(href(tmp)); await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(__dirname, 'metal-samples.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log(JSON.stringify(sizes));
})();
