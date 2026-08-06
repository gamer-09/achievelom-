# ☉ COSMOGRAPHIA — The Ancient Atlas of the Heavens

A **real, interactive map of the sky** — not a diagram. Thousands of actual stars, the
true positions of the planets for today, every object in Messier's catalogue, the
meteor showers of the year — all plotted from real astronomical data, dressed in the
aesthetics of the ancients.

## ✦ The Map (the whole point)

Open **The Map** and you get a real celestial chart:

- **9,027 real stars** from the HYG catalogue (J2000 positions, magnitudes, distances,
  spectral classes) — every naked-eye star, coloured by true spectral type
- **All 110 Messier objects** — galaxies, nebulae, clusters with real coordinates,
  types, magnitudes and distances
- **The eight planets + Sun + Moon in their true positions for today**, computed with
  Keplerian ephemerides (Meeus), accurate to ~0.1–0.5°
- **11 major meteor showers** with their real radiants, peaks, ZHR and parent comets
- **88 constellations** with real stick-figure lines (d3-celestial data)
- The Milky Way band, the ecliptic, equatorial grid — drawn from real geometry

**Interact with everything**: drag to pan, scroll to zoom into any constellation, hover
for a name, click any light for its full dossier (magnitude, distance, spectral type,
coordinates, mythology). Search jumps you straight to any object — *Sirius, M31,
Europa, Perseids, Orion…*

A second map, **☉ The Solar System**, shows the planets in their true arrangement for
today (angles true, radii scaled so all eight worlds fit), with clickable worlds.

## ✦ Everything else

- **The Chronicles** — live space news (Spaceflight News API) + NASA's Picture of the Day
- **The Lore** — constellation myths, the sages, and a glossary
- **Almanac** of upcoming sky events on the home page

## ✦ Data (all real, all bundled — works offline)

| Data | Source | Notes |
| --- | --- | --- |
| Stars | HYG v4.1 (astronexus) | 9,027 stars, mag ≤ 6.5 + all named |
| Deep sky | Wikipedia: List of Messier objects | 110/110 objects |
| Constellation lines | d3-celestial (ofrohn) | 88 constellations |
| Planet/Sun/Moon | Meeus, *Astronomical Algorithms* | computed client-side for any date |
| Meteor showers | IMO/IAU radiant data | 11 major showers |

Regenerate the data with `python3 scripts/build_data.py` (needs network once).

## ✦ Run it

```bash
npm install
npm run dev
```

## ✦ Tech

React 18 · Vite 5 · hand-rolled pan/zoom SVG · no UI framework · hash routing ·
lazy-loaded map chunk (the star catalogue stays out of the initial bundle).

> *The sky is not a ceiling. It is an index.*
