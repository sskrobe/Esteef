// Argyle and Houndstooth: the Saint mark (toast + halo, the main halo logo) mixed with a classic fabric
// pattern, for a preppy-luxury look. The toast's face is filled with the pattern; the crust is solid and
// frames it; the halo is solid; the face (X eyes, Soft Pulse mouth) is black with a thin light keyline so it
// reads over the pattern; a thick black outline goes around everything.
// Back ($Daily Bread$, the standing back print): Bodoni Moda Black Italic lettering with a woven-tape strip
// of the pattern under it, in the bottom-right corner of the 12 x 16 in back print area.
// Size and placement (go-forward chest standard, Bella+Canvas 3001): the art fits a 10.5 x 12 in box,
// centered, top 1.5 in below the collar seam.
// The houndstooth is the real woven structure: a 2/2 twill with 4 dark and 4 light threads each way.
// Outputs in files/<design>-<colorway>/: front.png (trimmed, 300 dpi, transparent), front.svg, back.png
// (12 x 16 in area); patterns-samples.png (mockups).
// Run: node tshirts/patterns/patterns.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { logos } = require('../../logos/final/logos');
const { setDpi } = require('../paintshop/printful');

const INK = '#111111';
const DESIGNS = {
  'argyle-classic': { name: 'Argyle · Classic', pattern: 'argyle', crust: '#1d2a4d', halo: '#d4af37', key: '#f3ecdc',
    a: { base: '#f3ecdc', d1: '#1d2a4d', d2: '#6f7f99', line: '#8c1d2b' } },
  'argyle-brand': { name: 'Argyle · Brand', pattern: 'argyle', crust: '#111111', halo: '#c6ff00', key: '#ffffff',
    a: { base: '#ffffff', d1: '#ff2e88', d2: '#111111', line: '#c6ff00' } },
  'houndstooth-classic': { name: 'Houndstooth · Classic', pattern: 'houndstooth', crust: '#f4f4f2', halo: '#d4af37', key: '#ffffff',
    h: { dark: '#111111', light: '#f4f4f2' } },
  'houndstooth-brand': { name: 'Houndstooth · Brand', pattern: 'houndstooth', crust: '#ff2e88', halo: '#c6ff00', key: '#ffffff',
    h: { dark: '#111111', light: '#ff2e88' } },
};
const DPI = 300, BOX_W = 10.5 * DPI, BOX_H = 12 * DPI;
const OUTLINE = 6.5;
const saint = logos.find(l => l.id === 'saint');
const TOAST_T = 'translate(100,130) scale(0.78) translate(-100,-118)';
const FACE = `<g transform="${TOAST_T}"><path d="M62,108 C44,106 44,78 66,74 C78,62 122,62 134,74 C156,78 156,106 138,108 L138,174 L62,174 Z"/></g>`;
const isHalo = p => p.shape.includes('A38,9');

// Pattern tiles, in drawing units (the toast is about 115 units wide).
function argyleTile(c, w = 26, h = 36) {
  return { w, h, svg: `<rect width="${w}" height="${h}" fill="${c.d2}"/>`
    + `<path d="M${w / 2},0 L${w},${h / 2} L${w / 2},${h} L0,${h / 2} Z" fill="${c.d1}"/>`
    + `<path d="M0,0 L${w},${h} M${w},0 L0,${h}" stroke="${c.line}" stroke-width="0.9" stroke-dasharray="2.2 1.6" fill="none"/>`
    + `<path d="M${w / 2},${h / 2 - 3.2} L${w / 2 + 2.3},${h / 2} L${w / 2},${h / 2 + 3.2} L${w / 2 - 2.3},${h / 2} Z" fill="${c.base}"/>` };
}
function houndstoothTile(c, cell = 1.15) {
  // 2/2 twill: warp shows where (x + y) mod 4 < 2; warp color by column, weft color by row (4 dark, 4 light).
  const rects = [];
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
    const warpUp = ((x + y) % 4) < 2, dark = warpUp ? x % 8 < 4 : y % 8 < 4;
    if (dark) rects.push(`<rect x="${x * cell}" y="${y * cell}" width="${cell + 0.02}" height="${cell + 0.02}"/>`);
  }
  const s = 8 * cell;
  return { w: s, h: s, svg: `<rect width="${s}" height="${s}" fill="${c.light}"/><g fill="${c.dark}">${rects.join('')}</g>` };
}
const tileFor = d => (d.pattern === 'argyle' ? argyleTile(d.a) : houndstoothTile(d.h));

