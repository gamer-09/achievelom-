import { useEffect, useState } from 'react'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './components/HomePage.jsx'
import Atlas from './components/Atlas.jsx'
import Chronicles from './components/Chronicles.jsx'
import Lore from './components/Lore.jsx'

function parseRoute(hash) {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (parts[0] === 'atlas') return { page: 'atlas', id: parts[1] || null }
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
        {route.page === 'atlas' && <Atlas key={route.id || 'root'} startId={route.id} navigate={navigate} />}
        {route.page === 'chronicles' && <Chronicles />}
        {route.page === 'lore' && <Lore />}
      </main>
      <Footer />
    </div>
  )
}
