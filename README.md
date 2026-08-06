# ☉ COSMOGRAPHIA — The Ancient Atlas of the Heavens

A **real, interactive map of the sky** — not a diagram. Thousands of actual stars, the
true positions of the planets for today, every object in Messier's catalogue, black
holes, pulsars, quasars, supernova remnants, galaxies, exoplanet systems, dwarf
planets, comets, and humanity's spacecraft — all plotted from real astronomical data,
dressed in the aesthetics of the ancients.

## ✦ The Map (the whole point)

Open **The Map** and you get a real celestial chart:

- **9,027 real stars** from the HYG catalogue (J2000 positions, magnitudes, distances,
  spectral classes) — every naked-eye star, coloured by true spectral type
- **All 110 Messier objects** — galaxies, nebulae, clusters with real coordinates
- **The eight planets + Sun + Moon in their true positions for today**, computed with
  Keplerian ephemerides (Meeus), accurate to ~0.1–0.5°
- **11 major meteor showers** with their real radiants, peaks, ZHR and parent comets
- **88 constellations** with real stick-figure lines (d3-celestial data)
- The Milky Way band, the ecliptic, equatorial grid — drawn from real geometry

**The deeper catalog** (toggle layers on/off, all clickable with full dossiers):

| Layer | Contents |
| --- | --- |
| Black Holes | Sgr A\*, M87\*, Cygnus X-1, V404 Cyg, TON 618, GW150914… |
| Pulsars | Crab, Vela, Geminga, the first pulsar PSR B1919+21… |
| Quasars | 3C 273, J0313-1806 (most distant), S5 0014+81… |
| Supernovae | Cas A, SN 1987A, Kepler, Tycho, the Cygnus Loop… |
| Galaxies | LMC, SMC, Centaurus A, NGC 4565, IC 1101 (largest known)… |
| Dwarf Galaxies | Sagittarius Dwarf, Canis Major, Fornax… |
| Exoplanet Systems | Proxima b, TRAPPIST-1, 51 Peg, Kepler-452b, K2-18b… |
| Galaxy Clusters | Virgo, Coma, Perseus, Hercules, Fornax |
| Special Objects | the CMB dipole, the Pillars of Creation, GW170817's galaxy… |
| Small Bodies | Pluto, Eris, Haumea, Makemake, Sedna + 7 asteroids + 5 comets (Halley, Encke…), **true positions computed today from JPL orbital elements** |

**Interact with everything**: drag to pan, scroll to zoom into any constellation, hover
for a name, click any light for its full dossier (magnitude, distance, spectral type,
mass, coordinates, story). Search jumps you straight to anything — *Sirius, Sgr A\*,
M31, Europa, Pluto, Halley, TON 618, Perseids…*

A second map, **☉ The Solar System**, shows the planets, dwarf planets, asteroids and
comets in their true arrangement for today (angles true, radii scaled so all worlds
fit) — plus **humanity's 10 probes in their real positions** from JPL Horizons: Voyager 1
at 171 AU in interstellar space, Parker skimming the Sun, JWST at L2…

## ✦ The Cosmos (real 3D maps — no diagrams)

A third chart, **✧ The Cosmos**, climbs the great chain of scale with real data:

- **The Milky Way (3D)** — 5,187 real stars with true 3D positions (HYG x/y/z in
  parsecs), all **156 globular clusters** from the Harris catalog in real positions,
  the Sun, and the supermassive black hole Sagittarius A* at the galactic center.
  Drag to turn the galaxy, scroll to dive into our stellar neighbourhood.
- **The Local Group (3D)** — ~35 real galaxies to true distances (Karachentsev &
  extragalactic literature): the Milky Way, Andromeda, Triangulum, the Magellanic
  Clouds, M81/M82, Centaurus A, Maffei 1 and more, clickable with their stories.
- **The Observable Universe** — **4,824 real galaxies from the 2dF Galaxy Redshift
  Survey** plotted at their measured distances (redshift → distance, H₀=70), forming
  the true cosmic web, out to the cosmic microwave background at 13.8 billion light-years.
- **The Multiverse** — honestly labeled *theory*: the ideas of eternal inflation,
  the string landscape, quantum many-worlds, and the mathematical universe, with the
  note that other bubbles lie forever beyond our horizon.

Every view is interactive: drag to rotate, scroll to zoom, click any light for its
dossier.

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
| Dwarf planets, asteroids, comets | NASA JPL Small-Body Database | 22 objects, computed client-side |
| Spacecraft | NASA JPL Horizons | 10 probes, snapshot 2026-08-06 |
| Meteor showers | IMO/IAU radiant data | 11 major showers |
| Exotic objects | curated from public literature | 58 objects, real J2000 coordinates |

Regenerate the JPL data with `python3 scripts/build_data.py` (needs network once).

## ✦ Run it

```bash
npm install
npm run dev
```

## ✦ Tech

React 18 · Vite 5 · hand-rolled pan/zoom SVG · no UI framework · hash routing ·
lazy-loaded map chunk (the star catalogue stays out of the initial bundle).

> *The sky is not a ceiling. It is an index.*

