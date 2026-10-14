// Highlight back: a MASHUP of all five Coma Toast marks (plain, Saint, Little Devil, Heaven Sent, Raising Hell) as
// shaded marker stickers in MIXED colorways (Blue, Pink, Rainbow, Mint, Lavender, Tangerine: three-marker light /
// medium / dark layers, light from the upper left, bare-paper highlights, rain dashes, cast shadow on a white matte,
// pen outlines, open halos), about 20 of them overlapped across the back, over a BACKGROUND of wide highlighter swipes
// that covers the whole 12 x 16 in area (overlapping diagonal bands, so the crossings make new color bands, plus a few
// crossing accents). To pop off the background, each sticker has a dark edge around its white matte and a soft drop
// shadow. $DAILY BREAD$ on top at the bottom right.
// Reuses the marker helpers from shade.js (run shade.js and products.js first).
// Outputs: files/rainbow-products/back-mashup.png and stickers/<mark>-<colorway>.png; mashup-samples.png.
// Run: node tshirts/highlight/mashup.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { logos } = require('../../logos/final/logos');
const { setDpi } = require('../paintshop/printful');

const HL = { pink: '#ff6eb4', orange: '#ffa24a', yellow: '#ffec4a', cyan: '#55dcf0', blue: '#6aa8ff', purple: '#b388ff' };
const ZONES = [['yellow', 'orange'], ['pink', 'orange'], ['orange', 'yellow', 'pink'], ['cyan', 'blue', 'purple']];
const COLORWAYS = {
  blue: { light: '#bfe3f7', mid: '#74b4e3', dark: '#2f6fb3', cast: '#cfe3f2' },
  pink: { light: '#ffd3e6', mid: '#ff92c0', dark: '#d9467f', cast: '#f6d9e6' },
  rainbow: { rainbow: true, mid: '#c9b6ff', dark: '#8b6fe0', cast: '#e2dcf5' },
  mint: { light: '#c8f5df', mid: '#6fd6a8', dark: '#23926a', cast: '#d6efe3' },
  lavender: { light: '#e3d6ff', mid: '#b294f5', dark: '#6a45c4', cast: '#e6dff5' },
  tangerine: { light: '#ffdcb8', mid: '#ffa45a', dark: '#dc5f16', cast: '#f6e2cf' },
};
const CW = COLORWAYS.rainbow;   // the $DAILY BREAD$ tag
// background: wide highlighter swipes
const BG = { colors: ['#ff4fa3', '#ffe23d', '#ff9a3c', '#3fd8ec', '#a98bff'], w: 1.3, angle: -0.38, seed: 404 };
const IDS = ['plain', 'saint', 'little-devil', 'heaven-sent', 'raising-hell'];
const CWIDS = ['blue', 'pink', 'rainbow', 'mint', 'lavender', 'tangerine'];
// sticker i: mark i mod 5, colorway i mod 6 (so the pairs keep changing)
const PLAN = Array.from({ length: 16 }, (_, i) => ({ id: IDS[i % IDS.length], cw: CWIDS[(i + 2 * Math.floor(i / IDS.length)) % CWIDS.length] }));
const PAIRS = [...new Set(PLAN.map(p => p.id + '|' + p.cw))].map(k => k.split('|'));
const MASH = { n: 16, min: 2.5, max: 3.9, seed: 31 };   // stickers on the back, height range (in)
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

  // 1. each (mark, colorway) pair as a shaded sticker (rendered 5 in tall, so it stays sharp on the back)
  const stickers = {};
  for (const [id, cwid] of PAIRS) {
    const m = MARKS.find(q => q.id === id), CW = COLORWAYS[cwid];
    const res = await page.evaluate(async ({ m, VB, HL, ZONES, CW }) => {
      const IN = 300, MH = 5 * IN, MW = MH * VB[2] / VB[3], PM = 0.4 * IN, W = Math.ceil(MW + 2 * PM), H = Math.ceil(MH + 2 * PM), R = rng(m.id.length * 97 + 5);
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
      layer(paper, minus(sil, highlight), CW.rainbow ? zone : () => CW.light, R, -0.62, w);
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
      hard(paper); p.drawImage(edge(copy(paper), 0.014 * IN * MH / (5 * IN)), 0, 0);   // a dark edge around the matte, so it pops
      const art = trim(hard(paper));
      return { png: art.toDataURL('image/png'), w: art.width, h: art.height };
    }, { m, VB, HL, ZONES, CW });
    fs.writeFileSync(path.join(stickersDir, id + '-' + cwid + '.png'), setDpi(Buffer.from(res.png.split(',')[1], 'base64'), true));
    stickers[id + '|' + cwid] = res.png;
  }

  // 2. the mashup: overlapping stickers across the 12 x 16 in back area, biggest first (so smaller ones land on
  //    top), every mark used about equally, all fully inside the area; $DAILY BREAD$ on top at the bottom right
  const back = await page.evaluate(async ({ stickers, PLAN, MASH, HL, CW, BG }) => {
    const IN = 300, AW = 12 * IN, AH = 16 * IN, INSET = 0.1 * IN, R = rng(MASH.seed);
    const imgs = {}; for (const k of Object.keys(stickers)) imgs[k] = await loadImg(stickers[k]);
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
    hard(tag); p.drawImage(edge(copy(tag), 0.014 * IN), 0, 0);
    const tagT = trim(hard(tag));
    // place stickers
    const sizes = []; for (let i = 0; i < MASH.n; i++) sizes.push(MASH.max - (MASH.max - MASH.min) * i / (MASH.n - 1));
    const placed = [];
    for (let i = 0; i < sizes.length; i++) {
      const id = PLAN[i].id + '|' + PLAN[i].cw, img = imgs[id], h = sizes[i] * IN, w = h * img.width / img.height, rot = (R() - 0.5) * 0.85;
      const rx = (Math.abs(Math.cos(rot)) * w + Math.abs(Math.sin(rot)) * h) / 2, ry = (Math.abs(Math.sin(rot)) * w + Math.abs(Math.cos(rot)) * h) / 2;
      let best = null;
      for (let tries = 0; tries < 400; tries++) {   // pick the candidate spot farthest from the stickers already placed (spreads them out, still overlapping)
        const cx = rx + R() * (AW - 2 * rx), cy = ry + R() * (AH - 2 * ry);
        const d = placed.length ? Math.min(...placed.map(q => Math.hypot(q.cx - cx, q.cy - cy) - (q.r + Math.min(w, h) / 2) * 1.0)) : 1e9;
        if (!best || d > best.d) best = { cx, cy, d };
      }
      placed.push({ id, cx: best.cx, cy: best.cy, w, h, rot, r: Math.min(w, h) / 2 });
    }
    // BACKGROUND: wide highlighter swipes over the whole area. Lanes on one diagonal, closer together than a swipe is
    // wide, so neighbors overlap in darker bands; the swipes are multiplied (ink on paper); small gaps where swipes meet
    // leave rain dashes. Then a few crossing swipes for variance.
    const c = canvas(AW, AH), x = c.getContext('2d'); x.fillStyle = '#ffffff'; x.fillRect(0, 0, AW, AH);
    { const RB = rng(BG.seed), w = BG.w * IN, D = Math.hypot(AW, AH);
      const pass = (ang, gap, keep, alpha, cols) => { const ux = Math.cos(ang), uy = Math.sin(ang), nx = -uy, ny = ux; let last = -1;
        for (let s = -D / 2; s < D / 2; s += w * gap) { let ci; do { ci = (RB() * cols.length) | 0; } while (ci === last && cols.length > 1); last = ci;
          if (RB() > keep) continue; let p = -D / 2 - RB() * w * 3;
          while (p < D / 2) { const l = (3 + RB() * 6) * IN, a = [AW / 2 + nx * s + ux * p, AH / 2 + ny * s + uy * p], b = [a[0] + ux * l, a[1] + uy * l];
            x.save(); x.globalCompositeOperation = 'multiply'; marker(x, a[0], a[1], b[0], b[1], w * (0.92 + RB() * 0.16), cols[RB() < 0.15 ? (RB() * cols.length) | 0 : ci], RB, alpha * (0.85 + RB() * 0.3)); x.restore();
            p += l - w * 0.22; } } };
      pass(BG.angle, 0.64, 1, 0.62, BG.colors);
      pass(BG.angle + 1.25, 1.9, 0.3, 0.36, BG.colors); }
    x.imageSmoothingQuality = 'high';
    // stickers: soft drop shadow first, then the sticker
    const shadowOf = img => { const t = canvas(img.width, img.height), tx = t.getContext('2d'); tx.drawImage(img, 0, 0); tx.globalCompositeOperation = 'source-in'; tx.fillStyle = '#1b1030'; tx.fillRect(0, 0, t.width, t.height); return t; };
    const shadows = {}; for (const k of Object.keys(imgs)) shadows[k] = shadowOf(imgs[k]);
    for (const q of placed) {
      x.save(); x.translate(q.cx + 0.08 * IN, q.cy + 0.12 * IN); x.rotate(q.rot); x.filter = 'blur(' + (0.05 * IN) + 'px)'; x.globalAlpha = 0.55; x.drawImage(shadows[q.id], -q.w / 2, -q.h / 2, q.w, q.h); x.restore();
      x.save(); x.translate(q.cx, q.cy); x.rotate(q.rot); x.drawImage(imgs[q.id], -q.w / 2, -q.h / 2, q.w, q.h); x.restore();
    }
    { const tx0 = AW - INSET - tagT.width, ty0 = AH - INSET - tagT.height, sh = shadowOf(tagT);
      x.save(); x.filter = 'blur(' + (0.04 * IN) + 'px)'; x.globalAlpha = 0.55; x.drawImage(sh, tx0 + 0.06 * IN, ty0 + 0.09 * IN); x.restore();
      x.drawImage(tagT, tx0, ty0); }
    { const d = x.getImageData(0, 0, AW, AH); for (let i = 3; i < d.data.length; i += 4) d.data[i] = 255; x.putImageData(d, 0, 0); }   // fully opaque (DTG)
    return { png: c.toDataURL('image/png'), count: placed.length };
  }, { stickers, PLAN, MASH, HL, CW, BG });
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
    fig(`<div style="background:#17171a;padding:12px;width:${36 * PX - 24}px;height:${42 * PX - 24}px;display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:center;justify-items:center">${PAIRS.slice(0, 6).map(([id, cw]) => `<img src="${href(path.join(stickersDir, id + '-' + cw + '.png'))}" style="max-width:100%;max-height:${42 * PX / 3 - 20}px">`).join('')}</div>`, 'some of the stickers'),
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
