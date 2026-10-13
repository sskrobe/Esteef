// Blurry: double-vision line art. The Saint mark (toast + halo) drawn as line art twice, slightly off
// register (shifted and turned a little), like eyes that won't focus. Where the two copies cross, a third
// overlap color shows (like misregistered print). Styles: "single" (one line) or "double" (every line is a
// pair of thin parallel lines, which doubles the doubling). No semi-transparency (DTG-safe).
// Back: $DAILY BREAD$ in Montserrat ExtraBold line art with the same doubling, bottom-right of the 12 x 16 in
// back print area (the standing $Daily Bread$ back print).
// Size and placement (go-forward chest standard, Bella+Canvas 3001): art fits a 10.5 x 12 in box, centered,
// top 1.5 in below the collar seam.
// Outputs: files/<colorway>-<style>/front.png, back.png; blurry-samples.png.
// Run: node tshirts/blurry/blurry.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { logos } = require('../../logos/final/logos');
const { setDpi } = require('../paintshop/printful');

const COLORWAYS = {
  anaglyph: { name: 'Anaglyph', a: '#ff2d55', b: '#00d1ff', both: '#4b2bd6', shirts: ['black', 'white'] },
  brand: { name: 'Brand', a: '#ff2e88', b: '#c6ff00', both: '#ffffff', shirts: ['black', 'white'] },
  'mono-dark': { name: 'Mono (dark shirts)', a: '#ffffff', b: '#7a7a7a', both: '#ffffff', shirts: ['black'] },
  'mono-light': { name: 'Mono (light shirts)', a: '#111111', b: '#9a9a9a', both: '#111111', shirts: ['white'] },
};
const STYLES = {
  single: { w: 3.6 },              // line width (drawing units)
  double: { w: 5.6, cut: 2.2 },    // outer width, and the gap cut down its middle (two lines of 1.7)
};
// The ghost copy: shifted right and up, turned a touch, about the toast's center.
const GHOST = { dx: 6.5, dy: -2.5, rot: -1.6, cx: 100, cy: 128 };
const DPI = 300, BOX_W = 10.5 * DPI, BOX_H = 12 * DPI;
const saint = logos.find(l => l.id === 'saint');
const isHalo = p => p.shape.includes('A38,9');
const SCALE_IN_TOAST = 0.78;   // the toast and its face are drawn inside a 0.78 scale

