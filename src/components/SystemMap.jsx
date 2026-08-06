import { useMemo, useRef, useState } from 'react'
import Cosmos3D from './Cosmos3D.jsx'
import { allBodies, smallBodyHelio, todayUTC, planetOrbitPoints, smallBodyOrbitPoints } from '../astro/ephemeris.js'
import smallbodiesJson from '../data/smallbodies.json'
import probesJson from '../data/probes.json'

const D2R = Math.PI / 180

const PLANETS = [
  { id: 'mercury', name: 'Mercury', glyph: '☿', color: '#b9a89a', a: 0.387 },
  { id: 'venus', name: 'Venus', glyph: '♀', color: '#e8c96a', a: 0.723 },
  { id: 'earth', name: 'Earth', glyph: '⊕', color: '#6fb3d9', a: 1.0 },
  { id: 'mars', name: 'Mars', glyph: '♂', color: '#d96a4a', a: 1.524 },
  { id: 'jupiter', name: 'Jupiter', glyph: '♃', color: '#e0b060', a: 5.203 },
  { id: 'saturn', name: 'Saturn', glyph: '♄', color: '#e8d5a3', a: 9.537 },
  { id: 'uranus', name: 'Uranus', glyph: '⛢', color: '#9fc8e0', a: 19.19 },
  { id: 'neptune', name: 'Neptune', glyph: '♆', color: '#5a8fc9', a: 30.07 },
]

// small bodies to draw (by SBDB key)
const SMALL_KEYS = {
  Ceres: { color: '#b9a89a', r: 6 }, Vesta: { color: '#c9b98a', r: 5.5 }, Pallas: { color: '#d8c9a3', r: 5 },
  Hygiea: { color: '#a9b8c9', r: 5 }, Juno: { color: '#d9b45b', r: 4.5 }, Psyche: { color: '#cfd4da', r: 5 },
  Davida: { color: '#8a97a8', r: 4.5 }, Interamnia: { color: '#9aa0a8', r: 4.5 },
  Pluto: { color: '#d8c9a3', r: 9 }, Eris: { color: '#e8e4da', r: 9 }, Haumea: { color: '#d9b45b', r: 8 },
  Makemake: { color: '#c1440e', r: 8 }, Sedna: { color: '#d96a4a', r: 8 }, Quaoar: { color: '#b34a2a', r: 7.5 },
  Orcus: { color: '#8fb3c9', r: 7.5 }, Gonggong: { color: '#c96a5a', r: 7.5 }, Salacia: { color: '#9fc8e0', r: 7 },
  '1P': { color: '#9fe3ff', r: 9, comet: true }, '2P': { color: '#9fe3ff', r: 6, comet: true },
  '12P': { color: '#9fe3ff', r: 8, comet: true }, '109P': { color: '#9fe3ff', r: 9, comet: true },
  '8P': { color: '#9fe3ff', r: 7, comet: true },
}

const PROBE_COLORS = {
  'Voyager 1': '#7fe3c0', 'Voyager 2': '#7fe3c0', 'Pioneer 10': '#b58ff2', 'Pioneer 11': '#b58ff2',
  'New Horizons': '#8fe8c0', 'Parker Solar Probe': '#ff9e5e', 'James Webb Space Telescope': '#f2cf5b',
  'Juno': '#d4af37', 'Europa Clipper': '#9fc8e0', 'JUICE': '#9fc8e0',
}

const NOTE = {
  mercury: 'Swift Hermes — a scorched iron world with ice in its shadowed craters.',
  venus: 'The Morning and Evening Star — a runaway greenhouse furnace under acid clouds.',
  earth: 'Gaia, the blue marble — the only world we know that bears life. You are here.',
  mars: 'The red wanderer — Olympus Mons, Valles Marineris, and rovers named for the curious.',
  jupiter: 'The king of planets — 95 moons, a red spot wider than Earth, and a magnetic field that rules space.',
  saturn: 'The jewel of the heavens — rings of ice, and hidden oceans on Titan and Enceladus.',
  uranus: 'The sky itself — a cyan ice giant rolling on its side, 42 years of light, 42 of dark.',
  neptune: 'The deep blue — supersonic winds and a moon, Triton, that orbits backwards.',
}

