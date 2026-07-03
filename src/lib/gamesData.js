// ─── GAMES EDITION DATA ────────────────────────────────────────────────────
// 80 game cards, each with a set of tags.
// A card is playable on a row if it shares at least 1 tag with the top card.
// Crossover cards (10) are wildcards that reset the row.

export const GAMES = [
  // ── NYT / Word / Puzzle ──
  { id: 'wordle',        label: 'Wordle',          short: 'Wordle',    emoji: '🟩', tags: ['Word','Daily','NYT','Puzzle'] },
  { id: 'spelling_bee',  label: 'Spelling Bee',    short: 'Spell Bee', emoji: '🐝', tags: ['Word','Daily','NYT','Puzzle'] },
  { id: 'connections',   label: 'Connections',     short: 'Connect.',  emoji: '🔗', tags: ['Word','Daily','NYT','Category'] },
  { id: 'strands',       label: 'Strands',         short: 'Strands',   emoji: '🧵', tags: ['Word','Daily','NYT','Puzzle'] },
  { id: 'nyt_crossword', label: 'NYT Crossword',   short: 'Crossword', emoji: '📰', tags: ['Word','Daily','NYT','Puzzle'] },
  { id: 'mini_crossword',label: 'Mini Crossword',  short: 'Mini X',    emoji: '🔤', tags: ['Word','Daily','NYT','Puzzle'] },
  { id: 'letterboxed',   label: 'Letter Boxed',    short: 'Letter Boxd',emoji: '📦',tags: ['Word','Daily','NYT','Puzzle'] },
  { id: 'waffle',        label: 'Waffle',          short: 'Waffle',    emoji: '🧇', tags: ['Word','Daily','Puzzle'] },

  // ── Logic / Number ──
  { id: 'sudoku',        label: 'Sudoku',          short: 'Sudoku',    emoji: '🔢', tags: ['Number','Logic','Daily','Puzzle'] },
  { id: 'kenken',        label: 'KenKen',          short: 'KenKen',    emoji: '➕', tags: ['Number','Logic','Puzzle'] },
  { id: 'kakuro',        label: 'Kakuro',          short: 'Kakuro',    emoji: '🔣', tags: ['Number','Logic','Puzzle'] },
  { id: 'nonogram',      label: 'Nonogram',        short: 'Nonogram',  emoji: '🖼️', tags: ['Logic','Puzzle','Grid'] },
  { id: 'logic_grid',    label: 'Logic Grid',      short: 'Logic Grid',emoji: '🧩', tags: ['Logic','Puzzle','Grid'] },
  { id: 'minesweeper',   label: 'Minesweeper',     short: 'Mines.',    emoji: '💣', tags: ['Logic','Puzzle','Grid','Classic'] },

  // ── Block / Casual Mobile ──
  { id: 'candy_crush',   label: 'Candy Crush',     short: 'Candy Crush',emoji:'🍬', tags: ['Casual','Mobile','Match3','Social'] },
  { id: 'bejeweled',     label: 'Bejeweled',       short: 'Bejeweled', emoji: '💎', tags: ['Casual','Mobile','Match3','Classic'] },
  { id: 'royal_match',   label: 'Royal Match',     short: 'Royal Match',emoji:'👑', tags: ['Casual','Mobile','Match3'] },
  { id: 'toon_blast',    label: 'Toon Blast',      short: 'Toon Blast',emoji: '💥', tags: ['Casual','Mobile','Match3'] },
  { id: 'homescapes',    label: 'Homescapes',       short: 'Homescapes',emoji: '🏠', tags: ['Casual','Mobile','Puzzle'] },
  { id: 'block_blast',   label: 'Block Blast',     short: 'Block Blast',emoji:'🟥', tags: ['Casual','Mobile','Puzzle','Block'] },
  { id: 'tetris',        label: 'Tetris',           short: 'Tetris',    emoji: '🟦', tags: ['Puzzle','Classic','Block','Arcade'] },
  { id: 'ten10',         label: '1010!',            short: '1010!',     emoji: '🟧', tags: ['Casual','Mobile','Puzzle','Block'] },
  { id: 'woodoku',       label: 'Woodoku',          short: 'Woodoku',   emoji: '🌲', tags: ['Casual','Mobile','Puzzle','Block'] },

  // ── Battle Royale / Shooter ──
  { id: 'fortnite',      label: 'Fortnite',         short: 'Fortnite',  emoji: '🪂', tags: ['Battle','Multiplayer','Creative','Social'] },
  { id: 'pubg',          label: 'PUBG',             short: 'PUBG',      emoji: '🔫', tags: ['Battle','Multiplayer','Shooter'] },
  { id: 'warzone',       label: 'Warzone',          short: 'Warzone',   emoji: '🪖', tags: ['Battle','Multiplayer','Shooter'] },
  { id: 'apex',          label: 'Apex Legends',     short: 'Apex',      emoji: '🦅', tags: ['Battle','Multiplayer','Shooter'] },
  { id: 'free_fire',     label: 'Free Fire',        short: 'Free Fire', emoji: '🔥', tags: ['Battle','Mobile','Multiplayer','Shooter'] },
  { id: 'valorant',      label: 'Valorant',         short: 'Valorant',  emoji: '🎯', tags: ['Shooter','Multiplayer','Competitive'] },
  { id: 'overwatch',     label: 'Overwatch',        short: 'Overwatch', emoji: '⚡', tags: ['Shooter','Multiplayer','Competitive','Team'] },

  // ── Creative / Sandbox ──
  { id: 'minecraft',     label: 'Minecraft',        short: 'Minecraft', emoji: '⛏️', tags: ['Creative','Social','Multiplayer','Sandbox'] },
  { id: 'roblox',        label: 'Roblox',           short: 'Roblox',    emoji: '🟥', tags: ['Creative','Social','Multiplayer','Platform'] },
  { id: 'terraria',      label: 'Terraria',         short: 'Terraria',  emoji: '🌍', tags: ['Creative','Sandbox','Adventure'] },
  { id: 'stardew',       label: 'Stardew Valley',   short: 'Stardew',   emoji: '🌾', tags: ['Creative','Casual','Simulation','Cozy'] },
  { id: 'the_sims',      label: 'The Sims',         short: 'The Sims',  emoji: '🏡', tags: ['Creative','Simulation','Social','Casual'] },
  { id: 'dreams',        label: 'Dreams',           short: 'Dreams',    emoji: '🎨', tags: ['Creative','Platform','Social'] },
  { id: 'rec_room',      label: 'Rec Room',         short: 'Rec Room',  emoji: '🥽', tags: ['Creative','Social','Multiplayer','VR'] },
  { id: 'lego_fortnite', label: 'Lego Fortnite',    short: 'Lego Fort.', emoji: '🧱', tags: ['Creative','Social','Multiplayer','Battle'] },

  // ── Strategy / Board ──
  { id: 'chess',         label: 'Chess',            short: 'Chess',     emoji: '♟️', tags: ['Strategy','Classic','Board','Competitive'] },
  { id: 'checkers',      label: 'Checkers',         short: 'Checkers',  emoji: '🔴', tags: ['Strategy','Classic','Board'] },
  { id: 'go_game',       label: 'Go',               short: 'Go',        emoji: '⚫', tags: ['Strategy','Classic','Board','Competitive'] },
  { id: 'shogi',         label: 'Shogi',            short: 'Shogi',     emoji: '🎌', tags: ['Strategy','Classic','Board'] },
  { id: 'stratego',      label: 'Stratego',         short: 'Stratego',  emoji: '🎖️', tags: ['Strategy','Board','Classic'] },
  { id: 'risk',          label: 'Risk',             short: 'Risk',      emoji: '🌐', tags: ['Strategy','Board','Classic','Multiplayer'] },
  { id: 'catan',         label: 'Catan',            short: 'Catan',     emoji: '🏝️', tags: ['Strategy','Board','Multiplayer','Social'] },
  { id: 'codenames',     label: 'Codenames',        short: 'Codenames', emoji: '🕵️', tags: ['Word','Board','Social','Team'] },
  { id: 'pandemic',      label: 'Pandemic',         short: 'Pandemic',  emoji: '🦠', tags: ['Strategy','Board','Team','Cooperative'] },

  // ── Solitaire / Card Games ──
  { id: 'solitaire',     label: 'Solitaire',        short: 'Solitaire', emoji: '🃏', tags: ['Card','Classic','Casual','Solo'] },
  { id: 'spider_sol',    label: 'Spider Solitaire', short: 'Spider',    emoji: '🕷️', tags: ['Card','Classic','Casual','Solo'] },
  { id: 'freecell',      label: 'FreeCell',         short: 'FreeCell',  emoji: '🆓', tags: ['Card','Classic','Casual','Solo'] },
  { id: 'pyramid_sol',   label: 'Pyramid',          short: 'Pyramid',   emoji: '🔺', tags: ['Card','Classic','Casual','Solo'] },
  { id: 'tripeaks',      label: 'TriPeaks',         short: 'TriPeaks',  emoji: '🏔️', tags: ['Card','Classic','Casual','Solo'] },
  { id: 'uno',           label: 'Uno',              short: 'Uno',       emoji: '🔴', tags: ['Card','Classic','Casual','Multiplayer','Social'] },
  { id: 'hearthstone',   label: 'Hearthstone',      short: 'Heartstone',emoji: '❤️‍🔥', tags: ['Card','Strategy','Digital','Multiplayer'] },
  { id: 'pokemon_tcg',   label: 'Pokémon TCG',      short: 'Pokémon TCG',emoji:'🃏', tags: ['Card','Strategy','Competitive','Multiplayer'] },

  // ── Social / Party ──
  { id: 'among_us',      label: 'Among Us',         short: 'Among Us',  emoji: '🔴', tags: ['Social','Multiplayer','Party','Mobile'] },
  { id: 'jackbox',       label: 'Jackbox',          short: 'Jackbox',   emoji: '🎙️', tags: ['Social','Party','Multiplayer','Word'] },
  { id: 'gartic_phone',  label: 'Gartic Phone',     short: 'Gartic Ph.',emoji: '📞', tags: ['Social','Party','Multiplayer','Creative'] },
  { id: 'skribbl',       label: 'Skribbl.io',       short: 'Skribbl',   emoji: '✏️', tags: ['Social','Party','Multiplayer','Word'] },
  { id: 'geoguessr',     label: 'GeoGuessr',        short: 'GeoGuessr', emoji: '🌍', tags: ['Daily','Geography','Puzzle','Social'] },

  // ── Arcade / Retro ──
  { id: 'pac_man',       label: 'Pac-Man',          short: 'Pac-Man',   emoji: '🟡', tags: ['Arcade','Classic','Retro'] },
  { id: 'space_invaders',label: 'Space Invaders',   short: 'Space Inv.',emoji: '👾', tags: ['Arcade','Classic','Retro','Shooter'] },
  { id: 'donkey_kong',   label: 'Donkey Kong',      short: 'DK',        emoji: '🦍', tags: ['Arcade','Classic','Retro','Platform'] },
  { id: 'super_mario',   label: 'Super Mario',      short: 'Mario',     emoji: '🍄', tags: ['Arcade','Classic','Platform','Adventure'] },
  { id: 'sonic',         label: 'Sonic',            short: 'Sonic',     emoji: '💨', tags: ['Arcade','Classic','Platform','Adventure'] },
  { id: 'zelda',         label: 'Zelda',            short: 'Zelda',     emoji: '🗡️', tags: ['Adventure','Classic','RPG','Puzzle'] },

  // ── RPG / Adventure ──
  { id: 'pokemon_game',  label: 'Pokémon',          short: 'Pokémon',   emoji: '⚡', tags: ['RPG','Adventure','Classic','Multiplayer'] },
  { id: 'skyrim',        label: 'Skyrim',           short: 'Skyrim',    emoji: '🐉', tags: ['RPG','Adventure','Sandbox'] },
  { id: 'genshin',       label: 'Genshin Impact',   short: 'Genshin',   emoji: '🌸', tags: ['RPG','Adventure','Mobile','Social'] },
  { id: 'diablo',        label: 'Diablo',           short: 'Diablo',    emoji: '😈', tags: ['RPG','Action','Multiplayer'] },
  { id: 'animal_crossing',label:'Animal Crossing',  short: 'Animal X',  emoji: '🏝️', tags: ['Simulation','Cozy','Social','Casual'] },
  { id: 'hollow_knight', label: 'Hollow Knight',    short: 'Hollow Knt',emoji: '🪲', tags: ['Adventure','Puzzle','Classic','Solo'] },

  // ── Sports / Racing ──
  { id: 'fifa',          label: 'FIFA / FC',        short: 'FIFA',      emoji: '⚽', tags: ['Sports','Multiplayer','Competitive','Social'] },
  { id: 'nba2k',         label: 'NBA 2K',           short: 'NBA 2K',    emoji: '🏀', tags: ['Sports','Multiplayer','Competitive','Social'] },
  { id: 'mario_kart',    label: 'Mario Kart',       short: 'Mario Kart',emoji: '🏎️', tags: ['Racing','Classic','Multiplayer','Party'] },
  { id: 'rocket_league', label: 'Rocket League',    short: 'Rocket Lg.',emoji: '🚀', tags: ['Sports','Racing','Multiplayer','Competitive'] },

  // ── Simulation / Idle ──
  { id: 'cookie_clicker',label: 'Cookie Clicker',  short: 'Cookie Clk',emoji: '🍪', tags: ['Casual','Idle','Simulation'] },
  { id: 'sim_city',      label: 'SimCity',          short: 'SimCity',   emoji: '🌆', tags: ['Simulation','Strategy','Creative'] },
  { id: 'age_of_empires',label:'Age of Empires',    short: 'AoE',       emoji: '🏰', tags: ['Strategy','Classic','Multiplayer','RTS'] },
  { id: 'clash_of_clans',label:'Clash of Clans',    short: 'Clash',     emoji: '⚔️', tags: ['Strategy','Mobile','Multiplayer','Social'] },
]; // 80 game cards total

