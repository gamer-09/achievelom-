// ─────────────────────────────────────────────────────────────
// COSMOGRAPHIA — the falling stars.
// Radiants (J2000) and peaks of the major meteor showers,
// from the IMO/IAU meteor data center.
// ─────────────────────────────────────────────────────────────

export const SHOWERS = [
  { id: 'quadrantids', name: 'Quadrantids', ra: 230, dec: 49, peak: 'Jan 3–4', zhr: 120, parent: '2003 EH1', note: 'Blue, bright fireballs; a short, sharp peak.' },
  { id: 'lyrids', name: 'Lyrids', ra: 271, dec: 33, peak: 'Apr 21–22', zhr: 18, parent: 'C/1861 G1 Thatcher', note: 'One of the oldest recorded showers — 2,700 years of sightings.' },
  { id: 'eta-aquariids', name: 'η-Aquariids', ra: 338, dec: -1, peak: 'May 5–6', zhr: 50, parent: '1P/Halley', note: 'Dust of Halley\'s Comet; best seen from the tropics at dawn.' },
  { id: 'delta-aquariids', name: 'δ-Aquariids', ra: 340, dec: -16, peak: 'Jul 28–30', zhr: 25, parent: '96P/Machholz', note: 'Faint, steady shower of the southern summer.' },
  { id: 'perseids', name: 'Perseids', ra: 48, dec: 58, peak: 'Aug 12–13', zhr: 100, parent: '109P/Swift-Tuttle', note: 'The great August shower — 100 meteors an hour at peak.' },
  { id: 'draconids', name: 'Draconids', ra: 262, dec: 54, peak: 'Oct 8–9', zhr: 10, parent: '21P/Giacobini-Zinner', note: 'Slow, graceful meteors; occasionally erupts.' },
  { id: 'orionids', name: 'Orionids', ra: 95, dec: 16, peak: 'Oct 21–22', zhr: 20, parent: '1P/Halley', note: 'Halley\'s second gift — fast meteors near Orion.' },
  { id: 'taurids', name: 'Southern Taurids', ra: 32, dec: 9, peak: 'Nov 4–5', zhr: 5, parent: '2P/Encke', note: 'Slow, brilliant fireballs; the comet Encke debris.' },
  { id: 'leonids', name: 'Leonids', ra: 152, dec: 22, peak: 'Nov 17–18', zhr: 15, parent: '55P/Tempel-Tuttle', note: 'The storm shower — in 1833, thousands of meteors an hour.' },
  { id: 'geminids', name: 'Geminids', ra: 112, dec: 32, peak: 'Dec 13–14', zhr: 150, parent: '3200 Phaethon', note: 'The richest shower of the year — slow, bright, multicolored.' },
  { id: 'ursids', name: 'Ursids', ra: 217, dec: 76, peak: 'Dec 22–23', zhr: 10, parent: '8P/Tuttle', note: 'Quiet Christmas meteors circling the pole.' },
]

export const getShower = (id) => SHOWERS.find((s) => s.id === id)
