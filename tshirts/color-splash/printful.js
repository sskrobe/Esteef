// Renders the color-splash tee as Printful all-over print files into printful/:
//   front.jpg              front panel with the Hot Wire Saint centered on the chest
//   front-no-logo.jpg      the same front without the logo (add a logo PNG as a layer instead)
//   back.jpg, sleeve-left.jpg, sleeve-right.jpg
//   saint-<colorway>.png   the crisp logo on a transparent background, one per colorway
// Panels are 3000 design units wide at scale 1.2 = 3600 px = 24 in at 150 dpi (125 units = 1 in).
// Run: node tshirts/color-splash/printful.js   (needs Playwright)
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const out = path.join(__dirname, 'printful');
// Center chest: on the center line, centered about 9 in below the top of the panel, 8 in wide
// (Saint is taller than it is wide, so it stands about 8.7 in tall).
const CHEST = '1500,1110,1000';
const JOBS = [
  { file: 'front.jpg', q: `panel=front&seed=3&w=3000&h=4000&s=1.2&cw=hot-wire&logo=${CHEST}` },
  { file: 'front-no-logo.jpg', q: `panel=front&seed=3&w=3000&h=4000&s=1.2&logo=${CHEST}&hide=1` },
  { file: 'back.jpg', q: 'panel=back&seed=11&w=3000&h=4000&s=1.2' },
  { file: 'sleeve-left.jpg', q: 'panel=sleeve&seed=21&w=3000&h=2000&s=1.2' },
  { file: 'sleeve-right.jpg', q: 'panel=sleeve&seed=34&w=3000&h=2000&s=1.2' },
  ...['hot-wire', 'toxic', 'riot'].map(cw => ({ file: `saint-${cw}.png`, q: `only=logo&w=3000&h=3000&s=1&cw=${cw}` })),
];

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const tab = await browser.newPage({ viewport: { width: 1200, height: 1200 } });
  for (const job of JOBS) {
    await tab.goto('file://' + path.join(__dirname, 'splash.html') + '?' + job.q);
    await tab.waitForFunction(() => window.DONE === true, null, { timeout: 240000 });
    const png = job.file.endsWith('.png');
    const data = await tab.evaluate(isPng => document.getElementById('c').toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.95), png);
    fs.writeFileSync(path.join(out, job.file), Buffer.from(data.split(',')[1], 'base64'));
    console.log('wrote', job.file);
  }
  await browser.close();
})();
