// Travel data. Each entry describes one country I've visited.
//
// - `id` is the ISO 3166-1 numeric code used by world-atlas TopoJSON (string form).
// - `sticker` drives what renders pinned on the map.
//     { label: 'USA' }                                → text sticker (default today)
//     { image: '/travel/us.jpg', label: 'USA' }       → 3:2 image card (once you add images)
// - `pinCoords` (optional) overrides where the pin is planted on the country.
//   Defaults to the first city's coords. Use this when the first city is in a
//   corner and you'd prefer to pin somewhere more central (e.g. Rome for Italy).
// - `cities` are the memories shown once a country is clicked.
//     `coords` is [longitude, latitude] (easy to grab from Google Maps).
//
// Label positions are computed automatically: a pin in isolation gets its
// label directly above it; pins that share a tight cluster get their labels
// radially fanned out from the cluster's center so they don't overlap. Just
// add new entries — no manual offset tuning required.
//
// A city qualifies if I stayed at least one night there OR made a plan to see it
// and spent a good amount of time.

export const visitedCountries = [
  {
    id: '792',
    code: 'TR',
    name: 'Turkey',
    sticker: { label: 'Turkey' },
    pinCoords: [32.866, 39.925], // Ankara
    cities: [
      { name: 'Istanbul', coords: [28.978, 41.008] },
      { name: 'Ankara', coords: [32.866, 39.925] },
      { name: 'Antalya', coords: [30.709, 36.896] },
      { name: 'Finike', coords: [30.145, 36.301] },
    ],
  },
  {
    id: '840',
    code: 'US',
    name: 'United States',
    sticker: { label: 'USA' },
    cities: [
      { name: 'Chicago', coords: [-87.630, 41.878] },
      { name: 'Milwaukee', coords: [-87.906, 43.038] },
      { name: 'Green Bay', coords: [-88.015, 44.519] },
    ],
  },
  {
    id: '076',
    code: 'BR',
    name: 'Brazil',
    sticker: { label: 'Brazil' },
    pinCoords: [-47.883, -15.793], // Brasília (central)
    cities: [
      { name: 'Fortaleza', coords: [-38.527, -3.732] },
      { name: 'Rio de Janeiro', coords: [-43.196, -22.908] },
      { name: 'Curitiba', coords: [-49.273, -25.428] },
      { name: 'Natal', coords: [-35.210, -5.795] },
      { name: 'Aranaú', coords: [-40.116, -2.886] },
      { name: 'Jericoacoara', coords: [-40.516, -2.792] },
      { name: 'Itapajé', coords: [-39.582, -3.684] },
      { name: 'Aracati', coords: [-37.770, -4.561] },
      { name: 'Manaus', coords: [-60.025, -3.119] },
      { name: 'Paracuru', coords: [-39.030, -3.410] },
      { name: 'Foz do Iguaçu', coords: [-54.587, -25.516] },
      { name: 'São Paulo', coords: [-46.633, -23.550] },
      { name: 'Florianópolis', coords: [-48.548, -27.595] },
      { name: 'Guaramiranga', coords: [-39.001, -4.264] },
      { name: 'Ilha do Guajiru', coords: [-37.260, -3.090] },
    ],
  },
  {
    id: '276',
    code: 'DE',
    name: 'Germany',
    sticker: { label: 'Germany' },
    cities: [
      { name: 'Frankfurt', coords: [8.682, 50.110] },
      { name: 'Berlin', coords: [13.405, 52.520] },
    ],
  },
  {
    id: '250',
    code: 'FR',
    name: 'France',
    sticker: { label: 'France' },
    cities: [
      { name: 'Paris', coords: [2.349, 48.864] },
      { name: 'Lyon', coords: [4.835, 45.764] },
      { name: 'Lille', coords: [3.058, 50.629] },
      { name: 'Marseille', coords: [5.370, 43.296] },
      { name: 'Nice', coords: [7.266, 43.710] },
      { name: 'Cannes', coords: [7.017, 43.553] },
      { name: 'Bordeaux', coords: [-0.580, 44.837] },
      { name: 'Arcachon', coords: [-1.162, 44.658] },
      { name: 'Rouen', coords: [1.099, 49.443] },
      { name: 'Versailles', coords: [2.125, 48.804] },
      { name: 'Beauvais', coords: [2.081, 49.433] },
    ],
  },
  {
    id: '380',
    code: 'IT',
    name: 'Italy',
    sticker: { label: 'Italy' },
    pinCoords: [12.496, 41.903], // Rome
    cities: [
      { name: 'Pisa', coords: [10.401, 43.716] },
      { name: 'Roma', coords: [12.496, 41.903] },
      { name: 'Firenze', coords: [11.256, 43.770] },
      { name: 'Viareggio', coords: [10.253, 43.873] },
      { name: 'Lucca', coords: [10.503, 43.843] },
      { name: 'Cinque Terre', coords: [9.732, 44.109] },
      { name: 'Livorno', coords: [10.316, 43.548] },
      { name: 'Bologna', coords: [11.343, 44.494] },
      { name: 'Napoli', coords: [14.268, 40.851] },
    ],
  },
  {
    id: '336',
    code: 'VA',
    name: 'Vatican',
    sticker: { label: 'Vatican' },
    cities: [{ name: 'Vatican City', coords: [12.454, 41.902] }],
  },
  {
    id: '492',
    code: 'MC',
    name: 'Monaco',
    sticker: { label: 'Monaco' },
    cities: [{ name: 'Monaco', coords: [7.422, 43.738] }],
  },
  {
    id: '724',
    code: 'ES',
    name: 'Spain',
    sticker: { label: 'Spain' },
    pinCoords: [-3.703, 40.417], // Madrid
    cities: [
      { name: 'San Sebastián', coords: [-1.981, 43.319] },
      { name: 'Sevilla', coords: [-5.984, 37.389] },
      { name: 'Madrid', coords: [-3.703, 40.417] },
      { name: 'Barcelona', coords: [2.173, 41.385] },
    ],
  },
  {
    id: '528',
    code: 'NL',
    name: 'Netherlands',
    sticker: { label: 'Netherlands' },
    cities: [
      { name: 'Amsterdam', coords: [4.900, 52.370] },
      { name: 'Zaandam', coords: [4.823, 52.438] },
      { name: 'Eindhoven', coords: [5.469, 51.441] },
    ],
  },
  {
    id: '056',
    code: 'BE',
    name: 'Belgium',
    sticker: { label: 'Belgium' },
    cities: [
      { name: 'Brussels', coords: [4.352, 50.850] },
      { name: 'Ghent', coords: [3.725, 51.054] },
      { name: 'Brugge', coords: [3.225, 51.209] },
    ],
  },
  {
    id: '348',
    code: 'HU',
    name: 'Hungary',
    sticker: { label: 'Hungary' },
    cities: [{ name: 'Budapest', coords: [19.040, 47.498] }],
  },
  {
    id: '040',
    code: 'AT',
    name: 'Austria',
    sticker: { label: 'Austria' },
    cities: [
      { name: 'Wien', coords: [16.373, 48.208] },
      { name: 'Graz', coords: [15.439, 47.071] },
      { name: 'Gesäuse', coords: [14.620, 47.560] },
    ],
  },
  {
    id: '203',
    code: 'CZ',
    name: 'Czechia',
    sticker: { label: 'Czechia' },
    cities: [
      { name: 'Praha', coords: [14.438, 50.076] },
      { name: 'Brno', coords: [16.607, 49.195] },
    ],
  },
  {
    id: '300',
    code: 'GR',
    name: 'Greece',
    sticker: { label: 'Greece' },
    cities: [
      { name: 'Athens', coords: [23.728, 37.984] },
      { name: 'Thessaloniki', coords: [22.945, 40.640] },
      { name: 'Kavala', coords: [24.403, 40.939] },
      { name: 'Omolio', coords: [22.660, 39.894] },
      { name: 'Nea Iraklitsa', coords: [24.441, 40.880] },
    ],
  },
  {
    id: '756',
    code: 'CH',
    name: 'Switzerland',
    sticker: { label: 'Switzerland' },
    pinCoords: [7.447, 46.948], // Bern
    cities: [
      { name: 'Zurich', coords: [8.541, 47.377] },
      { name: 'Bern', coords: [7.447, 46.948] },
      { name: 'Thun', coords: [7.628, 46.760] },
      { name: 'Zermatt', coords: [7.749, 46.021] },
      { name: 'Sierre', coords: [7.535, 46.294] },
      { name: 'Lauterbrunnen', coords: [7.817, 46.604] },
      { name: 'Lausanne', coords: [6.632, 46.519] },
    ],
  },
  {
    id: '688',
    code: 'RS',
    name: 'Serbia',
    sticker: { label: 'Serbia' },
    cities: [{ name: 'Belgrade', coords: [20.449, 44.817] }],
  },
  {
    id: '818',
    code: 'EG',
    name: 'Egypt',
    sticker: { label: 'Egypt' },
    pinCoords: [31.235, 30.044], // Cairo (more central than Dahab)
    cities: [{ name: 'Dahab', coords: [34.513, 28.496] }],
  },
  {
    id: '208',
    code: 'DK',
    name: 'Denmark',
    sticker: { label: 'Denmark' },
    cities: [
      { name: 'Copenhagen', coords: [12.568, 55.676] },
      { name: 'Humlebæk', coords: [12.540, 55.970] },
    ],
  },
  {
    id: '600',
    code: 'PY',
    name: 'Paraguay',
    sticker: { label: 'Paraguay' },
    pinCoords: [-57.575, -25.264], // Asunción
    cities: [{ name: 'Ciudad del Este', coords: [-54.617, -25.516] }],
  },
  {
    id: '032',
    code: 'AR',
    name: 'Argentina',
    sticker: { label: 'Argentina' },
    pinCoords: [-58.381, -34.603], // Buenos Aires
    cities: [{ name: 'Puerto Iguazú', coords: [-54.573, -25.601] }],
  },
];

// Timeline of trips (kept for potential future UI; not currently rendered).
// Flags are for display; country codes reference `visitedCountries[].code`.
export const travelTimeline = [
  { year: 2015, countries: ['US'] },
  { year: 2016, countries: ['US'] },
  { year: 2018, countries: ['BR'] },
  { year: 2019, countries: ['DE'] },
  { year: 2022, countries: ['FR', 'IT', 'VA', 'BE', 'NL', 'ES', 'MC'] },
  { year: 2023, countries: ['HU', 'CZ', 'AT', 'GR', 'IT'] },
  { year: 2024, countries: ['CH', 'IT', 'ES', 'RS', 'AT', 'GR'] },
  { year: 2025, countries: ['EG', 'DK', 'GR', 'BR'] },
  { year: 2026, countries: ['BR', 'PY', 'AR'] },
];
