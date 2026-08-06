import SkyMap from './SkyMap.jsx'
import SystemMap from './SystemMap.jsx'
import CosmosMap from './CosmosMap.jsx'

const COSMOS_VIEWS = [
  { id: 'milkyway', label: 'The Milky Way' },
  { id: 'local-group', label: 'The Local Group' },
  { id: 'universe', label: 'The Observable Universe' },
  { id: 'multiverse', label: 'The Multiverse' },
]

export default function Atlas({ tab = 'sky', initialQuery = '', view = 'milkyway' }) {
  const goto = (t) => {
    window.location.hash = t
  }
  return (
    <div className="page container">
      <div className="atlas-head">
        <div>
          <p className="eyebrow">A real map of the heavens</p>
          <h1 className="page-title">The Celestial Atlas</h1>
        </div>
        <div className="atlas-tabs">
          <button className={`chip gold big ${tab === 'sky' ? 'active' : ''}`} onClick={() => goto('/atlas')}>
            ✦ The Sky Tonight
          </button>
          <button className={`chip gold big ${tab === 'system' ? 'active' : ''}`} onClick={() => goto('/atlas/system')}>
            ☉ The Solar System
          </button>
          <button className={`chip gold big ${tab === 'cosmos' ? 'active' : ''}`} onClick={() => goto('/atlas/cosmos')}>
            ✧ The Cosmos
          </button>
        </div>
      </div>

      {tab === 'sky' && <SkyMap initialQuery={initialQuery} />}
      {tab === 'system' && <SystemMap />}
      {tab === 'cosmos' && (
        <>
          <div className="cosmos-tabs">
            {COSMOS_VIEWS.map((v) => (
              <button
                key={v.id}
                className={`chip gold ${view === v.id ? 'active' : ''}`}
                onClick={() => goto(`/atlas/cosmos/${v.id}`)}
              >
                {v.label}
              </button>
            ))}
          </div>
          <CosmosMap view={view} />
        </>
      )}
    </div>
  )
}
