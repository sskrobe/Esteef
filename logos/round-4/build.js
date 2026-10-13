// Builds the Round 4 concept gallery (index.html) and one standalone SVG per mark (svg/).
// Run: node logos/round-4/build.js
const fs = require('fs');
const path = require('path');
const { logos, kept, fresh, renderLogo } = require('./logos');

const out = __dirname;
fs.mkdirSync(path.join(out, 'svg'), { recursive: true });
logos.forEach((l, i) => {
  const file = `${String(i + 1).padStart(2, '0')}-${l.id}.svg`;
  fs.writeFileSync(path.join(out, 'svg', file), renderLogo(l, { color: '#111111', size: 1000 }) + '\n');
});

const shirts = [
  { name: 'White', fabric: '#f7f7f5', ink: '#141414' },
  { name: 'Black', fabric: '#1b1b1d', ink: '#f4f4f2' },
  { name: 'Heather grey', fabric: '#b9b8b5', ink: '#1c1c1e' },
  { name: 'Navy', fabric: '#1f2a44', ink: '#f1efe8' },
  { name: 'Washed pink', fabric: '#e9b9c4', ink: '#2a1a20' },
];

const TEE = 'M70,22 Q100,42 130,22 L168,38 L192,80 L160,94 L152,82 L152,190 L48,190 L48,82 L40,94 L8,80 L32,38 Z';

// Chest placement sits on the wearer's left (viewer's right), sized like a real ~3in chest hit.
const tee = (logo, s, label) => `
  <figure class="tee">
    <svg viewBox="0 0 200 200" role="img" aria-label="${logo.name} on a ${s.name.toLowerCase()} tee">
      <path d="${TEE}" fill="${s.fabric}" stroke="var(--tee-edge)" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M70,22 Q100,42 130,22" fill="none" stroke="var(--tee-edge)" stroke-width="1.5"/>
      ${renderLogo(logo, { color: s.ink, title: false, place: { x: 110, y: 50, w: 32 } })}
    </svg>
    <figcaption>${label}</figcaption>
  </figure>`;

const card = (l, i) => {
  const n = i + 1;
  return `
  <article class="card" data-n="${n}" data-name="${l.name}">
    <div class="stage">
      <span class="num">${String(n).padStart(2, '0')}${l.kept ? ' &middot; kept' : ''}</span>
      <div class="mark solid">${renderLogo(l)}</div>
      <div class="mark outline">${renderLogo(l, { mode: 'outline', title: false })}</div>
      <p class="wordmark" aria-hidden="true">Daily Bread</p>
    </div>
    <div class="body">
      <div class="title-row">
        <h2>${l.name}</h2>
        <button class="pick" type="button" id="pick-${l.id}" aria-pressed="false" aria-label="Shortlist ${l.name}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7 4.5c2 0 3.6 1.1 5 2.9 1.4-1.8 3-2.9 5-2.9 3.4 0 5.6 3.4 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>
          <span>Shortlist</span>
        </button>
      </div>
      <p class="tags"><span>${l.animal}</span><span class="x">&times;</span><span>${l.edge}</span><span class="style ${l.style.toLowerCase()}">${l.style}</span></p>
      <p class="note">${l.note}</p>
      <div class="tees">${tee(l, shirts[0], 'White')}${tee(l, shirts[1], 'Black')}${tee(l, shirts[3], 'Navy')}</div>
    </div>
  </article>`;
};
const keptCards = kept.map((l, i) => card(l, i)).join('');
const freshCards = fresh.map((l, i) => card(l, i + kept.length)).join('');

const swatches = shirts.map((s, i) => `
  <button type="button" class="swatch" id="fabric-${i}" data-fabric="${s.fabric}" data-ink="${s.ink}" aria-pressed="${i === 0}">
    <span class="chip" style="background:${s.fabric}"></span>${s.name}
  </button>`).join('');

