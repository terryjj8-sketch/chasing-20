export function initializeDeck(zeroCount = 10) {
  const deck = [];
  
  // Four sets of 1-20
  for (let set = 0; set < 4; set++) {
    for (let value = 1; value <= 20; value++) {
      deck.push({ value, suit: set });
    }
  }
  
  // Configurable number of zeros
  for (let i = 0; i < zeroCount; i++) {
    deck.push({ value: 0, suit: i % 2 });
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
    // Zeros can't start an empty row, but otherwise reset any row (max 3 per row)
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