// ─────────────────────────────────────────────────────────────
// COSMOGRAPHIA — the deeper catalog.
// Famous objects beyond stars & Messier: black holes, pulsars,
// quasars, supernova remnants, galaxies, dwarf galaxies,
// exoplanet systems, galaxy clusters, and special objects.
// All coordinates are real J2000 positions (RA degrees, Dec degrees).
// ─────────────────────────────────────────────────────────────

export const COSMIC = {
  blackholes: [
    { name: 'Sagittarius A*', id: 'sgra', ra: 266.417, dec: -29.008, mass: '4.3 million Suns', dist: '26,000 ly', type: 'Supermassive black hole', year: '1931 (radio) · imaged 2022', fact: 'The black hole at the heart of our own galaxy — its shadow was imaged by the Event Horizon Telescope in 2022. Stars orbit it at 24,000 km/s.' },
    { name: 'M87*', id: 'm87star', ra: 187.706, dec: 12.391, mass: '6.5 billion Suns', dist: '55 million ly', type: 'Supermassive black hole', year: 'Imaged 2019', fact: 'The first black hole ever photographed — the famous orange ring of 2019, in the giant galaxy M87.' },
    { name: 'Cygnus X-1', id: 'cygx1', ra: 299.59, dec: 35.201, mass: '≈ 21 Suns', dist: '7,200 ly', type: 'Stellar-mass black hole', year: 'Discovered 1964', fact: 'The first widely accepted black hole — a blue supergiant orbits it, feeding an accretion disk discovered by X-ray astronomy.' },
    { name: 'V404 Cygni', id: 'v404', ra: 306.016, dec: 33.867, mass: '≈ 9 Suns', dist: '8,000 ly', type: 'Stellar-mass black hole', year: 'First seen 1938 (outburst)', fact: 'A black hole in a binary with a K-type star; in 2015 it erupted with the brightest X-ray outburst in decades.' },
    { name: 'A0620-00', id: 'a0620', ra: 95.62, dec: -0.345, mass: '≈ 6.6 Suns', dist: '3,500 ly', type: 'Stellar-mass black hole', year: 'Discovered 1975', fact: 'The nearest known black hole for many years — the prototype "X-ray nova".' },
    { name: 'GRS 1915+105', id: 'grs1915', ra: 288.798, dec: 10.946, mass: '≈ 12 Suns', dist: '36,000 ly', type: 'Stellar-mass black hole · microquasar', year: 'Discovered 1992', fact: 'A microquasar firing jets at 98% of light speed — a miniature of the great quasar engines.' },
    { name: 'SS 433', id: 'ss433', ra: 287.957, dec: 4.983, mass: '≈ 10 Suns', dist: '18,000 ly', type: 'Microquasar', year: 'Discovered 1977', fact: 'Its twin jets precess like a wobbling lighthouse, sweeping the sky — a cosmic spectacle observed in visible light, X-rays and radio.' },
    { name: 'TON 618', id: 'ton618', ra: 187.104, dec: 31.527, mass: '66 billion Suns (one estimate)', dist: '10.4 billion ly', type: 'Ultramassive black hole · quasar', year: 'Noted 1957', fact: 'One of the most massive black holes known — a quasar whose accretion disk outshines entire galaxies.' },
    { name: 'GW150914', id: 'gw150914', ra: 197.5, dec: -47.2, mass: '62 Suns (merged)', dist: '1.3 billion ly', type: 'Black-hole merger (gravitational waves)', year: 'Detected 14 Sep 2015', fact: 'The first gravitational wave ever detected — two black holes, 36 and 29 Suns, spiralling together and ringing space itself.' },
    { name: '1A 0620-00', id: 'dup', ra: 95.62, dec: -0.345, mass: '', dist: '', type: '', year: '', fact: '' },
  ],
  pulsars: [
    { name: 'Crab Pulsar', id: 'crabpsr', ra: 83.633, dec: 22.014, period: '33 ms', dist: '6,500 ly', type: 'Neutron star', year: 'Discovered 1968', fact: 'The heart of the Crab Nebula (M1) — the collapsed core of the supernova seen by Chinese astronomers in 1054, spinning 30 times a second.' },
    { name: 'Vela Pulsar', id: 'velapsr', ra: 128.836, dec: -45.176, period: '89 ms', dist: '1,000 ly', type: 'Neutron star', year: 'Discovered 1968', fact: 'The brightest pulsar in the sky — the remnant of a star that exploded ~11,000 years ago, lighting the vast Vela supernova remnant.' },
    { name: 'Geminga', id: 'geminga', ra: 98.476, dec: 17.77, period: '237 ms', dist: '800 ly', type: 'Neutron star', year: 'Discovered 1972 (γ-ray)', fact: 'From the Lombard "gh\'è minga" — "it isn\'t there" — so named because it showed only gamma rays for a decade. A quiet, deadly ghost.' },
    { name: 'PSR J0437-4715', id: 'psrj0437', ra: 69.316, dec: -47.251, period: '5.75 ms', dist: '510 ly', type: 'Millisecond pulsar', year: 'Discovered 1993', fact: 'The closest millisecond pulsar — its ultra-precise ticks rival atomic clocks, and its companion is the nearest known neutron-star system.' },
    { name: 'PSR B1919+21', id: 'psrb1919', ra: 290.45, dec: 21.91, period: '1.337 s', dist: '2,300 ly', type: 'Pulsar', year: 'Discovered 1967', fact: 'The very first pulsar — its regular 1.3-second "LGM-1" signal (Little Green Men) was almost mistaken for an alien beacon.' },
    { name: 'PSR J0108-1431', id: 'psrj0108', ra: 17.04, dec: -14.52, period: '808 ms', dist: '424 ly', type: 'Neutron star', year: 'Discovered 1994', fact: 'The oldest and closest lone pulsar known — a faint ember spinning slowly toward silence.' },
  ],
  quasars: [
    { name: '3C 273', id: '3c273', ra: 187.278, dec: 2.052, redshift: 'z = 0.158', dist: '2.4 billion ly', type: 'Quasar', year: 'Discovered 1963', fact: 'The first quasar identified — the most luminous object known in its day, its light bending through a visible jet 200,000 light-years long.' },
    { name: 'S5 0014+81', id: 's50014', ra: 4.285, dec: 81.577, redshift: 'z = 3.366', dist: '12.1 billion ly', type: 'Quasar · blazar', year: 'Discovered 1984', fact: 'Home to one of the most massive black holes ever found — possibly 40 billion Suns, a blinding beacon from the early universe.' },
    { name: 'ULAS J1120+0641', id: 'j1120', ra: 170.06, dec: 6.69, redshift: 'z = 7.085', dist: '13.0 billion ly', type: 'Quasar', year: 'Discovered 2011', fact: 'The most distant quasar known for years — its light set out when the universe was only 770 million years old.' },
    { name: 'J0313-1806', id: 'j0313', ra: 48.31, dec: -18.11, redshift: 'z = 7.64', dist: '13.1 billion ly', type: 'Quasar', year: 'Discovered 2021', fact: 'The most distant quasar known — already hosting a billion-Sun black hole just 670 million years after the Big Bang.' },
    { name: 'APM 08279+5255', id: 'apm08279', ra: 127.924, dec: 52.754, redshift: 'z = 3.911', dist: '12.1 billion ly', type: 'Quasar', year: 'Discovered 1998', fact: 'A gravitational-lensed quasar whose host galaxy holds a billion-Sun black hole and the largest reservoir of water ever found in the universe.' },
    { name: 'OJ 287', id: 'oj287', ra: 133.704, dec: 20.108, redshift: 'z = 0.306', dist: '3.5 billion ly', type: 'Blazar', year: 'Discovered 1971', fact: 'A binary supermassive black-hole system — the smaller black hole punches through the disk of the larger every 12 years, flashing like clockwork.' },
  ],
  snr: [
    { name: 'Cassiopeia A', id: 'casa', ra: 350.85, dec: 58.815, type: 'Supernova remnant', dist: '11,000 ly', year: 'First observed 1948 (radio)', fact: 'The youngest known supernova remnant in the Milky Way — its star exploded ~340 years ago and was almost observed by Flamsteed in 1680.' },
    { name: 'SN 1987A', id: 'sn1987a', ra: 83.867, dec: -69.27, type: 'Supernova remnant', dist: '168,000 ly', year: 'Observed 23 Feb 1987', fact: 'The nearest supernova seen since 1604 — in the Large Magellanic Cloud; neutrinos from its core were detected before its light arrived.' },
    { name: 'Vela Supernova Remnant', id: 'velasnr', ra: 128.8, dec: -45.2, type: 'Supernova remnant', dist: '800 ly', year: 'Mapped in the 1960s', fact: 'A colossal expanding bubble from a star that died 11,000 years ago — one of the closest supernova remnants to Earth.' },
    { name: "Kepler's Supernova", id: 'kepler', ra: 262.68, dec: -21.48, type: 'Supernova remnant', dist: '20,000 ly', year: 'Observed 1604', fact: 'The last supernova seen in our galaxy with the naked eye — observed by Kepler himself, a type Ia blast now a glowing shell.' },
    { name: "Tycho's Supernova", id: 'tycho', ra: 6.32, dec: 64.13, type: 'Supernova remnant', dist: '8,000–13,000 ly', year: 'Observed 1572', fact: 'The "new star" that shattered Aristotle\'s unchanging heavens — Tycho Brahe\'s supernova, now an expanding X-ray bubble.' },
    { name: 'Cygnus Loop', id: 'cygnusloop', ra: 312.75, dec: 30.67, type: 'Supernova remnant', dist: '1,500 ly', year: 'Mapped in the 19th century', fact: 'A 3°-wide filamentary shell in Cygnus — its brightest knots are NGC 6992, a favourite of astrophotographers.' },
  ],
  galaxies: [
    { name: 'Large Magellanic Cloud', id: 'lmc', ra: 80.89, dec: -69.756, type: 'Dwarf galaxy · satellite', dist: '163,000 ly', year: 'Known to antiquity', fact: 'The brightest satellite galaxy of the Milky Way, visible to the naked eye from the south — home to the Tarantula Nebula and SN 1987A.' },
    { name: 'Small Magellanic Cloud', id: 'smc', ra: 13.187, dec: -72.829, type: 'Dwarf galaxy · satellite', dist: '200,000 ly', year: 'Known to antiquity', fact: 'Its smaller companion, connected to the LMC by a stream of gas — a galaxy being slowly shredded by our own.' },
    { name: 'Centaurus A', id: 'ngc5128', ra: 201.365, dec: -43.019, type: 'Peculiar galaxy · radio source', dist: '12 million ly', year: 'Catalogued 1826', fact: 'A giant elliptical crossed by a dark dust lane — a galaxy in collision, whose supermassive black hole shoots jets 1 million light-years into space.' },
    { name: 'Sculptor Galaxy', id: 'ngc253', ra: 11.888, dec: -25.288, type: 'Starburst galaxy', dist: '11.5 million ly', year: 'Catalogued 1783', fact: 'The brightest galaxy of the Sculptor Group — birthing new stars so furiously it is visible in binoculars.' },
    { name: 'Needle Galaxy', id: 'ngc4565', ra: 189.087, dec: 25.987, type: 'Edge-on spiral galaxy', dist: '42 million ly', year: 'Catalogued 1785', fact: 'A near-perfect edge-on spiral — a galaxy seen literally "side on", its dust lane slicing along the blade.' },
    { name: 'NGC 1300', id: 'ngc1300', ra: 49.921, dec: -19.411, type: 'Barred spiral galaxy', dist: '61 million ly', year: 'Catalogued 1835', fact: 'The archetypal barred spiral — a perfect S of arms anchored to a central bar, the classic shape of galaxies like our own.' },
    { name: 'IC 1101', id: 'ic1101', ra: 227.734, dec: 5.745, type: 'Giant elliptical · cD galaxy', dist: '1.05 billion ly', year: 'Catalogued 1890', fact: 'The largest known galaxy — a supergiant elliptical spanning over a million light-years, housing a trillion stars.' },
    { name: 'Maffei 1', id: 'maffei1', ra: 43.031, dec: 59.91, type: 'Giant elliptical galaxy', dist: '10.5 million ly', year: 'Discovered 1968', fact: 'A hidden giant — so obscured by Milky Way dust it was found in infrared, a neighbor nearly invisible to our eyes.' },
  ],
  dwarfs: [
    { name: 'Sagittarius Dwarf', id: 'sgrdf', ra: 283.83, dec: -30.52, type: 'Dwarf spheroidal galaxy', dist: '70,000 ly', year: 'Discovered 1994', fact: 'The closest known satellite galaxy — it has plunged through the Milky Way\'s disk multiple times and is being torn apart into a stellar stream.' },
    { name: 'Canis Major Dwarf', id: 'cmadf', ra: 100.3, dec: -27.9, type: 'Dwarf irregular galaxy', dist: '25,000 ly', year: 'Discovered 2003', fact: 'The nearest known galaxy to the galactic center — a ghost being consumed, leaving a ring of debris around our galaxy.' },
    { name: 'Fornax Dwarf', id: 'fornaxdf', ra: 39.997, dec: -34.449, type: 'Dwarf spheroidal galaxy', dist: '450,000 ly', year: 'Discovered 1938', fact: 'A small satellite with six globular clusters of its own — a galaxy hosting its own miniature swarm of star cities.' },
    { name: 'Ursa Minor Dwarf', id: 'umindf', ra: 227.0, dec: 67.2, type: 'Dwarf spheroidal galaxy', dist: '225,000 ly', year: 'Discovered 1954', fact: 'The dwarf galaxy that surrounds the North Star — and one of the most dark-matter-dominated galaxies known.' },
    { name: 'Draco Dwarf', id: 'dracodf', ra: 260.05, dec: 57.92, type: 'Dwarf spheroidal galaxy', dist: '260,000 ly', year: 'Discovered 1954', fact: 'A tiny, faint companion of the Milky Way, dominated by dark matter — its few stars scattered like spilled salt.' },
  ],
  exoplanets: [
    { name: 'Proxima Centauri b', id: 'proxib', ra: 217.429, dec: -62.679, type: 'Rocky planet · habitable zone', dist: '4.2 ly', year: 'Confirmed 2016', fact: 'The nearest known exoplanet — orbiting our closest stellar neighbour, in its habitable zone, though blasted by flares.' },
    { name: 'TRAPPIST-1 (7 planets)', id: 'trappist1', ra: 346.622, dec: -5.041, type: '7 rocky planets', dist: '40 ly', year: 'Announced 2017', fact: 'Seven Earth-sized worlds around one tiny red star — three in the habitable zone, the most promising system we know for life.' },
    { name: '51 Pegasi b', id: '51peg', ra: 344.366, dec: 20.768, type: 'Hot Jupiter', dist: '50 ly', year: 'Discovered 1995', fact: 'The first planet found around a Sun-like star — a "hot Jupiter" that proved the planets are stranger than we dreamed, winning the 2019 Nobel Prize.' },
    { name: 'HD 209458 b', id: 'hd209458', ra: 330.795, dec: 18.885, type: 'Hot Jupiter · transiting', dist: '157 ly', year: 'Discovered 1999', fact: '"Osiris" — the first planet seen to transit its star and the first with an atmosphere measured; it is evaporating into space.' },
    { name: 'Kepler-186f', id: 'kepler186f', ra: 298.653, dec: 43.955, type: 'Earth-size planet · habitable zone', dist: '580 ly', year: 'Discovered 2014', fact: 'The first Earth-sized planet found in another star\'s habitable zone — a true "second Earth" candidate.' },
    { name: 'Kepler-452b', id: 'kepler452b', ra: 296.004, dec: 44.274, type: 'Super-Earth · habitable zone', dist: '1,800 ly', year: 'Discovered 2015', fact: 'Dubbed "Earth\'s cousin" — orbiting a Sun-like star in the habitable zone, though its year is 385 days, a near-twin of ours.' },
    { name: 'WASP-107b', id: 'wasp107', ra: 188.387, dec: -10.146, type: 'Super-puff gas giant', dist: '200 ly', year: 'Discovered 2017', fact: 'The planet with an atmosphere so puffy it is escaping into space — Webb watched its helium cloud stretch ten times the planet\'s radius.' },
    { name: 'K2-18b', id: 'k218b', ra: 168.311, dec: 7.576, type: 'Hycean world · possible water', dist: '124 ly', year: 'Discovered 2015', fact: 'A "hycean" world where Webb found water vapor and methane — perhaps the most discussed candidate for a life-bearing ocean planet.' },
  ],
  clusters: [
    { name: 'Virgo Cluster', id: 'virgocl', ra: 186.75, dec: 12.72, type: 'Galaxy cluster', dist: '54 million ly', year: 'Studied since the 18th century', fact: 'The nearest rich galaxy cluster — ~1,300 galaxies bound together, the heart of the local supercluster, with M87 at its center.' },
    { name: 'Coma Cluster', id: 'comacl', ra: 194.95, dec: 27.95, type: 'Galaxy cluster', dist: '320 million ly', year: 'Catalogued 1785', fact: 'A dense cluster of thousands of galaxies — the prototype of a "rich" cluster, where giant ellipticals swim in a sea of hot gas.' },
    { name: 'Perseus Cluster', id: 'perseuscl', ra: 49.95, dec: 41.51, type: 'Galaxy cluster', dist: '240 million ly', year: 'Studied since the 1950s', fact: 'One of the most massive objects in the nearby universe — its central galaxy NGC 1275 blazes with a supermassive black hole.' },
    { name: 'Hercules Cluster (Abell 2151)', id: 'herculescl', ra: 241.31, dec: 17.74, type: 'Galaxy cluster', dist: '470 million ly', year: 'Catalogued 1958', fact: 'A cluster of mostly spiral galaxies — a younger, looser gathering still forming as galaxies fall together.' },
    { name: 'Fornax Cluster', id: 'fornaxcl', ra: 54.6, dec: -35.45, type: 'Galaxy cluster', dist: '62 million ly', year: 'Studied since the 20th century', fact: 'The second-nearest cluster, after Virgo — a rich treasury of galaxies including the peculiar barred spiral NGC 1365.' },
  ],
  specials: [
    { name: 'The Cosmic Microwave Background', id: 'cmb', ra: 168.0, dec: -7.0, type: 'The oldest light', dist: '13.8 billion light-years (at horizon)', year: 'Discovered 1965', fact: 'The afterglow of the Big Bang, filling all of space at 2.7 K. The map marks the direction of its subtle dipole — the motion of our galaxy through the cosmos.' },
    { name: 'NGC 4993 (GW170817)', id: 'ngc4993', ra: 197.449, dec: -23.383, type: 'Galaxy · kilonova host', dist: '130 million ly', year: '17 Aug 2017', fact: 'The galaxy where two neutron stars collided — the first cosmic event seen in both gravitational waves and light, forging gold and platinum in its fireball.' },
    { name: 'The Orion Nebula (M42)', id: 'm42ref', ra: 83.822, dec: -5.391, type: 'Star-forming region', dist: '1,350 ly', year: 'Known to antiquity', fact: 'The nearest stellar nursery — a vast cloud birthing new suns, visible to the naked eye as the "sword" of Orion.' },
    { name: 'Pillars of Creation', id: 'pillars', ra: 274.7, dec: -13.7, type: 'Star-forming region · Eagle Nebula', dist: '6,500 ly', year: 'Photographed 1995', fact: 'The famous columns in the Eagle Nebula — towers of gas and dust where stars are being born, made immortal by Hubble and Webb.' },
    { name: 'The Great Attractor', id: 'attractor', ra: 201.5, dec: -44.0, type: 'Gravitational anomaly', dist: '~250 million ly', year: 'Inferred 1980s', fact: 'An unseen concentration of mass pulling the Laniakea supercluster — hidden behind the Milky Way\'s dust, known only by its gravitational tug.' },
  ],
}

export const SPECIAL_LAYERS = [
  { key: 'blackholes', label: 'Black Holes', color: '#d4af37' },
  { key: 'pulsars', label: 'Pulsars', color: '#7fe3c0' },
  { key: 'quasars', label: 'Quasars', color: '#ff9e5e' },
  { key: 'snr', label: 'Supernovae', color: '#c86a8a' },
  { key: 'galaxies', label: 'Galaxies', color: '#b58ff2' },
  { key: 'dwarfs', label: 'Dwarf Galaxies', color: '#9d8fe8' },
  { key: 'exoplanets', label: 'Exoplanet Systems', color: '#8fe8c0' },
  { key: 'clusters', label: 'Galaxy Clusters', color: '#f2cf5b' },
  { key: 'specials', label: 'Special Objects', color: '#6a8fb0' },
]

export function flattenCosmic() {
  const all = []
  for (const [cat, items] of Object.entries(COSMIC)) {
    for (const it of items) {
      if (!it.fact) continue // skip placeholder dups
      all.push({ ...it, cat })
    }
  }
  return all
}
