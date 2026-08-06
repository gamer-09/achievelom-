import { useEffect, useRef, useState } from 'react'
import AtlasScene from './AtlasScene.jsx'
import { getNode, pathTo, ROOT_ID } from '../data/cosmos.js'

export default function Atlas({ startId = null, navigate }) {
  const [path, setPath] = useState(() => (startId && getNode(startId) ? pathTo(startId) : [ROOT_ID]))
  const [sceneKey, setSceneKey] = useState(0)
  const [anim, setAnim] = useState(null) // {dir:'in'|'out', origin:{x,y}}
  const [busy, setBusy] = useState(false)
  const stageRef = useRef(null)

  const node = getNode(path[path.length - 1])

  useEffect(() => {
    // entering animation: from scaled state to normal
    if (!anim) return
    const el = stageRef.current
    if (!el) return
    const start = anim.dir === 'in' ? 3.2 : 0.28
    el.style.transition = 'none'
    el.style.transformOrigin = `${anim.origin.x}% ${anim.origin.y}%`
    el.style.transform = `scale(${start})`
    el.style.opacity = '0'
    void el.offsetWidth // force reflow
    el.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.24,1), opacity 0.5s ease'
    el.style.transform = 'scale(1)'
    el.style.opacity = '1'
    const t = setTimeout(() => setAnim(null), 560)
    return () => clearTimeout(t)
  }, [sceneKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const descendTo = (id, origin = { x: 50, y: 50 }) => {
    if (busy || path.includes(id)) return
    setBusy(true)
    const el = stageRef.current
    if (el) {
      el.style.transition = 'transform 0.42s cubic-bezier(0.5,0,0.3,1), opacity 0.42s ease'
      el.style.transformOrigin = `${origin.x}% ${origin.y}%`
      el.style.transform = 'scale(3.2)'
      el.style.opacity = '0'
    }
    setTimeout(() => {
      setPath((p) => [...p, id])
      setSceneKey((k) => k + 1)
      setAnim({ dir: 'in', origin })
      setBusy(false)
    }, 430)
  }

  const ascend = () => {
    if (path.length <= 1) return
    setBusy(true)
    const origin = { x: 50, y: 50 }
    const el = stageRef.current
    if (el) {
      el.style.transition = 'transform 0.4s cubic-bezier(0.5,0,0.3,1), opacity 0.4s ease'
      el.style.transformOrigin = '50% 50%'
      el.style.transform = 'scale(0.28)'
      el.style.opacity = '0'
    }
    setTimeout(() => {
      setPath((p) => p.slice(0, -1))
      setSceneKey((k) => k + 1)
      setAnim({ dir: 'out', origin })
      setBusy(false)
    }, 410)
  }

  const jumpTo = (idx) => {
    if (busy || idx >= path.length - 1) return
    setBusy(true)
    const origin = { x: 50, y: 50 }
    const el = stageRef.current
    if (el) {
      el.style.transition = 'transform 0.3s ease, opacity 0.3s ease'
      el.style.transformOrigin = '50% 50%'
      el.style.transform = 'scale(2.2)'
      el.style.opacity = '0'
    }
    setTimeout(() => {
      setPath((p) => p.slice(0, idx + 1))
      setSceneKey((k) => k + 1)
      setAnim({ dir: 'in', origin })
      setBusy(false)
    }, 310)
  }

  const onPick = (id, e) => {
    if (busy) return
    const el = stageRef.current
    let origin = { x: 50, y: 50 }
    if (el && e && e.clientX != null) {
      const rect = el.getBoundingClientRect()
      origin = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      }
    }
    descendTo(id, origin)
  }

  const children = node ? (node.children || []).map(getNode).filter(Boolean) : []
  const parent = path.length > 1 ? getNode(path[path.length - 2]) : null

  if (!node) {
    return (
      <div className="page container">
        <div className="panel" style={{ padding: '60px 30px', textAlign: 'center' }}>
          <div className="corner-frame" style={{ padding: 30 }}>
            <p className="empty-note">The chart holds no entry for that sphere.</p>
            <button className="btn gold" onClick={() => navigate('/atlas')}>
              ← Return to the root of the atlas
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page container">
      <div className="atlas-head">
        <div>
          <p className="eyebrow">The great chain of being</p>
          <h1 className="page-title">The Celestial Atlas</h1>
        </div>
        <div className="atlas-actions">
          <button className="btn gold" onClick={ascend} disabled={busy || path.length <= 1}>
            ⟲ Ascend
          </button>
          <button className="btn ghost" onClick={() => jumpTo(0)} disabled={busy || path.length <= 1}>
            Reset
          </button>
        </div>
      </div>

      {/* breadcrumb */}
      <nav className="crumb" aria-label="You are here">
        {path.map((id, i) => {
          const n = getNode(id)
          const last = i === path.length - 1
          return (
            <span key={id} className="crumb-item">
              {i > 0 && <span className="crumb-sep">›</span>}
              {last ? (
                <span className="crumb-here">{n.name}</span>
              ) : (
                <button className="crumb-link" onClick={() => jumpTo(i)}>
                  {n.name}
                </button>
              )}
            </span>
          )
        })}
      </nav>

      <div className="atlas-layout">
        {/* the chart */}
        <div className="atlas-stage-wrap">
          <div className="atlas-stage" ref={stageRef}>
            <AtlasScene key={sceneKey} node={node} onPick={onPick} />
          </div>
          {busy && <div className="atlas-busy" aria-hidden="true" />}
        </div>

        {/* the ledger */}
        <aside className="panel ledger">
          <div className="ledger-glyph" aria-hidden="true">
            {node.glyph}
          </div>
          <h2 className="ledger-name">{node.name}</h2>
          <div className="ledger-ancient">{node.ancient}</div>

          <p className="ledger-summary">{node.summary}</p>

          <div className="ledger-section-title">The Astronomer's Ledger</div>
          <dl className="ledger-list">
            {node.ledger.map((row) => (
              <div key={row.k} className="ledger-row">
                <dt>{row.k}</dt>
                <dd>{row.v}</dd>
              </div>
            ))}
          </dl>

          <div className="ledger-section-title">Wisdom of the ancients</div>
          <ul className="ledger-facts">
            {node.facts.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>

          {node.discoveries?.length > 0 && (
            <>
              <div className="ledger-section-title">Recent discoveries</div>
              <ul className="ledger-facts discoveries">
                {node.discoveries.map((d, i) => (
                  <li key={i}>
                    <span className="disc-year">{d.year}</span>
                    {d.text}
                  </li>
                ))}
              </ul>
            </>
          )}

          {children.length > 0 && (
            <>
              <div className="ledger-section-title">Descend to</div>
              <div className="ledger-descend">
                {children.map((c) => (
                  <button key={c.id} className="chip gold" onClick={() => descendTo(c.id)}>
                    {c.glyph} {c.name}
                  </button>
                ))}
              </div>
            </>
          )}

          {parent && (
            <button className="btn ghost ledger-ascend" onClick={ascend}>
              ⟲ Ascend to {parent.name}
            </button>
          )}
        </aside>
      </div>
    </div>
  )
}
