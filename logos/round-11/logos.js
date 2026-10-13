// Round 11: final face (X'd-out eyes + heartbeat mouth) with the full set of heaven/hell toppers:
// top = none | halo | horns | halo + horns, sides = none | angel wings | devil wings | one of each.
// That's 4 x 4 - 1 = 15 marks. Toppers sit tight to the toast (just a clearing gap) and the wings
// tuck close, so the outline stays compact and easy to remember.
const round4 = require('../round-4/logos');
const { K } = round4.helpers;
const renderLogo = round4.renderLogo;

const k = 0.78, dy = 12; // toast scale and offset; toast spans roughly x 42-158, y 77-183
const toastTop = 118 - 68 * k + dy;

const toast = {
  shape: `<g transform="translate(100,${118 + dy}) scale(${k}) translate(-100,-118)"><path d="M50,106 C26,106 26,68 58,64 C70,50 130,50 142,64 C174,68 174,106 150,106 L150,178 Q150,186 142,186 L58,186 Q50,186 50,178 Z"/></g>`,
  detail: `<g transform="translate(100,${118 + dy}) scale(${k}) translate(-100,-118)">
    <path d="M62,108 C44,106 44,78 66,74 C78,62 122,62 134,74 C156,78 156,106 138,108 L138,174 L62,174 Z" fill="none" stroke="${K}" stroke-width="4.5" stroke-linejoin="round"/>
    ${[78, 122].map(x => `<path d="M${x - 8},118 L${x + 8},134 M${x + 8},118 L${x - 8},134" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`).join('')}
    <path d="M74,152 L88,152 L93,143 L99,161 L105,138 L110,152 L126,152" fill="none" stroke="${K}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`,
};

const mirror = s => `<g transform="translate(200,0) scale(-1,1)">${s}</g>`;

// Halo: sits just above the crust. Raised a little when horns are present so it floats between them.
const halo = (lift = 0) => {
  const cy = toastTop - 11 - lift;
  return { shape: `<path fill-rule="evenodd" d="M62,${cy} A38,9 0 1 0 138,${cy} A38,9 0 1 0 62,${cy} Z M72,${cy} A28,4.5 0 1 0 128,${cy} A28,4.5 0 1 0 72,${cy} Z"/>`, detail: '' };
};

// Devil horns rising from the two crust bumps, curving outward; bases tuck behind the toast.
const hornL = `<path d="M60,${toastTop + 22} Q52,${toastTop - 8} 40,${toastTop - 28} Q66,${toastTop - 16} 80,${toastTop + 12} Z"/>`;
const horns = { shape: hornL + mirror(hornL), detail: '' };

// Wings sit behind the toast, attached at its sides, kept within ~60 units of the toast edge.
const angelL = `<path d="M66,102 C56,74 36,52 12,50 Q2,52 6,62 A9,9 0 0 0 8,80 A9,9 0 0 0 12,97 A9,9 0 0 0 20,112 A9,9 0 0 0 33,124 A9,9 0 0 0 49,132 Q60,140 66,136 Z"/>`;
const angelDetail = `<path d="M16,64 Q42,72 58,96 M18,88 Q40,92 58,110 M30,112 Q46,116 60,124" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`;
// Pull the angel wing in toward the toast so it matches the devil wing's footprint.
const tuck = svg => `<g transform="translate(66,104) scale(0.84) translate(-66,-104)">${svg}</g>`;
const angelWing = tuck(angelL), angelLines = tuck(angelDetail);
const devilL = `<path d="M66,100 L44,76 L12,60 Q28,82 18,98 Q36,98 16,116 Q42,112 30,136 Q52,126 66,144 Z"/>`;
const devilDetail = `<path d="M60,104 L16,64 M60,110 L20,100 M60,118 L22,118 M60,126 L34,134" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`;
const wings = {
  angel: { shape: angelWing + mirror(angelWing), detail: angelLines + mirror(angelLines) },
  devil: { shape: devilL + mirror(devilL), detail: devilDetail + mirror(devilDetail) },
  split: { shape: angelWing + mirror(devilL), detail: angelLines + mirror(devilDetail) },
};

function mark(top, side) {
  const parts = [];
  if (side) parts.push(wings[side]);
  if (top === 'horns' || top === 'both') parts.push(horns);
  parts.push(toast);
  if (top === 'halo') parts.push(halo(0));
  if (top === 'both') parts.push(halo(22));
  return parts;
}

const list = [
  ['saint', 'Saint', 'halo', null, 'Halo only. The cleanest version: knocked out, but clearly a good soul.'],
  ['little-devil', 'Little Devil', 'horns', null, 'Horns only. Two small horns on the crust bumps change the whole outline with almost no extra width.'],
  ['guardian', 'Guardian', null, 'angel', 'Angel wings only. Feathered wings tucked close to the sides make a wide but compact badge shape.'],
  ['fallen', 'Fallen', null, 'devil', 'Devil (bat) wings only. Pointed spokes and a scalloped edge read as "devil" even in outline.'],
  ['heaven-sent', 'Heaven Sent', 'halo', 'angel', 'Halo and angel wings: the full angel. The most balanced and "crest-like" mark in the set.'],
  ['raising-hell', 'Raising Hell', 'horns', 'devil', 'Horns and bat wings: the full devil. The pointiest, most aggressive outline here.'],
  ['fallen-angel', 'Fallen Angel', 'halo', 'devil', 'A halo with devil wings, a saint who went bad. Mixed signals, which is the attitude.'],
  ['undercover', 'Undercover', 'horns', 'angel', 'Horns with angel wings: a devil pretending to be good. Probably the funniest pairing.'],
  ['torn', 'Torn', 'both', null, 'Halo floating between the horns, no wings. Can’t decide, and stays compact.'],
  ['both-ways', 'Both Ways', null, 'split', 'One angel wing and one devil wing. The split makes the outline instantly memorable.'],
  ['mostly-good', 'Mostly Good', 'halo', 'split', 'Split wings under a halo: leaning good, with one bad wing.'],
  ['mostly-bad', 'Mostly Bad', 'horns', 'split', 'Split wings under horns: leaning bad, with one good wing.'],
  ['choir-boy', 'Choir Boy', 'both', 'angel', 'Halo, horns and angel wings: dressed like an angel, horns giving it away.'],
  ['wildcard', 'Wildcard', 'both', 'devil', 'Halo, horns and devil wings: a devil with a halo it definitely stole.'],
  ['undecided', 'Undecided', 'both', 'split', 'Everything at once: halo, horns, one wing of each. The full gamut in one mark.'],
];

const label = (top, side) => [
  top === 'halo' ? 'Halo' : top === 'horns' ? 'Horns' : top === 'both' ? 'Halo + horns' : null,
  side === 'angel' ? 'angel wings' : side === 'devil' ? 'devil wings' : side === 'split' ? 'split wings' : null,
].filter(Boolean).join(' + ').replace(/^./, c => c.toUpperCase());

const all = list.map(([id, name, top, side, note]) => ({
  id, name, note, animal: 'Coma Toast', edge: label(top, side), style: 'New', group: 'new', parts: mark(top, side),
}));

module.exports = { logos: all, kept: [], fresh: all, renderLogo };
