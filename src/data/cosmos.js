// ─────────────────────────────────────────────────────────────
// COSMOGRAPHIA — the great chain of being, from the infinite
// aeons down to the moons of the wanderers. Each node carries
// its numbers (the Astronomer's Ledger), what the ancients
// believed, and what the moderns have recently discovered.
// ─────────────────────────────────────────────────────────────

const COSMOS = {
  multiverse: {
    id: 'multiverse',
    name: 'The Multiverse',
    ancient: 'The Infinite Aeons',
    type: 'bubbles',
    glyph: '∞',
    palette: ['#2a1c4a', '#14263a'],
    summary:
      'The widest circle of the atlas: the hypothesis that our universe is one bubble among countless others, each with its own laws, its own skies, and its own history. The ancients dreamt of infinite worlds; modern physics inherited the dream and made it a calculation.',
    ledger: [
      { k: 'Kind', v: 'Hypothesis · eternal inflation, string landscape' },
      { k: 'Our bubble', v: 'The Observable Universe' },
      { k: 'Other bubbles', v: 'Unmeasured — by definition beyond our horizon' },
      { k: 'Evidence', v: 'Indirect · cosmic inflation theory, quantum cosmology' },
      { k: 'Ancients', v: 'Epicurus & Democritus taught an infinity of worlds' },
    ],
    facts: [
      'The multiverse is not a single theory but a family of ideas, from eternal inflation to the string-theory landscape.',
      'Some physicists find the idea distasteful precisely because it cannot be tested — it lives at the edge of science and philosophy.',
      'The ancient atomists of Greece proposed infinite worlds forming, dissolving, and forming again — an eerie echo of modern cosmology.',
    ],
    discoveries: [
      { year: '2014', text: 'BICEP2 announced — then retracted — possible gravitational-wave imprints from cosmic inflation, the closest science has come to touching other bubbles.' },
      { year: '2024', text: 'Simulations of eternal inflation remain the leading framework in which "many universes" naturally arise from physics alone.' },
    ],
    children: ['universe'],
  },

  universe: {
    id: 'universe',
    name: 'The Observable Universe',
    ancient: 'The All · Ouranos · Ein-Sof',
    type: 'web',
    glyph: '☉',
    palette: ['#0e1b2c', '#20324d'],
    summary:
      'Everything we can see: the cosmic web of galaxies that emerged from the great heat 13.8 billion years ago. Light from its farthest edge has travelled almost the whole age of the cosmos to reach our instruments.',
    ledger: [
      { k: 'Diameter', v: '≈ 93 billion light-years (93 × 10⁹ ly)' },
      { k: 'Age', v: '13.8 billion years' },
      { k: 'Galaxies', v: '≈ 2 trillion (est.)' },
      { k: 'Stars', v: '≈ 10²⁴ (a 1 followed by 24 zeros)' },
      { k: 'Composition', v: '5% atoms · 27% dark matter · 68% dark energy' },
      { k: 'Ancients', v: 'Aristotle\'s unchanging heavens; the Maya\'s many-layered sky' },
    ],
    facts: [
      'The universe is expanding, and the expansion is accelerating — the discovery that won the 2011 Nobel Prize in Physics.',
      'We see the universe as it was: the most distant galaxies are glimpsed as they appeared only a few hundred million years after the Big Bang.',
      'The cosmic microwave background is the cooled afterglow of creation, first seen in 1965, mapped to exquisite precision by WMAP and Planck.',
    ],
    discoveries: [
      { year: '2022', text: 'The James Webb Space Telescope published its first Deep Field, revealing thousands of galaxies in a sky-fragment the size of a grain of sand at arm\'s length.' },
      { year: '2023–26', text: 'Webb keeps pushing back the frontier: candidate galaxies seen as early as ~200–300 million years after the Big Bang.' },
      { year: '2025', text: 'Dark-energy surveys (DESI) tightened the map of cosmic acceleration, deepening the mystery of why it is happening at all.' },
    ],
    children: ['laniakea'],
  },

  laniakea: {
    id: 'laniakea',
    name: 'Laniakea',
    ancient: 'Immeasurable Heaven',
    type: 'cluster',
    glyph: '✦',
    palette: ['#1a2c44', '#2b4a76'],
    summary:
      'The name given in 2014 to our galactic supercluster: a Hawaiian word meaning "immeasurable heaven." Laniakea is a great basin of 100,000 galaxies flowing toward the Great Attractor — a gravity well we cannot see, but cannot escape.',
    ledger: [
      { k: 'Diameter', v: '≈ 520 million light-years' },
      { k: 'Galaxies', v: '≈ 100,000' },
      { k: 'Mass', v: '≈ 10¹⁷ solar masses' },
      { k: 'Flow', v: 'Everything drifts toward the Great Attractor' },
      { k: 'Home', v: 'Contains the Local Group and the Milky Way' },
      { k: 'Ancients', v: 'Every culture\'s sky-map found its own "great attractor" in the stars' },
    ],
    facts: [
      'The Great Attractor lies behind the Zone of Avoidance, hidden by the dust of the Milky Way — we can only map it by its gravity.',
      'Laniakea itself is part of a larger flow toward an even larger structure, the Shapley Supercluster.',
      'Mapping the universe\'s large-scale structure is one of astronomy\'s great ongoing projects (SDSS, DESI, Euclid).',
    ],
    discoveries: [
      { year: '2014', text: 'R. Brent Tully and colleagues delineated Laniakea using galaxy motions — the supercluster was mapped by where everything is falling, not just where it sits.' },
      { year: '2020', text: 'The eROSITA X-ray survey began charting hot gas across cosmic superclusters, including Laniakea.' },
    ],
    children: ['local-group'],
  },

  'local-group': {
    id: 'local-group',
    name: 'The Local Group',
    ancient: 'The Neighbouring Isles',
    type: 'galaxies',
    glyph: '✧',
    palette: ['#20324d', '#3a5578'],
    summary:
      'A small archipelago of galaxies bound by gravity — our cosmic neighbourhood. Two great spirals, the Milky Way and Andromeda, are slowly falling toward each other, attended by dozens of smaller satellite galaxies.',
    ledger: [
      { k: 'Diameter', v: '≈ 10 million light-years' },
      { k: 'Members', v: '≈ 80 galaxies (mostly dwarfs)' },
      { k: 'Largest', v: 'Andromeda (M31), then the Milky Way, then Triangulum' },
      { k: 'Collision', v: 'Milky Way + Andromeda, in ≈ 4.5 billion years' },
      { k: 'Ancients', v: 'Andromeda was known as a "little cloud" to Persian astronomers' },
    ],
    facts: [
      'The Milky Way and Andromeda are approaching each other at about 110 km per second.',
      'Our nearest large neighbour, Andromeda, contains roughly twice as many stars as the Milky Way.',
      'Dwarf galaxies like the Magellanic Clouds orbit us like attendants at a court.',
    ],
    discoveries: [
      { year: '2021', text: 'Gaia\'s census of our own galaxy\'s companions revealed new ultra-faint dwarf galaxies, rewriting the Local Group\'s membership list.' },
      { year: '2025', text: 'Fresh proper-motion studies refined the Milky Way–Andromeda collision timeline and the paths of the Magellanic Clouds.' },
    ],
    children: ['milky-way'],
  },

  'milky-way': {
    id: 'milky-way',
    name: 'The Milky Way',
    ancient: 'The River of Heaven · The Celestial Nile',
    type: 'galaxy',
    glyph: '☿',
    palette: ['#14263a', '#3a5578'],
    summary:
      'Our home galaxy: a barred spiral of hundreds of billions of stars, threaded with nebulae, littered with black holes, and crowned by a supermassive heart. The ancients saw it as milk spilled by a goddess, or as a river of the dead; we now know it is the great current that carries our Sun.',
    ledger: [
      { k: 'Diameter', v: '≈ 105,700 light-years' },
      { k: 'Stars', v: '100–400 billion (est.)' },
      { k: 'Age', v: '≈ 13.6 billion years' },
      { k: 'Sun\'s orbit', v: '≈ 230 million years around the centre' },
      { k: 'Central black hole', v: 'Sagittarius A* — 4.3 million solar masses' },
      { k: 'Ancients', v: 'Greek myth: milk from Hera\'s breast; Egypt: the Celestial Nile' },
    ],
    facts: [
      'From Earth we see the galaxy edge-on from inside — that is why it is a band of light across the sky.',
      'The Sun sits about 26,000 light-years from the centre, in the Orion Arm, a quiet suburb of the galactic city.',
      'In 2022 we finally imaged the shadow of Sagittarius A*, the black hole at our galaxy\'s heart.',
    ],
    discoveries: [
      { year: '2022', text: 'The Event Horizon Telescope revealed the image of Sagittarius A* — our own supermassive black hole.' },
      { year: '2022–25', text: 'The Gaia mission mapped nearly two billion stars, charting the galaxy\'s spiral structure, star streams, and ancient mergers.' },
      { year: '2025', text: 'Surveys estimated the galaxy may host more free-floating planets than stars — worlds adrift with no sun.' },
    ],
    children: ['solar-system'],
  },

  'solar-system': {
    id: 'solar-system',
    name: 'The Solar System',
    ancient: 'The Wandering Court',
    type: 'system',
    glyph: '✶',
    palette: ['#14263a', '#7a1f1f'],
    summary:
      'The Sun and its train: eight planets, hundreds of moons, countless asteroids and comets — the only court of worlds we have yet been able to touch. The ancients counted five wanderers against the fixed stars; they did not know they lived on one of them.',
    ledger: [
      { k: 'Sun', v: '1.39 million km across · 99.86% of the system\'s mass' },
      { k: 'Planets', v: '8 · Mercury → Neptune' },
      { k: 'Moons', v: '293+ confirmed (and counting)' },
      { k: 'Asteroids', v: '> 1.3 million known' },
      { k: 'Edge', v: 'Heliopause ~18 billion km; Oort Cloud to ~1.5 light-years' },
      { k: 'Ancients', v: 'Babylonian "sheep of the sky"; Greek planetes = wanderers' },
    ],
    facts: [
      'Every planet visible to the naked eye was known to the ancients; Uranus and Neptune awaited telescopes.',
      'The Sun is currently near the maximum of its 11-year sunspot cycle (2024–2025).',
      'Interstellar visitors — ’Oumuamua in 2017, 2I/Borisov in 2019 — are the first objects we have seen pass through our court from elsewhere.',
    ],
    discoveries: [
      { year: '2024', text: 'NASA\'s Europa Clipper and ESA\'s JUICE launched on decade-long voyages to Jupiter\'s ocean moons.' },
      { year: '2025', text: 'The Parker Solar Probe flew through the Sun\'s corona, and interstellar comet C/2024 S1 was caught in ultraviolet by Clipper\'s instruments.' },
      { year: '2026', text: 'New studies suggest Earth\'s atmosphere has been leaking ions to the Moon for billions of years — a steady celestial drizzle.' },
    ],
    children: ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'],
  },

  sun: {
    id: 'sun',
    name: 'The Sun',
    ancient: 'Helios · Ra · Sol · Surya',
    type: 'globe',
    glyph: '☀',
    kind: 'star',
    palette: ['#c1440e', '#f2cf5b'],
    summary:
      'The Giver of Light — a middle-aged yellow dwarf star that has burned for 4.6 billion years and will burn for billions more. Every civilization bowed to it; every life on Earth depends on it.',
    ledger: [
      { k: 'Diameter', v: '1,392,700 km (109 × Earth)' },
      { k: 'Type', v: 'G2V yellow dwarf' },
      { k: 'Mass', v: '333,000 × Earth' },
      { k: 'Surface temp', v: '≈ 5,500 °C' },
      { k: 'Core temp', v: '≈ 15 million °C' },
      { k: 'Rotation', v: '≈ 27 days at the equator' },
    ],
    facts: [
      'The Sun contains 99.86% of all mass in the solar system.',
      'Its light takes 8 minutes 20 seconds to reach Earth.',
      'We are in the middle of Solar Cycle 25, whose maximum peaked around 2024–2025.',
    ],
    discoveries: [
      { year: '2021', text: 'The Parker Solar Probe became the first spacecraft to fly through the Sun\'s outer atmosphere, the corona.' },
      { year: '2026', text: 'The sharpest image yet of the Sun\'s surface revealed Kelvin–Helmholtz waves — great rolling swirls in the solar atmosphere.' },
    ],
    children: [],
  },

  mercury: {
    id: 'mercury',
    name: 'Mercury',
    ancient: 'Hermes · Nabu · Thoth',
    type: 'globe',
    glyph: '☿',
    kind: 'rocky',
    palette: ['#6b6459', '#8f8778'],
    summary:
      'The swift messenger — a scorched, cratered world of iron and dust, shuttling around the Sun in 88 days. Named for the god of messengers, who in every tradition was quick-footed and unreadable.',
    ledger: [
      { k: 'Diameter', v: '4,879 km' },
      { k: 'Distance', v: '57.9 million km (0.39 AU)' },
      { k: 'Year', v: '88 Earth days' },
      { k: 'Day (solar)', v: '176 Earth days' },
      { k: 'Temp', v: '−173 °C → +427 °C' },
      { k: 'Moons', v: '0' },
    ],
    facts: [
      'Mercury\'s surface temperature swings more violently than any other planet\'s.',
      'Despite its nearness to the Sun, shadowed polar craters hold water ice.',
      'Its iron core is enormous — about 85% of the planet\'s radius.',
    ],
    discoveries: [
      { year: '2015', text: 'MESSENGER revealed ice in permanently shadowed craters and a surprisingly dynamic, shrinking planet.' },
      { year: '2025', text: 'BepiColombo\'s flybys confirmed the planet\'s ancient magnetic field is generated in a still-molten core.' },
    ],
    children: [],
  },

  venus: {
    id: 'venus',
    name: 'Venus',
    ancient: 'Aphrodite · Ishtar · Lucifer',
    type: 'globe',
    glyph: '♀',
    kind: 'rocky',
    palette: ['#c9a227', '#e8d5a3'],
    summary:
      'The Morning and Evening Star — the brightest wanderer, robed in unbroken cloud. To the ancients it was the goddess of love; to us it is a warning: a runaway greenhouse world of crushing heat and acid skies.',
    ledger: [
      { k: 'Diameter', v: '12,104 km' },
      { k: 'Distance', v: '108.2 million km (0.72 AU)' },
      { k: 'Year', v: '225 Earth days' },
      { k: 'Day', v: '243 Earth days (retrograde)' },
      { k: 'Surface temp', v: '≈ 464 °C — hotter than Mercury' },
      { k: 'Moons', v: '0' },
    ],
    facts: [
      'Venus spins backwards, so its Sun rises in the west.',
      'Surface pressure is 92 times Earth\'s — like being 900 m under the sea.',
      'It is the only planet named after a goddess.',
    ],
    discoveries: [
      { year: '2023', text: 'Fresh analysis of Magellan radar found signs of active volcanism — Venus is geologically alive.' },
      { year: '2026', text: 'The phosphine debate continues, and NASA\'s DAVINCI+ and VERITAS missions are being prepared to descend into the inferno.' },
    ],
    children: [],
  },

  earth: {
    id: 'earth',
    name: 'Earth',
    ancient: 'Gaia · Terra · Ki',
    type: 'globe',
    glyph: '⊕',
    kind: 'earth',
    palette: ['#2b6e8f', '#3f9e7f'],
    summary:
      'The blue marble — the only world we know that bears life, the only one with oceans of water and skies of oxygen. To the Greeks she was Gaia, mother of all; to us she is home, and the measuring stick for every other world.',
    ledger: [
      { k: 'Diameter', v: '12,742 km' },
      { k: 'Distance', v: '149.6 million km (1 AU)' },
      { k: 'Year', v: '365.25 days' },
      { k: 'Day', v: '23 h 56 min' },
      { k: 'Temp (mean)', v: '≈ 15 °C' },
      { k: 'Moons', v: '1 — the Moon' },
    ],
    facts: [
      'Earth is the densest planet in the solar system.',
      'Its magnetic field, made by the liquid-iron core, shields us from the solar wind.',
      'We are the only known living world — which makes every search for life elsewhere a search for a second Earth.',
    ],
    discoveries: [
      { year: '2022', text: 'JWST began observing exoplanet atmospheres, using Earth as the template for habitability.' },
      { year: '2025', text: 'Asteroid 2024 YR4 briefly topped impact-risk lists, reminding us Earth shares its orbit-lane with rocks.' },
      { year: '2026', text: 'Studies found Earth\'s atmosphere has been steadily donating ions to the Moon for billions of years.' },
    ],
    children: ['moon'],
  },

  moon: {
    id: 'moon',
    name: 'The Moon',
    ancient: 'Selene · Chandra · Luna · Sin',
    type: 'globe',
    glyph: '☾',
    kind: 'moon',
    palette: ['#9db8d9', '#d8d8d0'],
    summary:
      'The silver attendant — Earth\'s constant companion and the only other world humans have walked upon. Every calendar, every month, and a thousand myths descend from her phases.',
    ledger: [
      { k: 'Diameter', v: '3,474 km' },
      { k: 'Distance', v: '384,400 km from Earth' },
      { k: 'Orbit', v: '27.3 days' },
      { k: 'Tidally locked', v: 'We always see the same face' },
      { k: 'Temp', v: '−173 °C → +127 °C' },
      { k: 'Gravity', v: '1/6 of Earth\'s' },
    ],
    facts: [
      'The Moon is drifting away from Earth by about 3.8 cm every year.',
      'It is thought to have formed when a Mars-sized body struck the young Earth.',
      'Its dark patches ("maria") are ancient lava plains — the "face" in the Moon.',
    ],
    discoveries: [
      { year: '2020', text: 'SOFIA confirmed water molecules in sunlit lunar soil.' },
      { year: '2023–26', text: 'India\'s Chandrayaan-3 landed at the south pole; NASA\'s Artemis programme aims to return humans, with a pole base planned.' },
      { year: '2026', text: 'VIPER-class prospectors and new analyses continue mapping polar water ice for future settlements.' },
    ],
    children: [],
  },

  mars: {
    id: 'mars',
    name: 'Mars',
    ancient: 'Ares · Nergal · Hēru',
    type: 'globe',
    glyph: '♂',
    kind: 'rocky',
    palette: ['#b34a2a', '#d9a05b'],
    summary:
      'The red wanderer — god of war, stained with rust. Mars holds the tallest volcano, the deepest canyon, and more robotic emissaries than any world beyond Earth. The ancients feared it; we court it.',
    ledger: [
      { k: 'Diameter', v: '6,779 km' },
      { k: 'Distance', v: '227.9 million km (1.52 AU)' },
      { k: 'Year', v: '687 Earth days' },
      { k: 'Day', v: '24 h 37 min' },
      { k: 'Temp', v: '−63 °C average' },
      { k: 'Moons', v: '2 — Phobos & Deimos' },
    ],
    facts: [
      'Olympus Mons is the tallest volcano in the solar system — 3× Everest.',
      'Mars once had rivers, lakes, and possibly an ocean.',
      'Its sky is butterscotch, its dust devils tower, and its ice caps are part carbon dioxide.',
    ],
    discoveries: [
      { year: '2021', text: 'Perseverance landed in Jezero Crater; the Ingenuity helicopter became the first craft to fly on another world.' },
      { year: '2023–25', text: 'Perseverance cached rock cores rich in organic molecules — the first samples for Mars Sample Return.' },
      { year: '2026', text: 'Studies of the rover\'s samples and orbiters\' radar continue to map ancient aquifers and lakebeds.' },
    ],
    children: ['phobos', 'deimos'],
  },

  phobos: {
    id: 'phobos',
    name: 'Phobos',
    ancient: 'Fear (son of Ares)',
    type: 'globe',
    glyph: '☍',
    kind: 'moon',
    palette: ['#8a7a58', '#b7a67f'],
    summary:
      'The inner moon of Mars, named for Terror itself — a lumpy, cratered potato that circles Mars in under 8 hours, rising and setting twice a day.',
    ledger: [
      { k: 'Size', v: '27 × 22 × 18 km' },
      { k: 'Orbit', v: '9,376 km above Mars — the closest moon in the solar system' },
      { k: 'Period', v: '7 h 39 min' },
      { k: 'Fate', v: 'Spiralling inward — will break apart or crash in ~50 million years' },
    ],
    facts: [
      'Phobos is doomed: tidal forces drag it ever closer to Mars.',
      'It may be a captured asteroid, its surface crossed by the enormous Stickney crater.',
    ],
    discoveries: [
      { year: '2024', text: 'Japan\'s MMX mission launched to collect a sample from Phobos and return it — the first sample-return from a moon of another planet.' },
    ],
    children: [],
  },

  deimos: {
    id: 'deimos',
    name: 'Deimos',
    ancient: 'Terror (son of Ares)',
    type: 'globe',
    glyph: '☍',
    kind: 'moon',
    palette: ['#8a7a58', '#c9b98a'],
    summary:
      'The smaller, quieter twin — a pale speck drifting far out from Mars, named for the other son of Ares: Terror, or Dread.',
    ledger: [
      { k: 'Size', v: '15 × 12 × 11 km' },
      { k: 'Orbit', v: '23,463 km from Mars' },
      { k: 'Period', v: '30.3 hours' },
      { k: 'Brightness', v: 'Like a star from the Martian surface' },
    ],
    facts: [
      'Deimos is one of the smallest moons in the solar system.',
      'Its orbit is nearly circular and far from the "synchronous" radius — a quiet survivor.',
    ],
    discoveries: [
      { year: '2025', text: 'MMX flybys refined Deimos\'s shape and composition, confirming a regolith-rich, asteroid-like body.' },
    ],
    children: [],
  },

  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    ancient: 'Zeus · Marduk · Jupiter',
    type: 'globe',
    glyph: '♃',
    kind: 'gas',
    palette: ['#c9a227', '#a56b3a'],
    summary:
      'The king of planets — a giant of gas and storm, lord of the heavens in every pantheon. Its Great Red Spot has raged for centuries, and its moons are the most promising hunting ground for life in the outer solar system.',
    ledger: [
      { k: 'Diameter', v: '139,820 km (11 × Earth)' },
      { k: 'Distance', v: '778.5 million km (5.2 AU)' },
      { k: 'Year', v: '11.86 Earth years' },
      { k: 'Day', v: '9 h 56 min — the shortest day of any planet' },
      { k: 'Temp', v: '−108 °C' },
      { k: 'Moons', v: '95 confirmed' },
    ],
    facts: [
      'Jupiter is more massive than all other planets combined — 2.5×.',
      'The Great Red Spot is a storm wider than Earth, shrinking but persistent.',
      'Its magnetic field is the strongest of any planet, and it shepherds the asteroid belt.',
    ],
    discoveries: [
      { year: '2024', text: 'NASA\'s Europa Clipper launched toward Jupiter\'s ocean moon Europa; ESA\'s JUICE is bound for Ganymede.' },
      { year: '2025', text: 'Juno\'s polar images and gravity data revealed a deep, dense core and cyclones arranged like a crown.' },
      { year: '2026', text: 'Clipper\'s instruments caught an interstellar comet crossing the Jovian system on its way in.' },
    ],
    children: ['io', 'europa', 'ganymede', 'callisto'],
  },

  io: {
    id: 'io',
    name: 'Io',
    ancient: 'The Priestess',
    type: 'globe',
    glyph: '☽',
    kind: 'moon',
    palette: ['#e0c15a', '#b34a2a'],
    summary:
      'The most volcanic world in the solar system — a lemon-gold moon tortured by Jupiter\'s gravity, its hundreds of volcanoes hurling sulfur plumes hundreds of kilometres high.',
    ledger: [
      { k: 'Diameter', v: '3,643 km' },
      { k: 'Orbit', v: '421,700 km from Jupiter' },
      { k: 'Period', v: '1.77 days' },
      { k: 'Volcanoes', v: '400+ active' },
      { k: 'Temp', v: '−130 °C (surface); lava >1,000 °C' },
    ],
    facts: [
      'Io is stretched and squeezed by Jupiter and its sibling moons — tidal heating powers its fire.',
      'Its sulfur crust paints it in golds, oranges, and reds.',
    ],
    discoveries: [
      { year: '2023–24', text: 'Juno\'s close flybys mapped a magma ocean beneath Io\'s crust.' },
      { year: '2025', text: 'Ground-based telescopes caught Io\'s largest eruption in decades, a plume visible from Earth.' },
    ],
    children: [],
  },

  europa: {
    id: 'europa',
    name: 'Europa',
    ancient: 'The Beloved of Zeus',
    type: 'globe',
    glyph: '☽',
    kind: 'ice',
    palette: ['#9db8d9', '#e8e4da'],
    summary:
      'A smooth, icy world crossed with red cracks — hiding beneath its shell a global ocean with more water than all of Earth\'s seas. If we ever find life beyond Earth, it may begin here.',
    ledger: [
      { k: 'Diameter', v: '3,121 km' },
      { k: 'Ocean', v: '≈ 100 km deep, under ~15 km of ice' },
      { k: 'Water', v: '2× all Earth\'s oceans combined' },
      { k: 'Orbit', v: '671,000 km from Jupiter' },
      { k: 'Temp', v: '−160 °C at the surface' },
    ],
    facts: [
      'Europa\'s surface is the smoothest in the solar system — young ice, endlessly resurfaced.',
      'Plumes of water vapor may vent from the shell into space.',
      'The red cracks are likely salts and sulfur compounds, possibly from the ocean below.',
    ],
    discoveries: [
      { year: '2023', text: 'JWST found carbon dioxide on the surface — probably rising from the subsurface ocean.' },
      { year: '2024', text: 'Europa Clipper launched: the largest planetary spacecraft ever built, arriving 2030 to fly by Europa ~49 times.' },
      { year: '2026', text: 'Fresh models debate whether the seafloor is calm or active — both camps agree the ocean is real and huge.' },
    ],
    children: [],
  },

  ganymede: {
    id: 'ganymede',
    name: 'Ganymede',
    ancient: 'The Cupbearer',
    type: 'globe',
    glyph: '☽',
    kind: 'ice',
    palette: ['#8a7a58', '#b7a67f'],
    summary:
      'The largest moon in the solar system — bigger than Mercury — with its own magnetic field and, very likely, a layered ocean buried beneath ancient, cratered ice.',
    ledger: [
      { k: 'Diameter', v: '5,268 km — larger than Mercury' },
      { k: 'Orbit', v: '1,070,000 km from Jupiter' },
      { k: 'Period', v: '7.15 days' },
      { k: 'Magnetic field', v: 'The only moon with its own' },
      { k: 'Oceans', v: 'Likely 2–3 stacked between ice layers' },
    ],
    facts: [
      'Ganymede\'s surface is a patchwork of dark ancient terrain and bright grooved ice.',
      'Its subsurface ocean may hold more water than all Earth\'s oceans combined.',
    ],
    discoveries: [
      { year: '2024', text: 'ESA\'s JUICE set sail for Jupiter, to orbit Ganymede in 2034 — the first spacecraft ever to orbit a moon of another planet.' },
    ],
    children: [],
  },

  callisto: {
    id: 'callisto',
    name: 'Callisto',
    ancient: 'The Huntress',
    type: 'globe',
    glyph: '☽',
    kind: 'ice',
    palette: ['#5a6678', '#8a97a8'],
    summary:
      'The most heavily cratered world known — a dark, ancient sentinel of the outer system, scarred and unchanged for four billion years.',
    ledger: [
      { k: 'Diameter', v: '4,821 km' },
      { k: 'Orbit', v: '1,883,000 km from Jupiter' },
      { k: 'Period', v: '16.7 days' },
      { k: 'Surface', v: 'The oldest in the solar system' },
      { k: 'Ocean', v: 'Possible, under deep ice' },
    ],
    facts: [
      'Callisto\'s surface is so ancient it records impacts from the birth of the solar system.',
      'It sits far enough from Jupiter to escape tidal heating — a frozen archive.',
    ],
    discoveries: [
      { year: '2025', text: 'Radar studies continued to probe for a deep subsurface ocean beneath Callisto\'s battered crust.' },
    ],
    children: [],
  },

  saturn: {
    id: 'saturn',
    name: 'Saturn',
    ancient: 'Cronus · Kaiwan · Śani',
    type: 'globe',
    glyph: '♄',
    kind: 'ringed',
    palette: ['#d9a05b', '#c9b98a'],
    summary:
      'The jewel of the heavens — a golden giant girdled by rings of ice, once the farthest of the ancient wanderers. In every tradition Saturn is time, old age, and the boundary of the visible world.',
    ledger: [
      { k: 'Diameter', v: '116,460 km (9.5 × Earth)' },
      { k: 'Distance', v: '1.43 billion km (9.5 AU)' },
      { k: 'Year', v: '29.4 Earth years' },
      { k: 'Day', v: '10 h 42 min' },
      { k: 'Rings', v: 'Hundreds of thousands of icy shards, ~10 m–1 km thick' },
      { k: 'Moons', v: '146 confirmed' },
    ],
    facts: [
      'Saturn is the least dense planet — it would float in water.',
      'Its rings are young (100–400 million years) and slowly raining onto the planet.',
      'Its moon Titan has rivers and seas of liquid methane.',
    ],
    discoveries: [
      { year: '2017', text: 'Cassini\'s Grand Finale dove between Saturn and its rings, ending a 13-year mission.' },
      { year: '2024–25', text: 'Webb and Keck tracked disappearing and reappearing spokes in the rings, tied to the seasons.' },
      { year: '2026', text: 'Dragonfly, a rotorcraft to fly the skies of Titan, is on track for a 2028 launch.' },
    ],
    children: ['titan', 'enceladus'],
  },

  titan: {
    id: 'titan',
    name: 'Titan',
    ancient: 'The Elder Titan',
    type: 'globe',
    glyph: '☽',
    kind: 'titan',
    palette: ['#c9a227', '#e8d5a3'],
    summary:
      'The only moon with a thick atmosphere and standing liquid on its surface — rivers of methane, lakes of ethane, and an orange sky of nitrogen smog. The most Earth-like landscape in the solar system, made of completely alien materials.',
    ledger: [
      { k: 'Diameter', v: '5,150 km' },
      { k: 'Atmosphere', v: '1.5× Earth\'s pressure, mostly nitrogen' },
      { k: 'Lakes', v: 'Methane & ethane seas at the poles' },
      { k: 'Orbit', v: '1.22 million km from Saturn' },
      { k: 'Temp', v: '−179 °C' },
    ],
    facts: [
      'Titan\'s weather cycle — evaporation, clouds, rain — mirrors Earth\'s, with methane as the water.',
      'Its dunes are made of solid hydrocarbon sand.',
      'Under the crust, a liquid-water ocean may lurk — two ocean worlds in one moon.',
    ],
    discoveries: [
      { year: '2024', text: 'Radar maps from Cassini data revealed the full shape and depth of Titan\'s methane seas.' },
      { year: '2025', text: 'NASA confirmed Dragonfly — a nuclear-powered octocopter — will fly to Titan\'s dunes, targeting a 2028 launch.' },
    ],
    children: [],
  },

  enceladus: {
    id: 'enceladus',
    name: 'Enceladus',
    ancient: 'The Giant',
    type: 'globe',
    glyph: '☽',
    kind: 'ice',
    palette: ['#e8e4da', '#9db8d9'],
    summary:
      'A small, brilliant white moon that vents its hidden ocean into space through geysers at its south pole — organic molecules included. One of the most probable homes of life beyond Earth.',
    ledger: [
      { k: 'Diameter', v: '504 km — a moon the size of Britain' },
      { k: 'Ocean', v: 'Global, beneath ~20 km of ice' },
      { k: 'Geysers', v: 'Plumes through tiger-stripe fractures' },
      { k: 'Albedo', v: 'The brightest body in the solar system' },
      { k: 'Orbit', v: '238,000 km from Saturn' },
    ],
    facts: [
      'Cassini flew through the plumes and tasted water, salts, silica, and complex organics.',
      'Tidal flexing keeps the ocean warm and the geysers flowing.',
    ],
    discoveries: [
      { year: '2023', text: 'JWST found a giant plume of water vapor — hundreds of kilometres long — streaming from Enceladus.' },
      { year: '2024–26', text: 'Debate continues over which molecules in the plume could be biological; a dedicated Enceladus orbiter remains the dream mission.' },
    ],
    children: [],
  },

  uranus: {
    id: 'uranus',
    name: 'Uranus',
    ancient: 'Ouranos · Heaven',
    type: 'globe',
    glyph: '⛢',
    kind: 'ice-giant',
    palette: ['#7fb3c9', '#a8d3de'],
    summary:
      'The sky itself, in the old myths — a pale cyan ice giant tipped onto its side, rolling around the Sun like a barrel. Discovered only in 1781, it was the first planet found by telescope.',
    ledger: [
      { k: 'Diameter', v: '50,724 km (4 × Earth)' },
      { k: 'Distance', v: '2.87 billion km (19.8 AU)' },
      { k: 'Year', v: '84 Earth years' },
      { k: 'Day', v: '17 h 14 min' },
      { k: 'Axial tilt', v: '98° — it rolls on its side' },
      { k: 'Moons', v: '28, named for Shakespeare & Pope' },
    ],
    facts: [
      'Uranus\'s sideways spin means each pole gets 42 years of sunlight, then 42 of night.',
      'Its methane atmosphere is the reason for its pale blue-green colour.',
      'It may hide a vast liquid ocean beneath its clouds.',
    ],
    discoveries: [
      { year: '2023', text: 'JWST photographed Uranus\'s rings, moons, and seasonal storms with unprecedented clarity.' },
      { year: '2025', text: 'New modelling suggested Uranus\'s interior ocean is layered and may churn with convection.' },
    ],
    children: [],
  },

  neptune: {
    id: 'neptune',
    name: 'Neptune',
    ancient: 'Poseidon · Varuna',
    type: 'globe',
    glyph: '♆',
    kind: 'ice-giant',
    palette: ['#2b5a8f', '#5a8fc9'],
    summary:
      'The deep blue ruler of the outermost realm — found by mathematics before sight, its existence predicted from wobbles in Uranus\'s orbit. The winds of Neptune are the fastest in the solar system.',
    ledger: [
      { k: 'Diameter', v: '49,244 km (3.9 × Earth)' },
      { k: 'Distance', v: '4.5 billion km (30.1 AU)' },
      { k: 'Year', v: '165 Earth years' },
      { k: 'Day', v: '16 h 6 min' },
      { k: 'Winds', v: 'Up to 2,100 km/h — supersonic' },
      { k: 'Moons', v: '16, including Triton' },
    ],
    facts: [
      'Neptune has completed only one full orbit since its discovery in 1846.',
      'It radiates 2.6× more heat than it receives from the Sun.',
      'Its moon Triton orbits backwards and may be a captured Kuiper Belt world.',
    ],
    discoveries: [
      { year: '2025', text: 'JWST captured Neptune\'s auroras — the first direct images of them.' },
      { year: '2026', text: 'Seasonal studies of Neptune\'s bright cloud bands continue, tying them to its slow 165-year orbit.' },
    ],
    children: ['triton'],
  },

  triton: {
    id: 'triton',
    name: 'Triton',
    ancient: 'Son of Poseidon',
    type: 'globe',
    glyph: '☽',
    kind: 'ice',
    palette: ['#9db8d9', '#e8e4da'],
    summary:
      'A frozen, retrograde world of nitrogen geysers and cantaloupe terrain — almost certainly a captured Kuiper Belt dwarf planet, now condemned to circle Neptune backwards.',
    ledger: [
      { k: 'Diameter', v: '2,707 km' },
      { k: 'Orbit', v: 'Retrograde — the only large moon to orbit backwards' },
      { k: 'Period', v: '5.9 days, spiralling inward' },
      { k: 'Temp', v: '−235 °C — the coldest measured world' },
      { k: 'Geysers', v: 'Nitrogen vents, seen by Voyager 2' },
    ],
    facts: [
      'Triton\'s geysers make it one of the few volcanically active moons — with frozen nitrogen instead of lava.',
      'In a few hundred million years it will shatter into a ring around Neptune.',
    ],
    discoveries: [
      { year: '2025', text: 'A proposed Trident-class mission continues to be studied; Triton remains the only large body seen by a single spacecraft flyby (Voyager 2, 1989).' },
    ],
    children: [],
  },
}

