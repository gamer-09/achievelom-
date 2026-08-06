import { useState } from 'react'
import { CONSTELLATIONS, SAGES, GLOSSARY } from '../data/lore.js'

function ConstellationMap({ c }) {
  const max = (arr, f) => Math.max(...arr.map(f))
  const min = (arr, f) => Math.min(...arr.map(f))
  const xs = c.points.map((p) => p[0])
  const ys = c.points.map((p) => p[1])
  const xmin = min(xs), xmax = max(xs)
  const ymin = min(ys), ymax = max(ys)
  const norm = (p) => [40 + ((p[0] - xmin) / (xmax - xmin || 1)) * 220, 40 + ((p[1] - ymin) / (ymax - ymin || 1)) * 150]
  const pts = c.points.map(norm)
  return (
    <svg viewBox="0 0 300 230" className="const-map">
      <rect width="300" height="230" fill="rgba(10,18,32,0.6)" rx="8" />
      <circle cx="150" cy="115" r="98" fill="none" stroke="rgba(212,175,55,0.25)" strokeWidth="1" />
      <circle cx="150" cy="115" r="82" fill="none" stroke="rgba(212,175,55,0.12)" strokeWidth="0.8" />
      {c.lines.map(([a, b], i) => (
        <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke="rgba(212,175,55,0.65)" strokeWidth="1.2" />
      ))}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="4.4" fill="rgba(10,18,32,0.9)" stroke="#f2cf5b" strokeWidth="1.3" />
          <circle cx={p[0]} cy={p[1]} r="1.4" fill="#f2cf5b" />
        </g>
      ))}
      <text x="150" y="212" textAnchor="middle" className="const-caption">
        {c.latin} · {c.brightStars[0]}
      </text>
    </svg>
  )
}

export default function Lore() {
  const [tab, setTab] = useState('constellations')

  return (
    <div className="page container">
      <p className="eyebrow">Stories the sky has told</p>
      <h1 className="page-title">The Lore of the Heavens</h1>
      <p className="page-sub">
        Before telescopes, there were stories. Before equations, there were the sages.
        Before light-years, there were words to reach for the stars.
      </p>

      <div className="lore-tabs">
        {[
          ['constellations', 'Constellations'],
          ['sages', 'The Sages'],
          ['glossary', 'Glossary'],
        ].map(([id, label]) => (
          <button key={id} className={`chip gold big ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'constellations' && (
        <div className="const-grid">
          {CONSTELLATIONS.map((c) => (
            <div key={c.id} className="panel const-card">
              <div className="corner-frame">
                <h3 className="const-name">{c.name}</h3>
                <p className="const-culture">{c.culture}</p>
                <ConstellationMap c={c} />
                <p className="const-story">{c.story}</p>
                <div className="char-tags">
                  {c.brightStars.map((s) => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'sages' && (
        <div className="sages">
          {SAGES.map((s, i) => (
            <div key={s.name} className="sage-row panel">
              <div className="corner-frame sage-inner">
                <span className="sage-glyph">{s.glyph}</span>
                <div className="sage-body">
                  <h3>{s.name}</h3>
                  <p className="sage-era">{s.era}</p>
                  <p>{s.deed}</p>
                </div>
                <span className="sage-index">{String(i + 1).padStart(2, '0')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'glossary' && (
        <div className="glossary">
          {GLOSSARY.map((g) => (
            <div key={g.term} className="panel glossary-item">
              <div className="corner-frame">
                <h3>{g.term}</h3>
                <p>{g.def}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
