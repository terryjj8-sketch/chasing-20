import React, { useState, useEffect, useRef } from 'react';
import SetupPhase from '../components/game/SetupPhase';
import GameplayPhase from '../components/game/GameplayPhase';
import EndGamePhase from '../components/game/EndGamePhase';
import { initializeDeck, shuffleDeck } from '../lib/deckUtils';
import { useSounds } from '../lib/useSounds';
import { Volume2, VolumeX } from 'lucide-react';

export default function Game() {
  const [gameState, setGameState] = useState(null);
  const [history, setHistory] = useState([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [completedRowAlert, setCompletedRowAlert] = useState(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const sounds = useSounds(soundEnabled);

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

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    if (isPaused && timerRef.current) {
      clearInterval(timerRef.current);
    } else if (!isPaused && gameState?.phase === 'playing') {
      if (!timerRef.current) {
        startTimeRef.current = Date.now() - elapsedSeconds * 1000;
        timerRef.current = setInterval(() => {
          setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 1000);
      }
    }
    return () => stopTimer();
  }, [isPaused, gameState?.phase]);

  const handleUndo = () => {
    if (history.length === 0) return;
    sounds.playUndo();
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setGameState(prev);
  };

  const resetGame = () => {
    stopTimer();
    setElapsedSeconds(0);
    setHistory([]);
    setCompletedRowAlert(null);
    const deck = initializeDeck();
    shuffleDeck(deck);
    sounds.playShuffle();
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

  const handleSetupComplete = (selectedIndices, chosenDifficulty) => {
    setDifficulty(chosenDifficulty);
    setGameState(prev => {
      const nonZeroSetupCards = prev.drawPile.filter(c => c.value !== 0).slice(0, 6);
      const startingCards = selectedIndices.map(i => nonZeroSetupCards[i]);

      // Rebuild deck fresh with difficulty-based zero count, excluding the 4 chosen cards
      const zeroCount = chosenDifficulty === 'hard' ? 4 : 10;
      const freshDeck = initializeDeck(zeroCount);
      shuffleDeck(freshDeck);

      // Remove the 4 chosen starting cards from the fresh deck
      const chosenKeys = new Set(startingCards.map(c => `${c.value}-${c.suit}`));
      const newDrawPile = [];
      const removed = new Set();
      for (const card of freshDeck) {
        const key = `${card.value}-${card.suit}`;
        if (chosenKeys.has(key) && !removed.has(key)) {
          removed.add(key);
        } else {
          newDrawPile.push(card);
        }
      }

      const newRows = prev.rows.map((row, idx) => ({
        ...row,
        cards: [startingCards[idx]],
        currentNumber: startingCards[idx].value,
      }));

      // Auto-flip the first card immediately
      const [firstCard, ...remainingDeck] = newDrawPile;

      return {
        ...prev,
        phase: 'playing',
        drawPile: remainingDeck,
        rows: newRows,
        flippedCard: firstCard,
        timerStarted: false,
      };
    });
  };

  // Manual flip (used for undo recovery or if needed)
  const handleFlipCard = () => {
    sounds.playCardFlip();
    setGameState(prev => {
      if (prev.drawPile.length === 0 || prev.flippedCard) return prev;
      setHistory(h => [...h, prev]);
      const [top, ...rest] = prev.drawPile;
      return { ...prev, flippedCard: top, drawPile: rest };
    });
  };

  const handlePlayCard = (rowIndex, card) => {
    sounds.playCardPlay();
    setGameState(prev => {
      setHistory(h => [...h, prev]);

      // Start timer on first play/discard
      if (!prev.timerStarted) startTimer();

      const newRows = prev.rows.map((r, i) => {
        if (i !== rowIndex) return r;
        const updatedCards = [...r.cards, card];
        if (card.value === 0) {
          return { ...r, cards: updatedCards, zeroCount: r.zeroCount + 1, resetPending: true };
        } else {
          return { ...r, cards: updatedCards, currentNumber: card.value, resetPending: false };
        }
      });

      // Detect a row just hitting 20 cards mid-game
      const prevRowCount = prev.rows[rowIndex].cards.length;
      const newRowCount = newRows[rowIndex].cards.length;
      const deckEmpty = prev.drawPile.length === 0;
      if (newRowCount === 20 && prevRowCount === 19 && !deckEmpty) {
        sounds.playRowComplete();
        setCompletedRowAlert(rowIndex);
      }

      if (deckEmpty) stopTimer();

      // Auto-flip next card
      const nextFlipped = (!deckEmpty && prev.drawPile.length > 0) ? prev.drawPile[0] : null;
      const newDrawPile = nextFlipped ? prev.drawPile.slice(1) : prev.drawPile;

      return {
        ...prev,
        rows: newRows,
        flippedCard: nextFlipped,
        drawPile: newDrawPile,
        timerStarted: true,
        phase: deckEmpty ? 'ended' : 'playing',
      };
    });
  };

  const handleDiscardCard = (card) => {
    sounds.playDiscard();
    setGameState(prev => {
      setHistory(h => [...h, prev]);

      // Start timer on first play/discard
      if (!prev.timerStarted) startTimer();

      const newDiscard = [...prev.discardPile, card];
      const deckEmpty = prev.drawPile.length === 0;
      if (deckEmpty) stopTimer();

      // Auto-flip next card
      const nextFlipped = (!deckEmpty && prev.drawPile.length > 0) ? prev.drawPile[0] : null;
      const newDrawPile = nextFlipped ? prev.drawPile.slice(1) : prev.drawPile;

      return {
        ...prev,
        discardPile: newDiscard,
        flippedCard: nextFlipped,
        drawPile: newDrawPile,
        timerStarted: true,
        phase: deckEmpty ? 'ended' : 'playing',
      };
    });
  };

  if (!gameState) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col">
      {/* Scroll Banner */}
      <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-b border-primary/30 px-4 py-3 backdrop-blur flex items-center justify-between">
        <div className="text-sm font-semibold tracking-widest text-primary flex-1 text-center">
          chasing 20 the most addictive game you'll ever play
        </div>
        <button
          onClick={() => setSoundEnabled(s => !s)}
          className="ml-3 p-1.5 rounded-lg transition-all"
          style={{ background: soundEnabled ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.08)' }}
          title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          {soundEnabled
            ? <Volume2 className="w-4 h-4 text-primary" />
            : <VolumeX className="w-4 h-4 text-foreground/40" />}
        </button>
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
            isPaused={isPaused}
            onTogglePause={togglePause}
            onRestart={resetGame}
            difficulty={difficulty}
            completedRowAlert={completedRowAlert}
            onClearRowAlert={() => setCompletedRowAlert(null)}
          />
        ) : (
          <GameEndContent rows={gameState.rows} onPlayAgain={resetGame} finalTime={elapsedSeconds} />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-primary/30 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 backdrop-blur px-4 py-3 text-center">
        <div className="text-xs text-foreground/50 tracking-wide">
          Copyright © 2026 Twssguy, llc. All rights reserved.
        </div>
      </div>
    </div>
  );
};

function GameSetupContent({ gameState, onSetupComplete }) {
  return (
    <SetupPhase drawPile={gameState.drawPile} onComplete={onSetupComplete} />
  );
}

function GamePlayContent({ gameState, onFlipCard, onPlayCard, onDiscardCard, onUndo, canUndo, elapsedSeconds, isPaused, onTogglePause, onRestart, difficulty, completedRowAlert, onClearRowAlert }) {
  return (
    <GameplayPhase
      gameState={gameState}
      onFlipCard={onFlipCard}
      onPlayCard={onPlayCard}
      onDiscardCard={onDiscardCard}
      onUndo={onUndo}
      canUndo={canUndo}
      elapsedSeconds={elapsedSeconds}
      isPaused={isPaused}
      onTogglePause={onTogglePause}
      onRestart={onRestart}
      difficulty={difficulty}
      completedRowAlert={completedRowAlert}
      onClearRowAlert={onClearRowAlert}
    />
  );
}

function GameEndContent({ rows, onPlayAgain, finalTime }) {
  return (
    <EndGamePhase rows={rows} onPlayAgain={onPlayAgain} finalTime={finalTime} />
  );
}