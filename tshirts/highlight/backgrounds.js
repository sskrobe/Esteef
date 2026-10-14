// Highlight (Rainbow) sticker-pattern back: six SUBTLE background options to dress up back-pattern.png (the tossed
// rainbow Saint stickers): fine patterns / textures in dark, muted tones that read as texture on a black shirt, not
// as color blocks. Each fills a panel inset from the 12 x 16 in print area and fades out toward the panel edge (by
// shrinking or thinning out), so there is no hard rectangle. The stickers and $DAILY BREAD$ sit on top unchanged.
//   halftone   a diagonal dot screen; the dots shrink toward the edges
//   hatch      scattered clusters of fine-liner pen hatching (matches the pen work)
//   rain       scattered short marker dashes in dark pink / teal / gold / violet (the rain-dash texture)
//   icons      a tone-on-tone repeat of tiny halos, X eyes and heartbeat squiggles
//   sparkle    scattered four-point sparkles and dots in dim gold and violet
//   type       rows of tiny COMA TOAST · DAILY BREAD, tone-on-tone, on an angle
//   snake      the classic Snake phone game: pixel snakes winding on a grid, with food pellets
// Solid colors only, no partial transparency (DTG). Needs files/rainbow-products/back-pattern.png (products.js).
// Outputs: files/rainbow-products/back-pattern-<option>.png; backgrounds-samples.png.
// Run: node tshirts/highlight/backgrounds.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { setDpi } = require('../paintshop/printful');

const OPTIONS = {
  halftone: 'Halftone dots',
  hatch: 'Pen hatch',
  rain: 'Rain dashes',
  icons: 'Face icons',
  sparkle: 'Sparkles',
  type: 'Tiny type',
  snake: 'Snake game',
};
const PANEL = { margin: 0.35, fade: 1.6 };   // inset from the print area, fade-out distance (in)
const out = path.join(__dirname, 'files', 'rainbow-products');
const STICKERS = path.join(out, 'back-pattern.png');
const href = p => 'file:///' + p.replace(/\\/g, '/');

