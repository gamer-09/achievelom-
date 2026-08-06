import { useEffect, useMemo, useRef, useState } from 'react'
import Cosmos3D from './Cosmos3D.jsx'
import starsJson from '../data/stars.json'
import messierJson from '../data/messier.json'
import constellationsJson from '../data/constellations.json'
import smallbodiesJson from '../data/smallbodies.json'
import { SHOWERS } from '../data/showers.js'
import { COSMIC, SPECIAL_LAYERS, flattenCosmic } from '../data/cosmicObjects.js'
import {
  allBodies, eclipticPath, milkyWayPath, formatRA, formatDec, todayUTC, smallBodyPosition,
} from '../astro/ephemeris.js'

const D2R = Math.PI / 180

// RA/Dec (degrees) -> point on a sphere of radius r (x toward RA 0h, z toward north pole)
const sphere = (ra, dec, r = 1) => {
  const a = ra * D2R
  const d = dec * D2R
  return {
    x: r * Math.cos(d) * Math.cos(a),
    y: r * Math.cos(d) * Math.sin(a),
    z: r * Math.sin(d),
  }
}

const SPECT_COLOR = {
  O: '#a8b6ff', B: '#9db4ff', A: '#d6e4f7', F: '#f2ecd8',
  G: '#f7dc9e', K: '#e8b078', M: '#d98a7a',
}
const SPEC_DEFAULT = '#e9e4da'

const BODY_STYLE = {
  sun: { color: '#f2cf5b', r: 5.2, name: 'The Sun' },
  moon: { color: '#cfd4da', r: 3.4, name: 'The Moon' },
  mercury: { color: '#b9a89a', r: 2.4, name: 'Mercury' },
  venus: { color: '#e8c96a', r: 3.2, name: 'Venus' },
  mars: { color: '#d96a4a', r: 2.8, name: 'Mars' },
  jupiter: { color: '#e0b060', r: 4.0, name: 'Jupiter' },
  saturn: { color: '#e8d5a3', r: 3.6, name: 'Saturn' },
  uranus: { color: '#9fc8e0', r: 3.0, name: 'Uranus' },
  neptune: { color: '#5a8fc9', r: 3.0, name: 'Neptune' },
}

const SB_FACTS = {
  Ceres: ['1 Ceres', 'The first asteroid found (1801) — now classed a dwarf planet, 940 km across, the largest of the main-belt worlds.'],
  Vesta: ['4 Vesta', 'The brightest asteroid — 525 km wide, with a giant impact basin at its south pole; NASA\'s Dawn orbited it 2011–2012.'],
  Pallas: ['2 Pallas', 'The second asteroid ever found (1802) — an odd, tilted orbit and possibly the remnant of a disrupted protoplanet.'],
  Hygiea: ['10 Hygiea', 'The fourth-largest asteroid — the largest that has never been visited by a spacecraft.'],
  Juno: ['3 Juno', 'The third asteroid found (1804) — one of the largest, heavily cratered, in the inner main belt.'],
  Psyche: ['16 Psyche', 'A metal world — likely the exposed core of a shattered planet; NASA\'s Psyche mission launched 2023 to visit it.'],
  Davida: ['511 Davida', 'One of the largest main-belt asteroids — a dark C-type, 300+ km across.'],
  Interamnia: ['704 Interamnia', 'One of the biggest main-belt asteroids, discovered 1910 from Collurania, Italy.'],
  Pluto: ['134340 Pluto', 'The dwarf planet king of the Kuiper belt — 2,377 km, discovered 1930 by Clyde Tombaugh, reclassified 2006. Five moons.'],
  Eris: ['136199 Eris', 'The dwarf planet whose discovery (2005) forced the reclassification of Pluto — 2,326 km, the most massive known dwarf planet.'],
  Haumea: ['136108 Haumea', 'An egg-shaped dwarf planet spinning so fast it is stretched — with a ring and two moons, discovered 2004.'],
  Makemake: ['136472 Makemake', 'A bright Kuiper belt dwarf planet (2005) — reddish, with one small moon discovered by Hubble.'],
  Sedna: ['90377 Sedna', 'A distant world (2003) whose huge eccentric orbit hints at a hidden ninth planet — currently near its closest approach.'],
  Quaoar: ['50000 Quaoar', 'A Kuiper belt world (2002) with a ring far beyond where rings should exist — discovered 2023.'],
  Orcus: ['90482 Orcus', 'A "counter-Pluto" in the Kuiper belt (2004) — similar size and orbit to Pluto, mirrored across the Sun.'],
  Gonggong: ['225088 Gonggong', 'A red dwarf planet candidate (2007) with a large moon — named for the Chinese water god.'],
  Salacia: ['120347 Salacia', 'A large classical Kuiper belt object (2004) — roughly half Pluto\'s size, with its own moon.'],
  '1P': ['1P/Halley', 'The most famous comet — returns every ~76 years. Last seen 1986, next perihelion 2061. Its dust feeds two meteor showers.'],
  '2P': ['2P/Encke', 'The shortest-period bright comet — a 3.3-year orbit; its debris creates the Taurid fireballs.'],
  '12P': ['12P/Pons-Brooks', 'The "devil comet" — a 71-year visitor with horns of gas; last passed Earth in 2024.'],
  '109P': ['109P/Swift-Tuttle', 'The parent of the Perseid meteors — a 133-year orbit, next return 2126.'],
  '8P': ['8P/Tuttle', 'A 13.6-year comet — the parent of the Ursid meteor shower.'],
}

