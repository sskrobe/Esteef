// Equalizer: a pixel audio-equalizer of square tiles in a sunset gradient, with all five Coma Toast marks
// standing in the bars at different sizes and colors, showing through the tiles (inspired by a Psycho Bunny
// equalizer tee). DAILY BREAD in small spaced capitals at the bottom right.
// The marks are the official one-color marks (face knocked out), so their faces show the bars behind.
// Back: $DAILY BREAD$ built from the same tiles (fine grid), bottom-right of the 12 x 16 in back area.
// Size and placement (chest standard, Bella+Canvas 3001): fits a 10.5 x 12 in box (it is about 10.5 in wide),
// centered, top 1.5 in below the collar seam. For dark shirts.
// Outputs: files/<colorway>/front.png, back.png; equalizer-samples.png.
// Run: node tshirts/equalizer/equalizer.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { logos, renderLogo } = require('../../logos/final/logos');
const { setDpi } = require('../paintshop/printful');

const COLORWAYS = {
  sunset: { name: 'Sunset', bars: ['#1d3a8a', '#2f5fd0', '#7b3fd1', '#e0356e', '#ff5a2c', '#ff9a1f', '#ff5a2c', '#e0356e', '#7b3fd1', '#2f5fd0', '#1d3a8a'],
    marks: ['#ff9a1f', '#ffe08a', '#13204d', '#fff4e0', '#ff7a3c'], word: '#ff9a1f' },
  brand: { name: 'Brand (Hot Wire)', bars: ['#2a0f3a', '#5a1660', '#a81c78', '#ff2e88', '#ff6aa9', '#c6ff00', '#ff6aa9', '#ff2e88', '#a81c78', '#5a1660', '#2a0f3a'],
    marks: ['#c6ff00', '#ffffff', '#2a0f3a', '#ffffff', '#c6ff00'], word: '#c6ff00' },
};
const DPI = 300, ART_W = 10.5 * DPI;
const COLS = 26, ROWS = 15, GAP = 0.2;   // tile grid; gap as a fraction of a tile
// Bar heights (rows), an equalizer profile: low at the edges, high in the middle, with some jitter.
let s = 11; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
const HEIGHTS = Array.from({ length: COLS }, (_, i) => {
  const t = i / (COLS - 1), bump = Math.sin(Math.PI * t) ** 0.8;
  return Math.max(3, Math.min(ROWS, Math.round(ROWS * (0.35 + 0.6 * bump) + (rnd() - 0.5) * 4)));
});
// The five marks: which, where (column of the center), how tall (toast rows), how far up from the bottom (rows),
// spaced out at staggered heights like the reference; each in a color that contrasts with its columns.
const MARKS = [
  { id: 'heaven-sent', col: 3.2, rows: 5.2, up: 1.5 },
  { id: 'little-devil', col: 8.3, rows: 6, up: 4 },
  { id: 'saint', col: 13, rows: 7, up: 2.5 },
  { id: 'plain', col: 17.7, rows: 5.8, up: 4.5 },
  { id: 'raising-hell', col: 22.6, rows: 5.4, up: 1.8 },
];

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  await page.setContent('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;900&display=block"><body></body>');
  await page.evaluate(async () => { await document.fonts.load('600 100px "Montserrat"', 'DAILY BREAD'); await document.fonts.load('900 100px "Montserrat"', '$DAILY BREAD$'); });
  const root = path.join(__dirname, 'files'), sizes = {};
  for (const [cw, c] of Object.entries(COLORWAYS)) {
    const marks = MARKS.map((m, i) => ({ ...m, svg: renderLogo(logos.find(l => l.id === m.id), { color: c.marks[i], size: 1000, title: false }) }));
    const res = await page.evaluate(async ({ c, marks, HEIGHTS, COLS, ROWS, GAP, ART_W, DPI }) => {
      const cell = ART_W / (COLS + (COLS - 1) * GAP) , step = cell * (1 + GAP);   // tile size and pitch (px)
      const gridH = ROWS * step - cell * GAP, wordH = cell * 1.1, H = Math.ceil(gridH + wordH * 2.2);
      const art = document.createElement('canvas'); art.width = ART_W; art.height = H; const x = art.getContext('2d');
      const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
      const rgb = a => `rgb(${a.join(',')})`;
      const barColor = col => { const p = col / (COLS - 1) * (c.bars.length - 1), i = Math.min(c.bars.length - 2, Math.floor(p)); return mix(hex(c.bars[i]), hex(c.bars[i + 1]), p - i); };
      // 1. the bars: every tile, dimmer toward the bottom, a touch lighter at the top
      const layer = document.createElement('canvas'); layer.width = ART_W; layer.height = H; const lx = layer.getContext('2d');
      for (let col = 0; col < COLS; col++) for (let r = 0; r < HEIGHTS[col]; r++) {
        const base = barColor(col), t = r / (ROWS - 1);   // r = 0 is the bottom row
        const tone = t > 0.75 ? mix(base, [255, 255, 255], (t - 0.75) * 0.6) : mix(base, [10, 10, 20], (0.75 - t) * 0.5);
        lx.fillStyle = rgb(tone); lx.fillRect(col * step, gridH - (r + 1) * step + cell * GAP, cell, cell);
      }
      // 2. the marks, standing on the bottom of the grid (drawn whole; the tile mask cuts them up next)
      const crop = { x: 38, y: 44, w: 124, h: 144 };   // the marks' artwork inside their 200-unit drawing (wings wider)
      for (const m of marks) {
        const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(m.svg); await img.decode();
        const hPx = m.rows * step, k = hPx / crop.h;            // scale so the toast part is m.rows tall
        const cx = m.col * step + cell / 2, bottom = gridH - m.up * step;
        lx.drawImage(img, cx - 100 * k, bottom - (crop.y + crop.h) * k, 200 * k, 200 * k);
      }
      // 3. cut it all to the tiles of the bars (gaps and empty tiles become transparent)
      const mask = document.createElement('canvas'); mask.width = ART_W; mask.height = H; const mx = mask.getContext('2d'); mx.fillStyle = '#fff';
      for (let col = 0; col < COLS; col++) for (let r = 0; r < HEIGHTS[col]; r++) mx.fillRect(col * step, gridH - (r + 1) * step + cell * GAP, cell, cell);
      lx.globalCompositeOperation = 'destination-in'; lx.drawImage(mask, 0, 0);
      x.drawImage(layer, 0, 0);
      // 4. DAILY BREAD, small spaced capitals, right-aligned under the bars
      x.font = `600 ${wordH}px "Montserrat"`; x.fillStyle = c.word; x.textAlign = 'right'; x.textBaseline = 'alphabetic';
      x.letterSpacing = `${wordH * 0.45}px`; x.fillText('DAILY BREAD', ART_W + wordH * 0.45, gridH + wordH * 1.9);
      // BACK: $DAILY BREAD$ built from a fine tile grid in the bar gradient, bottom-right of the back area
      const AREA_W = 12 * DPI, AREA_H = 16 * DPI, INSET = 0.1 * DPI, TW = 7 * DPI, t = '$DAILY BREAD$';
      const tc = document.createElement('canvas'), tx = tc.getContext('2d'); tx.font = '900 100px "Montserrat"';
      const px = 100 * TW / tx.measureText(t).width; tc.width = Math.ceil(TW); tc.height = Math.ceil(px * 1.05); tx.font = `900 ${px}px "Montserrat"`;
      tx.fillStyle = '#fff'; tx.fillText(t, 0, px * 0.9);
      const tile = px / 9, g = document.createElement('canvas'); g.width = tc.width; g.height = tc.height; const gx = g.getContext('2d');
      for (let X = 0; X < tc.width; X += tile) for (let Y = 0; Y < tc.height; Y += tile) { gx.fillStyle = rgb(barColor((0.2 + 0.6 * X / tc.width) * (COLS - 1))); gx.fillRect(X, Y, tile * 0.82, tile * 0.82); }
      gx.globalCompositeOperation = 'destination-in'; gx.drawImage(tc, 0, 0);
      const back = document.createElement('canvas'); back.width = AREA_W; back.height = AREA_H;
      back.getContext('2d').drawImage(g, AREA_W - INSET - g.width, AREA_H - INSET - g.height);
      return { png: art.toDataURL('image/png'), w: art.width, h: art.height, back: back.toDataURL('image/png'), bw: g.width, bh: g.height };
    }, { c, marks, HEIGHTS, COLS, ROWS, GAP, ART_W, DPI });
    const out = path.join(root, cw); fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'front.png'), setDpi(Buffer.from(res.png.split(',')[1], 'base64'), true));
    fs.writeFileSync(path.join(out, 'back.png'), setDpi(Buffer.from(res.back.split(',')[1], 'base64'), true));
    sizes[cw] = { front: { wIn: +(res.w / DPI).toFixed(2), hIn: +(res.h / DPI).toFixed(2) }, back: { wIn: +(res.bw / DPI).toFixed(2), hIn: +(res.bh / DPI).toFixed(2) } };
  }
  fs.writeFileSync(path.join(root, 'sizes.json'), JSON.stringify(sizes, null, 2) + '\n');

  // Sheet: each colorway on a navy and a black tee, front and back, plus a close-up.
  const PX = 13, href = p => 'file:///' + p.replace(/\\/g, '/');
  const TEE = 'M-3.6,0 L-9.8,1.2 L-15.6,7.6 L-12.6,10.8 L-11,9.3 L-11,30 L11,30 L11,9.3 L12.6,10.8 L15.6,7.6 L9.8,1.2 L3.6,0 Q0,6 -3.6,0 Z';
  const cells = [];
  for (const [cw, c] of Object.entries(COLORWAYS)) for (const [shirt, collar, sn] of [['#1b2340', '#283152', 'navy'], ['#17171a', '#26262a', 'black']]) {
    const z = sizes[cw].front;
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE}" fill="${shirt}"/><path d="M-3.6,0 Q0,6 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, cw, 'front.png'))}" x="${-z.wIn / 2}" y="4.5" width="${z.wIn}" height="${z.hIn}"/></svg><figcaption>${c.name} · ${sn} · ${z.wIn} × ${z.hIn} in</figcaption></figure>`);
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE.replace('Q0,6', 'Q0,2')}" fill="${shirt}"/><path d="M-3.6,0 Q0,2 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, cw, 'back.png'))}" x="-6" y="3" width="12" height="16"/></svg><figcaption>back</figcaption></figure>`);
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><div style="background:${shirt};padding:14px;width:${33 * PX - 28}px;height:${33.5 * PX - 28}px;display:flex;align-items:center;justify-content:center"><img src="${href(path.join(root, cw, 'front.png'))}" style="max-width:100%;max-height:100%"></div><figcaption>close-up</figcaption></figure>`);
  }
  const tmp = path.join(root, '_sheet.html');
  fs.writeFileSync(tmp, `<body style="margin:0;padding:10px;background:#ececea;display:grid;grid-template-columns:repeat(3,auto);gap:8px 12px">${cells.join('')}</body>`);
  await page.setViewportSize({ width: 3 * (33 * PX + 12) + 30, height: 400 });
  await page.goto(href(tmp)); await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(__dirname, 'equalizer-samples.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log(JSON.stringify(sizes));
})();
