// Exports production files for the official marks into files/:
//   files/svg/<name>-black.svg, files/svg/<name>-white.svg  (one color, cut-outs transparent)
//   files/png/<name>-black.png, files/png/<name>-white.png  (3000 x 3000, transparent background)
// Run: node logos/final/export.js   (needs Playwright for the PNGs)
// SIZE=6000 OUT=/some/dir node logos/final/export.js renders larger PNGs into another folder.
const fs = require('fs');
const path = require('path');
const { logos, renderLogo } = require('./logos');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const COLORS = { black: '#111111', white: '#ffffff' };
const SIZE = +(process.env.SIZE || 3000);
const out = process.env.OUT || path.join(__dirname, 'files');

(async () => {
  fs.mkdirSync(path.join(out, 'svg'), { recursive: true });
  fs.mkdirSync(path.join(out, 'png'), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE } });
  for (const l of logos) {
    for (const [name, color] of Object.entries(COLORS)) {
      const base = `coma-toast-${l.id}-${name}`;
      fs.writeFileSync(path.join(out, 'svg', base + '.svg'), renderLogo(l, { color, size: 1000 }) + '\n');
      await page.setContent(`<style>html,body{margin:0;background:transparent}</style>${renderLogo(l, { color, size: SIZE, title: false })}`);
      await page.screenshot({ path: path.join(out, 'png', base + '.png'), omitBackground: true, clip: { x: 0, y: 0, width: SIZE, height: SIZE } });
    }
  }
  await browser.close();
  console.log(`Exported ${logos.length * 2} SVGs and ${logos.length * 2} PNGs to ${out}`);
})();
