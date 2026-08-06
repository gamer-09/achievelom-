import { useEffect, useMemo, useRef, useState } from 'react'
import { allBodies, smallBodyHelio, todayUTC } from '../astro/ephemeris.js'
import smallbodiesJson from '../data/smallbodies.json'
import probesJson from '../data/probes.json'

// ── helpers ──────────────────────────────────────────────────
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const P = Math.PI / 180

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

const SIZE = 1000
const C = SIZE / 2
const SCALE = 118
const R = (a) => Math.pow(Math.max(a, 0.01), 0.55) * SCALE
const planetPx = (a) => Math.max(4, Math.min(16, a * 4))

export default function SystemMap() {
  const [dateStr] = useState(() => todayUTC())
  const bodies = useMemo(() => allBodies(dateStr), [dateStr])
  const [selected, setSelected] = useState(null)
  const [k, setK] = useState(1)
  const svgRef = useRef(null)
  const dragRef = useRef(null)

  // planets
  const positions = useMemo(() => {
    const map = {}
    for (const p of PLANETS) {
      const b = bodies[p.id]
      const ang = b.helioLon * P
      map[p.id] = { ...p, ...b, x: C + R(p.a) * Math.cos(ang), y: C + R(p.a) * Math.sin(ang) }
    }
    return map
  }, [bodies])

  // small bodies (true heliocentric positions)
  const smalls = useMemo(() => {
    return Object.entries(SMALL_KEYS).map(([key, style]) => {
      const el = smallbodiesJson[key]
      if (!el) return null
      const h = smallBodyHelio(el, dateStr)
      const ang = h.lon * P
      return {
        key,
        name: el.name,
        style,
        kind: el.kind,
        class: el.class,
        period: el.period,
        r: h.r,
        lon: h.lon,
        lat: h.lat,
        x: C + R(h.r) * Math.cos(ang),
        y: C + R(h.r) * Math.sin(ang),
      }
    }).filter(Boolean)
  }, [dateStr])

  // probes (snapshot from JPL Horizons)
  const probes = useMemo(() => {
    return probesJson.map((p) => {
      const ang = p.lon * P
      return {
        ...p,
        x: C + R(p.r) * Math.cos(ang),
        y: C + R(p.r) * Math.sin(ang),
        color: PROBE_COLORS[p.name] || '#d4af37',
      }
    })
  }, [])

  const belt = useMemo(() => {
    const pts = []
    for (let a = 0; a <= 360; a += 2) {
      const r = R(2.55) + Math.sin(a * 7 * P) * 14
      pts.push([C + r * Math.cos(a * P), C + r * Math.sin(a * P)])
    }
    return pts
  }, [])
  const kuiper = useMemo(() => {
    const pts = []
    for (let a = 0; a <= 360; a += 3) {
      const r = R(42) + Math.sin(a * 5 * P) * 20
      pts.push([C + r * Math.cos(a * P), C + r * Math.sin(a * P)])
    }
    return pts
  }, [])

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      setK((prev) => clamp(prev * Math.exp(-e.deltaY * 0.0015), 0.6, 8))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const onPointerUp = (e) => {
    dragRef.current = null
    const rect = svgRef.current.getBoundingClientRect()
    const ux = ((e.clientX - rect.left) / rect.width) * SIZE / k + (C - C / k)
    const uy = ((e.clientY - rect.top) / rect.height) * SIZE / k + (C - C / k)
    let best = null
    let bestD = 34 / k
    for (const p of Object.values(positions)) {
      const d = Math.hypot(p.x - ux, p.y - uy)
      if (d < bestD) { bestD = d; best = { kind: 'planet', p } }
    }
    for (const s of smalls) {
      const d = Math.hypot(s.x - ux, s.y - uy)
      if (d < bestD) { bestD = d; best = { kind: 'small', s } }
    }
    for (const p of probes) {
      const d = Math.hypot(p.x - ux, p.y - uy)
      if (d < bestD) { bestD = d; best = { kind: 'probe', p } }
    }
    setSelected(best)
  }

  const info = selected

  return (
    <div className="systemwrap">
      <div className="maptoolbar">
        <div className="map-search" style={{ flex: 'none' }}>
          <span className="map-date">☉ True positions for {dateStr} · dwarf planets, asteroids & comets computed from JPL elements · spacecraft from JPL Horizons</span>
        </div>
        <div className="map-zoom">
          <button onClick={() => setK(clamp(k * 1.5, 0.6, 8))}>+</button>
          <button onClick={() => setK(clamp(k / 1.5, 0.6, 8))}>−</button>
          <button onClick={() => { setK(1); setSelected(null) }}>⌂</button>
        </div>
      </div>

      <div className="map-canvas system-canvas">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="sky-svg"
          onPointerUp={onPointerUp}
        >
          <defs>
            <radialGradient id="sysbg" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#0e1b2c" />
              <stop offset="100%" stopColor="#060b14" />
            </radialGradient>
            <radialGradient id="sysSun" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#fff3c9" />
              <stop offset="40%" stopColor="#f2cf5b" />
              <stop offset="100%" stopColor="#c1440e" />
            </radialGradient>
          </defs>
          <g transform={`translate(${C - C * k} ${C - C * k}) scale(${k})`}>
            <rect x={-2000} y={-2000} width={6000} height={6000} fill="url(#sysbg)" />

            {PLANETS.map((p) => (
              <circle key={p.id} cx={C} cy={C} r={R(p.a)} fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth={0.8} strokeDasharray="6 6" />
            ))}

            <path d={belt.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('') + 'Z'} fill="none" stroke="rgba(194,68,14,0.45)" strokeWidth={3} />
            <text x={C + R(2.55)} y={C - 14} fontSize={16} fill="rgba(194,68,14,0.8)" style={{ fontFamily: `'EB Garamond', serif`, fontStyle: 'italic' }}>the asteroid belt</text>
            <path d={kuiper.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('') + 'Z'} fill="none" stroke="rgba(155,184,217,0.25)" strokeWidth={2.5} />
            <text x={C} y={70} textAnchor="middle" fontSize={16} fill="rgba(155,184,217,0.6)" style={{ fontFamily: `'EB Garamond', serif`, fontStyle: 'italic' }}>the Kuiper belt</text>

            {/* sun */}
            <circle cx={C} cy={C} r={26} fill="url(#sysSun)" />
            <circle cx={C} cy={C} r={30} fill="none" stroke="rgba(242,207,91,0.6)" strokeWidth={1.5} />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * Math.PI) / 6
              return <line key={i} x1={C + 30 * Math.cos(a)} y1={C + 30 * Math.sin(a)} x2={C + 40 * Math.cos(a)} y2={C + 40 * Math.sin(a)} stroke="rgba(242,207,91,0.55)" strokeWidth={2} />
            })}
            <text x={C} y={C - 52} textAnchor="middle" fontSize={22} fill="#f2cf5b" style={{ fontFamily: `'Cinzel', serif` }}>SOL</text>

            {/* small bodies */}
            {smalls.map((s) => {
              const r = s.style.r
              return (
                <g key={s.key} className="sys-planet">
                  <circle cx={s.x} cy={s.y} r={r} fill={s.style.color} opacity={s.kind === 'comet' ? 0.9 : 0.75} stroke="rgba(10,18,32,0.9)" strokeWidth={1.2} />
                  {s.style.comet && (
                    <path d={`M${s.x} ${s.y} l${-r - 8} ${(r + 6) * 0.4}`} stroke="#9fe3ff" strokeWidth={1.4} fill="none" opacity={0.7} />
                  )}
                  <text x={s.x} y={s.y - r - 5} textAnchor="middle" fontSize={12} fill={s.style.color} style={{ fontFamily: `'EB Garamond', serif`, fontStyle: 'italic' }}>
                    {s.kind === 'comet' ? s.name.split('/')[0] + '/' + s.name.split('/')[1]?.split(' ')[0] : s.name.split(' ').slice(-1)[0]}
                  </text>
                </g>
              )
            })}

            {/* probes */}
            {probes.map((p) => (
              <g key={p.name} className="sys-planet">
                <polygon
                  points={`${p.x},${p.y - 9} ${p.x + 5},${p.y + 6} ${p.x},${p.y + 2.5} ${p.x - 5},${p.y + 6}`}
                  fill={p.color} stroke="rgba(10,18,32,0.9)" strokeWidth={1.2}
                />
                <text x={p.x} y={p.y + 24} textAnchor="middle" fontSize={11} fill={p.color} style={{ fontFamily: `'Cinzel', serif` }}>
                  {p.name}
                </text>
              </g>
            ))}

            {/* planets */}
            {PLANETS.map((p) => {
              const pos = positions[p.id]
              const r = planetPx(p.a)
              return (
                <g key={p.id} className="sys-planet">
                  <circle cx={pos.x} cy={pos.y} r={r} fill={p.color} stroke="rgba(10,18,32,0.9)" strokeWidth={1.5} />
                  {p.id === 'saturn' && (
                    <ellipse cx={pos.x} cy={pos.y} rx={r + 5} ry={(r + 5) * 0.45} fill="none" stroke="rgba(232,213,163,0.7)" strokeWidth={1.4} transform={`rotate(-18 ${pos.x} ${pos.y})`} />
                  )}
                  <text x={pos.x} y={pos.y - r - 8} textAnchor="middle" fontSize={15} fill={p.color} style={{ fontFamily: `'Cinzel', serif` }}>
                    {p.name}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      <InfoPanel info={info} dateStr={dateStr} onClose={() => setSelected(null)} />
    </div>
  )
}

const NOTE = {
  mercury: 'Swift Hermes — a scorched iron world with ice in its shadowed craters.',
  venus: 'The Morning and Evening Star — a runaway greenhouse furnace under acid clouds.',
  earth: 'Gaia, the blue marble — the only world we know that bears life.',
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

function InfoPanel({ info, dateStr, onClose }) {
  if (!info) {
    return (
      <aside className="panel map-info empty-info">
        <p className="eyebrow">The wandering court</p>
        <h3>Choose a world</h3>
        <p>
          The planets in true positions for {dateStr}, plus dwarf planets, asteroids and comets
          computed from JPL orbital elements, and humanity's probes — from the Sun's corona
          (Parker) to interstellar space (Voyager 1, 171 AU away). Click anything.
        </p>
      </aside>
    )
  }
  if (info.kind === 'planet') {
    const p = info.p
    const isEarth = p.id === 'earth'
    return (
      <aside className="panel map-info">
        <button className="info-close" onClick={onClose}>✕</button>
        <p className="eyebrow">{isEarth ? 'The home world' : 'A wanderer'} · {dateStr}</p>
        <h2>{p.name} <span className="ledger-ancient">{p.glyph}</span></h2>
        <dl className="info-list">
          <InfoRow k="Distance from Sun" v={isEarth ? '1.00 AU (mean)' : `${p.a} AU`} />
          {!isEarth && <InfoRow k="Distance from Earth" v={`${p.distAU.toFixed(2)} AU · ${p.lightMin.toFixed(1)} light-min`} />}
          <InfoRow k="Right ascension" v={fmtRA(p.ra)} />
          <InfoRow k="Declination" v={fmtDec(p.dec)} />
          {!isEarth && <InfoRow k="Magnitude" v={p.mag != null ? p.mag.toFixed(1) : '—'} />}
          <InfoRow k="Heliocentric longitude" v={`${p.helioLon.toFixed(1)}°`} />
        </dl>
        <p className="info-note">{NOTE[p.id]}{isEarth ? ' You are standing on this world.' : ''}</p>
      </aside>
    )
  }
  if (info.kind === 'small') {
    const s = info.s
    return (
      <aside className="panel map-info">
        <button className="info-close" onClick={onClose}>✕</button>
        <p className="eyebrow">{s.kind === 'comet' ? 'A wandering star · comet' : s.kind === 'dwarf' ? 'A dwarf world' : 'A minor world'} · {dateStr}</p>
        <h2>{s.name}</h2>
        <dl className="info-list">
          <InfoRow k="Kind" v={s.kind === 'comet' ? 'Comet' : s.kind === 'dwarf' ? 'Dwarf planet' : 'Asteroid'} />
          <InfoRow k="Distance from Sun" v={`${s.r.toFixed(2)} AU`} />
          <InfoRow k="Ecliptic longitude" v={`${s.lon.toFixed(1)}°`} />
          <InfoRow k="Ecliptic latitude" v={`${s.lat.toFixed(1)}°`} />
        </dl>
        <p className="info-note">{SMALL_NOTE[s.key] || ''} Position computed for today from JPL orbital elements.</p>
      </aside>
    )
  }
  if (info.kind === 'probe') {
    const p = info.p
    return (
      <aside className="panel map-info">
        <button className="info-close" onClick={onClose}>✕</button>
        <p className="eyebrow">A child of Earth · position {p.epoch}</p>
        <h2>{p.name}</h2>
        <dl className="info-list">
          <InfoRow k="Distance from Sun" v={`${p.r.toFixed(2)} AU`} />
          <InfoRow k="Ecliptic longitude" v={`${p.lon.toFixed(1)}°`} />
          <InfoRow k="Ecliptic latitude" v={`${p.lat.toFixed(1)}°`} />
        </dl>
        <p className="info-note">{p.note} Position from JPL Horizons (approximate — not to scale).</p>
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
const fmtDec = (d) => {
  const s = d < 0 ? '−' : '+'
  return `${s}${Math.abs(d).toFixed(1)}°`
}

function InfoRow({ k, v }) {
  return (
    <div className="info-row">
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  )
}
