// Round 3: six keepers (four from Round 1, two from Round 2) plus twelve new marks:
// six tough-attitude foods and six cute-but-dangerous animals.
// Same mask convention: "#fff" is solid ink, "#000" is a cut-out.
const round1 = require('../round-1/logos');
const round2 = require('../round-2/logos');

const W = '#fff';
const K = '#000';
const angryEye = (x1, y1, x2, y2, r = 9) => `<path d="M${x1},${y1} L${x2},${y2} A${r},${r} 0 0 1 ${x1},${y1} Z" fill="${K}"/>`;
const eyes = (y = 100, spread = 24, r = 12) => {
  const lx = 100 - spread, rx = 100 + spread, h = r * 0.95;
  return `${angryEye(lx - h, y - 4, lx + h, y + 4, r)}${angryEye(rx - h, y + 4, rx + h, y - 4, r)}
    <circle cx="${lx + 3}" cy="${y + 6}" r="${(r * 0.27).toFixed(1)}" fill="${W}"/><circle cx="${rx - 3}" cy="${y + 6}" r="${(r * 0.27).toFixed(1)}" fill="${W}"/>`;
};
const gap = (w = 7) => `stroke="${K}" stroke-width="${w}" paint-order="stroke" stroke-linejoin="round"`;

const find = (set, id) => ({ ...set.logos.find(l => l.id === id), kept: true });
const kept = [
  find(round1, 'kitty-crossbones'),
  find(round1, 'bad-panda'),
  { ...find(round1, 'mob-koala'), note: round2.kept.find(l => l.id === 'mob-koala').note },
  find(round1, 'pirate-duck'),
  find(round2, 'mma-bear'),
  find(round2, 'toast-fighter'),
];

const drumstick = `
  <rect x="-62" y="-5.5" width="74" height="11" rx="5.5" fill="${W}"/>
  <circle cx="-64" cy="-7" r="8" fill="${W}"/><circle cx="-64" cy="7" r="8" fill="${W}"/>
  <path d="M4,-4 C10,-26 66,-28 70,0 C66,28 10,26 4,4 Z" fill="${W}"/>`;

const chopstick = `<path d="M-92,-5 L92,-2.5 L92,2.5 L-92,5 Z" fill="${W}" stroke="${W}" stroke-width="2" stroke-linejoin="round"/>`;

const spikes = (() => {
  const pts = [];
  const n = 13;
  for (let i = 0; i <= n * 2; i++) {
    const a = Math.PI + (i / (n * 2)) * Math.PI * 1.0 - 0.18 + (i / (n * 2)) * 0.36;
    const r = i % 2 === 0 ? 62 : 90;
    pts.push(`${(100 + Math.cos(a) * r).toFixed(1)},${(118 + Math.sin(a) * r).toFixed(1)}`);
  }
  return `<path d="M${pts.join(' L')} Z" fill="${W}" stroke="${W}" stroke-width="3" stroke-linejoin="round"/>`;
})();

