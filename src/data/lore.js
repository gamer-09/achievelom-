// ─────────────────────────────────────────────────────────────
// COSMOGRAPHIA — the Lore of the Heavens.
// Constellations, the sages who read the sky, and the words
// of the modern astronomers.
// ─────────────────────────────────────────────────────────────

export const CONSTELLATIONS = [
  {
    id: 'orion',
    name: 'Orion',
    latin: 'The Hunter',
    culture: 'Greek · Egyptian (Sah)',
    brightStars: ['Betelgeuse (α)', 'Rigel (β)', 'Bellatrix (γ)'],
    story:
      'A mighty hunter who boasted he could slay any beast — so the gods set a scorpion against him, and both were raised to the sky on opposite sides of the heavens, so the Scorpion may never catch the Hunter while the world turns.',
    points: [
      [50, 24], [57, 30], [65, 36], [55, 44], [60, 48], [65, 52], [48, 52], [42, 56], [35, 58],
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7], [7, 8], [6, 4], [1, 6],
    ],
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopeia',
    latin: 'The Queen',
    culture: 'Greek · Babylonian',
    brightStars: ['Schedar (α)', 'Caph (β)', 'Gamma Cassiopeiae'],
    story:
      'The vain queen who boasted her beauty exceeded the sea-nymphs\'. As punishment she was bound to her throne and set circling the pole, forever tipped upside-down, forever admiring herself in the sky.',
    points: [
      [28, 40], [40, 46], [52, 40], [63, 47], [74, 42],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    id: 'ursa-major',
    name: 'Ursa Major',
    latin: 'The Great Bear',
    culture: 'Many · the Plough / Big Dipper',
    brightStars: ['Dubhe (α)', 'Merak (β)', 'Alioth (ε)'],
    story:
      'The bear into which the nymph Callisto was transformed — and the Dipper, whose two bowl stars point the way to Polaris, the North Star, the immovable hub around which all the sky turns.',
    points: [
      [20, 62], [32, 55], [44, 50], [56, 46], [62, 34], [70, 24], [52, 30],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [3, 6]],
  },
  {
    id: 'scorpius',
    name: 'Scorpius',
    latin: 'The Scorpion',
    culture: 'Greek · Mesopotamian',
    brightStars: ['Antares (α)', 'Shaula (λ)', 'Sargas (θ)'],
    story:
      'The scorpion sent by Gaia to slay the boastful hunter Orion. So great was its sting that even gods feared it — and so it hunts Orion across the sky for all eternity, always rising as the Hunter sets.',
    points: [
      [30, 20], [36, 28], [44, 32], [52, 36], [58, 44], [54, 52], [60, 58], [66, 62], [73, 66],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]],
  },
  {
    id: 'cygnus',
    name: 'Cygnus',
    latin: 'The Swan',
    culture: 'Greek · also the Northern Cross',
    brightStars: ['Deneb (α)', 'Albireo (β)', 'Sadr (γ)'],
    story:
      'Zeus in the form of a swan — or the musician Orpheus, or the boy Cygnus who dove for his friend. The swan flies down the Milky Way, and its tail-star Deneb marks the Cross\'s top.',
    points: [
      [50, 18], [44, 30], [40, 42], [36, 54], [32, 66], [52, 40], [62, 36],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 6]],
  },
]

export const SAGES = [
  {
    name: 'The Babylonian Scribes',
    era: 'c. 1800–600 BC · Mesopotamia',
    deed: 'The first astronomers in the full sense — they kept tablets (Enuma Anu Enlil) recording eclipses, planetary motions, and a zodiac of twelve signs, and could predict eclipses with the Saros cycle.',
    glyph: '𒀭',
  },
  {
    name: 'Aristarchus of Samos',
    era: 'c. 310–230 BC · Greece',
    deed: 'Argued that the Sun, not the Earth, sits at the centre — 1,800 years before Copernicus. He also measured the sizes and distances of Sun and Moon with clever geometry.',
    glyph: '☉',
  },
  {
    name: 'Eratosthenes',
    era: 'c. 276–194 BC · Egypt',
    deed: 'Measured the circumference of the Earth to within a few percent using shadows in wells at two cities — pure geometry, no travel.',
    glyph: '⊕',
  },
  {
    name: 'Hipparchus',
    era: 'c. 190–120 BC · Greece',
    deed: 'Compiled the first great star catalogue (850+ stars), discovered the precession of the equinoxes, and invented the magnitude scale we still use.',
    glyph: '✶',
  },
  {
    name: 'Claudius Ptolemy',
    era: 'c. 100–170 AD · Alexandria',
    deed: 'Wrote the Almagest — the grand synthesis of ancient astronomy, with a geocentric model so useful it served for 1,400 years. The most influential astronomy book ever written.',
    glyph: '✦',
  },
  {
    name: 'Hypatia of Alexandria',
    era: 'c. 350–415 AD · Egypt',
    deed: 'Mathematician, philosopher, and teacher who wrote commentaries on the astronomy of her time — one of the first women of science whose life is well documented.',
    glyph: '☽',
  },
  {
    name: 'The Maya Astronomers',
    era: 'c. 300–900 AD · Mesoamerica',
    deed: 'Built observatories, tracked Venus with astonishing precision (the Dresden Codex tables), and devised calendars more accurate than Europe\'s for centuries.',
    glyph: '◉',
  },
  {
    name: 'Al-Battani',
    era: 'c. 858–929 AD · Mesopotamia',
    deed: 'The greatest astronomer of the Islamic Golden Age — improved Ptolemy\'s measurements, refined the solar year, and his tables were used in Europe for six centuries.',
    glyph: '☾',
  },
  {
    name: 'Nicolaus Copernicus',
    era: '1473–1543 · Poland',
    deed: 'Restored the Sun to the centre. His De revolutionibus set the planets in ordered motion and triggered the Scientific Revolution.',
    glyph: '☀',
  },
  {
    name: 'Tycho Brahe',
    era: '1546–1601 · Denmark',
    deed: 'The last great naked-eye astronomer — his unprecedented observations of Mars made Kepler\'s laws possible. A man who measured the heavens with brass and patience.',
    glyph: '⚶',
  },
  {
    name: 'Johannes Kepler',
    era: '1571–1630 · Germany',
    deed: 'Discovered the three laws of planetary motion — that planets move in ellipses, sweep equal areas, and that the outer planets move slower. The cosmos\'s first written constitution.',
    glyph: '♄',
  },
  {
    name: 'Galileo Galilei',
    era: '1564–1642 · Italy',
    deed: 'Turned a telescope on the sky: craters on the Moon, the moons of Jupiter, the phases of Venus. He saw that the heavens were not perfect — and said so.',
    glyph: '♃',
  },
  {
    name: 'Isaac Newton',
    era: '1643–1727 · England',
    deed: 'Unified the heavens and the Earth with universal gravitation — the same force that drops an apple steers the planets and holds the Moon in its path.',
    glyph: '⊕',
  },
  {
    name: 'Edwin Hubble',
    era: '1889–1953 · USA',
    deed: 'Proved galaxies lie beyond the Milky Way and that the universe is expanding — the observation that became the Big Bang.',
    glyph: '✦',
  },
  {
    name: 'The Modern Armada',
    era: '1990–present · Worldwide',
    deed: 'Hubble, JWST, Gaia, Parker, Juno, Voyager, Clipper… the newest "sages" are machines, but the questions they ask are the oldest: where did we come from, and are we alone?',
    glyph: '✧',
  },
]

