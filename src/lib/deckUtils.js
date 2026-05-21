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
  if (row.resetPending) {
    // Any numbered card can be played to reset
    return card.value !== 0;
  }
  
  if (card.value === 0) {
    // Zeros can always be played (if under limit)
    return row.zeroCount < 3;
  }
  
  // Numbered cards: must be ±1 or same
  return Math.abs(card.value - row.currentNumber) <= 1;
}