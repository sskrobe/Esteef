// Round 2: four keepers from Round 1 plus ten new marks.
// Same mask convention as Round 1: "#fff" is solid ink, "#000" is a cut-out.
// New marks use heavier shapes and wider cut-outs so they stay legible at chest size.
const round1 = require('../round-1/logos');

const W = '#fff';
const K = '#000';
const angryEye = (x1, y1, x2, y2, r = 9) => `<path d="M${x1},${y1} L${x2},${y2} A${r},${r} 0 0 1 ${x1},${y1} Z" fill="${K}"/>`;
const mirror = inner => `<g transform="translate(200,0) scale(-1,1)">${inner}</g>`;

const keep = ['kitty-crossbones', 'bad-panda', 'mob-koala', 'pirate-duck'];
const keepNotes = {
  'mob-koala': 'You liked it in light ink on a dark shirt more than dark ink on a light one. Round 3 can open up more cut-outs so it works on both.',
};
const kept = keep.map(id => {
  const l = round1.logos.find(x => x.id === id);
  return { ...l, kept: true, note: keepNotes[id] || l.note };
});

const joystick = `
  <rect x="-5" y="-66" width="10" height="122" rx="5" fill="${W}"/>
  <circle cx="0" cy="-72" r="15" fill="${W}"/>
  <rect x="-24" y="52" width="48" height="18" rx="5" fill="${W}"/>`;

const glove = `
  <path d="M26,136 C24,112 60,108 70,128 C80,148 70,172 48,174 C30,174 26,158 26,136 Z" fill="${W}" stroke="${K}" stroke-width="7" paint-order="stroke" stroke-linejoin="round"/>
  <rect x="32" y="170" width="32" height="16" rx="4" fill="${W}" stroke="${K}" stroke-width="7" paint-order="stroke"/>
  <path d="M34,178 L62,178" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M38,140 Q50,130 62,140" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>`;

