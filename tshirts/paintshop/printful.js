// Renders the final PaintShop tee files for Printful, one folder per colorway (printful/<colorway>/):
//   front.jpg           front panel: the 10 in outline toast centered in its clean window
//   front-no-logo.jpg   the same front without the toast (add the logo PNG as a layer instead)
//   back.jpg            back panel: square paint, $Daily Bread$ (Wet Paint) at the hem, hidden "Esteef"
//   sleeve-left.jpg, sleeve-right.jpg
//   coma-toast-<colorway>.png       the logo alone, transparent, at the shirt's proportions
//   daily-bread-<colorway>.png      the $Daily Bread$ wordmark alone, transparent
// Panels are 3000 design units wide at scale 1.2 = 3600 px = 24 in at 150 dpi (125 units = 1 in).
// Run: node tshirts/paintshop/printful.js   (needs Playwright; run make-logo.js first)
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const out = path.join(__dirname, 'printful');
// The toast is 10 in tall and about 9.7 in wide, its top edge about 6.1 in down, centered on the chest.
const CHEST = '1500,1391,1207,1250';
const WORDMARK = 'wet-paint';
const COLORWAYS = (process.env.CW || 'hot-wire,toxic,riot').split(',');
const jobs = cw => [
  { file: 'front.jpg', q: `panel=front&seed=3&w=3000&h=4000&s=1.2&cw=${cw}&logo=${CHEST}` },
  { file: 'front-no-logo.jpg', q: `panel=front&seed=3&w=3000&h=4000&s=1.2&cw=${cw}&logo=${CHEST}&hide=1` },
  { file: 'back.jpg', q: `panel=back&seed=11&w=3000&h=4000&s=1.2&cw=${cw}&wm=${WORDMARK}` },
  { file: 'sleeve-left.jpg', q: `panel=sleeve&seed=21&w=3000&h=2000&s=1.2&cw=${cw}` },
  { file: 'sleeve-right.jpg', q: `panel=sleeve&seed=34&w=3000&h=2000&s=1.2&cw=${cw}` },
  { file: `coma-toast-${cw}.png`, q: `only=logo&w=3000&h=3000&s=1&cw=${cw}&logo=${CHEST}` },
  { file: `daily-bread-${cw}.png`, q: `only=wordmark&w=3000&h=900&s=1&cw=${cw}&wm=${WORDMARK}` },
  // small previews for the page
  { file: 'preview/front.jpg', q: `panel=front&seed=3&w=3000&h=4000&s=0.4&cw=${cw}&logo=${CHEST}` },
  { file: 'preview/back.jpg', q: `panel=back&seed=11&w=3000&h=4000&s=0.4&cw=${cw}&wm=${WORDMARK}` },
  { file: 'preview/sleeve-left.jpg', q: `panel=sleeve&seed=21&w=3000&h=2000&s=0.4&cw=${cw}` },
  { file: 'preview/sleeve-right.jpg', q: `panel=sleeve&seed=34&w=3000&h=2000&s=0.4&cw=${cw}` },
];

(async () => {
  const browser = await chromium.launch();
  const tab = await browser.newPage();
  for (const cw of COLORWAYS) {
    fs.mkdirSync(path.join(out, cw, 'preview'), { recursive: true });
    for (const job of jobs(cw)) {
      await tab.goto('file://' + path.join(__dirname, 'splash.html') + '?' + job.q);
      await tab.waitForFunction(() => window.DONE === true, null, { timeout: 240000 });
      const png = job.file.endsWith('.png');
      const data = await tab.evaluate(isPng => document.getElementById('c').toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.95), png);
      fs.writeFileSync(path.join(out, cw, job.file), Buffer.from(data.split(',')[1], 'base64'));
      console.log('wrote', cw + '/' + job.file);
    }
  }
  await browser.close();
})();