const SMALL_NOTE = {
  '1P': 'Halley\'s Comet — the most famous of all, last seen 1986, next due 2061. Its dust feeds the Eta Aquariids and Orionids.',
  '2P': 'Encke\'s Comet — the shortest-period bright comet (3.3 years); source of the Taurid fireballs.',
  '12P': 'Pons-Brooks, the "devil comet" — a 71-year visitor with a horned coma, seen in 2024.',
  '109P': 'Swift-Tuttle — the 133-year comet whose debris becomes the Perseid meteor shower.',
  '8P': 'Tuttle — a 13.6-year comet, parent of the Ursid meteors.',
  Ceres: 'The first asteroid found (1801) and the largest — classed a dwarf planet, 940 km across.',
  Vesta: 'The brightest asteroid — NASA\'s Dawn orbited it in 2011–2012.',
  Pallas: 'The second asteroid discovered (1802) — an unusually tilted orbit.',
  Hygiea: 'The fourth-largest asteroid — the largest never visited by a spacecraft.',
  Juno: 'The third asteroid discovered (1804) — heavily cratered.',
  Psyche: 'A metal world — the exposed core of a shattered planet; NASA\'s Psyche mission is on its way.',
  Davida: 'One of the largest main-belt asteroids.',
  Interamnia: 'One of the biggest main-belt asteroids.',
  Pluto: 'King of the Kuiper belt — 2,377 km, five moons, reclassified a dwarf planet in 2006.',
  Eris: 'The dwarf planet whose discovery forced Pluto\'s reclassification — the most massive known dwarf.',
  Haumea: 'A fast-spinning, egg-shaped dwarf planet with a ring.',
  Makemake: 'A bright reddish dwarf planet of the Kuiper belt.',
  Sedna: 'A distant world whose extreme orbit hints at a hidden ninth planet.',
  Quaoar: 'A Kuiper world with a ring far beyond where rings should survive.',
  Orcus: 'A "counter-Pluto" — Pluto\'s mirror across the Sun.',
  Gonggong: 'A red dwarf-planet candidate with a large moon.',
  Salacia: 'A large classical Kuiper belt object.',
}

const eclCart = (lon, lat, r) => ({
  x: r * Math.cos(lat * D2R) * Math.cos(lon * D2R),
  y: r * Math.cos(lat * D2R) * Math.sin(lon * D2R),
  z: r * Math.sin(lat * D2R),
})

const QUICK_VIEWS = [
  { id: 'inner', label: 'Inner', k: 28 },
  { id: 'main', label: 'Main belt', k: 11 },
  { id: 'giants', label: 'Giants', k: 4 },
  { id: 'kuiper', label: 'Kuiper', k: 1.8 },
  { id: 'all', label: 'All', k: 1 },
]

