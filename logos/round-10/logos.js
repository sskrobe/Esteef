// Round 10: Coma Toast with X'd-out eyes + a heartbeat (EKG) line, either as the mouth or along the bottom.
// Top accessories are medical / sleep / "dead" themed, roughly symmetrical, and kept inside the
// toast's width so every mark fits a compact, balanced, rectangle-ish footprint.
const round4 = require('../round-4/logos');
const { W, K } = round4.helpers;
const renderLogo = round4.renderLogo;

const T = (part, t) => ({ shape: `<g transform="${t}">${part.shape}</g>`, detail: part.detail ? `<g transform="${t}">${part.detail}</g>` : '' });
const scaleAt = (k, cx, cy, dx = 0, dy = 0) => `translate(${cx + dx},${cy + dy}) scale(${k}) translate(${-cx},${-cy})`;

// mouth: 'ekg' draws a little heartbeat as the mouth, 'line' a tiny straight line.
function toast({ k = 0.82, dy = 0, mouth = 'ekg', faceY = 126 } = {}) {
  const m = faceY + 26;
  const eyes = [78, 122].map(x => `<path d="M${x - 8},${faceY - 8} L${x + 8},${faceY + 8} M${x + 8},${faceY - 8} L${x - 8},${faceY + 8}" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`).join('');
  const mouthSvg = mouth === 'ekg'
    ? `<path d="M74,${m} L88,${m} L93,${m - 9} L99,${m + 9} L105,${m - 14} L110,${m} L126,${m}" fill="none" stroke="${K}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="M93,${m} L107,${m}" stroke="${K}" stroke-width="4" stroke-linecap="round"/>`;
  return T({
    shape: `<path d="M50,106 C26,106 26,68 58,64 C70,50 130,50 142,64 C174,68 174,106 150,106 L150,178 Q150,186 142,186 L58,186 Q50,186 50,178 Z"/>`,
    detail: `<path d="M62,108 C44,106 44,78 66,74 C78,62 122,62 134,74 C156,78 156,106 138,108 L138,174 L62,174 Z" fill="none" stroke="${K}" stroke-width="4.5" stroke-linejoin="round"/>${eyes}${mouthSvg}`,
  }, scaleAt(k, 100, 118, 0, dy));
}

// Heartbeat line along the bottom, kept within the toast's width plus a little.
const thick = (pts, w) => pts.map(([x, y], i) => {
  let s = `<circle cx="${x}" cy="${y}" r="${w / 2}"/>`;
  if (i) {
    const [px, py] = pts[i - 1], len = Math.hypot(x - px, y - py), a = Math.atan2(y - py, x - px) * 180 / Math.PI;
    s += `<rect x="${px}" y="${py - w / 2}" width="${len.toFixed(1)}" height="${w}" transform="rotate(${a.toFixed(1)} ${px} ${py})"/>`;
  }
  return s;
}).join('');
const ekgBottom = { shape: thick([[32, 186], [70, 186], [78, 176], [88, 197], [100, 166], [111, 186], [120, 186], [126, 180], [132, 186], [168, 186]], 6.5), detail: '' };

