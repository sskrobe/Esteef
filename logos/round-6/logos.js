// Round 6: all sixteen Round 5 marks kept (Ronin's katana swapped for a calligraphy brush,
// so nothing in the set is a weapon), plus ten new two-section marks with a snobby streak.
const round4 = require('../round-4/logos');
const round5 = require('../round-5/logos');
const { W, K, eyes, gap } = round4.helpers;
const renderLogo = round4.renderLogo;

const brush = {
  shape: `<rect x="-84" y="-6" width="118" height="12" rx="6"/><rect x="32" y="-8.5" width="14" height="17" rx="2"/>
    <path d="M44,-9 C64,-12 84,-6 96,0 C84,6 64,12 44,9 Z"/><circle cx="-86" cy="0" r="5"/>`,
  detail: `<path d="M-60,-6 L-60,6 M-40,-6 L-40,6" stroke="${K}" stroke-width="2.5"/><path d="M52,-3 Q72,-2 88,0" fill="none" stroke="${K}" stroke-width="2"/>`,
};

const kept = round5.logos.map(m => {
  if (m.id !== 'ronin') return { ...m, group: 'kept', style: 'Kept' };
  const parts = [...m.parts];
  parts[1] = {
    shape: `<g transform="translate(100,100) rotate(-40) scale(1.12)">${brush.shape}</g>`,
    detail: `<g transform="translate(100,100) rotate(-40) scale(1.12)">${brush.detail}</g>`,
  };
  return {
    ...m, parts, group: 'kept', style: 'Kept', edge: 'Rising sun and ink brush',
    note: 'The katana is now a giant calligraphy brush, so the mark keeps its bold slash through the rising sun with no weapon. Artist, not assassin.',
  };
});

// Smug half-lid drawn in ink on a cut-out area (for faces inside a dark mask, like the raccoon).
const inkLid = (x, y, r) => `<path d="M${x - r},${y} L${x + r},${y} A${r},${r} 0 0 1 ${x - r},${y} Z" fill="${W}"/>
  <circle cx="${(x + r * 0.42).toFixed(1)}" cy="${(y + r * 0.42).toFixed(1)}" r="${(r * 0.36).toFixed(1)}" fill="${K}"/>`;

const pearls = (x1, x2, yTop, dip, r, n) => Array.from({ length: n }, (_, i) => {
  const t = i / (n - 1);
  return `<circle cx="${(x1 + (x2 - x1) * t).toFixed(1)}" cy="${(yTop + dip * Math.sin(Math.PI * t)).toFixed(1)}" r="${r}"/>`;
}).join('');

