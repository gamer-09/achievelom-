// ─────────────────────────────────────────────────────────────
// COSMOGRAPHIA — the Local Group, drawn true.
// Positions (J2000 RA/Dec) and distances from published
// literature (Karachentsev & Kashibadze 2006; McConnachie 2012;
// NASA/IPAC extragalactic database values). The 3D viewer
// converts RA/Dec/distance to cartesian (kpc) at runtime.
// ─────────────────────────────────────────────────────────────

export const LOCAL_GROUP = [
  { id: 'mw', name: 'The Milky Way', type: 'Spiral galaxy', ra: 0, dec: 0, dist: 0, size: 2.2, color: '#9db4ff', note: 'Our home — a barred spiral of 100–400 billion stars. You are here.' },
  { id: 'lmc', name: 'Large Magellanic Cloud', type: 'Dwarf irregular galaxy', ra: 80.89, dec: -69.76, dist: 49, size: 1.5, color: '#e0d5b0', note: 'The brightest satellite of the Milky Way — home to the Tarantula Nebula and SN 1987A.' },
  { id: 'smc', name: 'Small Magellanic Cloud', type: 'Dwarf irregular galaxy', ra: 13.19, dec: -72.83, dist: 62, size: 1.3, color: '#e0d5b0', note: 'Linked to the LMC by a stream of gas; slowly being torn apart by our galaxy.' },
  { id: 'cma', name: 'Canis Major Dwarf', type: 'Dwarf irregular galaxy', ra: 100.3, dec: -27.9, dist: 7.5, size: 0.9, color: '#d8c9a3', note: 'The nearest known galaxy — a ghost being consumed, leaving a ring of debris.' },
  { id: 'sgrdf', name: 'Sagittarius Dwarf', type: 'Dwarf spheroidal galaxy', ra: 283.8, dec: -30.5, dist: 24, size: 1.0, color: '#d8c9a3', note: 'Plunging through the Milky Way disk, shedding a stream of stars.' },
  { id: 'umidf', name: 'Ursa Minor Dwarf', type: 'Dwarf spheroidal galaxy', ra: 227.2, dec: 67.2, dist: 66, size: 0.9, color: '#d8c9a3', note: 'Wraps around the North Star; one of the most dark-matter-dominated galaxies known.' },
  { id: 'draco', name: 'Draco Dwarf', type: 'Dwarf spheroidal galaxy', ra: 260.1, dec: 57.9, dist: 80, size: 0.9, color: '#d8c9a3', note: 'A tiny, faint companion dominated by dark matter.' },
  { id: 'scldf', name: 'Sculptor Dwarf', type: 'Dwarf spheroidal galaxy', ra: 15.0, dec: -33.7, dist: 88, size: 0.9, color: '#d8c9a3', note: 'One of the first dwarf spheroidals found, by Harlow Shapley in 1937.' },
  { id: 'sxtdf', name: 'Sextans Dwarf', type: 'Dwarf spheroidal galaxy', ra: 153.3, dec: -1.6, dist: 86, size: 0.9, color: '#d8c9a3', note: 'A sparse, ancient dwarf spheroidal discovered in 1990.' },
  { id: 'carina', name: 'Carina Dwarf', type: 'Dwarf spheroidal galaxy', ra: 100.4, dec: -51.0, dist: 105, size: 0.9, color: '#d8c9a3', note: 'A dwarf with several distinct bursts of star formation.' },
  { id: 'fornax', name: 'Fornax Dwarf', type: 'Dwarf spheroidal galaxy', ra: 40.0, dec: -34.4, dist: 138, size: 1.0, color: '#d8c9a3', note: 'Hosts six globular clusters of its own — a galaxy with its own star cities.' },
  { id: 'leo2', name: 'Leo II', type: 'Dwarf spheroidal galaxy', ra: 168.4, dec: 22.2, dist: 233, size: 0.9, color: '#d8c9a3', note: 'A small dwarf spheroidal in the constellation of the Lion.' },
  { id: 'leo1', name: 'Leo I', type: 'Dwarf spheroidal galaxy', ra: 152.1, dec: 12.3, dist: 250, size: 0.9, color: '#d8c9a3', note: 'The most distant of the Milky Way\'s bright satellites.' },
  { id: 'bootes1', name: 'Boötes I', type: 'Dwarf spheroidal galaxy', ra: 210.0, dec: 14.5, dist: 60, size: 0.8, color: '#d8c9a3', note: 'An ultra-faint dwarf, one of the dimmest galaxies known.' },
  { id: 'm31', name: 'Andromeda (M31)', type: 'Spiral galaxy', ra: 10.68, dec: 41.27, dist: 780, size: 2.0, color: '#b58ff2', note: 'Our great sibling — 2 trillion stars, approaching at 110 km/s. Collision in ≈ 4.5 billion years.' },
  { id: 'm32', name: 'M32', type: 'Dwarf elliptical galaxy', ra: 10.67, dec: 40.87, dist: 780, size: 0.9, color: '#d8a0c0', note: 'A compact elliptical satellite of Andromeda.' },
  { id: 'm110', name: 'M110', type: 'Dwarf elliptical galaxy', ra: 10.08, dec: 41.68, dist: 780, size: 0.9, color: '#d8a0c0', note: 'Andromeda\'s satellite, discovered telescopically in 1773.' },
  { id: 'm33', name: 'Triangulum (M33)', type: 'Spiral galaxy', ra: 23.46, dec: 30.66, dist: 850, size: 1.6, color: '#b58ff2', note: 'The third-largest member of the Local Group — a face-on spiral of 40 billion stars.' },
  { id: 'ngc6822', name: 'NGC 6822', type: 'Dwarf irregular galaxy', ra: 296.23, dec: -14.78, dist: 490, size: 1.1, color: '#e0d5b0', note: 'Barnard\'s Galaxy — the first dwarf irregular recognized as a galaxy outside ours.' },
  { id: 'ic10', name: 'IC 10', type: 'Dwarf irregular · starburst', ra: 5.08, dec: 59.30, dist: 730, size: 1.0, color: '#e0d5b0', note: 'The only known starburst dwarf in the Local Group, shrouded by our galaxy\'s disk.' },
  { id: 'ic1613', name: 'IC 1613', type: 'Dwarf irregular galaxy', ra: 16.2, dec: 2.1, dist: 750, size: 1.0, color: '#e0d5b0', note: 'A low-metallicity irregular — a window into the early universe.' },
  { id: 'wlm', name: 'WLM', type: 'Dwarf irregular galaxy', ra: 0.49, dec: -15.46, dist: 980, size: 1.0, color: '#e0d5b0', note: 'A solitary, isolated dwarf on the Local Group\'s edge.' },
  { id: 'ngc3109', name: 'NGC 3109', type: 'Dwarf barred spiral', ra: 150.77, dec: -26.16, dist: 1300, size: 1.1, color: '#9fc8e0', note: 'A disk galaxy on the outskirts, possibly bound to the Antlia–Sextans group.' },
  { id: 'sxtA', name: 'Sextans A', type: 'Dwarf irregular galaxy', ra: 152.73, dec: -4.73, dist: 1300, size: 0.9, color: '#e0d5b0', note: 'A small irregular galaxy of very low metallicity.' },
  { id: 'sxtB', name: 'Sextans B', type: 'Dwarf irregular galaxy', ra: 150.0, dec: 5.33, dist: 1400, size: 0.9, color: '#e0d5b0', note: 'A companion to Sextans A.' },
  { id: 'maffei1', name: 'Maffei 1', type: 'Giant elliptical galaxy', ra: 39.10, dec: 59.60, dist: 3400, size: 1.5, color: '#f2cf5b', note: 'A hidden giant — the nearest giant elliptical, obscured by Milky Way dust, found in infrared in 1968.' },
  { id: 'maffei2', name: 'Maffei 2', type: 'Barred spiral galaxy', ra: 39.90, dec: 59.90, dist: 3400, size: 1.3, color: '#9fc8e0', note: 'A dusty barred spiral, sibling of Maffei 1.' },
  { id: 'ic342', name: 'IC 342', type: 'Spiral galaxy', ra: 56.70, dec: 68.10, dist: 3300, size: 1.4, color: '#9fc8e0', note: 'One of the brightest galaxies in the sky if not for foreground dust — a hidden giant.' },
  { id: 'ngc1569', name: 'NGC 1569', type: 'Dwarf irregular · starburst', ra: 67.70, dec: 64.80, dist: 3000, size: 1.0, color: '#e0d5b0', note: 'A furious starburst dwarf forming stars 100× faster than the Milky Way per mass.' },
  { id: 'ngc2403', name: 'NGC 2403', type: 'Spiral galaxy', ra: 114.20, dec: 65.60, dist: 3200, size: 1.3, color: '#9fc8e0', note: 'A spiral with giant H II regions — a smaller cousin of M33.' },
  { id: 'm81', name: 'M81 (Bode\'s Galaxy)', type: 'Grand-design spiral galaxy', ra: 148.89, dec: 69.07, dist: 3600, size: 1.5, color: '#9fc8e0', note: 'The large spiral of the M81 group — one of the brightest galaxies in our sky.' },
  { id: 'm82', name: 'M82 (Cigar Galaxy)', type: 'Irregular · starburst', ra: 148.97, dec: 69.68, dist: 3500, size: 1.1, color: '#ff9e5e', note: 'A starburst galaxy flinging out a huge superwind, interacting with M81.' },
  { id: 'ngc253', name: 'Sculptor Galaxy (NGC 253)', type: 'Starburst spiral galaxy', ra: 11.89, dec: -25.29, dist: 3500, size: 1.4, color: '#ff9e5e', note: 'The brightest galaxy of the Sculptor Group, birthing stars furiously.' },
  { id: 'cena', name: 'Centaurus A (NGC 5128)', type: 'Peculiar elliptical galaxy', ra: 201.37, dec: -43.02, dist: 3800, size: 1.6, color: '#f2cf5b', note: 'A giant elliptical in collision, with a black hole shooting jets a million light-years long.' },
  { id: 'ngc4945', name: 'NGC 4945', type: 'Barred spiral · starburst', ra: 196.36, dec: -49.47, dist: 3700, size: 1.3, color: '#ff9e5e', note: 'A dusty edge-on spiral near Centaurus A, with a very active nucleus.' },
]

export const TYPE_COLORS = {
  'Spiral galaxy': '#9fc8e0',
  'Grand-design spiral galaxy': '#9fc8e0',
  'Barred spiral': '#9fc8e0',
  'Barred spiral · starburst': '#ff9e5e',
  'Spiral galaxy': '#9fc8e0',
  'Dwarf elliptical galaxy': '#d8a0c0',
  'Giant elliptical galaxy': '#f2cf5b',
  'Peculiar elliptical galaxy': '#f2cf5b',
  'Dwarf spheroidal galaxy': '#d8c9a3',
  'Dwarf irregular galaxy': '#e0d5b0',
  'Dwarf irregular · starburst': '#e0d5b0',
  'Dwarf barred spiral': '#9fc8e0',
  'Dwarf irregular': '#e0d5b0',
  'Irregular · starburst': '#ff9e5e',
  'Starburst spiral galaxy': '#ff9e5e',
}
