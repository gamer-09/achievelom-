import { useEffect, useState } from 'react'
import { fetchApod, fetchNews, formatDate } from '../api/news.js'
import { FALLBACK_NEWS } from '../data/fallbackNews.js'
import { ALMANAC } from '../data/lore.js'

const ATLAS_CHIPS = [
  { id: 'sky', label: 'The Sky Tonight', path: '/atlas' },
  { id: 'system', label: 'The Solar System', path: '/atlas/system' },
  { id: 'milkyway', label: 'The Milky Way (3D)', path: '/atlas/cosmos/milkyway' },
  { id: 'localgroup', label: 'The Local Group (3D)', path: '/atlas/cosmos/local-group' },
  { id: 'universe', label: 'The Observable Universe', path: '/atlas/cosmos/universe' },
  { id: 'multiverse', label: 'The Multiverse', path: '/atlas/cosmos/multiverse' },
  { id: 'sirius', label: 'Sirius', path: '/atlas?q=Sirius' },
  { id: 'sgra', label: 'Sagittarius A*', path: '/atlas?q=Sagittarius A*' },
]

const REAL_STATS = [
  { n: '9,027', l: 'real stars on the chart' },
  { n: '110', l: 'Messier deep-sky wonders' },
  { n: '58', l: 'black holes, pulsars & quasars' },
  { n: '22', l: 'dwarf planets, asteroids & comets' },
  { n: '10', l: 'spacecraft in true positions' },
]

export default function HomePage({ navigate }) {
  const [apod, setApod] = useState(null)
  const [news, setNews] = useState([])
  const [newsBadge, setNewsBadge] = useState(null)

  useEffect(() => {
    let alive = true
    const t = setTimeout(() => {
      // safety net: if the heavens are unreachable, stop the wait after 15s
      alive && setApod({ title: null, explanation: null, image: null, cached: false, fallback: true })
      alive && setNews((n) => (n.length ? n : FALLBACK_NEWS))
      alive && setNewsBadge((b) => b || 'archival scroll')
    }, 15000)
    fetchApod().then((a) => alive && setApod(a))
    fetchNews().then((r) => {
      if (!alive) return
      setNews(r.articles.slice(0, 3))
      setNewsBadge(r.fallback ? 'archival scroll' : r.cached ? 'from the vault' : 'live')
    })
    return () => {
      alive = false
      clearTimeout(t)
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
          <div className="hero-eyebrow">A real map of a real sky · drawn across the ages</div>
          <h1 className="hero-title">Cosmographia</h1>
          <p className="hero-tagline">
            Not a diagram — a map. Thousands of real stars, the true positions of the
            planets for today, every wonder of Messier's list, and the falling stars of
            the year, plotted from actual astronomical data. Drag to wander, scroll to
            descend, click any light to read what is known of it.
          </p>
          <div className="hero-cta">
            <button className="btn gold" onClick={() => navigate('/atlas')}>
              ✦ Open the Map
            </button>
            <button className="btn ghost" onClick={() => navigate('/atlas/system')}>
              ☉ The Solar System today
            </button>
            <button className="btn ghost" onClick={() => navigate('/chronicles')}>
              Read the Chronicles
            </button>
          </div>
        </div>
        <div className="hero-rays" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} style={{ transform: `rotate(${i * 20}deg)` }} />
          ))}
        </div>
      </section>

      {/* ── real stats ── */}
      <section className="stats-row" style={{ marginTop: 40 }}>
        {REAL_STATS.map((s) => (
          <div key={s.l} className="stat">
            <span className="stat-num">{s.n}</span>
            <span className="stat-lbl">{s.l}</span>
          </div>
        ))}
      </section>

      {/* ── jump into the map ── */}
      <section style={{ marginTop: 84 }}>
        <div className="section-title-wrap">
          <h2 className="section-title">Enter the Chart</h2>
          <p className="section-note">real data · real positions · click anything</p>
        </div>
        <div className="chip-wall">
          {ATLAS_CHIPS.map((c) => (
            <button key={c.id} className="chip gold big" onClick={() => navigate(c.path)}>
              {c.label}
            </button>
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
