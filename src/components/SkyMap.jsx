import { memo, useEffect, useMemo, useRef, useState } from 'react'
import starsJson from '../data/stars.json'
import messierJson from '../data/messier.json'
import constellationsJson from '../data/constellations.json'
import { SHOWERS } from '../data/showers.js'
import {
  allBodies, eclipticPath, milkyWayPath, formatRA, formatDec, todayUTC,
} from '../astro/ephemeris.js'

// ── constants ────────────────────────────────────────────────
const W = 360 // world width  (RA 0..360)
const H = 180 // world height (Dec -90..90)
const FACTOR = 2.8 // css px per world unit at zoom k=1 (approx)
const MIN_K = 0.8
const MAX_K = 320

// star glyph: screen px per magnitude bucket
const MAG_PX = [
  { max: 1.2, px: 3.6 },
  { max: 2.2, px: 3.0 },
  { max: 3.2, px: 2.5 },
  { max: 4.2, px: 2.0 },
  { max: 5.2, px: 1.6 },
  { max: 9.9, px: 1.2 },
]
const SPECT_COLOR = {
  O: '#a8b6ff', B: '#9db4ff', A: '#d6e4f7', F: '#f2ecd8',
  G: '#f7dc9e', K: '#e8b078', M: '#d98a7a',
}
const SPEC_DEFAULT = '#e9e4da'

const BODY_STYLE = {
  sun: { color: '#f2cf5b', r: 5.0, name: 'The Sun' },
  moon: { color: '#cfd4da', r: 3.4, name: 'The Moon' },
  mercury: { color: '#b9a89a', r: 2.4, name: 'Mercury' },
  venus: { color: '#e8c96a', r: 3.2, name: 'Venus' },
  mars: { color: '#d96a4a', r: 2.8, name: 'Mars' },
  jupiter: { color: '#e0b060', r: 4.0, name: 'Jupiter' },
  saturn: { color: '#e8d5a3', r: 3.6, name: 'Saturn' },
  uranus: { color: '#9fc8e0', r: 3.0, name: 'Uranus' },
  neptune: { color: '#5a8fc9', r: 3.0, name: 'Neptune' },
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

function splitSeg(pts) {
  // split a polyline at the RA wrap (gap > 180°)
  const out = []
  let cur = [pts[0]]
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i]
    if (Math.abs(p[0] - pts[i - 1][0]) > 180) {
      out.push(cur)
      cur = []
    }
    cur.push(p)
  }
  if (cur.length) out.push(cur)
  return out
}

function buildStarPaths(stars, k, showAll) {
  const colorKeys = Object.keys(SPECT_COLOR)
  const buckets = Array.from({ length: colorKeys.length + 1 }, () => Array.from({ length: 6 }, () => []))
  const w = 2 / (FACTOR * k)
  for (const s of stars) {
    const [hip, ra, dec, mag, dist, spect, proper, bayer] = s
    if (!showAll && mag > 6.5) continue
    let b = 5
    for (let i = 0; i < MAG_PX.length; i++) {
      if (mag <= MAG_PX[i].max) { b = i; break }
    }
    let ck = colorKeys.length
    const ch = spect ? spect[0].toUpperCase() : ''
    const idx = colorKeys.indexOf(ch)
    if (idx >= 0) ck = idx
    buckets[ck][b].push(`M${ra.toFixed(2)} ${dec.toFixed(2)}l${w} 0`)
  }
  const paths = []
  for (let c = 0; c <= colorKeys.length; c++) {
    for (let b = 0; b < 6; b++) {
      const arr = buckets[c][b]
      if (!arr.length) continue
      paths.push({
        color: c < colorKeys.length ? SPECT_COLOR[colorKeys[c]] : SPEC_DEFAULT,
        px: MAG_PX[b].px,
        d: arr.join(''),
      })
    }
  }
  return paths
}

