import React, { useState, useEffect, useRef } from 'react';
import SetupPhase from '../components/game/SetupPhase';
import GameplayPhase from '../components/game/GameplayPhase';
import EndGamePhase from '../components/game/EndGamePhase';
import SessionDashboard from '../components/game/SessionDashboard';
import { initializeDeck, shuffleDeck, canPlayCard } from '../lib/deckUtils';
import { initializeStatesDeck, shuffleDeckStates, canPlayStatesCard } from '../lib/statesData';
import { initializeGamesDeck, shuffleDeckGames, canPlayGamesCard } from '../lib/gamesData';
import { initializeCalendarDeck, shuffleDeckCalendar, canPlayCalendarCard, getDayOrder, getMonthOrder } from '../lib/calendarData';
import { useSounds } from '../lib/useSounds';
import { ThemeProvider } from '../lib/ThemeContext';
import ThemeSelector from '../components/game/ThemeSelector';
import ThemeGuideArrow from '../components/game/ThemeGuideArrow';
import { Volume2, VolumeX } from 'lucide-react';

// Win condition: clear this many rows (any combination) before the deck runs out
const CLEAR_GOAL = 3;


export default function Game() {
  const [gameState, setGameState] = useState(null);
  const [history, setHistory] = useState([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [soundEnabled, setSoundEnabled] = useState(true);
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
      gameMode: null,
      drawPile: [...deck],
      discardPile: [],
      flippedCard: null,
      clearedRows: 0,
      rows: [
        { cards: [], currentNumber: null, zeroCount: 0, resetPending: false },
        { cards: [], currentNumber: null, zeroCount: 0, resetPending: false },
        { cards: [], currentNumber: null, zeroCount: 0, resetPending: false },
        { cards: [], currentNumber: null, zeroCount: 0, resetPending: false },
      ],
    });
  };

  const handleSetupComplete = (selectedIndices, chosenDifficulty, chosenMode, setupDisplayCards) => {
    setDifficulty(chosenDifficulty);
    const mode = chosenMode || 'numbers';

    setGameState(prev => {
      if (mode === 'states') {
        const startingCards = selectedIndices.map(i => setupDisplayCards[i]);
        const freshDeck = initializeStatesDeck();
        shuffleDeckStates(freshDeck);

        const newRows = prev.rows.map((row, idx) => ({
          cards: [startingCards[idx]],
          currentStateId: startingCards[idx].stateId,
          wildCount: 0,
          resetPending: false,
        }));

        const [firstCard, ...remainingDeck] = freshDeck;
        return {
          ...prev,
          phase: 'playing',
          gameMode: 'states',
          drawPile: remainingDeck,
          rows: newRows,
          flippedCard: firstCard,
          timerStarted: false,
        };
      }

      if (mode === 'games') {
        const startingCards = selectedIndices.map(i => setupDisplayCards[i]);
        const freshDeck = initializeGamesDeck();
        shuffleDeckGames(freshDeck);

        const newRows = prev.rows.map((row, idx) => ({
          cards: [startingCards[idx]],
          currentTags: startingCards[idx].tags,
          wildCount: 0,
          resetPending: false,
        }));

        const [firstCard, ...remainingDeck] = freshDeck;
        return {
          ...prev,
          phase: 'playing',
          gameMode: 'games',
          drawPile: remainingDeck,
          rows: newRows,
          flippedCard: firstCard,
          timerStarted: false,
        };
      }

      if (mode === 'calendar') {
        const startingCards = selectedIndices.map(i => setupDisplayCards[i]);
        const freshDeck = initializeCalendarDeck();
        shuffleDeckCalendar(freshDeck);

        const newRows = prev.rows.map((row, idx) => ({
          cards: [startingCards[idx]],
          currentMonthOrder: startingCards[idx].type === 'month' ? getMonthOrder(startingCards[idx]) : null,
          currentDayOrder: startingCards[idx].type === 'day' ? getDayOrder(startingCards[idx]) : null,
          wildCount: 0,
          resetPending: false,
        }));

        const [firstCard, ...remainingDeck] = freshDeck;
        return {
          ...prev,
          phase: 'playing',
          gameMode: 'calendar',
          drawPile: remainingDeck,
          rows: newRows,
          flippedCard: firstCard,
          timerStarted: false,
        };
      }

      // Default: calendar/number mode (original behavior)
      const nonZeroSetupCards = prev.drawPile.filter(c => c.value !== 0).slice(0, 6);
      const startingCards = selectedIndices.map(i => nonZeroSetupCards[i]);

      // Classic redesign: no zeros/wildcards - pure 80-card number deck.
      // (Difficulty no longer maps to zero count; future idea: reshuffle limits.)
      const freshDeck = initializeDeck(0);
      shuffleDeck(freshDeck);

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

      const [firstCard, ...remainingDeck] = newDrawPile;

      return {
        ...prev,
        phase: 'playing',
        gameMode: 'numbers',
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
    const isWildCard = card.isWild || card.isCapital || card.value === 0;
    if (isWildCard) sounds.playWild();
    else sounds.playCardPlay();
    setGameState(prev => {
      setHistory(h => [...h, prev]);

      // Start timer on first play/discard
      if (!prev.timerStarted) startTimer();

      const mode = prev.gameMode || 'numbers';

      const newRows = prev.rows.map((r, i) => {
        if (i !== rowIndex) return r;
        const updatedCards = [...r.cards, card];

        if (mode === 'states') {
          if (card.isCapital) {
            return { ...r, cards: updatedCards, wildCount: r.wildCount + 1, resetPending: true };
          }
          return { ...r, cards: updatedCards, currentStateId: card.stateId, resetPending: false };
        }

        if (mode === 'games') {
          if (card.isWild) {
            return { ...r, cards: updatedCards, wildCount: r.wildCount + 1, resetPending: true };
          }
          return { ...r, cards: updatedCards, currentTags: card.tags, resetPending: false };
        }

        if (mode === 'calendar') {
          if (card.isHoliday) {
            return { ...r, cards: updatedCards, wildCount: r.wildCount + 1, resetPending: true };
          }
          return {
            ...r,
            cards: updatedCards,
            currentMonthOrder: card.type === 'month' ? getMonthOrder(card) : r.currentMonthOrder,
            currentDayOrder: card.type === 'day' ? getDayOrder(card) : r.currentDayOrder,
            resetPending: false,
          };
        }

        // calendar/number mode
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

      // --- ROW CLEAR LOGIC ---
      // When a row hits 20, it clears (pops back to a single fresh card)
      // and the player's cleared-row counter ticks up. Reseed happens
      // instantly from the draw pile so pace never slows down.
      let finalRows = newRows;
      let workingDrawPile = prev.drawPile;
      let clearedRows = prev.clearedRows || 0;

      if (mode !== 'numbers' && newRowCount === 20 && prevRowCount === 19 && !deckEmpty) {
        sounds.playRowComplete();
        setCompletedRowAlert(rowIndex);
        clearedRows += 1;

        // Find the first non-zero card in the draw pile to reseed with.
        // (Wild/zero cards can't start an empty row per canPlayCard, so
        // we never reseed with one.)
        const reseedIdx = workingDrawPile.findIndex(c => c.value !== 0);
        if (reseedIdx !== -1) {
          const reseedCard = workingDrawPile[reseedIdx];
          workingDrawPile = [
            ...workingDrawPile.slice(0, reseedIdx),
            ...workingDrawPile.slice(reseedIdx + 1),
          ];
          finalRows = newRows.map((r, i) =>
            i === rowIndex
              ? { cards: [reseedCard], currentNumber: reseedCard.value, zeroCount: 0, resetPending: false }
              : r
          );
        }
        // If no non-zero card remains in the draw pile, the row simply
        // stays at its cleared 20-card state for this turn — the deck is
        // nearly exhausted at that point anyway and the game is about to end.
      }
      // --- END ROW CLEAR LOGIC ---

      // CLASSIC: reshuffle discards into the deck when the draw pile empties
      let workingDiscardPile = prev.discardPile;
      if (mode === 'numbers' && workingDrawPile.length === 0 && workingDiscardPile.length > 0) {
        workingDrawPile = [...workingDiscardPile];
        shuffleDeck(workingDrawPile);
        workingDiscardPile = [];
        sounds.playShuffle();
      }
      const stillDeckEmpty = workingDrawPile.length === 0;
      const goalReached = mode === 'numbers'
        ? finalRows.filter(r => r.cards.length >= 20).length >= 2
        : clearedRows >= CLEAR_GOAL;
      if (stillDeckEmpty || goalReached) stopTimer();

      // Auto-flip next card (drawn from whatever's left after any reseed pull)
      // Skip flipping a new card entirely if the win goal was just reached —
      // the game is over, no need to draw further.
      const nextFlipped = (!stillDeckEmpty && !goalReached) ? workingDrawPile[0] : null;
      const finalDrawPile = nextFlipped ? workingDrawPile.slice(1) : workingDrawPile;

      return {
        ...prev,
        rows: finalRows,
        flippedCard: nextFlipped,
        drawPile: finalDrawPile,
        discardPile: workingDiscardPile,
        consecutiveDiscards: 0,
        clearedRows,
        timerStarted: true,
        phase: (stillDeckEmpty || goalReached) ? 'ended' : 'playing',
      };
    });
  };

  const handleDiscardCard = (card) => {
    sounds.playDiscard();
    setGameState(prev => {
      setHistory(h => [...h, prev]);

      // Start timer on first play/discard
      if (!prev.timerStarted) startTimer();

      const mode = prev.gameMode || 'numbers';
      let workingDiscard = [...prev.discardPile, card];
      let workingDraw = [...prev.drawPile];
      const consecutive = (prev.consecutiveDiscards || 0) + 1;

      // CLASSIC: when the draw pile empties, shuffle the discards into a new deck
      if (mode === 'numbers' && workingDraw.length === 0 && workingDiscard.length > 0) {
        workingDraw = [...workingDiscard];
        shuffleDeck(workingDraw);
        workingDiscard = [];
        sounds.playShuffle();
      }

      // If the player has cycled every remaining card without playing one,
      // nothing is playable - the game ends. A real solitaire loss.
      const poolSize = workingDraw.length + workingDiscard.length;
      const stuck = mode === 'numbers' && consecutive >= poolSize && poolSize > 0;
      const deckEmpty = workingDraw.length === 0 || stuck;
      if (deckEmpty) stopTimer();

      const nextFlipped = !deckEmpty ? workingDraw[0] : null;
      const newDrawPile = nextFlipped ? workingDraw.slice(1) : workingDraw;

      return {
        ...prev,
        discardPile: workingDiscard,
        flippedCard: nextFlipped,
        drawPile: newDrawPile,
        consecutiveDiscards: consecutive,
        timerStarted: true,
        phase: deckEmpty ? 'ended' : 'playing',
      };
    });
  };

  if (!gameState) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-background to-background/80">
        <img 
          src="https://base44.com/logo_v2.svg" 
          alt="Loading..." 
          className="w-32 h-32 animate-pulse"
        />
      </div>
    );
  }

  return (
    <ThemeProvider>
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col">
      {/* Scroll Banner */}
      <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-b border-primary/30 px-4 py-3 backdrop-blur flex items-center justify-center gap-6">
        <ThemeGuideArrow />
        <div className="flex items-center gap-2">
          <ThemeSelector />
          <button
            onClick={() => setSoundEnabled(s => !s)}
            className="p-1.5 rounded-lg transition-all"
            style={{ background: soundEnabled ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.08)' }}
            title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          >
            {soundEnabled
              ? <Volume2 className="w-4 h-4 text-primary" />
              : <VolumeX className="w-4 h-4 text-foreground/40" />}
          </button>
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
            isPaused={isPaused}
            onTogglePause={togglePause}
            onRestart={resetGame}
            difficulty={difficulty}
            completedRowAlert={completedRowAlert}
            onClearRowAlert={() => setCompletedRowAlert(null)}
          />
        ) : (
          <GameEndContent
            rows={gameState.rows}
            onPlayAgain={resetGame}
            finalTime={elapsedSeconds}
            difficulty={difficulty}
            clearedRows={gameState.clearedRows || 0}
            totalCards={(gameState.drawPile?.length || 0) + (gameState.discardPile?.length || 0) + gameState.rows.reduce((s, r) => s + r.cards.length, 0)}
          />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-primary/30 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 backdrop-blur px-4 py-3 text-center">
        <div className="text-xs text-foreground/50 tracking-wide">
          Copyright © 2026 Twssguy, llc. All rights reserved.
        </div>
      </div>
    </div>
    </ThemeProvider>
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

function GameEndContent({ rows, onPlayAgain, finalTime, difficulty, totalCards, clearedRows }) {
  return (
    <SessionDashboard
      rows={rows}
      onPlayAgain={onPlayAgain}
      finalTime={finalTime}
      difficulty={difficulty}
      totalCards={totalCards}
      clearedRows={clearedRows}
    />
  );
}
/* NOTE for Terry: SessionDashboard.jsx needs a `clearedRows` prop added to
   actually display this number — I haven't seen that file yet, so I'm
   passing the prop here but the display piece still needs wiring in. */
