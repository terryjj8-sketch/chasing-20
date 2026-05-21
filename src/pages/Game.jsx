import React, { useState, useEffect, useRef } from 'react';
import SetupPhase from '../components/game/SetupPhase';
import GameplayPhase from '../components/game/GameplayPhase';
import EndGamePhase from '../components/game/EndGamePhase';
import { initializeDeck, shuffleDeck } from '../lib/deckUtils';

export default function Game() {
  const [gameState, setGameState] = useState(null);
  const [history, setHistory] = useState([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    resetGame();
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setElapsedSeconds(0);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    return () => stopTimer();
  }, []);

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setGameState(prev);
  };

  const resetGame = () => {
    stopTimer();
    setElapsedSeconds(0);
    setHistory([]);
    const deck = initializeDeck();
    shuffleDeck(deck);
    setGameState({
      phase: 'setup',
      drawPile: [...deck],
      discardPile: [],
      flippedCard: null,
      rows: [
        { cards: [], currentNumber: null, zeroCount: 0, resetPending: false },
        { cards: [], currentNumber: null, zeroCount: 0, resetPending: false },
        { cards: [], currentNumber: null, zeroCount: 0, resetPending: false },
        { cards: [], currentNumber: null, zeroCount: 0, resetPending: false },
      ],
    });
  };

  const handleSetupComplete = (selectedIndices) => {
    startTimer();
    setGameState(prev => {
      const setupCards = prev.drawPile.slice(0, 6);
      const startingCards = selectedIndices.map(i => setupCards[i]);
      const remainingSetupCards = setupCards.filter((_, i) => !selectedIndices.includes(i));

      // Put the 2 unchosen cards back and shuffle
      const newDrawPile = [...remainingSetupCards, ...prev.drawPile.slice(6)];
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
        flippedCard: null,
      };
    });
  };

  // Player taps the deck to flip the top card
  const handleFlipCard = () => {
    setGameState(prev => {
      if (prev.drawPile.length === 0 || prev.flippedCard) return prev;
      setHistory(h => [...h, prev]);
      const [top, ...rest] = prev.drawPile;
      return { ...prev, flippedCard: top, drawPile: rest };
    });
  };

  const handlePlayCard = (rowIndex, card) => {
    setGameState(prev => {
      setHistory(h => [...h, prev]);
      const newRows = prev.rows.map((r, i) => {
        if (i !== rowIndex) return r;
        const updatedCards = [...r.cards, card];
        if (card.value === 0) {
          return { ...r, cards: updatedCards, zeroCount: r.zeroCount + 1, resetPending: true };
        } else {
          return { ...r, cards: updatedCards, currentNumber: card.value, resetPending: false };
        }
      });

      const deckEmpty = prev.drawPile.length === 0;
      if (deckEmpty) stopTimer();
      return {
        ...prev,
        rows: newRows,
        flippedCard: null,
        phase: deckEmpty ? 'ended' : 'playing',
      };
    });
  };

  const handleDiscardCard = (card) => {
    setGameState(prev => {
      setHistory(h => [...h, prev]);
      const newDiscard = [...prev.discardPile, card];
      const deckEmpty = prev.drawPile.length === 0;
      if (deckEmpty) stopTimer();
      return {
        ...prev,
        discardPile: newDiscard,
        flippedCard: null,
        phase: deckEmpty ? 'ended' : 'playing',
      };
    });
  };

  if (!gameState) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col">
      {/* Scroll Banner */}
      <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-b border-primary/30 px-4 py-3 text-center backdrop-blur">
        <div className="text-sm font-semibold tracking-widest text-primary">
          Chasing 20 — The Most Difficult Card Game You'll Ever Play
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1">
        {gameState.phase === 'setup' ? (
          <GameSetupContent gameState={gameState} onSetupComplete={handleSetupComplete} />
        ) : gameState.phase === 'playing' ? (
          <GamePlayContent 
            gameState={gameState}
            onFlipCard={handleFlipCard}
            onPlayCard={handlePlayCard}
            onDiscardCard={handleDiscardCard}
            onUndo={handleUndo}
            canUndo={history.length > 0}
            elapsedSeconds={elapsedSeconds}
          />
        ) : (
          <GameEndContent rows={gameState.rows} onPlayAgain={resetGame} finalTime={elapsedSeconds} />
        )}
      </div>
    </div>
  );
};

function GameSetupContent({ gameState, onSetupComplete }) {
  return (
    <SetupPhase drawPile={gameState.drawPile} onComplete={onSetupComplete} />
  );
}

function GamePlayContent({ gameState, onFlipCard, onPlayCard, onDiscardCard, onUndo, canUndo, elapsedSeconds }) {
  return (
    <GameplayPhase
      gameState={gameState}
      onFlipCard={onFlipCard}
      onPlayCard={onPlayCard}
      onDiscardCard={onDiscardCard}
      onUndo={onUndo}
      canUndo={canUndo}
      elapsedSeconds={elapsedSeconds}
    />
  );
}

function GameEndContent({ rows, onPlayAgain, finalTime }) {
  return (
    <EndGamePhase rows={rows} onPlayAgain={onPlayAgain} finalTime={finalTime} />
  );
}