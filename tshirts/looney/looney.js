// Looney: the Saint mark (toast + halo) as a flat cartoon character over a classic cartoon bullseye of
// concentric rings (inspired by old cartoon end cards and a Psycho Bunny ring tee). No borrowed text or
// characters, just the ring motif. The gaps between rings are transparent, so the shirt color shows.
// Front: the character in a flat fill with a thick black cartoon outline and black face, halo on top.
// Back: $Daily Bread$ in a cartoon font with a black outline and two offset "echo" shadows in ring colors,
// in the bottom-right corner of the 12 x 16 in back print area (the standing $Daily Bread$ back print).
// Size and placement (go-forward chest standard, Bella+Canvas 3001): the art fits a 10.5 x 12 in box,
// centered, top 1.5 in below the collar seam.
// Outputs in files/<colorway>/: front.png (trimmed, 300 dpi, transparent), front.svg, back.png (12 x 16 in
// area), and looney-samples.png (mockups).
// Run: node tshirts/looney/looney.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { logos } = require('../../logos/final/logos');
const { setDpi } = require('../paintshop/printful');

const INK = '#111111';
const COLORWAYS = {
  neon: { name: 'Neon', toast: '#00e5ff', halo: '#ffe600', center: null,
    rings: ['#ffe600', '#c6ff00', '#ff8a00', '#ff2e88', '#b04dff', '#2f6bff', '#ff2e88'] },
  classic: { name: 'Classic', toast: '#f7c26b', halo: '#ffe14d', center: '#173a8c',
    rings: ['#e3262f', '#ffb400', '#e3262f', '#ffb400', '#e3262f', '#ffb400', '#e3262f'] },
  brand: { name: 'Brand (Hot Wire)', toast: '#f4f4f2', halo: '#c6ff00', center: null,
    rings: ['#c6ff00', '#ff2e88', '#c6ff00', '#ff2e88', '#c6ff00', '#ff2e88', '#c6ff00'] },
};
const DPI = 300, BOX_W = 10.5 * DPI, BOX_H = 12 * DPI;
const CX = 100, CY = 122;                       // ring center (drawing units), behind the toast
const R0 = 44, RING = 7.6, GAP = 3.6, N = 7;     // innermost ring radius, ring width, gap, ring count
const OUTLINE = 7.5;                             // black cartoon outline (stroke width before CHAR_SCALE)
// The character is drawn big over the rings, like the reference: the toast fills most of the bullseye and
// the halo reaches toward the outer rings.
const CHAR_SCALE = 1.3, CHAR_T = `translate(${CX} 126) scale(${CHAR_SCALE}) translate(${-CX} -126)`;
const saint = logos.find(l => l.id === 'saint');
const kind = p => (p.shape.includes('A38,9') ? 'halo' : 'toast');

