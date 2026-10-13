// Round 8: more like Daily Bread (plain object + crown) and Off Duty (plain animal + streetwear hat).
// Faces: dot eyes and a tiny straight-line mouth. No smile, no frown, no expression.
// Faceless objects (bagel, pretzel) stay faceless: the crown is the whole personality.
const round4 = require('../round-4/logos');
const round7 = require('../round-7/logos');
const { W, K } = round4.helpers;
const renderLogo = round4.renderLogo;

const dots = (y, spread, r = 5, cx = 100) => `<circle cx="${cx - spread}" cy="${y}" r="${r}" fill="${K}"/><circle cx="${cx + spread}" cy="${y}" r="${r}" fill="${K}"/>`;
const mouth = (y, w = 14, cx = 100, color = K) => `<path d="M${cx - w / 2},${y} L${cx + w / 2},${y}" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>`;
const face = (y, spread, r, my, mw) => dots(y, spread, r) + mouth(my, mw);

// Scale parts by k around (cx, cy), then shift.
const place = (part, { k = 1, cx = 100, cy = 60, dx = 0, dy = 0 }) => {
  const t = `translate(${cx + dx},${cy + dy}) scale(${k}) translate(${-cx},${-cy})`;
  return { shape: `<g transform="${t}">${part.shape}</g>`, detail: part.detail ? `<g transform="${t}">${part.detail}</g>` : '' };
};

// ---------- accessories (drawn to sit on a head whose top is near y 84) ----------
const crown = (y = 12, w = 92, h = 46) => {
  const l = 100 - w / 2, r = 100 + w / 2, b = y + h;
  return {
    shape: `<path d="M${l},${b} L${l - 4},${y + 6} L${l + w * 0.25},${y + h * 0.5} L100,${y - 4} L${r - w * 0.25},${y + h * 0.5} L${r + 4},${y + 6} L${r},${b} Z"/>
      <circle cx="${l - 4}" cy="${y + 4}" r="6"/><circle cx="100" cy="${y - 6}" r="6"/><circle cx="${r + 4}" cy="${y + 4}" r="6"/>`,
    detail: `<rect x="${l + 2}" y="${b - 12}" width="${w - 4}" height="5" fill="${K}"/>`,
  };
};
const bucket = {
  shape: `<path d="M56,90 L64,40 Q100,28 136,40 L144,90 Z"/><path d="M28,98 Q40,82 60,84 L140,84 Q160,82 172,98 Q100,112 28,98 Z"/>`,
  detail: `<path d="M60,74 Q100,66 140,74" fill="none" stroke="${K}" stroke-width="3" stroke-dasharray="5 4"/>`,
};
const beanie = {
  shape: `<path d="M54,88 Q54,34 100,32 Q146,34 146,88 Z"/><rect x="46" y="76" width="108" height="26" rx="8"/><circle cx="100" cy="24" r="13"/>`,
  detail: `<path d="M48,78 L152,78" stroke="${K}" stroke-width="4"/>${[58, 70, 82, 94, 106, 118, 130, 142].map(x => `<path d="M${x},84 L${x},96" stroke="${K}" stroke-width="2.5" stroke-linecap="round"/>`).join('')}`,
};
const chef = {
  shape: `<circle cx="70" cy="50" r="22"/><circle cx="100" cy="38" r="27"/><circle cx="130" cy="50" r="22"/><rect x="62" y="46" width="76" height="30"/><rect x="60" y="72" width="80" height="22" rx="4"/>`,
  detail: `<path d="M60,74 L140,74" stroke="${K}" stroke-width="4"/><path d="M84,52 L84,70 M100,48 L100,70 M116,52 L116,70" stroke="${K}" stroke-width="2.5" stroke-linecap="round"/>`,
};
const snapback = {
  shape: `<path d="M58,88 Q58,36 100,34 Q142,36 142,88 Z"/><path d="M40,88 Q100,76 160,88 L156,100 Q100,92 44,100 Z"/><circle cx="100" cy="32" r="5"/>`,
  detail: `<path d="M100,36 L100,86 M78,42 Q86,64 84,86 M122,42 Q114,64 116,86" fill="none" stroke="${K}" stroke-width="2.5"/>`,
};

// ---------- heads ----------
const guineaPig = (faceY = 124) => ({
  shape: `<ellipse cx="100" cy="132" rx="70" ry="56"/><ellipse cx="44" cy="96" rx="13" ry="9" transform="rotate(-30 44 96)"/><ellipse cx="156" cy="96" rx="13" ry="9" transform="rotate(30 156 96)"/>`,
  detail: `${dots(faceY, 30, 5)}<ellipse cx="100" cy="${faceY + 20}" rx="6.5" ry="4.5" fill="${K}"/>${mouth(faceY + 32, 12)}`,
});

