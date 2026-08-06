import { useEffect, useMemo, useRef, useState } from 'react'
import { allBodies, todayUTC } from '../astro/ephemeris.js'

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

const SIZE = 1000 // svg viewBox units
const C = SIZE / 2
const SCALE = 120 // world units per AU^0.55
const R = (a) => Math.pow(a, 0.55) * SCALE
const planetPx = (a) => Math.max(4, Math.min(16, a * 4))

export default function SystemMap() {
  const [dateStr] = useState(() => todayUTC())
  const bodies = useMemo(() => allBodies(dateStr), [dateStr])
  const [selected, setSelected] = useState(null)
  const [k, setK] = useState(1)
  const svgRef = useRef(null)
  const dragRef = useRef(null)

  const positions = useMemo(() => {
    const map = {}
    for (const p of PLANETS) {
      const b = bodies[p.id]
      const ang = b.helioLon * P
      map[p.id] = { ...p, ...b, x: C + R(p.a) * Math.cos(ang), y: C + R(p.a) * Math.sin(ang) }
    }
    return map
  }, [bodies])

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


  // native wheel (non-passive)
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
  const onPointerDown = (e) => {
    dragRef.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    // (pan disabled for simplicity; clicks + zoom only)
  }
  const onPointerUp = (e) => {
    dragRef.current = null
    const rect = svgRef.current.getBoundingClientRect()
    const ux = ((e.clientX - rect.left) / rect.width) * SIZE / k + (C - C / k)
    const uy = ((e.clientY - rect.top) / rect.height) * SIZE / k + (C - C / k)
    // find planet near point
    let best = null
    let bestD = 30 / k
    for (const p of Object.values(positions)) {
      const d = Math.hypot(p.x - ux, p.y - uy)
      if (d < bestD) { bestD = d; best = p }
    }
    if (best) setSelected(best)
  }

  const info = selected ? positions[selected.id] : null

  return (
    <div className="systemwrap">
      <div className="maptoolbar">
        <div className="map-search" style={{ flex: 'none' }}>
          <span className="map-date">☉ True positions for {dateStr} · radii drawn to ∜AU scale so all eight worlds fit; angles are true</span>
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
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <defs>
            <radialGradient id="sysbg" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#0e1b2c" />
              <stop offset="100%" stopColor="#060b14" />
            </radialGradient>
          </defs>
          <g transform={`translate(${C - C * k} ${C - C * k}) scale(${k})`}>
            <rect x={-2000} y={-2000} width={6000} height={6000} fill="url(#sysbg)" />

            {/* orbit circles */}
            {PLANETS.map((p) => (
              <circle key={p.id} cx={C} cy={C} r={R(p.a)} fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth={0.8} strokeDasharray="6 6" />
            ))}

            {/* belts */}
            <path d={belt.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('') + 'Z'} fill="none" stroke="rgba(194,68,14,0.45)" strokeWidth={3} />
            <text x={C + R(2.55)} y={C - 14} fontSize={16} fill="rgba(194,68,14,0.8)" style={{ fontFamily: `'EB Garamond', serif`, fontStyle: 'italic' }}>the asteroid belt</text>
            <path d={kuiper.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('') + 'Z'} fill="none" stroke="rgba(155,184,217,0.25)" strokeWidth={2.5} />
            <text x={C} y={70} textAnchor="middle" fontSize={16} fill="rgba(155,184,217,0.6)" style={{ fontFamily: `'EB Garamond', serif`, fontStyle: 'italic' }}>the Kuiper belt</text>

            {/* the sun */}
            <circle cx={C} cy={C} r={26} fill="url(#sysSun)" />
            <circle cx={C} cy={C} r={30} fill="none" stroke="rgba(242,207,91,0.6)" strokeWidth={1.5} />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * Math.PI) / 6
              return <line key={i} x1={C + 30 * Math.cos(a)} y1={C + 30 * Math.sin(a)} x2={C + 40 * Math.cos(a)} y2={C + 40 * Math.sin(a)} stroke="rgba(242,207,91,0.55)" strokeWidth={2} />
            })}
            <text x={C} y={C - 52} textAnchor="middle" fontSize={22} fill="#f2cf5b" style={{ fontFamily: `'Cinzel', serif` }}>SOL</text>

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

          <radialGradient id="sysSun" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#fff3c9" />
            <stop offset="40%" stopColor="#f2cf5b" />
            <stop offset="100%" stopColor="#c1440e" />
          </radialGradient>
        </svg>
      </div>

      <aside className="panel map-info">
        {!info ? (
          <>
            <p className="eyebrow">The wandering court</p>
            <h3>Choose a world</h3>
            <p>
              The eight planets in their <b>true positions for today</b> ({dateStr}), computed with
              Keplerian elements. Click a world for its current right ascension, declination,
              distance and magnitude — and what the ancients made of it.
            </p>
          </>
        ) : (
          <>
            <button className="info-close" onClick={() => setSelected(null)}>✕</button>
            <p className="eyebrow">A wanderer · {dateStr}</p>
            <h2>{info.name} <span className="ledger-ancient">{info.glyph}</span></h2>
            <dl className="info-list">
              <InfoRow k="Distance from Sun" v={`${info.a} AU`} />
              <InfoRow k="Distance from Earth" v={`${info.distAU.toFixed(2)} AU · ${info.lightMin.toFixed(1)} light-min`} />
              <InfoRow k="Right ascension" v={fmtRA(info.ra)} />
              <InfoRow k="Declination" v={fmtDec(info.dec)} />
              <InfoRow k="Magnitude" v={info.mag.toFixed(1)} />
              <InfoRow k="Heliocentric longitude" v={`${info.helioLon.toFixed(1)}°`} />
            </dl>
            <p className="info-note">{NOTE[info.id]}</p>
          </>
        )}
      </aside>
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
