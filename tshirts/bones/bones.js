// Bones: the Saint mark (main halo logo) built entirely out of little dog bones.
//   - the toast's outline: bones laid end to end along the edge (keeps the shape crisp)
//   - the face (X eyes, Soft Pulse mouth) and the inner crust line: bones laid along each stroke
//   - the halo: a ring of bones
//   - the fill: bones at random angles, packed without touching (dart throwing with capsule collisions)
// Versions: dark (bone white, red face, gold halo), light (black, red face, gold halo), brand (hot pink, white
// face, lime halo; dark shirts). Back: $DAILY BREAD$ filled with tiny bones, bottom-right of the 12 x 16 in back
// area (standing back print). Size and placement: chest standard (10.5 x 12 in box, top 1.5 in below collar).
// Outputs: files/<version>/front.png, back.png; bones-samples.png.
// Run: node tshirts/bones/bones.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { logos } = require('../../logos/final/logos');
const { setDpi } = require('../paintshop/printful');

const VERSIONS = {
  dark: { name: 'Dark shirts', body: '#efe6d2', face: '#ff3b4a', halo: '#f2c230', shirts: ['black'] },
  light: { name: 'Light shirts', body: '#111111', face: '#e3262f', halo: '#d4a017', shirts: ['white'] },
  brand: { name: 'Brand (dark shirts)', body: '#ff2e88', face: '#ffffff', halo: '#c6ff00', shirts: ['black'] },
};
const DPI = 300, BOX_W = 10.5 * DPI, BOX_H = 12 * DPI;
const saint = logos.find(l => l.id === 'saint');
// Bone size in drawing units (the toast is about 116 units wide, so about 17 bones across).
const BONE = { L: 6.8, r: 0.85, knob: 1.2, gap: 0.55 };

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  await page.setContent('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=block"><body></body>');
  await page.evaluate(async () => { await document.fonts.load('900 100px "Montserrat"', '$DAILY BREAD$'); });
  const toast = saint.parts.find(p => !p.shape.includes('A38,9')), halo = saint.parts.find(p => p.shape.includes('A38,9'));

  // 1. Lay out the bones once, in drawing units: [{ x, y, a, kind }] (kind: line | outline | halo | fill).
  const bones = await page.evaluate(({ toastShape, toastDetail, haloShape, B }) => {
    let seed = 17; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const host = document.createElement('div');
    host.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><g id="t">${toastShape}</g><g id="d">${toastDetail}</g><g id="h">${haloShape}</g></svg>`;
    document.body.appendChild(host);
    const toastPath = host.querySelector('#t path'), haloPath = host.querySelector('#h path');
    const placed = [];
    const segDist = (p1, p2, q1, q2) => {   // distance between two segments
      const d = (a, b, c) => { const vx = b[0] - a[0], vy = b[1] - a[1], wx = c[0] - a[0], wy = c[1] - a[1], t = Math.max(0, Math.min(1, (vx * wx + vy * wy) / (vx * vx + vy * vy || 1))); return Math.hypot(c[0] - a[0] - t * vx, c[1] - a[1] - t * vy); };
      const cross = (a, b, c, e) => { const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])); return o(a, b, c) !== o(a, b, e) && o(c, e, a) !== o(c, e, b); };
      return cross(p1, p2, q1, q2) ? 0 : Math.min(d(p1, p2, q1), d(p1, p2, q2), d(q1, q2, p1), d(q1, q2, p2));
    };
    const ends = (x, y, a, L) => { const h = L / 2 - B.knob * 0.6, c = Math.cos(a), s = Math.sin(a); return [[x - c * h, y - s * h], [x + c * h, y + s * h]]; };
    const R = B.knob * 1.15;   // collision radius around the bone's core segment
    const fits = (x, y, a, L, gap) => { const [p, q] = ends(x, y, a, L);
      for (const o of placed) { if (Math.hypot(o.x - x, o.y - y) > (L + o.L) / 2 + 2 * R + gap) continue; const [p2, q2] = ends(o.x, o.y, o.a, o.L); if (segDist(p, q, p2, q2) < 2 * R + gap) return false; }
      return true; };
    const add = (x, y, a, kind, L = B.L, force = false) => { if (force || fits(x, y, a, L, B.gap)) { placed.push({ x, y, a, kind, L }); return true; } return false; };
    // points along a path element, in root units, with the tangent angle; skips jumps between subpaths
    const along = (el, step) => { const n = Math.floor(el.getTotalLength() / step), m = el.getCTM(), pts = [];
      for (let i = 0; i <= n; i++) { const p = el.getPointAtLength(i * step + step / 2 > el.getTotalLength() ? el.getTotalLength() : i * step + step / 2); const P = new DOMPoint(p.x, p.y).matrixTransform(m); pts.push([P.x, P.y]); }
      return pts; };
    const tangentPlace = (el, kind, step, L) => { const n = el.getTotalLength(), m = el.getCTM();
      for (let s = step / 2; s < n; s += step) {
        const p0 = new DOMPoint(el.getPointAtLength(Math.max(0, s - 0.6)).x, el.getPointAtLength(Math.max(0, s - 0.6)).y).matrixTransform(m);
        const p1 = new DOMPoint(el.getPointAtLength(Math.min(n, s + 0.6)).x, el.getPointAtLength(Math.min(n, s + 0.6)).y).matrixTransform(m);
        if (Math.hypot(p1.x - p0.x, p1.y - p0.y) > 2.5) continue;   // a jump between subpaths
        const pm = new DOMPoint(el.getPointAtLength(s).x, el.getPointAtLength(s).y).matrixTransform(m);
        add(pm.x, pm.y, Math.atan2(p1.y - p0.y, p1.x - p0.x), kind, L, true);
      } };
    // face lines (eyes, mouth) and the inner crust line: bones along the stroke, a little shorter on the eyes
    for (const el of host.querySelectorAll('#d path')) {
      const d = el.getAttribute('d'), isCrust = d.startsWith('M62,108');
      tangentPlace(el, isCrust ? 'crust' : 'line', (isCrust ? B.L : B.L * 0.82) + 0.6, isCrust ? B.L : B.L * 0.82);
    }
    // the toast outline: bones along the edge, nudged inward by the bone's half width
    { const el = toastPath, n = el.getTotalLength(), m = el.getCTM(), step = B.L + 0.4, inv = m.inverse();
      const inside = (x, y) => { const q = new DOMPoint(x, y).matrixTransform(inv); return el.isPointInFill(new DOMPoint(q.x, q.y)); };
      for (let s = step / 2; s < n; s += step) {
        const a0 = new DOMPoint(el.getPointAtLength(Math.max(0, s - 0.6)).x, el.getPointAtLength(Math.max(0, s - 0.6)).y).matrixTransform(m);
        const a1 = new DOMPoint(el.getPointAtLength(Math.min(n, s + 0.6)).x, el.getPointAtLength(Math.min(n, s + 0.6)).y).matrixTransform(m);
        const pm = new DOMPoint(el.getPointAtLength(s).x, el.getPointAtLength(s).y).matrixTransform(m);
        const a = Math.atan2(a1.y - a0.y, a1.x - a0.x); let nx = -Math.sin(a), ny = Math.cos(a);
        if (!inside(pm.x + nx * 2, pm.y + ny * 2)) { nx = -nx; ny = -ny; }
        add(pm.x + nx * B.knob, pm.y + ny * B.knob, a, 'outline', B.L, true);
      } }
    // the halo: one ring of bones along the middle of the ring
    { const b = haloPath.getBBox(), m = haloPath.getCTM(), c = new DOMPoint(b.x + b.width / 2, b.y + b.height / 2).matrixTransform(m);
      const rx = b.width / 2 * (1 + 28 / 38) / 2, ry = b.height / 2 * (1 + 4.5 / 9) / 2, per = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
      const n = Math.round(per / (B.L * 0.9)); for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2, x = c.x + rx * Math.cos(t), y = c.y + ry * Math.sin(t); add(x, y, Math.atan2(ry * Math.cos(t), -rx * Math.sin(t)), 'halo', B.L * 0.9, true); } }
    // the fill: random bones inside the toast, all of the bone inside the shape, none touching
    { const el = toastPath, inv = el.getCTM().inverse(), b = el.getBBox(), m = el.getCTM();
      const p0 = new DOMPoint(b.x, b.y).matrixTransform(m), p1 = new DOMPoint(b.x + b.width, b.y + b.height).matrixTransform(m);
      const inside = (x, y) => { const q = new DOMPoint(x, y).matrixTransform(inv); return el.isPointInFill(new DOMPoint(q.x, q.y)); };
      for (let i = 0; i < 26000; i++) {
        const x = p0.x + rnd() * (p1.x - p0.x), y = p0.y + rnd() * (p1.y - p0.y), a = rnd() * Math.PI;
        const c = Math.cos(a), s = Math.sin(a), h = B.L / 2 + 0.6;
        if (![[0, 0], [h, 0], [-h, 0], [h, 1.6], [-h, 1.6], [h, -1.6], [-h, -1.6]].every(([u, v]) => inside(x + c * u - s * v, y + s * u + c * v))) continue;
        add(x, y, a, 'fill');
      } }
    host.remove();
    return placed;
  }, { toastShape: toast.shape, toastDetail: toast.detail, haloShape: halo.shape, B: BONE });

  // 2. Draw the bones for each version, crop, fit the chest box; back: $DAILY BREAD$ filled with tiny bones.
  const root = path.join(__dirname, 'files'), sizes = {};
  for (const [vid, v] of Object.entries(VERSIONS)) {
    const res = await page.evaluate(({ bones, v, B, BOX_W, BOX_H, DPI }) => {
      const drawBone = (x, b, k, color) => { x.save(); x.translate(b.x * k, b.y * k); x.rotate(b.a); x.fillStyle = color;
        const L = b.L * k, r = B.r * k, kn = B.knob * k, hx = L / 2 - kn;
        x.fillRect(-hx, -r, 2 * hx, 2 * r);
        for (const sx of [-1, 1]) for (const sy of [-1, 1]) { x.beginPath(); x.arc(sx * hx, sy * kn * 0.62, kn, 0, Math.PI * 2); x.fill(); }
        x.restore(); };
      const col = b => (b.kind === 'line' ? v.face : b.kind === 'halo' ? v.halo : v.body);
      const k = 30, c = document.createElement('canvas'); c.width = c.height = 200 * k; const x = c.getContext('2d');
      bones.forEach(b => drawBone(x, b, k, col(b)));
      // trim and fit
      const W = c.width, d = x.getImageData(0, 0, W, W).data; let x0 = W, y0 = W, x1 = 0, y1 = 0;
      for (let y = 0; y < W; y += 2) for (let i = 0; i < W; i += 2) if (d[(y * W + i) * 4 + 3] > 8) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      const w = x1 - x0 + 3, h = y1 - y0 + 3, f = Math.min(BOX_W / w, BOX_H / h), o = document.createElement('canvas');
      o.width = Math.round(w * f); o.height = Math.round(h * f);
      const ox = o.getContext('2d'); ox.scale(f, f); ox.translate(-x0 + 1, -y0 + 1); bones.forEach(b => drawBone(ox, b, k, col(b)));
      // BACK: tiny bones packed inside $DAILY BREAD$ (words in the body color, dollar signs in the halo color)
      const AREA_W = 12 * DPI, AREA_H = 16 * DPI, INSET = 0.1 * DPI, TW = 7 * DPI, t = '$DAILY BREAD$';
      const tc = document.createElement('canvas'), tx = tc.getContext('2d'); tx.font = '900 100px "Montserrat"';
      const px = 100 * TW / tx.measureText(t).width; tc.width = Math.ceil(TW + 40); tc.height = Math.ceil(px * 1.2); tx.font = `900 ${px}px "Montserrat"`;
      tx.fillStyle = '#000'; tx.fillText(t, 20, px * 0.95);
      const dollarW = tx.measureText('$').width, mask = tx.getImageData(0, 0, tc.width, tc.height).data;
      const inT = (X, Y) => { X = Math.round(X); Y = Math.round(Y); return X >= 0 && Y >= 0 && X < tc.width && Y < tc.height && mask[(Y * tc.width + X) * 4 + 3] > 128; };
      const bL = px * 0.11, bk = bL / B.L, bb = [], art = document.createElement('canvas'); art.width = tc.width; art.height = tc.height;
      const ax = art.getContext('2d'); let s = 5; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
      const grid = new Map(), cell = bL, key = (i, j) => i + ',' + j;
      for (let n = 0; n < 90000; n++) {
        const X = rnd() * tc.width, Y = rnd() * tc.height, a = rnd() * Math.PI, cs = Math.cos(a), sn = Math.sin(a), hh = bL / 2;
        if (![[0, 0], [hh, 0], [-hh, 0], [hh, bk * 1.4], [-hh, -bk * 1.4], [hh, -bk * 1.4], [-hh, bk * 1.4]].every(([u, w2]) => inT(X + cs * u - sn * w2, Y + sn * u + cs * w2))) continue;
        const gi = Math.floor(X / cell), gj = Math.floor(Y / cell); let ok = true;
        for (let di = -1; di <= 1 && ok; di++) for (let dj = -1; dj <= 1 && ok; dj++) for (const o of grid.get(key(gi + di, gj + dj)) || []) if (Math.hypot(o.X - X, o.Y - Y) < bL * 0.62) { ok = false; break; }
        if (!ok) continue;
        const o = { X, Y, a }; bb.push(o); const kk = key(gi, gj); grid.set(kk, [...(grid.get(kk) || []), o]);
      }
      const dollarRight = 20 + dollarW, dollarLeft = tc.width - 20 - dollarW;
      bb.forEach(o => drawBone(ax, { x: o.X / bk, y: o.Y / bk, a: o.a, L: B.L }, bk, (o.X < dollarRight || o.X > dollarLeft) ? v.halo : v.body));
      const ad = ax.getImageData(0, 0, art.width, art.height).data; let u0 = art.width, v0 = art.height, u1 = 0, v1 = 0;
      for (let y = 0; y < art.height; y++) for (let i = 0; i < art.width; i++) if (ad[(y * art.width + i) * 4 + 3] > 8) { if (i < u0) u0 = i; if (i > u1) u1 = i; if (y < v0) v0 = y; if (y > v1) v1 = y; }
      const bw = u1 - u0 + 1, bh = v1 - v0 + 1, back = document.createElement('canvas'); back.width = AREA_W; back.height = AREA_H;
      back.getContext('2d').drawImage(art, u0, v0, bw, bh, AREA_W - INSET - bw, AREA_H - INSET - bh, bw, bh);
      return { png: o.toDataURL('image/png'), w: o.width, h: o.height, back: back.toDataURL('image/png'), bw, bh, count: bones.length, backCount: bb.length };
    }, { bones, v, B: BONE, BOX_W, BOX_H, DPI });
    const out = path.join(root, vid); fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'front.png'), setDpi(Buffer.from(res.png.split(',')[1], 'base64'), true));
    fs.writeFileSync(path.join(out, 'back.png'), setDpi(Buffer.from(res.back.split(',')[1], 'base64'), true));
    sizes[vid] = { bones: res.count, backBones: res.backCount, front: { wIn: +(res.w / DPI).toFixed(2), hIn: +(res.h / DPI).toFixed(2) }, back: { wIn: +(res.bw / DPI).toFixed(2), hIn: +(res.bh / DPI).toFixed(2) } };
  }
  fs.writeFileSync(path.join(root, 'sizes.json'), JSON.stringify(sizes, null, 2) + '\n');

  // 3. Sheet: each version on its shirt, front and back, plus a close-up.
  const PX = 13, href = p => 'file:///' + p.replace(/\\/g, '/');
  const TEE = 'M-3.6,0 L-9.8,1.2 L-15.6,7.6 L-12.6,10.8 L-11,9.3 L-11,30 L11,30 L11,9.3 L12.6,10.8 L15.6,7.6 L9.8,1.2 L3.6,0 Q0,6 -3.6,0 Z';
  const SH = { black: ['#17171a', '#26262a'], white: ['#f7f7f5', '#e4e4e2'] };
  const cells = [];
  for (const [vid, v] of Object.entries(VERSIONS)) for (const sn of v.shirts) {
    const z = sizes[vid].front, [c, collar] = SH[sn];
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE}" fill="${c}"/><path d="M-3.6,0 Q0,6 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, vid, 'front.png'))}" x="${-z.wIn / 2}" y="4.5" width="${z.wIn}" height="${z.hIn}"/></svg><figcaption>${v.name} · front · ${z.wIn} × ${z.hIn} in</figcaption></figure>`);
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE.replace('Q0,6', 'Q0,2')}" fill="${c}"/><path d="M-3.6,0 Q0,2 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, vid, 'back.png'))}" x="-6" y="3" width="12" height="16"/></svg><figcaption>back</figcaption></figure>`);
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><div style="background:${c};padding:14px;width:${33 * PX - 28}px;height:${33.5 * PX - 28}px;display:flex;align-items:center;justify-content:center"><img src="${href(path.join(root, vid, 'front.png'))}" style="max-width:100%;max-height:100%"></div><figcaption>close-up</figcaption></figure>`);
  }
  const tmp = path.join(root, '_sheet.html');
  fs.writeFileSync(tmp, `<body style="margin:0;padding:10px;background:#ececea;display:grid;grid-template-columns:repeat(3,auto);gap:8px 12px">${cells.join('')}</body>`);
  await page.setViewportSize({ width: 3 * (33 * PX + 12) + 30, height: 400 });
  await page.goto(href(tmp)); await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(__dirname, 'bones-samples.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log(JSON.stringify(sizes));
})();