// Thick line through points, built from filled shapes so it works with the mask renderer.
const thick = (pts, w) => pts.map(([x, y], i) => {
  let s = `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${w / 2}"/>`;
  if (i) {
    const [px, py] = pts[i - 1], len = Math.hypot(x - px, y - py), a = Math.atan2(y - py, x - px) * 180 / Math.PI;
    s += `<rect x="${px.toFixed(1)}" y="${(py - w / 2).toFixed(1)}" width="${len.toFixed(1)}" height="${w}" transform="rotate(${a.toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})"/>`;
  }
  return s;
}).join('');
const bez = (segs, n = 18) => {
  const out = [];
  segs.forEach(([p0, p1, p2, p3]) => {
    for (let i = 0; i <= n; i++) {
      const t = i / n, u = 1 - t;
      out.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]);
    }
  });
  return out;
};

const keptIds = ['bagel-crown', 'bear-bucket-hat', 'guinea-pig-detective'];
const kept = keptIds.map(id => {
  const m = round7.logos.find(x => x.id === id);
  const parts = m.parts.map(p => ({ ...p }));
  if (id === 'bear-bucket-hat') parts[0].detail += mouth(155, 10, 100, W);
  if (id === 'guinea-pig-detective') parts[0].detail += mouth(158, 12);
  return { ...m, parts, style: 'Kept', group: 'kept' };
});

