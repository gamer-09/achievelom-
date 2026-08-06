import { useMemo, useState } from 'react'
import Cosmos3D from './Cosmos3D.jsx'
import galaxyStars from '../data/galaxyStars.json'
import globularsJson from '../data/globulars.json'
import survey from '../data/redshiftSurvey.json'
import { LOCAL_GROUP } from '../data/localgroup.js'
import { galToEq } from '../astro/ephemeris.js'

const D2R = Math.PI / 180

// convert RA/Dec/distance (kpc) -> equatorial cartesian (kpc)
function raDecDistToXYZ(ra, dec, dist) {
  const a = ra * D2R
  const d = dec * D2R
  return {
    x: dist * Math.cos(d) * Math.cos(a),
    y: dist * Math.cos(d) * Math.sin(a),
    z: dist * Math.sin(d),
  }
}

const SPECT_COLOR = {
  O: '#a8b6ff', B: '#9db4ff', A: '#d6e4f7', F: '#f2ecd8',
  G: '#f7dc9e', K: '#e8b078', M: '#d98a7a',
}

function starSize(mag) {
  if (mag <= 1.2) return 2.6
  if (mag <= 2.5) return 2.2
  if (mag <= 4.0) return 1.8
  if (mag <= 5.5) return 1.4
  return 1.0
}

// ── the four views ───────────────────────────────────────────
function MilkyWayView({ selected, setSelected }) {
  const objects = useMemo(() => {
    const list = []
    // real stars (pc -> kpc, Sun at origin)
    for (const s of galaxyStars.stars) {
      const [hip, x, y, z, mag, spect, proper] = s
      const ch = spect ? spect[0].toUpperCase() : ''
      const color = SPECT_COLOR[ch] || '#e9e4da'
      list.push({
        id: 'star-' + (hip || `${x}-${y}-${z}`),
        x: x / 1000, y: y / 1000, z: z / 1000,
        r: starSize(mag), color, kind: 'dot',
        info: { kind: 'star', name: proper || `Star HIP ${hip || '?'}`, mag, dist: Math.round(Math.hypot(x, y, z) / 1000 * 100) / 100, spect },
      })
    }
    // real globular clusters (galactic X,Y,Z -> equatorial frame)
    const SGR_A = galToEq(0, 0) // galactic center direction in equatorial
    for (const c of globularsJson.clusters) {
      const [label, name, ra, dec, dist, X, Y, Z] = c
      // convert galactic-frame X,Y,Z (X->l=0, Y->l=90, Z->b=90) to equatorial xyz
      const r = Math.sqrt(X * X + Y * Y + Z * Z)
      const l = Math.atan2(Y, X) * 180 / Math.PI
      const b = Math.asin(Z / r) * 180 / Math.PI
      const eq = galToEq(l, b)
      const xyz = raDecDistToXYZ(eq.ra, eq.dec, r)
      list.push({
        id: 'gc-' + name,
        ...xyz,
        r: 4.2, color: '#e8b078', kind: 'glyph', shape: 'circle', labelK: 3.2,
        label: label,
        info: { kind: 'cluster', name: label || name, ra, dec, dist: `${dist} kpc (${(dist * 3.26).toFixed(0)} kly)` },
      })
    }
    // the Sun
    list.push({
      id: 'sun', x: 0, y: 0, z: 0, r: 4.5, color: '#f2cf5b', kind: 'glyph', shape: 'ring', labelK: 1.4,
      label: 'The Sun', info: { kind: 'marker', name: 'The Sun', text: 'Our star — the origin of this chart. Every light here is placed from its real measured position.' },
    })
    // galactic center (Sgr A*) at 8 kpc toward l=0,b=0
    const gxyz = raDecDistToXYZ(SGR_A.ra, SGR_A.dec, 8.0)
    list.push({
      id: 'sgra', ...gxyz, r: 4.8, color: '#d96a4a', kind: 'glyph', shape: 'cross', labelK: 1.8,
      label: 'Sagittarius A*', info: { kind: 'marker', name: 'Sagittarius A*', text: 'The supermassive black hole at the heart of the Milky Way — 4.3 million Suns, 8,000 pc away. Stars orbit it at 24,000 km/s.' },
    })
    return list
  }, [])
  return (
    <Cosmos3D
      objects={objects}
      range={95}
      unit="1 world unit = 1,000 light-years"
      view={{ rotY: -38, rotX: 26, k: 1.6 }}
      onSelect={setSelected}
      selected={selected}
      hint="The Milky Way, drawn from real measurements: 5,187 stars with true 3D positions (HYG), 156 real globular clusters (Harris catalog), the Sun, and the galactic center. Click the Sun or any star to fly in — the nearest stars separate beautifully once you zoom."
    />
  )
}