// ---------- top accessories (final coordinates) ----------
const crown = (y, w, h) => {
  const l = 100 - w / 2, r = 100 + w / 2, b = y + h;
  return {
    shape: `<path d="M${l},${b} L${l - 3},${y + 6} L${l + w * 0.25},${y + h * 0.5} L100,${y - 3} L${r - w * 0.25},${y + h * 0.5} L${r + 3},${y + 6} L${r},${b} Z"/>
      <circle cx="${l - 3}" cy="${y + 4}" r="5.5"/><circle cx="100" cy="${y - 5}" r="5.5"/><circle cx="${r + 3}" cy="${y + 4}" r="5.5"/>`,
    detail: `<rect x="${l + 2}" y="${b - 11}" width="${w - 4}" height="4.5" fill="${K}"/>`,
  };
};
const halo = cy => ({ shape: `<path fill-rule="evenodd" d="M56,${cy} A44,10 0 1 0 144,${cy} A44,10 0 1 0 56,${cy} Z M67,${cy} A33,5 0 1 0 133,${cy} A33,5 0 1 0 67,${cy} Z"/>`, detail: '' });
const nurseCap = {
  shape: `<path d="M50,74 L60,30 Q100,18 140,30 L150,74 Q100,64 50,74 Z"/>`,
  detail: `<path d="M56,52 Q100,42 144,52" fill="none" stroke="${K}" stroke-width="3.5"/><path d="M95,26 L105,26 L105,33 L112,33 L112,43 L105,43 L105,50 L95,50 L95,43 L88,43 L88,33 L95,33 Z" fill="${K}"/>`,
};
const scrubCap = {
  shape: `<path d="M44,78 Q44,22 100,20 Q156,22 156,78 Z"/>`,
  detail: `<path d="M46,64 Q100,56 154,64" fill="none" stroke="${K}" stroke-width="4"/>${[[70, 38], [100, 32], [130, 38], [84, 50], [116, 50], [58, 52], [142, 52]].map(([x, y]) => `<path d="M${x - 4},${y} L${x + 4},${y} M${x},${y - 4} L${x},${y + 4}" stroke="${K}" stroke-width="2.5" stroke-linecap="round"/>`).join('')}`,
};
const nightcap = {
  shape: `<path d="M50,72 Q62,38 100,16 Q138,38 150,72 Z"/><rect x="44" y="64" width="112" height="16" rx="7"/><circle cx="100" cy="12" r="10"/>`,
  detail: `<path d="M46,66 L154,66" stroke="${K}" stroke-width="3.5"/><path d="M74,64 L92,30 M100,64 L108,24 M126,64 L118,32" stroke="${K}" stroke-width="5"/>`,
};
const sleepMask = {
  shape: `<path d="M38,52 Q38,36 58,36 L86,38 Q100,46 114,38 L142,36 Q162,36 162,52 Q162,72 140,72 Q122,72 110,62 Q100,58 90,62 Q78,72 60,72 Q38,72 38,52 Z"/>`,
  detail: `<path d="M54,56 Q66,64 80,56 M120,56 Q134,64 146,56" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>
    ${[58, 66, 74].map(x => `<path d="M${x},${60} l-1,6" stroke="${K}" stroke-width="2.5" stroke-linecap="round"/>`).join('')}${[126, 134, 142].map(x => `<path d="M${x},${60} l1,6" stroke="${K}" stroke-width="2.5" stroke-linecap="round"/>`).join('')}`,
};
const iceBag = {
  shape: `<ellipse cx="100" cy="50" rx="52" ry="24"/><rect x="88" y="12" width="24" height="20" rx="4"/>`,
  detail: `<path d="M56,46 Q100,34 144,46 M56,58 Q100,48 144,58" fill="none" stroke="${K}" stroke-width="3"/><path d="M92,18 L108,18 M92,25 L108,25" stroke="${K}" stroke-width="2.5"/>`,
};
const headWrap = {
  shape: `<path d="M36,96 Q100,78 164,96 L164,114 Q100,96 36,114 Z"/><path d="M100,80 Q84,64 76,70 Q72,78 98,84 Z M100,80 Q116,64 124,70 Q128,78 102,84 Z"/><circle cx="100" cy="82" r="6.5"/>`,
  detail: `<path d="M40,105 Q100,88 160,105" fill="none" stroke="${K}" stroke-width="2.5" stroke-dasharray="6 5"/>`,
};
const laurel = (() => {
  const leaves = [];
  for (let i = 0; i < 6; i++) {
    const a = (150 + i * 19) * Math.PI / 180, x = 100 + Math.cos(a) * 76, y = 130 + Math.sin(a) * 80;
    const rot = a * 180 / Math.PI + 90 + 30;
    leaves.push(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="13" ry="6" transform="rotate(${rot.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`);
  }
  const half = leaves.join('');
  return { shape: `${half}<g transform="translate(200,0) scale(-1,1)">${half}</g>`, detail: '' };
})();

const marks = [
  { id: 'dead-royalty', name: 'Dead Royalty', edge: 'Crown + heartbeat mouth', note: 'The keeper combo: X eyes, a heartbeat for a mouth, and a crown. Knocked out, still in charge.', parts: [toast({ dy: 20 }), crown(18, 84, 40)] },
  { id: 'long-live', name: 'Long Live', edge: 'Crown + heartbeat line', note: '"Long live the king" with the pulse running underneath. Same crown, but the heartbeat becomes a baseline the whole mark sits on.', parts: [toast({ k: 0.72, dy: -4, mouth: 'line' }), crown(12, 74, 34), ekgBottom] },
  { id: 'saint', name: 'Saint', edge: 'Halo + heartbeat mouth', note: 'Halo floating above, X eyes, heartbeat mouth: somewhere between alive and the afterlife. Clean and very balanced.', parts: [toast({ dy: 20 }), halo(42)] },
  { id: 'night-nurse', name: 'Night Nurse', edge: 'Nurse’s cap + heartbeat mouth', note: 'A classic folded nurse’s cap with a plus sign. The most obviously "medical" option, and the cap stays neatly inside the toast’s width.', parts: [toast({ dy: 20 }), nurseCap] },
  { id: 'scrubbed-in', name: 'Scrubbed In', edge: 'Surgical cap + heartbeat mouth', note: 'A patterned surgical scrub cap pulled over the crust, like the toast is the surgeon and the patient at the same time.', parts: [toast({ dy: 22 }), scrubCap] },
  { id: 'head-case', name: 'Head Case', edge: 'Head bandage + heartbeat mouth', note: 'A bandage wrapped around its head and tied in a bow on top. The bow keeps it symmetrical and adds a little cuteness.', parts: [toast({ dy: 22 }), headWrap] },
  { id: 'legend', name: 'Legend', edge: 'Laurel wreath + heartbeat mouth', note: 'A laurel wreath hugging the top of the slice: half victory crown, half funeral wreath. Very fashion-house.', parts: [laurel, toast({ k: 0.8, dy: 12 })] },
  { id: 'beauty-rest', name: 'Beauty Rest', edge: 'Sleep mask + heartbeat line', note: 'A sleep mask pushed up on its forehead, X eyes underneath, heartbeat along the bottom. Ready for bed, possibly forever.', parts: [toast({ k: 0.72, dy: 0, mouth: 'line' }), sleepMask, ekgBottom] },
  { id: 'bedtime', name: 'Bedtime', edge: 'Nightcap + heartbeat line', note: 'A symmetrical striped nightcap with a pom on top, and the pulse underneath. Sleep-themed, but stays tidy and upright.', parts: [toast({ k: 0.72, dy: 2, mouth: 'line' }), nightcap, ekgBottom] },
  { id: 'cold-case', name: 'Cold Case', edge: 'Ice bag + heartbeat line', note: 'A quilted ice bag balanced on its head, with the heartbeat below. "Cold case" works as a detective joke too, a nod to the Inspector.', parts: [toast({ k: 0.72, dy: 2, mouth: 'line' }), iceBag, ekgBottom] },
];

const all = marks.map(m => ({ ...m, animal: 'Coma Toast', style: 'New', group: 'new' }));
module.exports = { logos: all, kept: [], fresh: all, renderLogo };
