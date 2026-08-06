import SkyMap from './SkyMap.jsx'
import SystemMap from './SystemMap.jsx'

export default function Atlas({ tab = 'sky', initialQuery = '' }) {
  const goto = (t) => {
    window.location.hash = t === 'system' ? '/atlas/system' : '/atlas'
  }
  return (
    <div className="page container">
      <div className="atlas-head">
        <div>
          <p className="eyebrow">A real map of the heavens</p>
          <h1 className="page-title">The Celestial Atlas</h1>
        </div>
        <div className="atlas-tabs">
          <button
            className={`chip gold big ${tab === 'sky' ? 'active' : ''}`}
            onClick={() => goto('sky')}
          >
            ✦ The Sky Tonight
          </button>
          <button
            className={`chip gold big ${tab === 'system' ? 'active' : ''}`}
            onClick={() => goto('system')}
          >
            ☉ The Solar System
          </button>
        </div>
      </div>

      {tab === 'sky' ? (
        <SkyMap initialQuery={initialQuery} />
      ) : (
        <SystemMap />
      )}
    </div>
  )
}
