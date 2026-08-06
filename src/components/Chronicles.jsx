import { useEffect, useState } from 'react'
import { fetchNews, formatDate } from '../api/news.js'

export default function Chronicles() {
  const [articles, setArticles] = useState(null)
  const [state, setState] = useState('loading') // loading | ready | error

  useEffect(() => {
    let alive = true
    fetchNews().then((r) => {
      if (!alive) return
      setArticles(r.articles)
      setState(r.fallback ? 'error' : 'ready')
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="page container">
      <p className="eyebrow">The living scroll · spaceflight news</p>
      <h1 className="page-title">The Chronicles</h1>
      <p className="page-sub">
        What the sky-watchers have recently found — drawn fresh from the Spaceflight
        News archive, so the scroll is always current.
      </p>

      {state === 'loading' && (
        <div className="panel loading-panel">
          <p className="empty-note">
            <span className="loading-dots">consulting the celestial records</span>
          </p>
        </div>
      )}

      {state === 'error' && (
        <div className="panel loading-panel">
          <p className="empty-note">
            The heavens are unreachable at present — showing the archive's last reading.
          </p>
        </div>
      )}

      {state === 'ready' && articles && (
        <div className="chronicle">
          {articles.map((a, i) => (
            <article key={a.id || i} className="chronicle-entry panel">
              <div className="chronicle-meta">
                <span className="chronicle-date">{formatDate(a.date)}</span>
                <span className="tag">{a.source}</span>
              </div>
              <h2>
                <a href={a.url} target="_blank" rel="noreferrer">
                  {a.title}
                </a>
              </h2>
              {a.image && (
                <div className="chronicle-img">
                  <img src={a.image} alt="" loading="lazy" />
                </div>
              )}
              <p>{a.summary}</p>
              <a className="chronicle-link" href={a.url} target="_blank" rel="noreferrer">
                read the full scroll →
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