const fresh = [
  {
    id: 'alien-grill',
    name: 'Big Head',
    animal: 'Alien',
    edge: 'Hip hop',
    style: 'Emblem',
    note: 'A cute alien with huge almond eyes and a gold grill. The silhouette is recognizable at any size, and aliens are big in streetwear right now.',
    art: `
      <path d="M84,46 L70,20 M116,46 L130,20" stroke="${W}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="68" cy="16" r="9" fill="${W}"/><circle cx="132" cy="16" r="9" fill="${W}"/>
      <path d="M100,40 C150,40 172,74 166,104 C160,140 126,174 100,176 C74,174 40,140 34,104 C28,74 50,40 100,40 Z" fill="${W}"/>
      <path d="M46,98 C54,78 82,78 94,104 C82,120 56,118 46,98 Z" fill="${K}"/>
      <path d="M154,98 C146,78 118,78 106,104 C118,120 144,118 154,98 Z" fill="${K}"/>
      <circle cx="68" cy="94" r="6" fill="${W}"/><circle cx="132" cy="94" r="6" fill="${W}"/>
      <circle cx="78" cy="106" r="2.5" fill="${W}"/><circle cx="122" cy="106" r="2.5" fill="${W}"/>
      <path d="M74,136 Q100,150 126,136 Q122,160 100,162 Q78,160 74,136 Z" fill="${K}"/>
      <path d="M84,142 L84,150 M93,145 L93,153 M102,145 L102,153 M111,143 L111,151" stroke="${W}" stroke-width="6" stroke-linecap="round"/>`,
  },
  {
    id: 'toast-fighter',
    name: 'Toast',
    animal: 'Slice of bread',
    edge: 'MMA',
    style: 'Graphic',
    note: 'A fired-up slice of bread in boxing gloves, as a mascot for Daily Bread. A bread slice is instantly recognizable, and the gloves add the fight-night attitude.',
    art: `
      <path d="M52,92 C28,92 28,46 64,42 C78,24 122,24 136,42 C172,46 172,92 148,92 L148,164 Q148,172 140,172 L60,172 Q52,172 52,164 Z" fill="${W}"/>
      <path d="M63,94 C44,92 44,58 70,54 C82,40 118,40 130,54 C156,58 156,92 137,94 L137,160 L63,160 Z" fill="${W}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
      ${angryEye(70, 98, 94, 108, 13)}
      ${angryEye(106, 108, 130, 98, 13)}
      <circle cx="85" cy="110" r="3.5" fill="${W}"/><circle cx="115" cy="110" r="3.5" fill="${W}"/>
      <rect x="80" y="124" width="40" height="16" rx="5" fill="${K}"/>
      <path d="M90,126 L90,138 M100,126 L100,138 M110,126 L110,138" stroke="${W}" stroke-width="3"/>
      <g transform="translate(-6,42) scale(0.8)">${glove}</g>
      <g transform="translate(206,42) scale(-0.8,0.8)">${glove}</g>`,
  },
  {
    id: 'money-bag',
    name: 'Bag Secured',
    animal: 'Money bag',
    edge: 'Heist',
    style: 'Emblem',
    note: 'A money bag in a ski mask, a plain take on "bread" as money. The bag shape and the $ read clearly from across a room.',
    art: `
      <path d="M74,36 L88,56 L100,40 L112,56 L126,36 Q132,62 118,72 L82,72 Q68,62 74,36 Z" fill="${W}"/>
      <path d="M100,72 C152,72 174,122 168,150 C162,174 132,180 100,180 C68,180 38,174 32,150 C26,122 48,72 100,72 Z" fill="${W}"/>
      <rect x="76" y="64" width="48" height="12" rx="6" fill="${W}" stroke="${K}" stroke-width="7" paint-order="stroke"/>
      <rect x="48" y="96" width="104" height="30" rx="15" fill="${K}"/>
      <circle cx="78" cy="111" r="9" fill="${W}"/><circle cx="122" cy="111" r="9" fill="${W}"/>
      <circle cx="82" cy="110" r="4" fill="${K}"/><circle cx="126" cy="110" r="4" fill="${K}"/>
      <path d="M114,142 Q104,134 94,138 Q82,144 96,152 L106,156 Q120,162 110,170 Q100,176 86,168" fill="none" stroke="${K}" stroke-width="7" stroke-linecap="round"/>
      <path d="M100,130 L100,178" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`,
  },
  {
    id: 'game-over-ghost',
    name: 'Game Over',
    animal: 'Arcade ghost',
    edge: 'Gamer',
    style: 'Emblem',
    note: 'An angry arcade ghost over crossed joysticks. It follows the same layout as Psycho Bunny’s skull and crossbones, in gaming terms.',
    art: `
      <g transform="translate(100,118) rotate(-48) scale(1.1)">${joystick}</g>
      <g transform="translate(100,118) rotate(48) scale(1.1)">${joystick}</g>
      <path d="M52,170 L52,96 C52,58 76,40 100,40 C124,40 148,58 148,96 L148,170 L132,156 L116,170 L100,156 L84,170 L68,156 Z" fill="${W}" stroke="${K}" stroke-width="10" paint-order="stroke" stroke-linejoin="round"/>
      ${angryEye(64, 92, 94, 104, 16)}
      ${angryEye(106, 104, 136, 92, 16)}
      <circle cx="83" cy="108" r="4.5" fill="${W}"/><circle cx="117" cy="108" r="4.5" fill="${W}"/>
      <path d="M78,130 Q100,150 122,130 Q100,140 78,130 Z" fill="${K}" stroke="${K}" stroke-width="3" stroke-linejoin="round"/>`,
  },
  {
    id: 'mma-bear',
    name: 'Ground & Pound',
    animal: 'Bear cub',
    edge: 'MMA',
    style: 'Graphic',
    note: 'A bear cub in a fight headband with its gloves up. It looks like a stuffed toy that could choke you out.',
    art: `
      <circle cx="60" cy="44" r="16" fill="${W}"/><circle cx="140" cy="44" r="16" fill="${W}"/>
      <circle cx="60" cy="44" r="7" fill="${K}"/><circle cx="140" cy="44" r="7" fill="${K}"/>
      <path d="M58,64 L26,54 M58,70 L28,82" stroke="${W}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="100" cy="86" r="50" fill="${W}"/>
      <rect x="50" y="58" width="100" height="11" fill="${K}"/>
      ${angryEye(72, 80, 92, 88, 11)}
      ${angryEye(108, 88, 128, 80, 11)}
      <circle cx="84" cy="90" r="2.8" fill="${W}"/><circle cx="116" cy="90" r="2.8" fill="${W}"/>
      <ellipse cx="100" cy="110" rx="20" ry="14" fill="${W}" stroke="${K}" stroke-width="5" paint-order="stroke"/>
      <ellipse cx="100" cy="104" rx="7" ry="4.5" fill="${K}"/>
      <path d="M100,108 L100,114 M92,118 Q100,114 108,118" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>
      <g transform="translate(8,-4)">${glove}</g>
      <g transform="translate(192,-4) scale(-1,1)">${glove}</g>`,
  },
  {
    id: 'chain-frog',
    name: 'Hop',
    animal: 'Frog',
    edge: 'Hip hop',
    style: 'Emblem',
    note: 'An unimpressed frog wearing a chain with a bread-loaf pendant, a nod to Daily Bread. The wide face and eye bumps make an unusual silhouette.',
    art: `<g transform="translate(0,-12)">
      <circle cx="64" cy="70" r="26" fill="${W}"/><circle cx="136" cy="70" r="26" fill="${W}"/>
      <ellipse cx="100" cy="110" rx="72" ry="46" fill="${W}"/>
      <circle cx="64" cy="72" r="14" fill="${K}"/><circle cx="136" cy="72" r="14" fill="${K}"/>
      <rect x="48" y="56" width="32" height="15" fill="${W}"/><rect x="120" y="56" width="32" height="15" fill="${W}"/>
      <path d="M50,71 L78,71 M122,71 L150,71" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="68" cy="77" r="3" fill="${W}"/><circle cx="140" cy="77" r="3" fill="${W}"/>
      <circle cx="90" cy="100" r="2.6" fill="${K}"/><circle cx="110" cy="100" r="2.6" fill="${K}"/>
      <path d="M50,118 Q100,150 150,118" fill="none" stroke="${K}" stroke-width="6" stroke-linecap="round"/>
      <path d="M60,152 Q100,176 140,152" fill="none" stroke="${W}" stroke-width="6" stroke-dasharray="7 4"/>
      <path d="M100,160 L100,166" stroke="${W}" stroke-width="5"/>
      <path d="M84,186 C84,168 116,168 116,186 L116,192 L84,192 Z" fill="${W}" stroke="${K}" stroke-width="5" paint-order="stroke"/>
      <path d="M92,176 L96,183 M100,174 L104,181 M108,176 L111,182" stroke="${K}" stroke-width="2.5" stroke-linecap="round"/></g>`,
  },
  {
    id: 'reaper',
    name: 'Respawn',
    animal: 'Tiny reaper',
    edge: 'Gamer',
    style: 'Graphic',
    note: 'A tiny grim reaper with glowing cute eyes in a dark hood. It reads as "death" from afar and "adorable" up close, and "Respawn" is a gamer joke.',
    art: `
      <path d="M154,192 L172,30" stroke="${W}" stroke-width="8" stroke-linecap="round"/>
      <path d="M172,28 C146,6 96,8 62,32 C102,26 138,32 166,52 Z" fill="${W}" stroke="${W}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M100,32 C142,32 160,70 160,110 L168,178 L32,178 L40,110 C40,70 58,32 100,32 Z" fill="${W}" stroke="${K}" stroke-width="9" paint-order="stroke" stroke-linejoin="round"/>
      <path d="M100,62 C126,62 138,86 136,108 C134,130 118,142 100,142 C82,142 66,130 64,108 C62,86 74,62 100,62 Z" fill="${K}"/>
      <circle cx="86" cy="102" r="9" fill="${W}"/><circle cx="114" cy="102" r="9" fill="${W}"/>
      <circle cx="89" cy="99" r="3.2" fill="${K}"/><circle cx="117" cy="99" r="3.2" fill="${K}"/>
      <path d="M92,122 Q100,128 108,122" fill="none" stroke="${W}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M70,150 L66,178 M100,150 L100,178 M130,150 L134,178" stroke="${K}" stroke-width="4" stroke-linecap="round"/>`,
  },
  {
    id: 'loan-shark',
    name: 'Loan Shark',
    animal: 'Shark',
    edge: 'Mobster',
    style: 'Graphic',
    note: 'A chubby shark with a gold-tooth grin and an angry brow. The name ties straight into the money theme.',
    art: `
      <path d="M86,84 L104,40 L124,84 Z" fill="${W}" stroke="${W}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M30,106 C58,82 104,74 142,80 C168,84 188,100 190,114 C184,130 160,140 130,142 C96,146 62,138 42,126 L12,148 L22,112 L10,80 Z" fill="${W}" stroke="${W}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M96,138 L82,170 L122,140 Z" fill="${W}" stroke="${K}" stroke-width="6" paint-order="stroke" stroke-linejoin="round"/>
      <circle cx="156" cy="102" r="7" fill="${K}"/><circle cx="158" cy="100" r="2.4" fill="${W}"/>
      <path d="M142,88 L168,96" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
      <path d="M140,120 Q166,128 188,116 Q182,138 160,138 Q144,136 140,120 Z" fill="${K}"/>
      <path d="M150,124 L154,132 L158,125 M164,125 L168,133 L172,124" fill="${W}" stroke="${W}" stroke-width="2.5" stroke-linejoin="round"/>
      <rect x="175" y="121" width="8" height="8" rx="1.5" fill="${W}"/>
      <path d="M118,98 Q114,110 118,122 M108,98 Q104,110 108,122 M98,98 Q94,110 98,122" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>`,
  },
  {
    id: 'ufo-bread',
    name: 'Abducted',
    animal: 'Alien in a UFO',
    edge: 'Heist',
    style: 'Graphic',
    note: 'An alien in a flying saucer beaming up a loaf of bread. It says "taking the bread" in one picture and works as a brand story for Daily Bread.',
    art: `
      <path d="M78,92 L44,184 M122,92 L156,184" stroke="${W}" stroke-width="4" stroke-linecap="round"/>
      <path d="M70,114 L130,114 M62,136 L138,136" stroke="${W}" stroke-width="3" stroke-dasharray="6 6" stroke-linecap="round"/>
      <ellipse cx="100" cy="54" rx="30" ry="28" fill="${W}"/>
      <ellipse cx="100" cy="56" rx="24" ry="22" fill="${K}"/>
      <path d="M100,40 C114,40 120,50 118,60 C116,70 106,76 100,76 C94,76 84,70 82,60 C80,50 86,40 100,40 Z" fill="${W}"/>
      <path d="M86,56 C90,50 96,52 98,60 C93,63 88,62 86,56 Z M114,56 C110,50 104,52 102,60 C107,63 112,62 114,56 Z" fill="${K}"/>
      <ellipse cx="100" cy="80" rx="72" ry="17" fill="${W}" stroke="${K}" stroke-width="7" paint-order="stroke"/>
      ${[56, 78, 100, 122, 144].map(x => `<circle cx="${x}" cy="83" r="4.5" fill="${K}"/>`).join('')}
      <path d="M68,166 C68,138 132,138 132,166 L132,180 Q132,186 126,186 L74,186 Q68,186 68,180 Z" fill="${W}"/>
      <path d="M84,150 L92,164 M98,146 L106,160 M112,148 L120,162" stroke="${K}" stroke-width="4.5" stroke-linecap="round"/>`,
  },
  {
    id: 'pigeon',
    name: 'Block Bird',
    animal: 'City pigeon',
    edge: 'Street',
    style: 'Emblem',
    note: 'The most street animal there is: a pigeon in a flat-brim fitted cap with a side-eye. A funny pick that still looks good on a chest.',
    art: `
      <path d="M64,168 L18,186 L30,170 L16,160 Z" fill="${W}" stroke="${W}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M58,176 C36,146 46,104 90,96 C122,90 152,112 152,144 C152,166 132,180 100,180 Z" fill="${W}"/>
      <circle cx="114" cy="78" r="32" fill="${W}"/>
      <path d="M140,80 L170,90 L140,98 Z" fill="${W}" stroke="${K}" stroke-width="5" paint-order="stroke" stroke-linejoin="round"/>
      <path d="M82,66 C82,30 144,30 146,64 Z" fill="${W}" stroke="${K}" stroke-width="7" paint-order="stroke" stroke-linejoin="round"/>
      <rect x="128" y="58" width="50" height="10" rx="4" fill="${W}" stroke="${K}" stroke-width="6" paint-order="stroke"/>
      <circle cx="114" cy="44" r="4" fill="${K}"/>
      <circle cx="126" cy="82" r="8" fill="${K}"/>
      <rect x="117" y="72" width="18" height="8" fill="${W}"/>
      <path d="M117,80 L135,80" stroke="${K}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="130" cy="84" r="2.4" fill="${W}"/>
      <path d="M86,108 Q114,122 144,108" fill="none" stroke="${K}" stroke-width="5" stroke-dasharray="6 4"/>
      <path d="M66,138 Q100,124 136,146 M70,156 Q96,146 122,160" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
      <path d="M88,180 L84,194 M112,180 L116,194" stroke="${W}" stroke-width="5" stroke-linecap="round"/>`,
  },
];

module.exports = { kept, fresh, logos: [...kept, ...fresh], renderLogo: round1.renderLogo };
