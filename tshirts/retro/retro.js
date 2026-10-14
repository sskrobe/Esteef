// Retro: an 80s synthwave / outrun scene starring the three character marks. A striped neon sun sets on the
// horizon over a perspective laser grid; the Saint (left), the plain Coma Toast (center, biggest) and the Little
// Devil (right) stand on the horizon as dark figures with neon-tube outlines (face lines in neon, halo and horns
// in their own colors). Below: DAILY BREAD in 80s chrome (Montserrat Black Italic, sky-over-sunset chrome fill,
// extruded), with "Coma Toast" in a neon script (Mr Dafoe) slashed across it.
// Colorways: "outrun" (yellow-to-magenta sun, magenta grid, cyan tubes) and "miami" (pink-to-teal sun, teal
// grid, pink tubes). Both for dark shirts. Solid colors and gradients, no soft transparency (DTG-safe).
// Back: $DAILY BREAD$ in the same chrome, bottom-right of the 12 x 16 in back area.
// Size and placement (chest standard, Bella+Canvas 3001): fits a 10.5 x 12 in box, centered, top 1.5 in below
// the collar seam.
// Outputs: files/<outrun|miami>/front.png, back.png; retro-samples.png.
// Run: node tshirts/retro/retro.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { logos } = require('../../logos/final/logos');
const { setDpi } = require('../paintshop/printful');

