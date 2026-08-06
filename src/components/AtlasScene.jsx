import { getChildren, getParent } from '../data/cosmos.js'

// ── deterministic pseudo-random (stable across renders) ─────
function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seededPoints(count, seed, W = 1000, H = 640, pad = 46) {
  const rnd = mulberry32(seed)
  return Array.from({ length: count }, () => ({
    x: pad + rnd() * (W - 2 * pad),
    y: pad + rnd() * (H - 2 * pad),
    r: 0.6 + rnd() * 1.7,
    o: 0.22 + rnd() * 0.6,
  }))
}

// ── shared decorations ──────────────────────────────────────
function StarField({ count = 90, seed = 7 }) {
  const pts = seededPoints(count, seed)
  return (
    <g>
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#cfe0f2" opacity={p.o} />
      ))}
    </g>
  )
}

function Frame({ title, ancient, scale }) {
  const corner = (x, y) => (
    <g key={`${x}-${y}`} transform={`translate(${x},${y})`}>
      <path d="M0 34 L0 0 L34 0" fill="none" stroke="rgba(212,175,55,.7)" strokeWidth="2.5" />
      <path d="M3 22 L3 3 L22 3" fill="none" stroke="rgba(212,175,55,.4)" strokeWidth="1" />
    </g>
  )
  return (
    <g pointerEvents="none">
      <rect x="8" y="8" width="984" height="624" fill="none" stroke="rgba(212,175,55,.4)" strokeWidth="1.5" />
      <rect x="15" y="15" width="970" height="610" fill="none" stroke="rgba(212,175,55,.16)" strokeWidth="0.75" strokeDasharray="7 7" />
      {corner(15, 15)}
      {corner(985, 15)}
      {corner(15, 625)}
      {corner(985, 625)}
      <text x="38" y="54" className="atlas-frame-title">{title}</text>
      <text x="38" y="76" className="atlas-frame-sub">{ancient}</text>
      <text x="962" y="614" textAnchor="end" className="atlas-frame-scale">{scale}</text>
      <g transform="translate(948, 92)">
        <circle r="22" fill="none" stroke="rgba(212,175,55,.55)" strokeWidth="1.2" />
        <circle r="14" fill="none" stroke="rgba(212,175,55,.25)" strokeWidth="0.8" />
        <path d="M0 -18 L3.4 -8 L0 -10 L-3.4 -8 Z" fill="#f2cf5b" />
        <path d="M0 18 L3.4 8 L0 10 L-3.4 8 Z" fill="rgba(212,175,55,.5)" />
        <text y="-27" textAnchor="middle" className="atlas-compass">N</text>
        <text y="39" textAnchor="middle" className="atlas-compass">S</text>
        <text x="31" y="4" textAnchor="middle" className="atlas-compass">E</text>
        <text x="-31" y="4" textAnchor="middle" className="atlas-compass">W</text>
      </g>
    </g>
  )
}

function Clickable({ x, y, r = 13, label, sub, onPick, pulse = false, tint = '#d4af37', labelAt = 'right' }) {
  const tx = labelAt === 'right' ? x + r + 8 : x - r - 8
  const anchor = labelAt === 'right' ? 'start' : 'end'
  return (
    <g
      className="atlas-clickable"
      onClick={onPick}
      role="button"
      tabIndex={0}
      aria-label={label || 'descend'}
      onKeyDown={(e) => e.key === 'Enter' && onPick && onPick()}
    >
      {pulse && <circle className="pulse-ring" cx={x} cy={y} r={r + 8} fill="none" stroke={tint} strokeWidth="1.4" />}
      <circle cx={x} cy={y} r={r} fill="rgba(212,175,55,0.13)" stroke={tint} strokeWidth="1.6" />
      <circle cx={x} cy={y} r={2.8} fill="#f2cf5b" />
      {label && (
        <text x={tx} y={y - 9} textAnchor={anchor} className="atlas-label">
          {label}
        </text>
      )}
      {sub && (
        <text x={tx} y={y + 7} textAnchor={anchor} className="atlas-sublabel">
          {sub}
        </text>
      )}
    </g>
  )
}

const C = { x: 500, y: 330 }

