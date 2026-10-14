// 3D: the old-school red/blue 3D-movie (anaglyph) look. Behind: DAILY / BREAD / DAILY / BREAD stacked as one
// justified block (Montserrat Black), printed twice: a red copy shifted left and a cyan copy shifted right, as
// if seen without the glasses; where they overlap, a third color. In front: the Saint mark, solid, with its
// own smaller red/cyan fringe (so it reads as nearer), and a clear gap around it so it pops off the text.
// Versions: "light" for light shirts (overlaps print near-black like ink; mark black with a white face) and
// "dark" for dark shirts (overlaps print white like light; mark white with a black face). Solid colors only.
// Back: $DAILY BREAD$ in the same 3D style, bottom-right of the 12 x 16 in back area (standing back print).
// Size and placement (chest standard, Bella+Canvas 3001): fits a 10.5 x 12 in box, centered, top 1.5 in below
// the collar seam.
// Outputs: files/<light|dark>/front.png, back.png; 3d-samples.png.
// Run: node tshirts/3d/3d.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { logos } = require('../../logos/final/logos');
const { setDpi } = require('../paintshop/printful');

const RED = '#ff2a3d', CYAN = '#00b4ff';
const VERSIONS = {
  light: { name: '3D Light (light shirts)', both: '#1d1330', core: '#111111', face: '#ffffff', shirts: ['white'] },
  dark: { name: '3D Dark (dark shirts)', both: '#ffffff', core: '#ffffff', face: '#111111', shirts: ['black'] },
};
const DPI = 300, BOX_W = 10.5 * DPI, BOX_H = 12 * DPI;
const saint = logos.find(l => l.id === 'saint');
const MARK_SIL = saint.parts.map(p => `<g fill="#fff">${p.shape}</g>`).join('');                       // silhouette
const MARK_DET = saint.parts.map(p => (p.detail || '').replace(/#000/g, '#fff')).join('');          // face lines
const svg = (inner, n) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="38 44 124 144" width="${n * 124 / 144}" height="${n}">${inner}</svg>`;

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  await page.setContent('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=block"><body></body>');
  await page.evaluate(async () => { await document.fonts.load('900 100px "Montserrat"', '$DAILY BREAD$'); });
  await page.addScriptTag({ content: `
    window.loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
    window.canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
    window.tint = (m, color) => { const c = canvas(m.width, m.height), x = c.getContext('2d'); x.drawImage(m, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height); return c; };
    window.shift = (m, dx) => { const c = canvas(m.width, m.height); c.getContext('2d').drawImage(m, dx, 0); return c; };
    // red copy (shifted left) and cyan copy (shifted right); overlap in "both"
    window.anaglyph = (m, d, col) => { const A = shift(m, -d), B = shift(m, d), o = canvas(m.width, m.height), x = o.getContext('2d');
      x.drawImage(tint(B, col.cyan), 0, 0); x.drawImage(tint(A, col.red), 0, 0);
      const both = tint(A, col.both), bx = both.getContext('2d'); bx.globalCompositeOperation = 'destination-in'; bx.drawImage(B, 0, 0); x.drawImage(both, 0, 0); return o; };
    window.dilate = (m, r) => { const c = canvas(m.width, m.height), x = c.getContext('2d'); for (let a = 0; a < 360; a += 10) for (const f of [0.5, 1]) x.drawImage(m, Math.cos(a * Math.PI / 180) * r * f, Math.sin(a * Math.PI / 180) * r * f); return c; };
    window.trim = c => { const W = c.width, H = c.height, d = c.getContext('2d').getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = 0, y1 = 0;
      for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) if (d[(y * W + i) * 4 + 3] > 8) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      const t = canvas(x1 - x0 + 1, y1 - y0 + 1); t.getContext('2d').drawImage(c, -x0, -y0); return t; };
  ` });

  const root = path.join(__dirname, 'files'), sizes = {};
  for (const [vid, v] of Object.entries(VERSIONS)) {
    const col = { red: RED, cyan: CYAN, both: v.both };
    const res = await page.evaluate(async ({ v, col, sil, det, BOX_W, BOX_H }) => {
      const W = BOX_W, PAD = 200;
      // TEXT BLOCK: four lines, each stretched to the same width (a justified block)
      const lines = ['DAILY', 'BREAD', 'DAILY', 'BREAD'], font = px => `900 ${px}px "Montserrat"`;
      const m = canvas(10, 10).getContext('2d'); m.font = font(1000);
      const capH = m.measureText('D').actualBoundingBoxAscent;   // at 1000px
      const blockW = W * 0.9, lineH = blockW / 3.9, gap = lineH * 0.1;   // cap height per line, then fit the width
      const px = 1000 * lineH / capH;
      const TH = lines.length * lineH + (lines.length - 1) * gap;
      const text = canvas(W + 2 * PAD, TH + 2 * PAD), tx = text.getContext('2d');
      tx.font = font(px); tx.fillStyle = '#fff'; tx.textBaseline = 'alphabetic';
      lines.forEach((t, i) => {
        const mm = tx.measureText(t), iw = mm.actualBoundingBoxLeft + mm.actualBoundingBoxRight, k = blockW / iw;
        tx.save(); tx.translate(PAD + (W - blockW) / 2, PAD + i * (lineH + gap) + lineH); tx.scale(k, 1); tx.fillText(t, mm.actualBoundingBoxLeft, 0); tx.restore();
      });
      const d1 = W * 0.022;   // text offset each way (about 0.23 in): reads as "behind"
      // MARK: silhouette and face masks at about 82% of the text block's height, centered
      const mh = Math.round(TH * 0.82), mw = Math.round(mh * 124 / 144);
      const sI = await loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sil.replace('__H__', mh)));
      const dI = await loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(det.replace('__H__', mh)));
      const full = (img) => { const c = canvas(text.width, text.height); c.getContext('2d').drawImage(img, (text.width - mw) / 2, (text.height - mh) / 2, mw, mh); return c; };
      const silM = full(sI), detM = full(dI);
      const d2 = W * 0.011;   // the mark's own fringe (smaller: it reads as nearer)
      // compose: text in anaglyph, cut back around the mark (clear gap), then the mark's fringe, core and face
      const out = canvas(text.width, text.height), o = out.getContext('2d');
      o.drawImage(anaglyph(text, d1, col), 0, 0);
      o.globalCompositeOperation = 'destination-out'; o.drawImage(dilate(silM, W * 0.03 + d2), 0, 0); o.globalCompositeOperation = 'source-over';
      o.drawImage(anaglyph(silM, d2, col), 0, 0);
      o.drawImage(tint(silM, v.core), 0, 0);
      o.drawImage(tint(detM, v.face), 0, 0);
      let art = trim(out);
      const f = Math.min(BOX_W / art.width, BOX_H / art.height); const r = canvas(Math.round(art.width * f), Math.round(art.height * f));
      const rx = r.getContext('2d'); rx.imageSmoothingQuality = 'high'; rx.drawImage(art, 0, 0, r.width, r.height);
      return { png: r.toDataURL('image/png'), w: r.width, h: r.height };
    }, { v, col, sil: svg(MARK_SIL, '__H__'), det: svg(MARK_DET, '__H__'), BOX_W, BOX_H });
    const out = path.join(root, vid); fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'front.png'), setDpi(Buffer.from(res.png.split(',')[1], 'base64'), true));

    // BACK: $DAILY BREAD$ with the same red/cyan offset and the core color on top
    const back = await page.evaluate(({ v, col, DPI }) => {
      const AREA_W = 12 * DPI, AREA_H = 16 * DPI, INSET = 0.1 * DPI, TW = 7 * DPI, t = '$DAILY BREAD$';
      const m = canvas(10, 10).getContext('2d'); m.font = '900 100px "Montserrat"';
      const px = 100 * TW / m.measureText(t).width, PAD = 60;
      const c = canvas(Math.ceil(TW + 2 * PAD), Math.ceil(px * 1.2 + 2 * PAD)), x = c.getContext('2d');
      x.font = `900 ${px}px "Montserrat"`; x.fillStyle = '#fff'; x.fillText(t, PAD, PAD + px * 0.9);
      const d = px * 0.045, o = canvas(c.width, c.height), ox = o.getContext('2d');
      ox.drawImage(anaglyph(c, d, col), 0, 0); ox.drawImage(tint(c, v.core), 0, 0);
      const art = trim(o), f = canvas(AREA_W, AREA_H);
      f.getContext('2d').drawImage(art, AREA_W - INSET - art.width, AREA_H - INSET - art.height);
      return { png: f.toDataURL('image/png'), w: art.width, h: art.height };
    }, { v, col, DPI });
    fs.writeFileSync(path.join(out, 'back.png'), setDpi(Buffer.from(back.png.split(',')[1], 'base64'), true));
    sizes[vid] = { front: { wIn: +(res.w / DPI).toFixed(2), hIn: +(res.h / DPI).toFixed(2) }, back: { wIn: +(back.w / DPI).toFixed(2), hIn: +(back.h / DPI).toFixed(2) } };
  }
  fs.writeFileSync(path.join(root, 'sizes.json'), JSON.stringify(sizes, null, 2) + '\n');

  // Sheet: each version, front and back, on its shirt (size L, true scale), plus a close-up of each front.
  const PX = 13, href = p => 'file:///' + p.replace(/\\/g, '/');
  const TEE = 'M-3.6,0 L-9.8,1.2 L-15.6,7.6 L-12.6,10.8 L-11,9.3 L-11,30 L11,30 L11,9.3 L12.6,10.8 L15.6,7.6 L9.8,1.2 L3.6,0 Q0,6 -3.6,0 Z';
  const SH = { black: ['#17171a', '#26262a'], white: ['#f7f7f5', '#e4e4e2'] };
  const cells = [];
  for (const [vid, v] of Object.entries(VERSIONS)) for (const sn of v.shirts) {
    const z = sizes[vid].front, [c, collar] = SH[sn];
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE}" fill="${c}"/><path d="M-3.6,0 Q0,6 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, vid, 'front.png'))}" x="${-z.wIn / 2}" y="4.5" width="${z.wIn}" height="${z.hIn}"/></svg><figcaption>${v.name} · front · ${z.wIn} × ${z.hIn} in</figcaption></figure>`);
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE.replace('Q0,6', 'Q0,2')}" fill="${c}"/><path d="M-3.6,0 Q0,2 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, vid, 'back.png'))}" x="-6" y="3" width="12" height="16"/></svg><figcaption>back</figcaption></figure>`);
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><div style="background:${c};padding:14px;width:${33 * PX - 28}px;height:${33.5 * PX - 28}px;display:flex;align-items:center;justify-content:center"><img src="${href(path.join(root, vid, 'front.png'))}" style="max-width:100%;max-height:100%"></div><figcaption>close-up</figcaption></figure>`);
  }
  const tmp = path.join(root, '_sheet.html');
  fs.writeFileSync(tmp, `<body style="margin:0;padding:10px;background:#ececea;display:grid;grid-template-columns:repeat(3,auto);gap:8px 12px">${cells.join('')}</body>`);
  await page.setViewportSize({ width: 3 * (33 * PX + 12) + 30, height: 400 });
  await page.goto(href(tmp)); await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(__dirname, '3d-samples.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log(JSON.stringify(sizes));
})();
