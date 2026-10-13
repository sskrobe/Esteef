// Benday Logo back print: $Daily Bread$ in the bottom-right corner of the back, as low as the print area
// allows, in the front's art style: white Rubik Wet Paint lettering (the brand wordmark font, see
// tshirts/paintshop) with a bold black outline, dollar signs in solid blue, on a small rough blue Ben-Day
// stipple swatch with the same dot size, brush streaks and square chips as the front.
// Outputs (in files/):
//   back-daily-bread.png        the whole 12 x 16 in back print area (3600 x 4800 at 300 dpi), transparent,
//                               with the wordmark in the bottom-right corner; upload it to fill the area
//   daily-bread-benday.png      the wordmark art alone, trimmed
// Printful's back print area on the Bella+Canvas 3001 is 12 x 16 in on every size, so the bottom-right
// corner of that area is as low and as far right as the back print can go.
// Run after make.js: node tshirts/benday-logo/back.js
const fs = require('fs');
const path = require('path');
const { swatch, COLORS: { INK, WHITE, BLUE } } = require('./benday');
const { setDpi } = require('../paintshop/printful');

// Settings (env): ACCENT color, OUT folder (with that folder's sizes.json from make.js), TEXT_W_IN.
const files = process.env.OUT || path.join(__dirname, 'files');
const ACC = process.env.ACCENT || BLUE;
const sizes = JSON.parse(fs.readFileSync(path.join(files, 'sizes.json'), 'utf8'));
const DPI = 300, AREA_W = 12 * DPI, AREA_H = 16 * DPI;
const INSET = Math.round(0.1 * DPI);   // keep 0.1 in off the very edge of the print area
const PXU = sizes.plain.pxPerUnit;     // print pixels per drawing unit: same dot size as the front
const TEXT_W_IN = +(process.env.TEXT_W_IN || 7);   // lettering width (as on PaintShop); the swatch adds a little
const FONT = 'file:///' + path.join(__dirname, '..', 'fonts', 'RubikWetPaint-latin.woff2').replace(/\\/g, '/');
const PIECES = ['$', 'Daily Bread', '$'], GAP = 0.1;   // GAP: space after each $ / before the last, in em

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  const head = `<style>@font-face{font-family:'WP';src:url('${FONT}') format('woff2');font-display:block}html,body{margin:0;background:transparent}</style>`;
  const tmp = path.join(files, '_back.html');

  // 1. Measure the lettering at 100 units.
  fs.writeFileSync(tmp, `${head}<svg id="s" width="2000" height="400"><text id="t" x="0" y="200" font-family="WP" font-size="100">${PIECES.map((p, i) => `<tspan dx="${i ? GAP * 100 : 0}">${p}</tspan>`).join('')}</text></svg>`);
  await page.goto('file:///' + tmp);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const b = await page.evaluate(() => { const r = document.getElementById('t').getBBox(); return { x: r.x, y: r.y - 200, w: r.width, h: r.height }; });

  // 2. Lay it out in drawing units, sized so the lettering is TEXT_W_IN wide at the front's scale.
  const s = (TEXT_W_IN * DPI / PXU) / b.w, fs_ = 100 * s;
  const tx = -b.x * s, base = -b.y * s, tw = b.w * s, th = b.h * s;
  const box = { x0: -4, y0: -6, x1: tw + 4, y1: th + 6, tilt: -2.2, pitch: 5.2, n: [26, 7], jx: 2.2, streaks: 5, scratches: 12, color: ACC };
  const sw = swatch(11, 'sw-back', box);
  const pad = 20, vb = [box.x0 - pad, box.y0 - pad, box.x1 - box.x0 + 2 * pad, box.y1 - box.y0 + 2 * pad];
  const text = `<text x="${tx}" y="${base}" font-family="WP" font-size="${fs_}" stroke="${INK}" stroke-width="${(0.11 * fs_).toFixed(2)}" stroke-linejoin="round" paint-order="stroke">`
    + PIECES.map((p, i) => `<tspan dx="${i ? GAP * fs_ : 0}" fill="${i === 1 ? WHITE : ACC}">${p}</tspan>`).join('') + '</text>';
  const W = Math.round(vb[2] * PXU), H = Math.round(vb[3] * PXU);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" width="${W}" height="${H}"><defs>${sw.def.replace('x="-30" y="-30" width="260" height="260"', `x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}"`)}</defs>${sw.art}${text}</svg>`;

  // 3. Render it, trim it, and drop it into the bottom-right corner of the 12 x 16 in back print area.
  await page.setViewportSize({ width: W, height: H });
  fs.writeFileSync(tmp, `${head}${svg}`);
  await page.goto('file:///' + tmp);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const shot = (await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } })).toString('base64');
  const res = await page.evaluate(async ({ shot, AREA_W, AREA_H, INSET }) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + shot; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const x = c.getContext('2d'); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
    for (let y = 0; y < c.height; y++) for (let i = 0; i < c.width; i++) if (d[(y * c.width + i) * 4 + 3] > 8) {
      if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    const w = x1 - x0 + 1, h = y1 - y0 + 1;
    const a = document.createElement('canvas'); a.width = w; a.height = h; a.getContext('2d').drawImage(c, -x0, -y0);
    const f = document.createElement('canvas'); f.width = AREA_W; f.height = AREA_H;
    f.getContext('2d').drawImage(a, AREA_W - INSET - w, AREA_H - INSET - h);
    return { art: a.toDataURL('image/png'), full: f.toDataURL('image/png'), w, h };
  }, { shot, AREA_W, AREA_H, INSET });
  fs.unlinkSync(tmp);
  const save = (name, url) => fs.writeFileSync(path.join(files, name), setDpi(Buffer.from(url.split(',')[1], 'base64'), true));
  save('daily-bread-benday.png', res.art);
  save('back-daily-bread.png', res.full);
  sizes.back = { file: 'back-daily-bread.png', art: 'daily-bread-benday.png', wIn: +(res.w / DPI).toFixed(2), hIn: +(res.h / DPI).toFixed(2), areaIn: [12, 16], insetIn: 0.1 };
  fs.writeFileSync(path.join(files, 'sizes.json'), JSON.stringify(sizes, null, 2) + '\n');
  console.log(`wrote back-daily-bread.png (12 x 16 in) with the wordmark ${sizes.back.wIn} x ${sizes.back.hIn} in in the bottom-right corner`);
  await browser.close();
})();