function LocalGroupView({ selected, setSelected }) {
  const objects = useMemo(() => {
    return LOCAL_GROUP.map((g) => {
      const xyz = g.dist === 0 ? { x: 0, y: 0, z: 0 } : raDecDistToXYZ(g.ra, g.dec, g.dist)
      return {
        id: g.id,
        ...xyz,
        r: g.size * 3.2,
        color: g.color,
        kind: 'glyph',
        shape: 'circle',
        labelK: 1.5,
        label: g.name,
        info: { kind: 'galaxy', ...g },
      }
    })
  }, [])
  return (
    <Cosmos3D
      objects={objects}
      range={4200}
      unit="1 world unit = 1,000 light-years"
      view={{ rotY: -40, rotX: 18, k: 1.2 }}
      onSelect={setSelected}
      selected={selected}
      hint="The Local Group — our archipelago of galaxies, drawn to true distances (from Karachentsev & the extragalactic literature). Two great spirals, the Milky Way and Andromeda, drift toward a collision 4.5 billion years from now."
    />
  )
}

function UniverseView({ selected, setSelected }) {
  const objects = useMemo(() => {
    const list = []
    const zColor = (z) => {
      if (z < 0.05) return '#7fb3c9'
      if (z < 0.1) return '#9fc8e0'
      if (z < 0.2) return '#d8c9a3'
      if (z < 0.4) return '#e8b078'
      return '#d96a4a'
    }
    for (const g of survey.galaxies) {
      const [ra, dec, z] = g
      const dist = 4430 * z // Mpc, H0=70
      const xyz = raDecDistToXYZ(ra, dec, dist)
      list.push({
        id: 'gal-' + g[0] + '-' + g[1] + '-' + z,
        ...xyz,
        r: 0.8,
        color: zColor(z),
        kind: 'dot',
        info: { kind: 'galaxy', name: 'A distant galaxy (2dFGRS)', z, dist: `${(dist * 3.26).toFixed(0)} million light-years` },
      })
    }
    // the CMB shell — the edge of the visible universe
    const R_CMB = 4230 // Mpc (13.8 Gly comoving)
    for (let i = 0; i < 260; i++) {
      const theta = Math.acos(2 * ((i * 37) % 1000) / 1000 - 1)
      const phi = (i * 137.5) * D2R
      list.push({
        id: 'cmb-' + i,
        x: R_CMB * Math.sin(theta) * Math.cos(phi),
        y: R_CMB * Math.sin(theta) * Math.sin(phi),
        z: R_CMB * Math.cos(theta),
        r: 1.4,
        color: 'rgba(200,220,240,0.4)',
        kind: 'dot',
        info: { kind: 'marker', name: 'The Cosmic Microwave Background', text: 'The afterglow of the Big Bang, 13.8 billion light-years away — the edge of everything we can ever see.' },
      })
    }
    list.push({
      id: 'cmb-lbl', x: 0, y: 0, z: R_CMB, r: 3, color: '#cfe0f2', kind: 'glyph', shape: 'circle', labelK: 1.5,
      label: 'the cosmic microwave background', info: null,
    })
    return list
  }, [])
  return (
    <Cosmos3D
      objects={objects}
      range={12000}
      unit="1 world unit = 3.26 million light-years"
      view={{ rotY: -25, rotX: 30, k: 2 }}
      onSelect={setSelected}
      selected={selected}
      hint="The observable universe, built from 4,824 real galaxies of the 2dF Galaxy Redshift Survey — a true slice of the cosmic web, each dot a galaxy at its measured distance (redshift → distance, H₀ = 70). Near galaxies glow blue; the farthest burn orange, out to the microwave glow of creation."
    />
  )
}

// ── multiverse (honestly labeled theory) ─────────────────────
const BUBBLES = [
  { id: 'eternal', name: 'Eternal Inflation', x: 20, y: 30, r: 110, color: '#7b2b8f', desc: 'Our universe may be one bubble in an endlessly inflating sea — space keeps birthing new universes forever, each a separate bubble. Suggested by inflationary cosmology (Guth, Linde, Vilenkin).' },
  { id: 'string', name: 'The String Landscape', x: 82, y: 24, r: 84, color: '#2b5a8f', desc: 'String theory seems to allow 10^500 different sets of physical laws — "universes" with different constants, a landscape of possibilities. Whether the others are real is unknown.' },
  { id: 'ours', name: 'Our Universe', x: 52, y: 55, r: 150, color: '#8a1220', desc: 'The one bubble we can see: 13.8 billion years old, 93 billion light-years across, 5% atoms, 27% dark matter, 68% dark energy. If other bubbles exist, they lie forever beyond our horizon — we cannot even in principle observe them.' },
  { id: 'quantum', name: 'Quantum Worlds', x: 16, y: 78, r: 76, color: '#2b8f5a', desc: 'The many-worlds interpretation: every quantum measurement splits reality, so countless worlds exist in parallel — an infinity of "what if" universes, including ones where you made other choices.' },
  { id: 'mathematical', name: 'Mathematical Multiverse', x: 84, y: 80, r: 90, color: '#8f6a2b', desc: 'Max Tegmark\'s boldest idea: every mathematical structure is real, so our universe is just one entry in an infinite library of logically possible realities.' },
]

