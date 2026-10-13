// Renders the Benday Logo files: each official Coma Toast mark, filled with Ben-Day dots (benday.js),
// in the swatch style (the mark on a rough blue Ben-Day stipple paint swatch), as a transparent PNG trimmed
// to the art and sized to fit a 10.5 x 12 in box at 300 dpi.
// Size and placement standard (go-forward for this design on every tee):
//   - The art fits a 10.5 in wide x 12 in tall box (about the size of a Psycho Bunny chest graphic), so it
//     fits Printful's smallest front print area (XS-M, 11.5 x 13.8 in on the Bella+Canvas 3001) and stays
//     the same size on every shirt size.
//   - Centered left to right; top of the art 1.5 in below the front collar seam.
// Run: node tshirts/benday-logo/make.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as in
// tshirts/paintshop/printful.js)
const fs = require('fs');
const path = require('path');
const { logos, buildSvg } = require('./benday');
const { setDpi } = require('../paintshop/printful');

const DPI = 300, BOX_W = DPI * 10.5, BOX_H = DPI * 12, STYLE = 'swatch';
const out = path.join(__dirname, 'files');

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  fs.mkdirSync(out, { recursive: true });
  const sizes = {};
  for (const l of logos) {
    // Draw the SVG big, find the visible bounds, then crop and scale it to fit the 10 in box.
    const res = await page.evaluate(async ({ svg, BOX_W, BOX_H }) => {
      const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); await img.decode();
      const N = 4000, c = document.createElement('canvas'); c.width = c.height = N;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0, N, N);
      const d = x.getImageData(0, 0, N, N).data;
      let x0 = N, y0 = N, x1 = 0, y1 = 0;
      for (let y = 0; y < N; y++) for (let i = 0; i < N; i++) if (d[(y * N + i) * 4 + 3] > 8) {
        if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
      const w = x1 - x0 + 1, h = y1 - y0 + 1, k = Math.min(BOX_W / w, BOX_H / h);
      const o = document.createElement('canvas'); o.width = Math.round(w * k); o.height = Math.round(h * k);
      const ox = o.getContext('2d'); ox.imageSmoothingQuality = 'high';
      // redraw from the vector at the final scale for crisp edges
      ox.drawImage(img, -x0 * k, -y0 * k, N * k, N * k);
      return { png: o.toDataURL('image/png'), w: o.width, h: o.height };
    }, { svg: buildSvg(l, { size: 4000, style: STYLE }), BOX_W, BOX_H });
    const file = `benday-${l.id}.png`;
    fs.writeFileSync(path.join(out, file), setDpi(Buffer.from(res.png.split(',')[1], 'base64'), true));
    fs.writeFileSync(path.join(out, `benday-${l.id}.svg`), buildSvg(l, { size: 1000, style: STYLE }) + '\n');
    sizes[l.id] = { name: l.name, file, w: res.w, h: res.h, wIn: +(res.w / DPI).toFixed(2), hIn: +(res.h / DPI).toFixed(2) };
    console.log('wrote', file, `${res.w} x ${res.h} px = ${sizes[l.id].wIn} x ${sizes[l.id].hIn} in`);
  }
  fs.writeFileSync(path.join(out, 'sizes.json'), JSON.stringify(sizes, null, 2) + '\n');
  await browser.close();
})();