(async () => {
  if (!fs.existsSync(STICKERS)) throw new Error('run products.js first');
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  await page.setContent('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=block"><body></body>');
  await page.evaluate(async () => { await document.fonts.load('700 100px "Montserrat"', 'COMA TOAST · DAILY BREAD'); });
  const stickers = 'data:image/png;base64,' + fs.readFileSync(STICKERS).toString('base64');
  for (const opt of Object.keys(OPTIONS)) {
    const png = await page.evaluate(async ({ opt, stickers, PANEL }) => {
      const IN = 300, AW = 12 * IN, AH = 16 * IN, M = PANEL.margin * IN, F = PANEL.fade * IN;
      let seed = opt.length * 7919 + 13; const R = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
      const c = document.createElement('canvas'); c.width = AW; c.height = AH; const x = c.getContext('2d');
      // 0 at the panel edge, 1 once F inside it (smooth), with a little wobble so the fade edge is organic
      const fade = (px, py) => { const d = Math.min(px - M, AW - M - px, py - M, AH - M - py) + Math.sin(px * 0.004 + py * 0.003) * 0.25 * IN; if (d <= 0) return 0; const t = Math.min(1, d / F); return t * t * (3 - 2 * t); };
      const keep = (px, py) => R() < fade(px, py);
      const VIOLET = '#43376a', SLATE = '#3d3e52', GOLD = '#6b582b';
      if (opt === 'halftone') {
        // a 45° dot screen, dot size from the fade (and a slow wave, so it breathes)
        const step = 0.17 * IN; x.fillStyle = VIOLET;
        for (let i = -AH; i < AW + AH; i += step) for (let j = -AH; j < AW + AH; j += step) {
          const px = (i + j) / 2 + 0, py = (j - i) / 2 + AH / 2; if (px < 0 || py < 0 || px > AW || py > AH) continue;
          const r = step * 0.36 * fade(px, py) * (0.75 + 0.25 * Math.sin(px * 0.0016) * Math.cos(py * 0.0012));
          if (r > 2.2) { x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill(); } }
      } else if (opt === 'hatch') {
        x.strokeStyle = SLATE; x.lineCap = 'round';
        for (let n = 0; n < 420; n++) { const cx = R() * AW, cy = R() * AH; if (!keep(cx, cy)) continue;
          const a = -1.05 + (R() - 0.5) * 0.4, l = (0.28 + R() * 0.3) * IN, k = 5 + (R() * 6 | 0), gap = 0.07 * IN;
          for (let i = 0; i < k; i++) { const ox = cx + i * gap, oy = cy + (R() - 0.5) * 8; x.lineWidth = 5 + R() * 3; x.beginPath(); x.moveTo(ox, oy); x.lineTo(ox + Math.cos(a) * l, oy + Math.sin(a) * l); x.stroke(); } }
      } else if (opt === 'rain') {
        const cols = ['#5e2a4f', '#244c56', '#5a4f25', '#45366e']; x.lineCap = 'butt';
        for (let n = 0; n < 2600; n++) { const px = R() * AW, py = R() * AH; if (!keep(px, py)) continue;
          const a = -0.62 + (R() - 0.5) * 0.08, l = (0.12 + R() * 0.32) * IN; x.strokeStyle = cols[(R() * cols.length) | 0]; x.lineWidth = 0.03 * IN + R() * 0.03 * IN;
          x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
      } else if (opt === 'icons') {
        // halo, X, heartbeat squiggle, repeated on an offset grid, a touch of jitter
        x.strokeStyle = SLATE; x.lineWidth = 0.035 * IN; x.lineCap = 'round'; x.lineJoin = 'round'; const step = 0.85 * IN; let k = 0;
        for (let row = 0, py = M; py < AH; row++, py += step * 0.8) for (let px = M + (row % 2) * step / 2; px < AW; px += step, k++) {
          if (fade(px, py) < 0.35 + R() * 0.4) continue; const s = 0.22 * IN, jx = (R() - 0.5) * 0.1 * IN, jy = (R() - 0.5) * 0.1 * IN; x.save(); x.translate(px + jx, py + jy); x.rotate((R() - 0.5) * 0.4); x.beginPath();
          const kind = (k + row) % 3;
          if (kind === 0) { x.ellipse(0, 0, s, s * 0.32, 0, 0, Math.PI * 2); }
          else if (kind === 1) { x.moveTo(-s * 0.55, -s * 0.55); x.lineTo(s * 0.55, s * 0.55); x.moveTo(s * 0.55, -s * 0.55); x.lineTo(-s * 0.55, s * 0.55); }
          else { x.moveTo(-s, 0); x.lineTo(-s * 0.35, 0); x.quadraticCurveTo(-s * 0.15, -s * 0.6, 0, 0); x.quadraticCurveTo(s * 0.15, s * 0.6, s * 0.35, 0); x.lineTo(s, 0); }
          x.stroke(); x.restore(); }
      } else if (opt === 'sparkle') {
        const star = (px, py, r) => { x.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * 0.22 : r; x.lineTo(px + Math.cos(a - Math.PI / 2) * rr, py + Math.sin(a - Math.PI / 2) * rr); } x.closePath(); x.fill(); };
        for (let n = 0; n < 900; n++) { const px = R() * AW, py = R() * AH; if (!keep(px, py)) continue;
          x.fillStyle = R() < 0.5 ? GOLD : VIOLET;
          if (R() < 0.35) star(px, py, (0.06 + R() * 0.14) * IN); else { x.beginPath(); x.arc(px, py, (0.012 + R() * 0.02) * IN, 0, Math.PI * 2); x.fill(); } }
      } else if (opt === 'snake') {
        // a pixel grid; snakes random-walk with right-angle turns (never crossing themselves or each other), drawn as
        // square blocks with small gaps like the old phone game; single food pellets scattered around
        const cell = 0.2 * IN, blk = cell * 0.82, cols = Math.floor(AW / cell), rows = Math.floor(AH / cell), used = new Set();
        const ok = (i, j) => i >= 0 && j >= 0 && i < cols && j < rows && !used.has(i + ',' + j) && fade((i + 0.5) * cell, (j + 0.5) * cell) > 0.2;
        const block = (i, j, col) => { x.fillStyle = col; x.fillRect(i * cell + (cell - blk) / 2, j * cell + (cell - blk) / 2, blk, blk); };
        const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        for (let n = 0; n < 16; n++) {
          let i, j, t = 0; do { i = (R() * cols) | 0; j = (R() * rows) | 0; t++; } while (!ok(i, j) && t < 500); if (t >= 500) continue;
          let d = (R() * 4) | 0; const len = 18 + ((R() * 30) | 0), body = [[i, j]]; used.add(i + ',' + j);
          for (let k = 1; k < len; k++) { if (R() < 0.2) d = (d + (R() < 0.5 ? 1 : 3)) % 4;
            let moved = false; for (const dd of [d, (d + 1) % 4, (d + 3) % 4]) { const ni = i + DIRS[dd][0], nj = j + DIRS[dd][1]; if (ok(ni, nj)) { i = ni; j = nj; d = dd; moved = true; break; } }
            if (!moved) break; used.add(i + ',' + j); body.push([i, j]); }
          body.forEach(([a, b], k) => { if (R() < fade((a + 0.5) * cell, (b + 0.5) * cell) + 0.25) block(a, b, k === body.length - 1 ? '#40613f' : '#33503a'); });
        }
        for (let n = 0; n < 60; n++) { const a = (R() * cols) | 0, b = (R() * rows) | 0; if (ok(a, b) && keep((a + 0.5) * cell, (b + 0.5) * cell)) block(a, b, '#5c2f36'); }
      } else if (opt === 'type') {
        x.fillStyle = SLATE; x.font = '700 ' + (0.16 * IN) + 'px "Montserrat"'; x.letterSpacing = (0.04 * IN) + 'px';
        const t = 'COMA TOAST  ·  DAILY BREAD  ·  '; const tw = x.measureText(t).width; const lh = 0.36 * IN;
        x.save(); x.translate(AW / 2, AH / 2); x.rotate(-0.2);
        for (let row = -40; row < 40; row++) { const y = row * lh, off = (row % 2) * tw / 2;
          for (let px = -AW - off; px < AW; px += tw) {
            // keep each word block only where the fade allows (measured back in print-area coordinates)
            const gx = AW / 2 + Math.cos(-0.2) * (px + tw / 4) - Math.sin(-0.2) * y, gy = AH / 2 + Math.sin(-0.2) * (px + tw / 4) + Math.cos(-0.2) * y;
            if (fade(gx, gy) > 0.3 + R() * 0.5) x.fillText(t, px, y); } }
        x.restore();
      }
      // stickers on top, then no partial transparency
      const s = await new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.src = stickers; });
      x.drawImage(s, 0, 0);
      const d = x.getImageData(0, 0, AW, AH); for (let i = 3; i < d.data.length; i += 4) d.data[i] = d.data[i] > 110 ? 255 : 0; x.putImageData(d, 0, 0);
      return c.toDataURL('image/png');
    }, { opt, stickers, PANEL });
    fs.writeFileSync(path.join(out, 'back-pattern-' + opt + '.png'), setDpi(Buffer.from(png.split(',')[1], 'base64'), true));
  }

  // sheet: each option on a black hoodie back (size L, true scale), then a close-up of each
  const PX = 12, f = n => href(path.join(out, n));
  const LS = 'M-3.6,0 L-9.8,1.2 L-12.4,4 L-16.9,26.2 L-13.1,27 L-11,12.5 L-11.4,31 L11.4,31 L11,12.5 L13.1,27 L16.9,26.2 L12.4,4 L9.8,1.2 L3.6,0 Q0,2 -3.6,0 Z';
  const HOOD = 'M-4.6,0.6 Q-7.2,-8.6 0,-9.4 Q7.2,-8.6 4.6,0.6 L4.6,4 L-4.6,4 Z', BAND = 'M-11.4,28.6 L11.4,28.6 L11.4,31 L-11.4,31 Z';
  const fig = (inner, cap) => `<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333">${inner}<figcaption>${cap}</figcaption></figure>`;
  const cells = [], closes = [];
  for (const [opt, name] of Object.entries(OPTIONS)) {
    cells.push(fig(`<svg viewBox="-18 -10.5 36 42" width="${36 * PX}" height="${42 * PX}"><path d="${HOOD}" fill="#202024"/><path d="${LS}" fill="#17171a"/><path d="M-3.6,0 Q0,2 3.6,0" fill="none" stroke="#26262a" stroke-width="0.75"/><path d="${BAND}" fill="#1f1f23"/><image href="${f('back-pattern-' + opt + '.png')}" x="-6" y="4.5" width="12" height="16"/></svg>`, `${Object.keys(OPTIONS).indexOf(opt) + 1}. ${name}`));
    closes.push(fig(`<div style="background:#17171a;width:${36 * PX}px;height:${30 * PX}px;overflow:hidden;position:relative"><img src="${f('back-pattern-' + opt + '.png')}" style="position:absolute;width:${36 * PX * 1.9}px;left:${-36 * PX * 0.2}px;top:${-36 * PX * 0.35}px"></div>`, `${name} · close-up`));
  }
  const tmp = path.join(out, '_sheet.html');
  fs.writeFileSync(tmp, `<body style="margin:0;padding:10px;background:#ececea;display:grid;grid-template-columns:repeat(3,auto);gap:8px 12px">${cells.join('')}${closes.join('')}</body>`);
  await page.setViewportSize({ width: 3 * (36 * PX + 12) + 30, height: 400 });
  await page.goto(href(tmp)); await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(__dirname, 'backgrounds-samples.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log('done');
})();
