// Baguette ("Bag-Ette"), round 1: female mascot concepts with a French theme and a lot of sass. Each mixes a baguette
// with a character (mostly a fox). Same drawing language as the Coma Toast marks: bold ink outlines, flat fills,
// simple shapes that read as a silhouette. Every concept shares one sassy face kit: half-lidded side-eye with lashes,
// one raised brow, a red-lipstick smirk, a beauty mark.
// Each concept: { id, name, idea, svg } where svg is the inner markup of a 0 0 200 200 viewBox.
const C = {
  ink: '#1b1b1b', crust: '#d98e3a', crustDk: '#b5692a', crumb: '#f6d79c', red: '#d62839', navy: '#1f2a5c',
  cream: '#fff6e6', fox: '#e8742a', foxLt: '#fff1e0', pink: '#ffb3c7', gold: '#d9a637', white: '#ffffff', poodle: '#ffd6e3',
};
const SW = 4;   // outline weight
const st = (w = SW) => `stroke="${C.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

// a baguette lying along the x axis, centered at 0,0: half length L, half thickness T, with n score slashes at xs
const baguette = (L, T, xs = []) => {
  const d = `M ${-L} 0 C ${-L} ${-T * 0.95} ${-L * 0.72} ${-T} ${-L * 0.45} ${-T} L ${L * 0.45} ${-T} C ${L * 0.72} ${-T} ${L} ${-T * 0.95} ${L} 0 C ${L} ${T * 0.95} ${L * 0.72} ${T} ${L * 0.45} ${T} L ${-L * 0.45} ${T} C ${-L * 0.72} ${T} ${-L} ${T * 0.95} ${-L} 0 Z`;
  const scores = xs.map(x => `<path d="M ${x - T * 0.55} ${T * 0.18} Q ${x - T * 0.1} ${-T * 0.72} ${x + T * 0.6} ${-T * 0.48} Q ${x + T * 0.1} ${T * 0.2} ${x - T * 0.55} ${T * 0.18} Z" fill="${C.crumb}" ${st(2)}/>`).join('');
  return { d, svg: `<path d="${d}" fill="${C.crust}" ${st()}/><path d="M ${-L * 0.7} ${T * 0.62} Q 0 ${T * 0.9} ${L * 0.7} ${T * 0.62}" fill="none" stroke="${C.crustDk}" stroke-width="3" stroke-linecap="round"/>${scores}` };
};
// the sassy face kit, centered at 0,0 (eyes at y 0, lips below); look = pupil direction (1 right, -1 left)
const eye = (look, kind) => `<path d="M -7 0 Q 0 7.5 7 0 Z" fill="${C.white}" ${st(1.8)}/><circle cx="${look * 2.4}" cy="1.9" r="2.1" fill="${C.ink}"/>` +
  `<path d="M -8 0.6 Q 0 -3 8.5 0" fill="none" ${st(2.8)}/>` +
  (kind === 'cat' ? `<path d="M 7.8 -0.2 L 14 -4.6 L 9.6 1.2 Z" fill="${C.ink}" ${st(1)}/>` : `<path d="M 8 0 l 3.6 -2.6 M 7 -1.3 l 2.3 -3.7" fill="none" ${st(1.8)}/>`);
const face = ({ x, y, s = 1, rot = 0, look = 1, kind = 'lid', brows = true, lips = true, mark = true, blush = true, eyes = true }) => `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">` +
  (blush ? `<ellipse cx="-14" cy="6.5" rx="4.2" ry="2.2" fill="${C.pink}"/><ellipse cx="16" cy="6.5" rx="4.2" ry="2.2" fill="${C.pink}"/>` : '') +
  (eyes ? `<g transform="translate(10,0)">${eye(look, kind)}</g><g transform="translate(-10,0) scale(-1,1)">${eye(-look, kind)}</g>` : '') +
  (brows ? `<path d="M 4 -9 Q 10 -14.5 16.5 -10" fill="none" ${st(2.6)}/><path d="M -16 -7.4 Q -10 -9.4 -4 -7.6" fill="none" ${st(2.6)}/>` : '') +
  (lips ? `<g transform="translate(2,13)"><path d="M -7 0 Q -3 -2.2 0 -0.6 Q 3 -2.6 7.5 -1.8 Q 3.5 4.6 -7 0 Z" fill="${C.red}" ${st(1.6)}/><path d="M 7.5 -1.8 q 2 -0.5 2.7 -2.5" fill="none" ${st(1.4)}/></g>` : '') +
  (mark ? `<circle cx="13.5" cy="9.5" r="1.2" fill="${C.ink}"/>` : '') + '</g>';