// 10 Crossover wildcards
export const CROSSOVER_CARDS = [
  { id: 'crossover_1',  label: 'Crossover',  short: 'Crossover', emoji: '🌀', isWild: true },
  { id: 'crossover_2',  label: 'Crossover',  short: 'Crossover', emoji: '🌀', isWild: true },
  { id: 'crossover_3',  label: 'Crossover',  short: 'Crossover', emoji: '🌀', isWild: true },
  { id: 'crossover_4',  label: 'Crossover',  short: 'Crossover', emoji: '🌀', isWild: true },
  { id: 'crossover_5',  label: 'Crossover',  short: 'Crossover', emoji: '🌀', isWild: true },
  { id: 'crossover_6',  label: 'Crossover',  short: 'Crossover', emoji: '🌀', isWild: true },
  { id: 'crossover_7',  label: 'Crossover',  short: 'Crossover', emoji: '🌀', isWild: true },
  { id: 'crossover_8',  label: 'Crossover',  short: 'Crossover', emoji: '🌀', isWild: true },
  { id: 'crossover_9',  label: 'Crossover',  short: 'Crossover', emoji: '🌀', isWild: true },
  { id: 'crossover_10', label: 'Crossover',  short: 'Crossover', emoji: '🌀', isWild: true },
];

// GAME_BY_ID lookup
export const GAME_BY_ID = Object.fromEntries(GAMES.map(g => [g.id, g]));

