// Round 13: mouth study. The four go-forward designs (Saint, Little Devil, Heaven Sent, Raising Hell)
// each paired with seven heartbeat mouths: the current one from Round 12 plus six new takes.
// Every mouth stays level at both ends (no smile, no frown). Coordinates are in the toast's own
// drawing space, where the eyes sit at y 118-134 and the face spans roughly x 62-138.
const round11 = require('../round-11/logos');
const { renderLogo } = round11;
const W = '#fff', K = '#000';

const line = (d, w = 4.5) => `<path d="${d}" fill="none" stroke="${K}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

const MOUTHS = [
  {
    id: 'current', name: 'Current (Round 12)',
    note: 'For reference: flat line with a small P-bump, spike and T-bump.',
    svg: line('M78,150 L89,150 Q91.5,146.5 94,150 L96,150 L98.5,155 L101.5,139 L104.5,157 L107,150 L109,150 Q111.5,146.5 114,150 L122,150'),
  },
  {
    id: 'single-spike', name: 'Single Spike',
    note: 'A plain mouth line with one short spike just right of center. The simplest heartbeat that still reads.',
    svg: line('M80,151 L95,151 L98,155 L101.5,141 L105,151 L120,151'),
  },
  {
    id: 'centered-spike', name: 'Centered Spike',
    note: 'A short, symmetrical dip-spike-dip in the middle of a short line. Balanced, like the rest of the face.',
    svg: line('M84,151 L94,151 L97,156 L100,141 L103,156 L106,151 L116,151'),
  },
  {
    id: 'monitor-slot', name: 'Monitor Slot',
    note: 'A closed dark mouth slot with the heartbeat running through it, like a tiny monitor screen. Reads as a mouth first.',
    svg: `<rect x="76" y="142" width="48" height="18" rx="9" fill="${K}"/><path d="M81,151 L93,151 L96,147 L100,156 L103.5,145 L106.5,151 L119,151" fill="none" stroke="${W}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    id: 'pierced-bar', name: 'Pierced Bar',
    note: 'A solid mouth bar, as if the lips are pressed shut, with a single heartbeat spike shooting through it.',
    svg: `<rect x="78" y="147" width="44" height="8" rx="4" fill="${K}"/>${line('M101,151 L104,151 L107,140 L110.5,161 L113.5,151 L116,151', 4)}`,
  },
  {
    id: 'soft-pulse', name: 'Soft Pulse',
    note: 'A gentle wave instead of a sharp spike. Softer and more mouth-like, though it reads less "medical".',
    svg: line('M80,151 L91,151 Q95.5,144 100,151 Q104.5,158 109,151 L120,151'),
  },
  {
    id: 'beep-dashes', name: 'Beep Dashes',
    note: 'A dashed flatline with one blip in the middle, like a monitor trace beeping. The most "screen" of the set.',
    svg: line('M76,151 L81,151 M85,151 L90,151 M94,151 L96,151 L98.5,155 L101.5,142 L104,151 L106,151 M110,151 L115,151 M119,151 L124,151', 4.2),
  },
];

const DESIGNS = ['saint', 'little-devil', 'heaven-sent', 'raising-hell'];
const OLD = /<path d="M74,152 L88,152 L93,143 L99,161 L105,138 L110,152 L126,152"[^>]*\/>/;

const grid = MOUTHS.map(mouth => ({
  ...mouth,
  marks: DESIGNS.map(id => {
    const base = round11.logos.find(m => m.id === id);
    const parts = base.parts.map(p => (p.detail && OLD.test(p.detail) ? { ...p, detail: p.detail.replace(OLD, mouth.svg) } : p));
    if (!parts.some(p => p.detail && p.detail.includes(mouth.svg))) throw new Error(`mouth not applied to ${id}`);
    return { ...base, id: `${id}--${mouth.id}`, parts };
  }),
}));

module.exports = { grid, DESIGNS, renderLogo };