const beret = (x, y, w, rot, fill = C.red) => `<g transform="translate(${x},${y}) rotate(${rot})"><path d="M ${-w} 2 Q ${-w * 1.05} ${-w * 0.5} 0 ${-w * 0.56} Q ${w * 1.05} ${-w * 0.5} ${w} 2 Q 0 ${w * 0.24} ${-w} 2 Z" fill="${fill}" ${st()}/><path d="M -1.6 ${-w * 0.56} l 0.5 -5 l 2.4 0 l 0.5 5 Z" fill="${fill}" ${st(2)}/></g>`;
const ear = (x, y, s, rot, fill = C.fox, inner = C.foxLt) => `<g transform="translate(${x},${y}) rotate(${rot})"><path d="M ${-s * 0.55} 0 Q ${-s * 0.32} ${-s * 0.95} 0 ${-s * 1.15} Q ${s * 0.32} ${-s * 0.95} ${s * 0.55} 0 Z" fill="${fill}" ${st()}/><path d="M ${-s * 0.28} ${-s * 0.08} Q ${-s * 0.14} ${-s * 0.72} 0 ${-s * 0.84} Q ${s * 0.14} ${-s * 0.72} ${s * 0.28} ${-s * 0.08} Z" fill="${inner}"/></g>`;
const tail = (x, y, s, rot) => `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M 0 0 C 22 -12 48 -6 54 16 C 60 34 46 50 28 52 C 40 40 36 24 22 19 C 13 16 5 12 0 0 Z" fill="${C.fox}" ${st(SW / s)}/><path d="M 49 6 C 59 20 58 40 28 52 C 40 42 44 28 49 6 Z" fill="${C.white}" ${st(SW / s)}/></g>`;