// Derive the child lists from the tree
export const NODE_ORDER = [
  'multiverse', 'universe', 'laniakea', 'local-group', 'milky-way', 'solar-system',
  'sun', 'mercury', 'venus', 'earth', 'moon', 'mars', 'phobos', 'deimos',
  'jupiter', 'io', 'europa', 'ganymede', 'callisto',
  'saturn', 'titan', 'enceladus', 'uranus', 'neptune', 'triton',
]

export const getNode = (id) => COSMOS[id] || null
export const getChildren = (id) => (COSMOS[id]?.children || []).map((c) => COSMOS[c]).filter(Boolean)
export const getParent = (id) => {
  for (const key of NODE_ORDER) {
    if ((COSMOS[key].children || []).includes(id)) return COSMOS[key]
  }
  return null
}

// Build the full chain of ancestors from the root down to a given node.
export function pathTo(id) {
  const chain = []
  let cur = COSMOS[id]
  while (cur) {
    chain.unshift(cur.id)
    cur = getParent(cur.id)
  }
  return chain.length ? chain : [ROOT_ID]
}

// The full zoom chain from the root down
export const ROOT_ID = 'multiverse'

export const atlasSummary = {
  levels: 10,
  worlds: NODE_ORDER.length,
  root: 'multiverse',
}
