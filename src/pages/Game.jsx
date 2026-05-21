import React, { useState, useEffect } from 'react';
import SetupPhase from '../components/game/SetupPhase';
import GameplayPhase from '../components/game/GameplayPhase';
import EndGamePhase from '../components/game/EndGamePhase';
import { initializeDeck, shuffleDeck } from '../lib/deckUtils';

export default function Game() {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const deck = initializeDeck();
    shuffleDeck(deck);
    setGameState({
      phase: 'setup',
      deck,
      drawPile: [...deck],
      discardPile: [],
      currentCard: null,
      rows: [
        { cards: [], currentNumber: null, zeroCount: 0, resetPending: false },
        { cards: [], currentNumber: null, zeroCount: 0, resetPending: false },
        { cards: [], currentNumber: null, zeroCount: 0, resetPending: false },
        { cards: [], currentNumber: null, zeroCount: 0, resetPending: false },
      ],
      setupCards: [],
    });
  };

  const handleSetupComplete = (selectedIndices) => {
    setGameState(prev => {
      const setupCards = prev.drawPile.splice(0, 6);
      const startingCards = selectedIndices.map(i => setupCards[i]);
      const remainingSetupCards = setupCards.filter((_, i) => !selectedIndices.includes(i));
      
      // Shuffle remaining cards back into draw pile
      const newDrawPile = [...remainingSetupCards, ...prev.drawPile];
      shuffleDeck(newDrawPile);

      const newRows = prev.rows.map((row, idx) => ({
        ...row,
        cards: [startingCards[idx]],
        currentNumber: startingCards[idx].value,
      }));

      return {
        ...prev,
        phase: 'playing',
        drawPile: newDrawPile,
        rows: newRows,
        setupCards: [],
      };
    });
  };

  const handlePlayCard = (rowIndex, card) => {
    setGameState(prev => {
      const newRows = prev.rows.map(r => ({ ...r }));
      const row = newRows[rowIndex];

      row.cards.push(card);

      if (card.value === 0) {
        row.zeroCount += 1;
        row.resetPending = true;
      } else {
        row.currentNumber = card.value;
        row.resetPending = false;
      }

      const newDiscardPile = [...prev.discardPile];
      const newDrawPile = [...prev.drawPile];

      if (newDrawPile.length > 0) {
        return {
          ...prev,
          rows: newRows,
          currentCard: newDrawPile[0],
        };
      } else {
        return {
          ...prev,
          rows: newRows,
          phase: 'ended',
          currentCard: null,
        };
      }
    });
  };

  const handleDiscardCard = (card) => {
    setGameState(prev => {
      const newDiscardPile = [...prev.discardPile, card];
      const newDrawPile = prev.drawPile.slice(1);

      if (newDrawPile.length === 0) {
        return {
          ...prev,
          discardPile: newDiscardPile,
          drawPile: newDrawPile,
          currentCard: null,
          phase: 'ended',
        };
      }

      return {
        ...prev,
        discardPile: newDiscardPile,
        drawPile: newDrawPile,
        currentCard: newDrawPile[0],
      };
    });
  };

  if (!gameState) return null;

  if (gameState.phase === 'setup') {
    return <SetupPhase drawPile={gameState.drawPile} onComplete={handleSetupComplete} />;
  }

  if (gameState.phase === 'playing') {
    return (
      <GameplayPhase
        gameState={gameState}
        onPlayCard={handlePlayCard}
        onDiscardCard={handleDiscardCard}
      />
    );
  }

  if (gameState.phase === 'ended') {
    return <EndGamePhase rows={gameState.rows} onPlayAgain={resetGame} />;
  }
}