const LAYER_DEFAULTS = Object.fromEntries(SPECIAL_LAYERS.map((l) => [l.key, true]))
LAYER_DEFAULTS.smallbodies = true

const starSize = (mag) => {
  if (mag <= 1.2) return 2.6
  if (mag <= 2.5) return 2.2
  if (mag <= 4.0) return 1.8
  if (mag <= 5.5) return 1.4
  return 1.0
}

export default function SkyMap({ initialQuery = '' }) {
  const [dateStr] = useState(() => todayUTC())
  const bodies = useMemo(() => allBodies(dateStr), [dateStr])
  const bodyList = useMemo(
    () => Object.entries(bodies).map(([id, p]) => ({ id, ...p, ...BODY_STYLE[id] })).filter((b) => b.name),
    [bodies]
  )

  const stars = useMemo(() => starsJson.stars, [])
  const messier = useMemo(() => messierJson.objects, [])
  const constellations = useMemo(() => constellationsJson.constellations, [])
  const cosmic = useMemo(() => COSMIC, [])
  const allCosmic = useMemo(() => flattenCosmic(), [])

  const smalls = useMemo(() => {
    return Object.entries(smallbodiesJson).map(([key, el]) => {
      const pos = smallBodyPosition(el, dateStr)
      const [short, fact] = SB_FACTS[key] || [el.name.split(' ').slice(-1)[0] || key, '']
      return {
        key, name: el.name, short, kind: el.kind, class: el.class, fact, period: el.period,
        ra: pos.ra, dec: pos.dec, distAU: pos.distAU, r: pos.helioR,
        helioLon: pos.helioLon, helioLat: pos.helioLat,
      }
    })
  }, [dateStr])

  const [showAll, setShowAll] = useState(false)
  const [showLines, setShowLines] = useState(true)
  const [showNames, setShowNames] = useState(true)
  const [showDeep, setShowDeep] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [layers, setLayers] = useState(LAYER_DEFAULTS)
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState(initialQuery || '')

  const viewerRef = useRef(null)

  // ── objects on the celestial sphere ────────────────────────
  const objects = useMemo(() => {
    const list = []
    // stars: radius varies subtly with magnitude for parallax depth
    for (const s of stars) {
      const [hip, ra, dec, mag, dist, spect, proper, bayer] = s
      if (!showAll && mag > 6.5) continue
      const rr = 1 - 0.035 * Math.min(1, Math.max(0, mag / 7))
      const p = sphere(ra, dec, rr)
      const oid = 'star-' + (hip || `${ra}_${dec}_${mag}`)
      list.push({
        id: oid, oid, ...p,
        r: starSize(mag), color: SPECT_COLOR[spect ? spect[0].toUpperCase() : ''] || SPEC_DEFAULT,
        kind: 'dot', focusK: 7, noPick: false,
        info: { kind: 'star', star: s, name: proper || bayer || `Star HIP ${hip || '?'}`, mag, dist: s[4], spect },
      })
    }
    // the Milky Way band (decorative dots along the galactic plane)
    for (const pt of milkyWayPath(3)) {
      const p = sphere(pt.ra, pt.dec, 1)
      list.push({ id: 'mw-' + p.x.toFixed(2) + '-' + p.y.toFixed(2), ...p, r: 0.9, color: 'rgba(200,220,240,0.4)', kind: 'dot', noPick: true })
    }
    // Messier objects
    for (const m of messier) {
      const isGal = /galax/i.test(m.type)
      const isNeb = /nebula|remnant|region/i.test(m.type)
      const col = isGal ? '#d4af37' : isNeb ? '#7fb3c9' : '#d8a0c0'
      const p = sphere(m.ra, m.dec, 1.05)
      list.push({
        id: 'm' + m.m, oid: 'm' + m.m, ...p,
        r: 2.6, color: col, kind: 'glyph', shape: 'circle', focusK: 7, labelK: 2.6,
        label: `M${m.m}${m.name ? ' · ' + m.name : ''}`,
        info: { kind: 'messier', messier: m, name: `M${m.m}${m.name ? ' — ' + m.name : ''}` },
      })
    }
    // planets, sun, moon (float slightly above the stars)
    for (const b of bodyList) {
      const p = sphere(b.ra, b.dec, 1.07)
      list.push({
        id: 'body-' + b.id, oid: 'body-' + b.id, ...p,
        r: b.r, color: b.color, kind: 'glyph', shape: 'circle', focusK: 7, labelK: 1.2,
        label: b.name,
        info: { kind: 'body', body: b, name: b.name },
      })
    }
    // meteor shower radiants
    for (const s of SHOWERS) {
      const p = sphere(s.ra, s.dec, 1.04)
      list.push({
        id: 'shower-' + s.id, oid: 'shower-' + s.id, ...p,
        r: 2.0, color: '#ffd9a0', kind: 'glyph', shape: 'cross', focusK: 7, labelK: 2.2,
        label: s.name, info: { kind: 'shower', shower: s, name: s.name },
      })
    }
    // small bodies (dwarf planets, asteroids, comets)
    if (layers.smallbodies) {
      for (const s of smalls) {
        const col = s.kind === 'comet' ? '#9fe3ff' : s.kind === 'dwarf' ? '#e0d5b0' : '#c9b98a'
        const p = sphere(s.ra, s.dec, 1.03)
        list.push({
          id: 'small-' + s.key, oid: 'small-' + s.key, ...p,
          r: s.kind === 'dwarf' ? 2.4 : s.kind === 'comet' ? 2.0 : 1.6,
          color: col, kind: 'glyph', shape: 'circle', focusK: 7, labelK: 3.0,
          label: s.short, info: { kind: 'small', s, name: s.name },
        })
      }
    }
    // cosmic objects (black holes, pulsars, quasars, etc.)
    for (const layer of SPECIAL_LAYERS) {
      if (!layers[layer.key]) continue
      for (const it of (cosmic[layer.key] || [])) {
        const p = sphere(it.ra, it.dec, 1.02)
        const shape = layer.key === 'blackholes' ? 'ring' : layer.key === 'pulsars' || layer.key === 'quasars' ? 'cross' : 'circle'
        list.push({
          id: layer.key + '-' + it.id, oid: layer.key + '-' + it.id, ...p,
          r: 2.2, color: layer.color, kind: 'glyph', shape, focusK: 7, labelK: 2.8,
          label: it.name, info: { kind: 'cosmic', it, name: it.name },
        })
      }
    }
    return list
  }, [stars, messier, bodyList, smalls, allCosmic, cosmic, layers, showAll])

  // ── 3D lines: constellations, equator, ecliptic ────────────
  const lines = useMemo(() => {
    const arr = []
    if (showLines) {
      for (const c of constellations) {
        for (const seg of c.lines) {
          arr.push({
            id: 'con-' + c.id + '-' + seg[0][0] + seg[0][1],
            pts: seg.map(([ra, dec]) => {
              const p = sphere(ra, dec, 1)
              return [p.x, p.y, p.z]
            }),
            color: 'rgba(212,175,55,0.5)', width: 1, opacity: 0.55, maxK: 7,
          })
        }
      }
    }
    if (showGrid) {
      // celestial equator
      const eq = []
      for (let i = 0; i <= 72; i++) {
        const a = (i / 72) * 2 * Math.PI
        eq.push([Math.cos(a), Math.sin(a), 0])
      }
      arr.push({ id: 'equator', pts: eq, color: 'rgba(155,184,217,0.4)', width: 1, opacity: 0.5, maxK: 7 })
      // ecliptic (tilted 23.4°)
      const ecl = eclipticPath(5).map((p) => {
        const s = sphere(p.ra, p.dec, 1.01)
        return [s.x, s.y, s.z]
      })
      arr.push({ id: 'ecliptic', pts: ecl, color: 'rgba(242,207,91,0.5)', width: 1, opacity: 0.5, maxK: 7 })
    }
    return arr
  }, [constellations, showLines, showGrid])

  // ── search ─────────────────────────────────────────────────
  const searchIndex = useMemo(() => {
    const idx = []
    for (const s of stars) {
      const [hip, ra, dec, mag, dist, spect, proper, bayer] = s
      if (proper) idx.push({ label: proper, sub: `${bayer || 'star'} · mag ${mag}`, oid: 'star-' + (hip || `${ra}_${dec}_${mag}`) })
    }
    for (const m of messier) {
      idx.push({ label: `M${m.m}${m.name ? ' — ' + m.name : ''}`, sub: `${m.type} · ${m.con}`, oid: 'm' + m.m })
      if (m.ngc) idx.push({ label: `NGC ${m.ngc}`, sub: `M${m.m} · ${m.type}`, oid: 'm' + m.m })
    }
    for (const b of bodyList) idx.push({ label: b.name, sub: 'wanderer of the court', oid: 'body-' + b.id })
    for (const s of SHOWERS) idx.push({ label: s.name, sub: `${s.peak} · ZHR ${s.zhr}`, oid: 'shower-' + s.id })
    for (const c of constellations) idx.push({ label: c.name, sub: c.desig, oid: null })
    for (const s of smalls) idx.push({ label: s.name, sub: s.kind === 'comet' ? 'comet · computed position' : s.kind === 'dwarf' ? 'dwarf planet' : 'asteroid', oid: 'small-' + s.key })
    for (const it of allCosmic) idx.push({ label: it.name, sub: it.type, oid: (it.cat || 'cosmic') + '-' + it.id })
    return idx
  }, [stars, messier, bodyList, constellations, smalls, allCosmic])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return searchIndex.filter((e) => e.label.toLowerCase().includes(q)).slice(0, 10)
  }, [query, searchIndex])

  const pickResult = (r) => {
    const obj = objects.find((o) => o.oid && o.oid === r.oid)
    if (obj) {
      viewerRef.current?.focusObject(obj)
      setSelected(obj)
    } else if (r.oid === null) {
      // constellation — just zoom a bit and note it; find nearest constellation glyph? none.
      viewerRef.current?.reset()
    }
    setQuery('')
  }

  useEffect(() => {
    if (initialQuery) setQuery(initialQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (!initialQuery) return
    const q = initialQuery.trim().toLowerCase()
    if (!q) return
    const hit = searchIndex.find((e) => e.label.toLowerCase().includes(q))
    if (hit) pickResult(hit)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchIndex])

  const toggleLayer = (key) => setLayers((l) => ({ ...l, [key]: !l[key] }))

  return (
    <div className="skywrap">
      <div className="maptoolbar">
        <div className="map-search">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Seek a star, black hole, world or wonder… Sirius, Sgr A*, M31, Pluto, Halley, TON 618"
            aria-label="Search the sky"
          />
          {results.length > 0 && (
            <div className="map-results">
              {results.map((r, i) => (
                <button key={i} className="map-result" onClick={() => pickResult(r)}>
                  <span className="mr-label">{r.label}</span>
                  <span className="mr-sub">{r.sub}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="map-toggles">
          <label className="mt"><input type="checkbox" checked={showLines} onChange={(e) => setShowLines(e.target.checked)} /> lines</label>
          <label className="mt"><input type="checkbox" checked={showNames} onChange={(e) => setShowNames(e.target.checked)} /> names</label>
          <label className="mt"><input type="checkbox" checked={showDeep} onChange={(e) => setShowDeep(e.target.checked)} /> Messier</label>
          <label className="mt"><input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} /> equator</label>
          <label className="mt" title="also draw the very faint"><input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} /> faint</label>
        </div>

        <div className="map-date">⚷ {dateStr}</div>
      </div>

      <div className="maptoolbar layer-bar">
        <span className="layer-lbl">The deeper catalog:</span>
        <label className="mt"><input type="checkbox" checked={layers.smallbodies} onChange={() => toggleLayer('smallbodies')} /> small bodies</label>
        {SPECIAL_LAYERS.map((l) => (
          <label key={l.key} className="mt" style={{ color: layers[l.key] ? l.color : undefined }}>
            <input type="checkbox" checked={layers[l.key]} onChange={() => toggleLayer(l.key)} /> {l.label}
          </label>
        ))}
      </div>

      <Cosmos3D
        ref={viewerRef}
        objects={objects}
        lines={lines}
        range={2.4}
        unit="the celestial sphere · 1 unit = the sphere's radius"
        view={{ rotY: -45, rotX: 28, k: 1.6 }}
        onSelect={setSelected}
        selected={selected}
        hint="The celestial sphere in 3D — every star, world, black hole and wonder plotted on the real sphere of the sky (RA/Dec → 3D). Turn the sky to find constellations, click any light to fly to it."
      />

      <InfoPanel selected={selected} onClose={() => setSelected(null)} showDeep={showDeep} />
    </div>
  )
}

// ── info panel ───────────────────────────────────────────────
const BODY_FACTS = {
  sun: 'The Giver of Light — a G2V yellow dwarf at the heart of our court.',
  moon: 'Our constant companion, 384,400 km away, drifting 3.8 cm farther each year.',
  mercury: 'Swift Hermes — a scorched iron world with ice in its shadowed craters.',
  venus: 'The Morning Star — a runaway greenhouse furnace under acid clouds.',
  mars: 'The red wanderer — home to Olympus Mons and rovers named for the curious.',
  jupiter: 'The king — a storm-lord with 95 moons and a red spot wider than Earth.',
  saturn: 'The jewel — rings of ice, and oceans hidden on its moon Titan.',
  uranus: 'The sky itself — a cyan giant rolling on its side.',
  neptune: 'The deep blue — supersonic winds and a moon that orbits backwards.',
}

function InfoPanel({ selected, onClose }) {
  if (!selected || !selected.info) {
    return (
      <aside className="panel map-info empty-info">
        <p className="eyebrow">The chart</p>
        <h3>Touch a light to read it</h3>
        <p>
          The sky as a 3D sphere for <b>{todayUTC()}</b>: {starsJson.meta.count.toLocaleString()} stars,
          all {messierJson.meta.count} objects of Messier, the wanderers in true positions, 11 meteor showers,
          black holes, pulsars, quasars, supernova remnants, galaxies, exoplanet systems, dwarf planets and
          comets — every one on its true place on the sphere. Turn the sky, zoom, click to learn.
        </p>
      </aside>
    )
  }

  const i = selected.info
  const close = <button className="info-close" onClick={onClose}>✕</button>

  if (i.kind === 'star') {
    const s = i.star
    return (
      <aside className="panel map-info">
        {close}
        <p className="eyebrow">A fixed light · HIP {s[0] || '—'}</p>
        <h2>{s[6] || s[7] || 'Unnamed star'}</h2>
        {s[7] && <div className="ledger-ancient">{s[7]}</div>}
        <dl className="info-list">
          <InfoRow k="Magnitude" v={s[3].toFixed(2)} />
          <InfoRow k="Distance" v={s[4] ? `${s[4].toLocaleString()} light-years` : 'uncertain'} />
          <InfoRow k="Spectral type" v={s[5] || '—'} />
          <InfoRow k="Right ascension" v={formatRA(s[1])} />
          <InfoRow k="Declination" v={formatDec(s[2])} />
        </dl>
        <p className="info-note">Position from the HYG catalogue (epoch J2000) — the real sky, drawn true.</p>
      </aside>
    )
  }
  if (i.kind === 'messier') {
    const m = i.messier
    return (
      <aside className="panel map-info">
        {close}
        <p className="eyebrow">A wonder of the deep · {m.con}</p>
        <h2>M{m.m}{m.name ? ` — ${m.name}` : ''}</h2>
        {m.ngc && <div className="ledger-ancient">NGC {m.ngc}</div>}
        <dl className="info-list">
          <InfoRow k="Type" v={m.type} />
          <InfoRow k="Magnitude" v={m.mag != null ? m.mag.toFixed(1) : '—'} />
          <InfoRow k="Distance" v={m.dist ? `${m.dist.toLocaleString()} thousand light-years` : '—'} />
          <InfoRow k="Right ascension" v={formatRA(m.ra)} />
          <InfoRow k="Declination" v={formatDec(m.dec)} />
        </dl>
        <p className="info-note">From Messier's catalogue of 1781 — the real coordinates of a real wonder.</p>
      </aside>
    )
  }
  if (i.kind === 'body') {
    const b = i.body
    return (
      <aside className="panel map-info">
        {close}
        <p className="eyebrow">A wanderer of the court · {todayUTC()}</p>
        <h2>{b.name}</h2>
        <dl className="info-list">
          <InfoRow k="Right ascension" v={formatRA(b.ra)} />
          <InfoRow k="Declination" v={formatDec(b.dec)} />
          <InfoRow k="Distance" v={`${b.distAU.toFixed(2)} AU · ${b.lightMin.toFixed(1)} light-minutes`} />
          <InfoRow k="Magnitude" v={b.mag != null ? b.mag.toFixed(1) : '—'} />
          <InfoRow k="Ecliptic longitude" v={`${b.helioLon.toFixed(1)}°`} />
        </dl>
        <p className="info-note">{BODY_FACTS[b.id] || ''} Position computed for today by the Celestial Calculator.</p>
      </aside>
    )
  }
  if (i.kind === 'shower') {
    const s = i.shower
    return (
      <aside className="panel map-info">
        {close}
        <p className="eyebrow">A falling star · radiant</p>
        <h2>{s.name}</h2>
        <dl className="info-list">
          <InfoRow k="Peak (annual)" v={s.peak} />
          <InfoRow k="Zenithal rate" v={`${s.zhr} meteors/hour`} />
          <InfoRow k="Parent body" v={s.parent} />
          <InfoRow k="Radiant RA" v={formatRA(s.ra)} />
          <InfoRow k="Radiant Dec" v={formatDec(s.dec)} />
        </dl>
        <p className="info-note">{s.note} Radiant from the IMO meteor data.</p>
      </aside>
    )
  }
  if (i.kind === 'small') {
    const s = i.s
    return (
      <aside className="panel map-info">
        {close}
        <p className="eyebrow">
          {s.kind === 'comet' ? 'A wandering star · comet' : s.kind === 'dwarf' ? 'A dwarf world' : 'A minor world · asteroid'} · {todayUTC()}
        </p>
        <h2>{s.name}</h2>
        <dl className="info-list">
          <InfoRow k="Kind" v={s.kind === 'comet' ? 'Comet' : s.kind === 'dwarf' ? 'Dwarf planet' : 'Asteroid'} />
          <InfoRow k="Orbit class" v={s.class || '—'} />
          <InfoRow k="Distance from Sun" v={`${s.r.toFixed(2)} AU`} />
          <InfoRow k="Distance from Earth" v={`${s.distAU.toFixed(2)} AU`} />
          <InfoRow k="Right ascension" v={formatRA(s.ra)} />
          <InfoRow k="Declination" v={formatDec(s.dec)} />
        </dl>
        <p className="info-note">{s.fact} Position computed today from JPL orbital elements.</p>
      </aside>
    )
  }
  if (i.kind === 'cosmic') {
    const it = i.it
    return (
      <aside className="panel map-info">
        {close}
        <p className="eyebrow">{it.type}</p>
        <h2>{it.name}</h2>
        {it.year && <div className="ledger-ancient">{it.year}</div>}
        <dl className="info-list">
          {it.mass && <InfoRow k="Mass" v={it.mass} />}
          {it.dist && <InfoRow k="Distance" v={it.dist} />}
          {it.period && <InfoRow k="Spin" v={it.period} />}
          {it.redshift && <InfoRow k="Redshift" v={it.redshift} />}
          <InfoRow k="Right ascension" v={formatRA(it.ra)} />
          <InfoRow k="Declination" v={formatDec(it.dec)} />
        </dl>
        <p className="info-note">{it.fact}</p>
      </aside>
    )
  }
  return null
}

function InfoRow({ k, v }) {
  return (
    <div className="info-row">
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  )
}
