// ─────────────────────────────────────────────────────────────
// COSMOGRAPHIA — the living chronicle.
// Live space news via the Spaceflight News API (no key needed),
// plus the Astronomy Picture of the Day from NASA (public
// DEMO_KEY). Robust against flaky networks: every request has a
// timeout, retries, and a graceful fallback so the UI never
// hangs on "consulting the celestial records".
// ─────────────────────────────────────────────────────────────

import { FALLBACK_NEWS } from '../data/fallbackNews.js'

const NEWS_URL = 'https://api.spaceflightnewsapi.net/v4/articles/?limit=12'
const APOD_URL = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&thumbs=true'

const NEWS_CACHE = 'cosmographia.news.v1'
const APOD_CACHE = 'cosmographia.apod.v1'
const MAX_AGE = 1000 * 60 * 30 // 30 minutes
const TIMEOUT = 12000 // 12s per attempt
const RETRIES = 2 // extra attempts after the first

function readCache(key, strictAge = true) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { at, data } = JSON.parse(raw)
    if (strictAge && Date.now() - at > MAX_AGE) return null
    if (!data) return null
    return data
  } catch {
    return null
  }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ at: Date.now(), data }))
  } catch {
    /* the vault is full; ignore */
  }
}

// fetch with a hard timeout + retry
async function fetchWithRetry(url, retries = RETRIES) {
  let lastErr = null
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT)
    try {
      const res = await fetch(url, { signal: ctrl.signal })
      if (!res.ok) {
        lastErr = new Error(`HTTP ${res.status}`)
        // retry on server errors (5xx) — the flaky-API case
        if (res.status >= 500 && attempt < retries) {
          clearTimeout(timer)
          await new Promise((r) => setTimeout(r, 400 * (attempt + 1)))
          continue
        }
        throw lastErr
      }
      clearTimeout(timer)
      return await res.json()
    } catch (e) {
      clearTimeout(timer)
      lastErr = e
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)))
        continue
      }
    }
  }
  throw lastErr || new Error('fetch failed')
}

function mapArticle(a) {
  return {
    id: a.id,
    title: a.title || 'Untitled',
    summary: a.summary || '',
    date: a.published_at ? a.published_at.slice(0, 10) : '',
    source: a.news_site || 'Unknown source',
    url: a.url || '#',
    image: a.image_url || null,
  }
}

export async function fetchNews() {
  const cached = readCache(NEWS_CACHE, false)
  if (cached) return { articles: cached, cached: true, stale: true }

  try {
    const data = await fetchWithRetry(NEWS_URL)
    const articles = (data.results || []).map(mapArticle).filter((a) => a.title)
    if (articles.length) {
      writeCache(NEWS_CACHE, articles)
      return { articles, cached: false }
    }
    throw new Error('empty feed')
  } catch {
    return { articles: FALLBACK_NEWS, cached: false, fallback: true }
  }
}

export async function fetchApod() {
  const cached = readCache(APOD_CACHE, false)
  if (cached) return { ...cached, cached: true, stale: true }

  try {
    const data = await fetchWithRetry(APOD_URL)
    const apod = {
      title: data.title || 'A picture of the heavens',
      explanation: data.explanation || '',
      date: data.date || '',
      image: data.hdurl || data.url || null,
      copyright: data.copyright || '',
    }
    if (!apod.image) throw new Error('no image')
    writeCache(APOD_CACHE, apod)
    return { ...apod, cached: false }
  } catch {
    return { title: null, explanation: null, image: null, cached: false, fallback: true }
  }
}

export function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