// ── the static map layers (memoized: only zoom/toggles rebuild them) ──
const MapLayers = memo(function MapLayers(props) {
  const {
    k, stars, starPaths, messier, constellations, conSegs, bodyList,
    bandD, eclD, showLines, showNames, showDeep, showGrid, showAll,
  } = props
  const sw = (px) => px / (FACTOR * k)
  const fs = (px) => px / (FACTOR * k)

  const gridLines = []
  if (showGrid) {
    for (let ra = 0; ra < 360; ra += 15) gridLines.push({ type: 'ra', x: ra })
    for (let dec = -75; dec <= 75; dec += 15) gridLines.push({ type: 'dec', y: dec })
  }

  const showConstLabels = showNames && k >= 1.6
  const showStarLabels = showNames && k >= 1.4
  const showMessierLabels = showNames && k >= 2.4
  const starLabelVisible = (mag) =>
    mag <= 1.0 || (mag <= 2.5 && k >= 1.4) || (mag <= 3.5 && k >= 2.2) || (mag <= 4.2 && k >= 4)

  return (
    <g>
      {/* milky way band */}
      <path d={bandD} fill="rgba(200,220,240,0.055)" stroke="none" />
      <path d={eclD} fill="none" stroke="rgba(242,207,91,0.4)" strokeWidth={sw(1)} strokeDasharray={`${sw(2)} ${sw(2)}`} />

      {/* grid */}
      {showGrid && (
        <g>
          {gridLines.map((g, i) =>
            g.type === 'ra' ? (
              <line key={i} x1={g.x} y1={-90} x2={g.x} y2={90} stroke="rgba(212,175,55,0.12)" strokeWidth={sw(0.7)} />
            ) : (
              <line key={i} x1={0} y1={g.y} x2={360} y2={g.y} stroke="rgba(212,175,55,0.12)" strokeWidth={sw(0.7)} />
            )
          )}
          {Array.from({ length: 24 }, (_, h) => (
            <text key={'h' + h} x={h * 15} y={-86} textAnchor="middle" fontSize={fs(8)} fill="rgba(179,162,124,0.7)" style={{ fontFamily: `'Cinzel', serif` }}>
              {h}h
            </text>
          ))}
        </g>
      )}

      {/* constellation lines */}
      {showLines && (
        <g fill="none" stroke="rgba(212,175,55,0.4)" strokeWidth={sw(1)}>
          {conSegs.map((c, i) => (
            <polyline key={i} points={c.seg.map((p) => `${p[0]},${p[1]}`).join(' ')} strokeLinejoin="round" />
          ))}
        </g>
      )}

      {/* stars */}
      <g>
        {starPaths.map((p, i) => (
          <path key={i} d={p.d} stroke={p.color} strokeWidth={sw(p.px)} strokeLinecap="round" opacity={0.95} />
        ))}
      </g>

      {/* star labels */}
      {showStarLabels && (
        <g>
          {stars.map((s) => {
            if (!s[6] || !starLabelVisible(s[3])) return null
            return (
              <text
                key={s[0] || (s[1] + s[2] + s[6])}
                x={s[1]} y={s[2] - sw(s[3] <= 1 ? 6 : 8)}
                textAnchor="middle"
                fontSize={fs(s[3] <= 1 ? 9.5 : 8)}
                fill="rgba(233,220,192,0.85)"
                style={{ fontFamily: `'EB Garamond', serif`, fontStyle: 'italic', pointerEvents: 'none' }}
              >
                {s[6]}
              </text>
            )
          })}
        </g>
      )}

      {/* constellation names */}
      {showConstLabels && (
        <g>
          {constellations.map((c) => (
            <text key={c.id} x={c.center[0]} y={c.center[1]} textAnchor="middle" fontSize={fs(10)} fill="rgba(212,175,55,0.65)" style={{ fontFamily: `'Cinzel', serif`, letterSpacing: '0.12em' }}>
              {c.name.toUpperCase()}
            </text>
          ))}
        </g>
      )}

      {/* deep sky */}
      {showDeep && (
        <g>
          {messier.map((m) => {
            const isGal = /galax/i.test(m.type)
            const isNeb = /nebula|remnant|region/i.test(m.type)
            const col = isGal ? '#d4af37' : isNeb ? '#7fb3c9' : '#d8a0c0'
            const r = sw(2.5)
            return (
              <g key={m.m}>
                <circle cx={m.ra} cy={m.dec} r={r} fill="none" stroke={col} strokeWidth={sw(1.1)} opacity={0.9} />
                <circle cx={m.ra} cy={m.dec} r={sw(0.7)} fill={col} opacity={0.8} />
                {showMessierLabels && (
                  <text x={m.ra} y={m.dec - r - sw(2)} textAnchor="middle" fontSize={fs(7.5)} fill={col} style={{ fontFamily: `'EB Garamond', serif`, pointerEvents: 'none' }}>
                    M{m.m}{m.name ? ' · ' + m.name : ''}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      )}

      {/* planets, sun, moon */}
      <g>
        {bodyList.map((b) => (
          <g key={b.id}>
            <circle cx={b.ra} cy={b.dec} r={sw(b.r)} fill={b.color} opacity={0.95} stroke="rgba(10,18,32,0.9)" strokeWidth={sw(1.2)} />
            {b.id === 'sun' && <circle cx={b.ra} cy={b.dec} r={sw(b.r + 1.6)} fill="none" stroke="rgba(242,207,91,0.5)" strokeWidth={sw(0.8)} />}
            {b.id === 'saturn' && (
              <ellipse cx={b.ra} cy={b.dec} rx={sw(b.r + 2.2)} ry={sw(b.r * 0.55)} fill="none" stroke="rgba(232,213,163,0.6)" strokeWidth={sw(0.8)} transform={`rotate(-20 ${b.ra} ${b.dec})`} />
            )}
            {showNames && (
              <text x={b.ra} y={b.dec - sw(b.r + 3)} textAnchor="middle" fontSize={fs(9)} fill={b.color} style={{ fontFamily: `'Cinzel', serif`, pointerEvents: 'none' }}>
                {b.name}
              </text>
            )}
          </g>
        ))}
      </g>

      {/* meteor showers */}
      <g>
        {SHOWERS.map((s) => (
          <g key={s.id}>
            <line x1={s.ra - sw(4)} y1={s.dec - sw(3)} x2={s.ra + sw(2)} y2={s.dec + sw(1.5)} stroke="rgba(255,217,160,0.9)" strokeWidth={sw(1.4)} />
            <circle cx={s.ra + sw(2)} cy={s.dec + sw(1.5)} r={sw(0.9)} fill="#ffd9a0" />
            {showNames && (
              <text x={s.ra + sw(5)} y={s.dec + sw(3)} fontSize={fs(8)} fill="rgba(255,217,160,0.85)" style={{ fontFamily: `'EB Garamond', serif`, fontStyle: 'italic', pointerEvents: 'none' }}>
                {s.name}
              </text>
            )}
          </g>
        ))}
      </g>
    </g>
  )
})

// ── main component ───────────────────────────────────────────
export default function SkyMap({ initialQuery = '' }) {
  const [dateStr] = useState(() => todayUTC())
  const bodies = useMemo(() => allBodies(dateStr), [dateStr])
  const bodyList = useMemo(
    () =>
      Object.entries(bodies)
        .map(([id, p]) => ({ id, ...p, ...BODY_STYLE[id] }))
        .filter((b) => b.name),
    [bodies]
  )

  const stars = useMemo(() => starsJson.stars, [])
  const messier = useMemo(() => messierJson.objects, [])
  const constellations = useMemo(() => constellationsJson.constellations, [])

  const [k, setK] = useState(1)
  const [center, setCenter] = useState({ x: 180, y: 20 })
  const [showAll, setShowAll] = useState(false)
  const [showLines, setShowLines] = useState(true)
  const [showNames, setShowNames] = useState(true)
  const [showDeep, setShowDeep] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [selected, setSelected] = useState(null)
  const [tooltip, setTooltip] = useState(null)
  const [tipPos, setTipPos] = useState({ x: 50, y: 20 })
  const [query, setQuery] = useState(initialQuery || '')

  const svgRef = useRef(null)
  const dragRef = useRef(null)
  const tooltipFrame = useRef(null)
  useEffect(() => () => tooltipFrame.current && cancelAnimationFrame(tooltipFrame.current), [])

  const starPaths = useMemo(() => buildStarPaths(stars, k, showAll), [stars, k, showAll])

  const bandD = useMemo(() => {
    const pts = milkyWayPath()
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.ra.toFixed(2)} ${p.dec.toFixed(2)}`).join('') + 'Z'
  }, [])
  const eclD = useMemo(() => {
    const pts = eclipticPath()
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.ra.toFixed(2)} ${p.dec.toFixed(2)}`).join('')
  }, [])

  const conSegs = useMemo(() => {
    const out = []
    for (const c of constellations) {
      for (const seg of c.lines) {
        for (const part of splitSeg(seg)) {
          out.push({ cid: c.id, name: c.name, desig: c.desig, seg: part })
        }
      }
    }
    return out
  }, [constellations])

  // ── fly to ─────────────────────────────────────────────────
  const flyTo = (ra, dec, targetK) => {
    setK(clamp(targetK, MIN_K, MAX_K))
    setCenter({ x: ra, y: clamp(dec, -84, 84) })
  }

  // ── search index ───────────────────────────────────────────
  const searchIndex = useMemo(() => {
    const idx = []
    for (const s of stars) {
      const [hip, ra, dec, mag, dist, spect, proper, bayer] = s
      if (proper) idx.push({ label: proper, sub: `${bayer || 'star'} · mag ${mag}`, type: 'star', obj: { kind: 'star', star: s, ra, dec } })
    }
    for (const m of messier) {
      idx.push({
        label: `M${m.m}${m.name ? ' — ' + m.name : ''}`,
        sub: `${m.type} · ${m.con}`,
        type: 'messier',
        obj: { kind: 'messier', messier: m, ra: m.ra, dec: m.dec },
      })
      if (m.ngc) idx.push({ label: `NGC ${m.ngc}`, sub: `M${m.m} · ${m.type}`, type: 'messier', obj: { kind: 'messier', messier: m, ra: m.ra, dec: m.dec } })
    }
    for (const b of bodyList) idx.push({ label: b.name, sub: 'wanderer of the court', type: 'body', obj: { kind: 'body', body: b, ra: b.ra, dec: b.dec } })
    for (const s of SHOWERS) idx.push({ label: s.name, sub: `${s.peak} · ZHR ${s.zhr}`, type: 'shower', obj: { kind: 'shower', shower: s, ra: s.ra, dec: s.dec } })
    for (const c of constellations) idx.push({ label: c.name, sub: c.desig, type: 'constellation', obj: { kind: 'constellation', c, ra: c.center[0], dec: c.center[1] } })
    return idx
  }, [stars, messier, bodyList, constellations])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return searchIndex.filter((e) => e.label.toLowerCase().includes(q)).slice(0, 10)
  }, [query, searchIndex])

  const pickResult = (r) => {
    flyTo(r.obj.ra, r.obj.dec, r.type === 'star' ? 24 : r.type === 'messier' ? 10 : r.type === 'body' ? 6 : 8)
    setSelected(r.obj)
    setQuery('')
  }

  // auto-fly when arriving with ?q=
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

  // ── geometry ───────────────────────────────────────────────
  const screenToWorld = (clientX, clientY) => {
    const el = svgRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    const ux = ((clientX - rect.left) / rect.width) * W
    const uy = ((clientY - rect.top) / rect.height) * H
    return { x: (ux - W / 2) / k + center.x, y: (uy - H / 2) / k + center.y }
  }

  // native wheel (non-passive so we can preventDefault)
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const ux = ((e.clientX - rect.left) / rect.width) * W
      const uy = ((e.clientY - rect.top) / rect.height) * H
      const world = { x: (ux - W / 2) / k + center.x, y: (uy - H / 2) / k + center.y }
      const nk = clamp(k * Math.exp(-e.deltaY * 0.0018), MIN_K, MAX_K)
      setK(nk)
      setCenter({ x: world.x - (ux - W / 2) / nk, y: clamp(world.y - (uy - H / 2) / nk, -90, 90) })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [k, center])

  // ── pointer ────────────────────────────────────────────────
  const onPointerDown = (e) => {
    dragRef.current = { x: e.clientX, y: e.clientY, cx: center.x, cy: center.y, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    const d = dragRef.current
    if (d) {
      const dx = e.clientX - d.x
      const dy = e.clientY - d.y
      if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true
      setCenter({ x: d.cx - dx / (FACTOR * k), y: clamp(d.cy + dy / (FACTOR * k), -90, 90) })
    } else {
      if (tooltipFrame.current) return
      tooltipFrame.current = requestAnimationFrame(() => {
        tooltipFrame.current = null
        const el = svgRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const w = screenToWorld(e.clientX, e.clientY)
        if (!w) return
        const t = nearest(w.x, w.y)
        setTipPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 })
        setTooltip(t)
      })
    }
  }
  const onPointerUp = (e) => {
    const d = dragRef.current
    dragRef.current = null
    if (d && !d.moved) {
      const w = screenToWorld(e.clientX, e.clientY)
      if (w) {
        const t = nearest(w.x, w.y, true)
        setSelected(t)
        if (t) setTooltip(t)
      }
    }
  }

  const nearest = (x, y, click = false) => {
    const thresh = (click ? 9 : 7) / (FACTOR * k)
    let best = null
    let bestD = thresh
    for (const s of stars) {
      const dx = s[1] - x
      const dy = s[2] - y
      const d2 = dx * dx + dy * dy
      if (d2 < bestD * bestD) {
        bestD = Math.sqrt(d2)
        best = { kind: 'star', star: s, ra: s[1], dec: s[2] }
      }
    }
    if (best) return best
    for (const m of messier) {
      const d = Math.hypot(m.ra - x, m.dec - y)
      if (d < bestD) { bestD = d; best = { kind: 'messier', messier: m, ra: m.ra, dec: m.dec } }
    }
    for (const b of bodyList) {
      const d = Math.hypot(b.ra - x, b.dec - y)
      if (d < bestD) { bestD = d; best = { kind: 'body', body: b, ra: b.ra, dec: b.dec } }
    }
    for (const s of SHOWERS) {
      const d = Math.hypot(s.ra - x, s.dec - y)
      if (d < bestD) { bestD = d; best = { kind: 'shower', shower: s, ra: s.ra, dec: s.dec } }
    }
    return bestD < thresh ? best : null
  }

  const transform = `translate(${W / 2 - center.x * k} ${H / 2 - center.y * k}) scale(${k})`
  const sw2 = (px) => px / (FACTOR * k)
  const selWorld = selected ? { ra: selected.ra ?? selected.c?.center?.[0], dec: selected.dec ?? selected.c?.center?.[1] } : null

  return (
    <div className="skywrap">
      <div className="maptoolbar">
        <div className="map-search">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Seek a star, world or wonder… e.g. Sirius, M31, Europa"
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

        <div className="map-zoom">
          <button title="Zoom in" onClick={() => setK(clamp(k * 1.6, MIN_K, MAX_K))}>+</button>
          <button title="Zoom out" onClick={() => setK(clamp(k / 1.6, MIN_K, MAX_K))}>−</button>
          <button title="Reset view" onClick={() => { setK(1); setCenter({ x: 180, y: 20 }); setSelected(null) }}>⌂</button>
        </div>

        <div className="map-toggles">
          <label className="mt"><input type="checkbox" checked={showLines} onChange={(e) => setShowLines(e.target.checked)} /> lines</label>
          <label className="mt"><input type="checkbox" checked={showNames} onChange={(e) => setShowNames(e.target.checked)} /> names</label>
          <label className="mt"><input type="checkbox" checked={showDeep} onChange={(e) => setShowDeep(e.target.checked)} /> deep sky</label>
          <label className="mt"><input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} /> grid</label>
          <label className="mt" title="also draw the very faint"><input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} /> faint</label>
        </div>

        <div className="map-date">⚷ {dateStr}</div>
      </div>

      <div className="map-canvas">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="sky-svg"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={() => { dragRef.current = null; setTooltip(null) }}
        >
          <g transform={transform}>
            <MapLayers
              k={k}
              stars={stars}
              starPaths={starPaths}
              messier={messier}
              constellations={constellations}
              conSegs={conSegs}
              bodyList={bodyList}
              bandD={bandD}
              eclD={eclD}
              showLines={showLines}
              showNames={showNames}
              showDeep={showDeep}
              showGrid={showGrid}
            />
            {selWorld && (
              <circle
                cx={selWorld.ra}
                cy={selWorld.dec}
                r={sw2(10)}
                fill="none"
                stroke="#f2cf5b"
                strokeWidth={sw2(1.6)}
                className="sel-ring"
                style={{ pointerEvents: 'none' }}
              />
            )}
          </g>
        </svg>

        {tooltip && !selected && (
          <div className="map-tooltip" style={{ left: `${tipPos.x}%`, top: `${tipPos.y}%` }}>
            {tooltip.kind === 'star' && <><b>{tooltip.star[6] || tooltip.star[7] || 'Star'}</b> <span>mag {tooltip.star[3]}</span></>}
            {tooltip.kind === 'messier' && <><b>M{tooltip.messier.m}</b> <span>{tooltip.messier.name || tooltip.messier.type}</span></>}
            {tooltip.kind === 'body' && <><b>{tooltip.body.name}</b> <span>planet</span></>}
            {tooltip.kind === 'shower' && <><b>{tooltip.shower.name}</b> <span>meteor shower</span></>}
          </div>
        )}
      </div>

      <InfoPanel selected={selected} onClose={() => setSelected(null)} />
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
  if (!selected) {
    return (
      <aside className="panel map-info empty-info">
        <p className="eyebrow">The chart</p>
        <h3>Touch a light to read it</h3>
        <p>
          This is a real map of the heavens for <b>{todayUTC()}</b>: {starsJson.meta.count.toLocaleString()} stars from the
          HYG catalogue, all {messierJson.meta.count} objects of Messier's list, the wanderers in their true
          computed positions, and the major meteor showers. Drag to wander, scroll to descend, click to learn.
        </p>
      </aside>
    )
  }

  const k = selected.kind
  if (k === 'star') {
    const s = selected.star
    return (
      <aside className="panel map-info">
        <button className="info-close" onClick={onClose}>✕</button>
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
  if (k === 'messier') {
    const m = selected.messier
    return (
      <aside className="panel map-info">
        <button className="info-close" onClick={onClose}>✕</button>
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
  if (k === 'body') {
    const b = selected.body
    return (
      <aside className="panel map-info">
        <button className="info-close" onClick={onClose}>✕</button>
        <p className="eyebrow">A wanderer of the court · {todayUTC()}</p>
        <h2>{b.name}</h2>
        <dl className="info-list">
          <InfoRow k="Right ascension" v={formatRA(b.ra)} />
          <InfoRow k="Declination" v={formatDec(b.dec)} />
          <InfoRow k="Distance" v={`${b.distAU.toFixed(2)} AU · ${b.lightMin.toFixed(1)} light-minutes`} />
          <InfoRow k="Magnitude" v={b.mag.toFixed(1)} />
          <InfoRow k="Ecliptic longitude" v={`${b.helioLon.toFixed(1)}°`} />
        </dl>
        <p className="info-note">{BODY_FACTS[b.id] || ''} Position computed for today by the Celestial Calculator.</p>
      </aside>
    )
  }
  if (k === 'shower') {
    const s = selected.shower
    return (
      <aside className="panel map-info">
        <button className="info-close" onClick={onClose}>✕</button>
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