// Line art of the mark in white (used as a mask), with every line the same width on the page.
function lineArt(w) {
  return saint.parts.map(p => {
    const sw = isHalo(p) ? w : w / SCALE_IN_TOAST;
    const shape = `<g fill="none" stroke="#fff" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round">${p.shape.replace(/fill-rule="evenodd"/g, '')}</g>`;
    const detail = (p.detail || '').replace(/stroke="#000"/g, 'stroke="#fff"').replace(/stroke-width="[\d.]+"/g, `stroke-width="${sw}"`);
    return shape + detail;
  }).join('');
}
const svgOf = (inner, size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 20 180 180" width="${size}" height="${size}">${inner}</svg>`;

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  await page.setContent('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800&family=Rubik+Mono+One&display=block"><body></body>');
  await page.evaluate(async () => { await document.fonts.load('800 100px "Montserrat"', '$DAILY BREAD$'); await document.fonts.load('100px "Rubik Mono One"', 'DAILYBREAD'); });
  const root = path.join(__dirname, 'files');
  const sizes = {};

  // Shared in-page helpers: build a white line mask (single or double), then composite two copies.
  await page.addScriptTag({ content: `
    window.loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
    window.compose = (maskA, maskB, col) => {
      // maskA, maskB: canvases with white lines. Output: B in col.b, A in col.a on top, overlap in col.both.
      const W = maskA.width, H = maskA.height, out = document.createElement('canvas'); out.width = W; out.height = H;
      const tint = (m, color) => { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.drawImage(m, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, W, H); return c; };
      const o = out.getContext('2d');
      o.drawImage(tint(maskB, col.b), 0, 0);
      o.drawImage(tint(maskA, col.a), 0, 0);
      const both = tint(maskA, col.both), bx = both.getContext('2d'); bx.globalCompositeOperation = 'destination-in'; bx.drawImage(maskB, 0, 0);
      o.drawImage(both, 0, 0);
      return out;
    };
    window.trim = c => { const W = c.width, H = c.height, d = c.getContext('2d').getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = 0, y1 = 0;
      for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) if (d[(y * W + i) * 4 + 3] > 8) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      const t = document.createElement('canvas'); t.width = x1 - x0 + 1; t.height = y1 - y0 + 1; t.getContext('2d').drawImage(c, -x0, -y0); return t; };
  ` });

  for (const [cw, col] of Object.entries(COLORWAYS)) for (const [st, s] of Object.entries(STYLES)) {
    const id = `${cw}-${st}`, out = path.join(root, id);
    fs.mkdirSync(out, { recursive: true });
    const N = 3600;
    const outer = svgOf(lineArt(s.w), N), inner = s.cut ? svgOf(lineArt(s.cut), N) : null;
    // FRONT
    const front = await page.evaluate(async ({ outer, inner, col, G, N, BOX_W, BOX_H }) => {
      const url = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
      const io = await loadImg(url(outer)), ii = inner ? await loadImg(url(inner)) : null;
      const k = N / 180;   // px per drawing unit
      const mask = ghost => {
        const c = document.createElement('canvas'); c.width = c.height = N; const x = c.getContext('2d');
        if (ghost) { x.translate((G.cx - 10) * k, (G.cy - 20) * k); x.rotate(G.rot * Math.PI / 180); x.translate(-(G.cx - 10) * k + G.dx * k, -(G.cy - 20) * k + G.dy * k); }
        x.drawImage(io, 0, 0);
        if (ii) { x.globalCompositeOperation = 'destination-out'; x.drawImage(ii, 0, 0); }
        return c;
      };
      const art = trim(compose(mask(false), mask(true), col));
      const f = Math.min(BOX_W / art.width, BOX_H / art.height), o = document.createElement('canvas');
      o.width = Math.round(art.width * f); o.height = Math.round(art.height * f);
      const ox = o.getContext('2d'); ox.imageSmoothingQuality = 'high'; ox.drawImage(art, 0, 0, o.width, o.height);
      return { png: o.toDataURL('image/png'), w: o.width, h: o.height };
    }, { outer, inner, col, G: GHOST, N, BOX_W, BOX_H });
    fs.writeFileSync(path.join(out, 'front.png'), setDpi(Buffer.from(front.png.split(',')[1], 'base64'), true));
    // BACK: $DAILY BREAD$ line art, doubled the same way (offset scaled to the lettering)
    const back = await page.evaluate(({ col, s, G, DPI }) => {
      const AREA_W = 12 * DPI, AREA_H = 16 * DPI, INSET = 0.1 * DPI, TEXT_W = 7 * DPI;
      const text = '$DAILY BREAD$', font = px => `800 ${px}px "Montserrat"`;
      const m = document.createElement('canvas').getContext('2d'); m.font = font(100);
      const px = 100 * TEXT_W / m.measureText(text).width;
      const u = px / 60;   // one "drawing unit" for the lettering, so lines and offsets match the front's look
      const W = Math.ceil(TEXT_W + 40 * u), H = Math.ceil(px * 1.3 + 40 * u);
      const mask = ghost => {
        const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
        if (ghost) { x.translate(W / 2, H / 2); x.rotate(G.rot * Math.PI / 180 * 0.5); x.translate(-W / 2 + G.dx * u, -H / 2 + G.dy * u); }
        x.font = font(px); x.textBaseline = 'alphabetic'; x.lineJoin = 'round'; x.strokeStyle = '#fff';
        const bx = 20 * u, by = 20 * u + px * 0.95;
        x.lineWidth = s.w * u; x.strokeText(text, bx, by);
        if (s.cut) { x.globalCompositeOperation = 'destination-out'; x.lineWidth = s.cut * u; x.strokeText(text, bx, by); }
        return c;
      };
      const art = trim(compose(mask(false), mask(true), col));
      const f = document.createElement('canvas'); f.width = AREA_W; f.height = AREA_H;
      f.getContext('2d').drawImage(art, AREA_W - INSET - art.width, AREA_H - INSET - art.height);
      return { png: f.toDataURL('image/png'), w: art.width, h: art.height };
    }, { col, s, G: GHOST, DPI });
    fs.writeFileSync(path.join(out, 'back.png'), setDpi(Buffer.from(back.png.split(',')[1], 'base64'), true));
    // LARGE BACK (Blurry's back print): DAILY over BREAD in Rubik Mono One (a monospaced block face, so the two
    // five-letter words make a perfectly justified block), line art with the same doubling, about 11.4 in wide,
    // centered across the upper back with its top 1 in below the top of the 12 x 16 in back print area.
    const large = await page.evaluate(({ col, s, G, DPI }) => {
      const AREA_W = 12 * DPI, AREA_H = 16 * DPI, BLOCK_W = 11.4 * DPI, TOP = 1.0 * DPI;
      const font = px => `${px}px "Rubik Mono One"`, words = ['DAILY', 'BREAD'];
      const m = document.createElement('canvas').getContext('2d'); m.font = font(100);
      const ink = t => { const v = m.measureText(t); return { w: v.actualBoundingBoxLeft + v.actualBoundingBoxRight, l: v.actualBoundingBoxLeft, a: v.actualBoundingBoxAscent }; };
      const wMax = Math.max(...words.map(t => ink(t).w));
      const px = 100 * BLOCK_W * 0.94 / wMax;          // leave room for the line and the ghost
      const cap = ink('D').a * px / 100, gap = cap * 0.22;
      const u = px / 60;                                 // drawing unit for lines and offsets (matches the front's look)
      const W = Math.ceil(BLOCK_W + 30 * u), H = Math.ceil(cap * 2 + gap + 30 * u);
      const mask = ghost => {
        const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
        if (ghost) { x.translate(W / 2, H / 2); x.rotate(G.rot * Math.PI / 180 * 0.5); x.translate(-W / 2 + G.dx * u, -H / 2 + G.dy * u); }
        x.font = font(px); x.textBaseline = 'alphabetic'; x.textAlign = 'center'; x.lineJoin = 'round'; x.strokeStyle = '#fff';
        const ys = [15 * u + cap, 15 * u + cap * 2 + gap];
        x.lineWidth = s.w * u; words.forEach((t, i) => x.strokeText(t, W / 2, ys[i]));
        if (s.cut) { x.globalCompositeOperation = 'destination-out'; x.lineWidth = s.cut * u; words.forEach((t, i) => x.strokeText(t, W / 2, ys[i])); }
        return c;
      };
      let art = trim(compose(mask(false), mask(true), col));
      if (art.width > BLOCK_W) { const f = BLOCK_W / art.width, r = document.createElement('canvas'); r.width = BLOCK_W; r.height = Math.round(art.height * f); r.getContext('2d').drawImage(art, 0, 0, r.width, r.height); art = r; }
      const f = document.createElement('canvas'); f.width = AREA_W; f.height = AREA_H;
      f.getContext('2d').drawImage(art, (AREA_W - art.width) / 2, TOP);
      return { png: f.toDataURL('image/png'), w: art.width, h: art.height };
    }, { col, s, G: GHOST, DPI });
    fs.writeFileSync(path.join(out, 'back-large.png'), setDpi(Buffer.from(large.png.split(',')[1], 'base64'), true));
    sizes[id] = { front: { wIn: +(front.w / DPI).toFixed(2), hIn: +(front.h / DPI).toFixed(2) }, back: { wIn: +(back.w / DPI).toFixed(2), hIn: +(back.h / DPI).toFixed(2) },
      backLarge: { wIn: +(large.w / DPI).toFixed(2), hIn: +(large.h / DPI).toFixed(2) } };
  }
  fs.writeFileSync(path.join(root, 'sizes.json'), JSON.stringify(sizes, null, 2) + '\n');

  // Sheet: each colorway x style, front and back, on the shirt colors it suits (size L tee, true scale).
  const PX = 11, href = p => 'file:///' + p.replace(/\\/g, '/');
  const TEE = 'M-3.6,0 L-9.8,1.2 L-15.6,7.6 L-12.6,10.8 L-11,9.3 L-11,30 L11,30 L11,9.3 L12.6,10.8 L15.6,7.6 L9.8,1.2 L3.6,0 Q0,6 -3.6,0 Z';
  const SH = { black: ['#17171a', '#26262a'], white: ['#f7f7f5', '#e4e4e2'] };
  const cells = [];
  for (const [cw, col] of Object.entries(COLORWAYS)) for (const st of Object.keys(STYLES)) for (const sn of col.shirts) {
    const id = `${cw}-${st}`, z = sizes[id].front, [c, collar] = SH[sn];
    cells.push(`<figure style="margin:0;text-align:center;font:600 12px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE}" fill="${c}"/><path d="M-3.6,0 Q0,6 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, id, 'front.png'))}" x="${-z.wIn / 2}" y="4.5" width="${z.wIn}" height="${z.hIn}"/></svg><figcaption>${col.name} · ${st} · ${sn}</figcaption></figure>`);
    cells.push(`<figure style="margin:0;text-align:center;font:600 12px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE.replace('Q0,6', 'Q0,2')}" fill="${c}"/><path d="M-3.6,0 Q0,2 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, id, 'back-large.png'))}" x="-6" y="3" width="12" height="16"/></svg><figcaption>back</figcaption></figure>`);
  }
  const tmp = path.join(root, '_sheet.html');
  fs.writeFileSync(tmp, `<body style="margin:0;padding:10px;background:#ececea;display:grid;grid-template-columns:repeat(6,auto);gap:6px 8px">${cells.join('')}</body>`);
  await page.setViewportSize({ width: 6 * (33 * PX + 8) + 30, height: 400 });
  await page.goto(href(tmp)); await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(__dirname, 'blurry-samples.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log(JSON.stringify(sizes));
})();