const concepts = [
  {
    id: 'renarde', name: 'Renarde',
    idea: 'The baguette is the fox: a loaf standing up with a slight lean, fox ears and a red beret on top, a bushy fox tail curling out behind, and the side-eye smirk.',
    svg: tail(112, 158, 0.95, -18) + ear(94, 50, 26, -22) + ear(122, 50, 26, 18) +
      (() => { const b = baguette(74, 28, [-52, -34, -16]); return `<g transform="translate(102,112) rotate(-82)">${b.svg}</g>`; })() +
      face({ x: 105, y: 78, s: 1.38, rot: -8 }) + beret(110, 42, 22, -14),
  },
  {
    id: 'fox-loaf', name: 'Fox Loaf',
    idea: 'One loaf, one fox, in profile: the pointed end is her snout (black nose tip), ears and a navy beret at the head end, the scores run down her back like fur, and the far end turns into a white-tipped tail.',
    svg: ear(54, 92, 28, -24) + ear(72, 86, 28, -4) +
      (() => { const b = baguette(84, 30, [10, 32, 54]); return `<defs><clipPath id="fl"><path d="${b.d}"/></clipPath></defs><g transform="translate(104,114) rotate(-6)">${b.svg}<g clip-path="url(#fl)"><path d="M 62 -40 Q 70 0 60 40 L 100 40 L 100 -40 Z" fill="${C.white}"/><path d="M -88 6 Q -60 30 -30 22 Q -52 14 -62 2 Z" fill="${C.foxLt}"/></g><path d="${b.d}" fill="none" ${st()}/><path d="M 62 -30 Q 70 0 62 30" fill="none" ${st(2.5)}/></g>`; })() +
      `<ellipse cx="22" cy="121" rx="7" ry="6" fill="${C.ink}"/>` +
      `<g transform="translate(52,107) rotate(-6) scale(1.3)"><path d="M -7 0 Q 0 7.5 7 0 Z" fill="${C.white}" ${st(1.8)}/><circle cx="-2.4" cy="1.9" r="2.1" fill="${C.ink}"/><path d="M -8.5 0 Q 0 -3 8 0.6" fill="none" ${st(2.8)}/><path d="M 8 0 l 3.6 -2.6 M 7 -1.3 l 2.3 -3.7" fill="none" ${st(1.8)}/><path d="M -6 -9 Q 0 -14 7 -10" fill="none" ${st(2.6)}/></g>` +
      `<g transform="translate(34,130) rotate(-10)"><path d="M -7 0 Q -3 -2.2 0 -0.6 Q 3 -2.6 7.5 -1.8 Q 3.5 4.6 -7 0 Z" fill="${C.red}" ${st(1.6)}/></g><circle cx="44" cy="124" r="1.2" fill="${C.ink}"/>` +
      beret(64, 84, 22, -16, C.navy),
  },
  {
    id: 'bag-ette', name: 'Bag-Ette',
    idea: 'The pun, literally: a baguette that is a designer handbag. Gold strap with a red bow, gold clasp, and the face right on the bag. Chic, a little bougie.',
    svg: `<path d="M 58 112 C 56 34 144 34 142 112" fill="none" stroke="${C.ink}" stroke-width="11" stroke-linecap="round"/><path d="M 58 112 C 56 34 144 34 142 112" fill="none" stroke="${C.gold}" stroke-width="5" stroke-linecap="round"/>` +
      `<g transform="translate(100,48)"><path d="M 0 0 L -16 -9 L -16 9 Z M 0 0 L 16 -9 L 16 9 Z" fill="${C.red}" ${st(2.5)}/><circle r="4.5" fill="${C.red}" ${st(2.5)}/></g>` +
      (() => { const b = baguette(84, 38, [-64, 64]); return `<g transform="translate(100,130)">${b.svg}</g>`; })() +
      `<rect x="91" y="88" width="18" height="11" rx="3" fill="${C.gold}" ${st(2.5)}/>` +
      face({ x: 99, y: 124, s: 1.55 }),
  },
  {
    id: 'fox-baguette', name: 'Fox à la Baguette',
    idea: 'A fox head front-on, red beret cocked to one side, with a baguette slung behind her like a sword. The clearest "fox" read of the set.',
    svg: (() => { const b = baguette(94, 21, [-70, -52, 52, 70]); return `<g transform="translate(100,110) rotate(-32)">${b.svg}</g>`; })() +
      ear(68, 74, 36, -20) + ear(132, 74, 36, 20) +
      `<path d="M 100 160 C 80 152 52 132 48 102 C 46 88 52 76 60 68 L 140 68 C 148 76 154 88 152 102 C 148 132 120 152 100 160 Z" fill="${C.fox}" ${st()}/>` +
      `<path d="M 100 160 C 88 152 70 140 62 120 C 76 124 90 122 100 114 C 110 122 124 124 138 120 C 130 140 112 152 100 160 Z" fill="${C.foxLt}" ${st(2.5)}/>` +
      `<path d="M 93 138 Q 100 133 107 138 Q 104 145 100 146 Q 96 145 93 138 Z" fill="${C.ink}"/>` +
      face({ x: 100, y: 100, s: 1.15, lips: false, mark: false }) +
      `<g transform="translate(103,152)"><path d="M -7 0 Q -3 -2.2 0 -0.6 Q 3 -2.6 7.5 -1.8 Q 3.5 4.6 -7 0 Z" fill="${C.red}" ${st(1.6)}/></g><circle cx="118" cy="140" r="1.3" fill="${C.ink}"/>` +
      beret(114, 64, 30, 14),
  },
  {
    id: 'minette', name: 'Minette',
    idea: 'A cat-baguette lounging on a diagonal: cat ears, a tiny navy beret, cat-eye eyeliner, whiskers, and a red ribbon tied around the loaf.',
    svg: `<g transform="translate(100,118) rotate(-28)">` + ear(-40, -26, 22, -12, C.crust, C.pink) + ear(-14, -29, 22, 10, C.crust, C.pink) +
      baguette(86, 32, [24, 44, 64]).svg +
      `<rect x="8" y="-33" width="10" height="66" fill="${C.red}" ${st(2.5)}/><g transform="translate(13,-36)"><path d="M 0 0 L -12 -8 L -12 8 Z M 0 0 L 12 -8 L 12 8 Z" fill="${C.red}" ${st(2.2)}/><circle r="3.5" fill="${C.red}" ${st(2.2)}/></g>` +
      face({ x: -32, y: 1, s: 1.2, kind: 'cat' }) +
      `<path d="M -56 9 l -16 -3 M -56 13 l -16 2 M -8 9 l 12 -4 M -8 13 l 12 1" fill="none" ${st(1.6)}/>` +
      beret(-30, -37, 13, 0, C.navy) + `</g>`,
  },
  {
    id: 'mademoiselle', name: 'Mademoiselle',
    idea: 'The full diva, no animal: a standing baguette in oversized cat-eye sunglasses, one brow up over the frames, red beret, red lips, and a Breton-stripe scarf knotted at the neck.',
    svg: (() => { const b = baguette(76, 30, [-54, -36]); return `<g transform="translate(100,114) rotate(-86)">${b.svg}</g>`; })() +
      `<g transform="translate(102,80)"><path d="M 2 -5 Q 12 -9.5 23 -6.5 Q 23 4 12.5 5.5 Q 3 4.5 2 -5 Z M -2 -5 Q -12 -9.5 -23 -6.5 Q -23 4 -12.5 5.5 Q -3 4.5 -2 -5 Z" fill="${C.ink}" ${st(2)}/><path d="M -2 -4 Q 0 -6 2 -4" fill="none" ${st(2.5)}/><path d="M 7 -3 l 6 -1.5 M -18 -3 l 6 -1.5" stroke="${C.white}" stroke-width="1.8" stroke-linecap="round"/><path d="M 6 -13 Q 13 -19 21 -14" fill="none" ${st(2.6)}/><path d="M -21 -11 Q -13 -13 -6 -11" fill="none" ${st(2.6)}/></g>` +
      `<g transform="translate(104,97)"><path d="M -7 0 Q -3 -2.2 0 -0.6 Q 3 -2.6 7.5 -1.8 Q 3.5 4.6 -7 0 Z" fill="${C.red}" ${st(1.6)}/><path d="M 7.5 -1.8 q 2 -0.5 2.7 -2.5" fill="none" ${st(1.4)}/></g><circle cx="116" cy="92" r="1.2" fill="${C.ink}"/>` +
      `<defs><clipPath id="scarf"><path d="M 70 104 Q 100 112 132 104 L 132 117 Q 100 125 70 117 Z"/></clipPath></defs>` +
      `<path d="M 70 104 Q 100 112 132 104 L 132 117 Q 100 125 70 117 Z" fill="${C.white}"/><g clip-path="url(#scarf)">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<rect x="${72 + i * 6.4}" y="100" width="3.2" height="30" fill="${C.navy}"/>`).join('')}</g><path d="M 70 104 Q 100 112 132 104 L 132 117 Q 100 125 70 117 Z" fill="none" ${st(3)}/>` +
      `<path d="M 124 114 L 140 146 L 130 148 L 120 118 Z" fill="${C.white}" ${st(2.5)}/><path d="M 126 120 l 4 8 M 130 129 l 4 8 M 133 137 l 3 7" stroke="${C.navy}" stroke-width="3"/><circle cx="125" cy="113" r="5.5" fill="${C.navy}" ${st(2.5)}/>` +
      beret(102, 42, 25, -16),
  },
  {
    id: 'bijou', name: 'Bijou',
    idea: 'A poodle-baguette: a fluffy pink poodle head and pompom tail on a baguette body, pearl collar, tiny navy beret, maximum attitude.',
    svg: `<path d="M 92 150 L 90 168 M 136 150 L 138 168" ${st(5)}/><circle cx="89" cy="171" r="7" fill="${C.poodle}" ${st(3)}/><circle cx="139" cy="171" r="7" fill="${C.poodle}" ${st(3)}/>` +
      [[178, 116, 11], [186, 106, 8], [184, 126, 8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.poodle}" ${st(3)}/>`).join('') +
      (() => { const b = baguette(66, 26, [6, 26, 44]); return `<g transform="translate(116,132) rotate(-8)">${b.svg}</g>`; })() +
      [[32, 104, 12], [74, 104, 12], [34, 86, 11], [72, 86, 11], [40, 70, 13], [66, 70, 13], [53, 60, 13], [53, 94, 26]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.poodle}" ${st(3)}/>`).join('') +
      `<circle cx="53" cy="94" r="24.5" fill="${C.poodle}"/>` +
      [0, 1, 2, 3, 4, 5, 6].map(i => { const a = Math.PI * (0.2 + i * 0.1); return `<circle cx="${(53 + Math.cos(a) * 26).toFixed(1)}" cy="${(110 + Math.sin(a) * 8).toFixed(1)}" r="3.6" fill="${C.white}" ${st(1.6)}/>`; }).join('') +
      face({ x: 53, y: 93, s: 1.08 }) + beret(54, 50, 15, -12, C.navy),
  },
];

module.exports = { concepts, C };