// ── scene: the multiverse ───────────────────────────────────
function renderBubbles(node, children, pick) {
  const bubbles = [
    { x: 170, y: 220, r: 118, o: 0.5, name: 'Aeon of the Silent Lights' },
    { x: 830, y: 195, r: 96, o: 0.45, name: 'Aeon of the Violent Constants' },
    { x: 150, y: 478, r: 92, o: 0.5, name: 'Aeon of the Long Gravity' },
    { x: 862, y: 470, r: 108, o: 0.45, name: 'Aeon of the Burning Vacuum' },
    { x: 500, y: 330, r: 195, o: 1, main: true, name: 'Our Universe' },
  ]
  const child = children.find((c) => c.id === 'universe')
  return (
    <g>
      {bubbles.map((b, i) =>
        b.main ? null : (
          <g key={i}>
            <circle cx={b.x} cy={b.y} r={b.r} fill="rgba(43,74,118,0.28)" stroke="rgba(212,175,55,0.26)" strokeWidth="1" />
            <circle cx={b.x} cy={b.y} r={b.r * 0.6} fill="rgba(157,184,217,0.05)" />
            <text x={b.x} y={b.y} textAnchor="middle" className="atlas-ghost-label">
              {b.name}
            </text>
          </g>
        )
      )}
      {child && (
        <g>
          <circle cx={C.x} cy={C.y} r={195} fill="url(#bub-main)" stroke="#d4af37" strokeWidth="2" opacity="0.9" />
          <circle cx={C.x} cy={C.y} r={205} fill="none" stroke="rgba(242,207,91,0.35)" strokeWidth="1" />
          <text x={C.x} y={C.y - 70} textAnchor="middle" className="atlas-big-label">
            Our Universe
          </text>
          <Clickable x={C.x} y={C.y} r={26} pulse label="the known all" sub="descend into 93 billion light-years" onPick={pick('universe')} labelAt="right" />
        </g>
      )}
      <text x="500" y="600" textAnchor="middle" className="atlas-hint">
        The other aeons lie beyond our horizon — and beyond our ink.
      </text>
    </g>
  )
}

// ── scene: the cosmic web ───────────────────────────────────
function renderWeb(node, children, pick) {
  const pts = seededPoints(120, 42)
  const links = []
  for (let i = 0; i < pts.length; i++) {
    const dists = pts
      .map((p, j) => ({ j, d: (p.x - pts[i].x) ** 2 + (p.y - pts[i].y) ** 2 }))
      .sort((a, b) => a.d - b.d)
      .slice(1, 3)
    dists.forEach(({ j }) => {
      if (i < j) links.push([pts[i], pts[j]])
    })
  }
  return (
    <g>
      {links.map(([a, b], i) => (
        <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(155,184,217,0.12)" strokeWidth="0.8" />
      ))}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#9db8d9" opacity={p.o} />
      ))}
      {/* the deep field */}
      <g transform="translate(150,130)" pointerEvents="none">
        <rect x="-6" y="-6" width="150" height="92" fill="none" stroke="rgba(212,175,55,0.5)" strokeWidth="1" />
        <text x="0" y="12" className="atlas-sublabel">Webb Deep Field</text>
        <text x="0" y="30" className="atlas-ghost-label">thousands of galaxies</text>
        <text x="0" y="46" className="atlas-ghost-label">in a grain of sand</text>
        <text x="0" y="66" className="atlas-ghost-label">13.2 billion years ago</text>
      </g>
      <text x="820" y="540" className="atlas-ghost-label" textAnchor="end">
        ≈ 2 trillion galaxies
      </text>
      <text x="820" y="560" className="atlas-ghost-label" textAnchor="end">
        cosmic web of filaments &amp; voids
      </text>
      {children.find((c) => c.id === 'laniakea') && (
        <Clickable
          x={500}
          y={330}
          r={26}
          pulse
          label="Laniakea"
          sub="our supercluster — 520 million light-years"
          onPick={pick('laniakea')}
        />
      )}
    </g>
  )
}