function frontSvg(cw, size = 1000) {
  const c = COLORWAYS[cw];
  // rings: centered stroked circles, inner to outer
  const rings = c.rings.slice(0, N).map((col, i) => {
    const r = R0 + i * (RING + GAP) + RING / 2;
    return `<circle cx="${CX}" cy="${CY}" r="${r}" fill="none" stroke="${col}" stroke-width="${RING}"/>`;
  }).join('');
  const center = c.center ? `<circle cx="${CX}" cy="${CY}" r="${R0 - GAP}" fill="${c.center}"/>` : '';
  // character: black outline behind everything, then flat fills, then the black face details
  const outline = saint.parts.map(p => `<g fill="${INK}" stroke="${INK}" stroke-width="${OUTLINE}" stroke-linejoin="round">${p.shape}</g>`).join('');
  const fills = saint.parts.map(p => `<g fill="${kind(p) === 'halo' ? c.halo : c.toast}" stroke="none">${p.shape}</g>`).join('');
  const details = saint.parts.map(p => (p.detail || '').replace(/#000/g, INK)).join('');
  const R = R0 + N * (RING + GAP);
  const vb = [CX - R - 4, CY - R - 4, 2 * R + 8, 2 * R + 8];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" width="${size}" height="${size}"><title>Coma Toast Saint, Looney (${c.name})</title>${center}${rings}<g transform="${CHAR_T}">${outline}${fills}${details}</g></svg>`;
}

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  const root = path.join(__dirname, 'files');
  const sizes = {};
  for (const cw of Object.keys(COLORWAYS)) {
    const out = path.join(root, cw);
    fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'front.svg'), frontSvg(cw) + '\n');
    // Front: render big, trim, fit the box.
    const res = await page.evaluate(async ({ svg, BOX_W, BOX_H }) => {
      const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); await img.decode();
      const N = 4000, c = document.createElement('canvas'); c.width = c.height = N;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0, N, N);
      const d = x.getImageData(0, 0, N, N).data;
      let x0 = N, y0 = N, x1 = 0, y1 = 0;
      for (let y = 0; y < N; y++) for (let i = 0; i < N; i++) if (d[(y * N + i) * 4 + 3] > 8) {
        if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
      const w = x1 - x0 + 1, h = y1 - y0 + 1, k = Math.min(BOX_W / w, BOX_H / h);
      const o = document.createElement('canvas'); o.width = Math.round(w * k); o.height = Math.round(h * k);
      o.getContext('2d').drawImage(img, -x0 * k, -y0 * k, N * k, N * k);
      return { png: o.toDataURL('image/png'), w: o.width, h: o.height };
    }, { svg: frontSvg(cw, 4000), BOX_W, BOX_H });
    fs.writeFileSync(path.join(out, 'front.png'), setDpi(Buffer.from(res.png.split(',')[1], 'base64'), true));
    sizes[cw] = { front: { wIn: +(res.w / DPI).toFixed(2), hIn: +(res.h / DPI).toFixed(2) } };
  }

  // Back: $Daily Bread$ in Luckiest Guy (a cartoon display font, SIL OFL, from Google Fonts), fill in the
  // toast color, black outline, two offset echo shadows in ring colors; bottom-right of the 12 x 16 in area.
  await page.setContent('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=block"><body></body>');
  await page.evaluate(async () => { await document.fonts.load('100px "Luckiest Guy"', '$Daily Bread$'); });
  for (const [cw, c] of Object.entries(COLORWAYS)) {
    const png = await page.evaluate(({ c, DPI }) => {
      const AREA_W = 12 * DPI, AREA_H = 16 * DPI, INSET = 0.1 * DPI, TEXT_W = 7 * DPI;
      const t = document.createElement('canvas'), tx = t.getContext('2d');
      const pieces = ['$', 'DAILY BREAD', '$'], gap = 0.08;
      tx.font = '100px "Luckiest Guy"';
      const w100 = pieces.reduce((s, p) => s + tx.measureText(p).width, 0) + 2 * gap * 100;
      const px = 100 * TEXT_W / w100, line = px * 0.09, e = px * 0.13;
      const W = Math.ceil(TEXT_W + 2 * e + 2 * line + 20), H = Math.ceil(px * 1.3 + 2 * e + 2 * line);
      t.width = W; t.height = H;
      const draw = (dx, dy, fills) => {
        tx.font = `${px}px "Luckiest Guy"`; tx.textBaseline = 'alphabetic'; tx.lineJoin = 'round';
        let x = line + 10 + dx; const y = line + px * 1.0 + dy;
        pieces.forEach((p, i) => {
          tx.lineWidth = line * 2; tx.strokeStyle = '#111111'; tx.strokeText(p, x, y);
          tx.fillStyle = fills[i]; tx.fillText(p, x, y);
          x += tx.measureText(p).width + gap * px;
        });
      };
      const r = c.rings;
      draw(2 * e, 2 * e, [r[3], r[3], r[3]]);   // back echo
      draw(e, e, [r[1], r[1], r[1]]);           // front echo
      draw(0, 0, [c.halo, c.toast, c.halo]);    // the lettering: words in the toast color, $ in the halo color
      // trim and place in the bottom-right corner
      const d = tx.getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = 0, y1 = 0;
      for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) if (d[(y * W + i) * 4 + 3] > 8) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      const f = document.createElement('canvas'); f.width = AREA_W; f.height = AREA_H;
      f.getContext('2d').drawImage(t, x0, y0, x1 - x0 + 1, y1 - y0 + 1, AREA_W - INSET - (x1 - x0 + 1), AREA_H - INSET - (y1 - y0 + 1), x1 - x0 + 1, y1 - y0 + 1);
      return { png: f.toDataURL('image/png'), w: x1 - x0 + 1, h: y1 - y0 + 1 };
    }, { c, DPI });
    fs.writeFileSync(path.join(root, cw, 'back.png'), setDpi(Buffer.from(png.png.split(',')[1], 'base64'), true));
    sizes[cw].back = { wIn: +(png.w / DPI).toFixed(2), hIn: +(png.h / DPI).toFixed(2) };
  }
  fs.writeFileSync(path.join(root, 'sizes.json'), JSON.stringify(sizes, null, 2) + '\n');

  // Mockups: each colorway, front and back, on a black and a white size L tee at true scale.
  const PX = 12, href = p => 'file:///' + p.replace(/\\/g, '/');
  const TEE = 'M-3.6,0 L-9.8,1.2 L-15.6,7.6 L-12.6,10.8 L-11,9.3 L-11,30 L11,30 L11,9.3 L12.6,10.8 L15.6,7.6 L9.8,1.2 L3.6,0 Q0,6 -3.6,0 Z';
  const shirts = [['#17171a', '#26262a', 'black'], ['#f7f7f5', '#e4e4e2', 'white']];
  const cells = [];
  for (const [cw, c] of Object.entries(COLORWAYS)) for (const [col, collar, sname] of shirts) {
    const z = sizes[cw].front;
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE}" fill="${col}"/><path d="M-3.6,0 Q0,6 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, cw, 'front.png'))}" x="${-z.wIn / 2}" y="4.5" width="${z.wIn}" height="${z.hIn}"/></svg><figcaption>${c.name} · front · ${sname} · ${z.wIn} × ${z.hIn} in</figcaption></figure>`);
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE.replace('Q0,6', 'Q0,2')}" fill="${col}"/><path d="M-3.6,0 Q0,2 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, cw, 'back.png'))}" x="-6" y="3" width="12" height="16"/></svg><figcaption>${c.name} · back · ${sname}</figcaption></figure>`);
  }
  const tmp = path.join(root, '_sheet.html');
  fs.writeFileSync(tmp, `<body style="margin:0;padding:10px;background:#ececea;display:grid;grid-template-columns:repeat(4,auto);gap:6px 10px">${cells.join('')}</body>`);
  await page.setViewportSize({ width: 4 * (33 * PX + 10) + 30, height: 400 });
  await page.goto(href(tmp)); await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(__dirname, 'looney-samples.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log(JSON.stringify(sizes));
})();
