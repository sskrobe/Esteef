// Round 4: every mark follows one formula, learned from the Psycho Bunny outline print:
//   a character head with a distinctive outline + two crossed objects beneath it.
// Each mark is a list of parts, back to front. A part is { shape, detail }:
//   shape  - solid silhouette only (no fill/stroke attributes; the renderer paints it)
//   detail - inner features drawn on top, "#fff" = ink, "#000" = cut-out
// Parts are separated by a cut-out gap, so the outline view can trace each one on its own.

const W = '#fff';
const K = '#000';
const GAP = 14;

const angryEye = (x1, y1, x2, y2, r) => `<path d="M${x1},${y1} L${x2},${y2} A${r},${r} 0 0 1 ${x1},${y1} Z" fill="${K}"/>`;
// The brand's attitude is "better than you", so faces are unimpressed rather than angry:
// heavy half-closed lids, both pupils sliding to one side, one eyebrow raised.
const eyes = (y, spread, r) => {
  const lid = x => `<path d="M${x - r},${y} L${x + r},${y} A${r},${r} 0 0 1 ${x - r},${y} Z" fill="${K}"/>
    <circle cx="${(x + r * 0.42).toFixed(1)}" cy="${(y + r * 0.42).toFixed(1)}" r="${(r * 0.36).toFixed(1)}" fill="${W}"/>`;
  const lx = 100 - spread, rx = 100 + spread;
  return `${lid(lx)}${lid(rx)}
    <path d="M${lx - r},${(y - r * 0.8).toFixed(1)} Q${lx},${(y - r * 1.9).toFixed(1)} ${lx + r},${(y - r * 0.95).toFixed(1)}" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>`;
};
const gap = w => `stroke="${K}" stroke-width="${w}" paint-order="stroke" stroke-linejoin="round"`;

// Two copies of an object drawn along the x axis, crossed at (cx, cy).
// a > 0 points the object's +x end up and out; a < -90 points it down and out.
const cross = (obj, { cx = 100, cy = 148, a = 30, k = 1 } = {}) => [
  { shape: `<g transform="translate(${cx},${cy}) rotate(${-a}) scale(${k})">${obj.shape}</g>`, detail: obj.detail ? `<g transform="translate(${cx},${cy}) rotate(${-a}) scale(${k})">${obj.detail}</g>` : '' },
  { shape: `<g transform="translate(${cx},${cy}) scale(-1,1) rotate(${-a}) scale(${k})">${obj.shape}</g>`, detail: obj.detail ? `<g transform="translate(${cx},${cy}) scale(-1,1) rotate(${-a}) scale(${k})">${obj.detail}</g>` : '' },
];

