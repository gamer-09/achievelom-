// ─────────────────────────────────────────────────────────────
// COSMOGRAPHIA — the Celestial Calculator.
// Low-precision planetary & lunar ephemerides after J. Meeus,
// "Astronomical Algorithms". Good to ~0.1–0.5°, more than enough
// to place the wanderers on a real map for any date.
// All angles in degrees; J2000 equinox.
// ─────────────────────────────────────────────────────────────

const D2R = Math.PI / 180
const R2D = 180 / Math.PI

export const OBLIQUITY = 23.4392911 // ε0, degrees

// Julian Date from a UTC date string YYYY-MM-DD (midnight UTC)
export function dateToJD(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const a = Math.floor((14 - m) / 12)
  const yy = y + 4800 - a
  const mm = m + 12 * a - 3
  let jdn =
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  return jdn - 0.5 // midnight UTC
}

export function todayUTC() {
  return new Date().toISOString().slice(0, 10)
}

const norm360 = (x) => ((x % 360) + 360) % 360

// Kepler elements (a, e, I, L, lp, ln) with per-century rates (Meeus ch. 33)
const PLANET_ELEMENTS = {
  mercury: { a: [0.38709927, 0.00000037], e: [0.20563593, 0.00001906], I: [7.00497902, -0.00594749], L: [252.2503235, 149472.67411175], lp: [77.45779628, 0.16047689], ln: [48.33076593, -0.12534081] },
  venus: { a: [0.72333566, 0.0000039], e: [0.00677672, -0.00004107], I: [3.39467605, -0.0007889], L: [181.9790995, 58517.81538729], lp: [131.60246718, 0.00268329], ln: [76.67984255, -0.27769418] },
  earth: { a: [1.00000261, 0.00000562], e: [0.01671123, -0.00004392], I: [-0.00001531, -0.01294668], L: [100.46457166, 35999.37244981], lp: [102.93768193, 0.32327364], ln: [0, 0] },
  mars: { a: [1.52371034, 0.00001847], e: [0.0933941, 0.00007882], I: [1.84969142, -0.00813131], L: [-4.55343205, 19140.30268499], lp: [-23.94362959, 0.44441088], ln: [49.55953891, -0.29257343] },
  jupiter: { a: [5.202887, -0.00011607], e: [0.04838624, -0.00013253], I: [1.30439695, -0.00183714], L: [34.39644051, 3034.74612775], lp: [14.72847983, 0.21252668], ln: [100.47390909, 0.20469106] },
  saturn: { a: [9.53667594, -0.0012506], e: [0.05386179, -0.00050991], I: [2.48599187, 0.00193609], L: [49.95424423, 1222.49362201], lp: [92.59887831, -0.41897216], ln: [113.66242448, -0.28867794] },
  uranus: { a: [19.18916464, -0.00196176], e: [0.04725744, -0.00004397], I: [0.77263783, -0.00242939], L: [313.23810451, 428.48202785], lp: [170.9542763, 0.40805281], ln: [74.01692503, 0.04240589] },
  neptune: { a: [30.06992276, 0.00026291], e: [0.00859048, 0.00005105], I: [1.77004347, 0.00035372], L: [-55.12002969, 218.45945325], lp: [44.96476227, -0.32241464], ln: [131.78422574, -0.00508664] },
}

// heliocentric ecliptic (lon, lat, radius AU) for a planet
function helio(planet, T) {
  const el = PLANET_ELEMENTS[planet]
  const q = (key) => el[key][0] + el[key][1] * T
  const a = q('a')
  const e = q('e')
  const I = norm360(q('I'))
  const L = norm360(q('L'))
  const lp = norm360(q('lp'))
  const ln = norm360(q('ln'))
  const M = norm360(L - lp)
  // solve Kepler's equation
  let E = M + (e * R2D) * Math.sin(M * D2R)
  for (let i = 0; i < 5; i++) E = M + e * R2D * Math.sin(E * D2R)
  const xv = a * (Math.cos(E * D2R) - e)
  const yv = a * Math.sqrt(1 - e * e) * Math.sin(E * D2R)
  const v = Math.atan2(yv, xv) * R2D
  const r = Math.sqrt(xv * xv + yv * yv)
  const lon = norm360(v + lp)
  const lat = Math.asin(Math.sin((v + lp) * D2R) * Math.sin(I * D2R)) * R2D
  return { lon, lat, r }
}

