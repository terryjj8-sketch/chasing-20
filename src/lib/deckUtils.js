export function initializeDeck() {
  const deck = [];
  
  // Four sets of 1-20
  for (let set = 0; set < 4; set++) {
    for (let value = 1; value <= 20; value++) {
      deck.push({ value, suit: set });
    }
  }
  
  // 10 zeros
  for (let i = 0; i < 10; i++) {
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
  // Zero cards cannot start an empty row or resolve a reset
  if (card.value === 0) {
    if (row.cards.length === 0) return false;  // can't start a row with zero
    if (row.resetPending) return false;          // can't play zero on a reset-pending row
    return row.zeroCount < 3;
  }

  if (row.resetPending) {
    // Any numbered card can resolve a reset
    return true;
  }

  // Empty row: any numbered card is valid
  if (row.cards.length === 0) return true;

  // Numbered cards: must be ±1 or same
  return Math.abs(card.value - row.currentNumber) <= 1;
}