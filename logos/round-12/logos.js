// Round 12: the same fifteen heaven/hell marks as Round 11, with a more mouth-like heartbeat.
// The mouth is a longer, flatter line sitting where a mouth sits, with one small, compact
// heartbeat blip in the middle (small P bump, short spike, small T bump). Still straight and
// expressionless: it never curves up or down at the ends.
const round11 = require('../round-11/logos');

const OLD = 'M74,152 L88,152 L93,143 L99,161 L105,138 L110,152 L126,152';
const NEW = 'M78,150 L89,150 Q91.5,146.5 94,150 L96,150 L98.5,155 L101.5,139 L104.5,157 L107,150 L109,150 Q111.5,146.5 114,150 L122,150';

const all = round11.logos.map(m => ({
  ...m,
  parts: m.parts.map(p => ({
    ...p,
    detail: p.detail && p.detail.includes(OLD)
      ? p.detail.replace(OLD, NEW).replace('stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>\n  </g>', 'stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>\n  </g>')
      : p.detail,
  })),
}));

if (!all.every(m => m.parts.some(p => p.detail.includes(NEW)))) throw new Error('heartbeat mouth not replaced');
module.exports = { logos: all, kept: [], fresh: all, renderLogo: round11.renderLogo };
