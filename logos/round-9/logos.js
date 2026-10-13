// Round 9: COMA TOAST. One plain slice of toast, out cold (closed-line eyes, tiny straight mouth),
// with a different sleepy / knocked-out / hospital accessory as the second section each time.
const round4 = require('../round-4/logos');
const { W, K } = round4.helpers;
const renderLogo = round4.renderLogo;

const T = (part, t) => ({ shape: `<g transform="${t}">${part.shape}</g>`, detail: part.detail ? `<g transform="${t}">${part.detail}</g>` : '' });
const scaleAt = (k, cx, cy, dx = 0, dy = 0) => `translate(${cx + dx},${cy + dy}) scale(${k}) translate(${-cx},${-cy})`;

// Plain toast slice, drawn around center (100,118). faceY moves the face up when something covers the lower half.
function toast({ k = 1, dx = 0, dy = 0, eyes = 'closed', faceY = 132, mouth = true, rot = 0, extra = '' } = {}) {
  const ex = [78, 122], my = faceY + 22;
  const eyeSvg = eyes === 'x'
    ? ex.map(x => `<path d="M${x - 7},${faceY - 7} L${x + 7},${faceY + 7} M${x + 7},${faceY - 7} L${x - 7},${faceY + 7}" stroke="${K}" stroke-width="4.5" stroke-linecap="round"/>`).join('')
    : eyes === 'closed'
      ? ex.map(x => `<path d="M${x - 9},${faceY} L${x + 9},${faceY}" stroke="${K}" stroke-width="4.5" stroke-linecap="round"/>`).join('')
      : '';
  const part = {
    shape: `<path d="M50,106 C26,106 26,68 58,64 C70,50 130,50 142,64 C174,68 174,106 150,106 L150,178 Q150,186 142,186 L58,186 Q50,186 50,178 Z"/>`,
    detail: `<path d="M62,108 C44,106 44,78 66,74 C78,62 122,62 134,74 C156,78 156,106 138,108 L138,174 L62,174 Z" fill="none" stroke="${K}" stroke-width="4.5" stroke-linejoin="round"/>
      ${eyeSvg}${mouth ? `<path d="M93,${my} L107,${my}" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>` : ''}${extra}`,
  };
  return T(part, `${scaleAt(k, 100, 118, dx, dy)} rotate(${rot} 100 118)`);
}

// Bold Z with its top-left corner at (x, y), size s.
const Z = (x, y, s) => { const p = (a, b) => `${(x + a * s).toFixed(1)},${(y + b * s).toFixed(1)}`; return `<path d="M${p(0, 0)} L${p(1, 0)} L${p(1, 0.24)} L${p(0.36, 0.76)} L${p(1, 0.76)} L${p(1, 1)} L${p(0, 1)} L${p(0, 0.76)} L${p(0.64, 0.24)} L${p(0, 0.24)} Z"/>`; };

const thick = (pts, w) => pts.map(([x, y], i) => {
  let s = `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${w / 2}"/>`;
  if (i) {
    const [px, py] = pts[i - 1], len = Math.hypot(x - px, y - py), a = Math.atan2(y - py, x - px) * 180 / Math.PI;
    s += `<rect x="${px.toFixed(1)}" y="${(py - w / 2).toFixed(1)}" width="${len.toFixed(1)}" height="${w}" transform="rotate(${a.toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})"/>`;
  }
  return s;
}).join('');
const wave = (x0, y0, y1, amp, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n; return [x0 + Math.sin(t * Math.PI * 2) * amp, y0 + (y1 - y0) * t]; });

const crown = (y, w, h) => {
  const l = 100 - w / 2, r = 100 + w / 2, b = y + h;
  return {
    shape: `<path d="M${l},${b} L${l - 4},${y + 6} L${l + w * 0.25},${y + h * 0.5} L100,${y - 4} L${r - w * 0.25},${y + h * 0.5} L${r + 4},${y + 6} L${r},${b} Z"/>
      <circle cx="${l - 4}" cy="${y + 4}" r="6"/><circle cx="100" cy="${y - 6}" r="6"/><circle cx="${r + 4}" cy="${y + 4}" r="6"/>`,
    detail: `<rect x="${l + 2}" y="${b - 12}" width="${w - 4}" height="5" fill="${K}"/>`,
  };
};