const fresh = [
  {
    id: 'cold-shoulder',
    name: 'Cold Shoulder',
    animal: 'Ice cream cone',
    edge: 'Waffle cone',
    group: 'new',
    style: 'New',
    note: 'A scoop of ice cream giving you the cold shoulder. Dripping scoop, waffle cone and a cherry on top: three parts, all instantly readable.',
    parts: [
      {
        shape: `<path d="M52,116 L148,116 L100,196 Z"/>`,
        detail: `${[-40, -20, 0, 20, 40].map(o => `<path d="M${100 + o - 40},116 L${100 + o + 30},196 M${100 + o + 40},116 L${100 + o - 30},196" stroke="${K}" stroke-width="3"/>`).join('')}`,
      },
      {
        shape: `<circle cx="100" cy="74" r="50"/>${[56, 74, 92, 110, 128, 146].map((x, i) => `<circle cx="${x}" cy="${108 + (i % 2) * 6}" r="${i % 2 ? 11 : 13}"/>`).join('')}`,
        detail: `${eyes(70, 22, 11)}<path d="M88,98 Q102,104 114,92" fill="none" stroke="${K}" stroke-width="4.5" stroke-linecap="round"/>`,
      },
      { shape: `<circle cx="116" cy="20" r="10"/><path d="M118,12 Q124,0 136,-2 L137,2 Q127,4 122,13 Z"/>`, detail: `<circle cx="112" cy="16" r="2.5" fill="${K}"/>` },
    ],
  },
  {
    id: 'spill-the-tea',
    name: 'Spill the Tea',
    animal: 'Boba tea',
    edge: 'Dome lid and straw',
    group: 'new',
    style: 'New',
    note: 'A boba cup that knows all the gossip. "Spill the tea" is pure snark, the fat straw makes a great outline, and kids love boba.',
    parts: [
      { shape: `<rect x="104" y="-6" width="16" height="60" rx="3" transform="rotate(14 112 50)"/>`, detail: '' },
      {
        shape: `<path d="M50,76 L150,76 L138,186 Q137,194 130,194 L70,194 Q63,194 62,186 Z"/>`,
        detail: `${eyes(108, 22, 11)}<path d="M90,134 Q102,140 112,128" fill="none" stroke="${K}" stroke-width="4.5" stroke-linecap="round"/>
          ${[[76, 176], [92, 180], [108, 180], [124, 176], [84, 164], [100, 168], [116, 164]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="${K}"/>`).join('')}`,
      },
      {
        shape: `<path d="M46,70 Q46,36 100,34 Q154,36 154,70 Z"/><rect x="38" y="64" width="124" height="14" rx="7"/>`,
        detail: `<path d="M40,70 L160,70" stroke="${K}" stroke-width="4"/>`,
      },
    ],
  },
  {
    id: 'bougie',
    name: 'Bougie',
    animal: 'Avocado',
    edge: 'Pearl necklace',
    group: 'new',
    style: 'New',
    note: 'An avocado (the most bougie food there is) in a string of pearls, looking down its nose at you.',
    parts: [
      {
        shape: `<path d="M100,10 C126,10 140,36 146,68 C156,114 140,146 100,146 C60,146 44,114 54,68 C60,36 74,10 100,10 Z"/>`,
        detail: `<path d="M100,22 C120,22 130,44 135,70 C143,108 130,134 100,134 C70,134 57,108 65,70 C70,44 80,22 100,22 Z" fill="none" stroke="${K}" stroke-width="4.5"/>
          ${eyes(62, 18, 10)}<path d="M92,82 Q102,86 110,78" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
          <circle cx="100" cy="120" r="12" fill="${W}" ${gap(5)}/>`,
      },
      { shape: `${pearls(50, 150, 148, 32, 6, 13)}<circle cx="100" cy="190" r="8"/>`, detail: `<circle cx="97" cy="187" r="2.2" fill="${K}"/>` },
    ],
  },
  {
    id: 'glazed',
    name: 'Glazed',
    animal: 'Donut',
    edge: 'Crown',
    group: 'new',
    style: 'New',
    note: 'A frosted donut wearing a crown, royalty from the bakery case. The ring shape plus the crown makes one of the cleanest outlines in the set.',
    parts: [
      {
        shape: `<path fill-rule="evenodd" d="M38,124 A62,62 0 1 0 162,124 A62,62 0 1 0 38,124 Z M86,124 A14,14 0 1 0 114,124 A14,14 0 1 0 86,124 Z"/>`,
        detail: `<path d="${(() => {
          const pts = [];
          for (let i = 0; i <= 96; i++) {
            const a = (i / 96) * Math.PI * 2, r = 48 + 5 * Math.sin(a * 9);
            pts.push(`${(100 + Math.cos(a) * r).toFixed(1)},${(124 + Math.sin(a) * r).toFixed(1)}`);
          }
          return 'M' + pts.join(' L');
        })()}" fill="none" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>
          ${[[66, 108, 30], [136, 112, -30], [74, 150, -20], [130, 152, 40]].map(([x, y, a]) => `<rect x="${x - 5}" y="${y - 1.8}" width="10" height="3.6" rx="1.8" transform="rotate(${a} ${x} ${y})" fill="${K}"/>`).join('')}
          ${eyes(96, 26, 11)}<path d="M88,148 Q102,154 114,144" fill="none" stroke="${K}" stroke-width="4.5" stroke-linecap="round"/>`,
      },
      {
        shape: `<path d="M56,58 L56,18 L78,38 L100,8 L122,38 L144,18 L144,58 Z"/>`,
        detail: `<circle cx="78" cy="48" r="4" fill="${K}"/><circle cx="100" cy="46" r="5" fill="${K}"/><circle cx="122" cy="48" r="4" fill="${K}"/>`,
      },
    ],
  },
  {
    id: 'best-in-show',
    name: 'Best in Show',
    animal: 'Poodle',
    edge: 'Award rosette',
    group: 'new',
    style: 'New',
    note: 'A show poodle with its nose in the air, wearing its first-place rosette. The pouf, the ear poms and the ribbon make a silhouette you can’t mistake.',
    parts: [
      { shape: `<ellipse cx="52" cy="100" rx="22" ry="34"/><ellipse cx="148" cy="100" rx="22" ry="34"/>`, detail: '' },
      {
        shape: `<circle cx="100" cy="40" r="30"/><ellipse cx="100" cy="98" rx="35" ry="38"/>`,
        detail: `<path d="M84,30 Q92,22 100,30 Q108,22 116,30 M80,46 Q90,40 100,46 Q110,40 120,46" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>
          ${eyes(90, 15, 8.5)}
          <ellipse cx="100" cy="112" rx="7" ry="5" fill="${K}"/>
          <path d="M92,124 Q101,128 110,120" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>`,
      },
      {
        shape: `<path d="M88,166 L74,200 L86,194 L94,200 L98,170 Z M112,166 L126,200 L114,194 L106,200 L102,170 Z"/>
          ${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<circle cx="${(100 + Math.cos(a) * 18).toFixed(1)}" cy="${(160 + Math.sin(a) * 18).toFixed(1)}" r="8"/>`; }).join('')}<circle cx="100" cy="160" r="18"/>`,
        detail: `<circle cx="100" cy="160" r="11" fill="none" stroke="${K}" stroke-width="3"/><path d="M98,155 L101,153 L101,166" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
      },
    ],
  },
  {
    id: 'trash-talk',
    name: 'Trash Talk',
    animal: 'Raccoon',
    edge: 'Trash can',
    group: 'new',
    style: 'New',
    note: 'A raccoon popping out of a trash can, acting like it’s a penthouse. "Trash talk" is the snark, and the bandit mask plus the can give a two-part outline.',
    parts: [
      {
        shape: `<circle cx="60" cy="42" r="17"/><circle cx="140" cy="42" r="17"/><ellipse cx="100" cy="80" rx="54" ry="46"/>
          <path d="M48,88 L28,102 L54,104 Z M152,88 L172,102 L146,104 Z"/>`,
        detail: `<circle cx="60" cy="42" r="7.5" fill="${K}"/><circle cx="140" cy="42" r="7.5" fill="${K}"/>
          <path d="M48,66 Q100,54 152,66 Q156,88 132,92 Q116,82 100,92 Q84,82 68,92 Q44,88 48,66 Z" fill="${K}"/>
          ${inkLid(78, 74, 10)}${inkLid(122, 74, 10)}
          <ellipse cx="100" cy="102" rx="8" ry="5.5" fill="${K}"/>
          <path d="M92,114 Q102,118 110,110" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>`,
      },
      {
        shape: `<rect x="32" y="116" width="136" height="14" rx="5"/><path d="M42,130 L158,130 L150,194 L50,194 Z"/>`,
        detail: `<path d="M34,130 L166,130" stroke="${K}" stroke-width="4"/>
          ${[68, 88, 112, 132].map(x => `<path d="M${x},140 L${x + (x - 100) * 0.06},186" stroke="${K}" stroke-width="4" stroke-linecap="round"/>`).join('')}`,
      },
    ],
  },
  {
    id: 'old-money',
    name: 'Old Money',
    animal: 'Bulldog',
    edge: 'Top hat and monocle',
    group: 'new',
    style: 'New',
    note: 'A British bulldog in a top hat and monocle with an underbite. The tall hat on the wide jowly head gives a two-part outline that says "inherited."',
    parts: [
      {
        shape: `<path d="M36,104 C36,70 64,54 100,54 C136,54 164,70 164,104 C168,132 150,160 100,162 C50,160 32,132 36,104 Z"/>
          <path d="M44,74 L32,58 L60,62 Z M156,74 L168,58 L140,62 Z"/>`,
        detail: `${eyes(100, 26, 11)}
          <circle cx="126" cy="100" r="15" fill="none" stroke="${K}" stroke-width="3.5"/>
          <path d="M141,102 Q156,124 148,150" fill="none" stroke="${K}" stroke-width="2.5" stroke-dasharray="4 3"/>
          <ellipse cx="100" cy="118" rx="15" ry="8.5" fill="${K}"/>
          <path d="M62,134 Q100,154 138,134 Q100,142 62,134 Z" fill="${K}"/>
          <path d="M76,138 L80,130 L84,139 Z M116,139 L120,130 L124,138 Z" fill="${W}"/>`,
      },
      {
        shape: `<rect x="66" y="2" width="68" height="44" rx="3"/><ellipse cx="100" cy="47" rx="56" ry="8"/>`,
        detail: `<rect x="66" y="32" width="68" height="7" fill="${K}"/>`,
      },
    ],
  },
  {
    id: 'frog-prince',
    name: 'Frog Prince',
    animal: 'Frog',
    edge: 'Crown and lily pad',
    group: 'new',
    style: 'New',
    note: 'A frog prince who has no plans to kiss anyone. A tiny crown on top and a lily pad underneath bookend the wide frog face.',
    parts: [
      {
        shape: `<ellipse cx="100" cy="172" rx="92" ry="22"/>`,
        detail: `<path d="M100,174 L156,152 L176,160 Z" fill="${K}"/><path d="M100,174 L50,166 M100,174 L76,190 M100,174 L130,192" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`,
      },
      {
        shape: `<circle cx="64" cy="82" r="24"/><circle cx="136" cy="82" r="24"/><ellipse cx="100" cy="116" rx="68" ry="40"/>`,
        detail: `${eyes(84, 36, 12)}
          <circle cx="92" cy="110" r="2.6" fill="${K}"/><circle cx="108" cy="110" r="2.6" fill="${K}"/>
          <path d="M54,124 Q100,142 146,122" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`,
      },
      {
        shape: `<path d="M80,64 L80,38 L90,48 L100,30 L110,48 L120,38 L120,64 Z"/>`,
        detail: `<circle cx="100" cy="54" r="4" fill="${K}"/>`,
      },
    ],
  },
  {
    id: 'boo-jee',
    name: 'Boo-jee',
    animal: 'Ghost',
    edge: 'Shopping bags',
    group: 'new',
    style: 'New',
    note: 'A ghost in designer shades carrying shopping bags, with a pun in the name. The ghost outline is classic, and the bags on each side give it the luxury twist.',
    parts: [
      {
        shape: `<path d="M56,150 L56,72 C56,40 76,22 100,22 C124,22 144,40 144,72 L144,150 L130,140 L116,150 L100,140 L84,150 L70,140 Z"/>`,
        detail: `<rect x="66" y="62" width="30" height="18" rx="7" fill="${K}"/><rect x="104" y="62" width="30" height="18" rx="7" fill="${K}"/>
          <rect x="94" y="66" width="12" height="4" fill="${K}"/>
          <path d="M72,72 L80,66 M110,72 L118,66" stroke="${W}" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M88,102 Q102,108 114,96" fill="none" stroke="${K}" stroke-width="4.5" stroke-linecap="round"/>`,
      },
      {
        shape: `<rect x="14" y="128" width="46" height="56" rx="3"/><path fill-rule="evenodd" d="M24,130 Q24,104 37,104 Q50,104 50,130 L44,130 Q44,111 37,111 Q30,111 30,130 Z"/>`,
        detail: `<path d="M22,146 L52,146" stroke="${K}" stroke-width="3"/>`,
      },
      {
        shape: `<rect x="140" y="138" width="48" height="50" rx="3"/><path fill-rule="evenodd" d="M150,140 Q150,116 164,116 Q178,116 178,140 L172,140 Q172,123 164,123 Q156,123 156,140 Z"/>`,
        detail: `<path d="M150,156 L178,156" stroke="${K}" stroke-width="3"/>`,
      },
    ],
  },
  {
    id: 'hang-time',
    name: 'Hang Time',
    animal: 'Sloth',
    edge: 'Branch',
    group: 'new',
    style: 'New',
    note: 'A sloth hanging from a branch with zero urgency. That’s luxury: never being in a hurry. The branch across the top gives it a clear second section.',
    parts: [
      {
        shape: `<path d="M2,30 Q100,16 198,30 L198,42 Q100,30 2,42 Z"/><ellipse cx="30" cy="22" rx="12" ry="5" transform="rotate(-20 30 22)"/><ellipse cx="172" cy="20" rx="12" ry="5" transform="rotate(20 172 20)"/>
          <path d="M64,110 L54,40 Q58,30 68,34 L80,104 Z M136,110 L146,40 Q142,30 132,34 L120,104 Z"/>`,
        detail: `<path d="M52,38 L58,30 M60,38 L66,30 M140,30 L146,38 M134,30 L140,38" stroke="${K}" stroke-width="2.5" stroke-linecap="round"/>`,
      },
      {
        shape: `<ellipse cx="100" cy="128" rx="56" ry="52"/>`,
        detail: `<path d="M56,116 Q100,94 144,116 Q152,146 128,166 Q100,178 72,166 Q48,146 56,116 Z" fill="${K}"/>
          <ellipse cx="76" cy="128" rx="22" ry="12" transform="rotate(-20 76 128)" fill="${W}"/><ellipse cx="124" cy="128" rx="22" ry="12" transform="rotate(20 124 128)" fill="${W}"/>
          <path d="M70,126 L88,126 A9,9 0 0 1 70,126 Z M112,126 L130,126 A9,9 0 0 1 112,126 Z" fill="${K}"/>
          <circle cx="83" cy="130" r="3" fill="${W}"/><circle cx="125" cy="130" r="3" fill="${W}"/>
          <ellipse cx="100" cy="146" rx="10" ry="6.5" fill="${W}"/>
          <path d="M88,160 Q102,166 114,156" fill="none" stroke="${W}" stroke-width="4" stroke-linecap="round"/>`,
      },
    ],
  },
];

module.exports = { logos: [...kept, ...fresh], kept, fresh, renderLogo };