// ── scene: a supercluster ───────────────────────────────────
function renderCluster(node, children, pick) {
  const rnd = mulberry32(88)
  const gals = Array.from({ length: 72 }, () => ({
    x: 60 + rnd() * 880,
    y: 70 + rnd() * 500,
    rx: 2.5 + rnd() * 5,
    ry: 1.4 + rnd() * 2.4,
    a: rnd() * 180,
    o: 0.35 + rnd() * 0.5,
  }))
  const toAttractor = (x, y) => {
    const dx = 560 - x
    const dy = 330 - y
    const d = Math.hypot(dx, dy) || 1
    return { x: x + (dx / d) * 34, y: y + (dy / d) * 34 }
  }
  return (
    <g>
      {gals.map((g, i) => {
        const t = toAttractor(g.x, g.y)
        return (
          <g key={i}>
            <line x1={g.x} y1={g.y} x2={t.x} y2={t.y} stroke="rgba(212,175,55,0.14)" strokeWidth="0.6" />
            <ellipse cx={g.x} cy={g.y} rx={g.rx} ry={g.ry} fill="#9db8d9" opacity={g.o} transform={`rotate(${g.a} ${g.x} ${g.y})`} />
          </g>
        )
      })}
      {/* the great attractor */}
      <circle cx={560} cy={330} r={90} fill="url(#attractor)" />
      <circle cx={560} cy={330} r={24} fill="rgba(242,207,91,0.85)" />
      <text x={560} y={300} textAnchor="middle" className="atlas-label">
        The Great Attractor
      </text>
      <text x={560} y={440} textAnchor="middle" className="atlas-ghost-label">
        we cannot see it — only feel its pull
      </text>
      {children.find((c) => c.id === 'local-group') && (
        <Clickable
          x={330}
          y={280}
          r={22}
          pulse
          label="The Local Group"
          sub="our archipelago — descend"
          onPick={pick('local-group')}
        />
      )}
    </g>
  )
}

// ── scene: the local group ──────────────────────────────────
function renderGalaxies(node, children, pick) {
  const rnd = mulberry32(17)
  const dwarfs = Array.from({ length: 14 }, () => ({
    x: 200 + rnd() * 220,
    y: 240 + rnd() * 240,
    r: 1.5 + rnd() * 3,
  }))
  return (
    <g>
      {dwarfs.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#9db8d9" opacity="0.55" />
      ))}
      {/* andromeda */}
      <g>
        <ellipse cx={720} cy={215} rx={120} ry={46} fill="url(#andromeda)" />
        <text x={720} y={176} textAnchor="middle" className="atlas-label">
          Andromeda · M31
        </text>
        <text x={720} y={288} textAnchor="middle" className="atlas-ghost-label">
          approaching at 110 km/s
        </text>
      </g>
      {/* triangulum */}
      <ellipse cx={770} cy={500} rx={44} ry={18} fill="url(#triangulum)" opacity="0.85" />
      <text x={770} y={540} textAnchor="middle" className="atlas-ghost-label">
        Triangulum · M33
      </text>
      {children.find((c) => c.id === 'milky-way') && (
        <g>
          <ellipse cx={330} cy={360} rx={120} ry={58} fill="url(#milkyway)" />
          <Clickable
            x={330}
            y={360}
            r={24}
            pulse
            label="The Milky Way"
            sub="our home — descend"
            onPick={pick('milky-way')}
            labelAt="left"
          />
        </g>
      )}
      {/* collision arrow */}
      <g pointerEvents="none">
        <line x1={455} y1={315} x2={600} y2={262} stroke="rgba(194,68,14,0.75)" strokeWidth="1.4" strokeDasharray="6 4" markerEnd="url(#arrow)" />
        <text x={528} y={298} className="atlas-ghost-label" transform="rotate(-24 528 298)">
          collision in ≈ 4.5 billion years
        </text>
      </g>
      <text x="500" y="610" textAnchor="middle" className="atlas-hint">
        our cosmic neighbourhood — some eighty galaxies bound by gravity
      </text>
    </g>
  )
}

