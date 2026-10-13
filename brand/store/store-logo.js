// Store header logo for the Printful quick store (esteef.printful.me, "Esteef.co"): ESTEEF in the brand font
// (Montserrat ExtraBold capitals) with the main halo logo (Saint). One color: black for the store's white
// header, white for dark backgrounds.
// Options:
//   mark      the Saint mark beside ESTEEF
//   halo      ESTEEF alone, with the Saint halo floating over the first E
//   tagline   the Saint mark beside ESTEEF, with DAILY BREAD in small spaced capitals under the wordmark
// Outputs in files/: store-logo-<option>-<black|white>.png (transparent, 300 px tall artwork + padding, wide
// header format) and store-icon-<black|white>.png (1024 x 1024 square: the Saint mark, for favicon/profile);
// store-logo-options.png (review sheet).
// Run: node brand/store/store-logo.js   (needs Playwright; PLAYWRIGHT_PATH / BROWSER_CHANNEL as elsewhere)
const fs = require('fs');
const path = require('path');
const { logos, renderLogo } = require('../../logos/final/logos');

const out = path.join(__dirname, 'files');
const COLORS = { black: '#111111', white: '#ffffff' };
const saint = logos.find(l => l.id === 'saint');
const HALO = saint.parts.find(p => p.shape.includes('A38,9')).shape;   // the halo ring, in the mark's 200-unit space
const H = 300;   // artwork height in px for the header files (the files are trimmed, plus padding)

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage({ viewport: { width: 2400, height: 1200 } });
  fs.mkdirSync(out, { recursive: true });
  const head = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800&display=block"><style>html,body{margin:0;background:transparent}</style>';
  const shots = {};
  const render = async (name, html, fitTag) => {
    await page.setContent(head + `<div id="a" style="display:inline-block;padding:24px">${html}</div>`);
    await page.evaluate(async () => { await document.fonts.load('800 100px Montserrat', 'ESTEEF'); await document.fonts.load('600 100px Montserrat', 'DAILY BREAD'); });
    // tagline: set its letter spacing so DAILY BREAD is exactly as wide as the wordmark's letters
    if (fitTag) await page.evaluate(() => {
      const w = document.querySelector('#w span'), t = document.getElementById('t');
      const ls = parseFloat(getComputedStyle(w).letterSpacing), target = w.getBoundingClientRect().width - ls;
      for (let i = 0; i < 30; i++) { const tl = parseFloat(getComputedStyle(t).letterSpacing), cur = t.getBoundingClientRect().width - tl; t.style.letterSpacing = (tl + (target - cur) / 10) + 'px'; }
    });
    await page.waitForTimeout(150);
    const el = await page.$('#a');
    const file = path.join(out, name);
    await el.screenshot({ path: file, omitBackground: true });
    shots[name] = file;
  };

  for (const [cname, color] of Object.entries(COLORS)) {
    // the mark cropped to its artwork (the 200-unit drawing has a lot of empty space around it)
    const mark = renderLogo(saint, { color, size: H, title: false }).replace('viewBox="0 0 200 200"', 'viewBox="38 44 124 144"').replace(`width="${H}"`, `width="${Math.round(H * 124 / 144)}"`);
    const word = (px, extra = '') => `<span style="font:800 ${px}px Montserrat;letter-spacing:.12em;color:${color};line-height:1;${extra}">ESTEEF</span>`;
    // mark: toast beside the wordmark, wordmark centered on the toast's body
    await render(`store-logo-mark-${cname}.png`,
      `<div style="display:flex;align-items:center;gap:${H * 0.1}px">${mark}<div style="margin-top:${H * 0.14}px">${word(H * 0.36)}</div></div>`);
    // halo: ESTEEF with the halo over the first E
    await render(`store-logo-halo-${cname}.png`,
      `<div style="position:relative;padding-top:${H * 0.19}px">
        <svg viewBox="58 54 84 24" width="${H * 0.5 * 0.92}" height="${H * 0.5 * 0.92 * 24 / 84}" style="position:absolute;left:${-H * 0.5 * 0.13}px;top:${H * 0.0}px"><g fill="${color}">${HALO}</g></svg>
        ${word(H * 0.5)}</div>`);
    // tagline: toast + ESTEEF over DAILY BREAD (spaced to the wordmark's width)
    await render(`store-logo-tagline-${cname}.png`,
      `<div style="display:flex;align-items:center;gap:${H * 0.1}px">${mark}<div style="margin-top:${H * 0.1}px;display:flex;flex-direction:column;align-items:flex-start">
        <span id="w">${word(H * 0.36)}</span><span id="t" style="font:600 ${H * 0.16}px Montserrat;letter-spacing:.3em;color:${color};margin-top:${H * 0.05}px;white-space:nowrap">DAILY BREAD</span></div></div>`, true);
    // square icon: the Saint mark
    await page.setContent(`<style>html,body{margin:0;background:transparent}</style><div id="a" style="width:1024px;height:1024px">${renderLogo(saint, { color, size: 1024, title: false })}</div>`);
    await (await page.$('#a')).screenshot({ path: path.join(out, `store-icon-${cname}.png`), omitBackground: true });
  }

  // Review sheet: each option on the store's white header and on black.
  const href = p => 'file:///' + p.replace(/\\/g, '/');
  const rows = ['mark', 'halo', 'tagline'].map(o => `<div style="display:flex;gap:16px;align-items:stretch">
      <div style="width:150px;font:700 15px system-ui;color:#333;align-self:center">${o}</div>
      <div style="background:#fff;border:1px solid #ddd;padding:18px 28px;display:flex;align-items:center;gap:40px;width:900px"><img src="${href(shots[`store-logo-${o}-black.png`])}" style="height:64px"><span style="font:14px system-ui;color:#333">All products&nbsp;&nbsp;&nbsp;Men's clothing&nbsp;&nbsp;&nbsp;Women's clothing</span></div>
      <div style="background:#141416;padding:18px 28px;display:flex;align-items:center;width:420px"><img src="${href(shots[`store-logo-${o}-white.png`])}" style="height:64px"></div></div>`).join('');
  const tmp = path.join(out, '_sheet.html');
  fs.writeFileSync(tmp, `<body style="margin:0;padding:16px;background:#f0f0ee;display:grid;gap:16px">${rows}</body>`);
  await page.setViewportSize({ width: 1640, height: 400 });
  await page.goto(href(tmp)); await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(__dirname, 'store-logo-options.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log('wrote', Object.keys(shots).length, 'header logos, 2 icons and the sheet');
})();
