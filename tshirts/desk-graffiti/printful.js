// Renders the school-desk tee as Printful all-over print files into printful/:
//   front.jpg, back.jpg, sleeve-left.jpg, sleeve-right.jpg  desk panels, no logo (150 dpi, oversized
//                                                           so Printful can crop each to its template)
//   front-with-logo.jpg                                     front panel with Raising Hell on the left chest
//   raising-hell-patch.png                                  the logo on its white-out patch, transparent
// Run: node tshirts/desk-graffiti/printful.js   (needs Playwright)
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const out = path.join(__dirname, 'printful');
// Panels are 3000 design units wide at scale 1.2 = 3600 px = 24 in at 150 dpi, so 125 units = 1 inch.
// Left chest (wearer's left = viewer's right): about 4 in right of center, about 9 in below the top
// of the panel, 4 in wide.
const LEFT_CHEST = '2000,1120,500';
const JOBS = [
  { file: 'front.jpg', q: 'seed=19970914&w=3000&h=4000&s=1.2' },
  { file: 'front-with-logo.jpg', q: `seed=19970914&w=3000&h=4000&s=1.2&logo=${LEFT_CHEST}` },
  { file: 'back.jpg', q: 'seed=20010911&w=3000&h=4000&s=1.2' },
  { file: 'sleeve-left.jpg', q: 'seed=19990420&w=3000&h=2000&s=1.2' },
  { file: 'sleeve-right.jpg', q: 'seed=19950606&w=3000&h=2000&s=1.2' },
  { file: 'raising-hell-patch.png', q: 'only=logo&w=2400&h=2400&s=1' },
];

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const tab = await browser.newPage({ viewport: { width: 1200, height: 1200 } });
  for (const job of JOBS) {
    await tab.goto('file://' + path.join(__dirname, 'desk.html') + '?' + job.q);
    await tab.waitForFunction(() => window.DONE === true, null, { timeout: 240000 });
    const png = job.file.endsWith('.png');
    const data = await tab.evaluate(isPng => document.getElementById('c').toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.95), png);
    fs.writeFileSync(path.join(out, job.file), Buffer.from(data.split(',')[1], 'base64'));
    console.log('wrote', job.file);
  }
  await browser.close();
})();
