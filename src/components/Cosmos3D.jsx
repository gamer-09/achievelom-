import { memo, useEffect, useMemo, useRef, useState } from 'react'

const D2R = Math.PI / 180
const V = 520 // viewBox size
const C = V / 2
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

// ── static layer: batched projected points ──────────────────
// objects: [{id,x,y,z,r,color,mag?,kind}]
const ProjectedLayer = memo(function ProjectedLayer({ objs, rotY, rotX, k, range }) {
  const cosY = Math.cos(rotY * D2R), sinY = Math.sin(rotY * D2R)
  const cosX = Math.cos(rotX * D2R), sinX = Math.sin(rotX * D2R)
  const S = (C / range) * k
  const pxR = (r) => Math.max(0.4, r * k)

  // group by color + size bucket -> batched paths
  const buckets = new Map() // key -> {color, r, arr}
  const glyphs = []
  for (const o of objs) {
    const x1 = o.x * cosY + o.z * sinY
    const z1 = -o.x * sinY + o.z * cosY
    const y1 = o.y * cosX - z1 * sinX
    const z2 = o.y * sinX + z1 * cosX
    const sx = C + x1 * S
    const sy = C - y1 * S
    const depth = clamp((z2 / range + 1) / 2, 0, 1) // 0 far .. 1 near
    if (o.kind === 'glyph') {
      glyphs.push({ ...o, sx, sy, depth, z2 })
      continue
    }
    const w = pxR(o.r)
    const key = `${o.color}|${w.toFixed(1)}`
    let b = buckets.get(key)
    if (!b) {
      b = { color: o.color, r: w, arr: [] }
      buckets.set(key, b)
    }
    b.arr.push(`M${sx.toFixed(1)} ${sy.toFixed(1)}l${w.toFixed(2)} 0`)
  }
  return (
    <g>
      {[...buckets.values()].map((b, i) => (
        <path key={i} d={b.arr.join('')} stroke={b.color} strokeWidth={b.r} strokeLinecap="round" opacity={0.9} fill="none" />
      ))}
      {glyphs.map((g) => (
        <g key={g.id} className="c3d-glyph" style={{ opacity: 0.35 + 0.65 * g.depth }}>
          {g.shape === 'ring' ? (
            <circle cx={g.sx} cy={g.sy} r={pxR(g.r)} fill="none" stroke={g.color} strokeWidth={Math.max(1, k * 0.9)} />
          ) : g.shape === 'cross' ? (
            <g stroke={g.color} strokeWidth={Math.max(1, k * 0.8)}>
              <line x1={g.sx - pxR(g.r)} y1={g.sy} x2={g.sx + pxR(g.r)} y2={g.sy} />
              <line x1={g.sx} y1={g.sy - pxR(g.r)} x2={g.sx} y2={g.sy + pxR(g.r)} />
            </g>
          ) : (
            <circle cx={g.sx} cy={g.sy} r={pxR(g.r)} fill={g.color} stroke="rgba(10,18,32,0.7)" strokeWidth={Math.max(0.6, k * 0.5)} />
          )}
          {g.label && k >= (g.labelK || 2) && (
            <text x={g.sx} y={g.sy - pxR(g.r) - 3} textAnchor="middle" fontSize={Math.max(8, 9 * Math.sqrt(k))} fill={g.color} style={{ fontFamily: `'Cinzel', serif`, pointerEvents: 'none' }}>
              {g.label}
            </text>
          )}
        </g>
      ))}
    </g>
  )
})

