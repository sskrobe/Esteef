// Builds the Baguette round 1 gallery: index.html (each concept on a cream card and on a black card, with its name
// and idea) and baguette-round-1.png (a screenshot of the gallery, needs Playwright), plus svg/<id>.svg.
// Run: node baguette/logos/round-1/build.js
const fs = require('fs');
const path = require('path');
const { concepts } = require('./concepts');

const svgOf = (c, size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}">${c.svg}</svg>`;
fs.mkdirSync(path.join(__dirname, 'svg'), { recursive: true });
for (const c of concepts) fs.writeFileSync(path.join(__dirname, 'svg', c.id + '.svg'), svgOf(c, 1000));

const cards = concepts.map((c, i) => `
  <div class="concept">
    <div class="pair"><div class="card light">${svgOf(c, 240)}</div><div class="card dark">${svgOf(c, 240)}</div></div>
    <h2>${i + 1}. ${c.name}</h2><p>${c.idea}</p>
  </div>`).join('');
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Baguette Round 1</title>
<style>
  body { margin: 0; padding: 24px; background: #f1ede6; font: 15px/1.45 system-ui, sans-serif; color: #222; }
  h1 { font: 800 28px system-ui; margin: 0 0 4px; } .sub { margin: 0 0 20px; color: #555; }
  .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; }
  .concept { background: #fff; border-radius: 14px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
  .pair { display: flex; gap: 10px; } .card { border-radius: 10px; display: flex; align-items: center; justify-content: center; flex: 1; padding: 8px; }
  .light { background: #fff6e6; } .dark { background: #17171a; }
  h2 { margin: 12px 0 4px; font: 700 19px system-ui; } p { margin: 0; color: #444; }
</style></head><body>
<h1>Baguette ("Bag-Ette") · Round 1</h1><p class="sub">Female mascot concepts: French, sassy, a baguette mixed with a character. Each shown on cream and on black.</p>
<div class="grid">${cards}</div></body></html>`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);

(async () => {
  let chromium; try { ({ chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright')); } catch { console.log('index.html written (no Playwright for the PNG)'); return; }
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const page = await browser.newPage({ viewport: { width: 1180, height: 800 } });
  await page.goto('file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/'));
  await page.screenshot({ path: path.join(__dirname, 'baguette-round-1.png'), fullPage: true });
  await browser.close();
  console.log('built', concepts.length, 'concepts');
})();