const food = [
  {
    id: 'pizza',
    name: 'Hot Slice',
    animal: 'Pizza slice',
    edge: 'Street',
    style: 'Emblem',
    group: 'food',
    note: 'A pizza slice in black shades with a smirk. A triangle silhouette is about as recognizable as a shape gets.',
    art: `
      <path d="M30,40 Q100,16 170,40 L166,60 Q100,40 34,60 Z" fill="${W}"/>
      <path d="M38,64 Q100,46 162,64 L100,190 Z" fill="${W}" ${gap(6)}/>
      <circle cx="80" cy="72" r="6" fill="${K}"/><circle cx="122" cy="70" r="6" fill="${K}"/>
      <rect x="52" y="84" width="44" height="22" rx="7" fill="${K}"/><rect x="104" y="84" width="44" height="22" rx="7" fill="${K}"/>
      <rect x="90" y="87" width="20" height="5" fill="${K}"/>
      <path d="M66,94 L76,90 M110,94 L120,90" stroke="${W}" stroke-width="3" stroke-linecap="round"/>
      <path d="M86,128 Q102,138 116,122" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="100" cy="158" r="7" fill="${K}"/>`,
  },
  {
    id: 'nugget',
    name: 'Nug Life',
    animal: 'Chicken nugget',
    edge: 'Fighter',
    style: 'Emblem',
    group: 'food',
    note: 'A chicken nugget with a black eye and a bandage, back from a fight. The lumpy nugget outline and the bandage make it read as tough from far away.',
    art: `
      <path d="M48,80 C40,50 80,36 104,44 C130,34 166,52 160,86 C172,112 158,150 128,158 C100,172 60,164 46,140 C30,120 36,100 48,80 Z" fill="${W}"/>
      <ellipse cx="72" cy="62" rx="3" ry="2" fill="${K}"/><ellipse cx="138" cy="68" rx="3" ry="2" fill="${K}"/>
      <ellipse cx="148" cy="128" rx="3" ry="2" fill="${K}"/><ellipse cx="58" cy="146" rx="3" ry="2" fill="${K}"/>
      ${eyes(98, 25, 13)}
      <circle cx="125" cy="101" r="21" fill="none" stroke="${K}" stroke-width="4.5"/>
      <g transform="rotate(-28 74 124)"><rect x="56" y="117" width="36" height="14" rx="7" fill="${W}" ${gap(5)}/>
        <rect x="68" y="119" width="12" height="10" fill="${K}" opacity="0"/><circle cx="71" cy="124" r="1.6" fill="${K}"/><circle cx="77" cy="124" r="1.6" fill="${K}"/></g>
      <path d="M88,140 Q102,130 116,140" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`,
  },
  {
    id: 'chick-drumsticks',
    name: 'Fowl Play',
    animal: 'Baby chick',
    edge: 'Pirate',
    style: 'Emblem',
    group: 'food',
    note: 'An angry baby chick over crossed fried-chicken drumsticks. It uses the Nine Lives skull-and-crossbones layout and adds dark humor.',
    art: `
      <g transform="translate(100,124) rotate(-38) scale(1.15)">${drumstick}</g>
      <g transform="translate(100,124) scale(-1,1) rotate(-38) scale(1.15)">${drumstick}</g>
      <ellipse cx="100" cy="58" rx="6" ry="13" fill="${W}"/>
      <ellipse cx="89" cy="62" rx="5" ry="11" transform="rotate(-32 89 62)" fill="${W}"/>
      <ellipse cx="111" cy="62" rx="5" ry="11" transform="rotate(32 111 62)" fill="${W}"/>
      <circle cx="100" cy="112" r="44" fill="${W}" ${gap(10)}/>
      ${eyes(106, 20, 11)}
      <path d="M88,122 L112,122 L100,138 Z" fill="${W}" ${gap(5)}/>`,
  },
  {
    id: 'big-cheese',
    name: 'Big Cheese',
    animal: 'Cheese wedge',
    edge: 'Mob boss',
    style: 'Graphic',
    group: 'food',
    note: '"Big cheese" is slang for the boss. A cheese wedge in a crown with a menacing stare.',
    art: `
      <path d="M118,58 L118,30 L130,44 L142,24 L154,44 L166,30 L166,58 Z" fill="${W}" ${gap(6)}/>
      <path d="M22,108 L178,108 L142,62 Z" fill="${W}"/>
      <rect x="22" y="112" width="156" height="62" rx="4" fill="${W}"/>
      <ellipse cx="96" cy="96" rx="8" ry="4.5" fill="${K}"/><ellipse cx="138" cy="84" rx="6" ry="3.5" fill="${K}"/><ellipse cx="160" cy="100" rx="5" ry="3" fill="${K}"/>
      <circle cx="30" cy="150" r="8" fill="${K}"/><circle cx="172" cy="162" r="9" fill="${K}"/><circle cx="170" cy="126" r="5" fill="${K}"/><circle cx="58" cy="168" r="5" fill="${K}"/>
      ${eyes(134, 24, 12)}
      <path d="M84,160 Q100,166 118,154" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`,
  },
  {
    id: 'ramen',
    name: 'Broth Boss',
    animal: 'Ramen bowl',
    edge: 'Pirate',
    style: 'Graphic',
    group: 'food',
    note: 'A grumpy ramen bowl over crossed chopsticks, with steam rising. Ramen is everywhere right now, and chopsticks make a natural crossbones.',
    art: `
      <g transform="translate(100,112) rotate(-32)">${chopstick}</g>
      <g transform="translate(100,112) rotate(32)">${chopstick}</g>
      <path d="M78,62 q-10,-12 0,-24 t0,-24 M100,58 q-10,-12 0,-24 t0,-24 M122,62 q-10,-12 0,-24 t0,-24" fill="none" stroke="${W}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="132" cy="92" r="14" fill="${W}" ${gap(6)}/><circle cx="132" cy="92" r="6" fill="${K}"/>
      <path d="M44,100 q8,-12 16,0 t16,0 t16,0 t16,0" fill="none" stroke="${W}" stroke-width="5" stroke-linecap="round" ${gap(10).replace('stroke="#000" ', '')}/>
      <path d="M26,104 L174,104 Q170,162 120,174 L80,174 Q30,162 26,104 Z" fill="${W}" ${gap(8)}/>
      <rect x="72" y="174" width="56" height="12" rx="3" fill="${W}" ${gap(6)}/>
      <path d="M30,116 L170,116" stroke="${K}" stroke-width="4"/>
      ${eyes(134, 24, 12)}
      <path d="M88,160 Q100,152 112,160" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`,
  },
  {
    id: 'dumpling',
    name: 'Steamed',
    animal: 'Dumpling',
    edge: 'Hothead',
    style: 'Emblem',
    group: 'food',
    note: 'A dumpling literally steaming mad, with a cartoon anger mark. "Steamed" is a pun that works in one word.',
    art: `
      <path d="M58,62 q-10,-12 0,-24 t0,-24 M142,62 q10,-12 0,-24 t0,-24" fill="none" stroke="${W}" stroke-width="6" stroke-linecap="round"/>
      <path d="M26,156 C22,112 60,74 100,70 C140,74 178,112 174,156 Q100,180 26,156 Z" fill="${W}"/>
      <path d="M90,72 Q100,52 110,72 Z" fill="${W}" ${gap(5)}/>
      <path d="M100,74 Q88,86 86,100 M100,74 Q112,86 114,100 M98,74 Q74,82 64,98 M102,74 Q126,82 136,98" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
      ${eyes(124, 26, 13)}
      <path d="M90,154 Q100,146 110,154" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
      <path d="M140,100 q7,0 7,-7 M156,100 q-7,0 -7,-7 M140,108 q7,0 7,7 M156,108 q-7,0 -7,7" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>`,
  },
  {
    id: 'fries',
    name: 'Small Fry',
    animal: 'French fries',
    edge: 'Tough guy',
    style: 'Emblem',
    group: 'food',
    note: 'A fry carton with a scowl and fries sticking up like a mohawk. "Small fry" means a nobody, which makes it funny on a guy who acts tough.',
    art: `
      ${[[62, -14, 40], [78, -6, 26], [94, -2, 18], [110, 4, 22], [126, 10, 30], [142, 16, 44], [86, -10, 34], [118, 8, 38]]
        .map(([x, a, top]) => `<rect x="${x - 6}" y="${top}" width="12" height="${96 - top}" rx="2" transform="rotate(${a} ${x} 96)" fill="${W}" ${gap(5)}/>`).join('')}
      <path d="M40,84 Q70,100 100,84 Q130,100 160,84 L142,186 L58,186 Z" fill="${W}" ${gap(8)}/>
      ${eyes(124, 22, 12)}
      <path d="M86,160 Q100,148 114,160" fill="none" stroke="${K}" stroke-width="6" stroke-linecap="round"/>`,
  },
  {
    id: 'burger',
    name: 'Beef',
    animal: 'Hamburger',
    edge: 'Feud',
    style: 'Graphic',
    group: 'food',
    note: '"Beef" is slang for a feud. A stacked burger glaring at you, with the cheese layer as gritted teeth. It’s the most hip hop pun in the set.',
    art: `
      <path d="M28,100 C28,36 172,36 172,100 Z" fill="${W}" ${gap(6)}/>
      ${[[78, 50, -20], [100, 46, 0], [122, 50, 20], [62, 64, -30], [138, 64, 30]].map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="2.6" transform="rotate(${a} ${x} ${y})" fill="${K}"/>`).join('')}
      ${eyes(80, 26, 12)}
      <path d="M26,106 L174,106 L162,120 L146,110 L130,124 L114,110 L100,124 L86,110 L70,124 L54,110 L38,120 Z" fill="${W}" ${gap(5)}/>
      <rect x="22" y="128" width="156" height="24" rx="12" fill="${W}" ${gap(6)}/>
      <path d="M34,136 q8,-5 16,0 M70,144 q8,-5 16,0 M118,136 q8,-5 16,0 M150,144 q8,-5 16,0" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>
      <path d="M30,160 L170,160 Q170,180 150,180 L50,180 Q30,180 30,160 Z" fill="${W}" ${gap(6)}/>`,
  },
];

const animals = [
  {
    id: 'ronin-shiba',
    name: 'Ronin',
    animal: 'Shiba Inu',
    edge: 'Samurai',
    style: 'Graphic',
    group: 'animal',
    note: 'A scarred Shiba with a katana across its back. A lone-samurai mood, with anime and gaming appeal.',
    art: `
      <g transform="rotate(-42 100 100)">
        <path d="M8,96 L136,96 L136,106 L18,106 Z" fill="${W}"/>
        <rect x="136" y="86" width="8" height="30" rx="2" fill="${W}"/>
        <rect x="144" y="94" width="48" height="12" rx="3" fill="${W}"/>
        ${[152, 164, 176].map(x => `<path d="M${x},96 L${x + 5},100 L${x},104 L${x - 5},100 Z" fill="${K}"/>`).join('')}
      </g>
      <path d="M46,74 L54,22 L92,52 Z M154,74 L146,22 L108,52 Z" fill="${W}" stroke="${W}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M100,46 C146,46 166,78 164,108 C162,146 132,172 100,172 C68,172 38,146 36,108 C34,78 54,46 100,46 Z" fill="${W}" ${gap(9)}/>
      <path d="M56,46 L60,66 L76,56 Z M144,46 L140,66 L124,56 Z" fill="${K}" stroke="${K}" stroke-width="3" stroke-linejoin="round"/>
      ${eyes(100, 26, 12)}
      <path d="M62,78 L88,122" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
      <path d="M46,122 Q70,112 88,128 Q100,118 112,128 Q130,112 154,122" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
      <path d="M92,134 Q100,130 108,134 Q104,144 100,144 Q96,144 92,134 Z" fill="${K}" stroke="${K}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M100,144 L100,150 M90,156 Q100,150 110,156" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>`,
  },
  {
    id: 'pug',
    name: 'Pug Life',
    animal: 'Pug',
    edge: 'Bruiser',
    style: 'Emblem',
    group: 'animal',
    note: 'A wrinkly pug in a spiked collar with a permanent frown. Small dog, big-dog energy.',
    art: `
      <path d="M38,64 Q44,38 76,46 L60,84 Z M162,64 Q156,38 124,46 L140,84 Z" fill="${W}"/>
      <ellipse cx="100" cy="98" rx="62" ry="56" fill="${W}" ${gap(8)}/>
      <path d="M84,58 Q100,52 116,58 M88,67 Q100,62 112,67" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
      ${eyes(90, 30, 14)}
      <ellipse cx="100" cy="124" rx="34" ry="25" fill="${K}"/>
      <ellipse cx="100" cy="114" rx="11" ry="6.5" fill="${W}"/>
      <path d="M100,120 L100,128 M86,136 Q100,128 114,136" fill="none" stroke="${W}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M104,134 L110,132 L108,141 Z" fill="${W}"/>
      <rect x="48" y="158" width="104" height="16" rx="8" fill="${W}" ${gap(7)}/>
      ${[64, 82, 100, 118, 136].map(x => `<path d="M${x - 7},174 L${x},190 L${x + 7},174 Z" fill="${W}" stroke="${W}" stroke-width="2" stroke-linejoin="round"/><circle cx="${x}" cy="166" r="3" fill="${K}"/>`).join('')}`,
  },
  {
    id: 'hedgehog',
    name: 'Spike',
    animal: 'Hedgehog',
    edge: 'Punk',
    style: 'Emblem',
    group: 'animal',
    note: 'A hedgehog whose spines double as a punk crown, with a sour face. You can read the outline even as a blur.',
    art: `
      ${spikes}
      <ellipse cx="100" cy="122" rx="52" ry="48" fill="${W}" ${gap(9)}/>
      ${eyes(114, 22, 12)}
      <circle cx="100" cy="138" r="7" fill="${K}"/>
      <path d="M88,154 Q100,148 114,156" fill="none" stroke="${K}" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M74,94 L92,102 M126,94 L108,102" stroke="${K}" stroke-width="4" stroke-linecap="round"/>`,
  },
  {
    id: 'cobra',
    name: 'Hiss',
    animal: 'Cobra',
    edge: 'Venom',
    style: 'Graphic',
    group: 'animal',
    note: 'A baby cobra with its hood flared and fangs out. The hood shape is unmistakable, and the eye-spot markings give it a mysterious look.',
    art: `
      <path d="M100,26 C152,26 176,78 164,120 C156,146 128,152 116,162 L116,192 L84,192 L84,162 C72,152 44,146 36,120 C24,78 48,26 100,26 Z" fill="${W}"/>
      <circle cx="58" cy="110" r="11" fill="${K}"/><circle cx="142" cy="110" r="11" fill="${K}"/>
      <circle cx="58" cy="110" r="4.5" fill="${W}"/><circle cx="142" cy="110" r="4.5" fill="${W}"/>
      <path d="M90,166 L110,166 M90,176 L110,176 M90,186 L110,186" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
      <path d="M100,124 L100,140 M100,140 L94,148 M100,140 L106,148" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse cx="100" cy="84" rx="34" ry="30" fill="${W}" ${gap(7)}/>
      ${eyes(80, 15, 9)}
      <path d="M84,98 Q100,106 116,98" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
      <path d="M89,101 L95,103 L92,116 Z M111,101 L105,103 L108,116 Z" fill="${W}" ${gap(3)}/>`,
  },
  {
    id: 'tiger-cub',
    name: 'Scar',
    animal: 'Tiger cub',
    edge: 'Fighter',
    style: 'Graphic',
    group: 'animal',
    note: 'A chubby tiger cub with a scar and a fang. The stripes give it a bold graphic look on a big front print, and it still reads as a baby.',
    art: `
      <circle cx="50" cy="58" r="19" fill="${W}"/><circle cx="150" cy="58" r="19" fill="${W}"/>
      <circle cx="51" cy="59" r="8" fill="${K}"/><circle cx="149" cy="59" r="8" fill="${K}"/>
      <ellipse cx="100" cy="106" rx="62" ry="56" fill="${W}" ${gap(8)}/>
      <path d="M84,52 L92,74 L98,52 Z M102,52 L108,74 L116,52 Z M72,58 L82,74 L84,56 Z M128,58 L118,74 L116,56 Z" fill="${K}"/>
      <path d="M38,92 L62,100 L39,108 Z M162,92 L138,100 L161,108 Z" fill="${K}"/>
      ${eyes(100, 26, 12)}
      <path d="M118,80 L136,120" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="88" cy="134" rx="15" ry="11" fill="${W}" ${gap(4)}/><ellipse cx="112" cy="134" rx="15" ry="11" fill="${W}" ${gap(4)}/>
      <path d="M92,118 L108,118 L100,126 Z" fill="${K}" stroke="${K}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M104,144 L111,144 L107,154 Z" fill="${W}" ${gap(3)}/>`,
  },
  {
    id: 'honey-badger',
    name: 'No Fear',
    animal: 'Honey badger',
    edge: 'Fearless',
    style: 'Emblem',
    group: 'animal',
    note: 'The honey badger is famous for fearing nothing. It’s a small, round, snarling face with the signature stripe over its head, and it fits a fight-culture brand.',
    art: `
      <circle cx="44" cy="96" r="12" fill="${W}"/><circle cx="156" cy="96" r="12" fill="${W}"/>
      <ellipse cx="100" cy="108" rx="58" ry="54" fill="${W}"/>
      <path d="M42,102 C46,52 154,52 158,102 L144,104 C138,72 62,72 56,104 Z" fill="${K}"/>
      ${eyes(108, 24, 11)}
      <ellipse cx="100" cy="132" rx="13" ry="8.5" fill="${K}"/>
      <ellipse cx="96" cy="129" rx="4" ry="2.5" fill="${W}"/>
      <path d="M74,148 Q100,136 126,148 Q100,166 74,148 Z" fill="${K}"/>
      <path d="M82,146 L88,145 L85,155 Z M118,146 L112,145 L115,155 Z" fill="${W}"/>`,
  },
];

const fresh = [...food, ...animals];
module.exports = { kept, fresh, food, animals, logos: [...kept, ...fresh], renderLogo: round1.renderLogo };