const fresh = [
  {
    id: 'guinea-pig-crown',
    name: 'Guinea King',
    animal: 'Guinea pig',
    edge: 'Crown',
    note: 'The plain guinea pig blob, crowned. Same straight face whether it’s ruling a kingdom or eating a carrot.',
    parts: [guineaPig(), crown(26, 90, 44)],
  },
  {
    id: 'guinea-pig-beanie',
    name: 'Off Season',
    animal: 'Guinea pig',
    edge: 'Beanie',
    note: 'Guinea pig in a cuffed beanie with a pom. It sits right next to Off Duty: plain animal, streetwear hat.',
    parts: [guineaPig(), place(beanie, { dy: 4 })],
  },
  {
    id: 'guinea-pig-chef',
    name: 'Head Chef',
    animal: 'Guinea pig',
    edge: 'Chef’s hat',
    note: 'A guinea pig in a tall chef’s hat, a bridge between the animal marks and the food marks. Fits the bread theme.',
    parts: [guineaPig(), place(chef, { dy: 2 })],
  },
  {
    id: 'pretzel-crown',
    name: 'Twisted',
    animal: 'Pretzel',
    edge: 'Crown',
    note: 'A plain pretzel knot under a crown, the closest sibling to Daily Bread. The knot is an outline nobody misreads.',
    parts: [
      {
        shape: thick(bez([
          [[42, 104], [50, 176], [112, 156], [140, 108]],
          [[140, 108], [182, 64], [134, 30], [106, 62]],
          [[106, 62], [102, 66], [98, 66], [94, 62]],
          [[94, 62], [66, 30], [18, 64], [60, 108]],
          [[60, 108], [88, 156], [150, 176], [158, 104]],
        ]), 15),
        detail: `${[[52, 80], [146, 82], [76, 52], [124, 52], [74, 150]].map(([x, y]) => `<ellipse cx="${x}" cy="${y + 6}" rx="3.2" ry="2" fill="${K}"/>`).join('')}`,
      },
      place(crown(18, 70, 34), { k: 1, dy: 0 }),
    ].map((p, i) => i ? { shape: `<g transform="translate(0,0)">${p.shape}</g>`, detail: `<g transform="translate(0,0)">${p.detail}</g>` } : { shape: `<g transform="translate(0,18)">${p.shape}</g>`, detail: `<g transform="translate(0,18)">${p.detail}</g>` }),
  },
  {
    id: 'croissant-crown',
    name: 'Butter King',
    animal: 'Croissant',
    edge: 'Crown',
    note: 'A croissant with a deadpan face under a crown. French bakery meets royal portrait.',
    parts: [
      {
        shape: `<path d="M18,156 Q30,100 100,94 Q170,100 182,156 Q166,170 150,154 Q132,132 100,130 Q68,132 50,154 Q34,170 18,156 Z"/>`,
        detail: `<path d="M48,108 Q56,130 52,152 M74,98 Q82,118 80,132 M126,98 Q118,118 120,132 M152,108 Q144,130 148,152" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
          ${face(110, 12, 4, 121, 10)}`,
      },
      crown(40, 76, 38),
    ],
  },
  {
    id: 'onigiri-bucket',
    name: 'Rice Ball',
    animal: 'Onigiri',
    edge: 'Bucket hat',
    note: 'An onigiri rice ball with its nori wrap, in a bucket hat. Trendy food, a recognizable shape, and the hat keeps it streetwear.',
    parts: [
      {
        shape: `<path d="M100,60 Q114,60 122,72 L170,154 Q178,176 154,178 L46,178 Q22,176 30,154 L78,72 Q86,60 100,60 Z"/>`,
        detail: `<rect x="70" y="138" width="60" height="40" fill="${K}"/>${face(114, 18, 4.5, 126, 10)}`,
      },
      place(bucket, { k: 0.72, cy: 70, dy: -12 }),
    ],
  },
  {
    id: 'egg-crown',
    name: 'Sunny Side',
    animal: 'Fried egg',
    edge: 'Crown',
    note: 'A fried egg with a deadpan face on the yolk, wearing a crown. The splat of egg white gives a loose, irregular outline unlike anything else in the set.',
    parts: [
      {
        shape: `<path d="M40,118 C28,88 64,70 92,80 C112,62 156,70 160,100 C184,116 176,158 150,166 C134,190 92,188 76,174 C44,178 24,150 40,118 Z"/>`,
        detail: `<circle cx="104" cy="128" r="34" fill="${W}" stroke="${K}" stroke-width="6" paint-order="stroke"/>${face(124, 12, 4, 136, 10).replace(/cx="(\d+)"/g, (m, x) => `cx="${+x + 4}"`).replace('M93,136 L107,136', 'M98,136 L110,136')}`,
      },
      crown(16, 76, 38),
    ],
  },
  {
    id: 'toast-beanie',
    name: 'Toasted',
    animal: 'Bread slice',
    edge: 'Beanie',
    note: 'A slice of bread in a beanie, with a straight face. The bread slice is the most Daily Bread object there is, here in winter streetwear.',
    parts: [
      {
        shape: `<path d="M50,106 C26,106 26,68 58,64 C70,50 130,50 142,64 C174,68 174,106 150,106 L150,178 Q150,186 142,186 L58,186 Q50,186 50,178 Z"/>`,
        detail: `<path d="M61,110 L61,176 L139,176 L139,110" fill="none" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>${face(136, 22, 5, 156, 12)}`,
      },
      place(beanie, { dy: 4 }),
    ],
  },
  {
    id: 'pizza-snapback',
    name: 'Slice',
    animal: 'Pizza slice',
    edge: 'Snapback',
    note: 'A plain pizza slice in a snapback cap, with a straight face and two pepperoni. Simple, and very street.',
    parts: [
      {
        shape: `<path d="M38,94 Q100,76 162,94 L100,196 Z"/>`,
        detail: `<path d="M42,104 Q100,88 158,104" fill="none" stroke="${K}" stroke-width="4"/>${face(122, 16, 4.5, 136, 10)}
          <circle cx="86" cy="156" r="6" fill="${K}"/><circle cx="110" cy="166" r="5" fill="${K}"/>`,
      },
      place(snapback, { k: 0.9, dy: 6 }),
    ],
  },
  {
    id: 'dumpling-bucket',
    name: 'Dim Sum',
    animal: 'Dumpling',
    edge: 'Bucket hat',
    note: 'A dumpling in a bucket hat, the food version of Off Duty. Pleats peeking out under the brim keep it readable.',
    parts: [
      {
        shape: `<path d="M24,160 C20,116 60,84 100,80 C140,84 180,116 176,160 Q100,184 24,160 Z"/>`,
        detail: `<path d="M64,108 Q60,118 62,128 M136,108 Q140,118 138,128" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>${face(136, 26, 5, 152, 12)}`,
      },
      place(bucket, { k: 0.95, dy: 8 }),
    ],
  },
  {
    id: 'capybara-beanie',
    name: 'Chill Capy',
    animal: 'Capybara',
    edge: 'Beanie',
    note: 'The boxy capybara head in a beanie. The calmest animal alive, now with a straight face to match.',
    parts: [
      {
        shape: `<circle cx="56" cy="104" r="9"/><circle cx="144" cy="104" r="9"/><path d="M50,112 Q50,90 76,88 L124,88 Q150,90 150,112 L150,160 Q150,190 118,190 L82,190 Q50,190 50,160 Z"/>`,
        detail: `${dots(136, 32, 5)}<ellipse cx="88" cy="166" rx="3.5" ry="7" transform="rotate(20 88 166)" fill="${K}"/><ellipse cx="112" cy="166" rx="3.5" ry="7" transform="rotate(-20 112 166)" fill="${K}"/>${mouth(180, 12)}`,
      },
      place(beanie, { dy: 10 }),
    ],
  },
  {
    id: 'frog-bucket',
    name: 'Pond Life',
    animal: 'Frog',
    edge: 'Bucket hat',
    note: 'A wide frog with its eyes peeking out under a bucket hat brim. Frogs in bucket hats are an internet favorite, and this one has a straight face.',
    parts: [
      {
        shape: `<circle cx="60" cy="112" r="21"/><circle cx="140" cy="112" r="21"/><ellipse cx="100" cy="146" rx="74" ry="44"/>`,
        detail: `${dots(124, 40, 6)}<circle cx="92" cy="142" r="2.5" fill="${K}"/><circle cx="108" cy="140" r="2.5" fill="${K}"/>${mouth(160, 18)}`,
      },
      place(bucket, { k: 0.85, dy: 10 }),
    ],
  },
];

module.exports = {
  logos: [...kept, ...fresh.map(m => ({ ...m, style: 'New', group: 'new' }))],
  kept,
  fresh: fresh.map(m => ({ ...m, style: 'New', group: 'new' })),
  renderLogo,
};
