// Renders the final PaintShop tee files for Printful, one folder per colorway (printful/<colorway>/):
//   front.jpg           front panel: the 10 in outline toast centered in its clean window
//   front-no-logo.jpg   the same front without the toast (add the logo PNG as a layer instead)
//   back.jpg            back panel: square paint, $Daily Bread$ (Wet Paint) at the hem, hidden "Esteef"
//   sleeve-left.jpg, sleeve-right.jpg
//   coma-toast-<colorway>.png       the logo alone, transparent, at the shirt's proportions
//   daily-bread-<colorway>.png      the $Daily Bread$ wordmark alone, transparent
// Sizes match Printful's template for the All-Over Print Men's Crew Neck T-Shirt (product 257), read
// from its design maker on 2026-10-13: front and back 28 x 36 in (4200 x 5400 px), sleeves 20 x 12 in
// (3000 x 1800 px), 150 dpi, filled edge to edge. 125 design units = 1 in; scale 1.2 = 150 dpi.
// On the front and back panels the shoulder line at the neck is 2.6 in down (TOP). The strip above it on
// the front is cut out as the collar band, so it stays plain shirt color. The neckline bottoms out
// 8.1 in down on the front and 4.1 in on the back; Printful's safe area runs 9.5 to 33.5 in down.
// Run: node tshirts/paintshop/printful.js   (needs Playwright; run make-logo.js first)
//   PLAYWRIGHT_PATH=<path to playwright or playwright-core>, BROWSER_CHANNEL=msedge to use installed Edge
const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, 'printful');
const PANEL = 'w=3500&h=4500&top=325', SLEEVE = 'w=2500&h=1500';
// The toast is 10 in tall and about 9.7 in wide, centered across the chest, its top edge 9.6 in down
// (at the top of Printful's safe area, about 1.5 in below the neckline cut).
const CHEST = '1750,1825,1207,1250';
// $Daily Bread$: right edge 8.2 in right of center, lowest drip 2.5 in above the bottom of the panel
// (the bottom of Printful's safe area, clear of the hem).
const WM = 'wm=wet-paint&wmr=2770&hem=312';
const COLORWAYS = (process.env.CW || 'hot-wire,toxic,riot').split(',');
const jobs = cw => [
  { file: 'front.jpg', q: `panel=front&seed=3&${PANEL}&s=1.2&cw=${cw}&logo=${CHEST}` },
  { file: 'front-no-logo.jpg', q: `panel=front&seed=3&${PANEL}&s=1.2&cw=${cw}&logo=${CHEST}&hide=1` },
  { file: 'back.jpg', q: `panel=back&seed=11&${PANEL}&s=1.2&cw=${cw}&${WM}` },
  { file: 'sleeve-left.jpg', q: `panel=sleeve&seed=21&${SLEEVE}&s=1.2&cw=${cw}` },
  { file: 'sleeve-right.jpg', q: `panel=sleeve&seed=34&${SLEEVE}&s=1.2&cw=${cw}` },
  { file: `coma-toast-${cw}.png`, q: `only=logo&w=3000&h=3000&s=1&cw=${cw}&logo=${CHEST}` },
  { file: `daily-bread-${cw}.png`, q: `only=wordmark&w=3000&h=900&s=1&cw=${cw}&${WM}` },
  // small previews for the page
  { file: 'preview/front.jpg', q: `panel=front&seed=3&${PANEL}&s=0.4&cw=${cw}&logo=${CHEST}` },
  { file: 'preview/back.jpg', q: `panel=back&seed=11&${PANEL}&s=0.4&cw=${cw}&${WM}` },
  { file: 'preview/sleeve-left.jpg', q: `panel=sleeve&seed=21&${SLEEVE}&s=0.4&cw=${cw}` },
  { file: 'preview/sleeve-right.jpg', q: `panel=sleeve&seed=34&${SLEEVE}&s=0.4&cw=${cw}` },
];

// Tag a file as 150 dpi so Printful reads the intended print size (canvas exports carry 96 dpi or none).
const DPI = 150;
function crc32(buf) {
  let c, crc = 0xffffffff;
  for (const b of buf) {
    c = (crc ^ b) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function setDpi(buf, isPng) {
  if (!isPng) {
    // JFIF APP0 starts at byte 2: units at 13, X/Y density at 14 and 16.
    if (buf.toString('latin1', 6, 11) !== 'JFIF\0') return buf;
    buf[13] = 1; buf.writeUInt16BE(DPI, 14); buf.writeUInt16BE(DPI, 16);
    return buf;
  }
  // PNG: insert a pHYs chunk (pixels per meter) right after IHDR.
  const ppm = Math.round(DPI / 0.0254);
  const body = Buffer.alloc(13);
  body.write('pHYs', 0, 'latin1'); body.writeUInt32BE(ppm, 4); body.writeUInt32BE(ppm, 8); body[12] = 1;
  const chunk = Buffer.alloc(21);
  chunk.writeUInt32BE(9, 0); body.copy(chunk, 4); chunk.writeUInt32BE(crc32(body), 17);
  return Buffer.concat([buf.subarray(0, 33), chunk, buf.subarray(33)]);
}
module.exports = { setDpi };
if (require.main !== module) return;

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  const tab = await browser.newPage();
  for (const cw of COLORWAYS) {
    fs.mkdirSync(path.join(out, cw, 'preview'), { recursive: true });
    for (const job of jobs(cw)) {
      await tab.goto('file://' + path.join(__dirname, 'splash.html') + '?' + job.q);
      await tab.waitForFunction(() => window.DONE === true, null, { timeout: 240000 });
      const png = job.file.endsWith('.png');
      const data = await tab.evaluate(isPng => document.getElementById('c').toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.95), png);
      fs.writeFileSync(path.join(out, cw, job.file), setDpi(Buffer.from(data.split(',')[1], 'base64'), png));
      console.log('wrote', cw + '/' + job.file);
    }
  }
  await browser.close();
})();