// ---------- crossed objects (each spans roughly x -85..90 on its own axis) ----------
const obj = {
  fish: {
    shape: `<path d="M-52,0 C-30,-17 28,-19 50,-13 Q78,-11 82,0 Q78,11 50,13 C28,19 -30,17 -52,0 Z"/><path d="M-46,0 L-82,-21 L-72,0 L-82,21 Z"/>`,
    detail: `<path d="M-42,0 L44,0 M44,-11 Q36,0 44,11" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>
      ${[-30, -16, -2, 12, 26].map(x => `<path d="M${x},-10 L${x + 5},10" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>`).join('')}
      <circle cx="64" cy="-3" r="3.5" fill="${K}"/>`,
  },
  bamboo: {
    shape: `<rect x="-86" y="-7.5" width="172" height="15" rx="3"/>${[-52, -12, 28, 66].map(x => `<rect x="${x - 3.5}" y="-10" width="7" height="20" rx="2"/>`).join('')}`,
    detail: `<path d="M74,-7 Q88,-26 96,-30 Q86,-16 74,-7 Z" fill="${W}"/>`,
  },
  bat: {
    shape: `<circle cx="-84" cy="0" r="8.5"/><rect x="-84" y="-4.5" width="64" height="9" rx="4"/><path d="M-24,-4.5 Q30,-12 76,-11.5 Q88,-11.5 88,0 Q88,11.5 76,11.5 Q30,12 -24,4.5 Z"/>`,
    detail: `<path d="M-70,-4.5 L-70,4.5 M-62,-4.5 L-62,4.5" stroke="${K}" stroke-width="2.5"/>`,
  },
  cutlass: {
    shape: `<path d="M-34,-5.5 L58,-10 Q82,-11 92,5 Q72,1 -34,5.5 Z"/><rect x="-43" y="-16" width="9" height="32" rx="3"/><rect x="-78" y="-5.5" width="36" height="11" rx="3"/><circle cx="-81" cy="0" r="7.5"/>`,
    detail: `<path d="M-72,-5.5 L-66,5.5 M-62,-5.5 L-56,5.5 M-52,-5.5 L-46,5.5" stroke="${K}" stroke-width="2.5"/>`,
  },
  glove: {
    shape: `<rect x="-22" y="-12" width="48" height="24" rx="4"/><path d="M20,-22 C40,-31 82,-29 86,0 C88,27 52,33 28,23 C18,19 18,-18 20,-22 Z"/><ellipse cx="44" cy="-25" rx="15" ry="9"/>`,
    detail: `<path d="M2,-12 L2,12" stroke="${K}" stroke-width="4"/><path d="M34,-18 Q48,-12 60,-20" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>`,
  },
  knife: {
    shape: `<path d="M-6,-9 L72,-9 Q90,-9 90,0 Q88,8 72,9 L-6,9 Z"/><rect x="-13" y="-8" width="9" height="16" rx="2"/><rect x="-86" y="-8.5" width="76" height="17" rx="8.5"/>`,
    detail: `<circle cx="-62" cy="0" r="2.8" fill="${K}"/><circle cx="-36" cy="0" r="2.8" fill="${K}"/>`,
  },
  cutter: {
    shape: `<rect x="-84" y="-8" width="72" height="16" rx="8"/><rect x="-14" y="-3.5" width="62" height="7"/><circle cx="60" cy="0" r="21"/>`,
    detail: `<circle cx="60" cy="0" r="14" fill="none" stroke="${K}" stroke-width="3"/><circle cx="60" cy="0" r="4.5" fill="${K}"/>`,
  },
  spatula: {
    shape: `<rect x="-86" y="-7.5" width="66" height="15" rx="7.5"/><rect x="-22" y="-3.5" width="46" height="7"/><path d="M22,-17 L80,-19 Q90,-19 90,-10 L90,10 Q90,19 80,19 L22,17 Z"/>`,
    detail: `${[-10, -2, 6].map(y => `<rect x="40" y="${y}" width="36" height="4" rx="2" fill="${K}"/>`).join('')}`,
  },
  drumstick: {
    shape: `<rect x="-62" y="-6" width="74" height="12" rx="6"/><circle cx="-65" cy="-7.5" r="8.5"/><circle cx="-65" cy="7.5" r="8.5"/><path d="M4,-4 C10,-28 70,-30 74,0 C70,30 10,28 4,4 Z"/>`,
    detail: `<path d="M30,-14 Q44,-18 56,-10 M28,10 Q42,14 52,8" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`,
  },
  rocket: {
    shape: `<path d="M-50,-11 L46,-11 Q76,-10 90,0 Q76,10 46,11 L-50,11 Z"/><path d="M-36,-10 L-62,-28 L-66,-10 Z M-36,10 L-62,28 L-66,10 Z"/>
      <path d="M-52,-7 L-80,0 L-52,7 Z"/>`,
    detail: `<circle cx="22" cy="0" r="5.5" fill="${K}"/><path d="M44,-11 L44,11 M-30,-11 L-30,11" stroke="${K}" stroke-width="3"/>`,
  },
  chopstick: {
    shape: `<path d="M-90,-6.5 L90,-3.5 L90,3.5 L-90,6.5 Z"/>`,
    detail: `<path d="M-90,0 L-66,0" stroke="${K}" stroke-width="0"/>`,
  },
  bottle: {
    shape: `<rect x="-72" y="-15" width="88" height="30" rx="12"/><rect x="14" y="-11" width="16" height="22" rx="3"/><path d="M28,-6 L64,-2.5 L64,2.5 L28,6 Z"/><circle cx="65" cy="0" r="3.5"/>`,
    detail: `<rect x="-54" y="-8" width="44" height="16" rx="3" fill="none" stroke="${K}" stroke-width="3"/>`,
  },
  katana: {
    shape: `<path d="M-6,-5.5 L76,-5.5 Q88,-4 94,4 L-6,5.5 Z"/><ellipse cx="-11" cy="0" rx="5" ry="14"/><rect x="-82" y="-6.5" width="68" height="13" rx="3"/>`,
    detail: `${[-70, -54, -38].map(x => `<path d="M${x},-6 L${x + 6},0 L${x},6 L${x - 6},0 Z" fill="${K}"/>`).join('')}<path d="M4,2 L78,2" stroke="${K}" stroke-width="1.8"/>`,
  },
  dumbbell: {
    shape: `<rect x="-72" y="-4.5" width="144" height="9" rx="3"/>
      <rect x="40" y="-24" width="13" height="48" rx="3"/><rect x="56" y="-17" width="10" height="34" rx="3"/>
      <rect x="-53" y="-24" width="13" height="48" rx="3"/><rect x="-66" y="-17" width="10" height="34" rx="3"/>`,
    detail: '',
  },
  skateboard: {
    shape: `<rect x="-88" y="-9" width="176" height="18" rx="9"/><rect x="-60" y="8" width="14" height="6"/><rect x="46" y="8" width="14" height="6"/>
      <circle cx="-53" cy="17" r="7.5"/><circle cx="53" cy="17" r="7.5"/>`,
    detail: `<circle cx="-53" cy="17" r="2.5" fill="${K}"/><circle cx="53" cy="17" r="2.5" fill="${K}"/>`,
  },
  nunchuck: {
    shape: `<rect x="-88" y="-7.5" width="64" height="15" rx="7.5"/><rect x="24" y="-7.5" width="64" height="15" rx="7.5"/>
      ${[-18, -10, 10, 18].map(x => `<circle cx="${x}" cy="0" r="4"/>`).join('')}`,
    detail: `<path d="M-74,-7.5 L-74,7.5 M74,-7.5 L74,7.5" stroke="${K}" stroke-width="3"/>`,
  },
};

