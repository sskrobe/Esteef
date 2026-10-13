// Builds the Round 13 mouth study page: one row per mouth, the four go-forward designs in each row,
// plus the same four at roughly chest-logo size. Run: node logos/round-13/build.js
const fs = require('fs');
const path = require('path');
const { grid, renderLogo } = require('./logos');

const names = { saint: 'Saint', 'little-devil': 'Little Devil', 'heaven-sent': 'Heaven Sent', 'raising-hell': 'Raising Hell' };

const rows = grid.map((row, i) => `
  <section class="row" id="mouth-${row.id}">
    <div class="label">
      <span class="tag">${i === 0 ? 'Reference' : `Option ${String.fromCharCode(64 + i)}`}</span>
      <h2>${row.name}</h2>
      <p>${row.note}</p>
      <div class="small" aria-label="${row.name} at chest-logo size">${row.marks.map(m => `<span>${renderLogo(m, { title: false })}</span>`).join('')}</div>
      <p class="hint">Above: roughly chest-logo size</p>
    </div>
    <div class="tiles">${row.marks.map(m => `
      <figure>${renderLogo(m)}<figcaption>${names[m.id.split('--')[0]]}</figcaption></figure>`).join('')}
    </div>
  </section>`).join('');

const html = `<title>Coma Toast Mouth Study</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,700;1,6..96,500&family=Instrument+Sans:wght@400;500;600&family=Martian+Mono:wght@400&display=swap">
<style>
/* Layout: a comparison table. Each row is one mouth: its name and chest-size preview on the left, the four designs on the right. */
:root {
  --paper: #f3f1f4; --surface: #ffffff; --ink: #18161b; --muted: #6c6672; --rule: #dcd7df; --accent: #d6336f;
  --tile: #ffffff; --tile-ink: #141414;
  --font-display: "Bodoni Moda", "Didot", Georgia, serif;
  --font-body: "Instrument Sans", "Helvetica Neue", Arial, sans-serif;
  --font-mono: "Martian Mono", ui-monospace, Menlo, monospace;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --paper: #131115; --surface: #1d1a20; --ink: #f1edf3; --muted: #a39ca8; --rule: #2f2b33; --accent: #ff6b9f; color-scheme: dark; }
}
:root[data-theme="dark"] { --paper: #131115; --surface: #1d1a20; --ink: #f1edf3; --muted: #a39ca8; --rule: #2f2b33; --accent: #ff6b9f; color-scheme: dark; }
.on-black { --tile: #1b1b1d; --tile-ink: #f4f4f2; }
* { box-sizing: border-box; }
body { background: var(--paper); color: var(--ink); font-family: var(--font-body); font-size: 15px; line-height: 1.5; }
.wrap { max-width: 1180px; margin: 0 auto; padding-inline: 20px; padding-block: 40px 64px; display: grid; gap: 24px; }
.eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); margin: 0; }
h1 { font-family: var(--font-display); font-weight: 700; font-size: clamp(38px, 6.5vw, 68px); line-height: .96; margin: 0; letter-spacing: -.02em; text-wrap: balance; }
h1 em { font-weight: 500; color: var(--accent); }
header { display: grid; gap: 12px; max-width: 70ch; }
.lede { margin: 0; color: var(--muted); font-size: 16px; }
.toolbar { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; padding-block: 10px; border-block: 1px solid var(--rule); position: sticky; top: env(safe-area-inset-top, 0px); background: var(--paper); z-index: 2; }
.toolbar label { display: inline-flex; gap: 8px; align-items: center; font-size: 14px; cursor: pointer; }
.toolbar input { accent-color: var(--accent); width: 16px; height: 16px; margin: 0; }
.toolbar nav { display: flex; gap: 6px; flex-wrap: wrap; margin-left: auto; }
.toolbar a { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); text-decoration: none; border: 1px solid var(--rule); border-radius: 999px; padding: 3px 9px; }
.toolbar a:hover, .toolbar a:focus-visible { color: var(--ink); border-color: var(--ink); }
.row { display: grid; grid-template-columns: minmax(0, 240px) minmax(0, 1fr); gap: 20px; padding-block: 18px; border-bottom: 1px solid var(--rule); align-items: start; }
.label { display: grid; gap: 6px; align-content: start; min-width: 0; }
.tag { font-family: var(--font-mono); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); }
h2 { font-family: var(--font-display); font-weight: 700; font-size: 26px; line-height: 1.05; margin: 0; }
.label p { margin: 0; color: var(--muted); font-size: 14px; }
.small { display: flex; gap: 8px; margin-top: 6px; }
.small span { width: 44px; height: 44px; background: var(--tile); color: var(--tile-ink); border: 1px solid var(--rule); border-radius: 4px; display: block; }
.small svg { width: 100%; height: 100%; display: block; }
.label .hint { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: .05em; }
.tiles { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
figure { margin: 0; background: var(--tile); color: var(--tile-ink); border: 1px solid var(--rule); border-radius: 6px; padding: 8px; display: grid; gap: 2px; transition: background .2s, color .2s; }
figure svg { width: 100%; height: auto; display: block; }
figcaption { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); text-align: center; }
@media (max-width: 760px) { .row { grid-template-columns: minmax(0, 1fr); } .tiles { grid-template-columns: repeat(2, minmax(0, 1fr)); } .toolbar nav { margin-left: 0; } }
@media (prefers-reduced-motion: reduce) { figure { transition: none; } }
</style>

<div class="wrap">
  <header>
    <p class="eyebrow">Coma Toast &middot; Round 13 &middot; mouth study</p>
    <h1>One face, <em>seven mouths.</em></h1>
    <p class="lede">The four go-forward designs (Saint, Little Devil, Heaven Sent, Raising Hell) are locked. Only the mouth changes from row to row. Every mouth stays level at both ends: no smile, no frown. Check the small row next to each mouth, too. That’s roughly the size of a chest logo, where a mouth detail either survives or disappears.</p>
  </header>
  <div class="toolbar">
    <label><input type="checkbox" id="on-black"> Show on a black shirt</label>
    <nav aria-label="Jump to a mouth">${grid.map((r, i) => `<a href="#mouth-${r.id}">${i === 0 ? 'Ref' : String.fromCharCode(64 + i)}</a>`).join('')}</nav>
  </div>
  <main>${rows}
  </main>
</div>
<script>
(function () {
  var box = document.getElementById('on-black');
  box.addEventListener('change', function () { document.documentElement.classList.toggle('on-black', box.checked); });
})();
</script>
`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('Wrote index.html with', grid.length, 'mouths');
