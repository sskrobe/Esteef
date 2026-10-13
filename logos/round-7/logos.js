// Round 7: less cute, more basic. Like the Psycho Bunny rabbit, each head is a plain, generic
// silhouette with minimal features (small dot eyes, a nose if needed, no expressions).
// The accessory carries the identity: a crown, a detective's hat, a top hat...
// Two sections per mark, separated by a gap, so the outline alone still reads.
const round4 = require('../round-4/logos');
const { W, K } = round4.helpers;
const renderLogo = round4.renderLogo;

const dotEyes = (y, spread, r = 5) => `<circle cx="${100 - spread}" cy="${y}" r="${r}" fill="${K}"/><circle cx="${100 + spread}" cy="${y}" r="${r}" fill="${K}"/>`;

// Accessories, each sized to sit on a head about 110 wide, top edge near y 20.
const crown = (y = 12, w = 92, h = 48) => {
  const l = 100 - w / 2, r = 100 + w / 2, b = y + h;
  return {
    shape: `<path d="M${l},${b} L${l - 4},${y + 6} L${l + w * 0.25},${y + h * 0.5} L100,${y - 4} L${r - w * 0.25},${y + h * 0.5} L${r + 4},${y + 6} L${r},${b} Z"/>
      <circle cx="${l - 4}" cy="${y + 4}" r="6"/><circle cx="100" cy="${y - 6}" r="6"/><circle cx="${r + 4}" cy="${y + 4}" r="6"/>`,
    detail: `<rect x="${l + 2}" y="${b - 12}" width="${w - 4}" height="5" fill="${K}"/>`,
  };
};