const COLORWAYS = {
  outrun: {
    name: 'Outrun', shirts: ['black', 'navy'],
    sun: ['#fff36b', '#ffb22e', '#ff5a3c', '#ff2e88', '#c41a9e'], grid: '#ff2e88', horizon: '#ffffff',
    body: '#1a0b33', tube: '#27f4ff', face: '#ff2e88', halo: '#fff36b', horns: '#ff3b4a',
    script: '#ff2e88', scriptCore: '#ffe0f0', extrude: '#ff2e88',
  },
  miami: {
    name: 'Miami', shirts: ['black', 'navy'],
    sun: ['#ffd1e8', '#ff9ccf', '#ff5fa2', '#c86dd7', '#3fd6c6'], grid: '#16d9c5', horizon: '#ffffff',
    body: '#0f1f3a', tube: '#ff6fb5', face: '#16d9c5', halo: '#fff3b0', horns: '#ff3b6b',
    script: '#16d9c5', scriptCore: '#e0fffb', extrude: '#16d9c5',
  },
};
const CAST = [   // left to right; scale relative to the center mark; dy lifts it (in toast heights)
  { id: 'saint', s: 0.78, dx: -0.26 },
  { id: 'plain', s: 1, dx: 0 },
  { id: 'little-devil', s: 0.78, dx: 0.26 },
];
const DPI = 300, BOX_W = 10.5 * DPI, BOX_H = 12 * DPI;
const VB = [0, 20, 200, 180];   // common viewBox for every mark, so the toasts line up
const isToast = p => p.shape.includes('scale(0.78)');
const markSvgs = id => {
  const m = logos.find(l => l.id === id), svg = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB.join(' ')}" width="__W__" height="__H__">${inner}</svg>`;
  return {
    sil: svg(m.parts.map(p => `<g fill="#fff">${p.shape}</g>`).join('')),
    toast: svg(m.parts.filter(isToast).map(p => `<g fill="#fff">${p.shape}</g>`).join('')),
    top: svg(m.parts.filter(p => !isToast(p)).map(p => `<g fill="#fff">${p.shape}</g>`).join('')),
    det: svg(m.parts.map(p => (p.detail || '').replace(/#000/g, '#fff')).join('')),
    halo: m.parts.some(p => p.noGap),
  };
};

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  await page.setContent('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@1,900&family=Mr+Dafoe&display=block"><body></body>');
  await page.evaluate(async () => {
    await document.fonts.load('italic 900 100px "Montserrat"', '$DAILY BREAD$');
    await document.fonts.load('100px "Mr Dafoe"', 'Coma Toast');
  });
  await page.addScriptTag({ content: `
    window.loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
    window.canvas = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return c; };
    window.tint = (m, color) => { const c = canvas(m.width, m.height), x = c.getContext('2d'); x.drawImage(m, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height); return c; };
    window.dilate = (m, r) => { const c = canvas(m.width, m.height), x = c.getContext('2d'); for (let a = 0; a < 360; a += 7.5) for (const f of [0.35, 0.7, 1]) x.drawImage(m, Math.cos(a * Math.PI / 180) * r * f, Math.sin(a * Math.PI / 180) * r * f); x.drawImage(m, 0, 0); return c; };
    window.hard = c => { const x = c.getContext('2d'), d = x.getImageData(0, 0, c.width, c.height); for (let i = 3; i < d.data.length; i += 4) d.data[i] = d.data[i] > 110 ? 255 : 0; x.putImageData(d, 0, 0); return c; };
    window.cut = (c, m) => { const x = c.getContext('2d'); x.save(); x.globalCompositeOperation = 'destination-out'; x.drawImage(m, 0, 0); x.restore(); return c; };
    window.keep = (c, m) => { const x = c.getContext('2d'); x.save(); x.globalCompositeOperation = 'destination-in'; x.drawImage(m, 0, 0); x.restore(); return c; };
    window.trim = c => { const W = c.width, H = c.height, d = c.getContext('2d').getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = 0, y1 = 0;
      for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) if (d[(y * W + i) * 4 + 3] > 8) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      const t = canvas(x1 - x0 + 1, y1 - y0 + 1); t.getContext('2d').drawImage(c, -x0, -y0); return t; };
    // 80s chrome text: magenta extrude, dark keyline, sky-over-sunset chrome fill, thin white rim
    window.chrome = (text, font, px, v, pad) => {
      const m = canvas(10, 10).getContext('2d'); m.font = font; const mm = m.measureText(text);
      const w = mm.actualBoundingBoxLeft + mm.actualBoundingBoxRight, asc = mm.actualBoundingBoxAscent, desc = mm.actualBoundingBoxDescent;
      const ext = px * 0.07, key = px * 0.05;
      const c = canvas(w + 2 * pad + ext, asc + desc + 2 * pad + ext), x = c.getContext('2d');
      const X = pad + mm.actualBoundingBoxLeft, Y = pad + asc;
      x.font = font; x.lineJoin = 'round';
      const shape = canvas(c.width, c.height), sx = shape.getContext('2d'); sx.font = font; sx.fillStyle = '#fff'; sx.fillText(text, X, Y);
      // extrude (down-right), keyline around everything
      const ex = canvas(c.width, c.height), exx = ex.getContext('2d'); for (let i = 1; i <= ext; i += 1.5) exx.drawImage(shape, i, i);
      const all = canvas(c.width, c.height), ax = all.getContext('2d'); ax.drawImage(ex, 0, 0); ax.drawImage(shape, 0, 0);
      x.drawImage(tint(hard(dilate(all, key)), '#0b0420'), 0, 0);
      x.drawImage(tint(ex, v.extrude), 0, 0);
      // a darker band on the extrude for depth
      const exd = tint(ex, '#000'); exd.getContext('2d').globalCompositeOperation = 'source-over';
      x.save(); x.globalAlpha = 1; x.restore();
      const g = x.createLinearGradient(0, Y - asc, 0, Y + desc);
      [[0, '#ffffff'], [0.18, '#d8f6ff'], [0.46, '#4fa9ff'], [0.5, '#1b2a7a'], [0.52, '#2a0f3a'], [0.68, '#b03a7a'], [0.86, '#ffa24a'], [1, '#fff4c8']].forEach(([o, col]) => g.addColorStop(o, col));
      const fill = canvas(c.width, c.height), fx = fill.getContext('2d'); fx.fillStyle = g; fx.fillRect(0, 0, c.width, c.height); keep(fill, shape);
      x.drawImage(fill, 0, 0);

      return c;
    };
    // neon-tube script: thick colored tube with a pale core, dark keyline around
    window.neon = (text, font, px, v, pad, rot) => {
      const m = canvas(10, 10).getContext('2d'); m.font = font; const mm = m.measureText(text);
      const w = mm.actualBoundingBoxLeft + mm.actualBoundingBoxRight, h = mm.actualBoundingBoxAscent + mm.actualBoundingBoxDescent;
      const D = Math.hypot(w, h) + 2 * pad, c = canvas(D, D), x = c.getContext('2d');
      x.translate(D / 2, D / 2); x.rotate(rot); x.translate(-w / 2 + mm.actualBoundingBoxLeft, -h / 2 + mm.actualBoundingBoxAscent);
      x.font = font; x.lineJoin = 'round'; x.lineCap = 'round';
      x.strokeStyle = '#0b0420'; x.lineWidth = px * 0.16; x.strokeText(text, 0, 0); x.fillStyle = '#0b0420'; x.fillText(text, 0, 0);
      x.strokeStyle = v.script; x.lineWidth = px * 0.07; x.strokeText(text, 0, 0); x.fillStyle = v.script; x.fillText(text, 0, 0);
      x.strokeStyle = v.scriptCore; x.lineWidth = px * 0.012; x.strokeText(text, 0, 0);
      return hard(trim(c));
    };
  ` });

  const cast = CAST.map(c => ({ ...c, svg: markSvgs(c.id) }));
  const root = path.join(__dirname, 'files'), sizes = {};
  for (const [vid, v] of Object.entries(COLORWAYS)) {
    const res = await page.evaluate(async ({ v, cast, VB, BOX_W }) => {
      const W = BOX_W, H = W * 1.25;   // working canvas, trimmed and fitted at the end
      const out = canvas(W, H), o = out.getContext('2d');
      const cx = W / 2, horizon = W * 0.6;
      // SUN: gradient disc, sliced with gaps that widen toward the horizon; sits on the horizon
      const R = W * 0.35, sunCy = horizon - R * 0.5;
      const sun = canvas(W, H), sx = sun.getContext('2d');
      const g = sx.createLinearGradient(0, sunCy - R, 0, horizon);
      v.sun.forEach((col, i) => g.addColorStop(i / (v.sun.length - 1), col));
      sx.fillStyle = g; sx.beginPath(); sx.arc(cx, sunCy, R, 0, Math.PI * 2); sx.fill();
      sx.globalCompositeOperation = 'destination-out';
      let y = sunCy - R * 0.62, k = 0;
      while (y < horizon) { const gap = W * (0.0035 + 0.0026 * k); sx.fillRect(0, y, W, gap); y += gap + W * Math.max(0.01, 0.034 - 0.0034 * k); k++; }
      sx.fillRect(0, horizon - W * 0.004, W, H);   // nothing below the horizon
      o.drawImage(sun, 0, 0);
      // GRID: perspective floor, lines converge on a vanishing point above the horizon; bounded by a trapezoid
      const floorH = W * 0.2, gw = W * 0.0032, grid = canvas(W, H), gx = grid.getContext('2d');
      gx.strokeStyle = v.grid; gx.lineCap = 'butt';
      const vpY = horizon - floorH * 0.9;
      for (let i = -12; i <= 12; i++) {   // rails
        const xb = cx + i * W * 0.085, t = (horizon - vpY) / (horizon + floorH - vpY);
        gx.lineWidth = gw * 1.15; gx.beginPath(); gx.moveTo(cx + (xb - cx) * t, horizon); gx.lineTo(xb, horizon + floorH); gx.stroke();
      }
      for (let j = 0; j < 9; j++) {   // rungs, closer together (and thinner) toward the horizon
        const yy = horizon + floorH * Math.pow(j / 8, 1.8);
        gx.lineWidth = gw * (0.55 + 0.75 * j / 8); gx.beginPath(); gx.moveTo(0, yy); gx.lineTo(W, yy); gx.stroke();
      }
      // trapezoid mask: narrow at the horizon, full width at the front
      const mask = canvas(W, H), mx = mask.getContext('2d'); mx.fillStyle = '#fff'; mx.beginPath();
      mx.moveTo(cx - W * 0.4, horizon); mx.lineTo(cx + W * 0.4, horizon); mx.lineTo(W * 0.995, horizon + floorH + gw); mx.lineTo(W * 0.005, horizon + floorH + gw); mx.closePath(); mx.fill();
      keep(grid, mask); o.drawImage(grid, 0, 0);
      // horizon line
      o.fillStyle = v.horizon; o.fillRect(cx - W * 0.4, horizon - W * 0.0035, W * 0.8, W * 0.0055);
      // CAST: dark bodies with neon-tube outlines, standing on the horizon
      const toastH = W * 0.27, unit = toastH / 110;   // the toast is about 110 viewBox units tall (incl. crust)
      const layers = [];
      for (const c of cast) {
        const s = c.s, cw = VB[2] * unit * s, ch = VB[3] * unit * s;
        const left = cx + c.dx * W - cw / 2, toastBottomVB = 182, top = horizon + W * 0.012 - (toastBottomVB - VB[1]) * unit * s;
        const img = async (svgS) => { const i = await loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgS.replace('__W__', cw).replace('__H__', ch))); const k = canvas(W, H); k.getContext('2d').drawImage(i, left, top, cw, ch); return k; };
        const sil = hard(await img(c.svg.sil)), toast = await img(c.svg.toast), topper = await img(c.svg.top), det = await img(c.svg.det);
        layers.push({ sil, toast, topper, det, s, halo: c.svg.halo });
      }
      // draw the side characters first, then the center one in front
      for (const L of [layers[0], layers[2], layers[1]]) {
        const tube = W * 0.0075 * (0.6 + 0.4 * L.s), keyR = W * 0.012;
        const outer = hard(dilate(L.sil, tube + keyR));
        cut(out, outer);                                   // clear gap around the figure
        o.drawImage(tint(hard(dilate(L.sil, tube)), v.tube), 0, 0);   // neon tube outline
        o.drawImage(tint(L.toast, v.body), 0, 0);
        o.drawImage(tint(L.topper, L.halo ? v.halo : v.horns), 0, 0);
        o.drawImage(tint(L.det, v.face), 0, 0);
      }
      // TEXT: DAILY BREAD chrome, Coma Toast neon script slashed across it
      const top = horizon + floorH + W * 0.035;
      const m = canvas(10, 10).getContext('2d'); m.font = 'italic 900 100px "Montserrat"';
      const tw = W * 0.9, px = 100 * tw / m.measureText('DAILY BREAD').width;
      const chr = chrome('DAILY BREAD', 'italic 900 ' + px + 'px "Montserrat"', px, v, W * 0.02);
      o.drawImage(chr, cx - chr.width / 2, top);
      const spx = px * 1.1, sc = neon('Coma Toast', spx + 'px "Mr Dafoe"', spx, v, W * 0.03, -0.12);
      const sX = cx + W * 0.1 - sc.width / 2, sY = top + chr.height * 0.8;
      cut(out, (() => { const k = canvas(W, H); k.getContext('2d').drawImage(sc, sX, sY); return hard(dilate(k, W * 0.004)); })());
      o.drawImage(sc, sX, sY);
      let art = trim(out);
      const f = Math.min(BOX_W / art.width, 12 * 300 / art.height), r = canvas(Math.round(art.width * f), Math.round(art.height * f));
      const rx = r.getContext('2d'); rx.imageSmoothingQuality = 'high'; rx.drawImage(art, 0, 0, r.width, r.height);
      return { png: r.toDataURL('image/png'), w: r.width, h: r.height };
    }, { v, cast: cast.map(c => ({ dx: c.dx, s: c.s, svg: c.svg })), VB, BOX_W });
    const out = path.join(root, vid); fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'front.png'), setDpi(Buffer.from(res.png.split(',')[1], 'base64'), true));

    // BACK: $DAILY BREAD$ in the same chrome, bottom-right of the 12 x 16 in back area
    const back = await page.evaluate(({ v, DPI }) => {
      const AREA_W = 12 * DPI, AREA_H = 16 * DPI, INSET = 0.1 * DPI, TW = 7 * DPI, t = '$DAILY BREAD$';
      const m = canvas(10, 10).getContext('2d'); m.font = 'italic 900 100px "Montserrat"';
      const px = 100 * TW / m.measureText(t).width;
      const art = trim(chrome(t, 'italic 900 ' + px + 'px "Montserrat"', px, v, 40)), f = canvas(AREA_W, AREA_H);
      f.getContext('2d').drawImage(art, AREA_W - INSET - art.width, AREA_H - INSET - art.height);
      return { png: f.toDataURL('image/png'), w: art.width, h: art.height };
    }, { v, DPI });
    fs.writeFileSync(path.join(out, 'back.png'), setDpi(Buffer.from(back.png.split(',')[1], 'base64'), true));
    sizes[vid] = { front: { wIn: +(res.w / DPI).toFixed(2), hIn: +(res.h / DPI).toFixed(2) }, back: { wIn: +(back.w / DPI).toFixed(2), hIn: +(back.h / DPI).toFixed(2) } };
  }
  fs.writeFileSync(path.join(root, 'sizes.json'), JSON.stringify(sizes, null, 2) + '\n');

  // Sheet: each colorway, front and back, on each shirt (size L, true scale), plus a close-up of the front.
  const PX = 13, href = p => 'file:///' + p.replace(/\\/g, '/');
  const TEE = 'M-3.6,0 L-9.8,1.2 L-15.6,7.6 L-12.6,10.8 L-11,9.3 L-11,30 L11,30 L11,9.3 L12.6,10.8 L15.6,7.6 L9.8,1.2 L3.6,0 Q0,6 -3.6,0 Z';
  const SH = { black: ['#17171a', '#26262a'], navy: ['#1c2440', '#2a3352'] };
  const cells = [];
  for (const [vid, v] of Object.entries(COLORWAYS)) for (const sn of v.shirts) {
    const z = sizes[vid].front, [c, collar] = SH[sn];
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE}" fill="${c}"/><path d="M-3.6,0 Q0,6 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, vid, 'front.png'))}" x="${-z.wIn / 2}" y="4.5" width="${z.wIn}" height="${z.hIn}"/></svg><figcaption>${v.name} on ${sn} · front · ${z.wIn} × ${z.hIn} in</figcaption></figure>`);
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}"><path d="${TEE.replace('Q0,6', 'Q0,2')}" fill="${c}"/><path d="M-3.6,0 Q0,2 3.6,0" fill="none" stroke="${collar}" stroke-width="0.75"/><image href="${href(path.join(root, vid, 'back.png'))}" x="-6" y="3" width="12" height="16"/></svg><figcaption>back</figcaption></figure>`);
    cells.push(`<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333"><div style="background:${c};padding:14px;width:${33 * PX - 28}px;height:${33.5 * PX - 28}px;display:flex;align-items:center;justify-content:center"><img src="${href(path.join(root, vid, 'front.png'))}" style="max-width:100%;max-height:100%"></div><figcaption>close-up</figcaption></figure>`);
  }
  const tmp = path.join(root, '_sheet.html');
  fs.writeFileSync(tmp, `<body style="margin:0;padding:10px;background:#ececea;display:grid;grid-template-columns:repeat(3,auto);gap:8px 12px">${cells.join('')}</body>`);
  await page.setViewportSize({ width: 3 * (33 * PX + 12) + 30, height: 400 });
  await page.goto(href(tmp)); await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(__dirname, 'retro-samples.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log(JSON.stringify(sizes));
})();