// ── scene: the spiral galaxy ────────────────────────────────
function renderGalaxy(node, children, pick) {
  const rnd = mulberry32(55)
  const stars = []
  for (let i = 0; i < 420; i++) {
    const r = Math.pow(rnd(), 0.75) * 420
    const a = rnd() * Math.PI * 2
    const g = 0.85 + rnd() * 0.3
    stars.push({ x: C.x + r * Math.cos(a), y: C.y + r * 0.62 * Math.sin(a), r: 0.5 + rnd() * 1.3, o: (0.18 + rnd() * 0.5) * (1 - (r / 460)) * 2.2, a, r0: r })
  }
  const armPts = (offset) => {
    const pts = []
    for (let r = 24; r < 440; r += 5) {
      const a = r / 56 + offset
      const wob = (rnd() - 0.5) * 14
      pts.push({ x: C.x + (r + wob) * Math.cos(a), y: C.y + (r + wob) * 0.62 * Math.sin(a) })
    }
    return pts
  }
  const arms = [0, Math.PI, Math.PI / 2 + 1.1, (3 * Math.PI) / 2 + 1.1]
  const sol = { x: C.x + 265 * Math.cos(0.35), y: C.y + 265 * 0.62 * Math.sin(0.35) }
  return (
    <g>
      {/* bulge */}
      <ellipse cx={C.x} cy={C.y} rx={70} ry={46} fill="url(#bulge)" />
      {stars
        .filter((s) => Math.hypot(s.x - C.x, s.y - C.y) > 60)
        .map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#dbe6f2" opacity={Math.max(0.06, s.o)} />
        ))}
      {arms.map((off, ai) => {
        const pts = armPts(off)
        const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
        return <path key={ai} d={path} fill="none" stroke="rgba(155,184,217,0.2)" strokeWidth="2.4" />
      })}
      {/* sgr a* */}
      <circle cx={C.x} cy={C.y} r={3.2} fill="#000" />
      <circle cx={C.x} cy={C.y} r={5.5} fill="none" stroke="#f2cf5b" strokeWidth="1" />
      <text x={C.x + 12} y={C.y - 10} className="atlas-sublabel">
        Sagittarius A* — 4.3 million Suns
      </text>
      {children.find((c) => c.id === 'solar-system') && (
        <Clickable
          x={sol.x}
          y={sol.y}
          r={16}
          pulse
          label="Sol — the Solar System"
          sub="we are here · descend"
          onPick={pick('solar-system')}
          labelAt="left"
        />
      )}
      <text x="500" y="612" textAnchor="middle" className="atlas-hint">
        a barred spiral of 100–400 billion suns — the Sun rides a quiet arm, far from the burning heart
      </text>
    </g>
  )
}

// ── scene: the solar system ─────────────────────────────────
const PLANET_ANGLES = { mercury: 0, venus: 60, earth: 128, mars: 196, jupiter: 244, saturn: 302, uranus: 26, neptune: 150 }
const ORBIT_R = { mercury: 92, venus: 124, earth: 158, mars: 194, jupiter: 236, saturn: 284, uranus: 330, neptune: 374 }
const PLANET_R = { mercury: 7, venus: 11, earth: 11.5, mars: 9, jupiter: 21, saturn: 17, uranus: 13, neptune: 13 }

