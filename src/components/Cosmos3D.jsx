import { memo, useEffect, useMemo, useRef, useState } from 'react'

const D2R = Math.PI / 180
const V = 520 // viewBox size
const C = V / 2
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const MIN_K = 0.5
const MAX_K = 150

// screen-size factor: points stay ~constant size, grow a little when deep-zoomed
const sizeF = (k) => Math.min(1.5, Math.sqrt(k))

// ── static layer: batched projected points (constant screen sizes) ──
const ProjectedLayer = memo(function ProjectedLayer({ objs, rotY, rotX, k, range, tx, ty }) {
  const cosY = Math.cos(rotY * D2R), sinY = Math.sin(rotY * D2R)
  const cosX = Math.cos(rotX * D2R), sinX = Math.sin(rotX * D2R)
  const S = (C / range) * k
  const f = sizeF(k)
  const pxW = (r) => Math.max(0.5, r * f)

  const buckets = new Map() // key -> {color, w, arr, op}
  const glyphs = []
  for (const o of objs) {
    const x1 = o.x * cosY + o.z * sinY
    const z1 = -o.x * sinY + o.z * cosY
    const y1 = o.y * cosX - z1 * sinX
    const z2 = o.y * sinX + z1 * cosX
    const sx = C + x1 * S + tx
    const sy = C - y1 * S + ty
    const depth = clamp((z2 / range + 1) / 2, 0, 1)
    if (o.kind === 'glyph') {
      glyphs.push({ ...o, sx, sy, depth, z2 })
      continue
    }
    const w = pxW(o.r)
    const band = depth < 0.33 ? 0 : depth < 0.66 ? 1 : 2
    const op = [0.35, 0.65, 0.95][band]
    const key = `${o.color}|${w.toFixed(1)}|${band}`
    let b = buckets.get(key)
    if (!b) {
      b = { color: o.color, w, op, arr: [] }
      buckets.set(key, b)
    }
    b.arr.push(`M${sx.toFixed(1)} ${sy.toFixed(1)}l${w.toFixed(2)} 0`)
  }
  return (
    <g>
      {[...buckets.values()].map((b, i) => (
        <path key={i} d={b.arr.join('')} stroke={b.color} strokeWidth={b.w} strokeLinecap="round" opacity={b.op} fill="none" />
      ))}
      {glyphs.map((g) => (
        <g key={g.id} className="c3d-glyph" style={{ opacity: 0.35 + 0.65 * g.depth }}>
          {g.shape === 'ring' ? (
            <circle cx={g.sx} cy={g.sy} r={pxW(g.r)} fill="none" stroke={g.color} strokeWidth={Math.max(1, 1.1 * f)} />
          ) : g.shape === 'cross' ? (
            <g stroke={g.color} strokeWidth={Math.max(1, 1.2 * f)}>
              <line x1={g.sx - pxW(g.r)} y1={g.sy} x2={g.sx + pxW(g.r)} y2={g.sy} />
              <line x1={g.sx} y1={g.sy - pxW(g.r)} x2={g.sx} y2={g.sy + pxW(g.r)} />
            </g>
          ) : (
            <circle cx={g.sx} cy={g.sy} r={pxW(g.r)} fill={g.color} stroke="rgba(10,18,32,0.7)" strokeWidth={Math.max(0.6, 0.7 * f)} />
          )}
          {g.label && k >= (g.labelK || 2) && (
            <text x={g.sx} y={g.sy - pxW(g.r) - 4} textAnchor="middle" fontSize={Math.min(16, 9 * Math.sqrt(k))} fill={g.color} style={{ fontFamily: `'Cinzel', serif`, pointerEvents: 'none' }}>
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
  objects, range, unit,
  view = { rotY: -35, rotX: 22, k: 1 },
  hint, onSelect, selected,
  children,
}) {
  const [rotY, setRotY] = useState(view.rotY)
  const [rotX, setRotX] = useState(view.rotX)
  const [k, setK] = useState(view.k)
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)
  const [hover, setHover] = useState(null)
  const svgRef = useRef(null)
  const dragRef = useRef(null)
  const hoverFrame = useRef(null)

  const S0 = C / range // scale at k=1

  // project a 3D point to screen coords (world -> viewBox px)
  const project = useMemo(() => {
    const cosY = Math.cos(rotY * D2R), sinY = Math.sin(rotY * D2R)
    const cosX = Math.cos(rotX * D2R), sinX = Math.sin(rotX * D2R)
    return (o) => {
      const x1 = o.x * cosY + o.z * sinY
      const z1 = -o.x * sinY + o.z * cosY
      const y1 = o.y * cosX - z1 * sinX
      const z2 = o.y * sinX + z1 * cosX
      return { sx: C + x1 * S0 * k + tx, sy: C - y1 * S0 * k + ty, z2 }
    }
  }, [rotY, rotX, k, tx, ty, S0])

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const ux = ((e.clientX - rect.left) / rect.width) * V
      const uy = ((e.clientY - rect.top) / rect.height) * V
      setK((prev) => {
        const nk = clamp(prev * Math.exp(-e.deltaY * 0.0015), MIN_K, MAX_K)
        // keep the world point under the cursor fixed (cursor-anchored zoom)
        const S = S0 * prev
        const wx = (ux - C - tx) / S
        const wy = (uy - C - ty) / S
        const Sn = S0 * nk
        setTx(ux - C - wx * Sn)
        setTy(uy - C + wy * Sn)
        return nk
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [S0, tx, ty])

  const onPointerDown = (e) => {
    dragRef.current = { x: e.clientX, y: e.clientY, ry: rotY, rx: rotX, txx: tx, tyy: ty, moved: false, pan: e.shiftKey }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    const d = dragRef.current
    if (d) {
      const dx = e.clientX - d.x
      const dy = e.clientY - d.y
      if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true
      if (d.pan) {
        setTx(clamp(d.txx + dx, -V * 6, V * 6))
        setTy(clamp(d.tyy + dy, -V * 6, V * 6))
      } else {
        setRotY(d.ry + dx * 0.4)
        setRotX(clamp(d.rx + dy * 0.4, -88, 88))
      }
    } else {
      if (hoverFrame.current) return
      hoverFrame.current = requestAnimationFrame(() => {
        hoverFrame.current = null
        const el = svgRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const ux = ((e.clientX - rect.left) / rect.width) * V
        const uy = ((e.clientY - rect.top) / rect.height) * V
        setHover(pickAt(ux, uy))
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
      if (hit) {
        if (onSelect) onSelect(hit)
        focusOn(hit)
      }
    }
  }

  const pickAt = (ux, uy, click = false) => {
    const thr = click ? 26 : 18
    let best = null
    let bestD = thr
    for (const o of objects) {
      const p = project(o)
      const d = Math.hypot(p.sx - ux, p.sy - uy)
      if (d < bestD) {
        bestD = d
        best = o
      }
    }
    return best
  }

  // center the camera on an object and zoom so its neighbourhood fills the view
  const focusOn = (o) => {
    const dist = Math.hypot(o.x, o.y, o.z) || 0.01
    const nk = clamp((C * 0.55) / (S0 * dist), 1.5, MAX_K)
    const cosY = Math.cos(rotY * D2R), sinY = Math.sin(rotY * D2R)
    const cosX = Math.cos(rotX * D2R), sinX = Math.sin(rotX * D2R)
    const x1 = o.x * cosY + o.z * sinY
    const z1 = -o.x * sinY + o.z * cosY
    const y1 = o.y * cosX - z1 * sinX
    const S = S0 * nk
    setK(nk)
    setTx(-x1 * S)
    setTy(y1 * S)
  }

  const reset = () => {
    setRotY(view.rotY)
    setRotX(view.rotX)
    setK(view.k)
    setTx(0)
    setTy(0)
  }
  const zoom = (f) => {
    setK((prev) => {
      const nk = clamp(prev * f, MIN_K, MAX_K)
      const S = S0 * prev
      const Sn = S0 * nk
      // keep center anchored
      const wx = (C - C - tx) / S
      const wy = (C - C - ty) / S
      setTx(-wx * Sn)
      setTy(wy * Sn)
      return nk
    })
  }

  const selProj = selected ? project(selected) : null

  return (
    <div className="c3d">
      <div className="c3d-hint">{hint}</div>
      <div className="c3d-stage">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${V} ${V}`}
          className="sky-svg c3d-svg"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={() => { dragRef.current = null; setHover(null) }}
        >
          <defs>
            <radialGradient id="c3dbg" cx="50%" cy="45%" r="75%">
              <stop offset="0%" stopColor="#0e1b2c" />
              <stop offset="100%" stopColor="#060b14" />
            </radialGradient>
          </defs>
          <rect width={V} height={V} fill="url(#c3dbg)" />
          {/* fixed background stars (do not rotate) */}
          {BACK_STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.c} opacity={s.o} />
          ))}
          <ProjectedLayer objs={objects} rotY={rotY} rotX={rotX} k={k} range={range} tx={tx} ty={ty} />
          {children}
          {selProj && (
            <circle cx={selProj.sx} cy={selProj.sy} r={Math.max(7, 18 / Math.sqrt(k))} fill="none" stroke="#f2cf5b" strokeWidth={1.4} className="sel-ring" style={{ pointerEvents: 'none' }} />
          )}
          <text x={C} y={V - 12} textAnchor="middle" fontSize={11} fill="rgba(179,162,124,0.65)" style={{ fontFamily: `'EB Garamond', serif`, fontStyle: 'italic' }}>
            drag to turn · shift+drag to move · scroll to descend · click a light to fly to it · {unit}
          </text>
        </svg>

        <div className="c3d-controls">
          <button title="Zoom in" onClick={() => zoom(1.7)}>+</button>
          <button title="Zoom out" onClick={() => zoom(1 / 1.7)}>−</button>
          <button title="Reset view" onClick={reset}>⌂</button>
        </div>

        {hover && hover.info && (
          <div className="c3d-tip">
            {hover.info.name || 'A light of the deep'}
          </div>
        )}
      </div>
    </div>
  )
}

// seeded background starfield (fixed, doesn't rotate — feels like looking at the sky)
const BACK_STARS = (() => {
  let seed = 42
  const rnd = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  const cols = ['#cfe0f2', '#9db8d9', '#f2ecd8']
  return Array.from({ length: 150 }, () => ({
    x: rnd() * V,
    y: rnd() * V,
    r: 0.4 + rnd() * 0.9,
    o: 0.25 + rnd() * 0.5,
    c: cols[Math.floor(rnd() * cols.length)],
  }))
})()