function eclToEq(lon, lat, eps = OBLIQUITY) {
  const l = lon * D2R
  const b = lat * D2R
  const e = eps * D2R
  const ra = Math.atan2(Math.sin(l) * Math.cos(e) - Math.tan(b) * Math.sin(e), Math.cos(l)) * R2D
  const dec = Math.asin(Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(l)) * R2D
  return { ra: norm360(ra), dec }
}

const TYPICAL_MAG = {
  mercury: 1.2, venus: -4.1, mars: 0.4, jupiter: -2.2, saturn: 0.7,
  uranus: 5.7, neptune: 7.9,
}

// Geocentric equatorial position of a planet for a date (YYYY-MM-DD)
export function planetPosition(planet, dateStr) {
  const jd = dateToJD(dateStr)
  const T = (jd - 2451545.0) / 36525
  const p = helio(planet, T)
  const e = helio('earth', T)
  // heliocentric rectangular
  const toRect = (h) => {
    const c = Math.cos(h.lat * D2R)
    return {
      x: h.r * Math.cos(h.lon * D2R) * c,
      y: h.r * Math.sin(h.lon * D2R) * c,
      z: h.r * Math.sin(h.lat * D2R),
    }
  }
  const P = toRect(p)
  const E = toRect(e)
  const xg = P.x - E.x
  const yg = P.y - E.y
  const zg = P.z - E.z
  const distAU = Math.sqrt(xg * xg + yg * yg + zg * zg)
  const lon = Math.atan2(yg, xg) * R2D
  const lat = Math.atan2(zg, Math.sqrt(xg * xg + yg * yg)) * R2D
  const eq = eclToEq(norm360(lon), lat)
  return {
    ...eq,
    distAU,
    distKm: distAU * 149597870.7,
    lightMin: distAU * 8.3167,
    mag: TYPICAL_MAG[planet],
    helioLon: p.lon,
    helioLat: p.lat,
    helioR: p.r,
  }
}

// Geocentric Sun (from Earth's heliocentric position)
export function sunPosition(dateStr) {
  const jd = dateToJD(dateStr)
  const T = (jd - 2451545.0) / 36525
  const e = helio('earth', T)
  const lon = norm360(e.lon + 180)
  const eq = eclToEq(lon, 0)
  return {
    ...eq,
    distAU: e.r,
    distKm: e.r * 149597870.7,
    lightMin: e.r * 8.3167,
    mag: -26.7,
    helioLon: lon,
  }
}

// Geocentric Moon (Meeus ch. 47, low precision ~0.5°)
export function moonPosition(dateStr) {
  const jd = dateToJD(dateStr)
  const T = (jd - 2451545.0) / 36525
  const Lp = norm360(218.3164477 + 481267.88123421 * T)
  const D = norm360(297.8501921 + 445267.1114034 * T)
  const M = norm360(357.5291092 + 35999.0502909 * T)
  const Mp = norm360(134.9633964 + 477198.8675055 * T)
  const F = norm360(93.272095 + 483202.0175233 * T)
  const s = Math.sin
  const lon =
    Lp +
    6.288774 * s(Mp * D2R) +
    1.274027 * s((2 * D - Mp) * D2R) +
    0.658314 * s(2 * D * D2R) +
    0.213618 * s(2 * Mp * D2R) -
    0.185116 * s(M * D2R) -
    0.114332 * s(2 * F * D2R)
  const lat =
    5.128189 * s(F * D2R) +
    0.280606 * s((Mp + F) * D2R) +
    0.277693 * s((Mp - F) * D2R) +
    0.173238 * s((2 * D - F) * D2R) +
    0.055413 * s((2 * D + F - Mp) * D2R)
  const distKm =
    385000.56 -
    20905.355 * Math.cos(Mp * D2R) -
    3699.111 * Math.cos((2 * D - Mp) * D2R) -
    2955.968 * Math.cos(2 * D * D2R)
  const eq = eclToEq(norm360(lon), lat)
  return {
    ...eq,
    distAU: distKm / 149597870.7,
    distKm,
    lightMin: distKm / 299792.458 / 60,
    mag: -12.7,
    helioLon: norm360(lon),
  }
}

