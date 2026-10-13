// True-scale mockup sheets for the women's Benday Logo tee (Bella+Canvas 6400 Women's Relaxed T-Shirt, size
// M: about 19 x 27 in body). Front: each mark in each palette, centered, top of the art 1.5 in below the
// collar seam. Back: the $Daily Bread$ back print file (12 x 16 in area; Printful scales it per size) in
// each palette on a white and a black tee.
// Run after make.js and back.js for each palette: node tshirts/benday-logo/mockup-women.js
const fs = require('fs');
const path = require('path');
const { logos } = require('./benday');
const { PALETTES } = require('./women');

const root = path.join(__dirname, 'women');
const PX = 14;
// Women's relaxed tee outline in inches (x = 0 at center, y = 0 at the shoulder line beside the neck):
// shorter, slightly narrower body, shorter sleeves than the men's.
const TEE = 'M-3.4,0 L-8.6,1.0 L-13.4,6.4 L-11.0,9.0 L-9.6,7.9 L-9.6,27 L9.6,27 L9.6,7.9 L11.0,9.0 L13.4,6.4 L8.6,1.0 L3.4,0 Q0,5.4 -3.4,0 Z';
const NECK_DROP = 2.7, LOGO_TOP = NECK_DROP + 1.5;
const BACK_TEE = TEE.replace('Q0,5.4', 'Q0,1.8'), AREA_TOP = 0.9 + 1.8;   // print area shown 1.8 in below the back collar (approximate)
const SHIRTS = { white: ['#f7f7f5', '#e4e4e2'], black: ['#17171a', '#232327'] };
const href = p => 'file:///' + p.replace(/\\/g, '/');

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage();
  const tmp = path.join(root, '_sheet.html');
  const shoot = async (html, w, file) => {
    await page.setViewportSize({ width: w, height: 400 });
    fs.writeFileSync(tmp, html); await page.goto(href(tmp)); await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(__dirname, file), fullPage: true });
  };
  const fig = (svg, cap) => `<figure style="margin:0;text-align:center;font:600 13px system-ui;color:#333">${svg}<figcaption>${cap}</figcaption></figure>`;

  // Front: rows = palettes, columns = marks, on a white tee.
  const front = [];
  for (const [pid, pal] of Object.entries(PALETTES)) {
    const sizes = JSON.parse(fs.readFileSync(path.join(root, pid, 'sizes.json'), 'utf8'));
    front.push(`<div style="align-self:center;font:700 15px system-ui;color:#333">${pal.name}<br><span style="font-weight:400;color:${pal.color}">${pal.color}</span></div>`);
    for (const l of logos) {
      const z = sizes[l.id], [c, collar] = SHIRTS.white;
      front.push(fig(`<svg viewBox="-14 -1.5 28 29" width="${28 * PX}" height="${29 * PX}"><path d="${TEE}" fill="${c}"/>
        <path d="M-3.4,0 Q0,5.4 3.4,0" fill="none" stroke="${collar}" stroke-width="0.7"/>
        <image href="${href(path.join(root, pid, z.file))}" x="${-z.wIn / 2}" y="${LOGO_TOP}" width="${z.wIn}" height="${z.hIn}"/></svg>`,
        `${l.name} · ${z.wIn} × ${z.hIn} in`));
    }
  }
  await shoot(`<body style="margin:0;padding:10px;background:#f4f4f2;display:grid;grid-template-columns:120px repeat(5,auto);gap:6px 10px">${front.join('')}</body>`,
    120 + 5 * (28 * PX + 10) + 30, 'benday-women-samples.png');

  // Back: each palette on a white and a black tee.
  const back = [];
  for (const [pid, pal] of Object.entries(PALETTES)) for (const [sname, [c, collar]] of Object.entries(SHIRTS)) {
    const b = JSON.parse(fs.readFileSync(path.join(root, pid, 'sizes.json'), 'utf8')).back;
    back.push(fig(`<svg viewBox="-14 -1.5 28 29" width="${28 * PX}" height="${29 * PX}"><path d="${BACK_TEE}" fill="${c}"/>
      <path d="M-3.4,0 Q0,1.8 3.4,0" fill="none" stroke="${collar}" stroke-width="0.7"/>
      <rect x="-6" y="${AREA_TOP}" width="12" height="16" fill="none" stroke="#8a8a8a" stroke-width="0.06" stroke-dasharray="0.3 0.2"/>
      <image href="${href(path.join(root, pid, b.file))}" x="-6" y="${AREA_TOP}" width="12" height="16"/></svg>`,
      `${pal.name} · back · ${sname} tee`));
  }
  await shoot(`<body style="margin:0;padding:10px;background:#f4f4f2;display:grid;grid-template-columns:repeat(6,auto);gap:6px 10px">${back.join('')}</body>`,
    6 * (28 * PX + 10) + 30, 'benday-women-back.png');
  fs.unlinkSync(tmp);
  await browser.close();
  console.log('wrote benday-women-samples.png and benday-women-back.png');
})();
