// Highlight: the Saint mark (halo logo), large in the normal chest spot, filled with layered HIGHLIGHTER strokes
// (after a pen-and-highlighter eye drawing): chisel-tip swipes in pink, orange, yellow, cyan, blue and purple, laid
// in three passes at different angles so they overlap and darken where they cross (multiply, like real ink on
// paper), spilling loosely past the outline. On top: black fine-liner pen line art (a sketchy double outline, the
// inner crust line, X eyes and Soft Pulse mouth) and a few clusters of pen hatching.
// The highlighter is composited on white (like paper), so the patch prints the same on light and dark shirts; the
// shirt shows only where no stroke lands. Solid colors, no partial transparency (DTG).
// Back: $DAILY BREAD$ outlined in pen over a few highlighter swipes, bottom-right of the 12 x 16 in back area.
// Size and placement (chest standard, Bella+Canvas 3001): fits a 10.5 x 12 in box, centered, top 1.5 in below
// the collar seam.
// Outputs: files/front.png, back.png; highlight-samples.png.
// Run: node tshirts/highlight/highlight.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { logos } = require('../../logos/final/logos');
const { setDpi } = require('../paintshop/printful');

const DPI = 300, BOX_W = 10.5 * DPI, BOX_H = 12 * DPI;
const INK = '#161616';
const HL = { pink: '#ff6eb4', orange: '#ffa24a', yellow: '#ffec4a', cyan: '#55dcf0', blue: '#6aa8ff', purple: '#b388ff' };
// color zones top to bottom (halo, crust, face, bottom)
const ZONES = [['yellow', 'orange'], ['pink', 'purple', 'orange'], ['orange', 'yellow', 'pink'], ['cyan', 'blue', 'purple']];
const saint = logos.find(l => l.id === 'saint');
const isToast = p => p.shape.includes('scale(0.78)');
const VB = '30 36 140 160';   // a little room around the mark for the overflow
const svg = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" width="__W__" height="__H__">${inner}</svg>`;
// the halo's open center: the halo filled solid, minus the ring
const HALO_FULL = svg(saint.parts.filter(p => !isToast(p)).map(p => '<g fill="#fff">' + p.shape.replace(/fill-rule="evenodd"/g, '') + '</g>').join(''));
const SIL = svg(saint.parts.map(p => `<g fill="#fff">${p.shape}</g>`).join(''));
const outline = (w, extra = '') => saint.parts.map(p => `<g fill="none" stroke="${INK}" stroke-width="${isToast(p) ? w / 0.78 : w}" stroke-linejoin="round" ${extra}>${p.shape.replace(/fill-rule="evenodd"/g, '')}</g>`).join('');
const DETAIL = saint.parts.map(p => (p.detail || '').replace(/stroke="#000"/g, `stroke="${INK}"`).replace(/stroke-width="([\d.]+)"/g, (m, n) => `stroke-width="${(n * 0.62).toFixed(2)}"`)).join('');
// pen: main outline, a second offset pass (sketchy double line), and the details
const PEN = svg(outline(1.25) + `<g transform="translate(0.7,-0.5) rotate(0.5 100 120)">${outline(0.6)}</g>` + DETAIL);

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  await page.setContent('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=block"><body></body>');
  await page.evaluate(async () => { await document.fonts.load('900 100px "Montserrat"', '$DAILY BREAD$'); });
  await page.addScriptTag({ content: `
    window.loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
    window.canvas = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return c; };
    window.rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    window.hard = c => { const x = c.getContext('2d'), d = x.getImageData(0, 0, c.width, c.height); for (let i = 3; i < d.data.length; i += 4) d.data[i] = d.data[i] > 100 ? 255 : 0; x.putImageData(d, 0, 0); return c; };
    window.trim = c => { const W = c.width, H = c.height, d = c.getContext('2d').getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = 0, y1 = 0;
      for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) if (d[(y * W + i) * 4 + 3] > 8) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      const t = canvas(x1 - x0 + 1, y1 - y0 + 1); t.getContext('2d').drawImage(c, -x0, -y0); return t; };
    // one chisel-tip highlighter stroke from (x0,y0) to (x1,y1), width w: slanted ends, a slight bow, ink pooling
    // at both ends and faint streaks along it. Colors go on with multiply (ink on paper); the mask gets the shape.
    window.hlStroke = (cx, mx, x0, y0, x1, y1, w, col, R) => {
      const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
      const sl = w * 0.35, bow = (R() - 0.5) * w * 0.8;
      const P = (t, s) => [x0 + ux * t + nx * s + nx * bow * 4 * (t / L) * (1 - t / L), y0 + uy * t + ny * s + ny * bow * 4 * (t / L) * (1 - t / L)];
      const shape = x => { x.beginPath(); const N = 16;
        for (let i = 0; i <= N; i++) { const [a, b] = P(sl + (L - sl) * i / N, -w / 2); i ? x.lineTo(a, b) : x.moveTo(a, b); }
        for (let i = N; i >= 0; i--) { const [a, b] = P((L - sl) * i / N, w / 2); x.lineTo(a, b); }
        x.closePath(); };
      cx.save(); cx.globalCompositeOperation = 'multiply'; cx.globalAlpha = 0.44 + R() * 0.1; cx.fillStyle = col; shape(cx); cx.fill();
      // ink pooling at the ends
      cx.save(); shape(cx); cx.clip(); cx.globalAlpha = 0.28; cx.lineWidth = w * 0.13; cx.strokeStyle = col;
      for (const t of [w * 0.1, L - w * 0.1]) { const [a, b] = P(t, -w); const [c2, d2] = P(t - sl * 0.9, w); cx.beginPath(); cx.moveTo(a, b); cx.lineTo(c2, d2); cx.stroke(); }
      cx.restore();
      // faint lighter streaks along the stroke
      cx.globalCompositeOperation = 'source-over'; cx.globalAlpha = 0.16; cx.strokeStyle = '#ffffff'; cx.lineWidth = Math.max(2, w * 0.035);
      cx.save(); shape(cx); cx.clip();
      for (let k = 0; k < 4; k++) { const s = (R() - 0.5) * w * 0.85; cx.beginPath(); for (let i = 0; i <= 12; i++) { const [a, b] = P(L * i / 12, s); i ? cx.lineTo(a, b) : cx.moveTo(a, b); } cx.stroke(); }
      cx.restore(); cx.restore();
      mx.fillStyle = '#fff'; shape(mx); mx.fill();
    };
  ` });

  const root = path.join(__dirname, 'files'); fs.mkdirSync(root, { recursive: true });
  const res = await page.evaluate(async ({ SIL, PEN, HALO_FULL, HL, ZONES, BOX_W, BOX_H }) => {
    const MH = 13.2 * 300, MW = MH * 140 / 160;   // drawn big, then fitted to the 10.5 x 12 in box
    const W = Math.ceil(MW), H = Math.ceil(MH), R = rng(1219);
    const img = async s => loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s.replace('__W__', W).replace('__H__', H)));
    const sil = canvas(W, H); sil.getContext('2d').drawImage(await img(SIL), 0, 0, W, H);
    const sd = sil.getContext('2d').getImageData(0, 0, W, H).data, inside = (x, y) => x >= 0 && y >= 0 && x < W && y < H && sd[((y | 0) * W + (x | 0)) * 4 + 3] > 100;
    // silhouette bounds
    let y0 = H, y1 = 0, x0 = W, x1 = 0; for (let y = 0; y < H; y += 4) for (let x = 0; x < W; x += 4) if (inside(x, y)) { if (y < y0) y0 = y; if (y > y1) y1 = y; if (x < x0) x0 = x; if (x > x1) x1 = x; }
    const near = (x, y, r) => { for (let a = 0; a < 6.28; a += 0.8) if (inside(x + Math.cos(a) * r, y + Math.sin(a) * r)) return true; return inside(x, y); };
    const zoneCol = (x, y) => { let t = (y - y0) / (y1 - y0) + 0.1 * Math.sin((x - x0) / (x1 - x0) * 5.5 + 1.3) + (R() - 0.5) * 0.12;
      let z = t < 0.17 ? 0 : t < 0.42 ? 1 : t < 0.68 ? 2 : 3; if (R() < 0.18) z = Math.max(0, Math.min(3, z + (R() < 0.5 ? -1 : 1)));
      const pal = ZONES[z]; return HL[pal[(R() * pal.length) | 0]]; };
    const col = canvas(W, H), cx = col.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, W, H);
    const mask = canvas(W, H), mx = mask.getContext('2d');
    mx.drawImage(sil, 0, 0);   // white paper under the whole mark, so no shirt shows inside the outline
    const w = 0.44 * 300, M = 0.12 * 300;   // stroke width; how far the shape is grown before strokes are fitted to it
    // passes of parallel lanes. Each lane is cut into runs where it crosses the (slightly grown) mark; each run gets
    // a stroke from edge to edge with a little overshoot, sometimes split in two colors. Pass 1 covers everything
    // on one diagonal; pass 2 lays partial strokes at another angle; pass 3 adds a few accents.
    const passes = [[-0.55, 1, 1], [0.38, 0.45, 0.55], [-1.2, 0.18, 0.4]];   // [angle, keep, share of the run]
    for (const [ang0, keep, share] of passes) {
      const ang = ang0 + (R() - 0.5) * 0.08, ux = Math.cos(ang), uy = Math.sin(ang), nx = -uy, ny = ux, D = Math.hypot(W, H), cX = W / 2, cY = H / 2;
      for (let s = -D / 2; s < D / 2; s += w * (0.78 + R() * 0.1)) {
        const runs = []; let a = null;
        for (let t = -D / 2; t <= D / 2; t += 8) {
          const on = near(cX + nx * s + ux * t, cY + ny * s + uy * t, M);
          if (on && a === null) a = t; if (!on && a !== null) { runs.push([a, t]); a = null; }
        }
        for (let [ta, tb] of runs) {
          if (tb - ta < w * 0.15 || R() > keep) continue;
          if (share < 1) { const l = (tb - ta) * share * (0.6 + R() * 0.8), st = ta + R() * Math.max(0, tb - ta - l); ta = st; tb = st + l; }
          ta -= R() * 0.18 * 300; tb += R() * 0.18 * 300;   // overshoot
          const pieces = (share === 1 && tb - ta > 3 * 300 && R() < 0.6) ? 2 : 1;
          for (let k = 0; k < pieces; k++) {
            const p0 = pieces === 1 ? ta : k === 0 ? ta : ta + (tb - ta) * (0.4 + R() * 0.2) - w * 0.3;
            const p1 = pieces === 1 ? tb : k === 0 ? ta + (tb - ta) * (0.45 + R() * 0.2) + w * 0.3 : tb;
            const j = (R() - 0.5) * w * 0.15, X0 = cX + nx * (s + j) + ux * p0, Y0 = cY + ny * (s + j) + uy * p0, X1 = cX + nx * (s + j) + ux * p1, Y1 = cY + ny * (s + j) + uy * p1;
            hlStroke(cx, mx, X0, Y0, X1, Y1, w * (0.92 + R() * 0.16), zoneCol((X0 + X1) / 2, (Y0 + Y1) / 2), R);
          }
        }
      }
    }
    // make sure the whole silhouette is covered (fill any holes with a final light pass)
    const md = mx.getImageData(0, 0, W, H).data;
    for (let y = y0; y < y1; y += w * 0.7) for (let x = x0; x < x1; x += w * 0.7) {
      if (inside(x, y) && md[((y | 0) * W + (x | 0)) * 4 + 3] < 100) { const a = -0.62 + (R() - 0.5) * 0.3, l = (0.5 + R() * 0.6) * 300; hlStroke(cx, mx, x - Math.cos(a) * l / 2, y - Math.sin(a) * l / 2, x + Math.cos(a) * l / 2, y + Math.sin(a) * l / 2, w, zoneCol(x, y), R); }
    }
    hard(mask);
    const out = canvas(W, H), o = out.getContext('2d');
    o.drawImage(mask, 0, 0); o.globalCompositeOperation = 'source-in'; o.drawImage(col, 0, 0); o.globalCompositeOperation = 'source-over';
    // pen hatching: short parallel strokes in a few spots, clipped to the toast
    o.save(); { const c2 = canvas(W, H), x2 = c2.getContext('2d'); x2.strokeStyle = '#161616'; x2.lineCap = 'round';
      const spots = [[0.73, 0.82, 1.0], [0.22, 0.5, -1.0], [0.6, 0.27, 1.0], [0.3, 0.86, -1.0]];
      for (const [fx, fy, dir] of spots) { const X = x0 + (x1 - x0) * fx, Y = y0 + (y1 - y0) * fy;
        for (let i = 0; i < 9; i++) { const l = (0.22 + R() * 0.16) * 300, px = X + i * 0.075 * 300 * dir, py = Y + (R() - 0.5) * 20, a = -1.05 * dir;
          x2.lineWidth = 6 + R() * 3; x2.beginPath(); x2.moveTo(px, py); x2.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x2.stroke(); } }
      x2.globalCompositeOperation = 'destination-in'; x2.drawImage(sil, 0, 0); o.drawImage(c2, 0, 0); }
    o.restore();
    // clear the halo's open center (strokes stay out of the hole)
    { const hole = canvas(W, H), hx = hole.getContext('2d'); hx.drawImage(await img(HALO_FULL), 0, 0, W, H); hx.globalCompositeOperation = 'destination-out'; hx.drawImage(sil, 0, 0);
      o.globalCompositeOperation = 'destination-out'; o.drawImage(hole, 0, 0); o.globalCompositeOperation = 'source-over'; }
    // pen line art on top
    o.drawImage(await img(PEN), 0, 0, W, H);
    const art = trim(out), f = Math.min(BOX_W / art.width, BOX_H / art.height), r = canvas(Math.round(art.width * f), Math.round(art.height * f));
    const rx = r.getContext('2d'); rx.imageSmoothingQuality = 'high'; rx.drawImage(art, 0, 0, r.width, r.height); hard(r);
    return { png: r.toDataURL('image/png'), w: r.width, h: r.height };
  }, { SIL, PEN, HALO_FULL, HL, ZONES, BOX_W, BOX_H });
  fs.writeFileSync(path.join(root, 'front.png'), setDpi(Buffer.from(res.png.split(',')[1], 'base64'), true));

  // BACK: $DAILY BREAD$ outlined in pen over a few highlighter swipes, bottom-right of the 12 x 16 in back area
  const back = await page.evaluate(({ HL, DPI }) => {
    const AREA_W = 12 * DPI, AREA_H = 16 * DPI, INSET = 0.1 * DPI, TW = 7 * DPI, t = '$DAILY BREAD$', R = rng(77);
    const m = canvas(10, 10).getContext('2d'); m.font = '900 100px "Montserrat"'; const px = 100 * TW / m.measureText(t).width;
    const W = TW + 0.6 * DPI, H = px * 1.25 + 0.4 * DPI;
    const col = canvas(W, H), cx = col.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, W, H);
    const mask = canvas(W, H), mx = mask.getContext('2d'), w = px * 0.5;
    const cols = [HL.pink, HL.orange, HL.yellow, HL.cyan, HL.blue, HL.purple];
    for (let i = 0; i < 6; i++) { const yy = H * (0.3 + 0.4 * R()), xs = W * (i / 6) - w, xe = xs + W * (0.25 + R() * 0.15);
      hlStroke(cx, mx, xs, yy + (R() - 0.5) * w * 0.4, xe, yy + (R() - 0.5) * w * 0.4, w * (0.9 + R() * 0.3), cols[i], R); }
    hard(mask);
    const o = canvas(W, H), ox = o.getContext('2d'); ox.drawImage(mask, 0, 0); ox.globalCompositeOperation = 'source-in'; ox.drawImage(col, 0, 0); ox.globalCompositeOperation = 'source-over';
    ox.font = '900 ' + px + 'px "Montserrat"'; ox.lineJoin = 'round'; ox.fillStyle = '#ffffff'; ox.fillText(t, 0.3 * DPI, H / 2 + px * 0.36);   // paper-white letters ox.strokeStyle = '#161616'; ox.lineWidth = px * 0.06;
    ox.strokeText(t, 0.3 * DPI, H / 2 + px * 0.36);
    ox.lineWidth = px * 0.025; ox.strokeText(t, 0.3 * DPI + px * 0.03, H / 2 + px * 0.36 - px * 0.02);
    const art = trim(hard(o)), f = canvas(AREA_W, AREA_H);
    f.getContext('2d').drawImage(art, AREA_W - INSET - art.width, AREA_H - INSET - art.height);
    return { png: f.toDataURL('image/png'), w: art.width, h: art.height };
  }, { HL, DPI });
  fs.writeFileSync(path.join(root, 'back.png'), setDpi(Buffer.from(back.png.split(',')[1], 'base64'), true));
  const sizes = { front: { wIn: +(res.w / DPI).toFixed(2), hIn: +(res.h / DPI).toFixed(2) }, back: { wIn: +(back.w / DPI).toFixed(2), hIn: +(back.h / DPI).toFixed(2) } };
  fs.writeFileSync(path.join(root, 'sizes.json'), JSON.stringify(sizes, null, 2) + '\n');

  // Sheet: front and back on white, black and heather shirts (size L, true scale), plus a close-up.
  const PX = 13, href = p => 'file:///' + p.replace(/\\/g, '/');
  const TEE = 'M-3.6,0 L-9.8,1.2 L-15.6,7.6 L-12.6,10.8 L-11,9.3 L-11,30 L11,30 L11,9.3 L12.6,10.8 L15.6,7.6 L9.8,1.2 L3.6,0 Q0,6 -3.6,0 Z';
  const SH = { white: ['#f7f7f5', '#e4e4e2'], black: ['#17171a', '#26262a'], 'athletic heather': ['#c9c9c9', '#b5b5b5'] };
  const cells = [], z = sizes.front;
  for (const [sn, [c, collar]] of Object.entries(SH)) {
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE}" fill="${c}"/><path d="M-3.6,0 Q0,6 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, 'front.png'))}" x="${-z.wIn / 2}" y="4.5" width="${z.wIn}" height="${z.hIn}"/></svg><figcaption>${sn} · front · ${z.wIn} × ${z.hIn} in</figcaption></figure>`);
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE.replace('Q0,6', 'Q0,2')}" fill="${c}"/><path d="M-3.6,0 Q0,2 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, 'back.png'))}" x="-6" y="3" width="12" height="16"/></svg><figcaption>back</figcaption></figure>`);
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><div style="background:${c};padding:14px;width:${33 * PX - 28}px;height:${33.5 * PX - 28}px;display:flex;align-items:center;justify-content:center"><img src="${href(path.join(root, 'front.png'))}" style="max-width:100%;max-height:100%"></div><figcaption>close-up</figcaption></figure>`);
  }
  const tmp = path.join(root, '_sheet.html');
  fs.writeFileSync(tmp, `<body style="margin:0;padding:10px;background:#ececea;display:grid;grid-template-columns:repeat(3,auto);gap:8px 12px">${cells.join('')}</body>`);
  await page.setViewportSize({ width: 3 * (33 * PX + 12) + 30, height: 400 });
  await page.goto(href(tmp)); await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(__dirname, 'highlight-samples.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log(JSON.stringify(sizes));
})();