const marks = [
  {
    id: 'capybara-crown',
    name: 'King Capy',
    animal: 'Capybara',
    edge: 'Crown',
    note: 'A flat, boxy capybara head, as plain as possible, wearing a crown. The capybara is the calmest animal alive, so here it’s the calmest king alive.',
    parts: [
      {
        shape: `<circle cx="60" cy="76" r="9"/><circle cx="140" cy="76" r="9"/><path d="M50,96 Q50,72 76,70 L124,70 Q150,72 150,96 L150,154 Q150,186 118,186 L82,186 Q50,186 50,154 Z"/>`,
        detail: `${dotEyes(102, 32, 5)}<ellipse cx="88" cy="164" rx="3.5" ry="7" transform="rotate(20 88 164)" fill="${K}"/><ellipse cx="112" cy="164" rx="3.5" ry="7" transform="rotate(-20 112 164)" fill="${K}"/>`,
      },
      crown(14, 90, 42),
    ],
  },
  {
    id: 'guinea-pig-detective',
    name: 'The Inspector',
    animal: 'Guinea pig',
    edge: 'Detective hat',
    note: 'A plain guinea pig blob in a deerstalker detective hat, the kind with front and back brims and ear flaps. The hat alone tells the whole story.',
    parts: [
      {
        shape: `<ellipse cx="100" cy="132" rx="70" ry="56"/><ellipse cx="44" cy="96" rx="13" ry="9" transform="rotate(-30 44 96)"/><ellipse cx="156" cy="96" rx="13" ry="9" transform="rotate(30 156 96)"/>`,
        detail: `${dotEyes(124, 30, 5)}<ellipse cx="100" cy="146" rx="7" ry="5" fill="${K}"/>`,
      },
      {
        shape: `<path d="M50,82 Q50,30 100,28 Q150,30 150,82 Z"/><path d="M40,82 Q60,70 100,72 Q140,70 160,82 Q170,92 186,94 Q160,100 100,96 Q40,100 14,94 Q30,92 40,82 Z"/>
          <circle cx="100" cy="24" r="7"/><path d="M52,58 Q44,40 60,36 L70,64 Z M148,58 Q156,40 140,36 L130,64 Z"/>`,
        detail: `<path d="M100,30 L100,80 M74,38 Q80,60 78,80 M126,38 Q120,60 122,80" fill="none" stroke="${K}" stroke-width="3"/>
          ${[40, 52, 64].map(y => `<path d="M54,${y} L146,${y}" stroke="${K}" stroke-width="2.5"/>`).join('')}
          ${[62, 88, 112, 138].map(x => `<path d="M${x},36 L${x},80" stroke="${K}" stroke-width="2.5"/>`).join('')}
          <path d="M60,36 Q80,26 100,26 Q120,26 140,36" fill="none" stroke="${K}" stroke-width="3"/>`,
      },
    ],
  },
  {
    id: 'bagel-crown',
    name: 'Daily Bread',
    animal: 'Bagel',
    edge: 'Crown',
    note: 'The one you liked: a crown over something round. A plain bagel ring with a crown floating above it, a direct mark for the Daily Bread name. No face at all.',
    parts: [
      {
        shape: `<path fill-rule="evenodd" d="M34,128 A66,58 0 1 0 166,128 A66,58 0 1 0 34,128 Z M84,128 A16,13 0 1 0 116,128 A16,13 0 1 0 84,128 Z"/>`,
        detail: `${[[62, 100, -30], [92, 86, -6], [126, 92, 20], [146, 120, 60], [56, 140, -70], [134, 156, 30], [84, 162, -14]].map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="2" transform="rotate(${a} ${x} ${y})" fill="${K}"/>`).join('')}`,
      },
      crown(18, 96, 40),
    ],
  },
  {
    id: 'loaf-crown',
    name: 'Bread Winner',
    animal: 'Loaf of bread',
    edge: 'Crown',
    note: 'A plain, scored loaf of bread under a crown. It’s about as basic as an object gets, and the crown makes it royalty. "Bread winner" fits the money joke too.',
    parts: [
      {
        shape: `<path d="M24,150 C24,98 60,80 100,80 C140,80 176,98 176,150 L176,170 Q176,184 162,184 L38,184 Q24,184 24,170 Z"/>`,
        detail: `<path d="M58,104 L74,128 M88,96 L104,122 M118,98 L134,124" stroke="${K}" stroke-width="6" stroke-linecap="round"/>`,
      },
      crown(14, 92, 46),
    ],
  },
  {
    id: 'cat-crown',
    name: 'House Cat',
    animal: 'Cat',
    edge: 'Crown',
    note: 'The plainest cat head possible (two triangle ears, two dots) wearing a crown. A cat already thinks it owns the house, so the crown just confirms it.',
    parts: [
      {
        shape: `<path d="M44,108 L40,62 L74,82 Q100,76 126,82 L160,62 L156,108 Q160,176 100,180 Q40,176 44,108 Z"/>`,
        detail: `${dotEyes(126, 26, 5.5)}<path d="M94,144 L106,144 L100,150 Z" fill="${K}" stroke="${K}" stroke-width="2" stroke-linejoin="round"/>`,
      },
      crown(10, 80, 40),
    ],
  },
  {
    id: 'bulldog-top-hat',
    name: 'Old Money',
    animal: 'Bulldog',
    edge: 'Top hat',
    note: 'Redrawn as a flat, wide bulldog head with no expression, under a tall top hat. The contrast is the joke: a tough dog with a gentleman’s hat.',
    parts: [
      {
        shape: `<path d="M30,116 Q30,82 60,80 L140,80 Q170,82 170,116 L170,150 Q170,186 132,188 L68,188 Q30,186 30,150 Z"/><path d="M34,88 L22,74 L50,80 Z M166,88 L178,74 L150,80 Z"/>`,
        detail: `${dotEyes(120, 30, 5)}<ellipse cx="100" cy="142" rx="16" ry="9" fill="${K}"/><path d="M60,166 Q100,180 140,166" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>`,
      },
      {
        shape: `<rect x="66" y="0" width="68" height="58" rx="3"/><ellipse cx="100" cy="62" rx="60" ry="9"/>`,
        detail: `<rect x="66" y="44" width="68" height="8" fill="${K}"/>`,
      },
    ],
  },
  {
    id: 'bear-bucket-hat',
    name: 'Off Duty',
    animal: 'Bear',
    edge: 'Bucket hat',
    note: 'A generic round bear head in a bucket hat pulled low, so you can barely see its eyes. Streetwear’s favorite hat on the most basic animal.',
    parts: [
      {
        shape: `<circle cx="100" cy="118" r="62"/>`,
        detail: `${dotEyes(118, 26, 5)}<ellipse cx="100" cy="146" rx="22" ry="16" fill="${K}"/><ellipse cx="100" cy="140" rx="8" ry="5" fill="${W}"/>`,
      },
      {
        shape: `<path d="M56,90 L64,40 Q100,28 136,40 L144,90 Z"/><path d="M28,98 Q40,82 60,84 L140,84 Q160,82 172,98 Q100,112 28,98 Z"/>`,
        detail: `<path d="M60,74 Q100,66 140,74" fill="none" stroke="${K}" stroke-width="3" stroke-dasharray="5 4"/>`,
      },
    ],
  },
  {
    id: 'duck-captain',
    name: 'Captain',
    animal: 'Duck',
    edge: 'Captain’s cap',
    note: 'A plain duck head in profile wearing a yacht captain’s cap. A profile view gives a very different silhouette from the rest of the set.',
    parts: [
      {
        shape: `<circle cx="96" cy="112" r="52"/><path d="M140,112 Q178,108 190,124 Q178,138 140,134 Z"/>`,
        detail: `<circle cx="116" cy="104" r="6" fill="${K}"/><path d="M144,124 L186,124" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`,
      },
      {
        shape: `<path d="M44,74 Q46,34 96,30 Q146,34 150,66 L144,76 Z"/><path d="M136,68 Q160,66 176,80 Q160,86 132,80 Z"/>`,
        detail: `<path d="M50,64 L146,66" stroke="${K}" stroke-width="5"/><path d="M90,42 L94,52 L104,52 L96,58 L99,68 L90,62 L81,68 L84,58 L76,52 L86,52 Z" fill="${K}" transform="translate(4,-6) scale(0.9) translate(10,6)"/>`,
      },
    ],
  },
  {
    id: 'pug-beret',
    name: 'Le Pug',
    animal: 'Pug',
    edge: 'Beret',
    note: 'A flat pug face under a tilted French beret: the fashion-house snob joke in its simplest form.',
    parts: [
      {
        shape: `<ellipse cx="100" cy="124" rx="62" ry="56"/><path d="M42,98 Q40,76 62,80 L60,118 Z M158,98 Q160,76 138,80 L140,118 Z"/>`,
        detail: `${dotEyes(116, 28, 6)}<ellipse cx="100" cy="148" rx="26" ry="18" fill="${K}"/><ellipse cx="100" cy="142" rx="9" ry="5.5" fill="${W}"/>`,
      },
      {
        shape: `<path d="M38,66 Q42,34 96,30 Q156,28 168,58 Q160,78 100,78 Q50,80 38,66 Z" transform="rotate(-8 100 56)"/><rect x="96" y="14" width="8" height="16" rx="3" transform="rotate(-8 100 56)"/>`,
        detail: '',
      },
    ],
  },
  {
    id: 'pigeon-crown',
    name: 'City King',
    animal: 'Pigeon',
    edge: 'Crown',
    note: 'A plain pigeon in profile with a crown: king of the block. The most ordinary city bird, made royal.',
    parts: [
      {
        shape: `<circle cx="104" cy="96" r="38"/><path d="M138,92 L168,100 L138,108 Z"/><path d="M70,110 Q44,130 46,170 Q48,190 80,190 L150,190 Q168,170 150,140 Q140,120 132,118 Z"/>`,
        detail: `<circle cx="118" cy="90" r="5.5" fill="${K}"/><path d="M76,126 Q104,138 134,128" fill="none" stroke="${K}" stroke-width="4"/><path d="M64,160 Q98,150 140,166" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>`,
      },
      {
        shape: `<g transform="translate(4,-6) scale(0.8) translate(25,20)">${crown(10, 80, 40).shape}</g>`,
        detail: `<g transform="translate(4,-6) scale(0.8) translate(25,20)">${crown(10, 80, 40).detail}</g>`,
      },
    ],
  },
];

module.exports = { logos: marks.map(m => ({ ...m, style: 'New', group: 'new' })), kept: [], fresh: marks.map(m => ({ ...m, style: 'New', group: 'new' })), renderLogo };
