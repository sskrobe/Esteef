// True-scale mockup sheet for the Benday Logo: each mark on a size L tee (about 22 x 30 in body),
// centered, top of the art 1.5 in below the front collar seam, at its 10.5 x 12 in box size.
// Run after make.js: node tshirts/benday-logo/mockup.js
const fs = require('fs');
const path = require('path');
const { logos } = require('./benday');

const files = path.join(__dirname, 'files');
const sizes = JSON.parse(fs.readFileSync(path.join(files, 'sizes.json'), 'utf8'));
const PX = 14;   // pixels per inch on the sheet
const SHIRTS = [{ name: 'White', color: '#f7f7f5', collar: '#e4e4e2' }, { name: 'Black', color: '#17171a', collar: '#232327' }];

// Tee outline in inches, centered on x = 0, y = 0 at the shoulder line beside the neck.
const NECK_W = 3.6, NECK_DROP = 3.0, COLLAR = 0.75;
const TEE = 'M-3.6,0 L-9.8,1.2 L-15.6,7.6 L-12.6,10.8 L-11,9.3 L-11,30 L11,30 L11,9.3 L12.6,10.8 L15.6,7.6 L9.8,1.2 L3.6,0 Q0,6 -3.6,0 Z';
const LOGO_TOP = NECK_DROP + 1.5;   // 1.5 in below the collar seam at center front

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage({ viewport: { width: 5 * 33 * PX + 60, height: 2 * 36 * PX + 40 } });
  const cell = (l, s) => {
    const z = sizes[l.id];
    return `<figure style="margin:0;text-align:center;font:600 15px system-ui;color:#333">
      <svg viewBox="-16.5 -2 33 33.5" width="${33 * PX}" height="${33.5 * PX}">
        <path d="${TEE}" fill="${s.color}"/>
        <path d="M-3.6,0 Q0,6 3.6,0" fill="none" stroke="${s.collar}" stroke-width="${COLLAR}"/>
        <image href="file:///${files.replace(/\\/g, '/')}/${z.file}" x="${-z.wIn / 2}" y="${LOGO_TOP}" width="${z.wIn}" height="${z.hIn}"/>
      </svg><figcaption>${l.name} · ${z.wIn} × ${z.hIn} in · ${s.name}</figcaption></figure>`;
  };
  const html = `<body style="margin:0;padding:10px;background:#f4f4f2;display:grid;grid-template-columns:repeat(5,auto);gap:4px 12px">
    ${SHIRTS.map(s => logos.map(l => cell(l, s)).join('')).join('')}</body>`;
  const tmp = path.join(files, '_sheet.html');
  fs.writeFileSync(tmp, html);
  await page.goto('file:///' + tmp);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(__dirname, 'benday-logo-samples.png'), fullPage: true });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log('wrote benday-logo-samples.png');
})();
