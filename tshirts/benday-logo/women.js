// Women's Benday Logo tee: the same design as the men's, in feminine accent colors (black and white stay),
// sized for the Bella+Canvas 6400 Women's Relaxed T-Shirt (front & back print area 12 x 16 in for L-3XL,
// 10 x 12 in for S-M; Printful scales the graphic per size).
// Run: node tshirts/benday-logo/women.js   renders every palette (make.js, back.js) into women/<palette>/,
// then node tshirts/benday-logo/mockup-women.js for the sheets.
const path = require('path');
const { execFileSync } = require('child_process');

const PALETTES = {
  'hot-pink': { name: 'Hot Pink', color: '#ff2e88' },   // the brand pink (PaintShop Hot Wire)
  'blush': { name: 'Blush', color: '#f27ba8' },
  'lilac': { name: 'Lilac', color: '#9a6ad6' },
};
// Women's front art box (inches, at the L-3XL print area): same chest proportion as the men's 10.5 x 12 in
// on a narrower body; lettering on the back 6 in wide.
const BOX = { w: 9.5, h: 10.8 }, BACK_TEXT_IN = 6;

// The final pick for the women's tee (2026-10-13): Saint in Hot Pink.
const FINAL = ['saint', 'hot-pink'];

module.exports = { PALETTES, BOX, BACK_TEXT_IN, FINAL };

if (require.main === module) {
  for (const [id, p] of Object.entries(PALETTES)) {
    const env = { ...process.env, ACCENT: p.color, OUT: path.join(__dirname, 'women', id), BOX_W_IN: BOX.w, BOX_H_IN: BOX.h, TEXT_W_IN: BACK_TEXT_IN };
    console.log(`== ${p.name} ${p.color}`);
    execFileSync(process.execPath, [path.join(__dirname, 'make.js')], { env, stdio: 'inherit' });
    execFileSync(process.execPath, [path.join(__dirname, 'back.js')], { env, stdio: 'inherit' });
  }
}