function renderSystem(node, children, pick) {
  const planets = children.filter((c) => PLANET_ANGLES[c.id])
  return (
    <g>
      {/* orbits */}
      {Object.values(ORBIT_R).map((r, i) => (
        <ellipse key={i} cx={C.x} cy={C.y} rx={r} ry={r * 0.72} fill="none" stroke="rgba(212,175,55,0.16)" strokeWidth="0.9" />
      ))}
      {/* asteroid & kuiper belts */}
      <ellipse cx={C.x} cy={C.y} rx={215} ry={215 * 0.72} fill="none" stroke="rgba(194,68,14,0.4)" strokeWidth="1" strokeDasharray="3 5" />
      <ellipse cx={C.x} cy={C.y} rx={410} ry={410 * 0.72} fill="none" stroke="rgba(155,184,217,0.22)" strokeWidth="1" strokeDasharray="2 8" />
      <text x={C.x + 216} y={C.y - 60} className="atlas-ghost-label">asteroid belt</text>
      {/* sun */}
      <circle cx={C.x} cy={C.y} r={30} fill="url(#sunface)" />
      <circle cx={C.x} cy={C.y} r={36} fill="none" stroke="rgba(242,207,91,0.55)" strokeWidth="1.4" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6
        return (
          <line
            key={i}
            x1={C.x + 36 * Math.cos(a)}
            y1={C.y + 36 * Math.sin(a)}
            x2={C.x + 48 * Math.cos(a)}
            y2={C.y + 48 * Math.sin(a)}
            stroke="rgba(242,207,91,0.6)"
            strokeWidth="1.4"
          />
        )
      })}
      {children.find((c) => c.id === 'sun') && (
        <Clickable x={C.x} y={C.y} r={44} label="Sol" sub="the Giver of Light — descend" onPick={pick('sun')} />
      )}
      {/* planets */}
      {planets.map((p) => {
        const a = (PLANET_ANGLES[p.id] * Math.PI) / 180
        const r = ORBIT_R[p.id]
        const x = C.x + r * Math.cos(a)
        const y = C.y + r * 0.72 * Math.sin(a)
        const pr = PLANET_R[p.id]
        return (
          <Clickable
            key={p.id}
            x={x}
            y={y}
            r={pr + 4}
            label={p.name}
            sub={p.ancient.split('·')[0].trim()}
            onPick={pick(p.id)}
            tint={p.palette[0]}
            labelAt={x < C.x ? 'right' : 'left'}
          />
        )
      })}
      <text x="500" y="614" textAnchor="middle" className="atlas-hint">
        the wandering court — click a world to descend; distances are drawn as the ancients drew them: in order, not in miles
      </text>
    </g>
  )
}