// ── main viewer ──────────────────────────────────────────────
export default function Cosmos3D({
  objects, range, unit, baseR = 1.4,
  view = { rotY: -35, rotX: 22, k: 1 },
  hint, onSelect, selected, onHover,
  children,
}) {
  const [rotY, setRotY] = useState(view.rotY)
  const [rotX, setRotX] = useState(view.rotX)
  const [k, setK] = useState(view.k)
  const svgRef = useRef(null)
  const dragRef = useRef(null)
  const hoverRef = useRef(null)

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      setK((prev) => clamp(prev * Math.exp(-e.deltaY * 0.002), 0.4, 60))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const onPointerDown = (e) => {
    dragRef.current = { x: e.clientX, y: e.clientY, ry: rotY, rx: rotX, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    const d = dragRef.current
    if (d) {
      const dx = e.clientX - d.x
      const dy = e.clientY - d.y
      if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true
      setRotY(d.ry + dx * 0.4)
      setRotX(clamp(d.rx + dy * 0.4, -88, 88))
    } else {
      const el = svgRef.current
      if (!el || !onHover) return
      const rect = el.getBoundingClientRect()
      const ux = ((e.clientX - rect.left) / rect.width) * V
      const uy = ((e.clientY - rect.top) / rect.height) * V
      if (hoverRef.current) cancelAnimationFrame(hoverRef.current)
      hoverRef.current = requestAnimationFrame(() => {
        const hit = pickAt(ux, uy)
        onHover(hit)
      })
    }
  }
  const onPointerUp = (e) => {
    const d = dragRef.current
    dragRef.current = null
    if (d && !d.moved) {
      const el = svgRef.current
      const rect = el.getBoundingClientRect()
      const ux = ((e.clientX - rect.left) / rect.width) * V
      const uy = ((e.clientY - rect.top) / rect.height) * V
      const hit = pickAt(ux, uy, true)
      if (onSelect) onSelect(hit)
    }
  }

  const pickAt = (ux, uy, click = false) => {
    const cosY = Math.cos(rotY * D2R), sinY = Math.sin(rotY * D2R)
    const cosX = Math.cos(rotX * D2R), sinX = Math.sin(rotX * D2R)
    const S = (C / range) * k
    const thr = (click ? 22 : 16) / (k || 1)
    let best = null
    let bestD = thr
    for (const o of objects) {
      const x1 = o.x * cosY + o.z * sinY
      const z1 = -o.x * sinY + o.z * cosY
      const y1 = o.y * cosX - z1 * sinX
      const sx = C + x1 * S
      const sy = C - y1 * S
      const d = Math.hypot(sx - ux, sy - uy)
      if (d < bestD) {
        bestD = d
        best = o
      }
    }
    return best
  }

  const selProj = useMemo(() => {
    if (!selected) return null
    const cosY = Math.cos(rotY * D2R), sinY = Math.sin(rotY * D2R)
    const cosX = Math.cos(rotX * D2R), sinX = Math.sin(rotX * D2R)
    const S = (C / range) * k
    const x1 = selected.x * cosY + selected.z * sinY
    const z1 = -selected.x * sinY + selected.z * cosY
    const y1 = selected.y * cosX - z1 * sinX
    return { sx: C + x1 * S, sy: C - y1 * S }
  }, [selected, rotY, rotX, k, range])

  return (
    <div className="c3d">
      <div className="c3d-hint">{hint}</div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${V} ${V}`}
        className="sky-svg c3d-svg"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => { dragRef.current = null; onHover && onHover(null) }}
      >
        <rect width={V} height={V} fill="url(#c3dbg)" />
        <defs>
          <radialGradient id="c3dbg" cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor="#0e1b2c" />
            <stop offset="100%" stopColor="#060b14" />
          </radialGradient>
        </defs>
        <ProjectedLayer objs={objects} rotY={rotY} rotX={rotX} k={k} range={range} baseR={baseR} />
        {children}
        {selProj && (
          <circle cx={selProj.sx} cy={selProj.sy} r={Math.max(6, 18 / (k || 1))} fill="none" stroke="#f2cf5b" strokeWidth={1.4} className="sel-ring" style={{ pointerEvents: 'none' }} />
        )}
        <text x={C} y={V - 14} textAnchor="middle" fontSize={11} fill="rgba(179,162,124,0.6)" style={{ fontFamily: `'EB Garamond', serif`, fontStyle: 'italic' }}>
          drag to turn · scroll to descend · click a light to read it · {unit}
        </text>
      </svg>
    </div>
  )
}
