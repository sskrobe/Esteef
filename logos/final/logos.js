// Official Coma Toast marks: X'd-out eyes, Soft Pulse heartbeat mouth (Round 13, option E),
// and the four go-forward toppers: Saint, Little Devil, Heaven Sent, Raising Hell.
const round13 = require('../round-13/logos');

const notes = {
  saint: 'Halo only. The cleanest mark: knocked out, but clearly a good soul.',
  'little-devil': 'Two small horns on the crust bumps. Changes the whole outline with almost no extra width.',
  'heaven-sent': 'Halo and rounded angel wings: the full angel, and the most crest-like of the four.',
  'raising-hell': 'Horns and pointed bat wings: the full devil, and the sharpest outline of the four.',
};

// Final placement tweaks (in the toast's own drawing units unless noted):
// - EYE_LIFT raises both eyes; EYE_INSET pulls each eye toward the center (same height for both).
// - MOUTH_LIFT raises the mouth a little less than the eyes, so it sits a touch lower on the face.
// - The halo floats clear of the crust: its bottom edge sits HALO_CLEARANCE above the top of the
//   crust (page units), and it skips the cut-out gap so it never bites into the toast.
const EYE_LIFT = 12;
const EYE_INSET = 4;
const MOUTH_LIFT = 7;
const HALO_CLEARANCE = 3.5;

const row = round13.grid.find(r => r.id === 'soft-pulse');
const EYES = [
  { re: /<path d="M70,118 L86,134 M86,118 L70,134"[^>]*\/>/, dx: EYE_INSET },
  { re: /<path d="M114,118 L130,134 M130,118 L114,134"[^>]*\/>/, dx: -EYE_INSET },
];
const isHalo = p => p.shape.includes('fill-rule="evenodd"') && p.shape.includes('A38,9');

// Top of the crust (center of the slice) and the halo's original center, in page units.
// Round 11 draws the toast at scale 0.78, shifted down 12; the crust's top curve peaks at y 53.5.
const CRUST_TOP = 118 + (53.5 - 118) * 0.78 + 12;
const HALO_CY = 118 - 68 * 0.78 + 12 - 11;
const HALO_RY = 9;
const haloShift = CRUST_TOP - HALO_CLEARANCE - HALO_RY - HALO_CY;

function finish(m) {
  return m.parts.map(p => {
    if (isHalo(p)) return { shape: `<g transform="translate(0,${haloShift.toFixed(2)})">${p.shape}</g>`, detail: p.detail, noGap: true };
    if (!p.detail || !p.detail.includes(row.svg)) return p;
    let detail = p.detail.replace(row.svg, `<g transform="translate(0,${-MOUTH_LIFT})">${row.svg}</g>`);
    EYES.forEach(({ re, dx }) => {
      if (!re.test(detail)) throw new Error(`eyes not found in ${m.id}`);
      detail = detail.replace(re, e => `<g transform="translate(${dx},${-EYE_LIFT})">${e}</g>`);
    });
    return { ...p, detail };
  });
}

const toppered = row.marks.map(m => {
  const id = m.id.split('--')[0];
  return { ...m, id, parts: finish(m), note: notes[id], animal: 'Coma Toast', style: 'Final', group: 'final' };
});

// The plain mark: just the toast and its face, no topper.
const saint = toppered.find(m => m.id === 'saint');
const plain = {
  ...saint,
  id: 'plain',
  name: 'Coma Toast',
  edge: 'No topper',
  note: 'Just the toast and its face, no halo, horns or wings. The base mark every other version builds on.',
  parts: saint.parts.filter(p => !p.noGap),
};

const logos = [plain, ...toppered];

module.exports = { logos, kept: logos, fresh: [], renderLogo: round13.renderLogo };
