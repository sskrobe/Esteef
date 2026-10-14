// Highlight (Rainbow) for more products: long sleeve tees and hoodies, with sleeve prints and back options.
// Builds on shade.js (run that first: it makes files/shade-rainbow/front.png and back.png) and reuses its marker
// helpers, so everything here is shaded the same way (three marker layers, light from the upper left, sticker
// mattes, pen outlines, rain dashes).
// Print files (files/rainbow-products/, 300 dpi, transparent):
//   front.png         the Rainbow front (same file as shade-rainbow; set it smaller on the hoodie, see the note)
//   back-small.png    12 x 16 in back area: $DAILY BREAD$ bottom-right (the standard back)
//   back-pattern.png  12 x 16 in back area: tossed rainbow toast stickers (a "sticker bomb"), the bottom-right corner
//                     kept clear for $DAILY BREAD$
//   back-big.png      12 x 16 in back area: one big toast on the upper back, $DAILY BREAD$ bottom-right
//   sleeve-left.png   a small toast sticker at the shoulder, then DAILY BREAD running down the sleeve
//   sleeve-right.png  the same with COMA TOAST
// Mockups: products-samples.png (long sleeve and hoodie, front and back, plus the flat files).
// Run: node tshirts/highlight/products.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { setDpi } = require('../paintshop/printful');

const DPI = 300;
const HL = { pink: '#ff6eb4', orange: '#ffa24a', yellow: '#ffec4a', cyan: '#55dcf0', blue: '#6aa8ff', purple: '#b388ff' };
const CW = { rainbow: true, mid: '#c9b6ff', dark: '#8b6fe0', cast: '#e2dcf5' };
const SLEEVE = { textIn: 12, markIn: 2.4, gapIn: 0.35 };   // sleeve text length, shoulder sticker height, gap between
const BIG_MARK_IN = 10, PATTERN = { n: 34, min: 1.9, max: 3.1, seed: 9 };

const src = fs.readFileSync(path.join(__dirname, 'shade.js'), 'utf8');
const HELPERS = src.slice(src.indexOf('content: `') + 10, src.indexOf('` });', src.indexOf('content: `')));
const root = path.join(__dirname, 'files'), out = path.join(root, 'rainbow-products');
const FRONT = path.join(root, 'shade-rainbow', 'front.png');
const href = p => 'file:///' + p.replace(/\\/g, '/');

