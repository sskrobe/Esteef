// Highlight (Rainbow) back: a MASHUP of all five Coma Toast marks (plain, Saint, Little Devil, Heaven Sent, Raising
// Hell), each shaded in the rainbow three-marker style (rainbow light layer, violet medium and dark shadow layers,
// light from the upper left, bare-paper highlights, rain dashes, cast shadows, pen outlines) as a white-matted
// sticker, then overlapped like a sticker bomb across the whole 12 x 16 in back area, with $DAILY BREAD$ on top at
// the bottom right. Halo marks get the open (cut-through) halo.
// Reuses the marker helpers from shade.js (run shade.js and products.js first).
// Outputs: files/rainbow-products/back-mashup.png and stickers/<mark>.png; mashup-samples.png.
// Run: node tshirts/highlight/mashup.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { logos } = require('../../logos/final/logos');
const { setDpi } = require('../paintshop/printful');

const HL = { pink: '#ff6eb4', orange: '#ffa24a', yellow: '#ffec4a', cyan: '#55dcf0', blue: '#6aa8ff', purple: '#b388ff' };
const ZONES = [['yellow', 'orange'], ['pink', 'orange'], ['orange', 'yellow', 'pink'], ['cyan', 'blue', 'purple']];
const CW = { mid: '#c9b6ff', dark: '#8b6fe0', cast: '#e2dcf5' };
const IDS = ['plain', 'saint', 'little-devil', 'heaven-sent', 'raising-hell'];
const MASH = { n: 30, min: 2.3, max: 4.0, seed: 31 };   // stickers on the back, height range (in)
const INK = '#161616';
const VB = [0, 36, 200, 160];   // room for the wings
const isToast = p => p.shape.includes('scale(0.78)');
const isHalo = p => p.shape.includes('A38,9');
const svg = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB.join(' ')}" width="__W__" height="__H__">${inner}</svg>`;
const crustRe = /<path d="(M62,108[^"]*)"[^>]*\/>/;
const MARKS = IDS.map(id => {
  const m = logos.find(l => l.id === id), toast = m.parts.find(isToast), halo = m.parts.find(isHalo), other = m.parts.filter(p => !isToast(p) && !isHalo(p));
  const fill = ps => svg(ps.map(p => `<g fill="#fff">${p.shape}</g>`).join(''));
  return {
    id, toast: fill([toast]), halo: halo ? fill([halo]) : null, other: other.length ? fill(other) : null,
    haloFull: halo ? svg('<g fill="#fff">' + halo.shape.replace(/fill-rule="evenodd"/g, '') + '</g>') : null,
    crumb: svg(`<g transform="translate(100,130) scale(0.78) translate(-100,-118)"><path d="${toast.detail.match(crustRe)[1]}" fill="#fff"/></g>`),
    face: svg(toast.detail.replace(crustRe, '').replace(/#000/g, '#fff')),
    det: svg(m.parts.map(p => (p.detail || '').replace(/stroke="#000"/g, `stroke="${INK}"`).replace(/stroke-width="([\d.]+)"/g, (s, n) => `stroke-width="${(n * 0.62).toFixed(2)}"`)).join('')),
  };
});

const src = fs.readFileSync(path.join(__dirname, 'shade.js'), 'utf8');
const HELPERS = src.slice(src.indexOf('content: `') + 10, src.indexOf('` });', src.indexOf('content: `')));
const root = path.join(__dirname, 'files'), out = path.join(root, 'rainbow-products'), stickersDir = path.join(out, 'stickers');
const href = p => 'file:///' + p.replace(/\\/g, '/');

(async () => {
  fs.mkdirSync(stickersDir, { recursive: true });
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  await page.setContent('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=block"><body></body>');
  await page.evaluate(async () => { await document.fonts.load('900 100px "Montserrat"', '$DAILY BREAD$'); });
  await page.addScriptTag({ content: HELPERS });

  // 1. each mark as a shaded rainbow sticker (rendered 6 in tall, so it stays sharp at any size on the back)
  const stickers = {};
  for (const m of MARKS) {
    const res = await page.evaluate(async ({ m, VB, HL, ZONES, CW }) => {
      const IN = 300, MH = 6 * IN, MW = MH * VB[2] / VB[3], PM = 0.4 * IN, W = Math.ceil(MW + 2 * PM), H = Math.ceil(MH + 2 * PM), R = rng(m.id.length * 97 + 5);
      const k = MH / (13.2 * IN * 144 / 160) * (144 / 160) * (160 / VB[3]);   // shading distances scaled from the 13.2 in front
      const place = async s => { const c = canvas(W, H); if (!s) return c; const i = await loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s.replace('__W__', MW).replace('__H__', MH))); c.getContext('2d').drawImage(i, PM, PM, MW, MH); return hard(c); };
      const toast = await place(m.toast), halo = await place(m.halo), otherAll = await place(m.other), haloFull = await place(m.haloFull), crumb = await place(m.crumb), face = await place(m.face);
      const other = minus(otherAll, toast);   // horns and wings sit behind the toast
      const sil = or(toast, halo, other);
      const sh = d => [0.62 * d * k * IN, 0.78 * d * k * IN];
      const away = (mm, d) => { const [dx, dy] = sh(d); return minus(mm, shift(mm, -dx, -dy)); };
      const toward = (mm, d) => { const [dx, dy] = sh(d); return minus(mm, shift(mm, dx, dy)); };
      const cast = (mm, d) => { const [dx, dy] = sh(d); return shift(mm, dx, dy); };
      const down = (mm, d) => shift(mm, 0, -d * k * IN);
      const rim = minus(toast, crumb), hole = minus(haloFull, halo);
      const inv = mm => { const c = canvas(W, H), x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.globalCompositeOperation = 'destination-out'; x.drawImage(mm, 0, 0); return c; };
      const holeCut = m.halo ? minus(hole, grow(inv(hole), 0.1 * k * IN)) : canvas(W, H), holeRim = minus(hole, holeCut);
      const highlight = or(and(toward(toast, 0.13), rim), toward(halo, 0.06), toward(other, 0.08));
      const mid = or(away(toast, 0.95), and(toward(crumb, 0.42), crumb), away(halo, 0.16), and(minus(cast(halo, 1.25), halo), toast), and(down(hole, 0.16), halo),
        away(other, 0.4), and(minus(cast(toast, 0.3), toast), other));   // the toast shading the wings / horns behind it
      const dark = or(away(toast, 0.3), and(toward(crumb, 0.13), crumb), and(minus(cast(face, 0.11), face), toast), and(down(hole, 0.055), halo), away(other, 0.12));
      const castOnMatte = minus(cast(sil, 0.32), sil);
      const matte = grow(or(sil, castOnMatte), 0.3 * k * IN);
      const paper = canvas(W, H), p = paper.getContext('2d'); p.drawImage(matte, 0, 0); p.globalCompositeOperation = 'source-in'; p.fillStyle = '#fff'; p.fillRect(0, 0, W, H); p.globalCompositeOperation = 'source-over';
      let y0 = H, y1 = 0; { const d = sil.getContext('2d').getImageData(0, 0, W, H).data; for (let y = 0; y < H; y += 4) for (let x = 0; x < W; x += 4) if (d[(y * W + x) * 4 + 3]) { if (y < y0) y0 = y; if (y > y1) y1 = y; } }
      const zone = (x, y) => { const t = (y - y0) / (y1 - y0) + 0.08 * Math.sin(x / W * 6) + (R() - 0.5) * 0.1; const z = t < 0.17 ? 0 : t < 0.42 ? 1 : t < 0.68 ? 2 : 3; const pal = ZONES[z]; return HL[pal[(R() * pal.length) | 0]]; };
      const w = 0.42 * k * IN;
      layer(paper, minus(sil, highlight), zone, R, -0.62, w);
      layer(paper, castOnMatte, () => CW.cast, R, -0.62, w);
      if (m.halo) layer(paper, and(shift(halo, 0, 0.12 * k * IN), holeRim), () => CW.cast, R, -0.62, w);
      layer(paper, mid, () => CW.mid, R, -0.62, w);
      layer(paper, dark, () => CW.dark, R, -0.62, w * 0.8);
      // pen: the toast outline, the visible part of each topper's outline, a thin offset second pass, the details
      const r = 1.25 * (MH / VB[3]) / 2;
      const lines = or(edge(toast, r), minus(edge(or(halo, otherAll), r), toast));
      p.drawImage(lines, 0, 0); p.globalAlpha = 0.85; p.drawImage(shift(minus(edge(sil, r * 0.45), sil), r * 1.1, -r * 0.8), 0, 0); p.globalAlpha = 1;
      { const i = await loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(m.det.replace('__W__', MW).replace('__H__', MH))); p.drawImage(i, PM, PM, MW, MH); }
      p.globalCompositeOperation = 'destination-out'; p.drawImage(holeCut, 0, 0); p.globalCompositeOperation = 'source-over';
      const art = trim(hard(paper));
      return { png: art.toDataURL('image/png'), w: art.width, h: art.height };
    }, { m, VB, HL, ZONES, CW });
    fs.writeFileSync(path.join(stickersDir, m.id + '.png'), setDpi(Buffer.from(res.png.split(',')[1], 'base64'), true));
    stickers[m.id] = res.png;
  }

  // 2. the mashup: overlapping stickers across the 12 x 16 in back area, biggest first (so smaller ones land on
  //    top), every mark used about equally, all fully inside the area; $DAILY BREAD$ on top at the bottom right
  const back = await page.evaluate(async ({ stickers, IDS, MASH, HL, CW }) => {
    const IN = 300, AW = 12 * IN, AH = 16 * IN, INSET = 0.1 * IN, R = rng(MASH.seed);
    const imgs = {}; for (const id of IDS) imgs[id] = await loadImg(stickers[id]);
    // the $DAILY BREAD$ tag, same as the other backs (text, light / medium / dark layers, cast shadow, matte, pen edge)
    const t = '$DAILY BREAD$', TW = 7 * IN, m = canvas(10, 10).getContext('2d'); m.font = '900 100px "Montserrat"'; const px = 100 * TW / m.measureText(t).width;
    const W = TW + 0.6 * IN, H = px * 1.3 + 0.5 * IN, X = 0.25 * IN, Y = H / 2 + px * 0.36, RT = rng(88);
    const T = canvas(W, H), tx = T.getContext('2d'); tx.font = '900 ' + px + 'px "Montserrat"'; tx.fillStyle = '#fff'; tx.fillText(t, X, Y); hard(T);
    const k = px / 300, sh = d => [0.62 * d * k * 300, 0.78 * d * k * 300], away = (mm, d) => { const [dx, dy] = sh(d); return minus(mm, shift(mm, -dx, -dy)); };
    const castM = minus(shift(T, ...sh(0.07)), T);
    const tag = canvas(W, H), p = tag.getContext('2d'); p.drawImage(grow(or(T, castM), 0.07 * IN), 0, 0); p.globalCompositeOperation = 'source-in'; p.fillStyle = '#fff'; p.fillRect(0, 0, W, H); p.globalCompositeOperation = 'source-over';
    const cols = [HL.pink, HL.orange, HL.yellow, HL.cyan, HL.blue, HL.purple];
    layer(tag, T, x => cols[Math.min(5, (x / W * 6) | 0)], RT, -0.62, px * 0.35); layer(tag, castM, () => CW.cast, RT, -0.62, px * 0.35);
    layer(tag, away(T, 0.1), () => CW.mid, RT, -0.62, px * 0.35); layer(tag, away(T, 0.035), () => CW.dark, RT, -0.62, px * 0.3);
    p.drawImage(edge(T, px * 0.0225), 0, 0);
    const tagT = trim(hard(tag));
    // place stickers
    const sizes = []; for (let i = 0; i < MASH.n; i++) sizes.push(MASH.max - (MASH.max - MASH.min) * i / (MASH.n - 1));
    const placed = [];
    for (let i = 0; i < sizes.length; i++) {
      const id = IDS[i % IDS.length], img = imgs[id], h = sizes[i] * IN, w = h * img.width / img.height, rot = (R() - 0.5) * 0.85;
      const rx = (Math.abs(Math.cos(rot)) * w + Math.abs(Math.sin(rot)) * h) / 2, ry = (Math.abs(Math.sin(rot)) * w + Math.abs(Math.cos(rot)) * h) / 2;
      let best = null;
      for (let tries = 0; tries < 400; tries++) {   // pick the candidate spot farthest from the stickers already placed (spreads them out, still overlapping)
        const cx = rx + R() * (AW - 2 * rx), cy = ry + R() * (AH - 2 * ry);
        const d = placed.length ? Math.min(...placed.map(q => Math.hypot(q.cx - cx, q.cy - cy) - (q.r + Math.min(w, h) / 2) * 0.55)) : 1e9;
        if (!best || d > best.d) best = { cx, cy, d };
      }
      placed.push({ id, cx: best.cx, cy: best.cy, w, h, rot, r: Math.min(w, h) / 2 });
    }
    const c = canvas(AW, AH), x = c.getContext('2d'); x.imageSmoothingQuality = 'high';
    for (const q of placed) { x.save(); x.translate(q.cx, q.cy); x.rotate(q.rot); x.drawImage(imgs[q.id], -q.w / 2, -q.h / 2, q.w, q.h); x.restore(); }
    x.drawImage(tagT, AW - INSET - tagT.width, AH - INSET - tagT.height);
    return { png: c.toDataURL('image/png'), count: placed.length };
  }, { stickers, IDS, MASH, HL, CW });
  fs.writeFileSync(path.join(out, 'back-mashup.png'), setDpi(Buffer.from(back.png.split(',')[1], 'base64'), true));

  // 3. mockups: tee, long sleeve and hoodie backs (black, size L, true scale), plus a close-up of the stickers
  const PX = 13, f = n => href(path.join(out, n));
  const TEE = 'M-3.6,0 L-9.8,1.2 L-15.6,7.6 L-12.6,10.8 L-11,9.3 L-11,30 L11,30 L11,9.3 L12.6,10.8 L15.6,7.6 L9.8,1.2 L3.6,0 Q0,2 -3.6,0 Z';
  const LS = 'M-3.6,0 L-9.8,1.2 L-12.4,4 L-16.9,26.2 L-13.1,27 L-11,12.5 L-11,30 L11,30 L11,12.5 L13.1,27 L16.9,26.2 L12.4,4 L9.8,1.2 L3.6,0 Q0,2 -3.6,0 Z';
  const HOOD = 'M-4.6,0.6 Q-7.2,-8.6 0,-9.4 Q7.2,-8.6 4.6,0.6 L4.6,4 L-4.6,4 Z', BAND = 'M-11.4,28.6 L11.4,28.6 L11.4,31 L-11.4,31 Z';
  const shirt = (body, inner, extra = '', y = 3) => `<svg viewBox="-18 -10.5 36 42" width="${36 * PX}" height="${42 * PX}">${extra}<path d="${body}" fill="#17171a"/><path d="M-3.6,0 Q0,2 3.6,0" fill="none" stroke="#26262a" stroke-width="0.75"/>${inner}<image href="${f('back-mashup.png')}" x="-6" y="${y}" width="12" height="16"/></svg>`;
  const fig = (inner, cap) => `<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333">${inner}<figcaption>${cap}</figcaption></figure>`;
  const cells = [
    fig(shirt(TEE, ''), 'tee · back: mashup'),
    fig(shirt(LS, ''), 'long sleeve · back: mashup'),
    fig(shirt(LS.replace('L-11,30 L11,30', 'L-11.4,31 L11.4,31'), `<path d="${BAND}" fill="#1f1f23"/>`, `<path d="${HOOD}" fill="#202024"/>`, 4.5), 'hoodie · back: mashup'),
    fig(`<div style="background:#17171a;padding:12px;width:${36 * PX - 24}px;height:${42 * PX - 24}px;display:flex;align-items:center;justify-content:center"><img src="${f('back-mashup.png')}" style="max-width:100%;max-height:100%"></div>`, 'back-mashup.png (12 × 16 in)'),
    fig(`<div style="background:#17171a;width:${36 * PX}px;height:${42 * PX}px;overflow:hidden;position:relative"><img src="${f('back-mashup.png')}" style="position:absolute;width:${36 * PX * 2.6}px;left:${-36 * PX * 0.55}px;top:${-36 * PX * 0.4}px"></div>`, 'close-up'),
    fig(`<div style="background:#17171a;padding:12px;width:${36 * PX - 24}px;height:${42 * PX - 24}px;display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:center;justify-items:center">${IDS.map(id => `<img src="${href(path.join(stickersDir, id + '.png'))}" style="max-width:100%;max-height:${42 * PX / 3 - 20}px">`).join('')}</div>`, 'the five stickers'),
  ];
  const tmp = path.join(out, '_sheet.html');
  fs.writeFileSync(tmp, `<body style="margin:0;padding:10px;background:#ececea;display:grid;grid-template-columns:repeat(3,auto);gap:8px 12px">${cells.join('')}</body>`);
  await page.setViewportSize({ width: 3 * (36 * PX + 12) + 30, height: 400 });
  await page.goto(href(tmp)); await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(__dirname, 'mashup-samples.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log(JSON.stringify({ stickers: back.count }));
})();
