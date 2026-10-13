// Inside and outside neck labels: Daily Bread logo options in plain black, plain white and the Benday style.
// Printful's Bella+Canvas 3001 (product 71) has a 3 x 3 in inside label and a 3 x 3 in outside label (back,
// just under the collar). On the inside label Printful adds the required size / material / care / origin
// text itself, so the logo sits in the top of the square and the bottom is left clear for that text.
//
// Logo options (all in Rubik Wet Paint, the brand wordmark font):
//   daily-bread   Daily Bread              dollar-daily-bread  $Daily Bread$
//   db            DB                       dollar-db           $DB$
//   reversed-db   a backwards D back to back with the B (the bowls face out)
//   halo-db       the reversed DB with the Saint halo over it
// Styles: plain-black (light shirts), plain-white (dark shirts), benday (white letters, bold black outline,
// blue dollar signs and halo trim, on the blue Ben-Day stipple swatch from the Benday Logo tee).
//
// Outputs in files/: <logo>-<style>-inside.png and <logo>-<style>-outside.png (900 x 900 px = 3 x 3 in at
// 300 dpi, transparent), <logo>-<style>.png (the logo alone, trimmed), and two review sheets.
// Run: node tshirts/labels/labels.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { swatch, COLORS: { INK, WHITE, BLUE } } = require('../benday-logo/benday');
const { setDpi } = require('../paintshop/printful');

const out = path.join(__dirname, 'files');
const DPI = 300, LABEL = 3 * DPI;
// Where the logo goes inside each 3 x 3 in label (inches): a box it is fitted into, top-centered.
const ZONES = {
  inside: { top: 0.25, w: 2.5, h: 1.2 },    // the lower half stays clear for Printful's size/care text
  outside: { top: 0.2, w: 2.0, h: 1.0 },    // small, right under the collar
};
const FONT = 'file:///' + path.join(__dirname, '..', 'fonts', 'RubikWetPaint-latin.woff2').replace(/\\/g, '/');
const FS = 100, GAP = 10;   // font size in drawing units; space around the dollar signs
const HALO = 'M-38,0 A38,9 0 1 0 38,0 A38,9 0 1 0 -38,0 Z M-28,0 A28,4.5 0 1 0 28,0 A28,4.5 0 1 0 -28,0 Z';

