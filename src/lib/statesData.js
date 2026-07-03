// ─── STATES & CITIES DATA ────────────────────────────────────────────────────
// Each state has a capital (wildcard) and a list of cities
// We use 10 states for a balanced deck (~90 cards)

export const STATES_DATA = [
  {
    id: 'california', label: 'California', short: 'CA', emoji: '🌴',
    capital: { id: 'sacramento', label: 'Sacramento', short: 'Sacramento', emoji: '⭐' },
    cities: [
      { id: 'los_angeles', label: 'Los Angeles', short: 'L.A.' },
      { id: 'san_francisco', label: 'San Francisco', short: 'S.F.' },
      { id: 'san_diego', label: 'San Diego', short: 'S.D.' },
      { id: 'san_jose', label: 'San Jose', short: 'S.J.' },
      { id: 'fresno', label: 'Fresno', short: 'Fresno' },
      { id: 'oakland', label: 'Oakland', short: 'Oakland' },
    ],
  },
  {
    id: 'texas', label: 'Texas', short: 'TX', emoji: '🤠',
    capital: { id: 'austin', label: 'Austin', short: 'Austin', emoji: '⭐' },
    cities: [
      { id: 'houston', label: 'Houston', short: 'Houston' },
      { id: 'dallas', label: 'Dallas', short: 'Dallas' },
      { id: 'san_antonio', label: 'San Antonio', short: 'S.A.' },
      { id: 'fort_worth', label: 'Fort Worth', short: 'Ft. Worth' },
      { id: 'el_paso', label: 'El Paso', short: 'El Paso' },
      { id: 'arlington', label: 'Arlington', short: 'Arlington' },
    ],
  },
  {
    id: 'florida', label: 'Florida', short: 'FL', emoji: '🌊',
    capital: { id: 'tallahassee', label: 'Tallahassee', short: 'Tally.', emoji: '⭐' },
    cities: [
      { id: 'miami', label: 'Miami', short: 'Miami' },
      { id: 'orlando', label: 'Orlando', short: 'Orlando' },
      { id: 'tampa', label: 'Tampa', short: 'Tampa' },
      { id: 'jacksonville', label: 'Jacksonville', short: 'Jax' },
      { id: 'st_pete', label: 'St. Petersburg', short: 'St. Pete' },
      { id: 'hialeah', label: 'Hialeah', short: 'Hialeah' },
    ],
  },
  {
    id: 'new_york', label: 'New York', short: 'NY', emoji: '🗽',
    capital: { id: 'albany', label: 'Albany', short: 'Albany', emoji: '⭐' },
    cities: [
      { id: 'new_york_city', label: 'New York City', short: 'NYC' },
      { id: 'buffalo', label: 'Buffalo', short: 'Buffalo' },
      { id: 'rochester', label: 'Rochester', short: 'Roch.' },
      { id: 'yonkers', label: 'Yonkers', short: 'Yonkers' },
      { id: 'syracuse', label: 'Syracuse', short: 'Syracuse' },
      { id: 'white_plains', label: 'White Plains', short: 'W. Plains' },
    ],
  },
  {
    id: 'illinois', label: 'Illinois', short: 'IL', emoji: '🌽',
    capital: { id: 'springfield', label: 'Springfield', short: 'Springfld', emoji: '⭐' },
    cities: [
      { id: 'chicago', label: 'Chicago', short: 'Chicago' },
      { id: 'aurora', label: 'Aurora', short: 'Aurora' },
      { id: 'joliet', label: 'Joliet', short: 'Joliet' },
      { id: 'rockford', label: 'Rockford', short: 'Rockford' },
      { id: 'naperville', label: 'Naperville', short: 'Naperville' },
      { id: 'peoria', label: 'Peoria', short: 'Peoria' },
    ],
  },
  {
    id: 'pennsylvania', label: 'Pennsylvania', short: 'PA', emoji: '🔔',
    capital: { id: 'harrisburg', label: 'Harrisburg', short: 'Harrisburg', emoji: '⭐' },
    cities: [
      { id: 'philadelphia', label: 'Philadelphia', short: 'Philly' },
      { id: 'pittsburgh', label: 'Pittsburgh', short: 'Pittsburgh' },
      { id: 'allentown', label: 'Allentown', short: 'Allentown' },
      { id: 'reading', label: 'Reading', short: 'Reading' },
      { id: 'scranton', label: 'Scranton', short: 'Scranton' },
      { id: 'erie', label: 'Erie', short: 'Erie' },
    ],
  },
  {
    id: 'ohio', label: 'Ohio', short: 'OH', emoji: '🌰',
    capital: { id: 'columbus', label: 'Columbus', short: 'Columbus', emoji: '⭐' },
    cities: [
      { id: 'cleveland', label: 'Cleveland', short: 'Cleveland' },
      { id: 'cincinnati', label: 'Cincinnati', short: 'Cincinnati' },
      { id: 'toledo', label: 'Toledo', short: 'Toledo' },
      { id: 'akron', label: 'Akron', short: 'Akron' },
      { id: 'dayton', label: 'Dayton', short: 'Dayton' },
      { id: 'youngstown', label: 'Youngstown', short: 'Youngstown' },
    ],
  },
  {
    id: 'georgia', label: 'Georgia', short: 'GA', emoji: '🍑',
    capital: { id: 'atlanta', label: 'Atlanta', short: 'Atlanta', emoji: '⭐' },
    cities: [
      { id: 'augusta', label: 'Augusta', short: 'Augusta' },
      { id: 'columbus_ga', label: 'Columbus', short: 'Columbus' },
      { id: 'savannah', label: 'Savannah', short: 'Savannah' },
      { id: 'athens', label: 'Athens', short: 'Athens' },
      { id: 'macon', label: 'Macon', short: 'Macon' },
      { id: 'roswell', label: 'Roswell', short: 'Roswell' },
    ],
  },
  {
    id: 'colorado', label: 'Colorado', short: 'CO', emoji: '⛰️',
    capital: { id: 'denver', label: 'Denver', short: 'Denver', emoji: '⭐' },
    cities: [
      { id: 'colorado_springs', label: 'Colorado Springs', short: 'Colo. Spgs' },
      { id: 'aurora_co', label: 'Aurora', short: 'Aurora' },
      { id: 'fort_collins', label: 'Fort Collins', short: 'Ft. Collins' },
      { id: 'lakewood', label: 'Lakewood', short: 'Lakewood' },
      { id: 'thornton', label: 'Thornton', short: 'Thornton' },
      { id: 'pueblo', label: 'Pueblo', short: 'Pueblo' },
    ],
  },
  {
    id: 'washington', label: 'Washington', short: 'WA', emoji: '🌲',
    capital: { id: 'olympia', label: 'Olympia', short: 'Olympia', emoji: '⭐' },
    cities: [
      { id: 'seattle', label: 'Seattle', short: 'Seattle' },
      { id: 'spokane', label: 'Spokane', short: 'Spokane' },
      { id: 'tacoma', label: 'Tacoma', short: 'Tacoma' },
      { id: 'bellevue', label: 'Bellevue', short: 'Bellevue' },
      { id: 'kent', label: 'Kent', short: 'Kent' },
      { id: 'renton', label: 'Renton', short: 'Renton' },
    ],
  },
];

