# ☉ COSMOGRAPHIA — The Ancient Atlas of the Heavens

An Emochi-style companion to **everything about the current state of space**: the latest
discoveries, live news, and a **zoomable map of the cosmos** — from the multiverse down
to the moons of the outer dark — all dressed in the astronomy of the ancients.

## ✦ The Atlas (the big feature)

Descend the great chain of being through **10 levels of scale**:

```
Multiverse → Observable Universe → Laniakea → Local Group → Milky Way
  → Solar System → Worlds → Moons
```

- Click any golden mark to **zoom into it** (the view zooms through the point you clicked)
- 25 celestial bodies, each with a hand-drawn ancient-style SVG chart:
  bubble-aeons, the cosmic web, supercluster flow toward the Great Attractor,
  spiral arms, orbital rings, and painted globes of planets & moons
- Every world carries an **Astronomer's Ledger**: size, distance, year, day, temperature —
  plus what the *ancients* believed and what *moderns* recently discovered
- Breadcrumb navigation, ascend/reset, deep links (`#/atlas/europa`)

## ✦ The Chronicles (live news)

- Fetches **live space news** from the [Spaceflight News API](https://spaceflightnewsapi.net) (no key needed)
- **Wonder of the Day** — NASA's Astronomy Picture of the Day via the public API
- Results cache locally; falls back to an archival scroll if the heavens are unreachable

## ✦ The Lore

- Five constellations drawn as star maps, with their myths (Orion, Cassiopeia,
  Ursa Major, Scorpius, Cygnus)
- The Sages: from Babylonian scribes to Hypatia, Copernicus, and the modern armada
- A glossary of modern astronomy in plain words

## ✦ Theme

**Universal ancient astronomy** — lapis night, aged parchment, gold leaf, Greek-key
frames, a tiled star field, and an AI-painted celestial-map hero. Cinzel + EB Garamond.

## ✦ Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
```

## ✦ Tech

React 18 · Vite 5 · hand-rolled SVG atlas scenes · no UI framework ·
hash-based routing · live data via public APIs.

## ✦ Structure

```
public/hero.jpg            AI-painted celestial map
src/
  api/news.js              Spaceflight News + NASA APOD (cached)
  data/cosmos.js           the 25-body zoom tree with facts & discoveries
  data/lore.js             constellations, sages, glossary, almanac
  data/fallbackNews.js     archival scroll
  components/
    Atlas.jsx + AtlasScene.jsx   the zoomable celestial map
    HomePage, Chronicles, Lore, NavBar, Footer
  index.css                the ancient theme
```

> *The sky is not a ceiling. It is an index.*
