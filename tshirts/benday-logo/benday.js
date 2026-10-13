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

// Swatch style (like a streetwear chest graphic on a painted block): the mark sits on a rough blue
// paint swatch made of Ben-Day stipple, with PaintShop-style rough edges, dry-brush streaks off the
// ends and square paint chips. The mark itself goes mostly white so it pops off the blue: light dots,
// a heavier black outline, no keyline, blue accents (horns).
const FILL_SWATCH = {
  'toast': { crust: [0.55, 1.15], face: [0.25, 0.7] },
  'halo': { dots: [0.3, 0.6] },
  'angel-wings': { dots: [0.35, 0.9] },
  'bat-wings': { dots: [0.75, 1.35] },
  'horns': { solid: true },
};
// Hugs the toast like the reference block hugs the character: halo and horns break out of the top and the
// wings overhang the sides, the way the bunny's ears and crossbones do.
const SW = { x0: 38, y0: 60, x1: 162, y1: 200, tilt: -2.2, pitch: 5.2 };

function rng(seed) {
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

// sw is the block in drawing units (default: behind the toast); the back wordmark passes its own, with
// optional n: [points per long edge, per short edge], jx (end raggedness), streaks and scratches counts.
function swatch(seed, id, sw = SW) {
  const r = rng(seed), R = (a, b) => a + r() * (b - a);
  const { x0, y0, x1, y1, pitch } = sw;
  // rough outline: jittered points along each edge, the left and right ends more ragged (brush ends)
  const pts = [];
  const edge = (ax, ay, bx, by, n, jx, jy) => { for (let i = 0; i < n; i++) { const t = i / n; pts.push([ax + (bx - ax) * t + R(-jx, jx), ay + (by - ay) * t + R(-jy, jy)]); } };
  const [nTop, nSide] = sw.n || [24, 30], jx = sw.jx ?? 4.5;
  edge(x0, y0, x1, y0, nTop, 1, 2.2);
  edge(x1, y0, x1, y1, nSide, jx, 1);
  edge(x1, y1, x0, y1, nTop, 1, 2.2);
  edge(x0, y1, x0, y0, nSide, jx, 1);
  const outline = `<path d="M${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' L')} Z"/>`;
  // stipple: dots nearly touching at the bottom right, opening up toward the top left
  const d = [];
  for (let row = 0, y = y0 - 6; y <= y1 + 6; row++, y += pitch / 2)
    for (let x = x0 - 6 + (row % 2 ? pitch / 2 : 0); x <= x1 + 6; x += pitch) {
      const t = Math.min(1, Math.max(0, ((x - x0) + (y - y0)) / ((x1 - x0) + (y1 - y0))));
      d.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.35 + 1.25 * t).toFixed(2)}"/>`);
    }
  // dry-brush streaks off the left and right ends, and square chips (the PaintShop paint)
  const extra = [];
  for (const side of [-1, 1]) for (let i = 0; i < (sw.streaks ?? 11); i++) {
    const y = R(y0 + 4, y1 - 4), len = R(4, 14), h = R(1.2, 3.6), x = side < 0 ? x0 - len + R(0, 5) : x1 - R(0, 5);
    extra.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${len.toFixed(1)}" height="${h.toFixed(1)}"/>`);
  }
  for (let i = 0; i < 18; i++) {
    // just outside the swatch, along its top and bottom edges and off its corners
    const top = r() < 0.5, cx = R(x0 - 8, x1 + 8), cy = top ? y0 - R(3, 9) : y1 + R(3, 9), s = R(1.6, 4.4);
    extra.push(`<rect x="${(cx - s / 2).toFixed(1)}" y="${(cy - s / 2).toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" transform="rotate(${R(-20, 20).toFixed(0)} ${cx.toFixed(1)} ${cy.toFixed(1)})"/>`);
  }
  // dry-brush scratches: thin horizontal gaps through the paint, mostly toward the ragged ends
  const scratches = [];
  for (let i = 0; i < (sw.scratches ?? 26); i++) {
    const left = r() < 0.5, len = R(8, 34), y = R(y0 + 3, y1 - 3), h = R(0.5, 1.6);
    const x = left ? x0 - 2 + R(0, 14) : x1 + 2 - len - R(0, 14);
    scratches.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${len.toFixed(1)}" height="${h.toFixed(1)}"/>`);
  }
  return {
    def: `<mask id="${id}" maskUnits="userSpaceOnUse" x="-30" y="-30" width="260" height="260"><g fill="#fff">${outline}</g><g fill="#000">${scratches.join('')}</g></mask>`,
    art: `<g transform="rotate(${sw.tilt} ${(x0 + x1) / 2} ${(y0 + y1) / 2})" fill="${BLUE}"><g mask="url(#${id})">${d.join('')}</g>${extra.join('')}</g>`,
  };
}

function buildSvg(logo, { size = 1000, style = 'sticker', seed = 5 } = {}) {
  const SWATCH = style === 'swatch', FILLS = SWATCH ? FILL_SWATCH : FILL, LINE = SWATCH ? OUTLINE + 1.5 : OUTLINE;
  const defs = [], keyline = [], body = [];
  let backdrop = '';
  if (SWATCH) { const s = swatch(seed, `sw-${logo.id}`); defs.push(s.def); backdrop = s.art; }
  logo.parts.forEach((p, i) => {
    const k = kind(p), f = FILLS[k], id = `c-${logo.id}-${i}`;
    if (!SWATCH) keyline.push(`<g fill="${WHITE}" stroke="${WHITE}" stroke-width="${OUTLINE + KEYLINE}" stroke-linejoin="round">${p.shape}</g>`);
    defs.push(area(id, p.shape));
    let fill = `<g fill="${f.solid ? BLUE : WHITE}" stroke="none">${p.shape}</g>`;
    if (k === 'toast') {
      defs.push(area(`${id}-face`, FACE));
      fill += dots(id, ...f.crust)
        + `<g fill="${WHITE}" mask="url(#${id})">${FACE}</g>`
        + dots(`${id}-face`, ...f.face) + SHINE;
    } else if (f.dots) fill += dots(id, ...f.dots);
    body.push(`<g fill="${INK}" stroke="${INK}" stroke-width="${LINE}" stroke-linejoin="round">${p.shape}</g>`
      + fill + (p.detail ? p.detail.replace(/#000/g, INK) : ''));
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 240 240" width="${size}" height="${size}">`
    + `<title>Coma Toast ${logo.name}, Benday</title><defs>${defs.join('')}</defs>`
    + backdrop + keyline.join('') + body.join('') + '</svg>';
}

module.exports = { logos, buildSvg, swatch, COLORS: { INK, WHITE, BLUE } };