// Crescent from two circles: the part of circle 1 outside circle 2.
const crescent = (x1, y1, r1, x2, y2, r2) => {
  const d = Math.hypot(x2 - x1, y2 - y1), a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(r1 * r1 - a * a);
  const mx = x1 + a * (x2 - x1) / d, my = y1 + a * (y2 - y1) / d;
  const px = mx + h * (y2 - y1) / d, py = my - h * (x2 - x1) / d, qx = mx - h * (y2 - y1) / d, qy = my + h * (x2 - x1) / d;
  return `<path d="M${px.toFixed(1)},${py.toFixed(1)} A${r1},${r1} 0 1 0 ${qx.toFixed(1)},${qy.toFixed(1)} A${r2},${r2} 0 0 1 ${px.toFixed(1)},${py.toFixed(1)} Z"/>`;
};

const marks = [
  {
    id: 'lights-out', name: 'Lights Out', edge: 'Rising Zs',
    note: 'The core idea in its simplest form: an unconscious slice of toast with three Zs floating off it. If you only make one Coma Toast logo, it’s probably this.',
    parts: [toast({ k: 0.82, dx: -14, dy: 16 }), { shape: Z(136, 60, 16) + Z(152, 34, 22) + Z(168, 4, 28), detail: '' }],
  },
  {
    id: 'ko-crown', name: 'K.O.', edge: 'Crown, X eyes',
    note: 'X eyes instead of closed ones: knocked out cold, still wearing the crown. Royalty that lost the fight and doesn’t care.',
    parts: [toast({ k: 0.86, dy: 16, eyes: 'x' }), crown(14, 80, 40)],
  },
  {
    id: 'beauty-sleep', name: 'Beauty Sleep', edge: 'Sleep mask',
    note: 'A satin sleep mask with printed lashes across the face. Its strap sticks out past the crust on both sides, which gives the outline a clear band.',
    parts: [
      toast({ eyes: 'none', faceY: 132 }),
      {
        shape: `<path d="M30,122 Q30,108 48,108 L84,110 Q100,118 116,110 L152,108 Q170,108 170,122 Q170,142 150,142 Q126,142 110,132 Q100,128 90,132 Q74,142 50,142 Q30,142 30,122 Z"/><rect x="6" y="117" width="28" height="7" rx="3"/><rect x="166" y="117" width="28" height="7" rx="3"/>`,
        detail: `<path d="M48,126 Q62,134 78,126 M122,126 Q138,134 152,126" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>
          ${[52, 60, 68, 76].map(x => `<path d="M${x},${129 + (x === 52 || x === 76 ? -1 : 1)} l${x < 64 ? -2 : 2},6" stroke="${K}" stroke-width="2.5" stroke-linecap="round"/>`).join('')}
          ${[124, 132, 140, 148].map(x => `<path d="M${x},${129 + (x === 124 || x === 148 ? -1 : 1)} l${x < 136 ? -2 : 2},6" stroke="${K}" stroke-width="2.5" stroke-linecap="round"/>`).join('')}`,
      },
    ],
  },
  {
    id: 'nightcap', name: 'Nightcap', edge: 'Striped nightcap',
    note: 'An old-fashioned striped nightcap flopping over to one side with a pom on the end. The drooping tip gives it a lopsided, sleepy outline.',
    parts: [
      toast({ dy: 10 }),
      {
        shape: `<path d="M52,88 C54,42 92,26 122,30 C152,34 172,58 178,88 L166,92 C162,70 150,58 134,56 C150,72 152,86 150,88 Z"/><rect x="44" y="80" width="112" height="18" rx="8"/><circle cx="174" cy="98" r="12"/>`,
        detail: `<path d="M48,82 L152,82" stroke="${K}" stroke-width="4"/>${[[66, 78, 82, 40], [90, 78, 104, 32], [114, 78, 126, 34], [134, 78, 146, 44]].map(([a, b, c, d]) => `<path d="M${a},${b} L${c},${d}" stroke="${K}" stroke-width="5"/>`).join('')}`,
      },
    ],
  },
  {
    id: 'bed-rest', name: 'Bed Rest', edge: 'Pillow',
    note: 'A big puffy pillow behind the toast, sticking out on both sides. Simple, and it reads as "asleep" even in silhouette.',
    parts: [
      { shape: `<path d="M12,86 Q8,54 26,50 Q100,36 174,50 Q192,54 188,86 Q192,118 174,122 Q100,134 26,122 Q8,118 12,86 Z"/>`, detail: `<path d="M24,56 L36,66 M176,56 L164,66 M24,116 L36,106 M176,116 L164,106" stroke="${K}" stroke-width="3" stroke-linecap="round"/>` },
      toast({ k: 0.82, dy: 22 }),
    ],
  },
  {
    id: 'vital-signs', name: 'Vital Signs', edge: 'Heart monitor line',
    note: 'A heart-monitor line running underneath like a signature. The toast is out, but the pulse says it’s fine.',
    parts: [
      toast({ k: 0.72, dy: -26 }),
      { shape: thick([[6, 178], [62, 178], [72, 160], [84, 196], [98, 150], [110, 178], [124, 178], [132, 168], [140, 178], [194, 178]], 7), detail: '' },
    ],
  },
  {
    id: 'on-the-drip', name: 'On the Drip', edge: 'IV drip stand',
    note: 'Toast hooked up to an IV bag on a stand. "Drip" is also slang for style, so it’s a hospital joke and a fashion brag at once.',
    parts: [
      {
        shape: `<rect x="28" y="16" width="7" height="174" rx="3"/><rect x="12" y="186" width="40" height="8" rx="3"/><rect x="28" y="14" width="34" height="6" rx="3"/><rect x="40" y="26" width="34" height="48" rx="9"/>
          ${thick([[57, 74], [58, 96], [62, 116], [70, 130], [80, 136]], 4)}`,
        detail: `<path d="M44,46 L70,46" stroke="${K}" stroke-width="3"/><path d="M57,54 Q52,62 57,66 Q62,62 57,54 Z" fill="${K}"/>`,
      },
      toast({ k: 0.76, dx: 26, dy: 18 }),
    ],
  },
  {
    id: 'nap-pod', name: 'Nap Pod', edge: 'Toaster',
    note: 'Asleep inside the toaster, which is basically its bed. The toaster box makes a strong bottom section.',
    parts: [
      toast({ k: 0.9, dy: -26, faceY: 110 }),
      {
        shape: `<rect x="26" y="118" width="148" height="66" rx="24"/><rect x="172" y="130" width="12" height="26" rx="4"/><rect x="44" y="182" width="20" height="10" rx="3"/><rect x="136" y="182" width="20" height="10" rx="3"/>`,
        detail: `<path d="M46,124 L154,124" stroke="${K}" stroke-width="5" stroke-linecap="round"/><path d="M40,150 L160,150 M40,160 L160,160" stroke="${K}" stroke-width="2.5"/><circle cx="152" cy="171" r="5" fill="${K}"/>`,
      },
    ],
  },
  {
    id: 'patched-up', name: 'Patched Up', edge: 'Crossed bandages',
    note: 'Two bandages crossed on the corner of the crust. It’s the only cross in the set, and it’s a first-aid one.',
    parts: [
      toast({ dy: 8 }),
      {
        shape: `<g transform="translate(140,70) rotate(40)"><rect x="-40" y="-11" width="80" height="22" rx="11"/></g><g transform="translate(140,70) rotate(-40)"><rect x="-40" y="-11" width="80" height="22" rx="11"/></g>`,
        detail: `<rect x="130" y="60" width="20" height="20" rx="3" fill="${K}" transform="rotate(45 140 70)"/>${[[120, 54], [160, 54], [120, 86], [160, 86]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="${K}"/>`).join('')}`,
      },
    ],
  },
  {
    id: 'halo-effect', name: 'Halo Effect', edge: 'Halo',
    note: 'Toast so deeply asleep it’s grown a halo. Light, clean and a little holy, which nods to "daily bread" too.',
    parts: [
      toast({ k: 0.9, dy: 18 }),
      { shape: `<path fill-rule="evenodd" d="M52,36 A48,12 0 1 0 148,36 A48,12 0 1 0 52,36 Z M64,36 A36,6 0 1 0 136,36 A36,6 0 1 0 64,36 Z"/>`, detail: '' },
    ],
  },
  {
    id: 'sleepwalker', name: 'Sleepwalker', edge: 'Bucket hat',
    note: 'The Off Duty formula on toast: bucket hat pulled low, eyes shut. Out cold, but dressed for it.',
    parts: [
      toast({ dy: 10 }),
      {
        shape: `<path d="M56,92 L64,42 Q100,30 136,42 L144,92 Z"/><path d="M26,100 Q38,84 60,86 L140,86 Q162,84 174,100 Q100,114 26,100 Z"/>`,
        detail: `<path d="M60,76 Q100,68 140,76" fill="none" stroke="${K}" stroke-width="3" stroke-dasharray="5 4"/>`,
      },
    ],
  },
  {
    id: 'lo-fi', name: 'Lo-Fi', edge: 'Headphones',
    note: 'Asleep in big headphones, like the lo-fi "beats to sleep to" streams. The ear cups and headband frame the toast with a strong outline.',
    parts: [
      toast({ k: 0.86, dy: 14 }),
      {
        shape: `<path fill-rule="evenodd" d="M24,118 A76,80 0 0 1 176,118 L162,118 A62,66 0 0 0 38,118 Z"/><rect x="12" y="102" width="30" height="58" rx="12"/><rect x="158" y="102" width="30" height="58" rx="12"/>`,
        detail: `<path d="M22,116 L22,146 M178,116 L178,146" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`,
      },
    ],
  },
  {
    id: 'melted', name: 'Melted', edge: 'Butter pat',
    note: 'A pat of butter melting on its head and dripping down over the crust. Breakfast as an outfit.',
    parts: [
      toast({ dy: 16 }),
      {
        shape: `<rect x="70" y="30" width="60" height="42" rx="7" transform="rotate(-8 100 51)"/><path d="M76,64 L88,64 L88,92 Q88,98 82,98 Q76,98 76,92 Z"/><path d="M112,62 L122,62 L122,80 Q122,86 117,86 Q112,86 112,80 Z"/>`,
        detail: `<path d="M80,40 L96,38" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>`,
      },
    ],
  },
  {
    id: 'ice-pack', name: 'Ice Pack', edge: 'Ice bag',
    note: 'An old-school quilted ice bag on its head, like it walked into a door. A soft lump on top with a cap sticking out.',
    parts: [
      toast({ k: 0.9, dy: 20 }),
      {
        shape: `<ellipse cx="88" cy="50" rx="50" ry="30" transform="rotate(-10 88 50)"/><rect x="128" y="22" width="26" height="26" rx="5" transform="rotate(-10 141 35)"/>`,
        detail: `<path d="M50,44 Q88,30 126,40 M52,58 Q88,46 124,54" fill="none" stroke="${K}" stroke-width="3"/><path d="M134,30 L148,28 M134,38 L150,36" stroke="${K}" stroke-width="2.5"/>`,
      },
    ],
  },
  {
    id: 'tucked-in', name: 'Tucked In', edge: 'Blanket',
    note: 'Tucked in under a blanket up to its chin, with only its sleeping face showing. The wavy blanket edge cuts the mark into two clear halves.',
    parts: [
      toast({ k: 0.95, dy: -6, faceY: 108 }),
      {
        shape: `<path d="M8,140 Q40,126 70,136 Q100,128 130,136 Q160,126 192,140 L192,196 L8,196 Z"/>`,
        detail: `<path d="M10,156 Q40,144 70,152 Q100,146 130,152 Q160,144 190,156" fill="none" stroke="${K}" stroke-width="4"/>${[40, 80, 120, 160].map(x => `<path d="M${x},166 L${x},190" stroke="${K}" stroke-width="2.5"/>`).join('')}`,
      },
    ],
  },
  {
    id: 'night-shift', name: 'Night Shift', edge: 'Crescent moon',
    note: 'A big crescent moon behind the sleeping toast, like a bedtime-story crest. The moon gives it a classic silhouette.',
    parts: [
      { shape: crescent(70, 74, 60, 104, 50, 52), detail: '' },
      toast({ k: 0.78, dx: 18, dy: 22 }),
    ],
  },
  {
    id: 'do-not-disturb', name: 'Do Not Disturb', edge: 'Door hanger',
    note: 'A hotel "Do Not Disturb" door hanger hooked on the crust. Pure attitude: leave me alone.',
    parts: [
      toast({ k: 0.86, dx: -18, dy: 16 }),
      {
        shape: `<g transform="rotate(10 150 100)"><path fill-rule="evenodd" d="M124,40 Q124,28 136,28 L166,28 Q178,28 178,40 L178,172 Q178,180 170,180 L132,180 Q124,180 124,172 Z M151,46 m-12,0 a12,12 0 1 0 24,0 a12,12 0 1 0 -24,0 Z"/></g>`,
        detail: `<g transform="rotate(10 150 100)"><path d="M151,58 L151,66" stroke="${K}" stroke-width="3"/>${Z(138, 90, 16).replace('/>', ` fill="${K}"/>`)}${Z(150, 120, 16).replace('/>', ` fill="${K}"/>`)}<path d="M134,156 L168,156 M134,166 L160,166" stroke="${K}" stroke-width="3" stroke-linecap="round"/></g>`,
      },
    ],
  },
  {
    id: 'snooze', name: 'Snooze', edge: 'Alarm clock',
    note: 'An old twin-bell alarm clock ringing beside the toast, which isn’t waking up. The clock bells give a fun, lumpy second shape.',
    parts: [
      toast({ k: 0.8, dx: -24, dy: -6 }),
      {
        shape: `<circle cx="146" cy="146" r="36"/><circle cx="122" cy="108" r="13"/><circle cx="170" cy="108" r="13"/><rect x="124" y="178" width="8" height="16" rx="3" transform="rotate(20 128 186)"/><rect x="160" y="178" width="8" height="16" rx="3" transform="rotate(-20 164 186)"/>`,
        detail: `<circle cx="146" cy="146" r="27" fill="none" stroke="${K}" stroke-width="3.5"/><path d="M146,146 L146,128 M146,146 L160,150" stroke="${K}" stroke-width="4" stroke-linecap="round"/><circle cx="146" cy="146" r="3.5" fill="${K}"/>`,
      },
    ],
  },
  {
    id: 'burnt-out', name: 'Burnt Out', edge: 'Smoke',
    note: 'Burnt toast with char spots and smoke rising off it. Burnout is just a coma you go to work in.',
    parts: [
      toast({ k: 0.9, dy: 20, extra: `<path d="M64,90 Q72,84 80,92 Q74,100 64,90 Z M128,160 Q138,152 144,164 Q134,170 128,160 Z M70,166 Q78,160 84,168 Q76,174 70,166 Z M140,86 Q148,82 150,92 Q144,96 140,86 Z" fill="${K}"/>` }),
      { shape: thick(wave(72, 66, 14, 6), 7) + thick(wave(100, 60, 6, 6), 7) + thick(wave(128, 66, 14, 6), 7), detail: '' },
    ],
  },
];

const all = marks.map(m => ({ ...m, animal: 'Coma Toast', style: 'New', group: 'new' }));
module.exports = { logos: all, kept: [], fresh: all, renderLogo };