const marks = [
  // ---------------- refined keepers ----------------
  {
    id: 'nine-lives',
    name: 'Nine Lives',
    animal: 'Kitten skull',
    edge: 'Crossed fish bones',
    style: 'Kept',
    group: 'kept',
    note: 'Smaller skull, bigger fish. The pointed ears and fish tails are what your eye catches in the outline, the same way the bunny ears and bone knobs are.',
    parts: [
      ...cross(obj.fish, { cy: 138, a: 30, k: 0.86 }),
      {
        shape: `<path d="M50,80 L46,22 L80,44 Q100,38 120,44 L154,22 L150,80 Q152,110 128,120 L128,134 Q100,142 72,134 L72,120 Q48,110 50,80 Z"/>`,
        detail: `<path d="M56,36 L58,58 L74,47 Z M144,36 L142,58 L126,47 Z" fill="${K}" stroke="${K}" stroke-width="2" stroke-linejoin="round"/>
          <circle cx="79" cy="82" r="14" fill="${K}"/><circle cx="121" cy="82" r="14" fill="${K}"/>
          <circle cx="85" cy="76" r="4.5" fill="${W}"/><circle cx="127" cy="76" r="4.5" fill="${W}"/>
          <path d="M94,100 L106,100 L100,108 Z" fill="${K}" stroke="${K}" stroke-width="3" stroke-linejoin="round"/>
          <path d="M77,125 L123,125" stroke="${K}" stroke-width="3" stroke-linecap="round"/>
          ${[86, 94, 100, 106, 114].map(x => `<path d="M${x},120 L${x},132" stroke="${K}" stroke-width="2.5" stroke-linecap="round"/>`).join('')}`,
      },
    ],
  },
  {
    id: 'bamboo-bandit',
    name: 'Bamboo Bandit',
    animal: 'Panda',
    edge: 'Crossed bamboo',
    style: 'Kept',
    group: 'kept',
    note: 'The panda now sits on crossed bamboo stalks. In outline, the round ears and the knobby bamboo joints make it a panda even without the shades.',
    parts: [
      ...cross(obj.bamboo, { cy: 150, a: 28 }),
      {
        shape: `<circle cx="56" cy="38" r="19"/><circle cx="144" cy="38" r="19"/><ellipse cx="100" cy="80" rx="55" ry="49"/>`,
        detail: `<ellipse cx="100" cy="84" rx="47" ry="41" fill="${K}"/>
          <path d="M54,76 Q54,70 62,70 L88,70 Q94,70 94,76 Q94,98 76,100 Q58,100 54,88 Z" fill="${W}"/>
          <path d="M146,76 Q146,70 138,70 L112,70 Q106,70 106,76 Q106,98 124,100 Q142,100 146,88 Z" fill="${W}"/>
          <rect x="92" y="72" width="16" height="5" fill="${W}"/>
          <path d="M62,82 L72,74 M64,92 L80,78 M114,82 L124,74 M116,92 L132,78" stroke="${K}" stroke-width="3" stroke-linecap="round"/>
          <path d="M118,48 L132,64" stroke="${W}" stroke-width="3" stroke-linecap="round"/>
          <path d="M120,57 L127,51 M125,62 L132,56" stroke="${W}" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M90,108 Q100,103 110,108 Q105,117 100,117 Q95,117 90,108 Z" fill="${W}"/>
          <path d="M100,117 L100,121 M86,124 Q100,129 114,120" fill="none" stroke="${W}" stroke-width="3.5" stroke-linecap="round"/>`,
      },
    ],
  },
  {
    id: 'the-don',
    name: 'The Don',
    animal: 'Koala',
    edge: 'Crossed bats',
    style: 'Kept',
    group: 'kept',
    note: 'Fedora on top, big fluffy ears out wide, crossed bats below. The ears are now cut away from the head, so it no longer turns into a blob on light shirts.',
    parts: [
      ...cross(obj.bat, { cy: 150, a: 30 }),
      { shape: `<circle cx="47" cy="82" r="27"/><circle cx="153" cy="82" r="27"/>`, detail: `<circle cx="50" cy="86" r="13" fill="${K}"/><circle cx="150" cy="86" r="13" fill="${K}"/>` },
      {
        shape: `<ellipse cx="100" cy="98" rx="48" ry="42"/><path d="M64,62 L70,24 Q100,12 130,24 L136,62 Z"/><ellipse cx="100" cy="62" rx="64" ry="11"/>`,
        detail: `<rect x="66" y="48" width="68" height="8" fill="${K}"/>
          <path d="M92,20 Q100,30 108,20" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M40,64 Q100,80 160,64" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
          <circle cx="80" cy="92" r="8" fill="${K}"/><circle cx="120" cy="92" r="8" fill="${K}"/>
          <rect x="70" y="82" width="20" height="10" fill="${W}"/><rect x="110" y="82" width="20" height="10" fill="${W}"/>
          <path d="M70,92 L90,92 M110,92 L130,92" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>
          <ellipse cx="100" cy="110" rx="14" ry="17" fill="${W}" ${gap(6)}/>
          <ellipse cx="95" cy="104" rx="2.6" ry="4.5" fill="${K}"/>
          <path d="M88,131 Q100,135 112,129" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M108,131 L134,124" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>`,
      },
    ],
  },
  {
    id: 'captain-quack',
    name: 'Captain Quack',
    animal: 'Duckling',
    edge: 'Crossed cutlasses',
    style: 'Kept',
    group: 'kept',
    note: 'A pirate tricorn hat and a wide bill give the outline a shape you can’t mistake. Crossed cutlasses replace the bones so it doesn’t copy Psycho Bunny too closely.',
    parts: [
      ...cross(obj.cutlass, { cy: 150, a: 30 }),
      {
        shape: `<circle cx="100" cy="92" r="44"/><path d="M48,106 Q100,92 152,106 Q158,126 100,128 Q42,126 48,106 Z"/>`,
        detail: `<path d="M48,104 Q100,90 152,104 Q158,124 100,126 Q42,124 48,104 Z" fill="${W}" ${gap(6)}/>
          <path d="M58,114 Q100,120 142,114" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>
          <ellipse cx="92" cy="104" rx="2.5" ry="1.8" fill="${K}"/><ellipse cx="108" cy="104" rx="2.5" ry="1.8" fill="${K}"/>
          <path d="M62,72 L150,98" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
          <ellipse cx="121" cy="86" rx="13" ry="11" fill="${K}"/>
          <circle cx="80" cy="86" r="10" fill="${K}"/><circle cx="83" cy="88" r="5" fill="${W}"/>
          <path d="M66,74 L92,78" stroke="${K}" stroke-width="4.5" stroke-linecap="round"/>`,
      },
      {
        shape: `<path d="M28,60 C34,32 70,18 100,18 C130,18 166,32 172,60 C146,50 122,54 100,62 C78,54 54,50 28,60 Z"/>`,
        detail: `<circle cx="100" cy="36" r="7" fill="${K}"/><path d="M90,48 L110,54 M110,48 L90,54" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`,
      },
    ],
  },
  {
    id: 'ground-and-pound',
    name: 'Ground & Pound',
    animal: 'Bear cub',
    edge: 'Crossed fight gloves',
    style: 'Kept',
    group: 'kept',
    note: 'The headband tails flying off to one side make the outline instantly read as "fighter." The gloves now hang crossed at the wrists instead of covering the body.',
    parts: [
      ...cross(obj.glove, { cy: 136, a: -150, k: 0.8 }),
      {
        shape: `<circle cx="62" cy="34" r="15"/><circle cx="138" cy="34" r="15"/><circle cx="100" cy="76" r="46"/>
          <path d="M58,50 L20,36 L24,50 L56,60 Z"/><path d="M58,58 L22,72 L30,80 L60,66 Z"/>`,
        detail: `<circle cx="62" cy="34" r="6.5" fill="${K}"/><circle cx="138" cy="34" r="6.5" fill="${K}"/>
          <rect x="58" y="50" width="84" height="10" fill="${K}"/>
          ${eyes(78, 20, 10)}
          <ellipse cx="100" cy="98" rx="18" ry="12" fill="${W}" ${gap(5)}/>
          <ellipse cx="100" cy="93" rx="6.5" ry="4" fill="${K}"/>
          <path d="M100,97 L100,102 M93,106 Q100,102 107,106" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`,
      },
    ],
  },
  {
    id: 'toast',
    name: 'Toast',
    animal: 'Bread slice',
    edge: 'Crossed butter knives',
    style: 'Kept',
    group: 'kept',
    note: 'The bread-slice outline is one of the most recognizable food shapes there is. Crossed butter knives turn breakfast into a threat, and it’s a natural Daily Bread mascot.',
    parts: [
      ...cross(obj.knife, { cy: 144, a: 32 }),
      {
        shape: `<path d="M54,82 C30,82 30,40 64,36 C78,18 122,18 136,36 C170,40 170,82 146,82 L146,132 Q146,140 138,140 L62,140 Q54,140 54,132 Z"/>`,
        detail: `<path d="M65,84 C46,82 46,52 70,48 C82,34 118,34 130,48 C154,52 154,82 135,84 L135,130 L65,130 Z" fill="none" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
          ${eyes(88, 20, 11)}
          <rect x="82" y="106" width="36" height="13" rx="4" fill="${K}"/>
          <path d="M91,108 L91,117 M100,108 L100,117 M109,108 L109,117" stroke="${W}" stroke-width="2.5"/>`,
      },
    ],
  },
  {
    id: 'hot-slice',
    name: 'Hot Slice',
    animal: 'Pizza slice',
    edge: 'Crossed pizza cutters',
    style: 'Kept',
    group: 'kept',
    note: 'Melted cheese drips break the triangle so it reads as pizza, not a road sign. The crossed pizza-cutter wheels below play the role of the bone knobs.',
    parts: [
      ...cross(obj.cutter, { cy: 140, a: -150 }),
      {
        shape: `<path d="M28,32 Q100,8 172,32 L168,54 Q100,36 32,54 Z"/><path d="M36,56 Q100,40 164,56 L100,170 Z"/>
          <path d="M136,84 L148,84 L148,106 Q148,113 142,113 Q136,113 136,106 Z"/><path d="M58,100 L70,100 L70,124 Q70,130 64,130 Q58,130 58,124 Z"/>`,
        detail: `<path d="M34,55 Q100,38 166,55" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
          <rect x="54" y="66" width="40" height="18" rx="6" fill="${K}"/><rect x="106" y="66" width="40" height="18" rx="6" fill="${K}"/>
          <rect x="90" y="69" width="20" height="4" fill="${K}"/>
          <path d="M62,76 L70,71 M114,76 L122,71" stroke="${W}" stroke-width="3" stroke-linecap="round"/>
          <path d="M86,104 Q100,112 114,98" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
          <circle cx="100" cy="134" r="6" fill="${K}"/><circle cx="88" cy="118" r="4.5" fill="${K}"/>`,
      },
    ],
  },
  {
    id: 'beef',
    name: 'Beef',
    animal: 'Burger',
    edge: 'Crossed spatulas',
    style: 'Kept',
    group: 'kept',
    note: 'A stacked burger over crossed spatulas. The layered outline (dome bun, zigzag cheese, patty, flat bun) still reads as a burger with no detail at all.',
    parts: [
      ...cross(obj.spatula, { cy: 140, a: -148, k: 0.86 }),
      {
        shape: `<path d="M36,82 C36,24 164,24 164,82 Z"/><path d="M30,86 L170,86 L160,100 L146,92 L130,104 L114,92 L100,104 L86,92 L70,104 L54,92 L40,100 Z"/>
          <rect x="24" y="106" width="152" height="22" rx="11"/><path d="M34,132 L166,132 Q166,148 150,148 L50,148 Q34,148 34,132 Z"/>`,
        detail: `${[[78, 42, -20], [100, 38, 0], [122, 42, 20], [62, 56, -30], [138, 56, 30]].map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="2.4" transform="rotate(${a} ${x} ${y})" fill="${K}"/>`).join('')}
          ${eyes(66, 24, 11)}
          <path d="M30,86 L170,86 L160,100 L146,92 L130,104 L114,92 L100,104 L86,92 L70,104 L54,92 L40,100 Z" fill="${W}" ${gap(5)}/>
          <rect x="24" y="106" width="152" height="22" rx="11" fill="${W}" ${gap(5)}/>
          <path d="M36,114 q8,-5 16,0 M72,121 q8,-5 16,0 M116,114 q8,-5 16,0 M148,121 q8,-5 16,0" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>
          <path d="M34,132 L166,132 Q166,148 150,148 L50,148 Q34,148 34,132 Z" fill="${W}" ${gap(5)}/>`,
      },
    ],
  },

  // ---------------- new ----------------
  {
    id: 'fowl-play',
    name: 'Fowl Play',
    animal: 'Baby chick',
    edge: 'Crossed drumsticks',
    style: 'New',
    group: 'new',
    note: 'An angry chick over crossed fried-chicken drumsticks. The feather tuft, the meaty drumstick ends and the bone knobs give it a very readable outline, plus dark humor.',
    parts: [
      ...cross(obj.drumstick, { cy: 148, a: -150 }),
      {
        shape: `<circle cx="100" cy="78" r="44"/><ellipse cx="100" cy="28" rx="7" ry="15"/>
          <ellipse cx="87" cy="33" rx="5.5" ry="12" transform="rotate(-32 87 33)"/><ellipse cx="113" cy="33" rx="5.5" ry="12" transform="rotate(32 113 33)"/>`,
        detail: `${eyes(74, 20, 11)}<path d="M88,90 L112,90 L100,106 Z" fill="${W}" ${gap(5)}/>`,
      },
    ],
  },
  {
    id: 'big-head',
    name: 'Big Head',
    animal: 'Alien',
    edge: 'Crossed rockets',
    style: 'New',
    group: 'new',
    note: 'The alien head with its antennae is one of the strongest outlines in the set. Crossed retro rockets below keep the threat cartoonish.',
    parts: [
      ...cross(obj.rocket, { cy: 146, a: 30, k: 0.95 }),
      {
        shape: `<path d="M100,22 C146,22 166,52 160,80 C154,110 124,132 100,134 C76,132 46,110 40,80 C34,52 54,22 100,22 Z"/>
          <rect x="74" y="4" width="6" height="28" rx="3" transform="rotate(-28 77 30)"/><rect x="120" y="4" width="6" height="28" rx="3" transform="rotate(28 123 30)"/>
          <circle cx="64" cy="8" r="7.5"/><circle cx="136" cy="8" r="7.5"/>`,
        detail: `<path d="M50,74 C56,58 80,58 90,80 C80,94 58,92 50,74 Z" fill="${K}"/><path d="M150,74 C144,58 120,58 110,80 C120,94 142,92 150,74 Z" fill="${K}"/>
          <circle cx="70" cy="72" r="5" fill="${W}"/><circle cx="130" cy="72" r="5" fill="${W}"/>
          <path d="M80,106 Q100,116 120,106 Q116,124 100,126 Q84,124 80,106 Z" fill="${K}"/>
          <path d="M88,111 L88,118 M96,113 L96,120 M104,113 L104,120 M112,111 L112,118" stroke="${W}" stroke-width="5" stroke-linecap="round"/>`,
      },
    ],
  },
  {
    id: 'steamed',
    name: 'Steamed',
    animal: 'Dumpling',
    edge: 'Crossed chopsticks',
    style: 'New',
    group: 'new',
    note: 'A dumpling too good for this restaurant, over crossed chopsticks. The pinched top knot and the long chopsticks keep the outline clear.',
    parts: [
      ...cross(obj.chopstick, { cy: 146, a: 26 }),
      {
        shape: `<path d="M28,120 C24,80 62,46 100,42 C138,46 176,80 172,120 Q100,142 28,120 Z"/><path d="M88,46 Q100,18 112,46 Z"/>`,
        detail: `<path d="M100,48 Q88,60 86,74 M100,48 Q112,60 114,74 M98,48 Q74,56 64,72 M102,48 Q126,56 136,72" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
          ${eyes(94, 26, 12)}
          <path d="M90,120 Q100,112 110,120" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`,
      },
    ],
  },
  {
    id: 'small-fry',
    name: 'Small Fry',
    animal: 'French fries',
    edge: 'Crossed ketchup & mustard',
    style: 'New',
    group: 'new',
    note: 'A fry carton with a mohawk of fries, over crossed squeeze bottles. The jagged top edge is what makes the outline work.',
    parts: [
      ...cross(obj.bottle, { cy: 152, a: 30 }),
      {
        shape: `${[[64, -16, 18], [80, -7, 6], [95, -2, 2], [110, 5, 6], [125, 11, 12], [140, 18, 24], [88, -11, 14], [118, 8, 16]]
          .map(([x, a, top]) => `<rect x="${x - 6}" y="${top}" width="12" height="${80 - top}" rx="2" transform="rotate(${a} ${x} 80)"/>`).join('')}
          <path d="M44,66 Q72,80 100,66 Q128,80 156,66 L140,142 L60,142 Z"/>`,
        detail: `${[[64, -16, 18], [80, -7, 6], [95, -2, 2], [110, 5, 6], [125, 11, 12], [140, 18, 24], [88, -11, 14], [118, 8, 16]]
          .map(([x, a, top]) => `<rect x="${x - 6}" y="${top}" width="12" height="${80 - top}" rx="2" transform="rotate(${a} ${x} 80)" fill="${W}" ${gap(4)}/>`).join('')}
          <path d="M44,66 Q72,80 100,66 Q128,80 156,66 L140,142 L60,142 Z" fill="${W}" ${gap(6)}/>
          ${eyes(98, 20, 11)}
          <path d="M86,126 Q100,116 114,126" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`,
      },
    ],
  },
  {
    id: 'ronin',
    name: 'Ronin',
    animal: 'Shiba Inu',
    edge: 'Crossed katanas',
    style: 'New',
    group: 'new',
    note: 'A scarred Shiba over crossed katanas, now fully visible. The tall pointed ears and the curved guards make it read as "samurai dog" in outline.',
    parts: [
      ...cross(obj.katana, { cy: 148, a: 32 }),
      {
        shape: `<path d="M46,64 L54,12 L92,42 Z M154,64 L146,12 L108,42 Z"/><path d="M100,36 C144,36 164,64 162,92 C160,122 132,138 100,138 C68,138 40,122 38,92 C36,64 56,36 100,36 Z"/>`,
        detail: `<path d="M56,28 L59,52 L76,41 Z M144,28 L141,52 L124,41 Z" fill="${K}" stroke="${K}" stroke-width="3" stroke-linejoin="round"/>
          ${eyes(84, 24, 11)}
          <path d="M60,62 L84,102" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
          <path d="M46,100 Q68,92 86,106 Q100,96 114,106 Q132,92 154,100" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
          <path d="M92,110 Q100,106 108,110 Q104,119 100,119 Q96,119 92,110 Z" fill="${K}" stroke="${K}" stroke-width="2" stroke-linejoin="round"/>
          <path d="M100,119 L100,124 M91,128 Q100,123 109,128" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>`,
      },
    ],
  },
  {
    id: 'pug-life',
    name: 'Pug Life',
    animal: 'Pug',
    edge: 'Crossed dumbbells',
    style: 'New',
    group: 'new',
    note: 'A frowning pug over crossed dumbbells: small dog, gym-rat energy. The fold-over ears and the dumbbell plates give it a chunky, readable outline.',
    parts: [
      ...cross(obj.dumbbell, { cy: 150, a: 28 }),
      {
        shape: `<path d="M38,52 Q44,28 76,36 L60,76 Z M162,52 Q156,28 124,36 L140,76 Z"/><ellipse cx="100" cy="82" rx="56" ry="50"/>`,
        detail: `<path d="M84,44 Q100,38 116,44 M88,53 Q100,48 112,53" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
          <path d="M44,58 L62,74 M156,58 L138,74" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
          ${eyes(76, 28, 13)}
          <ellipse cx="100" cy="108" rx="30" ry="22" fill="${K}"/>
          <ellipse cx="100" cy="99" rx="10" ry="6" fill="${W}"/>
          <path d="M100,105 L100,112 M88,119 Q100,112 112,119" fill="none" stroke="${W}" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M104,117 L110,115 L108,124 Z" fill="${W}"/>`,
      },
    ],
  },
  {
    id: 'spike',
    name: 'Spike',
    animal: 'Hedgehog',
    edge: 'Crossed skateboards',
    style: 'New',
    group: 'new',
    note: 'A punk hedgehog over crossed skateboards. The spines are the most recognizable outline in the whole set, and skate decks bring the street side.',
    parts: [
      ...cross(obj.skateboard, { cy: 152, a: 28 }),
      {
        shape: (() => {
          const pts = [];
          const n = 12;
          for (let i = 0; i <= n * 2; i++) {
            const a = Math.PI - 0.2 + (i / (n * 2)) * (Math.PI + 0.4);
            const r = i % 2 === 0 ? 54 : 80;
            pts.push(`${(100 + Math.cos(a) * r).toFixed(1)},${(98 + Math.sin(a) * r).toFixed(1)}`);
          }
          return `<path d="M${pts.join(' L')} Z" stroke-linejoin="round"/><ellipse cx="100" cy="100" rx="46" ry="40"/>`;
        })(),
        detail: `<ellipse cx="100" cy="100" rx="46" ry="40" fill="${W}" ${gap(9)}/>
          ${eyes(96, 20, 11)}
          <circle cx="100" cy="112" r="6" fill="${K}"/>
          <path d="M89,126 Q100,120 112,128" fill="none" stroke="${K}" stroke-width="4.5" stroke-linecap="round"/>`,
      },
    ],
  },
  {
    id: 'scar',
    name: 'Scar',
    animal: 'Tiger cub',
    edge: 'Crossed nunchucks',
    style: 'New',
    group: 'new',
    note: 'A scarred tiger cub over crossed nunchucks, a martial-arts mood. The cheek tufts and round ears give a big-cat outline that doesn’t look like a bear.',
    parts: [
      ...cross(obj.nunchuck, { cy: 150, a: 30 }),
      {
        shape: `<circle cx="56" cy="36" r="17"/><circle cx="144" cy="36" r="17"/><ellipse cx="100" cy="80" rx="54" ry="48"/>
          <path d="M50,84 L28,104 L54,108 Z M150,84 L172,104 L146,108 Z"/>`,
        detail: `<circle cx="57" cy="37" r="7.5" fill="${K}"/><circle cx="143" cy="37" r="7.5" fill="${K}"/>
          <path d="M86,32 L92,50 L97,32 Z M103,32 L108,50 L114,32 Z M74,38 L82,52 L85,36 Z M126,38 L118,52 L115,36 Z" fill="${K}"/>
          <path d="M46,72 L66,78 L47,86 Z M154,72 L134,78 L153,86 Z" fill="${K}"/>
          ${eyes(76, 24, 11)}
          <path d="M118,56 L134,94" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
          <ellipse cx="88" cy="106" rx="14" ry="10" fill="${W}" ${gap(4)}/><ellipse cx="112" cy="106" rx="14" ry="10" fill="${W}" ${gap(4)}/>
          <path d="M93,92 L107,92 L100,99 Z" fill="${K}" stroke="${K}" stroke-width="3" stroke-linejoin="round"/>
          <path d="M104,115 L110,115 L107,124 Z" fill="${W}" ${gap(3)}/>`,
      },
    ],
  },
];

