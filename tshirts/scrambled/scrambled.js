// Scrambled: the Little Devil mark (horns, no wings) as an 80s scrambled cable channel. v3. The scramble is the
// BACKGROUND (a swirling field with a big echo of the mark, pushed through a lost-sync pass: sine-wave line shoves,
// hard tearing bands, rolling bands, red / blue channel split, false color drifting in bands of acid green, magenta
// and violet). The Little Devil sits on top, sharp (cream toast, red horns, black face, dark keyline with a red /
// cyan fringe), but the signal still gets to it: thin jitter slices shove parts of it sideways and a few bands
// flip it into false color. The STATIC goes over everything, logo included: grain, snow bands, white dropout
// streaks and dim scan lines. Screen edges fray row by row.
// Versions: "scrambled" (false color) and "static" (black and white with red / cyan fringes, white horns).
// Back: $DAILY BREAD$ (sharp, same treatment) on a small scrambled strip, bottom-right of the 12 x 16 in back area.
// Size and placement: the mark is at the normal logo size (11.5 in tall, like the 12 in tall chest logos) in an
// 11.5 x 12.6 in screen (fits the smallest front print area, XS-M 11.5 x 13.8 in), centered, top of the print 1 in
// below the collar seam (puts the mark where our logo normally sits). Full-color raster (DTG).
// Outputs: files/<scrambled|static>/front.png, back.png; scrambled-samples.png.
// Run: node tshirts/scrambled/scrambled.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { logos } = require('../../logos/final/logos');
const { setDpi } = require('../paintshop/printful');