function frontSvg(id, size = 1000) {
  const d = DESIGNS[id], t = tileFor(d);
  const pat = `<pattern id="p-${id}" patternUnits="userSpaceOnUse" x="${100 - t.w / 2}" y="60" width="${t.w}" height="${t.h}">${t.svg}</pattern>`;
  const outline = saint.parts.map(p => `<g fill="${INK}" stroke="${INK}" stroke-width="${OUTLINE}" stroke-linejoin="round">${p.shape}</g>`).join('');
  const halo = saint.parts.filter(isHalo).map(p => `<g fill="${d.halo}">${p.shape}</g>`).join('');
  const toastP = saint.parts.find(p => !isHalo(p));
  const toast = `<g fill="${d.crust}">${toastP.shape}</g><g fill="url(#p-${id})">${FACE}</g>`;
  // face details: the light keyline first (a wider stroke underneath), then the black lines
  const det = toastP.detail.replace(/#000/g, INK);
  const keyline = det.replace(/stroke="#111111"/g, `stroke="${d.key}"`).replace(/stroke-width="([\d.]+)"/g, (m, w) => `stroke-width="${+w + 3.2}"`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="20 20 160 180" width="${size}" height="${size * 180 / 160}"><title>Coma Toast Saint, ${d.name}</title><defs>${pat}</defs>${outline}${halo}${toast}${keyline}${det}</svg>`;
}

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  const root = path.join(__dirname, 'files');
  const sizes = {};
  for (const id of Object.keys(DESIGNS)) {
    const out = path.join(root, id);
    fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'front.svg'), frontSvg(id) + '\n');
    const res = await page.evaluate(async ({ svg, BOX_W, BOX_H }) => {
      const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); await img.decode();
      const W = img.naturalWidth, H = img.naturalHeight, c = document.createElement('canvas'); c.width = W; c.height = H;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, W, H).data;
      let x0 = W, y0 = H, x1 = 0, y1 = 0;
      for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) if (d[(y * W + i) * 4 + 3] > 8) {
        if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
      const w = x1 - x0 + 1, h = y1 - y0 + 1, k = Math.min(BOX_W / w, BOX_H / h);
      const o = document.createElement('canvas'); o.width = Math.round(w * k); o.height = Math.round(h * k);
      o.getContext('2d').drawImage(img, -x0 * k, -y0 * k, W * k, H * k);
      return { png: o.toDataURL('image/png'), w: o.width, h: o.height };
    }, { svg: frontSvg(id, 3600), BOX_W, BOX_H });
    fs.writeFileSync(path.join(out, 'front.png'), setDpi(Buffer.from(res.png.split(',')[1], 'base64'), true));
    sizes[id] = { front: { wIn: +(res.w / DPI).toFixed(2), hIn: +(res.h / DPI).toFixed(2) } };
  }

  // Back: $Daily Bread$ in Bodoni Moda Black Italic, words in the light color with a thin black outline, dollar
  // signs in the halo color; under it a strip of the pattern (woven tape) with black edges.
  await page.setContent('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@1,11,900&display=block"><body></body>');
  await page.evaluate(async () => { await document.fonts.load('italic 900 100px "Bodoni Moda"', '$Daily Bread$'); });
  for (const [id, d] of Object.entries(DESIGNS)) {
    const t = tileFor(d);
    const png = await page.evaluate(async ({ d, tile, DPI }) => {
      const AREA_W = 12 * DPI, AREA_H = 16 * DPI, INSET = 0.1 * DPI, TEXT_W = 6.8 * DPI, TAPE_H = 0.34 * DPI;
      const light = d.pattern === 'argyle' ? d.a.base : '#f4f4f2';
      const font = px => `italic 900 ${px}px "Bodoni Moda"`;
      const pieces = ['$', 'Daily Bread', '$'], gap = 0.06;
      const m = document.createElement('canvas').getContext('2d'); m.font = font(100);
      const w100 = pieces.reduce((s, p) => s + m.measureText(p).width, 0) + 2 * gap * 100;
      const px = 100 * TEXT_W / w100, line = Math.max(4, px * 0.035);
      const W = Math.ceil(TEXT_W + 4 * line + 40), H = Math.ceil(px * 1.25 + TAPE_H + 40);
      const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
      x.font = font(px); x.textBaseline = 'alphabetic'; x.lineJoin = 'round';
      let cx = 2 * line + 10; const base = px * 0.95 + 10;
      pieces.forEach((p, i) => {
        x.lineWidth = line * 2; x.strokeStyle = '#111111'; x.strokeText(p, cx, base);
        x.fillStyle = i === 1 ? light : d.halo; x.fillText(p, cx, base);
        cx += x.measureText(p).width + gap * px;
      });
      // tape: the pattern at print scale (the tile is drawn so one tile is about 0.3 in), black edges
      const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${tile.w} ${tile.h}" width="${Math.round(tile.w * 9)}" height="${Math.round(tile.h * 9)}">${tile.svg}</svg>`);
      await img.decode();
      const ty = base + px * 0.22, tx0 = 2 * line + 10, tw = TEXT_W;
      x.save(); x.beginPath(); x.rect(tx0, ty, tw, TAPE_H); x.clip();
      x.fillStyle = x.createPattern(img, 'repeat'); x.translate(tx0, ty); x.fillRect(0, 0, tw, TAPE_H); x.restore();
      x.lineWidth = line; x.strokeStyle = '#111111'; x.strokeRect(tx0, ty, tw, TAPE_H);
      // trim and place bottom-right
      const dd = x.getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = 0, y1 = 0;
      for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) if (dd[(y * W + i) * 4 + 3] > 8) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      const f = document.createElement('canvas'); f.width = AREA_W; f.height = AREA_H;
      const w = x1 - x0 + 1, h = y1 - y0 + 1;
      f.getContext('2d').drawImage(c, x0, y0, w, h, AREA_W - INSET - w, AREA_H - INSET - h, w, h);
      return { png: f.toDataURL('image/png'), w, h };
    }, { d, tile: t, DPI });
    fs.writeFileSync(path.join(root, id, 'back.png'), setDpi(Buffer.from(png.png.split(',')[1], 'base64'), true));
    sizes[id].back = { wIn: +(png.w / DPI).toFixed(2), hIn: +(png.h / DPI).toFixed(2) };
  }
  fs.writeFileSync(path.join(root, 'sizes.json'), JSON.stringify(sizes, null, 2) + '\n');

  // Mockups: each design, front and back, on a black and a white size L tee at true scale.
  const PX = 12, href = p => 'file:///' + p.replace(/\\/g, '/');
  const TEE = 'M-3.6,0 L-9.8,1.2 L-15.6,7.6 L-12.6,10.8 L-11,9.3 L-11,30 L11,30 L11,9.3 L12.6,10.8 L15.6,7.6 L9.8,1.2 L3.6,0 Q0,6 -3.6,0 Z';
  const shirts = [['#17171a', '#26262a', 'black'], ['#f7f7f5', '#e4e4e2', 'white']];
  const cells = [];
  for (const [id, d] of Object.entries(DESIGNS)) for (const [col, collar, sname] of shirts) {
    const z = sizes[id].front;
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE}" fill="${col}"/><path d="M-3.6,0 Q0,6 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, id, 'front.png'))}" x="${-z.wIn / 2}" y="4.5" width="${z.wIn}" height="${z.hIn}"/></svg><figcaption>${d.name} · front · ${sname} · ${z.wIn} × ${z.hIn} in</figcaption></figure>`);
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE.replace('Q0,6', 'Q0,2')}" fill="${col}"/><path d="M-3.6,0 Q0,2 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, id, 'back.png'))}" x="-6" y="3" width="12" height="16"/></svg><figcaption>${d.name} · back · ${sname}</figcaption></figure>`);
  }
  const tmp = path.join(root, '_sheet.html');
  fs.writeFileSync(tmp, `<body style="margin:0;padding:10px;background:#ececea;display:grid;grid-template-columns:repeat(4,auto);gap:6px 10px">${cells.join('')}</body>`);
  await page.setViewportSize({ width: 4 * (33 * PX + 10) + 30, height: 400 });
  await page.goto(href(tmp)); await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(__dirname, 'patterns-samples.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log(JSON.stringify(sizes));
})();
