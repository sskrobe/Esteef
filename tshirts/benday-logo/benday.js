// Benday Logo: the official Coma Toast marks drawn filled, in comic-book inking with Ben-Day dot color.
// Black outlines and face lines, a white keyline outside the outline (so the mark reads on any shirt
// color), and blue Ben-Day dots on a white base for the fills. Three colors only: black, white, blue.
// buildSvg(logo, { size }) returns a standalone SVG on a transparent background (200-unit drawing).
const { logos } = require('../../logos/final/logos');

const INK = '#111111', WHITE = '#ffffff', BLUE = '#1e63d6';
const OUTLINE = 7;   // black outline stroke, centered on each shape edge (3.5 units shows outside)
const KEYLINE = 6;   // extra white rim outside the black outline (3 units)
const PITCH = 4.6;   // dot spacing in drawing units (about 0.23 in on a 10 in mark): big, pop-art dots

// What each part is, from its geometry.
const kind = p =>
  p.shape.includes('A38,9') ? 'halo'
  : p.shape.includes('M50,106') ? 'toast'
  : p.shape.includes('A9,9') ? 'angel-wings'
  : p.shape.includes('L12,60') ? 'bat-wings'
  : 'horns';

// The toast's inner crust line (same transform as the toast) bounds the lighter face area.
const TOAST_T = 'translate(100,130) scale(0.78) translate(-100,-118)';
// A white comic shine on the top-left of the crust.
const SHINE = `<g transform="${TOAST_T}"><path d="M37,95 Q33,77 50,70" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/><circle cx="57" cy="68" r="2.4" fill="#ffffff"/></g>`;
const FACE = `<g transform="${TOAST_T}"><path d="M62,108 C44,106 44,78 66,74 C78,62 122,62 134,74 C156,78 156,106 138,108 L138,174 L62,174 Z"/></g>`;

// Ben-Day dots on a 45-degree grid. Dot radius grows from rMin to rMax along the light direction
// (top left, light; bottom right, dark), which gives the comic shading.
function dots(id, rMin, rMax, box = [0, 0, 200, 200]) {
  const [x0, y0, x1, y1] = box, out = [];
  for (let row = 0, y = y0; y <= y1; row++, y += PITCH / 2) {
    for (let x = x0 + (row % 2 ? PITCH / 2 : 0); x <= x1; x += PITCH) {
      const t = Math.min(1, Math.max(0, ((x - 20) + (y - 30)) / 300));
      const r = rMin + (rMax - rMin) * t;
      out.push(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r.toFixed(2)}"/>`);
    }
  }
  return `<g fill="${BLUE}" mask="url(#${id})">${out.join('')}</g>`;
}

// Masks, not clip paths: the parts are groups with transforms, which clipPath doesn't allow.
const area = (id, shape) => `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><g fill="#fff" stroke="none">${shape}</g></mask>`;

// How each kind is filled: dot range (or solid blue) over a white base.
const FILL = {
  'toast': { crust: [1.45, 2.1], face: [0.5, 1.3] },
  'halo': { dots: [0.45, 0.95] },
  'angel-wings': { dots: [0.6, 1.6] },
  'bat-wings': { dots: [1.2, 2.0] },
  'horns': { solid: true },
};

function buildSvg(logo, { size = 1000 } = {}) {
  const defs = [], keyline = [], body = [];
  logo.parts.forEach((p, i) => {
    const k = kind(p), f = FILL[k], id = `c-${logo.id}-${i}`;
    keyline.push(`<g fill="${WHITE}" stroke="${WHITE}" stroke-width="${OUTLINE + KEYLINE}" stroke-linejoin="round">${p.shape}</g>`);
    defs.push(area(id, p.shape));
    let fill = `<g fill="${f.solid ? BLUE : WHITE}" stroke="none">${p.shape}</g>`;
    if (k === 'toast') {
      defs.push(area(`${id}-face`, FACE));
      fill += dots(id, ...f.crust)
        + `<g fill="${WHITE}" mask="url(#${id})">${FACE}</g>`
        + dots(`${id}-face`, ...f.face) + SHINE;
    } else if (f.dots) fill += dots(id, ...f.dots);
    body.push(`<g fill="${INK}" stroke="${INK}" stroke-width="${OUTLINE}" stroke-linejoin="round">${p.shape}</g>`
      + fill + (p.detail ? p.detail.replace(/#000/g, INK) : ''));
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}">`
    + `<title>Coma Toast ${logo.name}, Benday</title><defs>${defs.join('')}</defs>`
    + keyline.join('') + body.join('') + '</svg>';
}

module.exports = { logos, buildSvg, COLORS: { INK, WHITE, BLUE } };