// ── scene: a world (globe) ──────────────────────────────────
function GlobeArt({ node, rnd }) {
  const { id, kind, palette } = node
  const o = (x, y, r, fill, opacity = 1, extra = {}) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={fill} opacity={opacity} {...extra} />
  const craters = () =>
    Array.from({ length: 14 }, (_, i) => {
      const x = 400 + rnd() * 200
      const y = 190 + rnd() * 280
      const r = 3 + rnd() * 9
      return <circle key={i} cx={x} cy={y} r={r} fill="rgba(0,0,0,0.14)" stroke="rgba(0,0,0,0.22)" strokeWidth="0.8" />
    })
  const bands = (colors) =>
    Array.from({ length: 15 }, (_, i) => {
      const y = 180 + i * 20
      const c = colors[i % colors.length]
      return <rect key={i} x={350} y={y} width={300} height={20} fill={c} />
    })
  const cracks = (count, color, seed = 3) =>
    Array.from({ length: count }, (_, i) => {
      const r = mulberry32(seed + i)
      const y = 200 + r() * 260
      const x0 = 350 + r() * 60
      const x1 = 650 + r() * 0
      return (
        <path
          key={i}
          d={`M${x0} ${y} Q${400 + r() * 100} ${y - 40 + r() * 80} ${x1 - 30} ${y - 10 + r() * 40} T650 ${y}`}
          fill="none"
          stroke={color}
          strokeWidth="1.4"
          opacity="0.8"
        />
      )
    })

  switch (kind) {
    case 'star': {
      return (
        <g>
          <circle cx={C.x} cy={C.y} r={150} fill="url(#sunface)" />
          {Array.from({ length: 14 }).map((_, i) => {
            const a = (i * Math.PI) / 7
            return (
              <line
                key={i}
                x1={C.x + 150 * Math.cos(a)}
                y1={C.y + 150 * Math.sin(a)}
                x2={C.x + 190 * Math.cos(a)}
                y2={C.y + 190 * Math.sin(a)}
                stroke="rgba(242,207,91,0.55)"
                strokeWidth="2"
              />
            )
          })}
          {craters().map((c, i) =>
            i < 5 ? <ellipse key={`s${i}`} cx={410 + i * 45} cy={300 + (i % 2) * 60} rx={14 - i} ry={8} fill="rgba(122,31,31,0.5)" /> : null
          )}
          <text x="500" y="70" textAnchor="middle" className="atlas-label">
            surface ≈ 5,500 °C
          </text>
        </g>
      )
    }
    case 'gas': {
      const colors = ['#c9a227', '#a56b3a', '#d9b45b', '#8a5a2a', '#b98a4a']
      return (
        <g>
          {bands(colors)}
          <ellipse cx={560} cy={390} rx={24} ry={15} fill="#b34a2a" stroke="#7a1f1f" strokeWidth="1.4" />
          <text x={560} y={425} textAnchor="middle" className="atlas-ghost-label">
            the Great Red Spot — a storm wider than Earth
          </text>
        </g>
      )
    }
    case 'ringed': {
      const colors = ['#d9a05b', '#c9b98a', '#e0c9a3', '#a5824a']
      return (
        <g>
          {bands(colors)}
          <g transform={`rotate(-16 ${C.x} ${C.y})`}>
            <ellipse cx={C.x} cy={C.y} rx={232} ry={56} fill="none" stroke="#c9b98a" strokeWidth="9" opacity="0.85" />
            <ellipse cx={C.x} cy={C.y} rx={204} ry={48} fill="none" stroke="#a5824a" strokeWidth="3" opacity="0.7" />
            <ellipse cx={C.x} cy={C.y} rx={250} ry={62} fill="none" stroke="#e0c9a3" strokeWidth="1.4" opacity="0.5" />
          </g>
        </g>
      )
    }
    case 'ice-giant': {
      const colors = ['#7fb3c9', '#a8d3de', '#5a8fc9', '#9dc3d9']
      return (
        <g>
          {bands(colors)}
          {node.id === 'neptune' && (
            <g>
              <ellipse cx={430} cy={380} rx={20} ry={12} fill="#1f3a6e" />
              <path d="M480 300 q40 20 30 70 M420 280 q60 30 40 90" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
            </g>
          )}
          {node.id === 'uranus' && (
            <g transform={`rotate(90 ${C.x} ${C.y})`}>
              <ellipse cx={C.x} cy={C.y} rx={190} ry={34} fill="none" stroke="rgba(200,220,235,0.55)" strokeWidth="3" />
            </g>
          )}
        </g>
      )
    }
    case 'earth': {
      return (
        <g>
          <ellipse cx={500} cy={180} rx={70} ry={26} fill="#e8f0f5" />
          <ellipse cx={500} cy={480} rx={80} ry={28} fill="#e8f0f5" />
          <path d="M430 260 q30 -30 80 -10 q10 26 -18 44 q-44 6 -62 -34 Z" fill="#4f7a3a" />
          <path d="M560 300 q26 -26 60 -6 q6 30 -24 40 q-34 -2 -36 -34 Z" fill="#6b8f4a" />
          <path d="M460 380 q34 -20 70 4 q4 26 -28 30 q-40 -6 -42 -34 Z" fill="#8a7a3a" />
          <path d="M380 320 q30 -8 50 12 q-6 20 -36 16 q-18 -8 -14 -28 Z" fill="#5a8f4a" />
          <ellipse cx={430} cy={240} rx={60} ry={16} fill="rgba(255,255,255,0.5)" />
          <ellipse cx={600} cy={420} rx={70} ry={15} fill="rgba(255,255,255,0.42)" />
          <ellipse cx={470} cy={300} rx={54} ry={13} fill="rgba(255,255,255,0.35)" />
        </g>
      )
    }
    case 'moon': {
      return (
        <g>
          <ellipse cx={470} cy={250} rx={44} ry={30} fill="#9aa0a8" />
          <ellipse cx={560} cy={360} rx={36} ry={26} fill="#8a9098" />
          <ellipse cx={520} cy={430} rx={30} ry={22} fill="#9aa0a8" />
          {craters()}
        </g>
      )
    }
    case 'ice': {
      const base = <circle cx={C.x} cy={C.y} r={150} fill={`url(#${id}-ice)`} />
      if (node.id === 'europa')
        return (
          <g>
            {base}
            {cracks(7, '#b87333', 5)}
            <text x="500" y="70" textAnchor="middle" className="atlas-label">
              a frozen shell over a global ocean
            </text>
          </g>
        )
      if (node.id === 'enceladus')
        return (
          <g>
            {base}
            {Array.from({ length: 4 }).map((_, i) => (
              <path key={i} d={`M${430 + i * 26} 470 q10 -14 20 -6 q14 4 22 -8`} fill="none" stroke="#2b5a8f" strokeWidth="3" opacity="0.7" />
            ))}
            <path d="M470 180 q-4 -22 -14 -34 M520 180 q4 -24 16 -36" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" />
            <text x="500" y="70" textAnchor="middle" className="atlas-label">
              geysers of ocean, venting to space
            </text>
          </g>
        )
      if (node.id === 'triton')
        return (
          <g>
            {base}
            {Array.from({ length: 18 }).map((_, i) => {
              const x = 410 + rnd() * 180
              const y = 200 + rnd() * 260
              return <ellipse key={i} cx={x} cy={y} rx={8 + rnd() * 8} ry={5 + rnd() * 5} fill="rgba(155,184,217,0.4)" />
            })}
            <path d="M470 182 q-6 -18 -16 -26 M530 182 q4 -18 14 -26" stroke="rgba(255,255,255,0.75)" strokeWidth="2" fill="none" />
          </g>
        )
      if (node.id === 'titan')
        return (
          <g>
            {base}
            <ellipse cx={440} cy={280} rx={42} ry={26} fill="#1c2c4a" opacity="0.85" />
            <ellipse cx={570} cy={400} rx={34} ry={20} fill="#1c2c4a" opacity="0.8" />
            <ellipse cx={520} cy={230} rx={26} ry={14} fill="#1c2c4a" opacity="0.7" />
            <circle cx={C.x} cy={C.y} r={162} fill="none" stroke="rgba(201,162,39,0.3)" strokeWidth="6" />
            <text x="500" y="70" textAnchor="middle" className="atlas-label">
              seas of methane under an orange sky
            </text>
          </g>
        )
      return <g>{base}{craters()}</g>
    }
    default: {
      // rocky worlds
      return (
        <g>
          <circle cx={C.x} cy={C.y} r={150} fill={`url(#${id}-rocky)`} />
          {craters()}
          {node.id === 'mars' && (
            <g>
              <path d="M350 210 q150 8 300 2" fill="none" stroke="rgba(58,26,10,0.6)" strokeWidth="3" />
              <ellipse cx={540} cy={190} rx={20} ry={6} fill="rgba(255,255,255,0.85)" />
            </g>
          )}
          {node.id === 'mercury' && craters()}
        </g>
      )
    }
  }
}

