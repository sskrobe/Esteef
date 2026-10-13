// Official Coma Toast marks: X'd-out eyes, Soft Pulse heartbeat mouth (Round 13, option E),
// and the four go-forward toppers: Saint, Little Devil, Heaven Sent, Raising Hell.
const round13 = require('../round-13/logos');

const notes = {
  saint: 'Halo only. The cleanest mark: knocked out, but clearly a good soul.',
  'little-devil': 'Two small horns on the crust bumps. Changes the whole outline with almost no extra width.',
  'heaven-sent': 'Halo and rounded angel wings: the full angel, and the most crest-like of the four.',
  'raising-hell': 'Horns and pointed bat wings: the full devil, and the sharpest outline of the four.',
};

// Final placement tweaks:
// - FACE_LIFT raises the eyes and mouth inside the slice so the forehead isn't so large.
// - HALO_DROP lowers the halo so it sits closer to the crust.
const FACE_LIFT = 12;
const HALO_DROP = 6;

const row = round13.grid.find(r => r.id === 'soft-pulse');
const EYES = [/<path d="M70,118 L86,134 M86,118 L70,134"[^>]*\/>/, /<path d="M114,118 L130,134 M130,118 L114,134"[^>]*\/>/];
const isHalo = p => p.shape.includes('fill-rule="evenodd"') && p.shape.includes('A38,9');

const logos = row.marks.map(m => {
  const id = m.id.split('--')[0];
  const parts = m.parts.map(p => {
    if (isHalo(p)) return { shape: `<g transform="translate(0,${HALO_DROP})">${p.shape}</g>`, detail: p.detail };
    if (!p.detail || !p.detail.includes(row.svg)) return p;
    let detail = p.detail.replace(row.svg, `<g transform="translate(0,${-FACE_LIFT})">${row.svg}</g>`);
    EYES.forEach(re => {
      if (!re.test(detail)) throw new Error(`eyes not found in ${id}`);
      detail = detail.replace(re, e => `<g transform="translate(0,${-FACE_LIFT})">${e}</g>`);
    });
    return { ...p, detail };
  });
  return { ...m, id, parts, note: notes[id], edge: m.edge, animal: 'Coma Toast', style: 'Final', group: 'final' };
});

module.exports = { logos, kept: logos, fresh: [], renderLogo: round13.renderLogo };
