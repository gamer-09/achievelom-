import { Component } from 'react'

// If anything inside the chart ever throws, show a styled recovery
// panel instead of letting the whole screen go blank.
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Cosmographia chart error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="page container">
          <div className="panel" style={{ padding: '60px 30px', textAlign: 'center' }}>
            <div className="corner-frame" style={{ padding: 30 }}>
              <p className="eyebrow">The chart has a tear</p>
              <h2>The map momentarily lost the sky.</h2>
              <p style={{ color: 'var(--parchment-dim)', fontStyle: 'italic', margin: '14px 0' }}>
                {String(this.state.error.message || this.state.error)}
              </p>
              <button className="btn gold" onClick={() => this.setState({ error: null })}>
                ✦ Repair the chart
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
