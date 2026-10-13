// Inside neck label: "Daily Bread" in outline only (the shirt color shows through the letters), set in a
// corporate brand font. The drip font (Rubik Wet Paint) belongs to individual designs, not the label.
// This renders the brand-font candidates so one can be picked as the go-forward brand font.
//
// The outline sits outside each letter's edge and the inside of the letter is left transparent. It is
// made by stroking the text and then erasing the filled text, so overlapping contours inside variable
// fonts never show up as stray lines.
// Printful's inside label on the Bella+Canvas 3001 is 3 x 3 in; Printful adds the required size /
// material / care / origin text below the logo, so the logo sits in the top of the square.
//
// Outputs in inside/: <font>-<layout>-<black|white>.png (900 x 900 px = 3 x 3 in at 300 dpi, transparent)
// and inside-label-fonts.png (review sheet). Fonts load from Google Fonts (all SIL Open Font License).
// Run: node tshirts/labels/inside.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { setDpi } = require('../paintshop/printful');

const out = path.join(__dirname, 'inside');
const DPI = 300, LABEL = 3 * DPI;
const ZONE = { top: 0.25, w: 2.5, h: 1.2 };   // inches; the bottom of the label stays clear for Printful's text
const LINE_IN = 0.022;                        // visible outline width (about 1.6 pt): safe for DTG
const COLORS = { black: '#111111', white: '#ffffff' };
const FONTS = [
  { id: 'bodoni-moda', name: 'Bodoni Moda', css: '800 100px "Bodoni Moda"', family: 'Bodoni+Moda:opsz,wght@11,800', note: 'high-fashion serif (small-text cut: sturdier hairlines)' },
  { id: 'cinzel', name: 'Cinzel', css: '800 100px "Cinzel"', family: 'Cinzel:wght@800', note: 'Roman capitals' },
  { id: 'syne', name: 'Syne', css: '800 100px "Syne"', family: 'Syne:wght@800', note: 'fashion-forward sans' },
  { id: 'archivo-black', name: 'Archivo Black', css: '400 100px "Archivo Black"', family: 'Archivo+Black', note: 'sturdy grotesk' },
  { id: 'unbounded', name: 'Unbounded', css: '700 100px "Unbounded"', family: 'Unbounded:wght@700', note: 'wide modern' },
  { id: 'montserrat', name: 'Montserrat', css: '800 100px "Montserrat"', family: 'Montserrat:wght@800', note: 'classic corporate sans' },
];
const LAYOUTS = { line: ['Daily Bread'], stacked: ['Daily', 'Bread'] };

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  fs.mkdirSync(out, { recursive: true });
  const href = 'https://fonts.googleapis.com/css2?' + FONTS.map(f => 'family=' + f.family).join('&') + '&display=block';
  await page.setContent(`<link rel="stylesheet" href="${href}"><body></body>`);
  await page.evaluate(async FONTS => { for (const f of FONTS) await document.fonts.load(f.css, 'Daily Bread'); }, FONTS);

  const sizes = {};
  for (const f of FONTS) for (const [layout, lines] of Object.entries(LAYOUTS)) for (const [cname, color] of Object.entries(COLORS)) {
    const r = await page.evaluate(({ f, lines, color, ZONE, DPI, LABEL, LINE_IN }) => {
      // Measure at 100px, then scale the font so the text block fits the zone.
      const c = document.createElement('canvas'); c.width = c.height = LABEL;
      const x = c.getContext('2d');
      const font = px => f.css.replace('100px', px + 'px');
      x.font = font(100);
      const m = lines.map(t => x.measureText(t));
      const lead = 1.36;   // stacked line spacing, in cap heights (clears the y descender)
      const capH = Math.max(...m.map(v => v.actualBoundingBoxAscent));
      const w = Math.max(...m.map(v => v.actualBoundingBoxLeft + v.actualBoundingBoxRight));
      const h = capH * (lines.length - 1) * lead + Math.max(...m.map(v => v.actualBoundingBoxAscent)) + Math.max(...m.map(v => v.actualBoundingBoxDescent));
      const line = LINE_IN * DPI * 2;   // stroke is centered on the edge; half of it is erased with the fill
      const k = Math.min((ZONE.w * DPI - line) / w, (ZONE.h * DPI - line) / h), px = 100 * k;
      x.font = font(px); x.textAlign = 'center'; x.textBaseline = 'alphabetic';
      const top = ZONE.top * DPI + line / 2 + capH * k;
      const ys = lines.map((_, i) => top + i * capH * k * lead);
      x.lineJoin = 'round'; x.strokeStyle = color; x.lineWidth = line;
      lines.forEach((t, i) => x.strokeText(t, LABEL / 2, ys[i]));
      x.globalCompositeOperation = 'destination-out';
      lines.forEach((t, i) => x.fillText(t, LABEL / 2, ys[i]));
      return { png: c.toDataURL('image/png'), wIn: +((w * k + line) / DPI).toFixed(2), hIn: +((h * k + line) / DPI).toFixed(2) };
    }, { f, lines, color, ZONE, DPI, LABEL, LINE_IN });
    const file = `${f.id}-${layout}-${cname}.png`;
    fs.writeFileSync(path.join(out, file), setDpi(Buffer.from(r.png.split(',')[1], 'base64'), true));
    sizes[`${f.id}-${layout}`] = { font: f.name, layout, wIn: r.wIn, hIn: r.hIn };
  }
  fs.writeFileSync(path.join(out, 'sizes.json'), JSON.stringify(sizes, null, 2) + '\n');

  // Review sheet: each font, one line and stacked, on a light and a dark label (placeholder Printful text).
  const F = out.replace(/\\/g, '/'), PX = 64;
  const cell = (f, layout, cname) => {
    const bg = cname === 'black' ? '#f2f2f0' : '#17171a', ink = cname === 'black' ? '#666' : '#bbb';
    return `<figure style="margin:0;text-align:center;font:600 12px system-ui;color:#333">
      <div style="position:relative;width:${3 * PX}px;height:${3 * PX}px;background:${bg};outline:1px dashed #999">
        <img src="file:///${F}/${f.id}-${layout}-${cname}.png" style="position:absolute;inset:0;width:100%;height:100%">
        <div style="position:absolute;left:0;right:0;top:${1.7 * PX}px;font:700 12px system-ui;letter-spacing:.06em;color:${ink};line-height:1.35">M<br><span style="font-weight:500;font-size:9px">100% COTTON · MADE IN …<br>MACHINE WASH COLD</span></div>
      </div><figcaption>${f.name}${layout === 'stacked' ? ', stacked' : ''}</figcaption></figure>`;
  };
  const rows = FONTS.map(f => `<div style="display:contents">${['line', 'stacked'].map(l => ['black', 'white'].map(c => cell(f, l, c)).join('')).join('')}<div style="align-self:center;font:700 14px system-ui;color:#333">${f.name}<br><span style="font-weight:400;color:#777">${f.note}</span></div></div>`).join('');
  const tmp = path.join(out, '_sheet.html');
  fs.writeFileSync(tmp, `<body style="margin:0;padding:12px;background:#fafaf8;display:grid;grid-template-columns:repeat(4,auto) 160px;gap:12px 14px;justify-content:start">${rows}</body>`);
  await page.setViewportSize({ width: 4 * (3 * PX + 14) + 200, height: 400 });
  await page.goto('file:///' + tmp);
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(__dirname, 'inside-label-fonts.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log('wrote', Object.keys(sizes).length * 2, 'labels and inside-label-fonts.png');
})();
