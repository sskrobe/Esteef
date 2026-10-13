// Round 1 logo concepts. Each mark is drawn on a 200x200 grid as a mask:
// fill="#fff" is solid ink, fill/stroke="#000" is a cut-out (shows the shirt through).
// That keeps every mark one color, the way it would be embroidered or screen-printed.

const W = '#fff';
const K = '#000';

// Helper: a solid shape with a cut-out gap around it, so it separates from shapes behind it.
const gapped = (shape, gap = 8) =>
  shape.replace('/>', ` fill="${W}" stroke="${K}" stroke-width="${gap}" paint-order="stroke" stroke-linejoin="round"/>`);

// Angry half-moon eye: a cut-out circle with the top sliced off at a slant.
const angryEye = (x1, y1, x2, y2, r = 9) => `<path d="M${x1},${y1} L${x2},${y2} A${r},${r} 0 0 1 ${x1},${y1} Z" fill="${K}"/>`;

const fishBone = `
  <rect x="-58" y="-3.5" width="108" height="7" rx="3.5" fill="${W}"/>
  <path d="M46,-15 Q72,-15 78,0 Q72,15 46,15 Z" fill="${W}"/>
  <circle cx="62" cy="-4" r="3.5" fill="${K}"/>
  <path d="M-56,0 L-80,-18 L-72,0 L-80,18 Z" fill="${W}" stroke="${W}" stroke-width="3" stroke-linejoin="round"/>
  ${[-42, -26, -10, 6, 22].map(x => `<path d="M${x},-16 Q${x + 7},0 ${x},16" fill="none" stroke="${W}" stroke-width="4.5" stroke-linecap="round"/>`).join('')}`;

