// Round 5: same lesson as Round 4 (a logo should split into clear sections you can read from
// the outline alone), but no shared crossed-objects layout. Each character gets its own
// second section: a halo, a bow tie, a trophy, a toaster, a championship belt...
// Heads are reused from Round 4 (smug side-eye faces) and repositioned.
const round4 = require('../round-4/logos');
const { W, K, eyes, gap, obj } = round4.helpers;
const renderLogo = round4.renderLogo;

// Head parts of a Round 4 mark (everything after its two crossed objects).
const head = id => round4.logos.find(m => m.id === id).parts.slice(2);
const move = (parts, t) => parts.map(p => ({
  shape: `<g transform="${t}">${p.shape}</g>`,
  detail: p.detail ? `<g transform="${t}">${p.detail}</g>` : '',
}));
// Scale parts by k around point (cx, cy), then shift by (dx, dy).
const fit = (parts, { k = 1, cx = 100, cy = 100, dx = 0, dy = 0 }) =>
  move(parts, `translate(${cx + dx},${cy + dy}) scale(${k}) translate(${-cx},${-cy})`);

const laurel = (() => {
  const leaves = [];
  for (let i = 0; i < 9; i++) {
    const a = (104 + i * 16) * Math.PI / 180;
    const x = 100 + Math.cos(a) * 84, y = 94 + Math.sin(a) * 84;
    const rot = (a * 180 / Math.PI) + 90 + 28;
    leaves.push(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="14" ry="6.5" transform="rotate(${rot.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`);
  }
  const p = (deg, r) => { const a = deg * Math.PI / 180; return `${(100 + Math.cos(a) * r).toFixed(1)},${(94 + Math.sin(a) * r).toFixed(1)}`; };
  leaves.push(`<path d="M${p(96, 86)} A86,86 0 0 1 ${p(236, 86)} L${p(236, 81)} A81,81 0 0 0 ${p(96, 81)} Z"/>`);
  const half = leaves.join('');
  return `${half}<g transform="translate(200,0) scale(-1,1)">${half}</g>`;
})();

const wing = `<path d="M62,74 C42,42 12,40 6,62 C18,64 22,68 12,78 C26,78 28,84 16,94 C30,94 34,100 24,110 C38,108 46,112 54,124 C58,108 62,92 62,74 Z"/>`;

const marks = [
  {
    id: 'nine-lives',
    name: 'Nine Lives',
    animal: 'Kitten skull',
    edge: 'Halo and bat wings',
    style: 'Kept',
    group: 'kept',
    note: 'A kitten skull with bat wings and a halo: saint or sinner, it hasn\u2019t decided. The halo also nods to the "give us our daily bread" prayer behind the name.',
    parts: [
      { shape: `${wing}<g transform="translate(200,0) scale(-1,1)">${wing}</g>`, detail: `<path d="M18,72 Q34,70 44,80 M22,90 Q36,88 46,98 M30,106 Q42,104 50,114 M182,72 Q166,70 156,80 M178,90 Q164,88 154,98 M170,106 Q158,104 150,114" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>` },
      ...fit(head('nine-lives'), { k: 0.95, dy: 16 }),
      { shape: `<path fill-rule="evenodd" d="M62,16 A38,10 0 1 0 138,16 A38,10 0 1 0 62,16 Z M72,16 A28,5 0 1 0 128,16 A28,5 0 1 0 72,16 Z"/>`, detail: '' },
    ],
  },
  {
    id: 'bamboo-bandit',
    name: 'Bamboo Bandit',
    animal: 'Panda',
    edge: 'Black-tie bow tie',
    style: 'Kept',
    group: 'kept',
    note: 'A panda in aviators and a bow tie: born in black tie. The bow tie is the second shape, and it gives the outline instant "too good for this party" energy.',
    parts: [
      ...fit(head('bamboo-bandit'), { dy: -8 }),
      {
        shape: `<path d="M100,156 L48,130 Q38,156 48,182 Z"/><path d="M100,156 L152,130 Q162,156 152,182 Z"/><rect x="86" y="142" width="28" height="28" rx="7"/>`,
        detail: `<rect x="86" y="142" width="28" height="28" rx="7" fill="${W}" ${gap(6)}/><path d="M60,144 Q72,156 60,168 M140,144 Q128,156 140,168" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>`,
      },
    ],
  },
  {
    id: 'the-don',
    name: 'The Don',
    animal: 'Koala',
    edge: 'Pinstripe suit',
    style: 'Kept',
    group: 'kept',
    note: 'The koala is now a portrait bust in a pinstripe suit and tie. The broad shoulders and V-neck are a different kind of second section, and it reads as old money.',
    parts: [
      {
        shape: `<path d="M14,200 L14,176 Q18,152 58,142 L100,182 L142,142 Q182,152 186,176 L186,200 Z"/>`,
        detail: `${[30, 44, 156, 170].map(x => `<path d="M${x},${x < 100 ? 160 + (x - 30) * 0.3 : 160 + (170 - x) * 0.3} L${x},200" stroke="${K}" stroke-width="2.2"/>`).join('')}
          <path d="M58,142 L80,190 L66,166 M142,142 L120,190 L134,166" fill="none" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>`,
      },
      { shape: `<path d="M92,170 L108,170 L113,192 L100,200 L87,192 Z"/>`, detail: `<path d="M94,180 L106,186" stroke="${K}" stroke-width="2.5"/>` },
      ...fit(head('the-don'), { k: 0.92, dy: -12 }),
    ],
  },
  {
    id: 'captain-quack',
    name: 'Captain Quack',
    animal: 'Duckling',
    edge: 'Anchor',
    style: 'Kept',
    group: 'kept',
    note: 'The pirate duck rides on a ship’s anchor: yacht club, but make it pirate. The anchor’s curved arms and points give a clean bottom shape.',
    parts: [
      {
        shape: `<rect x="93" y="40" width="14" height="148" rx="4"/><rect x="62" y="138" width="76" height="11" rx="5.5"/>
          <path d="M34,146 Q36,194 100,196 Q164,194 166,146 L152,152 Q150,182 100,182 Q50,182 48,152 Z"/>
          <path d="M34,146 L26,166 L46,160 Z M166,146 L174,166 L154,160 Z"/>`,
        detail: '',
      },
      ...fit(head('captain-quack'), { k: 0.92, dy: -6 }),
    ],
  },
  {
    id: 'ground-and-pound',
    name: 'Ground & Pound',
    animal: 'Bear cub',
    edge: 'Championship belt',
    style: 'Kept',
    group: 'kept',
    note: 'The bear holds a championship belt. Undefeated, and won’t let you forget it. The wide belt with its big center plate is an outline every fight fan knows.',
    parts: [
      ...fit(head('ground-and-pound'), { dy: 0 }),
      {
        shape: `<rect x="10" y="140" width="180" height="26" rx="7"/><ellipse cx="100" cy="153" rx="40" ry="31"/><rect x="34" y="134" width="22" height="38" rx="5"/><rect x="144" y="134" width="22" height="38" rx="5"/>`,
        detail: `<ellipse cx="100" cy="153" rx="31" ry="23" fill="none" stroke="${K}" stroke-width="3.5"/>
          <path d="M100,137 L105,148 L117,148 L107,155 L111,167 L100,160 L89,167 L93,155 L83,148 L95,148 Z" fill="${K}"/>
          <rect x="34" y="134" width="22" height="38" rx="5" fill="${W}" ${gap(5)}/><rect x="144" y="134" width="22" height="38" rx="5" fill="${W}" ${gap(5)}/>
          <circle cx="45" cy="153" r="5" fill="${K}"/><circle cx="155" cy="153" r="5" fill="${K}"/>
          <path d="M14,153 L26,153 M174,153 L186,153" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`,
      },
    ],
  },
  {
    id: 'toast',
    name: 'Toast',
    animal: 'Bread slice',
    edge: 'Toaster',
    style: 'Kept',
    group: 'kept',
    note: 'A slice of bread rising out of a chrome toaster, looking down on you. The bread shape plus the toaster box is a two-part outline nobody can misread.',
    parts: [
      ...fit(head('toast'), { k: 0.95, dy: -16 }),
      {
        shape: `<rect x="26" y="118" width="148" height="66" rx="24"/><rect x="172" y="130" width="12" height="26" rx="4"/><rect x="44" y="182" width="20" height="10" rx="3"/><rect x="136" y="182" width="20" height="10" rx="3"/>`,
        detail: `<path d="M46,124 L154,124" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
          <path d="M40,150 L160,150 M40,160 L160,160" stroke="${K}" stroke-width="2.5"/>
          <circle cx="152" cy="171" r="5" fill="${K}"/>`,
      },
    ],
  },
  {
    id: 'hot-slice',
    name: 'Hot Slice',
    animal: 'Pizza slice',
    edge: 'Laurel wreath',
    style: 'Kept',
    group: 'kept',
    note: 'A pizza slice in shades, framed by a laurel wreath like an old-world luxury crest. Street food dressed as a fashion house.',
    parts: [
      { shape: `${laurel}<path d="M100,176 L82,166 L82,188 Z M100,176 L118,166 L118,188 Z"/><circle cx="100" cy="177" r="7"/>`, detail: '' },
      ...fit(head('hot-slice'), { k: 0.74, cy: 90, dy: -4 }),
    ],
  },
  {
    id: 'beef',
    name: 'Beef',
    animal: 'Burger',
    edge: 'Trophy',
    style: 'Kept',
    group: 'kept',
    note: 'A burger sitting in a winner’s trophy. First place, and very aware of it. The trophy handles and stepped base give it a strong second shape.',
    parts: [
      {
        shape: `<path d="M48,126 L152,126 Q150,166 112,172 L112,180 L88,180 L88,172 Q50,166 48,126 Z"/>
          <path d="M50,132 Q20,130 22,150 Q24,170 58,164 L56,154 Q34,156 34,148 Q34,140 52,142 Z"/>
          <path d="M150,132 Q180,130 178,150 Q176,170 142,164 L144,154 Q166,156 166,148 Q166,140 148,142 Z"/>
          <rect x="70" y="180" width="60" height="9" rx="2"/><rect x="60" y="188" width="80" height="10" rx="3"/>`,
        detail: `<path d="M100,136 L105,147 L117,147 L107,154 L111,166 L100,159 L89,166 L93,154 L83,147 L95,147 Z" fill="${K}"/>`,
      },
      ...fit(head('beef'), { k: 0.78, cy: 86, dy: -16 }),
    ],
  },
  {
    id: 'fowl-play',
    name: 'Fowl Play',
    animal: 'Baby chick',
    edge: 'Cracked eggshell',
    style: 'New',
    group: 'new',
    note: 'A chick hatching from its shell, already unimpressed with the world. The jagged eggshell edge makes a strong break between the two sections.',
    parts: [
      ...fit(head('fowl-play'), { dy: 6 }),
      {
        shape: `<path d="M32,114 L50,128 L64,108 L82,130 L100,110 L118,130 L136,108 L150,128 L168,114 Q170,190 100,194 Q30,190 32,114 Z"/>`,
        detail: `<ellipse cx="66" cy="160" rx="6" ry="4" fill="${K}"/><ellipse cx="126" cy="172" rx="5" ry="3.5" fill="${K}"/><ellipse cx="142" cy="146" rx="4" ry="3" fill="${K}"/>`,
      },
    ],
  },
  {
    id: 'big-head',
    name: 'Big Head',
    animal: 'Alien',
    edge: 'Flying saucer',
    style: 'New',
    group: 'new',
    note: 'An alien riding in its flying saucer like a convertible. The wide saucer disc under the big head is a silhouette everyone recognizes.',
    parts: [
      ...fit(head('big-head'), { dy: 2 }),
      {
        shape: `<ellipse cx="100" cy="142" rx="94" ry="22"/><ellipse cx="100" cy="164" rx="42" ry="12"/>`,
        detail: `${[30, 58, 86, 114, 142, 170].map((x, i) => `<circle cx="${x}" cy="${i === 0 || i === 5 ? 144 : 148}" r="5" fill="${K}"/>`).join('')}
          <path d="M14,138 Q100,126 186,138" fill="none" stroke="${K}" stroke-width="3"/>`,
      },
    ],
  },
  {
    id: 'steamed',
    name: 'Steamed',
    animal: 'Dumpling',
    edge: 'Bamboo steamer',
    style: 'New',
    group: 'new',
    note: 'A dumpling sitting in its bamboo steamer like a throne. The woven basket is the second section, and it says "Asian food" with no detail at all.',
    parts: [
      ...fit(head('steamed'), { dy: -2 }),
      {
        shape: `<rect x="18" y="114" width="164" height="64" rx="10"/><rect x="12" y="110" width="176" height="14" rx="6"/>`,
        detail: `<path d="M12,124 L188,124" stroke="${K}" stroke-width="4"/>
          <path d="M22,146 L178,146 M22,158 L178,158" stroke="${K}" stroke-width="3"/>
          ${[40, 64, 88, 112, 136, 160].map(x => `<path d="M${x},128 L${x},142 M${x + 12},162 L${x + 12},174" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`).join('')}`,
      },
    ],
  },
  {
    id: 'small-fry',
    name: 'Small Fry',
    animal: 'French fries',
    edge: 'Gold chain',
    style: 'New',
    group: 'new',
    note: 'A fry carton wearing a heavy chain with a big medallion. The smallest guy in the room with the biggest jewelry.',
    parts: [
      {
        shape: `${Array.from({ length: 11 }, (_, i) => {
          const t = i / 10, x = 60 + 80 * t, y = 134 + 34 * Math.sin(Math.PI * t);
          return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="5.5" ry="4"/>`;
        }).join('')}<circle cx="100" cy="178" r="19"/>`,
        detail: `<circle cx="100" cy="178" r="13" fill="none" stroke="${K}" stroke-width="3"/>
          <path d="M106,172 Q100,167 94,171 Q89,176 98,179 L102,180 Q111,183 106,188 Q100,191 93,187" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M100,165 L100,191" stroke="${K}" stroke-width="2.5"/>`,
      },
      ...fit(head('small-fry'), { k: 0.86, cy: 0, dy: 6 }),
    ],
  },
  {
    id: 'ronin',
    name: 'Ronin',
    animal: 'Shiba Inu',
    edge: 'Katana and rising sun',
    style: 'New',
    group: 'new',
    note: 'A scarred Shiba in front of a rising sun, with a single katana slung behind. The big circle behind the head makes a bold badge shape.',
    parts: [
      { shape: `<circle cx="100" cy="98" r="88"/>`, detail: '' },
      {
        shape: `<g transform="translate(100,100) rotate(-40) scale(1.12)">${obj.katana.shape}</g>`,
        detail: `<g transform="translate(100,100) rotate(-40) scale(1.12)">${obj.katana.detail}</g>`,
      },
      ...fit(head('ronin'), { k: 0.9, dy: 2 }),
    ],
  },
  {
    id: 'pug-life',
    name: 'Pug Life',
    animal: 'Pug',
    edge: 'Barbell overhead',
    style: 'New',
    group: 'new',
    note: 'A pug pressing a heavy barbell over its head without breaking a sweat. The barbell on top gives the outline an unusual top-heavy shape.',
    parts: [
      {
        shape: `<rect x="8" y="22" width="184" height="9" rx="3"/><rect x="18" y="4" width="14" height="45" rx="3"/><rect x="34" y="10" width="11" height="33" rx="3"/>
          <rect x="168" y="4" width="14" height="45" rx="3"/><rect x="155" y="10" width="11" height="33" rx="3"/>
          <path d="M60,104 L48,36 Q50,26 60,28 L74,96 Z M140,104 L152,36 Q150,26 140,28 L126,96 Z"/>`,
        detail: '',
      },
      ...fit(head('pug-life'), { k: 0.95, dy: 42 }),
    ],
  },
  {
    id: 'spike',
    name: 'Spike',
    animal: 'Hedgehog',
    edge: 'Skateboard',
    style: 'New',
    group: 'new',
    note: 'A punk hedgehog cruising on a skateboard. Spiky ball on top, flat board with wheels below, and it reads clearly at any size.',
    parts: [
      ...fit(head('spike'), { k: 0.92, dy: -10 }),
      {
        shape: `<path d="M14,156 Q10,148 20,150 L180,150 Q190,148 186,156 Q182,168 170,168 L30,168 Q18,168 14,156 Z"/>
          <rect x="44" y="166" width="20" height="8"/><rect x="136" y="166" width="20" height="8"/><circle cx="54" cy="182" r="10"/><circle cx="146" cy="182" r="10"/>`,
        detail: `<circle cx="54" cy="182" r="3.5" fill="${K}"/><circle cx="146" cy="182" r="3.5" fill="${K}"/>`,
      },
    ],
  },
  {
    id: 'scar',
    name: 'Scar',
    animal: 'Tiger cub',
    edge: 'Claw marks',
    style: 'New',
    group: 'new',
    note: 'A tiger cub in front of three huge claw slashes. It looks like it just tore through the page to get to you.',
    parts: [
      {
        shape: [0, 1, 2].map(i => {
          const o = (i - 1) * 26;
          return `<path d="M${186 + o},${8 + o} Q${120 + o},${86 + o} ${20 + o},${190 + o} Q${118 + o},${100 + o} ${176 + o},${20 + o} Z" transform="translate(${-o * 0.6},${o * 0.6})"/>`;
        }).join(''),
        detail: '',
      },
      ...fit(head('scar'), { k: 0.9, dy: 4 }),
    ],
  },
];

const kept = marks.filter(m => m.group === 'kept');
const fresh = marks.filter(m => m.group === 'new');
module.exports = { logos: marks, kept, fresh, renderLogo };