// ─── DECK BUILDER ─────────────────────────────────────────────────────────────
// 80 unique game cards × 1 copy = 80
// 10 Crossover wildcards
// Total = 90 cards
export function initializeGamesDeck() {
  const deck = [];
  GAMES.forEach(game => {
    deck.push({
      type: 'game',
      id: game.id,
      label: game.label,
      short: game.short,
      emoji: game.emoji,
      tags: game.tags,
      isWild: false,
    });
  });
  CROSSOVER_CARDS.forEach(c => {
    deck.push({ ...c, type: 'crossover' });
  });
  return deck;
}

export function shuffleDeckGames(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Starter cards for setup: 6 random non-wild games
export function getGameStarterCards() {
  const shuffled = [...GAMES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6).map(g => ({
    type: 'game',
    id: g.id,
    label: g.label,
    short: g.short,
    emoji: g.emoji,
    tags: g.tags,
    isWild: false,
    isStarter: true,
  }));
}

// ─── PLAY RULES ───────────────────────────────────────────────────────────────
export function canPlayGamesCard(card, row) {
  if (row.cards.length === 0) return false; // rows start via setup

  // Crossover: wildcard, resets row
  if (card.isWild) {
    return row.wildCount < 4;
  }

  // After a crossover reset, any non-wild card is valid
  if (row.resetPending) {
    return true;
  }

  // Must share at least 1 tag with the current top card's tags
  const topTags = row.currentTags || [];
  return card.tags.some(t => topTags.includes(t));
}