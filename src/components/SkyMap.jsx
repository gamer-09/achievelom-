import { memo, useEffect, useMemo, useRef, useState } from 'react'
import starsJson from '../data/stars.json'
import messierJson from '../data/messier.json'
import constellationsJson from '../data/constellations.json'
import smallbodiesJson from '../data/smallbodies.json'
import { SHOWERS } from '../data/showers.js'
import { COSMIC, SPECIAL_LAYERS, flattenCosmic } from '../data/cosmicObjects.js'
import {
  allBodies, eclipticPath, milkyWayPath, formatRA, formatDec, todayUTC, smallBodyPosition,
} from '../astro/ephemeris.js'

// ── constants ────────────────────────────────────────────────
const W = 360
const H = 180
const FACTOR = 2.8
const MIN_K = 0.8
const MAX_K = 320

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

// facts for the moving small bodies
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

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

function splitSeg(pts) {
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
    const [hip, ra, dec, mag] = s
    if (!showAll && mag > 6.5) continue
    let b = 5
    for (let i = 0; i < MAG_PX.length; i++) {
      if (mag <= MAG_PX[i].max) { b = i; break }
    }
    let ck = colorKeys.length
    const ch = s[5] ? s[5][0].toUpperCase() : ''
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

// ── the static map layers ────────────────────────────────────
const MapLayers = memo(function MapLayers(props) {
  const {
    k, stars, starPaths, messier, constellations, conSegs, bodyList,
    bandD, eclD, showLines, showNames, showDeep, showGrid,
    cosmic, smalls, layers,
  } = props
  const sw = (px) => px / (FACTOR * k)
  const fs = (px) => px / (FACTOR * k)
  const L = layers

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

  const cosmicStyle = (cat) => {
    const s = SPECIAL_LAYERS.find((x) => x.key === cat)
    return s ? s.color : '#d4af37'
  }

  return (
    <g>
      <path d={bandD} fill="rgba(200,220,240,0.055)" stroke="none" />
      <path d={eclD} fill="none" stroke="rgba(242,207,91,0.4)" strokeWidth={sw(1)} strokeDasharray={`${sw(2)} ${sw(2)}`} />

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

      {showLines && (
        <g fill="none" stroke="rgba(212,175,55,0.4)" strokeWidth={sw(1)}>
          {conSegs.map((c, i) => (
            <polyline key={i} points={c.seg.map((p) => `${p[0]},${p[1]}`).join(' ')} strokeLinejoin="round" />
          ))}
        </g>
      )}

      <g>
        {starPaths.map((p, i) => (
          <path key={i} d={p.d} stroke={p.color} strokeWidth={sw(p.px)} strokeLinecap="round" opacity={0.95} />
        ))}
      </g>

      {showStarLabels && (
        <g>
          {stars.map((s) => {
            if (!s[6] || !starLabelVisible(s[3])) return null
            return (
              <text
                key={s[0] || s[1] + "_" + s[2] + "_" + s[6] + "_" + s[3]}
                x={s[1]} y={s[2] - sw(s[3] <= 1 ? 6 : 8)}
                textAnchor="middle" fontSize={fs(s[3] <= 1 ? 9.5 : 8)}
                fill="rgba(233,220,192,0.85)"
                style={{ fontFamily: `'EB Garamond', serif`, fontStyle: 'italic', pointerEvents: 'none' }}
              >
                {s[6]}
              </text>
            )
          })}
        </g>
      )}

      {showConstLabels && (
        <g>
          {constellations.map((c, ci) => (
            <text key={`${c.id}-${ci}`} x={c.center[0]} y={c.center[1]} textAnchor="middle" fontSize={fs(10)} fill="rgba(212,175,55,0.65)" style={{ fontFamily: `'Cinzel', serif`, letterSpacing: '0.12em' }}>
              {c.name.toUpperCase()}
            </text>
          ))}
        </g>
      )}

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

      {/* small bodies (computed positions) */}
      {L.smallbodies && (
        <g>
          {smalls.map((s) => {
            const col = s.kind === 'comet' ? '#9fe3ff' : s.kind === 'dwarf' ? '#e0d5b0' : '#c9b98a'
            const r = sw(s.kind === 'dwarf' ? 2.4 : s.kind === 'comet' ? 2.0 : 1.6)
            return (
              <g key={s.key}>
                <circle cx={s.ra} cy={s.dec} r={r} fill="none" stroke={col} strokeWidth={sw(1.1)} opacity={0.95} />
                <circle cx={s.ra} cy={s.dec} r={sw(0.6)} fill={col} opacity={0.9} />
                {s.kind === 'comet' && (
                  <path d={`M${s.ra} ${s.dec} l${sw(-4)} ${sw(2.4)}`} stroke={col} strokeWidth={sw(1)} fill="none" opacity={0.7} />
                )}
                {showNames && k >= 2.2 && (
                  <text x={s.ra} y={s.dec - r - sw(2)} textAnchor="middle" fontSize={fs(7)} fill={col} style={{ fontFamily: `'EB Garamond', serif`, fontStyle: 'italic', pointerEvents: 'none' }}>
                    {s.short}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      )}

      {/* cosmic objects */}
      {SPECIAL_LAYERS.map((layer) => {
        if (!L[layer.key]) return null
        const items = cosmic[layer.key] || []
        const col = layer.color
        const showLabel = showNames && k >= 2.2
        return (
          <g key={layer.key}>
            {items.map((it) => {
              if (layer.key === 'blackholes') {
                return (
                  <g key={it.id}>
                    <circle cx={it.ra} cy={it.dec} r={sw(2.6)} fill="#05070d" stroke={col} strokeWidth={sw(1.2)} />
                    <circle cx={it.ra} cy={it.dec} r={sw(0.9)} fill={col} />
                    <circle cx={it.ra} cy={it.dec} r={sw(3.6)} fill="none" stroke="rgba(212,175,55,0.35)" strokeWidth={sw(0.6)} strokeDasharray={`${sw(1)} ${sw(1.4)}`} />
                    {showLabel && (
                      <text x={it.ra} y={it.dec - sw(5)} textAnchor="middle" fontSize={fs(8)} fill={col} style={{ fontFamily: `'Cinzel', serif`, pointerEvents: 'none' }}>
                        {it.name}
                      </text>
                    )}
                  </g>
                )
              }
              if (layer.key === 'pulsars') {
                return (
                  <g key={it.id}>
                    <circle cx={it.ra} cy={it.dec} r={sw(2)} fill="none" stroke={col} strokeWidth={sw(1)} />
                    <circle cx={it.ra} cy={it.dec} r={sw(0.7)} fill={col} />
                    <path d={`M${it.ra - sw(3)} ${it.dec} h${sw(6)} M${it.ra} ${it.dec - sw(3)} v${sw(6)}`} stroke={col} strokeWidth={sw(0.7)} opacity={0.8} />
                    {showLabel && (
                      <text x={it.ra} y={it.dec - sw(4.5)} textAnchor="middle" fontSize={fs(7.5)} fill={col} style={{ fontFamily: `'EB Garamond', serif`, fontStyle: 'italic', pointerEvents: 'none' }}>
                        {it.name}
                      </text>
                    )}
                  </g>
                )
              }
              if (layer.key === 'quasars') {
                return (
                  <g key={it.id}>
                    <path d={`M${it.ra - sw(3.4)} ${it.dec} L${it.ra + sw(3.4)} ${it.dec} M${it.ra} ${it.dec - sw(3.4)} L${it.ra} ${it.dec + sw(3.4)}`} stroke={col} strokeWidth={sw(0.9)} />
                    <circle cx={it.ra} cy={it.dec} r={sw(1.1)} fill={col} />
                    {showLabel && (
                      <text x={it.ra} y={it.dec - sw(4.5)} textAnchor="middle" fontSize={fs(7.5)} fill={col} style={{ fontFamily: `'EB Garamond', serif`, fontStyle: 'italic', pointerEvents: 'none' }}>
                        {it.name}
                      </text>
                    )}
                  </g>
                )
              }
              if (layer.key === 'snr') {
                return (
                  <g key={it.id}>
                    <circle cx={it.ra} cy={it.dec} r={sw(2.6)} fill="none" stroke={col} strokeWidth={sw(1)} strokeDasharray={`${sw(1.4)} ${sw(1)}`} />
                    <circle cx={it.ra} cy={it.dec} r={sw(0.6)} fill={col} />
                    {showLabel && (
                      <text x={it.ra} y={it.dec - sw(4.8)} textAnchor="middle" fontSize={fs(7.5)} fill={col} style={{ fontFamily: `'EB Garamond', serif`, fontStyle: 'italic', pointerEvents: 'none' }}>
                        {it.name}
                      </text>
                    )}
                  </g>
                )
              }
              if (layer.key === 'galaxies' || layer.key === 'dwarfs') {
                const big = layer.key === 'galaxies'
                return (
                  <g key={it.id}>
                    <ellipse
                      cx={it.ra} cy={it.dec} rx={sw(big ? 3 : 2)} ry={sw(big ? 1.4 : 1)}
                      fill={big ? 'none' : col}
                      fillOpacity={big ? 0 : 0.35}
                      stroke={col} strokeWidth={sw(0.9)}
                      transform={`rotate(${30 * (it.id.charCodeAt(0) % 3) - 30} ${it.ra} ${it.dec})`}
                    />
                    <circle cx={it.ra} cy={it.dec} r={sw(0.6)} fill={col} />
                    {showLabel && (
                      <text x={it.ra} y={it.dec - sw(big ? 5 : 4)} textAnchor="middle" fontSize={fs(big ? 8 : 7)} fill={col} style={{ fontFamily: `'EB Garamond', serif`, fontStyle: 'italic', pointerEvents: 'none' }}>
                        {it.name}
                      </text>
                    )}
                  </g>
                )
              }
              if (layer.key === 'exoplanets') {
                return (
                  <g key={it.id}>
                    <circle cx={it.ra} cy={it.dec} r={sw(2.4)} fill="none" stroke={col} strokeWidth={sw(0.8)} />
                    <circle cx={it.ra + sw(1.6)} cy={it.dec} r={sw(0.7)} fill={col} />
                    <circle cx={it.ra} cy={it.dec} r={sw(0.8)} fill={col} opacity={0.6} />
                    {showLabel && (
                      <text x={it.ra} y={it.dec - sw(4.4)} textAnchor="middle" fontSize={fs(7.5)} fill={col} style={{ fontFamily: `'EB Garamond', serif`, fontStyle: 'italic', pointerEvents: 'none' }}>
                        {it.name}
                      </text>
                    )}
                  </g>
                )
              }
              if (layer.key === 'clusters') {
                return (
                  <g key={it.id}>
                    <circle cx={it.ra} cy={it.dec} r={sw(3)} fill="none" stroke={col} strokeWidth={sw(0.8)} strokeDasharray={`${sw(0.8)} ${sw(1.4)}`} />
                    <circle cx={it.ra} cy={it.dec} r={sw(0.7)} fill={col} />
                    {showLabel && (
                      <text x={it.ra} y={it.dec - sw(5)} textAnchor="middle" fontSize={fs(7.5)} fill={col} style={{ fontFamily: `'EB Garamond', serif`, fontStyle: 'italic', pointerEvents: 'none' }}>
                        {it.name}
                      </text>
                    )}
                  </g>
                )
              }
              // specials
              return (
                <g key={it.id}>
                  <rect x={it.ra - sw(1.8)} y={it.dec - sw(1.8)} width={sw(3.6)} height={sw(3.6)} transform={`rotate(45 ${it.ra} ${it.dec})`} fill="none" stroke={col} strokeWidth={sw(0.9)} />
                  <circle cx={it.ra} cy={it.dec} r={sw(0.7)} fill={col} />
                  {showLabel && (
                    <text x={it.ra} y={it.dec - sw(4.4)} textAnchor="middle" fontSize={fs(7.5)} fill={col} style={{ fontFamily: `'EB Garamond', serif`, fontStyle: 'italic', pointerEvents: 'none' }}>
                      {it.name}
                    </text>
                  )}
                </g>
              )
            })}
          </g>
        )
      })}
    </g>
  )
})

// ── main component ───────────────────────────────────────────
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

  // computed small-body positions for the chosen date
  const smalls = useMemo(() => {
    return Object.entries(smallbodiesJson).map(([key, el]) => {
      const pos = smallBodyPosition(el, dateStr)
      const [short, fact] = SB_FACTS[key] || [el.name.split(' ').slice(-1)[0] || key, '']
      return {
        key,
        name: el.name,
        short,
        kind: el.kind,
        class: el.class,
        fact,
        period: el.period,
        ra: pos.ra,
        dec: pos.dec,
        distAU: pos.distAU,
        r: pos.helioR,
        helioLon: pos.helioLon,
        helioLat: pos.helioLat,
      }
    })
  }, [dateStr])

  const [k, setK] = useState(1)
  const [center, setCenter] = useState({ x: 180, y: 20 })
  const [showAll, setShowAll] = useState(false)
  const [showLines, setShowLines] = useState(true)
  const [showNames, setShowNames] = useState(true)
  const [showDeep, setShowDeep] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [layers, setLayers] = useState(LAYER_DEFAULTS)
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
        for (const part of splitSeg(seg)) out.push({ cid: c.id, name: c.name, desig: c.desig, seg: part })
      }
    }
    return out
  }, [constellations])

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
      idx.push({ label: `M${m.m}${m.name ? ' — ' + m.name : ''}`, sub: `${m.type} · ${m.con}`, type: 'messier', obj: { kind: 'messier', messier: m, ra: m.ra, dec: m.dec } })
      if (m.ngc) idx.push({ label: `NGC ${m.ngc}`, sub: `M${m.m} · ${m.type}`, type: 'messier', obj: { kind: 'messier', messier: m, ra: m.ra, dec: m.dec } })
    }
    for (const b of bodyList) idx.push({ label: b.name, sub: 'wanderer of the court', type: 'body', obj: { kind: 'body', body: b, ra: b.ra, dec: b.dec } })
    for (const s of SHOWERS) idx.push({ label: s.name, sub: `${s.peak} · ZHR ${s.zhr}`, type: 'shower', obj: { kind: 'shower', shower: s, ra: s.ra, dec: s.dec } })
    for (const c of constellations) idx.push({ label: c.name, sub: c.desig, type: 'constellation', obj: { kind: 'constellation', c, ra: c.center[0], dec: c.center[1] } })
    for (const s of smalls) idx.push({ label: s.name, sub: s.kind === 'comet' ? 'comet · computed position' : s.kind === 'dwarf' ? 'dwarf planet · computed position' : 'asteroid · computed position', type: 'small', obj: { kind: 'small', s, ra: s.ra, dec: s.dec } })
    for (const it of allCosmic) idx.push({ label: it.name, sub: it.type, type: 'cosmic', obj: { kind: 'cosmic', it, ra: it.ra, dec: it.dec } })
    return idx
  }, [stars, messier, bodyList, constellations, smalls, allCosmic])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return searchIndex.filter((e) => e.label.toLowerCase().includes(q)).slice(0, 10)
  }, [query, searchIndex])

  const pickResult = (r) => {
    flyTo(r.obj.ra, r.obj.dec, r.type === 'star' ? 24 : r.type === 'messier' ? 10 : r.type === 'small' ? 4 : r.type === 'body' ? 6 : 8)
    setSelected(r.obj)
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

  // ── geometry ───────────────────────────────────────────────
  const screenToWorld = (clientX, clientY) => {
    const el = svgRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    const ux = ((clientX - rect.left) / rect.width) * W
    const uy = ((clientY - rect.top) / rect.height) * H
    return { x: (ux - W / 2) / k + center.x, y: (uy - H / 2) / k + center.y }
  }

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
    const consider = (t, ra, dec) => {
      const d = Math.hypot(ra - x, dec - y)
      if (d < bestD) {
        bestD = d
        best = t
      }
    }
    for (const m of messier) consider({ kind: 'messier', messier: m, ra: m.ra, dec: m.dec }, m.ra, m.dec)
    for (const b of bodyList) consider({ kind: 'body', body: b, ra: b.ra, dec: b.dec }, b.ra, b.dec)
    for (const s of SHOWERS) consider({ kind: 'shower', shower: s, ra: s.ra, dec: s.dec }, s.ra, s.dec)
    for (const s of smalls) consider({ kind: 'small', s, ra: s.ra, dec: s.dec }, s.ra, s.dec)
    for (const it of allCosmic) consider({ kind: 'cosmic', it, ra: it.ra, dec: it.dec }, it.ra, it.dec)
    return bestD < thresh ? best : null
  }

  const transform = `translate(${W / 2 - center.x * k} ${H / 2 - center.y * k}) scale(${k})`
  const sw2 = (px) => px / (FACTOR * k)
  const selWorld = selected ? { ra: selected.ra ?? selected.c?.center?.[0], dec: selected.dec ?? selected.c?.center?.[1] } : null

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

        <div className="map-zoom">
          <button title="Zoom in" onClick={() => setK(clamp(k * 1.6, MIN_K, MAX_K))}>+</button>
          <button title="Zoom out" onClick={() => setK(clamp(k / 1.6, MIN_K, MAX_K))}>−</button>
          <button title="Reset view" onClick={() => { setK(1); setCenter({ x: 180, y: 20 }); setSelected(null) }}>⌂</button>
        </div>

        <div className="map-toggles">
          <label className="mt"><input type="checkbox" checked={showLines} onChange={(e) => setShowLines(e.target.checked)} /> lines</label>
          <label className="mt"><input type="checkbox" checked={showNames} onChange={(e) => setShowNames(e.target.checked)} /> names</label>
          <label className="mt"><input type="checkbox" checked={showDeep} onChange={(e) => setShowDeep(e.target.checked)} /> Messier</label>
          <label className="mt"><input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} /> grid</label>
          <label className="mt" title="also draw the very faint"><input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} /> faint</label>
        </div>

        <div className="map-date">⚷ {dateStr}</div>
      </div>

      {/* layer chips */}
      <div className="maptoolbar layer-bar">
        <span className="layer-lbl">The deeper catalog:</span>
        <label className="mt"><input type="checkbox" checked={layers.smallbodies} onChange={() => toggleLayer('smallbodies')} /> small bodies</label>
        {SPECIAL_LAYERS.map((l) => (
          <label key={l.key} className="mt" style={{ color: layers[l.key] ? l.color : undefined }}>
            <input type="checkbox" checked={layers[l.key]} onChange={() => toggleLayer(l.key)} /> {l.label}
          </label>
        ))}
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
              cosmic={cosmic}
              smalls={smalls}
              layers={layers}
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
            {tooltip.kind === 'small' && <><b>{tooltip.s.short}</b> <span>{tooltip.s.kind === 'comet' ? 'comet' : tooltip.s.kind === 'dwarf' ? 'dwarf planet' : 'asteroid'}</span></>}
            {tooltip.kind === 'cosmic' && <><b>{tooltip.it.name}</b> <span>{tooltip.it.type}</span></>}
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
          This is a real map of the heavens for <b>{todayUTC()}</b>: {starsJson.meta.count.toLocaleString()} stars,
          all {messierJson.meta.count} objects of Messier, the wanderers in true positions, 11 meteor showers,
          black holes, pulsars, quasars, supernova remnants, galaxies, exoplanet systems, dwarf planets and
          comets — every one with its true place and its story. Drag to wander, scroll to descend, click to learn.
        </p>
      </aside>
    )
  }

  const k = selected.kind
  const close = <button className="info-close" onClick={onClose}>✕</button>

  if (k === 'star') {
    const s = selected.star
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
  if (k === 'messier') {
    const m = selected.messier
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
  if (k === 'body') {
    const b = selected.body
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
  if (k === 'shower') {
    const s = selected.shower
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
  if (k === 'small') {
    const s = selected.s
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
  if (k === 'cosmic') {
    const it = selected.it
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
