// Inside label, final direction: DAILY over BREAD in Montserrat ExtraBold (the brand font), outline only
// (the shirt color shows through the letters), set as one justified block: each line is spaced so its
// first and last letters sit exactly on the same left and right edges as the other line.
// Variants:
//   block    the justified two-line block
//   framed   the block centered in a thin square frame (same line weight as the outline): a true square
//   tall     the block drawn taller so the two words alone fill a square (tall, condensed look)
// Outputs in inside/final/: montserrat-<variant>-<black|white>.png (900 x 900 px = 3 x 3 in at 300 dpi,
// transparent; logo in the top of Printful's inside label, bottom clear for Printful's required text) and
// inside-label-final.png (review sheet). Montserrat loads from Google Fonts (SIL Open Font License).
// Run: node tshirts/labels/inside-final.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { setDpi } = require('../paintshop/printful');

const out = path.join(__dirname, 'inside', 'final');
const DPI = 300, LABEL = 3 * DPI;
const TOP_IN = 0.2, MAX_H_IN = 1.35;   // the logo's top and its tallest size on the label
const LINE_IN = 0.022;                 // visible outline width (about 1.6 pt)
const COLORS = { black: '#111111', white: '#ffffff' };
const FONT = '800 100px "Montserrat"';
const WORDS = ['DAILY', 'BREAD'];
const VARIANTS = {
  block: { w: 2.1 },               // width in inches (height follows)
  framed: { side: MAX_H_IN },      // square frame side
  tall: { side: 1.25 },            // square block side
};

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  fs.mkdirSync(out, { recursive: true });
  await page.setContent('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=block"><body></body>');
  await page.evaluate(async FONT => { await document.fonts.load(FONT, 'DAILYBREAD'); }, FONT);

  for (const [variant, v] of Object.entries(VARIANTS)) for (const [cname, color] of Object.entries(COLORS)) {
    const png = await page.evaluate(({ variant, v, color, FONT, WORDS, DPI, LABEL, TOP_IN, LINE_IN }) => {
      const c = document.createElement('canvas'); c.width = c.height = LABEL;
      const x = c.getContext('2d');
      x.font = FONT;
      // Per-letter metrics at 100px: advance and ink edges.
      const glyphs = WORDS.map(w => [...w].map(ch => { const m = x.measureText(ch); return { ch, adv: m.width, l: m.actualBoundingBoxLeft, r: m.actualBoundingBoxRight }; }));
      const cap = x.measureText('D').actualBoundingBoxAscent;
      // Justify: both lines get the width of the wider line plus a touch of modern tracking.
      const W = Math.max(...glyphs.map(g => { const a = g.slice(0, -1).reduce((s, q) => s + q.adv, 0); return g[0].l + a + g[g.length - 1].r; })) * 1.06;
      const GAP = cap * 0.34;                       // space between the lines
      const blockH = cap * 2 + GAP;
      // Fit to the variant's size (in px at 300 dpi).
      const line = LINE_IN * DPI * 2;               // room for the outline on both sides
      let k, sy = 1, frame = null;
      if (variant === 'block') k = (v.w * DPI - line) / W;
      if (variant === 'framed') { const side = v.side * DPI, pad = side * 0.08; k = (side - 2 * pad - line) / W; frame = side; }
      if (variant === 'tall') { const side = v.side * DPI - line; k = side / W; sy = side / (blockH * k); }
      const bw = W * k, bh = blockH * k * sy;
      const cx = LABEL / 2, top = TOP_IN * DPI + line / 2 + (frame ? (frame - bh) / 2 - line / 2 : 0);
      const x0 = cx - bw / 2;
      // Draw: stroke each letter at its justified position, then erase the letter fill (outline only).
      const draw = mode => {
        glyphs.forEach((g, row) => {
          const adv = g.slice(0, -1).reduce((s, q) => s + q.adv, 0), inkW = g[0].l + adv + g[g.length - 1].r;
          const extra = (W - inkW) / (g.length - 1);   // spread the leftover width evenly between letters
          let px = g[0].l;
          const base = top / (k * sy) + cap + row * (cap + GAP);
          g.forEach(q => {
            x.save(); x.translate(x0, 0); x.scale(k, k * sy);
            if (mode === 'stroke') x.strokeText(q.ch, px, base); else x.fillText(q.ch, px, base);
            x.restore();
            px += q.adv + extra;
          });
        });
      };
      // Outline: draw the filled letters, spread that shape outward by the line width in every direction
      // (so the line is even even when the letters are stretched), then cut the letters back out.
      x.font = FONT; x.textBaseline = 'alphabetic'; x.fillStyle = color;
      draw('fill');
      const fillC = document.createElement('canvas'); fillC.width = fillC.height = LABEL; fillC.getContext('2d').drawImage(c, 0, 0);
      x.clearRect(0, 0, LABEL, LABEL);
      const r = LINE_IN * DPI;
      for (let a = 0; a < 360; a += 7.5) for (const f of [0.5, 1]) x.drawImage(fillC, Math.cos(a * Math.PI / 180) * r * f, Math.sin(a * Math.PI / 180) * r * f);
      x.globalCompositeOperation = 'destination-out'; x.drawImage(fillC, 0, 0); x.globalCompositeOperation = 'source-over';
      x.strokeStyle = color;

      if (frame) {
        x.lineWidth = LINE_IN * DPI; x.strokeRect(cx - frame / 2 + x.lineWidth / 2, TOP_IN * DPI + x.lineWidth / 2, frame - x.lineWidth, frame - x.lineWidth);
      }
      return c.toDataURL('image/png');
    }, { variant, v, color, FONT, WORDS, DPI, LABEL, TOP_IN, LINE_IN });
    fs.writeFileSync(path.join(out, `montserrat-${variant}-${cname}.png`), setDpi(Buffer.from(png.split(',')[1], 'base64'), true));
  }

  // Review sheet: label size on light and dark, plus a 3x close-up of each.
  const F = out.replace(/\\/g, '/'), PX = 80;
  const cell = (variant, cname, zoom) => {
    const bg = cname === 'black' ? '#f2f2f0' : '#17171a', ink = cname === 'black' ? '#666' : '#bbb', s = zoom ? 2 * PX : PX;
    const img = `<img src="file:///${F}/montserrat-${variant}-${cname}.png" style="position:absolute;left:${zoom ? -0.3 * s : 0}px;top:${zoom ? -0.05 * s : 0}px;width:${3 * s}px;height:${3 * s}px">`;
    const text = zoom ? '' : `<div style="position:absolute;left:0;right:0;top:${1.75 * PX}px;text-align:center;font:700 12px system-ui;letter-spacing:.06em;color:${ink};line-height:1.35">M<br><span style="font-weight:500;font-size:9px">100% COTTON · MADE IN …<br>MACHINE WASH COLD</span></div>`;
    return `<div style="position:relative;overflow:hidden;width:${zoom ? 2.4 * s : 3 * PX}px;height:${zoom ? 1.65 * s : 3 * PX}px;background:${bg};outline:1px dashed #999">${img}${text}</div>`;
  };
  const rows = Object.keys(VARIANTS).map(vn => `<div style="font:700 14px system-ui;color:#333;align-self:center">${vn}</div>${cell(vn, 'black')}${cell(vn, 'white')}${cell(vn, 'black', true)}${cell(vn, 'white', true)}`).join('');
  const tmp = path.join(out, '_sheet.html');
  fs.writeFileSync(tmp, `<body style="margin:0;padding:12px;background:#fafaf8;display:grid;grid-template-columns:70px repeat(4,auto);gap:12px;align-items:start;justify-content:start">${rows}</body>`);
  await page.setViewportSize({ width: 70 + 2 * 3 * PX + 2 * 2.4 * 2 * PX + 80, height: 400 });
  await page.goto('file:///' + tmp);
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(__dirname, 'inside-label-final.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log('wrote', Object.keys(VARIANTS).length * 2, 'labels and inside-label-final.png');
})();