const logos = [
  {
    id: 'pirate-duck',
    name: 'Captain Quack',
    animal: 'Duckling',
    edge: 'Pirate',
    style: 'Emblem',
    note: 'The closest cousin to Psycho Bunny: one face over crossed bones. A duckling with an eyepatch and a scowl reads at 1 inch on a chest.',
    art: `
      <g transform="translate(100,150)">
        <g transform="rotate(22)"><rect x="-60" y="-6.5" width="120" height="13" rx="6.5" fill="${W}"/>
          <circle cx="-62" cy="-7" r="9" fill="${W}"/><circle cx="-62" cy="7" r="9" fill="${W}"/>
          <circle cx="62" cy="-7" r="9" fill="${W}"/><circle cx="62" cy="7" r="9" fill="${W}"/></g>
        <g transform="rotate(-22)"><rect x="-60" y="-6.5" width="120" height="13" rx="6.5" fill="${W}"/>
          <circle cx="-62" cy="-7" r="9" fill="${W}"/><circle cx="-62" cy="7" r="9" fill="${W}"/>
          <circle cx="62" cy="-7" r="9" fill="${W}"/><circle cx="62" cy="7" r="9" fill="${W}"/></g>
      </g>
      <circle cx="100" cy="86" r="55" fill="${K}"/>
      <circle cx="100" cy="86" r="48" fill="${W}"/>
      <ellipse cx="100" cy="38" rx="6" ry="13" fill="${W}"/>
      <ellipse cx="89" cy="42" rx="5" ry="11" transform="rotate(-32 89 42)" fill="${W}"/>
      <ellipse cx="111" cy="42" rx="5" ry="11" transform="rotate(32 111 42)" fill="${W}"/>
      <path d="M50,62 L150,96" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="120" cy="86" rx="15" ry="13" fill="${K}"/>
      <circle cx="80" cy="85" r="11" fill="${K}"/>
      <circle cx="83" cy="87" r="5.5" fill="${W}"/>
      <path d="M64,66 L94,74" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
      <path d="M58,112 Q100,96 142,112 Q148,128 100,130 Q52,128 58,112 Z" fill="${W}" stroke="${K}" stroke-width="7" paint-order="stroke" stroke-linejoin="round"/>
      <path d="M64,118 Q100,124 136,118" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="92" cy="107" rx="2.6" ry="1.8" fill="${K}"/><ellipse cx="108" cy="107" rx="2.6" ry="1.8" fill="${K}"/>`,
  },
  {
    id: 'devil-sloth',
    name: 'Slow Burn',
    animal: 'Sloth',
    edge: 'Devilish',
    style: 'Graphic',
    note: 'A sloth’s natural eye stripes already look sly. Horns, a fang and a pointed tail push it into troublemaker without losing the sleepy charm.',
    art: `
      <path d="M64,70 Q44,40 54,16 Q66,44 86,58 Z" fill="${W}" stroke="${W}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M136,70 Q156,40 146,16 Q134,44 114,58 Z" fill="${W}" stroke="${W}" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="100" cy="106" rx="62" ry="56" fill="${W}"/>
      <path d="M58,92 Q100,70 142,92 Q150,124 128,146 Q100,160 72,146 Q50,124 58,92 Z" fill="${K}"/>
      <ellipse cx="76" cy="108" rx="24" ry="13" transform="rotate(-22 76 108)" fill="${W}"/>
      <ellipse cx="124" cy="108" rx="24" ry="13" transform="rotate(22 124 108)" fill="${W}"/>
      ${angryEye(72, 100, 90, 106)}
      ${angryEye(110, 106, 128, 100)}
      <circle cx="84" cy="107" r="2.8" fill="${W}"/><circle cx="116" cy="107" r="2.8" fill="${W}"/>
      <ellipse cx="100" cy="124" rx="11" ry="7" fill="${W}"/>
      <path d="M82,138 Q100,148 120,134" fill="none" stroke="${W}" stroke-width="4" stroke-linecap="round"/>
      <path d="M106,141 L113,138 L111,148 Z" fill="${W}" stroke="${W}" stroke-width="1.5" stroke-linejoin="round"/>`,
  },
  {
    id: 'heist-otter',
    name: 'Otter Job',
    animal: 'Sea otter',
    edge: 'Heist',
    style: 'Emblem',
    note: 'A sea otter in a ski mask with shifty eyes and whiskers poking out. It nods to the beachwear crowd you liked in the whale brand, with a bank-job twist.',
    art: `
      <circle cx="58" cy="64" r="16" fill="${W}"/><circle cx="142" cy="64" r="16" fill="${W}"/>
      <circle cx="58" cy="64" r="7" fill="${K}"/><circle cx="142" cy="64" r="7" fill="${K}"/>
      <circle cx="100" cy="40" r="13" fill="${W}"/>
      <ellipse cx="100" cy="104" rx="56" ry="54" fill="${W}"/>
      <path d="M52,74 Q100,54 148,74" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>
      ${[70, 82, 94, 106, 118, 130].map(x => `<path d="M${x},${x < 100 ? 62 + (100 - x) * 0.12 : 62 + (x - 100) * 0.12} l0,-9" stroke="${K}" stroke-width="2.5" stroke-linecap="round"/>`).join('')}
      <rect x="56" y="84" width="88" height="28" rx="14" fill="${K}"/>
      <circle cx="80" cy="98" r="8.5" fill="${W}"/><circle cx="120" cy="98" r="8.5" fill="${W}"/>
      <circle cx="84" cy="97" r="3.5" fill="${K}"/><circle cx="124" cy="97" r="3.5" fill="${K}"/>
      <ellipse cx="100" cy="134" rx="25" ry="17" fill="${K}"/>
      <path d="M89,124 Q100,119 111,124 Q105,134 100,134 Q95,134 89,124 Z" fill="${W}"/>
      <path d="M90,139 Q95,145 100,139 Q105,145 110,139" fill="none" stroke="${W}" stroke-width="3" stroke-linecap="round"/>
      <path d="M77,130 L26,122 M77,138 L28,144 M123,130 L174,122 M123,138 L172,144" stroke="${W}" stroke-width="3" stroke-linecap="round"/>`,
  },
  {
    id: 'mob-koala',
    name: 'The Don',
    animal: 'Koala',
    edge: 'Mobster',
    style: 'Graphic',
    note: 'A koala in a fedora with heavy-lidded eyes and a toothpick: a mob boss who’d still nap 20 hours a day. The big ears and nose make a strong silhouette.',
    art: `
      <circle cx="44" cy="96" r="31" fill="${W}"/><circle cx="156" cy="96" r="31" fill="${W}"/>
      <circle cx="47" cy="100" r="15" fill="${K}"/><circle cx="153" cy="100" r="15" fill="${K}"/>
      <ellipse cx="100" cy="118" rx="61" ry="55" fill="${K}"/>
      <ellipse cx="100" cy="118" rx="56" ry="50" fill="${W}"/>
      <path d="M60,76 L66,34 Q100,20 134,34 L140,76 Z" fill="${W}" stroke="${K}" stroke-width="8" paint-order="stroke" stroke-linejoin="round"/>
      <path d="M90,30 Q100,42 110,30" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>
      <rect x="58" y="60" width="84" height="10" fill="${K}"/>
      <ellipse cx="100" cy="78" rx="70" ry="13" fill="${W}" stroke="${K}" stroke-width="8" paint-order="stroke"/>
      <circle cx="77" cy="110" r="9" fill="${K}"/><circle cx="123" cy="110" r="9" fill="${K}"/>
      <rect x="66" y="98" width="22" height="11" fill="${W}"/><rect x="112" y="98" width="22" height="11" fill="${W}"/>
      <path d="M66,109 L89,109 M111,109 L134,109" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="79" cy="114" r="2.4" fill="${W}"/><circle cx="125" cy="114" r="2.4" fill="${W}"/>
      <ellipse cx="100" cy="130" rx="15" ry="19" fill="${W}" stroke="${K}" stroke-width="7" paint-order="stroke"/>
      <ellipse cx="95" cy="123" rx="3" ry="5" fill="${K}"/>
      <path d="M86,160 Q100,166 114,158" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M111,160 L146,150" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>`,
  },
  {
    id: 'vamp-hamster',
    name: 'Count Nibbles',
    animal: 'Hamster',
    edge: 'Vampire',
    style: 'Emblem',
    note: 'A round hamster with full cheeks, a widow’s peak, fangs and a Dracula collar. Cute first, menacing second.',
    art: `
      <path d="M30,172 L38,70 L80,120 Z" fill="${W}" stroke="${W}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M170,172 L162,70 L120,120 Z" fill="${W}" stroke="${W}" stroke-width="4" stroke-linejoin="round"/>
      <ellipse cx="100" cy="114" rx="61" ry="57" fill="${K}"/>
      <circle cx="64" cy="66" r="14" fill="${W}"/><circle cx="136" cy="66" r="14" fill="${W}"/>
      <circle cx="65" cy="65" r="6.5" fill="${K}"/><circle cx="135" cy="65" r="6.5" fill="${K}"/>
      <ellipse cx="100" cy="114" rx="56" ry="52" fill="${W}"/>
      <path d="M78,72 L100,90 L122,72" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="79" cy="104" r="7.5" fill="${K}"/><circle cx="121" cy="104" r="7.5" fill="${K}"/>
      <circle cx="81.5" cy="101.5" r="2.6" fill="${W}"/><circle cx="123.5" cy="101.5" r="2.6" fill="${W}"/>
      <path d="M52,118 Q58,138 76,140 M148,118 Q142,138 124,140" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="100" cy="118" rx="4.5" ry="3.2" fill="${K}"/>
      <path d="M87,126 Q100,146 113,126 Z" fill="${K}" stroke="${K}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M90,126 L96,126 L93,136 Z M104,126 L110,126 L107,136 Z" fill="${W}" stroke="${W}" stroke-width="1" stroke-linejoin="round"/>`,
  },
  {
    id: 'bad-panda',
    name: 'Bamboo Bandit',
    animal: 'Panda',
    edge: 'Outlaw',
    style: 'Graphic',
    note: 'The panda’s eye patches become aviator shades, with a stitched scar and a smirk. A strong pick for big back prints.',
    art: `
      <circle cx="52" cy="58" r="23" fill="${W}"/><circle cx="148" cy="58" r="23" fill="${W}"/>
      <ellipse cx="100" cy="110" rx="67" ry="61" fill="${W}"/>
      <ellipse cx="100" cy="114" rx="58" ry="52" fill="${K}"/>
      <path d="M48,98 Q48,90 58,90 L88,90 Q96,90 96,98 Q96,126 76,128 Q54,128 48,112 Z" fill="${W}"/>
      <path d="M152,98 Q152,90 142,90 L112,90 Q104,90 104,98 Q104,126 124,128 Q146,128 152,112 Z" fill="${W}"/>
      <rect x="94" y="92" width="12" height="5" fill="${W}"/>
      <rect x="38" y="92" width="12" height="5" fill="${W}"/><rect x="150" y="92" width="12" height="5" fill="${W}"/>
      <path d="M58,104 L70,94 M60,114 L78,98 M118,104 L130,94 M120,114 L138,98" stroke="${K}" stroke-width="3" stroke-linecap="round"/>
      <path d="M118,64 L136,86" stroke="${W}" stroke-width="3" stroke-linecap="round"/>
      <path d="M121,74 L129,68 M126,80 L134,74" stroke="${W}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M88,138 Q100,132 112,138 Q106,150 100,150 Q94,150 88,138 Z" fill="${W}"/>
      <path d="M100,150 L100,156 M84,158 Q98,164 116,154" fill="none" stroke="${W}" stroke-width="3.5" stroke-linecap="round"/>`,
  },
  {
    id: 'kitty-crossbones',
    name: 'Nine Lives',
    animal: 'Kitten',
    edge: 'Pirate',
    style: 'Emblem',
    note: 'A kitten skull over crossed fish skeletons. It’s the easiest to recognize as a skull-and-crossbones mark, and the big-eye glints keep it cute.',
    art: `
      <g transform="translate(100,160) rotate(-22) scale(0.8)">${fishBone}</g>
      <g transform="translate(100,160) scale(-1,1) rotate(-22) scale(0.8)">${fishBone}</g>
      <path d="M48,96 L44,38 L80,62 Q100,56 120,62 L156,38 L152,96 Q154,128 128,138 L128,154 Q100,162 72,154 L72,138 Q46,128 48,96 Z" fill="${W}" stroke="${K}" stroke-width="10" paint-order="stroke" stroke-linejoin="round"/>
      <path d="M54,52 L56,78 L74,64 Z M146,52 L144,78 L126,64 Z" fill="${K}" stroke="${K}" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="78" cy="98" r="15" fill="${K}"/><circle cx="122" cy="98" r="15" fill="${K}"/>
      <circle cx="84" cy="92" r="4.5" fill="${W}"/><circle cx="128" cy="92" r="4.5" fill="${W}"/>
      <circle cx="74" cy="104" r="2" fill="${W}"/><circle cx="118" cy="104" r="2" fill="${W}"/>
      <path d="M94,117 L106,117 L100,125 Z" fill="${K}" stroke="${K}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M76,144 L124,144" stroke="${K}" stroke-width="3" stroke-linecap="round"/>
      ${[86, 94, 100, 106, 114].map(x => `<path d="M${x},139 L${x},151" stroke="${K}" stroke-width="2.5" stroke-linecap="round"/>`).join('')}
      <path d="M48,114 L22,108 M48,122 L24,126 M152,114 L178,108 M152,122 L176,126" stroke="${W}" stroke-width="3" stroke-linecap="round"/>`,
  },
  {
    id: 'black-sheep',
    name: 'Black Sheep',
    animal: 'Lamb',
    edge: 'Devilish',
    style: 'Graphic',
    note: 'A fluffy lamb with devil horns and a pitchfork. "Black sheep" is a phrase everyone knows and suits a brand with an attitude.',
    art: (() => {
      const puffs = Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return [100 + Math.cos(a) * 52, 104 + Math.sin(a) * 48];
      });
      return `
      <g transform="translate(34,4) rotate(30 100 100)">
        <rect x="96" y="40" width="8" height="150" rx="4" fill="${W}"/>
        <rect x="78" y="38" width="44" height="8" rx="4" fill="${W}"/>
        <path d="M78,42 L82,18 L87,42 Z M95,42 L100,10 L105,42 Z M113,42 L118,18 L122,42 Z" fill="${W}" stroke="${W}" stroke-width="2" stroke-linejoin="round"/>
      </g>
      <path d="M72,62 C62,40 52,28 38,18 C44,38 46,56 56,74 Z" fill="${W}" stroke="${W}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M128,62 C138,40 148,28 162,18 C156,38 154,56 144,74 Z" fill="${W}" stroke="${W}" stroke-width="3" stroke-linejoin="round"/>
      ${puffs.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="27" fill="${K}"/>`).join('')}
      <ellipse cx="100" cy="104" rx="58" ry="54" fill="${K}"/>
      ${puffs.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="21" fill="${W}"/>`).join('')}
      <ellipse cx="100" cy="104" rx="54" ry="50" fill="${W}"/>
      <ellipse cx="100" cy="118" rx="31" ry="37" fill="${W}" stroke="${K}" stroke-width="7" paint-order="stroke"/>
      ${angryEye(80, 106, 96, 112, 8.5)}
      ${angryEye(104, 112, 120, 106, 8.5)}
      <circle cx="91" cy="113" r="2.4" fill="${W}"/><circle cx="109" cy="113" r="2.4" fill="${W}"/>
      <path d="M94,130 L106,130 L100,136 Z" fill="${K}" stroke="${K}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M86,140 Q100,158 114,140 Q100,146 86,140 Z" fill="${K}"/>
      <path d="M103,142 L109,141 L106,149 Z" fill="${W}"/>
      <circle cx="88" cy="80" r="10" fill="${W}"/><circle cx="100" cy="76" r="11" fill="${W}"/><circle cx="112" cy="80" r="10" fill="${W}"/>`;
    })(),
  },
  {
    id: 'outlaw-pup',
    name: 'Most Wanted',
    animal: 'Puppy',
    edge: 'Bandit',
    style: 'Emblem',
    note: 'A floppy-eared pup in a cowboy hat and polka-dot bandana with an angry unibrow. A wanted-poster puppy, and it fits well in a small chest logo.',
    art: `
      <path d="M60,74 Q28,72 26,108 Q26,138 46,142 Q58,118 66,94 Z" fill="${W}"/>
      <path d="M140,74 Q172,72 174,108 Q174,138 154,142 Q142,118 134,94 Z" fill="${W}"/>
      <circle cx="100" cy="110" r="52" fill="${K}"/>
      <circle cx="100" cy="110" r="47" fill="${W}"/>
      <circle cx="82" cy="100" r="7.5" fill="${K}"/><circle cx="118" cy="100" r="7.5" fill="${K}"/>
      <circle cx="84.5" cy="97.5" r="2.4" fill="${W}"/><circle cx="120.5" cy="97.5" r="2.4" fill="${W}"/>
      <path d="M68,84 L94,91 L106,91 L132,84" fill="none" stroke="${K}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M50,114 Q100,128 150,114 L100,172 Z" fill="${W}" stroke="${K}" stroke-width="7" paint-order="stroke" stroke-linejoin="round"/>
      <circle cx="100" cy="134" r="3.5" fill="${K}"/><circle cx="84" cy="127" r="3" fill="${K}"/><circle cx="116" cy="127" r="3" fill="${K}"/>
      <circle cx="92" cy="146" r="3" fill="${K}"/><circle cx="108" cy="146" r="3" fill="${K}"/><circle cx="100" cy="158" r="2.6" fill="${K}"/>
      <circle cx="68" cy="122" r="2.4" fill="${K}"/><circle cx="132" cy="122" r="2.4" fill="${K}"/>
      <path d="M68,62 Q70,24 100,26 Q130,24 132,62 Z" fill="${W}" stroke="${K}" stroke-width="7" paint-order="stroke" stroke-linejoin="round"/>
      <path d="M90,30 Q100,40 110,30" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>
      <path d="M69,54 Q100,60 131,54" fill="none" stroke="${K}" stroke-width="5"/>
      <path d="M30,50 Q40,66 100,66 Q160,66 170,50 Q166,76 100,78 Q34,76 30,50 Z" fill="${W}" stroke="${K}" stroke-width="7" paint-order="stroke" stroke-linejoin="round"/>`,
  },
  {
    id: 'bomb-quokka',
    name: 'Happy Accident',
    animal: 'Quokka',
    edge: 'Chaos',
    style: 'Graphic',
    note: 'The quokka is called the world’s happiest animal. Here it grins while holding a lit cartoon bomb, which suits a graphic tee.',
    art: `
      <circle cx="54" cy="58" r="15" fill="${W}"/><circle cx="118" cy="52" r="15" fill="${W}"/>
      <circle cx="55" cy="59" r="6.5" fill="${K}"/><circle cx="117" cy="53" r="6.5" fill="${K}"/>
      <circle cx="86" cy="100" r="52" fill="${W}"/>
      <circle cx="70" cy="94" r="6.5" fill="${K}"/><circle cx="104" cy="92" r="6.5" fill="${K}"/>
      <circle cx="72" cy="91.5" r="2.2" fill="${W}"/><circle cx="106" cy="89.5" r="2.2" fill="${W}"/>
      <ellipse cx="87" cy="106" rx="6" ry="4.2" fill="${K}"/>
      <path d="M64,116 Q86,146 112,114 Q86,126 64,116 Z" fill="${K}" stroke="${K}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M87,110 L87,118" stroke="${K}" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="146" cy="144" r="36" fill="${K}"/>
      <circle cx="146" cy="144" r="30" fill="${W}"/>
      <rect x="156" y="104" width="18" height="14" rx="2" transform="rotate(38 165 111)" fill="${W}" stroke="${K}" stroke-width="5" paint-order="stroke"/>
      <path d="M172,104 Q186,90 176,76" fill="none" stroke="${W}" stroke-width="4" stroke-linecap="round"/>
      <path d="M176,58 L179,68 L189,66 L182,74 L190,80 L180,80 L178,90 L174,80 L164,82 L170,74 L163,66 L173,68 Z" fill="${W}"/>
      <path d="M128,138 Q130,126 142,122" fill="none" stroke="${K}" stroke-width="4.5" stroke-linecap="round"/>
      <ellipse cx="116" cy="150" rx="11" ry="13" fill="${W}" stroke="${K}" stroke-width="6" paint-order="stroke"/>`,
  },
];

let uid = 0;
// Returns a standalone SVG string. `color` fills the solid ink; holes are transparent.
function renderLogo(logo, { color = 'currentColor', size, title = true, place } = {}) {
  const id = `m-${logo.id}-${uid++}`;
  const dims = place ? ` x="${place.x}" y="${place.y}" width="${place.w}" height="${place.w}"` : size ? ` width="${size}" height="${size}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"${dims} role="img" aria-label="${logo.name}">${title ? `<title>${logo.name}</title>` : ''}<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><rect width="200" height="200" fill="${K}"/>${logo.art}</mask><rect width="200" height="200" fill="${color}" mask="url(#${id})"/></svg>`;
}

module.exports = { logos, renderLogo };
