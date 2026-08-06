import { lazy, Suspense, useEffect, useState } from 'react'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './components/HomePage.jsx'
import Chronicles from './components/Chronicles.jsx'
import Lore from './components/Lore.jsx'

const Atlas = lazy(() => import('./components/Atlas.jsx'))

function AtlasLoader({ tab, query }) {
  return (
    <Suspense
      fallback={
        <div className="page container">
          <div className="panel loading-panel">
            <p className="empty-note">
              <span className="loading-dots">unrolling the chart of the heavens</span>
            </p>
          </div>
        </div>
      }
    >
      <Atlas tab={tab} initialQuery={query} />
    </Suspense>
  )
}

function parseRoute(hash) {
  const raw = hash.replace(/^#\/?/, '')
  const [pathPart, queryPart] = raw.split('?')
  const parts = pathPart.split('/').filter(Boolean)
  if (parts[0] === 'atlas' && parts[1] === 'system') {
    return { page: 'atlas', tab: 'system', query: '' }
  }
  if (parts[0] === 'atlas') {
    const q = new URLSearchParams(queryPart || '').get('q') || ''
    return { page: 'atlas', tab: 'sky', query: q }
  }
  if (parts[0] === 'chronicles') return { page: 'chronicles' }
  if (parts[0] === 'lore') return { page: 'lore' }
  return { page: 'home' }
}

export default function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash))

  useEffect(() => {
    const onHash = () => {
      setRoute(parseRoute(window.location.hash))
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (path) => {
    window.location.hash = path
  }

  return (
    <div className="app-shell">
      <NavBar route={route} navigate={navigate} />
      <main>
        {route.page === 'home' && <HomePage navigate={navigate} />}
        {route.page === 'atlas' && <AtlasLoader key={route.tab} tab={route.tab} query={route.query} />}
        {route.page === 'chronicles' && <Chronicles />}
        {route.page === 'lore' && <Lore />}
      </main>
      <Footer />
    </div>
  )
}
