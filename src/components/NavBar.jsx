export default function NavBar({ route, navigate }) {
  const is = (p) => route.page === p || (p === 'atlas' && route.page === 'atlas')
  return (
    <header className="nav">
      <div className="container nav-inner">
        <div className="brand" onClick={() => navigate('/')}>
          <span className="brand-mark">
            <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="32" cy="32" r="24" fill="none" stroke="#d4af37" strokeWidth="2.5" />
              <circle cx="32" cy="32" r="17" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.7" />
              <line x1="8" y1="32" x2="56" y2="32" stroke="#d4af37" strokeWidth="1" opacity="0.6" />
              <line x1="32" y1="8" x2="32" y2="56" stroke="#d4af37" strokeWidth="1" opacity="0.6" />
              <circle cx="32" cy="32" r="6.5" fill="#f2cf5b" />
            </svg>
          </span>
          <span>
            <span className="brand-name">Cosmographia</span>
            <span className="brand-sub">The ancient atlas of the heavens</span>
          </span>
        </div>

        <nav className="nav-links">
          <button className={`nav-link ${is('atlas') ? 'active' : ''}`} onClick={() => navigate('/atlas')}>
            The Map
          </button>
          <button className={`nav-link ${route.page === 'chronicles' ? 'active' : ''}`} onClick={() => navigate('/chronicles')}>
            The Chronicles
          </button>
          <button className={`nav-link ${route.page === 'lore' ? 'active' : ''}`} onClick={() => navigate('/lore')}>
            The Lore
          </button>
        </nav>
      </div>
    </header>
  )
}
