// Scanline: a quiet, editorial take on the 80s. The three character marks (Saint, plain Coma Toast, Little
// Devil) in a row, each filled only with fine horizontal scan lines (a CRT / VHS raster); the face and crust line
// are drawn solid inside a clean gap cut in the lines. The 80s is only alluded to: one VHS "tracking" slip shears a thin band
// across all three, with a muted chromatic ghost, and a hairline 80s sportswear pinstripe (rose, mustard, teal)
// sits under the row. Type: COMA TOAST and DAILY BREAD, small and widely tracked, set like a fashion label.
// Versions: "ivory" (ivory lines, for black / navy shirts) and "ink" (near-black lines, for natural / cream).
// Back: $DAILY BREAD$ in the same scan lines, with its own small tracking slip, bottom-right of the 12 x 16 in
// back area.
// Size and placement (chest, Bella+Canvas 3001): 9 in wide, centered, top 2 in below the collar seam (a little
// lower and smaller than the chest standard, for a more considered, high-fashion read).
// Outputs: files/<ivory|ink>/front.png, back.png; scanline-samples.png.
// Run: node tshirts/scanline/scanline.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { logos } = require('../../logos/final/logos');
const { setDpi } = require('../paintshop/printful');

const VERSIONS = {
  ivory: { name: 'Ivory', line: '#efe9dd', rose: '#d0607f', mustard: '#e0b04a', teal: '#3fa3a0', shirts: ['black', 'navy'] },
  ink: { name: 'Ink', line: '#1b1b1b', rose: '#b8456a', mustard: '#c9932c', teal: '#2c7f7d', shirts: ['natural', 'white'] },
};
const CAST = ['saint', 'plain', 'little-devil'];
const DPI = 300, ART_W = 9 * DPI, TOP_IN = 2;
const PITCH = 0.042 * DPI, LINE = 0.024 * DPI;   // scan-line pitch and line weight (about 24 lines per inch)
const VB = [36, 40, 128, 150];                    // common viewBox, so the three toasts line up
const svgOf = (m, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB.join(' ')}" width="__W__" height="__H__">${inner}</svg>`;
const marks = CAST.map(id => {
  const m = logos.find(l => l.id === id);
  return {
    sil: svgOf(m, m.parts.map(p => `<g fill="#fff">${p.shape}</g>`).join('')),
    det: svgOf(m, m.parts.map(p => (p.detail || '').replace(/#000/g, '#fff')).join('')),
  };
});

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  await page.setContent('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;900&display=block"><body></body>');
  await page.evaluate(async () => {
    for (const w of [400, 600, 900]) await document.fonts.load(`${w} 100px "Montserrat"`, '$COMA TOAST DAILY BREAD$');
  });
  await page.addScriptTag({ content: `
    window.loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
    window.canvas = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return c; };
    window.tint = (m, color) => { const c = canvas(m.width, m.height), x = c.getContext('2d'); x.drawImage(m, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height); x.globalCompositeOperation = 'source-over'; return c; };
    window.dilate = (m, r) => { const c = canvas(m.width, m.height), x = c.getContext('2d'); for (let a = 0; a < 360; a += 15) x.drawImage(m, Math.cos(a * Math.PI / 180) * r, Math.sin(a * Math.PI / 180) * r); x.drawImage(m, 0, 0); return c; };
    window.hard = c => { const x = c.getContext('2d'), d = x.getImageData(0, 0, c.width, c.height); for (let i = 3; i < d.data.length; i += 4) d.data[i] = d.data[i] > 110 ? 255 : 0; x.putImageData(d, 0, 0); return c; };
    window.cut = (c, m) => { const x = c.getContext('2d'); x.save(); x.globalCompositeOperation = 'destination-out'; x.drawImage(m, 0, 0); x.restore(); return c; };
    window.keep = (c, m) => { const x = c.getContext('2d'); x.save(); x.globalCompositeOperation = 'destination-in'; x.drawImage(m, 0, 0); x.restore(); return c; };
    window.trim = c => { const W = c.width, H = c.height, d = c.getContext('2d').getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = 0, y1 = 0;
      for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) if (d[(y * W + i) * 4 + 3] > 8) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      const t = canvas(x1 - x0 + 1, y1 - y0 + 1); t.getContext('2d').drawImage(c, -x0, -y0); return t; };
    // horizontal scan lines clipped to a mask (white lines; tint later)
    window.raster = (mask, pitch, line, y0) => { const c = canvas(mask.width, mask.height), x = c.getContext('2d'); x.fillStyle = '#fff';
      for (let y = y0 % pitch; y < c.height; y += pitch) x.fillRect(0, Math.round(y), c.width, Math.round(line)); return keep(c, mask); };
    // VHS tracking slip: the band [y, y+h) shifts sideways by dx, with a muted ghost copy offset the other way
    window.slip = (art, y, h, dx, ghost, gdx) => { const W = art.width, band = canvas(W, art.height), bx = band.getContext('2d');
      bx.drawImage(art, 0, y, W, h, 0, y, W, h);
      const x = art.getContext('2d'); x.clearRect(0, y, W, h);
      x.drawImage(tint(band, ghost), gdx, 0); x.drawImage(band, dx, 0); };
    window.tracked = (x, text, font, spacing, X, Y, align) => { x.font = font; x.letterSpacing = spacing + 'px';
      const w = x.measureText(text).width - spacing; x.fillText(text, align === 'right' ? X - w : align === 'center' ? X - w / 2 : X, Y); return w; };
  ` });

  const root = path.join(__dirname, 'files'), sizes = {};
  for (const [vid, v] of Object.entries(VERSIONS)) {
    const res = await page.evaluate(async ({ v, marks, VB, ART_W, PITCH, LINE }) => {
      const W = ART_W, PAD = W * 0.04;
      // MARKS: three equal marks in a row, evenly spaced, each about 2.9 in wide box
      const slot = W / 3, mw = slot * 0.84, mh = mw * VB[3] / VB[2], rowH = mh;
      const H = rowH + W * 0.2;
      const c = canvas(W + 2 * PAD, H + 2 * PAD);
      const mask = canvas(c.width, c.height), mx = mask.getContext('2d'), det = canvas(c.width, c.height), dx = det.getContext('2d');
      for (let i = 0; i < marks.length; i++) {
        const X = PAD + slot * i + (slot - mw) / 2, Y = PAD;
        const s = await loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(marks[i].sil.replace('__W__', mw).replace('__H__', mh)));
        const d = await loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(marks[i].det.replace('__W__', mw).replace('__H__', mh)));
        mx.drawImage(s, X, Y, mw, mh); dx.drawImage(d, X, Y, mw, mh);
      }
      hard(mask); cut(mask, hard(dilate(det, PITCH * 0.75)));   // a clean gap around the face and crust line
      const lines = tint(raster(mask, PITCH, LINE, PAD), v.line);
      // tracking slips: one at eye level (wider shift), one thinner lower down
      const snap = y => PAD + Math.round((y - PAD) / PITCH) * PITCH - (PITCH - LINE) / 2;
      slip(lines, snap(PAD + mh * 0.47), PITCH * 4, W * 0.018, v.rose, -W * 0.009);
      slip(lines, snap(PAD + mh * 0.74), PITCH * 2, -W * 0.01, v.teal, W * 0.006);
      const x = c.getContext('2d'); x.drawImage(lines, 0, 0); x.drawImage(tint(hard(det), v.line), 0, 0);   // face and crust line drawn solid
      // PINSTRIPE: rose / mustard / teal hairlines under the row
      const py = PAD + rowH + W * 0.045, ph = W * 0.0042, pg = W * 0.0042;
      [v.rose, v.mustard, v.teal].forEach((col, k) => { x.fillStyle = col; x.fillRect(PAD, py + k * (ph + pg), W, ph); });
      // TYPE: COMA TOAST left, DAILY BREAD right, small and widely tracked
      x.fillStyle = v.line; x.textBaseline = 'alphabetic';
      const ty = py + 3 * (ph + pg) + W * 0.06, fpx = W * 0.032;
      tracked(x, 'COMA TOAST', `600 ${fpx}px "Montserrat"`, fpx * 0.55, PAD, ty, 'left');
      tracked(x, 'DAILY BREAD', `400 ${fpx}px "Montserrat"`, fpx * 0.55, PAD + W, ty, 'right');
      const art = trim(c);
      return { png: art.toDataURL('image/png'), w: art.width, h: art.height };
    }, { v, marks, VB, ART_W, PITCH, LINE });
    const out = path.join(root, vid); fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'front.png'), setDpi(Buffer.from(res.png.split(',')[1], 'base64'), true));

    // BACK: $DAILY BREAD$ in scan lines with a small slip, bottom-right of the 12 x 16 in back area
    const back = await page.evaluate(({ v, DPI, PITCH, LINE }) => {
      const AREA_W = 12 * DPI, AREA_H = 16 * DPI, INSET = 0.1 * DPI, TW = 6.5 * DPI, t = '$DAILY BREAD$';
      const m = canvas(10, 10).getContext('2d'); m.font = '900 100px "Montserrat"';
      const mm = m.measureText(t), px = 100 * TW / mm.width, P = PITCH * 0.6, L = LINE * 0.62, PAD = 60;
      const mask = canvas(TW + 2 * PAD, px * 1.1 + 2 * PAD), mx = mask.getContext('2d');
      mx.font = `900 ${px}px "Montserrat"`; mx.fillStyle = '#fff'; mx.fillText(t, PAD, PAD + px * 0.85);
      hard(mask);
      const lines = tint(raster(mask, P, L, PAD), v.line);
      const cap = px * 0.72, y0 = PAD + px * 0.85 - cap;
      slip(lines, y0 + Math.round(cap * 0.45 / P) * P - (P - L) / 2, P * 2, TW * 0.012, v.rose, -TW * 0.006);
      const art = trim(lines), f = canvas(AREA_W, AREA_H);
      f.getContext('2d').drawImage(art, AREA_W - INSET - art.width, AREA_H - INSET - art.height);
      return { png: f.toDataURL('image/png'), w: art.width, h: art.height };
    }, { v, DPI, PITCH, LINE });
    fs.writeFileSync(path.join(out, 'back.png'), setDpi(Buffer.from(back.png.split(',')[1], 'base64'), true));
    sizes[vid] = { front: { wIn: +(res.w / DPI).toFixed(2), hIn: +(res.h / DPI).toFixed(2) }, back: { wIn: +(back.w / DPI).toFixed(2), hIn: +(back.h / DPI).toFixed(2) } };
  }
  fs.writeFileSync(path.join(root, 'sizes.json'), JSON.stringify(sizes, null, 2) + '\n');

  // Sheet: each version, front and back, on each shirt (size L, true scale), plus a close-up of the front.
  const PX = 13, href = p => 'file:///' + p.replace(/\\/g, '/');
  const TEE = 'M-3.6,0 L-9.8,1.2 L-15.6,7.6 L-12.6,10.8 L-11,9.3 L-11,30 L11,30 L11,9.3 L12.6,10.8 L15.6,7.6 L9.8,1.2 L3.6,0 Q0,6 -3.6,0 Z';
  const SH = { black: ['#17171a', '#26262a'], navy: ['#1c2440', '#2a3352'], natural: ['#ebe4d3', '#d9d1bd'], white: ['#f7f7f5', '#e4e4e2'] };
  const cells = [];
  for (const [vid, v] of Object.entries(VERSIONS)) for (const sn of v.shirts) {
    const z = sizes[vid].front, [c, collar] = SH[sn];
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE}" fill="${c}"/><path d="M-3.6,0 Q0,6 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, vid, 'front.png'))}" x="${-z.wIn / 2}" y="${3 + TOP_IN}" width="${z.wIn}" height="${z.hIn}"/></svg><figcaption>${v.name} on ${sn} · front · ${z.wIn} × ${z.hIn} in</figcaption></figure>`);
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE.replace('Q0,6', 'Q0,2')}" fill="${c}"/><path d="M-3.6,0 Q0,2 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, vid, 'back.png'))}" x="-6" y="3" width="12" height="16"/></svg><figcaption>back</figcaption></figure>`);
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><div style="background:${c};padding:14px;width:${33 * PX - 28}px;height:${33.5 * PX - 28}px;display:flex;align-items:center;justify-content:center"><img src="${href(path.join(root, vid, 'front.png'))}" style="max-width:100%;max-height:100%"></div><figcaption>close-up</figcaption></figure>`);
  }
  const tmp = path.join(root, '_sheet.html');
  fs.writeFileSync(tmp, `<body style="margin:0;padding:10px;background:#ececea;display:grid;grid-template-columns:repeat(3,auto);gap:8px 12px">${cells.join('')}</body>`);
  await page.setViewportSize({ width: 3 * (33 * PX + 12) + 30, height: 400 });
  await page.goto(href(tmp)); await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(__dirname, 'scanline-samples.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log(JSON.stringify(sizes));
})();
