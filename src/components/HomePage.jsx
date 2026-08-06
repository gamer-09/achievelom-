import { useEffect, useState } from 'react'
import { fetchApod, fetchNews, formatDate } from '../api/news.js'
import { ALMANAC } from '../data/lore.js'

const ATLAS_CHIPS = [
  { id: 'multiverse', label: 'Multiverse' },
  { id: 'universe', label: 'Observable Universe' },
  { id: 'milky-way', label: 'Milky Way' },
  { id: 'solar-system', label: 'Solar System' },
  { id: 'earth', label: 'Earth' },
  { id: 'jupiter', label: 'Jupiter' },
  { id: 'mars', label: 'Mars' },
  { id: 'europa', label: 'Europa' },
]

export default function HomePage({ navigate }) {
  const [apod, setApod] = useState(null)
  const [news, setNews] = useState([])
  const [newsBadge, setNewsBadge] = useState(null)

  useEffect(() => {
    let alive = true
    fetchApod().then((a) => alive && setApod(a))
    fetchNews().then((r) => {
      if (!alive) return
      setNews(r.articles.slice(0, 3))
      setNewsBadge(r.fallback ? 'archival scroll' : r.cached ? 'from the vault' : 'live')
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="page container">
      {/* ── hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <img src="/hero.jpg" alt="" />
        </div>
        <div className="hero-inner">
          <div className="hero-eyebrow">An atlas drawn across the ages · from the Babylonians to the Webb</div>
          <h1 className="hero-title">Cosmographia</h1>
          <p className="hero-tagline">
            Every age has drawn the heavens its own way. Here the old maps and the new
            discoveries meet: descend from the infinite aeons to the moons of the outer
            dark, and read what the modern sky-watchers have recently learned.
          </p>
          <div className="hero-cta">
            <button className="btn gold" onClick={() => navigate('/atlas')}>
              ✦ Open the Atlas
            </button>
            <button className="btn ghost" onClick={() => navigate('/chronicles')}>
              Read the Chronicles
            </button>
            <button className="btn ghost" onClick={() => navigate('/lore')}>
              The Lore of the Heavens
            </button>
          </div>
        </div>
        <div className="hero-rays" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} style={{ transform: `rotate(${i * 20}deg)` }} />
          ))}
        </div>
      </section>

      {/* ── wonder of the day ── */}
      <section style={{ marginTop: 84 }}>
        <div className="section-title-wrap">
          <h2 className="section-title">Wonder of the Day</h2>
          <p className="section-note">courtesy of NASA's astronomy picture of the day</p>
        </div>
        <div className="panel wonder">
          {!apod ? (
            <p className="empty-note">consulting the celestial records…</p>
          ) : apod.fallback ? (
            <p className="empty-note">
              The heavens are unreachable at present. Return when the skies clear.
            </p>
          ) : (
            <div className="wonder-grid">
              <div className="wonder-img">
                <img src={apod.image} alt={apod.title} loading="lazy" />
              </div>
              <div className="wonder-body">
                <p className="wonder-date">{apod.date}</p>
                <h3>{apod.title}</h3>
                <p className="wonder-explain">{apod.explanation}</p>
                {apod.copyright && <p className="wonder-credit">image: {apod.copyright}</p>}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── descend the great chain ── */}
      <section style={{ marginTop: 84 }}>
        <div className="section-title-wrap">
          <h2 className="section-title">Descend the Great Chain</h2>
          <p className="section-note">from the aeons to the ocean moons</p>
        </div>
        <div className="chip-wall">
          {ATLAS_CHIPS.map((c) => (
            <button key={c.id} className="chip gold big" onClick={() => navigate(`/atlas/${c.id}`)}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="chain-visual panel">
          <div className="chain-row">
            {['Multiverse', 'Universe', 'Laniakea', 'Local Group', 'Milky Way', 'Solar System', 'Worlds', 'Moons'].map((step, i, arr) => (
              <div key={step} className={`chain-step ${i === arr.length - 1 ? 'last' : ''}`}>
                <span className="chain-dot" />
                <span className="chain-name">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── almanac ── */}
      <section style={{ marginTop: 84 }}>
        <div className="section-title-wrap">
          <h2 className="section-title">Almanac of Coming Skies</h2>
          <p className="section-note">when the heavens next perform</p>
        </div>
        <div className="almanac-grid">
          {ALMANAC.map((e, i) => (
            <div key={i} className="almanac-card panel">
              <span className="almanac-when">{e.when}</span>
              <h3>{e.what}</h3>
              <p>{e.how}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── recent chronicles ── */}
      <section style={{ marginTop: 84 }}>
        <div className="section-title-wrap">
          <h2 className="section-title">Latest from the Chronicles</h2>
          <p className="section-note">{newsBadge || 'live'} · spaceflight news</p>
        </div>
        <div className="news-grid">
          {news.map((a) => (
            <a key={a.id || a.title} href={a.url} target="_blank" rel="noreferrer" className="news-card panel">
              <span className="news-date">{formatDate(a.date)}</span>
              <h3>{a.title}</h3>
              <p>{a.summary}</p>
              <span className="news-source">{a.source}</span>
            </a>
          ))}
        </div>
        <div style={{ marginTop: 22, textAlign: 'center' }}>
          <button className="btn gold" onClick={() => navigate('/chronicles')}>
            Read the full chronicle →
          </button>
        </div>
      </section>

      {/* ── cta ── */}
      <section className="panel cta-panel" style={{ marginTop: 84 }}>
        <div className="corner-frame">
          <p className="lore-quote">"The sky is not a ceiling. It is an index."</p>
          <p className="cta-sub">— carved over the door of the first observatory</p>
          <button className="btn gold" onClick={() => navigate('/atlas')} style={{ marginTop: 18 }}>
            ✦ Begin the descent
          </button>
        </div>
      </section>
    </div>
  )
}
