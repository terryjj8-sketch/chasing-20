export function initializeDeck(zeroCount = 12) {
  const deck = [];
  
  // Four sets of 1-20
  // Suits 0 & 1 = dark factions, Suits 2 & 3 = red factions
  for (let set = 0; set < 4; set++) {
    for (let value = 1; value <= 20; value++) {
      deck.push({ value, suit: set });
    }
  }
  
  // Zeros: alternate between a dark suit (0) and a red suit (2)
  // so half are dark, half are red regardless of zeroCount
  for (let i = 0; i < zeroCount; i++) {
    deck.push({ value: 0, suit: i % 2 === 0 ? 0 : 2 });
  }
  
  return deck;
}

export function shuffleDeck(deck) {
  // Fisher-Yates shuffle (in place)
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

export function canPlayCard(card, row) {
  if (card.value === 0) {
    // Wilds can't start an empty row, but otherwise reset any row (max 3 per row)
    if (row.cards.length === 0) return false;
    return row.zeroCount < 3;
  }

  if (row.resetPending) {
    // Any numbered card resolves a reset
    return true;
  }

  // Numbered cards: must be ±1 of current top
  return Math.abs(card.value - row.currentNumber) <= 1;
}