// Build lookup maps
export const STATE_BY_ID = Object.fromEntries(STATES_DATA.map(s => [s.id, s]));

// ─── DECK BUILDER ─────────────────────────────────────────────────────────────
// 10 states × 6 cities × 1 copy = 60 city cards
// 10 state cards (starters, not in draw pile normally)
// 10 capital wildcards × 2 copies = 20 wildcard cards
// Total draw pile: 60 city + 20 capitals = 80 cards

export function initializeStatesDeck() {
  const deck = [];

  STATES_DATA.forEach(state => {
    // 1 copy of each city per state
    state.cities.forEach(city => {
      deck.push({
        type: 'city',
        stateId: state.id,
        id: city.id,
        label: city.label,
        short: city.short,
        isWild: false,
        isCapital: false,
        copy: 0,
      });
    });

    // 2 copies of each capital (wildcard)
    for (let copy = 0; copy < 2; copy++) {
      deck.push({
        type: 'capital',
        stateId: state.id,
        id: state.capital.id,
        label: state.capital.label,
        short: state.capital.short,
        emoji: state.capital.emoji,
        isWild: true,
        isCapital: true,
        copy,
      });
    }
  });

  return deck;
}

// State starter cards (one per state, used for row setup)
export function getStateStarterCards() {
  return STATES_DATA.map(state => ({
    type: 'state',
    stateId: state.id,
    id: state.id,
    label: state.label,
    short: state.short,
    emoji: state.emoji,
    isWild: false,
    isCapital: false,
    isStarter: true,
  }));
}

export function shuffleDeckStates(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// ─── PLAY RULES ───────────────────────────────────────────────────────────────
export function canPlayStatesCard(card, row) {
  if (row.cards.length === 0) return false; // rows must start with a state card via setup

  // Capital wildcards can play on any non-empty row (max 4 per row)
  if (card.isCapital) {
    return row.wildCount < 4;
  }

  // After a capital reset, any non-capital card is allowed
  if (row.resetPending) {
    return true;
  }

  // City cards must match the current state of the row
  if (card.type === 'city') {
    return card.stateId === row.currentStateId;
  }

  return false;
}