const LOGOS = [
  { id: 'daily-bread', name: 'Daily Bread', runs: ['Daily Bread'] },
  { id: 'dollar-daily-bread', name: '$Daily Bread$', runs: ['$', 'Daily Bread', '$'] },
  { id: 'db', name: 'DB', runs: ['DB'] },
  { id: 'dollar-db', name: '$DB$', runs: ['$', 'DB', '$'] },
  { id: 'reversed-db', name: 'Reversed DB', mono: true },
  { id: 'halo-db', name: 'Reversed DB + halo', mono: true, halo: true },
];
const STYLES = ['plain-black', 'plain-white', 'benday'];

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  fs.mkdirSync(out, { recursive: true });
  const head = `<style>@font-face{font-family:'WP';src:url('${FONT}') format('woff2');font-display:block}html,body{margin:0;background:transparent}</style>`;
  const tmp = path.join(out, '_label.html');
  const load = async html => { fs.writeFileSync(tmp, head + html); await page.goto('file:///' + tmp); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(200); };

  // 1. Measure the pieces at font size 100: advance width and ink box, and the stem widths of D and B
  //    (the first solid run, scanning a row through the letter's middle).
  await load(`<svg width="10" height="10"><text id="t" font-family="WP" font-size="${FS}">x</text></svg><canvas id="c" width="400" height="300"></canvas>`);
  const M = await page.evaluate(({ FS }) => {
    const t = document.getElementById('t'), m = {};
    for (const s of ['Daily Bread', '$', 'DB', 'D', 'B']) {
      t.textContent = s; const b = t.getBBox();
      m[s] = { adv: t.getComputedTextLength(), x: b.x, y: b.y, w: b.width, h: b.height };
    }
    const c = document.getElementById('c'), x = c.getContext('2d');
    const stem = ch => {
      x.clearRect(0, 0, 400, 300); x.font = `${FS * 2}px WP`; x.fillStyle = '#000'; x.fillText(ch, 50, 220);
      // Scan several heights and keep the narrowest first run: rows through B's middle bar (or a
      // top or bottom bar) are solid all the way across, so only the rows through a counter show the stem.
      const a = x.measureText(ch); let best = Infinity;
      for (const f of [0.22, 0.3, 0.62, 0.7, 0.78]) {
        const d = x.getImageData(0, Math.round(220 - a.actualBoundingBoxAscent * f), 400, 1).data;
        let i = 0; while (i < 400 && d[i * 4 + 3] < 128) i++; const s0 = i; while (i < 400 && d[i * 4 + 3] >= 128) i++;
        if (i > s0) best = Math.min(best, i - s0);
      }
      return best / 2;
    };
    m.stemD = stem('D'); m.stemB = stem('B');
    return m;
  }, { FS });

  // 2. Build each logo's letters in drawing units (baseline at y 0).
  // Returns { svg(style), box: [x0, y0, x1, y1] } where svg(style) draws the letters (and halo).
  function letters(L) {
    const parts = [];   // { text, x, mirror, dollar }
    let x = 0;
    if (L.mono) {
      // Backwards D: mirrored so its stem is on the right, then the B back to back with it, a small gap
      // between the two stems (fusing the stems turned the pair into a blob at label size).
      const d = M.D, b = M.B;
      parts.push({ text: 'D', x: d.x + d.w, mirror: true });   // mirrored about its own ink box
      const dRight = d.w;                                          // the mirrored D's ink spans 0..d.w
      const MONO_GAP = 7;
      parts.push({ text: 'B', x: dRight + MONO_GAP - b.x });
      x = dRight + MONO_GAP + b.w;
    } else {
      L.runs.forEach((r, i) => {
        if (i) x += GAP;
        parts.push({ text: r, x, dollar: r === '$' });
        x += M[r].adv;
      });
    }
    const ys = ['$', 'D', 'B', 'DB', 'Daily Bread'].map(k => M[k]);
    let x0 = 0, x1 = x, y0 = Math.min(...ys.map(m => m.y)), y1 = Math.max(...ys.map(m => m.y + m.h));
    if (!L.mono) { x0 = M[L.runs[0]].x; }
    let halo = null;
    if (L.halo) {
      const k = (x1 - x0) * 0.78 / 76, cx = (x0 + x1) / 2, cy = M.D.y - 9 * k - 10;
      halo = { k, cx, cy };
      y0 = cy - 9 * k;
    }
    const draw = style => {
      const plain = style !== 'benday', col = style === 'plain-white' ? WHITE : INK;
      const fill = p => plain ? col : (p.dollar ? BLUE : WHITE);
      const stroke = plain ? '' : ` stroke="${INK}" stroke-width="${(0.11 * FS).toFixed(1)}" stroke-linejoin="round" paint-order="stroke"`;
      const h = halo ? `<path transform="translate(${halo.cx} ${halo.cy}) scale(${halo.k})" fill-rule="evenodd" d="${HALO}" fill="${plain ? col : WHITE}"${plain ? '' : ` stroke="${INK}" stroke-width="${(0.09 * FS / halo.k).toFixed(2)}" stroke-linejoin="round" paint-order="stroke"`}/>` : '';
      return h + parts.map(p => p.mirror
        ? `<text transform="translate(${p.x} 0) scale(-1 1)" x="0" y="0" font-family="WP" font-size="${FS}" fill="${fill(p)}"${stroke}>${p.text}</text>`
        : `<text x="${p.x}" y="0" font-family="WP" font-size="${FS}" fill="${fill(p)}"${stroke}>${p.text}</text>`).join('');
    };
    return { draw, box: [x0, y0, x1, y1] };
  }

  // 3. Render each logo x style, trim it, and place it into the inside and outside label squares.
  const results = {};
  for (const L of LOGOS) {
    const { draw, box } = letters(L);
    for (const style of STYLES) {
      let bg = '', defs = '';
      const pad = 30, vb = [box[0] - pad, box[1] - pad, box[2] - box[0] + 2 * pad, box[3] - box[1] + 2 * pad];
      if (style === 'benday') {
        const sw = swatch(7, `sw-${L.id}`, { x0: box[0] - 8, y0: box[1] - 6, x1: box[2] + 8, y1: box[3] + 4, tilt: -2.2, pitch: 5.2, n: [26, 8], jx: 2.2, streaks: 5, scratches: 12 });
        defs = sw.def.replace('x="-30" y="-30" width="260" height="260"', `x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}"`);
        bg = sw.art;
      }
      const S = 4, W = Math.round(vb[2] * S), H = Math.round(vb[3] * S);
      await page.setViewportSize({ width: W, height: H });
      await load(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" width="${W}" height="${H}"><defs>${defs}</defs>${bg}${draw(style)}</svg>`);
      const shot = (await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } })).toString('base64');
      const r = await page.evaluate(async ({ shot, ZONES, DPI, LABEL }) => {
        const img = new Image(); img.src = 'data:image/png;base64,' + shot; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const x = c.getContext('2d'); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height).data;
        let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
        for (let y = 0; y < c.height; y++) for (let i = 0; i < c.width; i++) if (d[(y * c.width + i) * 4 + 3] > 8) {
          if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y;
        }
        const w = x1 - x0 + 1, h = y1 - y0 + 1, out = {};
        const a = document.createElement('canvas'); a.width = w; a.height = h; a.getContext('2d').drawImage(c, -x0, -y0);
        out.art = a.toDataURL('image/png');
        for (const [name, z] of Object.entries(ZONES)) {
          const k = Math.min(z.w * DPI / w, z.h * DPI / h), lw = w * k, lh = h * k;
          const f = document.createElement('canvas'); f.width = f.height = LABEL;
          const fx = f.getContext('2d'); fx.imageSmoothingQuality = 'high';
          fx.drawImage(a, (LABEL - lw) / 2, z.top * DPI, lw, lh);
          out[name] = { png: f.toDataURL('image/png'), wIn: +(lw / DPI).toFixed(2), hIn: +(lh / DPI).toFixed(2) };
        }
        return out;
      }, { shot, ZONES, DPI, LABEL });
      const save = (name, url) => fs.writeFileSync(path.join(out, name), setDpi(Buffer.from(url.split(',')[1], 'base64'), true));
      const base = `${L.id}-${style}`;
      save(`${base}.png`, r.art);
      save(`${base}-inside.png`, r.inside.png);
      save(`${base}-outside.png`, r.outside.png);
      results[base] = { logo: L.name, style, inside: [r.inside.wIn, r.inside.hIn], outside: [r.outside.wIn, r.outside.hIn] };
      console.log('wrote', base, 'inside', r.inside.wIn, 'x', r.inside.hIn, 'in; outside', r.outside.wIn, 'x', r.outside.hIn, 'in');
    }
  }
  fs.writeFileSync(path.join(out, 'sizes.json'), JSON.stringify(results, null, 2) + '\n');

  // 4. Review sheets: every logo x style as an inside label (with placeholder Printful text) and as an
  //    outside label on the back of a white and a black tee.
  const F = out.replace(/\\/g, '/');
  const PX = 64;   // sheet pixels per inch
  const shirts = { 'plain-black': '#f2f2f0', 'plain-white': '#17171a', 'benday': '#f2f2f0' };
  const ink = c => c === '#17171a' ? '#d6d6d6' : '#555';
  const insideCell = (L, s) => { const bgc = shirts[s]; return `<figure style="margin:0;text-align:center;font:600 12px system-ui;color:#333">
    <div style="position:relative;width:${3 * PX}px;height:${3 * PX}px;background:${bgc};outline:1px dashed #999">
      <img src="file:///${F}/${L.id}-${s}-inside.png" style="position:absolute;inset:0;width:100%;height:100%">
      <div style="position:absolute;left:0;right:0;top:${1.65 * PX}px;font:700 13px system-ui;letter-spacing:.06em;color:${ink(bgc)};line-height:1.35">M<br><span style="font-weight:500;font-size:9px">100% COTTON · MADE IN …<br>MACHINE WASH COLD</span><br><span style="font-weight:400;font-size:8px;opacity:.7">(text added by Printful)</span></div>
    </div><figcaption>${L.name} · ${s}</figcaption></figure>`; };
  const BACK = 'M-3.6,0 L-9.8,1.2 L-15.6,7.6 L-12.6,10.8 L-11,9.3 L-11,12 L11,12 L11,9.3 L12.6,10.8 L15.6,7.6 L9.8,1.2 L3.6,0 Q0,2 -3.6,0 Z';
  const outsideCell = (L, s) => { const shirt = s === 'plain-white' ? '#17171a' : (s === 'benday' ? '#17171a' : '#f2f2f0');
    return `<figure style="margin:0;text-align:center;font:600 12px system-ui;color:#333">
    <svg viewBox="-7 -1 14 7" width="${14 * 22}" height="${7 * 22}"><path d="${BACK}" fill="${shirt}"/>
      <path d="M-3.6,0 Q0,2 3.6,0" fill="none" stroke="${shirt === '#17171a' ? '#26262a' : '#dcdcda'}" stroke-width="0.6"/>
      <rect x="-1.5" y="1.25" width="3" height="3" fill="none" stroke="#999" stroke-width="0.03" stroke-dasharray="0.15 0.1"/>
      <image href="file:///${F}/${L.id}-${s}-outside.png" x="-1.5" y="1.25" width="3" height="3"/></svg>
    <figcaption>${L.name} · ${s} · outside</figcaption></figure>`; };
  const sheet = async (file, cell, cols, w) => {
    await page.setViewportSize({ width: w, height: 400 });
    await load(`<body style="margin:0;padding:12px;background:#fafaf8;display:grid;grid-template-columns:repeat(${cols},auto);gap:14px 18px;justify-content:start">${LOGOS.map(L => STYLES.map(s => cell(L, s)).join('')).join('')}</body>`);
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(__dirname, file), fullPage: true });
  };
  await sheet('labels-inside.png', insideCell, 6, 6 * (3 * PX + 18) + 30);
  await sheet('labels-outside.png', outsideCell, 6, 6 * (14 * 22 + 18) + 30);
  fs.unlinkSync(tmp);
  await browser.close();
  console.log('wrote labels-inside.png and labels-outside.png');
})();
