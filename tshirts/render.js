// Renders a t-shirt design page (a full-size <canvas>) to a print PNG plus a small JPEG preview.
// Usage: node tshirts/render.js tshirts/desk-graffiti/desk.html tshirts/desk-graffiti/desk-print
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

(async () => {
  const [page, out] = process.argv.slice(2);
  const browser = await chromium.launch();
  const tab = await browser.newPage({ viewport: { width: 1200, height: 1200 } });
  await tab.goto('file://' + path.resolve(page));
  await tab.evaluate(() => document.fonts.ready);
  await tab.waitForFunction(() => window.DONE === true, null, { timeout: 120000 });
  const png = await tab.evaluate(() => document.getElementById('c').toDataURL('image/png'));
  require('fs').writeFileSync(out + '.png', Buffer.from(png.split(',')[1], 'base64'));
  const jpg = await tab.evaluate(() => {
    const c = document.getElementById('c'), s = document.createElement('canvas');
    s.width = 900; s.height = Math.round(900 * c.height / c.width);
    s.getContext('2d').drawImage(c, 0, 0, s.width, s.height);
    return s.toDataURL('image/jpeg', 0.86);
  });
  require('fs').writeFileSync(out + '-preview.jpg', Buffer.from(jpg.split(',')[1], 'base64'));
  await browser.close();
})();
