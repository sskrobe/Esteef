# Esteef

Clothing brand workspace (t-shirts and sweatshirts to start).

## Logo concepts

- `logos/round-1/` holds ten mascot logo concepts: a cute animal with a villain twist.
  - `index.html` is the gallery page with shirt-color previews.
  - `svg/` has one standalone 1000px SVG per concept.
  - `logos.js` holds the artwork; `build.js` regenerates the gallery and SVGs (`node logos/round-1/build.js`).
- `logos/round-2/` keeps four Round 1 marks (Nine Lives, Bamboo Bandit, The Don, Captain Quack) and adds ten new ones aimed at MMA, gaming and hip hop, with a "Daily Bread" name preview. Same layout; rebuild with `node logos/round-2/build.js`.
- `logos/round-3/` keeps six marks (Nine Lives, Bamboo Bandit, The Don, Captain Quack, Ground & Pound, Toast) and adds eight food characters and six tough cute animals. Rebuild with `node logos/round-3/build.js`.