function renderGlobe(node, children, pick) {
  const rnd = mulberry32(99)
  const parent = getParent(node.id)
  const hasMoons = children.length > 0
  return (
    <g>
      <defs>
        <radialGradient id={`${node.id}-ice`} cx="40%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#f2f5f8" />
          <stop offset="60%" stopColor="#dbe6ef" />
          <stop offset="100%" stopColor="#9db8d9" />
        </radialGradient>
        <radialGradient id={`${node.id}-rocky`} cx="40%" cy="35%" r="80%">
          <stop offset="0%" stopColor={node.palette[1]} />
          <stop offset="70%" stopColor={node.palette[0]} />
          <stop offset="100%" stopColor="#3a2417" />
        </radialGradient>
        <radialGradient id={`${node.id}-orb`} cx="42%" cy="32%" r="75%">
          <stop offset="0%" stopColor={node.palette[1]} />
          <stop offset="55%" stopColor={node.palette[0]} />
          <stop offset="100%" stopColor="#0c1624" />
        </radialGradient>
      </defs>
      {/* ambient glow */}
      <circle cx={C.x} cy={C.y} r={200} fill={`url(#${node.id}-glow)`} opacity="0.5" />
      <circle cx={C.x} cy={C.y} r={152} fill={`url(#${node.id}-orb)`} stroke="rgba(233,220,192,0.55)" strokeWidth="1.2" />
      <g clipPath={`url(#clip-${node.id})`}>
        <GlobeArt node={node} rnd={rnd} />
      </g>
      <defs>
        <clipPath id={`clip-${node.id}`}>
          <circle cx={C.x} cy={C.y} r={150} />
        </clipPath>
        <radialGradient id={`${node.id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={node.palette[0]} stopOpacity="0.55" />
          <stop offset="100%" stopColor={node.palette[0]} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* moons */}
      {hasMoons && (
        <g>
          {children.map((m, i) => {
            const ring = i % 2 === 0 ? 216 : 252
            const a = (i / Math.max(children.length, 2)) * Math.PI * 2 + 0.5
            const x = C.x + ring * Math.cos(a)
            const y = C.y + ring * 0.72 * Math.sin(a)
            return (
              <g key={m.id}>
                <ellipse cx={C.x} cy={C.y} rx={ring} ry={ring * 0.72} fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth="0.8" />
                <Clickable x={x} y={y} r={9} label={m.name} sub="descend" onPick={pick(m.id)} tint={m.palette[0]} />
              </g>
            )
          })}
        </g>
      )}
      {parent && (
        <text x={38} y={110} className="atlas-sublabel">
          child of: {parent.name}
        </text>
      )}
      {!hasMoons && (
        <text x="500" y="612" textAnchor="middle" className="atlas-hint">
          this world holds no further descent — its secrets are writ above
        </text>
      )}
    </g>
  )
}

// ── dispatcher ──────────────────────────────────────────────
const SCALES = {
  bubbles: 'no scale — beyond measure',
  web: '1 px ≈ 9 × 10⁷ light-years',
  cluster: '1 px ≈ 500,000 light-years',
  galaxies: '1 px ≈ 10,000 light-years',
  galaxy: '1 px ≈ 100 light-years',
  system: '1 px ≈ 2.6 × 10⁶ km',
  globe: '1 px ≈ 50 km',
}

export default function AtlasScene({ node, onPick }) {
  const children = getChildren(node.id)
  const pick = (id) => (e) => onPick(id, e)
  const sceneByType = {
    bubbles: renderBubbles,
    web: renderWeb,
    cluster: renderCluster,
    galaxies: renderGalaxies,
    galaxy: renderGalaxy,
    system: renderSystem,
    globe: renderGlobe,
  }
  const render = sceneByType[node.type] || renderGlobe

  return (
    <svg viewBox="0 0 1000 640" className="atlas-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="sky" cx="50%" cy="42%" r="75%">
          <stop offset="0%" stopColor="#0e1b2c" />
          <stop offset="70%" stopColor="#0a1220" />
          <stop offset="100%" stopColor="#060b14" />
        </radialGradient>
        <radialGradient id="bub-main" cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#1e3050" />
          <stop offset="60%" stopColor="#0e1b2c" />
          <stop offset="100%" stopColor="#050a12" />
        </radialGradient>
        <radialGradient id="attractor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(242,207,91,0.85)" />
          <stop offset="60%" stopColor="rgba(194,68,14,0.35)" />
          <stop offset="100%" stopColor="rgba(194,68,14,0)" />
        </radialGradient>
        <radialGradient id="bulge" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f2cf5b" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#c9a227" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="milkyway" cx="40%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#dbe6f2" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#9db8d9" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#5a7a9d" stopOpacity="0.15" />
        </radialGradient>
        <radialGradient id="andromeda" cx="40%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#e8e0d0" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#b9a97f" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8a7a58" stopOpacity="0.12" />
        </radialGradient>
        <radialGradient id="triangulum" cx="40%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#dbe6f2" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7fa3c9" stopOpacity="0.15" />
        </radialGradient>
        <radialGradient id="sunface" cx="42%" cy="36%" r="80%">
          <stop offset="0%" stopColor="#fff3c9" />
          <stop offset="35%" stopColor="#f2cf5b" />
          <stop offset="75%" stopColor="#c1440e" />
          <stop offset="100%" stopColor="#7a1f1f" />
        </radialGradient>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill="rgba(194,68,14,0.85)" />
        </marker>
      </defs>

      <rect width="1000" height="640" fill="url(#sky)" />
      <StarField count={node.type === 'web' ? 140 : 90} seed={node.type === 'web' ? 3 : 7} />
      {render(node, children, pick)}
      <Frame title={node.name} ancient={node.ancient} scale={SCALES[node.type] || ''} />
    </svg>
  )
}