export default function SystemMap() {
  const [dateStr] = useState(() => todayUTC())
  const bodies = useMemo(() => allBodies(dateStr), [dateStr])
  const [selected, setSelected] = useState(null)
  const viewerRef = useRef(null)

  // ── objects: true 3D heliocentric positions ───────────────
  const objects = useMemo(() => {
    const list = []

    // the Sun
    list.push({
      id: 'sun', oid: 'sun', x: 0, y: 0, z: 0,
      r: 8, color: '#f2cf5b', kind: 'glyph', shape: 'ring', labelK: 1.15,
      label: 'SOL',
      info: { kind: 'marker', name: 'The Sun', text: 'The Giver of Light — a G2V yellow dwarf at the heart of the court, holding all eight planets, the dwarf worlds, and every comet in its gravity.' },
    })

    // planets (true heliocentric position today)
    for (const p of PLANETS) {
      const b = bodies[p.id]
      const pos = eclCart(b.helioLon, b.helioLat || 0, b.helioR)
      const isEarth = p.id === 'earth'
      list.push({
        id: 'planet-' + p.id, oid: 'planet-' + p.id, ...pos,
        r: Math.max(4, Math.min(15, p.a * 4)),
        color: p.color, kind: 'glyph', shape: 'circle', labelK: 1.25,
        label: p.name,
        info: { kind: 'planet', p, b, isEarth, name: p.name },
      })
    }

    // dwarf planets, asteroids, comets (true positions from JPL elements)
    for (const [key, style] of Object.entries(SMALL_KEYS)) {
      const el = smallbodiesJson[key]
      if (!el) continue
      const h = smallBodyHelio(el, dateStr)
      const pos = eclCart(h.lon, h.lat, h.r)
      list.push({
        id: 'small-' + key, oid: 'small-' + key, ...pos,
        r: style.r, color: style.color, kind: 'glyph', shape: 'circle', labelK: 2.4,
        label: key.includes('P') ? el.name.split('/')[0] + '/' + el.name.split('/')[1]?.split(' ')[0] : el.name.split(' ').slice(-1)[0],
        info: { kind: 'small', key, name: el.name, kind2: el.kind, class: el.class, r: h.r, lon: h.lon, lat: h.lat },
      })
    }

    // probes (true heliocentric ecliptic vectors from JPL Horizons)
    for (const pr of probesJson) {
      list.push({
        id: 'probe-' + pr.name, oid: 'probe-' + pr.name,
        x: pr.x, y: pr.y, z: pr.z,
        r: 5, color: PROBE_COLORS[pr.name] || '#d4af37', kind: 'glyph', shape: 'diamond', labelK: 1.9,
        label: pr.name,
        info: { kind: 'probe', pr, name: pr.name },
      })
    }

    // decorative belts (no pick)
    let seed = 7
    const rnd = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    for (let i = 0; i < 240; i++) {
      const r = 2.15 + rnd() * 1.25
      const a = rnd() * 2 * Math.PI
      const inc = (rnd() - 0.5) * 6 * D2R
      const p = eclCart(a / D2R, inc, r)
      list.push({ id: 'belt-' + i, ...p, r: 0.8, color: 'rgba(194,68,14,0.5)', kind: 'dot', noPick: true })
    }
    for (let i = 0; i < 300; i++) {
      const r = 34 + rnd() * 24
      const a = rnd() * 2 * Math.PI
      const inc = (rnd() - 0.5) * 12 * D2R
      const p = eclCart(a / D2R, inc, r)
      list.push({ id: 'kuiper-' + i, ...p, r: 1.0, color: 'rgba(155,184,217,0.35)', kind: 'dot', noPick: true })
    }
    return list
  }, [bodies, dateStr])

  // ── orbit rings (real Keplerian ellipses in 3D) ────────────
  const lines = useMemo(() => {
    const arr = []
    for (const p of PLANETS) {
      arr.push({
        id: 'orbit-' + p.id,
        pts: planetOrbitPoints(p.id, dateStr, 96),
        color: 'rgba(212,175,55,0.3)', width: 1, opacity: 0.5,
      })
    }
    for (const key of Object.keys(SMALL_KEYS)) {
      const el = smallbodiesJson[key]
      if (!el) continue
      arr.push({
        id: 'orbit-' + key,
        pts: smallBodyOrbitPoints(el, 96),
        color: 'rgba(155,184,217,0.22)', width: 0.8, opacity: 0.4,
      })
    }
    return arr
  }, [dateStr])

  const goQuick = (k) => {
    viewerRef.current?.focusPoint(0, 0, 0, k)
    setSelected(null)
  }

  return (
    <div className="systemwrap">
      <div className="maptoolbar">
        <div className="map-search" style={{ flex: 'none' }}>
          <span className="map-date">☉ True 3D positions for {dateStr} · true scale (AU)</span>
        </div>
        <div className="map-toggles" style={{ gap: 8 }}>
          {QUICK_VIEWS.map((v) => (
            <button key={v.id} className="chip gold" style={{ padding: '7px 12px', fontSize: '.66rem' }} onClick={() => goQuick(v.k)}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <Cosmos3D
        ref={viewerRef}
        objects={objects}
        lines={lines}
        range={200}
        unit="1 world unit = 1 AU · true scale"
        view={{ rotY: -30, rotX: 18, k: 2 }}
        onSelect={setSelected}
        selected={selected}
        hint="The Solar System in true 3D — planets, dwarf planets, asteroids and comets at their real computed positions for today, each with its real orbital ellipse (Kepler elements from JPL). The diamond markers are humanity's spacecraft: Voyager 1 is 171 AU out, in interstellar space. Use the quick-view buttons to fly between the inner worlds and the Kuiper belt."
      />

      <InfoPanel info={selected} dateStr={dateStr} onClose={() => setSelected(null)} />
    </div>
  )
}

function InfoPanel({ info, dateStr, onClose }) {
  if (!info || !info.info) {
    return (
      <aside className="panel map-info empty-info">
        <p className="eyebrow">The wandering court</p>
        <h3>Choose a world</h3>
        <p>
          The planets, dwarf planets, asteroids and comets in true positions for {dateStr},
          computed from JPL orbital elements — plus humanity's probes, from the Sun's corona
          (Parker) to interstellar space (Voyager 1, 171 AU). Click anything to fly to it.
        </p>
      </aside>
    )
  }
  const i = info.info
  const close = <button className="info-close" onClick={onClose}>✕</button>

  if (i.kind === 'planet') {
    const { p, b, isEarth } = i
    return (
      <aside className="panel map-info">
        {close}
        <p className="eyebrow">{isEarth ? 'The home world' : 'A wanderer'} · {dateStr}</p>
        <h2>{p.name} <span className="ledger-ancient">{p.glyph}</span></h2>
        <dl className="info-list">
          <InfoRow k="Distance from Sun" v={isEarth ? '1.00 AU (mean)' : `${p.a} AU`} />
          {!isEarth && <InfoRow k="Distance from Earth" v={`${b.distAU.toFixed(2)} AU · ${b.lightMin.toFixed(1)} light-min`} />}
          <InfoRow k="Right ascension" v={fmtRA(b.ra)} />
          <InfoRow k="Declination" v={fmtDec(b.dec)} />
          {!isEarth && <InfoRow k="Magnitude" v={b.mag != null ? b.mag.toFixed(1) : '—'} />}
          <InfoRow k="Heliocentric longitude" v={`${b.helioLon.toFixed(1)}°`} />
        </dl>
        <p className="info-note">{NOTE[p.id]}{isEarth ? ' You are standing on this world.' : ''}</p>
      </aside>
    )
  }
  if (i.kind === 'small') {
    return (
      <aside className="panel map-info">
        {close}
        <p className="eyebrow">{i.kind2 === 'comet' ? 'A wandering star · comet' : i.kind2 === 'dwarf' ? 'A dwarf world' : 'A minor world'} · {dateStr}</p>
        <h2>{i.name}</h2>
        <dl className="info-list">
          <InfoRow k="Kind" v={i.kind2 === 'comet' ? 'Comet' : i.kind2 === 'dwarf' ? 'Dwarf planet' : 'Asteroid'} />
          <InfoRow k="Orbit class" v={i.class || '—'} />
          <InfoRow k="Distance from Sun" v={`${i.r.toFixed(2)} AU`} />
          <InfoRow k="Ecliptic longitude" v={`${i.lon.toFixed(1)}°`} />
          <InfoRow k="Ecliptic latitude" v={`${i.lat.toFixed(1)}°`} />
        </dl>
        <p className="info-note">{SMALL_NOTE[i.key] || ''} Position computed for today from JPL orbital elements.</p>
      </aside>
    )
  }
  if (i.kind === 'probe') {
    const pr = i.pr
    return (
      <aside className="panel map-info">
        {close}
        <p className="eyebrow">A child of Earth · position {pr.epoch}</p>
        <h2>{pr.name}</h2>
        <dl className="info-list">
          <InfoRow k="Distance from Sun" v={`${pr.r.toFixed(2)} AU`} />
          <InfoRow k="Ecliptic longitude" v={`${pr.lon.toFixed(1)}°`} />
          <InfoRow k="Ecliptic latitude" v={`${pr.lat.toFixed(1)}°`} />
        </dl>
        <p className="info-note">{pr.note} Position from JPL Horizons.</p>
      </aside>
    )
  }
  if (i.kind === 'marker') {
    return (
      <aside className="panel map-info">
        {close}
        <p className="eyebrow">A landmark</p>
        <h2>{i.name}</h2>
        <p className="info-note" style={{ marginTop: 12, color: 'var(--parchment)', fontSize: '0.95rem' }}>{i.text}</p>
      </aside>
    )
  }
  return null
}

const fmtRA = (d) => {
  const h = d / 15
  const hh = Math.floor(h)
  const mm = Math.floor((h - hh) * 60)
  return `${String(hh).padStart(2, '0')}h ${String(mm).padStart(2, '0')}m`
}
const fmtDec = (d) => `${d < 0 ? '−' : '+'}${Math.abs(d).toFixed(1)}°`

function InfoRow({ k, v }) {
  return (
    <div className="info-row">
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  )
}