export function allBodies(dateStr) {
  return {
    sun: sunPosition(dateStr),
    moon: moonPosition(dateStr),
    mercury: planetPosition('mercury', dateStr),
    venus: planetPosition('venus', dateStr),
    earth: planetPosition('earth', dateStr),
    mars: planetPosition('mars', dateStr),
    jupiter: planetPosition('jupiter', dateStr),
    saturn: planetPosition('saturn', dateStr),
    uranus: planetPosition('uranus', dateStr),
    neptune: planetPosition('neptune', dateStr),
  }
}

// Galactic (l, b) -> equatorial (RA, Dec), J2000 (Meeus ch. 13)
const NGP_RA = 192.85948
const NGP_DEC = 27.12825
const L_NCP = 122.93192

export function galToEq(l, b) {
  const lr = l * D2R
  const br = b * D2R
  const a0 = NGP_RA * D2R
  const d0 = NGP_DEC * D2R
  const lc = L_NCP * D2R
  const sinD = Math.sin(d0) * Math.sin(br) + Math.cos(d0) * Math.cos(br) * Math.cos(lc - lr)
  const dec = Math.asin(Math.min(1, Math.max(-1, sinD))) * R2D
  const y = Math.cos(br) * Math.sin(lc - lr)
  const x = -Math.cos(d0) * Math.sin(br) + Math.sin(d0) * Math.cos(br) * Math.cos(lc - lr)
  const ra = norm360(a0 * R2D + Math.atan2(y, x) * R2D)
  return { ra, dec }
}

// The Milky Way band: a filled polygon between b=-8° and b=+8°
export function milkyWayPath(step = 4) {
  const top = []
  const bottom = []
  for (let l = 0; l <= 360; l += step) {
    const a = galToEq(l, 7.5)
    const b = galToEq(l, -7.5)
    top.push(a)
    bottom.push(b)
  }
  const pts = [
    ...top,
    ...bottom.reverse(),
  ]
  return pts
}

// The ecliptic path (β=0), sampled in ecliptic longitude
export function eclipticPath(step = 3) {
  const pts = []
  for (let l = 0; l <= 360; l += step) {
    pts.push(eclToEq(l, 0))
  }
  return pts
}

// RA/Dec of a date's solar position, plus human helpers
export function formatRA(raDeg) {
  const h = raDeg / 15
  const hh = Math.floor(h)
  const mm = Math.floor((h - hh) * 60)
  const ss = Math.round(((h - hh) * 60 - mm) * 60)
  return `${String(hh).padStart(2, '0')}h ${String(mm).padStart(2, '0')}m ${String(ss).padStart(2, '0')}s`
}

export function formatDec(dec) {
  const sign = dec < 0 ? '−' : '+'
  const a = Math.abs(dec)
  const d = Math.floor(a)
  const m = Math.floor((a - d) * 60)
  const s = Math.round(((a - d) * 60 - m) * 60)
  return `${sign}${String(d).padStart(2, '0')}° ${String(m).padStart(2, '0')}′ ${String(s).padStart(2, '0')}″`
}