export const GLOSSARY = [
  { term: 'Light-year', def: 'The distance light travels in one year — about 9.46 trillion kilometres. A measure of distance, not time.' },
  { term: 'Astronomical Unit (AU)', def: 'The average Earth–Sun distance, about 150 million km. The ancients\' "step" for the solar system.' },
  { term: 'Parsec', def: '3.26 light-years — the distance at which a star shifts by one arcsecond against the background as Earth moves. Born from the oldest trick in astronomy: parallax.' },
  { term: 'Redshift', def: 'Light stretched to longer, redder wavelengths by the expansion of space. The farther a galaxy, the more redshifted — and the further back in time we see.' },
  { term: 'Exoplanet', def: 'A planet orbiting a star other than the Sun. First confirmed in 1992; more than 5,800 known today.' },
  { term: 'Habitable zone', def: 'The band around a star where a rocky world could keep liquid water — the "Goldilocks" ring where life as we know it might take hold.' },
  { term: 'Black hole', def: 'A region where gravity is so strong that nothing, not even light, escapes. Ranging from a few solar masses to billions.' },
  { term: 'Neutron star', def: 'The crushed core of a dead massive star — a teaspoon of its matter weighs a billion tonnes on Earth.' },
  { term: 'Supernova', def: 'The explosive death of a star, briefly outshining its entire galaxy. The alchemist\'s furnace that forged the elements in our bones.' },
  { term: 'Nebula', def: 'A cloud of gas and dust — a stellar nursery where new suns are born, or the glowing shroud of a dying one.' },
  { term: 'Quasar', def: 'The blazing core of a young galaxy, powered by a supermassive black hole devouring matter — visible across the universe.' },
  { term: 'Cosmic microwave background', def: 'The afterglow of the Big Bang, now cooled to 2.7 Kelvin. The oldest light in the universe, imprinted when it was 380,000 years old.' },
  { term: 'Dark matter', def: 'Invisible mass, 27% of the universe, that holds galaxies together and bends light, but has never been directly seen.' },
  { term: 'Dark energy', def: 'The mysterious force, 68% of the universe, accelerating the expansion of space. The biggest open question in cosmology.' },
  { term: 'Gravitational waves', def: 'Ripples in the fabric of space itself, first detected in 2015, rung by colliding black holes — a new sense with which to hear the universe.' },
  { term: 'Pulsar', def: 'A spinning neutron star sweeping beams of radiation like a lighthouse — the most precise natural clocks in the cosmos.' },
  { term: 'Eclipse', def: 'When one heavenly body passes through the shadow of another. Total solar eclipses occur when the Moon, at just the right distance, perfectly covers the Sun.' },
]

export const ALMANAC = [
  { when: '3 March 2026', what: 'Total lunar eclipse — the Moon passes fully through Earth\'s shadow.', how: 'All of the Americas' },
  { when: '12 August 2026', what: 'Total solar eclipse — the "Great Eclipse of 2026".', how: 'Greenland, Iceland, Spain, Russia' },
  { when: '12 August 2026', what: 'Six-planet morning alignment — Mercury, Mars, Jupiter, Saturn, Uranus, Neptune in a line before sunrise.', how: 'Worldwide, dawn sky' },
  { when: '12–13 August 2026', what: 'Perseid meteor shower peak — up to 100 meteors per hour under a new moon.', how: 'Northern Hemisphere' },
  { when: '27–28 August 2026', what: 'Deep partial lunar eclipse (93% of the Moon covered).', how: 'The Americas, Europe, Africa' },
]