(async () => {
  if (!fs.existsSync(FRONT)) throw new Error('run shade.js first');
  fs.mkdirSync(out, { recursive: true });
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  // a local page, so the front file can be loaded into canvases
  const tmpPage = path.join(out, '_work.html');
  fs.writeFileSync(tmpPage, '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=block"><body></body>');
  await page.goto(href(tmpPage));
  await page.evaluate(async () => { await document.fonts.load('900 100px "Montserrat"', '$DAILY BREAD$ COMA TOAST'); });
  await page.addScriptTag({ content: HELPERS + `
    // a shaded rainbow text sticker (same treatment as the back print): returns a trimmed canvas
    window.shadedText = (t, TWin, HL, cw, seed) => {
      const DPI = 300, TW = TWin * DPI, R = rng(seed);
      const m = canvas(10, 10).getContext('2d'); m.font = '900 100px "Montserrat"'; const px = 100 * TW / m.measureText(t).width;
      const W = TW + 0.6 * DPI, H = px * 1.3 + 0.5 * DPI, X = 0.25 * DPI, Y = H / 2 + px * 0.36;
      const T = canvas(W, H), tx = T.getContext('2d'); tx.font = '900 ' + px + 'px "Montserrat"'; tx.fillStyle = '#fff'; tx.fillText(t, X, Y); hard(T);
      const k = px / 300, sh = d => [0.62 * d * k * 300, 0.78 * d * k * 300];
      const away = (mm, d) => { const [dx, dy] = sh(d); return minus(mm, shift(mm, -dx, -dy)); };
      const castM = minus(shift(T, ...sh(0.07)), T);
      const paper = canvas(W, H), p = paper.getContext('2d'); p.drawImage(grow(or(T, castM), Math.max(0.07, 0.01 * TWin) * DPI), 0, 0); p.globalCompositeOperation = 'source-in'; p.fillStyle = '#fff'; p.fillRect(0, 0, W, H); p.globalCompositeOperation = 'source-over';
      const cols = [HL.pink, HL.orange, HL.yellow, HL.cyan, HL.blue, HL.purple];
      layer(paper, T, x => cols[Math.min(5, (x / W * 6) | 0)], R, -0.62, px * 0.35);
      layer(paper, castM, () => cw.cast, R, -0.62, px * 0.35);
      layer(paper, away(T, 0.1), () => cw.mid, R, -0.62, px * 0.35);
      layer(paper, away(T, 0.035), () => cw.dark, R, -0.62, px * 0.3);
      p.drawImage(edge(T, px * 0.0225), 0, 0);   // pen outline from the letter silhouette (strokeText traces the font's overlapping contours)
      return trim(hard(paper)); };
    window.scaled = (img, hIn) => { const h = hIn * 300, w = img.width * h / img.height, c = canvas(w, h), x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, w, h); return c; };
    window.png = c => c.toDataURL('image/png');
  ` });

  const save = (name, dataUrl) => fs.writeFileSync(path.join(out, name), setDpi(Buffer.from(dataUrl.split(',')[1], 'base64'), true));
  fs.copyFileSync(FRONT, path.join(out, 'front.png'));
  fs.copyFileSync(path.join(root, 'shade-rainbow', 'back.png'), path.join(out, 'back-small.png'));

  const res = await page.evaluate(async ({ FRONT, HL, CW, SLEEVE, BIG_MARK_IN, PATTERN }) => {
    const IN = 300, AW = 12 * IN, AH = 16 * IN, INSET = 0.1 * IN;
    const front = await loadImg(FRONT);
    const tag = shadedText('$DAILY BREAD$', 7, HL, CW, 88);
    const putTag = c => c.getContext('2d').drawImage(tag, AW - INSET - tag.width, AH - INSET - tag.height);
    const out = {};
    // BACK PATTERN: tossed stickers, no overlaps (dart throwing on circles), all fully inside the area, the
    // bottom-right corner left clear for the $DAILY BREAD$ tag
    { const R = rng(PATTERN.seed), c = canvas(AW, AH), x = c.getContext('2d'), placed = [];
      const clear = { x0: AW - INSET - tag.width - 0.3 * IN, y0: AH - INSET - tag.height - 0.3 * IN };
      for (let tries = 0; tries < 20000 && placed.length < PATTERN.n; tries++) {
        const h = (PATTERN.min + R() * (PATTERN.max - PATTERN.min)) * IN, w = h * front.width / front.height, rot = (R() - 0.5) * 0.9;
        const r = Math.hypot(w, h) / 2 * 0.86, cx = r + R() * (AW - 2 * r), cy = r + R() * (AH - 2 * r);
        if (cx + r > clear.x0 && cy + r > clear.y0) continue;
        if (placed.some(p => Math.hypot(p.cx - cx, p.cy - cy) < (p.r + r) * 0.82)) continue;
        placed.push({ cx, cy, r, w, h, rot });
      }
      for (const p of placed) { x.save(); x.translate(p.cx, p.cy); x.rotate(p.rot); x.drawImage(front, -p.w / 2, -p.h / 2, p.w, p.h); x.restore(); }
      putTag(c); out.pattern = png(c); out.patternCount = placed.length; }
    // BACK BIG: one big toast on the upper back, top 1 in down, plus the tag
    { const c = canvas(AW, AH), x = c.getContext('2d'), h = BIG_MARK_IN * IN, w = h * front.width / front.height;
      x.imageSmoothingQuality = 'high'; x.drawImage(front, (AW - w) / 2, 1 * IN, w, h); putTag(c); out.big = png(c); out.bigW = +(w / IN).toFixed(2); }
    // SLEEVES: shoulder sticker on top, then the text running down the arm (reads top to bottom)
    for (const [side, t, seed] of [['left', 'DAILY BREAD', 21], ['right', 'COMA TOAST', 22]]) {
      const txt = shadedText(t, SLEEVE.textIn, HL, CW, seed), mark = scaled(front, SLEEVE.markIn);
      const W = Math.max(txt.height, mark.width), H = mark.height + SLEEVE.gapIn * IN + txt.width;
      const c = canvas(W, H), x = c.getContext('2d');
      x.drawImage(mark, (W - mark.width) / 2, 0);
      x.save(); x.translate(W / 2, mark.height + SLEEVE.gapIn * IN); x.rotate(Math.PI / 2); x.drawImage(txt, 0, -txt.height / 2); x.restore();
      out['sleeve-' + side] = png(c); out['sleeve-' + side + '-size'] = [+(W / IN).toFixed(2), +(H / IN).toFixed(2)];
    }
    return out;
  }, { FRONT: 'data:image/png;base64,' + fs.readFileSync(FRONT).toString('base64'), HL, CW, SLEEVE, BIG_MARK_IN, PATTERN });   // as data, so the canvas is not tainted
  save('back-pattern.png', res.pattern); save('back-big.png', res.big);
  save('sleeve-left.png', res['sleeve-left']); save('sleeve-right.png', res['sleeve-right']);
  fs.unlinkSync(tmpPage);
  const frontSize = JSON.parse(fs.readFileSync(path.join(root, 'shade-sizes.json'), 'utf8')).rainbow.front;
  const sizes = { front: frontSize, hoodieFront: { wIn: +(frontSize.wIn * 9 / frontSize.hIn).toFixed(2), hIn: 9 }, backBig: { markWIn: res.bigW, markHIn: BIG_MARK_IN },
    patternStickers: res.patternCount, sleeveLeft: { wIn: res['sleeve-left-size'][0], hIn: res['sleeve-left-size'][1] }, sleeveRight: { wIn: res['sleeve-right-size'][0], hIn: res['sleeve-right-size'][1] } };
  fs.writeFileSync(path.join(out, 'sizes.json'), JSON.stringify(sizes, null, 2) + '\n');

  // MOCKUPS (inches, size L, true scale): long sleeve and hoodie, front (with sleeves) and back
  const PX = 13, f = n => href(path.join(out, n));
  const LS = 'M-3.6,0 L-9.8,1.2 L-12.4,4 L-16.9,26.2 L-13.1,27 L-11,12.5 L-11,30 L11,30 L11,12.5 L13.1,27 L16.9,26.2 L12.4,4 L9.8,1.2 L3.6,0 Q0,Q -3.6,0 Z';
  const HOOD = 'M-4.6,0.6 Q-7.2,-8.6 0,-9.4 Q7.2,-8.6 4.6,0.6 L4.6,4 L-4.6,4 Z';   // runs down behind the neckline
  const POCKET = 'M-6.5,19 L6.5,19 L8.2,26 L-8.2,26 Z';
  const BAND = 'M-11.4,28.6 L11.4,28.6 L11.4,31 L-11.4,31 Z';
  const sleeveImgs = (wL, hL, wR, hR) => {
    // along each sleeve: from the shoulder (about (±11.6, 4.2)) down the arm, about 9.5° off vertical
    const one = (sx, w, h, file, rot) => `<g transform="translate(${sx},4.4) rotate(${rot})"><image href="${f(file)}" x="${-w / 2}" y="0" width="${w}" height="${h}"/></g>`;
    return one(-11.9, wL, hL, 'sleeve-left.png', 9.6) + one(11.9, wR, hR, 'sleeve-right.png', -9.6);
  };
  const shirt = (body, collarQ, inner, extra = '') => `<svg viewBox="-18 -10.5 36 42" width="${36 * PX}" height="${42 * PX}">${extra}<path d="${body.replace('Q0,Q', 'Q0,' + collarQ)}" fill="#17171a"/><path d="M-3.6,0 Q0,${collarQ} 3.6,0" fill="none" stroke="#26262a" stroke-width="0.75"/>${inner}</svg>`;
  const z = sizes.front, hz = sizes.hoodieFront, sl = sizes.sleeveLeft, sr = sizes.sleeveRight;
  const fig = (inner, cap) => `<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333">${inner}<figcaption>${cap}</figcaption></figure>`;
  const cells = [
    fig(shirt(LS, 6, `<image href="${f('front.png')}" x="${-z.wIn / 2}" y="4.5" width="${z.wIn}" height="${z.hIn}"/>` + sleeveImgs(sl.wIn, sl.hIn, sr.wIn, sr.hIn)), `long sleeve · front ${z.wIn} × ${z.hIn} in + sleeves`),
    fig(shirt(LS, 2, `<image href="${f('back-pattern.png')}" x="-6" y="3" width="12" height="16"/>`), 'long sleeve · back: sticker pattern'),
    fig(shirt(LS, 2, `<image href="${f('back-small.png')}" x="-6" y="3" width="12" height="16"/>`), 'long sleeve · back: standard'),
    fig(shirt(LS.replace('L-11,30 L11,30', 'L-11.4,31 L11.4,31'), 6, `<path d="${POCKET}" fill="#1f1f23" stroke="#2b2b30" stroke-width="0.3"/><path d="${BAND}" fill="#1f1f23"/><image href="${f('front.png')}" x="${-hz.wIn / 2}" y="6" width="${hz.wIn}" height="${hz.hIn}"/>` + sleeveImgs(sl.wIn, sl.hIn, sr.wIn, sr.hIn), `<path d="${HOOD}" fill="#202024"/>`), `hoodie · front ${hz.wIn} × ${hz.hIn} in + sleeves`),
    fig(shirt(LS.replace('L-11,30 L11,30', 'L-11.4,31 L11.4,31'), 2, `<path d="${BAND}" fill="#1f1f23"/><image href="${f('back-big.png')}" x="-6" y="4.5" width="12" height="16"/>`, `<path d="${HOOD}" fill="#202024"/>`), 'hoodie · back: big toast'),
    fig(shirt(LS.replace('L-11,30 L11,30', 'L-11.4,31 L11.4,31'), 2, `<path d="${BAND}" fill="#1f1f23"/><image href="${f('back-pattern.png')}" x="-6" y="4.5" width="12" height="16"/>`, `<path d="${HOOD}" fill="#202024"/>`), 'hoodie · back: sticker pattern'),
  ];
  const flats = ['back-pattern.png', 'back-big.png', 'sleeve-left.png', 'sleeve-right.png'].map(n => fig(`<div style="background:#17171a;padding:12px;width:${36 * PX - 24}px;height:${30 * PX}px;display:flex;align-items:center;justify-content:center"><img src="${f(n)}" style="max-width:100%;max-height:100%"></div>`, n));
  const tmp = path.join(out, '_sheet.html');
  fs.writeFileSync(tmp, `<body style="margin:0;padding:10px;background:#ececea;display:grid;grid-template-columns:repeat(3,auto);gap:8px 12px">${cells.join('')}${flats.join('')}</body>`);
  await page.setViewportSize({ width: 3 * (36 * PX + 12) + 30, height: 400 });
  await page.goto(href(tmp)); await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(__dirname, 'products-samples.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log(JSON.stringify(sizes));
})();
