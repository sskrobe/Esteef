// Official Coma Toast marks: X'd-out eyes, Soft Pulse heartbeat mouth (Round 13, option E),
// and the four go-forward toppers: Saint, Little Devil, Heaven Sent, Raising Hell.
const round13 = require('../round-13/logos');

const notes = {
  saint: 'Halo only. The cleanest mark: knocked out, but clearly a good soul.',
  'little-devil': 'Two small horns on the crust bumps. Changes the whole outline with almost no extra width.',
  'heaven-sent': 'Halo and rounded angel wings: the full angel, and the most crest-like of the four.',
  'raising-hell': 'Horns and pointed bat wings: the full devil, and the sharpest outline of the four.',
};

const row = round13.grid.find(r => r.id === 'soft-pulse');
const logos = row.marks.map(m => {
  const id = m.id.split('--')[0];
  return { ...m, id, note: notes[id], edge: m.edge, animal: 'Coma Toast', style: 'Final', group: 'final' };
});

module.exports = { logos, kept: logos, fresh: [], renderLogo: round13.renderLogo };