const VERSIONS = {
  scrambled: { name: 'Scrambled', shirts: ['black', 'white'], fg: { toast: '#fbf6ea', top: '#ff3b4a', face: '#0b0b0b', key: '#0b0b0b' }, maps: [
    [[0, '#040a06'], [0.3, '#0f5a1e'], [0.55, '#3fd13a'], [0.8, '#c8ff3c'], [1, '#fffde0']],   // acid green
    [[0, '#0a0010'], [0.3, '#4b0f6e'], [0.55, '#d0207a'], [0.8, '#ff7ab8'], [1, '#fff0f6']],   // magenta
    [[0, '#03030f'], [0.35, '#1a2a8a'], [0.6, '#7a3cff'], [0.85, '#5ff0ff'], [1, '#ffffff']],  // violet
  ] },
  static: { name: 'Static', shirts: ['black', 'white'], fg: { toast: '#f2f2f2', top: '#ffffff', face: '#0b0b0b', key: '#0b0b0b' }, maps: [
    [[0, '#000000'], [0.5, '#7a7a7a'], [1, '#ffffff']],
  ] },
};
const DPI = 300, ART_W = 11.5 * DPI, ART_H = 12.6 * DPI, MARK_H = 11.5 * DPI, TOP_IN = 1;
const devil = logos.find(l => l.id === 'little-devil');
const VB = '38 44 124 144';
const svg = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" width="__W__" height="__H__">${inner}</svg>`;
const isToast = p => p.shape.includes('scale(0.78)');
const MARK = {
  toast: svg(devil.parts.filter(isToast).map(p => `<g fill="#fff">${p.shape}</g>`).join('')),
  top: svg(devil.parts.filter(p => !isToast(p)).map(p => `<g fill="#fff">${p.shape}</g>`).join('')),
  det: svg(devil.parts.map(p => (p.detail || '').replace(/#000/g, '#fff')).join('')),
};

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  await page.setContent('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=block"><body></body>');
  await page.evaluate(async () => { await document.fonts.load('900 100px "Montserrat"', '$DAILY BREAD$'); });
  await page.addScriptTag({ content: `
    window.loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
    window.canvas = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return c; };
    window.alphaOf = c => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, a = new Uint8Array(c.width * c.height); for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3] > 110 ? 1 : 0; return a; };
    window.dilate = (m, r) => { const c = canvas(m.width, m.height), x = c.getContext('2d'); for (let a = 0; a < 360; a += 10) x.drawImage(m, Math.cos(a * Math.PI / 180) * r, Math.sin(a * Math.PI / 180) * r); x.drawImage(m, 0, 0); return c; };
    window.rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    // gradient map -> 256-entry RGB lookup tables
    window.lut = stops => { const c = canvas(256, 1), x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 256, 0); stops.forEach(([o, col]) => g.addColorStop(o, col)); x.fillStyle = g; x.fillRect(0, 0, 256, 1); return x.getImageData(0, 0, 256, 1).data; };
    // THE SCRAMBLE. L: background luminance field (Float32Array, W x H, 0..1); fg: the sharp foreground canvas
    // (or null). k: scale (1 = full chest). The background gets the lost-sync pass (waves, tears, rolls, chroma
    // split, false color); the foreground sits on top undistorted except for a few thin jitter slices; then the
    // static (grain, snow bands, dropout streaks, scan lines) goes over everything, foreground included.
    window.scramble = (L, W, H, maps, k, seed, fg) => {
      const R = rng(seed), luts = maps.map(lut), out = canvas(W, H), x = out.getContext('2d'), img = x.createImageData(W, H), o = img.data;
      // tearing bands: [y0, y1, offset, slant]; rolling bands: [y0, y1, roll]; snow bands: [y0, y1]
      const tears = [], rolls = [], snow = [], jit = [];
      for (let i = 0; i < 7; i++) { const y0 = R() * H, h = (30 + R() * 160) * k; tears.push([y0, y0 + h, (R() < 0.5 ? -1 : 1) * (60 + R() * 260) * k, (R() - 0.5) * 1.2]); }
      for (let i = 0; i < 2; i++) { const y0 = R() * H, h = (60 + R() * 140) * k; rolls.push([y0, y0 + h, (R() < 0.5 ? -1 : 1) * (80 + R() * 200) * k]); }
      for (let i = 0; i < 7; i++) { const y0 = R() * H, h = (4 + R() * 24) * k; snow.push([y0, y0 + h]); }
      for (let i = 0; i < 10; i++) { const y0 = H * (0.08 + 0.84 * R()), h = (5 + R() * 22) * k; jit.push([y0, y0 + h, (R() < 0.5 ? -1 : 1) * (14 + R() * 40) * k]); }
      const fcb = []; for (let i = 0; i < 3; i++) { const y0 = H * (0.2 + 0.6 * R()), h = (16 + R() * 44) * k; fcb.push([y0, y0 + h, i]); }   // false-color glitch bands on the logo
      const ph = [R() * 6.28, R() * 6.28, R() * 6.28];
      const sample = (sx, sy) => { sx = Math.max(0, Math.min(W - 1, sx | 0)); sy = Math.max(0, Math.min(H - 1, sy | 0)); return L[sy * W + sx]; };
      const CA = 16 * k;   // chroma split
      const edgeJ = new Float32Array(H * 2); let bl = 0, br = 0;
      for (let y = 0; y < H; y++) { if (y % Math.max(2, (6 * k) | 0) === 0) { bl = R(); br = R(); } edgeJ[y * 2] = bl; edgeJ[y * 2 + 1] = br; }
      const F = fg ? fg.getContext('2d').getImageData(0, 0, W, H).data : null;
      for (let y = 0; y < H; y++) {
        let dx = (34 * Math.sin(y * 0.011 / k + ph[0]) + 18 * Math.sin(y * 0.037 / k + ph[1]) + 6 * Math.sin(y * 0.21 / k)) * k, sy = y, tear = 0, jx = 0;
        for (const [a, b, off, sl] of tears) if (y >= a && y < b) { tear = off + sl * (y - a); }
        for (const [a, b, r] of rolls) if (y >= a && y < b) sy = y + r;
        for (const [a, b, j] of jit) if (y >= a && y < b) jx = j | 0;
        let fc = -1; for (const [a, b, m] of fcb) if (y >= a && y < b) fc = m % luts.length;
        dx += tear;
        let isSnow = false; for (const [a, b] of snow) if (y >= a && y < b) isSnow = true;
        const dim = (y % Math.max(3, (6 * k) | 0)) < Math.max(1, (2 * k) | 0) ? 0.74 : 1;   // scan lines
        // frayed screen edges, pushed by the tear
        const pad = 90 * k, l = pad * (0.15 + 0.5 * edgeJ[y * 2]) + Math.max(0, tear) * 0.5, r = W - pad * (0.15 + 0.5 * edgeJ[y * 2 + 1]) + Math.min(0, tear) * 0.5;
        for (let xx = 0; xx < W; xx++) {
          const i = (y * W + xx) * 4;
          let rr, gg, bb, on = !(xx < l || xx > r);
          const fx = xx - jx, fi = (y * W + fx) * 4;
          if (F && fx >= 0 && fx < W && F[fi + 3] > 110) { rr = F[fi]; gg = F[fi + 1]; bb = F[fi + 2]; on = true;
            if (fc >= 0) { const v = Math.min(255, ((rr + gg + bb) / 3) | 0) * 4; rr = luts[fc][v]; gg = luts[fc][v + 1]; bb = luts[fc][v + 2]; } }
          else {
            if (!on) { o[i + 3] = 0; continue; }
            const wv = 22 * k * Math.sin(xx * 0.006 / k + y * 0.017 / k + ph[2]);
            const sx = xx - dx - wv;
            // map choice drifts in bands
            const t = (sy * 0.0009 / k + 0.12 * Math.sin(xx * 0.0025 / k + ph[1]) + 10) * luts.length, m0 = Math.floor(t) % luts.length, m1 = (m0 + 1) % luts.length;
            let f = t - Math.floor(t); f = f < 0.8 ? 0 : (f - 0.8) / 0.2;
            const lr = sample(sx + CA, sy), lg = sample(sx, sy), lb = sample(sx - CA, sy);
            const ch = (l0, c) => { const v = Math.max(0, Math.min(255, (l0 * 255) | 0)) * 4; return luts[m0][v + c] * (1 - f) + luts[m1][v + c] * f; };
            rr = ch(lr, 0); gg = ch(lg, 1); bb = ch(lb, 2);
          }
          // static over everything
          const n = R();
          if (isSnow) { const s = n * 255; rr = rr * 0.25 + s * 0.75; gg = gg * 0.25 + s * 0.75; bb = bb * 0.25 + s * 0.75; }
          else { const g = (n - 0.5) * 84; rr += g; gg += g; bb += g; if (n > 0.99965) { rr = gg = bb = 255; } }
          o[i] = rr * dim; o[i + 1] = gg * dim; o[i + 2] = bb * dim; o[i + 3] = 255;
        }
      }
      // dropout streaks: short white horizontal dashes, over everything
      for (let s = 0; s < 170; s++) { const yy = (R() * H) | 0, x0 = (R() * W) | 0, len = (20 + R() * 220) * k, th = Math.max(2, (2 + R() * 3) * k) | 0;
        for (let y = yy; y < Math.min(H, yy + th); y++) for (let xx = x0; xx < Math.min(W, x0 + len); xx++) { const i = (y * W + xx) * 4; if (o[i + 3]) { o[i] = o[i + 1] = o[i + 2] = 240; } } }
      x.putImageData(img, 0, 0); return out;
    };
    // sharp foreground: red / cyan fringe, dark keyline, then the fills (layers: [canvas mask, color])
    window.foreground = (W, H, sil, layers, key, fringe, k) => {
      const c = canvas(W, H), x = c.getContext('2d'), keyC = dilate(sil, W * 0.011 * k);
      const t = (m, col) => { const z = canvas(W, H), zx = z.getContext('2d'); zx.drawImage(m, 0, 0); zx.globalCompositeOperation = 'source-in'; zx.fillStyle = col; zx.fillRect(0, 0, W, H); return z; };
      x.drawImage(t(keyC, '#ff2a3d'), -fringe, 0); x.drawImage(t(keyC, '#00c8ff'), fringe, 0);
      x.drawImage(t(keyC, key), 0, 0);
      for (const [m, col] of layers) x.drawImage(t(m, col), 0, 0);
      return c;
    };
  ` });

  const root = path.join(__dirname, 'files'), sizes = {};
  for (const [vid, v] of Object.entries(VERSIONS)) {
    const res = await page.evaluate(async ({ v, MARK, ART_W, ART_H, MARK_H }) => {
      const W = ART_W, H = ART_H;
      // the Little Devil, sharp, in the foreground, at the normal logo size
      const mh = MARK_H, mw = mh * 124 / 144, X = (W - mw) / 2, Y = (H - mh) / 2;
      const lay = async (s, sc = 1) => { const i = await loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s.replace('__W__', mw * sc).replace('__H__', mh * sc))); const c = canvas(W, H); c.getContext('2d').drawImage(i, (W - mw * sc) / 2, (H - mh * sc) / 2, mw * sc, mh * sc); return c; };
      const tC = await lay(MARK.toast), hC = await lay(MARK.top), dC = await lay(MARK.det);
      const sil = canvas(W, H); sil.getContext('2d').drawImage(tC, 0, 0); sil.getContext('2d').drawImage(hC, 0, 0);
      const fg = foreground(W, H, sil, [[hC, v.fg.top], [dilate(tC, W * 0.006), v.fg.key], [tC, v.fg.toast], [dC, v.fg.face]], v.fg.key, W * 0.006, 1);   // horns behind the toast, keyline between
      // the background: a swirling field with a big scrambled echo of the mark in it
      const eT = alphaOf(await lay(MARK.toast, 1.12)), eH = alphaOf(await lay(MARK.top, 1.12));
      const L = new Float32Array(W * H);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = y * W + x;
        let l = 0.34 + 0.2 * Math.sin(x * 0.0042 + 1.3 * Math.sin(y * 0.0031)) * Math.cos(y * 0.0055 + x * 0.0012) + 0.1 * Math.sin((x + y) * 0.011);
        if (eT[i] || eH[i]) l += 0.24;
        L[i] = l;
      }
      const out = scramble(L, W, H, v.maps, 1, 1986, fg);
      return { png: out.toDataURL('image/png'), w: W, h: H };
    }, { v, MARK, ART_W, ART_H, MARK_H });
    const out = path.join(root, vid); fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'front.png'), setDpi(Buffer.from(res.png.split(',')[1], 'base64'), true));

    // BACK: $DAILY BREAD$ as a small scrambled strip, bottom-right of the 12 x 16 in back area
    const back = await page.evaluate(({ v, DPI }) => {
      const AREA_W = 12 * DPI, AREA_H = 16 * DPI, INSET = 0.1 * DPI, W = Math.round(7.2 * DPI), H = Math.round(1.25 * DPI), t = '$DAILY BREAD$';
      const c = canvas(W, H), x = c.getContext('2d'); x.font = '900 100px "Montserrat"';
      const px = 100 * (W * 0.84) / x.measureText(t).width; x.font = `900 ${px}px "Montserrat"`; x.fillStyle = '#fff'; x.textAlign = 'center'; x.fillText(t, W / 2, H / 2 + px * 0.36);
      const fg = foreground(W, H, c, [[c, v.fg.toast]], v.fg.key, W * 0.0025, 0.35);
      const L = new Float32Array(W * H);
      for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) L[y * W + i] = 0.36 + 0.2 * Math.sin(i * 0.012 + Math.sin(y * 0.04) * 2) * Math.cos(y * 0.03 + i * 0.002);
      const art = scramble(L, W, H, v.maps, 0.35, 86, fg), f = canvas(AREA_W, AREA_H);
      f.getContext('2d').drawImage(art, AREA_W - INSET - W, AREA_H - INSET - H);
      return { png: f.toDataURL('image/png'), w: W, h: H };
    }, { v, DPI });
    fs.writeFileSync(path.join(out, 'back.png'), setDpi(Buffer.from(back.png.split(',')[1], 'base64'), true));
    sizes[vid] = { front: { wIn: +(res.w / DPI).toFixed(2), hIn: +(res.h / DPI).toFixed(2) }, back: { wIn: +(back.w / DPI).toFixed(2), hIn: +(back.h / DPI).toFixed(2) } };
  }
  fs.writeFileSync(path.join(root, 'sizes.json'), JSON.stringify(sizes, null, 2) + '\n');

  // Sheet: each version, front and back, on each shirt (size L, true scale), plus a close-up of the front.
  const PX = 13, href = p => 'file:///' + p.replace(/\\/g, '/');
  const TEE = 'M-3.6,0 L-9.8,1.2 L-15.6,7.6 L-12.6,10.8 L-11,9.3 L-11,30 L11,30 L11,9.3 L12.6,10.8 L15.6,7.6 L9.8,1.2 L3.6,0 Q0,6 -3.6,0 Z';
  const SH = { black: ['#17171a', '#26262a'], white: ['#f7f7f5', '#e4e4e2'] };
  const cells = [];
  for (const [vid, v] of Object.entries(VERSIONS)) for (const sn of v.shirts) {
    const z = sizes[vid].front, [c, collar] = SH[sn];
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE}" fill="${c}"/><path d="M-3.6,0 Q0,6 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, vid, 'front.png'))}" x="${-z.wIn / 2}" y="${3 + TOP_IN}" width="${z.wIn}" height="${z.hIn}"/></svg><figcaption>${v.name} on ${sn} · front · ${z.wIn} × ${z.hIn} in</figcaption></figure>`);
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE.replace('Q0,6', 'Q0,2')}" fill="${c}"/><path d="M-3.6,0 Q0,2 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, vid, 'back.png'))}" x="-6" y="3" width="12" height="16"/></svg><figcaption>back</figcaption></figure>`);
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><div style="background:${c};padding:14px;width:${33 * PX - 28}px;height:${33.5 * PX - 28}px;display:flex;align-items:center;justify-content:center"><img src="${href(path.join(root, vid, 'front.png'))}" style="max-width:100%;max-height:100%"></div><figcaption>close-up</figcaption></figure>`);
  }
  const tmp = path.join(root, '_sheet.html');
  fs.writeFileSync(tmp, `<body style="margin:0;padding:10px;background:#ececea;display:grid;grid-template-columns:repeat(3,auto);gap:8px 12px">${cells.join('')}</body>`);
  await page.setViewportSize({ width: 3 * (33 * PX + 12) + 30, height: 400 });
  await page.goto(href(tmp)); await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(__dirname, 'scrambled-samples.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log(JSON.stringify(sizes));
})();