const kept = marks.filter(m => m.group === 'kept');
const fresh = marks.filter(m => m.group === 'new');

let uid = 0;
// mode 'solid': one-color mark, cut-outs transparent.
// mode 'outline': only the silhouette edge of each part, like a neon outline print. `fabric` paints the gaps.
function renderLogo(logo, { color = 'currentColor', size, title = true, place, mode = 'solid', fabric = 'var(--stage-fabric)' } = {}) {
  const id = `m-${logo.id}-${uid++}`;
  const dims = place ? ` x="${place.x}" y="${place.y}" width="${place.w}" height="${place.w}"` : size ? ` width="${size}" height="${size}"` : '';
  const head = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"${dims} role="img" aria-label="${logo.name}">${title ? `<title>${logo.name}</title>` : ''}`;
  if (mode === 'outline') {
    const layers = logo.parts.map((p, i) => `
      <g style="fill:${fabric};stroke:${fabric}" stroke-width="${i ? GAP : 0}" stroke-linejoin="round">${p.shape}</g>
      <g style="fill:${color}" stroke="none" filter="url(#${id})">${p.shape}</g>`).join('');
    return `${head}<filter id="${id}" filterUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><feMorphology in="SourceAlpha" operator="erode" radius="3.5" result="e"/><feComposite in="SourceGraphic" in2="e" operator="out"/></filter>${layers}</svg>`;
  }
  const layers = logo.parts.map((p, i) => `
    ${i ? `<g fill="${K}" stroke="${K}" stroke-width="${GAP}" stroke-linejoin="round">${p.shape}</g>` : ''}
    <g fill="${W}" stroke="none">${p.shape}</g>${p.detail || ''}`).join('');
  return `${head}<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><rect width="200" height="200" fill="${K}"/>${layers}</mask><rect width="200" height="200" fill="${color}" mask="url(#${id})"/></svg>`;
}

module.exports = { logos: marks, kept, fresh, renderLogo };
