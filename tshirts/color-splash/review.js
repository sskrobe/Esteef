// Renders the review set for the $Daily Bread$ back wordmark and the three colorway versions:
//   review/fonts/<font>-<colorway>.png   the wordmark on its own (transparent), every font x colorway
//   review/shirts/<front|back>-<colorway>[-<font>].jpg   small panel previews
// Run: node tshirts/color-splash/review.js   (needs Playwright)
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const FONTS = ['blackletter', 'couture', 'neon', 'pixel', 'signature', 'block', 'wet-paint', 'spray', 'handstyle', 'throw-up', 'pixel-tag', 'pixel-drip', 'pixel-throw'];
const CWS = ['hot-wire', 'toxic', 'riot'];
// The toast is 10 in tall and about 9.7 in wide (stretched slightly lengthwise), its top edge about
// 6.1 in down, centered on the chest.
const CHEST = '1500,1391,1207,1250';
const jobs = [];
for (const f of FONTS) for (const cw of CWS) jobs.push({ file: `fonts/${f}-${cw}.png`, q: `only=wordmark&w=1400&h=420&s=1&cw=${cw}&wm=${f}` });
for (const cw of CWS) {
  jobs.push({ file: `shirts/front-${cw}.jpg`, q: `panel=front&seed=3&w=3000&h=4000&s=0.3&cw=${cw}&logo=${CHEST}` });
  for (const f of FONTS) jobs.push({ file: `shirts/back-${cw}-${f}.jpg`, q: `panel=back&seed=11&w=3000&h=4000&s=0.3&cw=${cw}&wm=${f}` });
}

(async () => {
  const browser = await chromium.launch();
  const tab = await browser.newPage();
  for (const job of jobs) {
    await tab.goto('file://' + path.join(__dirname, 'splash.html') + '?' + job.q);
    await tab.waitForFunction(() => window.DONE === true, null, { timeout: 120000 });
    const png = job.file.endsWith('.png');
    const data = await tab.evaluate(isPng => document.getElementById('c').toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.88), png);
    fs.writeFileSync(path.join(__dirname, 'review', job.file), Buffer.from(data.split(',')[1], 'base64'));
  }
  await browser.close();
  console.log('wrote', jobs.length, 'files');
})();