const html = `<title>Mascot Logos Round 4</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,500;0,6..96,700;1,6..96,500&family=Instrument+Sans:wght@400;500;600&family=Martian+Mono:wght@400;500&display=swap">
<style>
/* Layout: a lookbook wall. Short intro, a sticky fabric picker, then a two-up grid of concept cards. */
:root {
  --paper: #f3f1f4;
  --surface: #ffffff;
  --ink: #18161b;
  --muted: #6c6672;
  --rule: #dcd7df;
  --accent: #d6336f;
  --tee-edge: rgba(24, 22, 27, 0.22);
  --stage-fabric: #f7f7f5;
  --stage-ink: #141414;
  --font-display: "Bodoni Moda", "Didot", "Bodoni 72", Georgia, serif;
  --font-body: "Instrument Sans", "Helvetica Neue", Arial, sans-serif;
  --font-mono: "Martian Mono", ui-monospace, Menlo, Consolas, monospace;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --paper: #131115; --surface: #1d1a20; --ink: #f1edf3; --muted: #a39ca8; --rule: #2f2b33;
    --accent: #ff6b9f; --tee-edge: rgba(241, 237, 243, 0.25); color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --paper: #131115; --surface: #1d1a20; --ink: #f1edf3; --muted: #a39ca8; --rule: #2f2b33;
  --accent: #ff6b9f; --tee-edge: rgba(241, 237, 243, 0.25); color-scheme: dark;
}
* { box-sizing: border-box; }
body { background: var(--paper); color: var(--ink); font-family: var(--font-body); font-size: 15px; line-height: 1.5; }
.wrap { max-width: 1180px; margin: 0 auto; padding-inline: 20px; padding-block: 40px 64px; display: grid; gap: 28px; }
header { display: grid; gap: 14px; max-width: 68ch; }
.eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); margin: 0; }
h1 { font-family: var(--font-display); font-weight: 700; font-size: clamp(40px, 7vw, 76px); line-height: .95; margin: 0; text-wrap: balance; letter-spacing: -.02em; }
h1 em { font-weight: 500; color: var(--accent); }
.lede { margin: 0; color: var(--muted); font-size: 16px; }
.lede strong { color: var(--ink); font-weight: 600; }

.toolbar { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 2; background: var(--paper); padding-block: 12px; border-bottom: 1px solid var(--rule);
  display: flex; flex-wrap: wrap; gap: 10px 20px; align-items: center; justify-content: space-between; }
.fabric { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.label { font-family: var(--font-mono); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin-right: 4px; }
.swatch { display: inline-flex; align-items: center; gap: 7px; font: 500 13px var(--font-body); color: var(--ink); background: var(--surface);
  border: 1px solid var(--rule); border-radius: 999px; padding: 5px 12px 5px 6px; cursor: pointer; }
.swatch .chip { width: 18px; height: 18px; border-radius: 50%; border: 1px solid var(--tee-edge); }
.swatch[aria-pressed="true"] { border-color: var(--ink); box-shadow: inset 0 0 0 1px var(--ink); }
.picks { display: flex; gap: 10px; align-items: center; font-size: 13px; color: var(--muted); min-width: 0; }
.picks button { font: 600 13px var(--font-body); color: var(--paper); background: var(--ink); border: 0; border-radius: 999px; padding: 7px 14px; cursor: pointer; white-space: nowrap; }
.picks button:disabled { opacity: .4; cursor: default; }
button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.sections { display: grid; gap: 36px; }
.section-title { font-family: var(--font-mono); font-size: 12px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; margin: 0 0 12px; color: var(--ink); }
.namer { display: inline-flex; gap: 8px; align-items: center; font-size: 13px; cursor: pointer; }
.namer input { accent-color: var(--accent); width: 16px; height: 16px; margin: 0; }
.wordmark { display: none; margin: 0; font-family: var(--font-display); font-weight: 500; font-size: clamp(18px, 3vw, 26px); letter-spacing: .2em; text-transform: uppercase; line-height: 1; }
.show-name .wordmark { display: block; }
.mark.outline { display: none; }
.outline-view .mark.outline { display: block; }
.outline-view .mark.solid { display: none; }
.show-name .stage { grid-template-rows: auto auto; align-content: center; gap: 6px; }
.show-name .mark { width: 50%; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 1fr)); gap: 18px; }
.card { background: var(--surface); border: 1px solid var(--rule); border-radius: 6px; overflow: hidden; display: grid; grid-template-rows: auto 1fr; min-width: 0; }
.card.picked { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
.stage { position: relative; background: var(--stage-fabric); color: var(--stage-ink); aspect-ratio: 4 / 3; max-width: 100%; display: grid; place-items: center; transition: background .25s, color .25s; }
.mark { width: 62%; max-width: 260px; }
.mark svg { display: block; width: 100%; height: auto; }
.num { position: absolute; top: 12px; left: 14px; font-family: var(--font-mono); font-size: 12px; opacity: .55; }
.body { padding: 16px 18px 18px; display: grid; gap: 10px; align-content: start; min-width: 0; }
.title-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
h2 { font-family: var(--font-display); font-weight: 700; font-size: 25px; line-height: 1.1; margin: 0; letter-spacing: .005em; }
.pick { display: inline-flex; align-items: center; gap: 6px; font: 500 12px var(--font-body); color: var(--muted); background: none; border: 1px solid var(--rule); border-radius: 999px; padding: 4px 10px; cursor: pointer; }
.pick svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2; }
.pick[aria-pressed="true"] { color: var(--accent); border-color: var(--accent); }
.pick[aria-pressed="true"] svg { fill: currentColor; }
.tags { margin: 0; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; font-family: var(--font-mono); font-size: 11px; letter-spacing: .04em; text-transform: uppercase; }
.tags .x { color: var(--accent); }
.tags .style { margin-left: auto; border: 1px solid var(--rule); border-radius: 3px; padding: 1px 6px; color: var(--muted); }
.note { margin: 0; color: var(--muted); font-size: 14px; }
.tees { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 4px; padding-top: 12px; border-top: 1px dashed var(--rule); }
.tee { margin: 0; display: grid; gap: 2px; justify-items: center; }
.tee > svg { width: 100%; max-width: 110px; height: auto; display: block; }
.tee figcaption { font-family: var(--font-mono); font-size: 10px; color: var(--muted); letter-spacing: .04em; text-transform: uppercase; }

footer { color: var(--muted); font-size: 13px; max-width: 68ch; display: grid; gap: 6px; }
footer h3 { font-family: var(--font-mono); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--ink); margin: 0; font-weight: 500; }
footer p { margin: 0; }
@media (prefers-reduced-motion: reduce) { .stage { transition: none; } }
</style>

<div class="wrap">
  <header>
    <p class="eyebrow">Brand identity &middot; Round 4 &middot; 8 refined + 8 new</p>
    <h1>Too cute <em>to care.</em></h1>
    <p class="lede">The mood: <strong>high fashion with an attitude</strong>. Expensive, a little snobby, and in on the joke. Every character now gives you the unimpressed side-eye instead of a scowl. The shapes follow the Psycho Bunny formula: <strong>a head you can’t mistake, over two crossed objects that set the mood</strong>. Turn on <strong>Outline test</strong> to strip out the inside details. If a mark still reads as just an outline, it works as a logo.</p>
  </header>

  <div class="toolbar">
    <div class="fabric" role="group" aria-label="Shirt color">
      <span class="label">Shirt color</span>${swatches}
    </div>
    <label class="namer"><input type="checkbox" id="outline-test"> Outline test</label>
    <label class="namer"><input type="checkbox" id="show-name"> Show the &ldquo;Daily Bread&rdquo; name</label>
    <div class="picks">
      <span id="pick-count">Shortlist up to 5 favorites</span>
      <button type="button" id="copy-picks" disabled>Copy shortlist</button>
    </div>
  </div>

  <main class="sections">
    <section>
      <h3 class="section-title">Your keepers, refined</h3>
      <div class="grid">${keptCards}</div>
    </section>
    <section>
      <h3 class="section-title">New</h3>
      <div class="grid">${freshCards}</div>
    </section>
  </main>

  <footer>
    <h3>Next round</h3>
    <p>Shortlist your favorites and paste the list back to me with any notes (which animal, which twist, simpler or bolder). Round 5 takes your top picks into color, a proper Daily Bread wordmark, and hoodie and back-print mockups.</p>
  </footer>
</div>

<script>
(function () {
  var root = document.documentElement;
  var swatches = Array.prototype.slice.call(document.querySelectorAll('.swatch'));
  function setFabric(btn) {
    swatches.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
    root.style.setProperty('--stage-fabric', btn.dataset.fabric);
    root.style.setProperty('--stage-ink', btn.dataset.ink);
    try { localStorage.setItem('fabric', btn.id); } catch (e) {}
  }
  swatches.forEach(function (b) { b.addEventListener('click', function () { setFabric(b); }); });

  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
  var count = document.getElementById('pick-count');
  var copy = document.getElementById('copy-picks');
  function picked() { return cards.filter(function (c) { return c.classList.contains('picked'); }); }
  function refresh() {
    var p = picked();
    count.textContent = p.length ? p.map(function (c) { return '#' + c.dataset.n + ' ' + c.dataset.name; }).join(', ') : 'Shortlist up to 5 favorites';
    copy.disabled = !p.length;
    try { localStorage.setItem('picks', JSON.stringify(p.map(function (c) { return c.dataset.n; }))); } catch (e) {}
  }
  function toggle(card, on) {
    card.classList.toggle('picked', on);
    card.querySelector('.pick').setAttribute('aria-pressed', String(on));
  }
  cards.forEach(function (card) {
    card.querySelector('.pick').addEventListener('click', function () {
      var on = !card.classList.contains('picked');
      if (on && picked().length >= 5) toggle(picked()[0], false);
      toggle(card, on);
      refresh();
    });
  });
  copy.addEventListener('click', function () {
    var text = 'Logo shortlist: ' + count.textContent;
    var done = function () { copy.textContent = 'Copied'; setTimeout(function () { copy.textContent = 'Copy shortlist'; }, 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { window.getSelection().selectAllChildren(count); });
    else window.getSelection().selectAllChildren(count);
  });

  try {
    var f = document.getElementById(localStorage.getItem('fabric'));
    if (f) setFabric(f);
    JSON.parse(localStorage.getItem('picks') || '[]').forEach(function (n) {
      var c = document.querySelector('.card[data-n="' + n + '"]'); if (c) toggle(c, true);
    });
  } catch (e) {}
  var outlineBox = document.getElementById('outline-test');
  outlineBox.addEventListener('change', function () { root.classList.toggle('outline-view', outlineBox.checked); });
  var nameBox = document.getElementById('show-name');
  function setName(on) { root.classList.toggle('show-name', on); try { localStorage.setItem('showName', on ? '1' : ''); } catch (e) {} }
  nameBox.addEventListener('change', function () { setName(nameBox.checked); });
  try { if (localStorage.getItem('showName')) { nameBox.checked = true; setName(true); } } catch (e) {}
  refresh();
})();
</script>
`;

fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`Wrote index.html and ${logos.length} SVGs`);