function MultiverseView({ selected, setSelected }) {
  return (
    <div className="multi">
      <div className="multi-canvas">
        {BUBBLES.map((b) => (
          <div
            key={b.id}
            className={`multi-bubble ${selected === b.id ? 'active' : ''}`}
            style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.r * 2, height: b.r * 2, background: `radial-gradient(circle at 38% 32%, ${b.color}66, ${b.color}22 60%, transparent 75%)`, borderColor: b.color }}
            onClick={() => setSelected(b.id)}
          >
            <span className="multi-name">{b.name}</span>
          </div>
        ))}
        <div className="multi-note">
          THEORY, NOT OBSERVATION — by definition the other aeons lie beyond our cosmic
          horizon, and no instrument can ever reach them. This is the honest frontier of physics.
        </div>
      </div>
      <aside className="panel map-info">
        {!selected ? (
          <>
            <p className="eyebrow">Beyond the horizon</p>
            <h3>The Multiverse</h3>
            <p>
              Every major branch of modern physics has stumbled on the same suspicion: our
              universe may not be alone. Tap a bubble to read the idea behind it. None of
              these can be proven — they are the border posts of knowledge, where science
              meets speculation.
            </p>
          </>
        ) : (
          <>
            <button className="info-close" onClick={() => setSelected(null)}>✕</button>
            <p className="eyebrow">A hypothesis</p>
            <h2>{BUBBLES.find((b) => b.id === selected)?.name}</h2>
            <p className="info-note" style={{ marginTop: 12, fontSize: '0.95rem', color: 'var(--parchment)' }}>
              {BUBBLES.find((b) => b.id === selected)?.desc}
            </p>
          </>
        )}
      </aside>
    </div>
  )
}

// ── info panel ───────────────────────────────────────────────
function CosmosInfo({ obj, onClose }) {
  if (!obj || !obj.info) return null
  const i = obj.info
  return (
    <aside className="panel map-info">
      <button className="info-close" onClick={onClose}>✕</button>
      {i.kind === 'star' && (
        <>
          <p className="eyebrow">A star of the Milky Way · real position</p>
          <h2>{i.name}</h2>
          <dl className="info-list">
            <InfoRow k="Magnitude" v={String(i.mag)} />
            <InfoRow k="Distance" v={`${i.dist} kiloparsecs (${(i.dist * 3.26).toFixed(1)} thousand light-years)`} />
            <InfoRow k="Spectral type" v={i.spect || '—'} />
          </dl>
          <p className="info-note">3D position from the HYG catalogue (Sun at the origin).</p>
        </>
      )}
      {i.kind === 'cluster' && (
        <>
          <p className="eyebrow">A globular cluster · real position</p>
          <h2>{i.name}</h2>
          <dl className="info-list">
            <InfoRow k="Right ascension" v={fmtRA(i.ra)} />
            <InfoRow k="Declination" v={fmtDec(i.dec)} />
            <InfoRow k="Distance" v={i.dist} />
          </dl>
          <p className="info-note">From the Harris Catalog of Milky Way globular clusters — a sphere of hundreds of thousands of ancient stars.</p>
        </>
      )}
      {i.kind === 'galaxy' && (
        <>
          <p className="eyebrow">A galaxy · true distance</p>
          <h2>{i.name}</h2>
          <dl className="info-list">
            {i.type && <InfoRow k="Type" v={i.type} />}
            {i.dist && <InfoRow k="Distance" v={i.dist} />}
            {i.z != null && <InfoRow k="Redshift" v={String(i.z)} />}
          </dl>
          <p className="info-note">{i.note || 'Position and distance from published literature / the 2dF Galaxy Redshift Survey.'}</p>
        </>
      )}
      {i.kind === 'marker' && (
        <>
          <p className="eyebrow">A landmark</p>
          <h2>{i.name}</h2>
          <p className="info-note" style={{ marginTop: 12, color: 'var(--parchment)', fontSize: '0.95rem' }}>{i.text}</p>
        </>
      )}
    </aside>
  )
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

// ── main ─────────────────────────────────────────────────────
export default function CosmosMap({ view = 'milkyway' }) {
  const [selected, setSelected] = useState(null)

  return (
    <div className="cosmos">
      {view === 'milkyway' && <MilkyWayView selected={selected} setSelected={setSelected} />}
      {view === 'local-group' && <LocalGroupView selected={selected} setSelected={setSelected} />}
      {view === 'universe' && <UniverseView selected={selected} setSelected={setSelected} />}
      {view === 'multiverse' && <MultiverseView selected={selected} setSelected={setSelected} />}
      {view !== 'multiverse' && <CosmosInfo obj={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
