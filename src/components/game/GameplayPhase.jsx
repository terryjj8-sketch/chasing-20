import React, { useState, useEffect } from 'react';
import SolitaireRow from './SolitaireRow';
import SolitaireDeck from './SolitaireDeck';
import GameTimer from './GameTimer';
import RowCompleteToast from './RowCompleteToast';
import { canPlayCard } from '@/lib/deckUtils';
import { Button } from '@/components/ui/button';
import { Undo2, Pause, Play, RotateCcw } from 'lucide-react';

const rowAccents = ['row-1', 'row-2', 'row-3', 'row-4'];

export default function GameplayPhase({ gameState, onPlayCard, onDiscardCard, onFlipCard, onUndo, canUndo, elapsedSeconds, isPaused, onTogglePause, onRestart, difficulty, completedRowAlert, onClearRowAlert }) {
  const { drawPile, discardPile, rows, flippedCard } = gameState;
  const showDeckCount = difficulty === 'easy';
  const [selectedRow, setSelectedRow] = useState(null);

  const [hintPulse, setHintPulse] = useState(false);

  const flippedCardKey = flippedCard ? `${flippedCard.value}-${flippedCard.suit}` : null;
  useEffect(() => {
    setSelectedRow(null);
    setHintPulse(false);
  }, [flippedCardKey]);

  // In easy mode, pulse valid rows 2s after a card is flipped
  useEffect(() => {
    if (difficulty !== 'easy' || !flippedCard || validRows.length === 0) return;
    const timer = setTimeout(() => {
      setHintPulse(true);
      setTimeout(() => setHintPulse(false), 1200);
    }, 2000);
    return () => clearTimeout(timer);
  }, [flippedCardKey, difficulty]);

  const validRows = flippedCard
    ? rows.map((row, idx) => canPlayCard(flippedCard, row) ? idx : null).filter(idx => idx !== null)
    : [];

  const handleRowTap = (idx) => {
    if (!flippedCard) return;
    if (!validRows.includes(idx)) return;
    if (selectedRow === idx) {
      onPlayCard(idx, flippedCard);
    } else {
      setSelectedRow(idx);
    }
  };

  const handlePlay = () => {
    if (flippedCard && selectedRow !== null) {
      onPlayCard(selectedRow, flippedCard);
    }
  };

  const handleDiscard = () => {
    if (flippedCard) {
      onDiscardCard(flippedCard);
    }
  };

  return (
    <div
      className="flex flex-col"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #1a4a2e 0%, #0f2d1a 60%, #081a0e 100%)',
        height: '100dvh',
        maxHeight: '100dvh',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <RowCompleteToast completedRow={completedRowAlert} onDone={onClearRowAlert} />
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <GameTimer elapsedSeconds={elapsedSeconds} />
          <div className="bg-black/30 px-2.5 py-1 rounded-lg text-xs border border-white/10">
            <span className="text-foreground/50">Disc.</span>
            <span className="text-foreground font-bold ml-1">{discardPile.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="bg-black/30 hover:bg-black/50 text-foreground disabled:opacity-30 px-2 border border-white/10 h-7"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRestart}
            className="bg-black/30 hover:bg-black/50 text-foreground px-2 border border-white/10 h-7"
            title="Restart"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePause}
            className="bg-black/30 hover:bg-black/50 text-foreground px-2 border border-white/10 h-7"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>

      {/* Main table area — fills remaining height */}
      <div className="flex-1 flex flex-col md:flex-row px-2 sm:px-3 gap-2 md:gap-4 pb-2 md:pb-4 min-h-0 items-stretch md:items-start">

        {/* Deck / waste area */}
        <div className="flex-shrink-0 flex justify-center items-center md:items-start">
          <SolitaireDeck
            deckCount={drawPile.length}
            flippedCard={flippedCard}
            onFlip={onFlipCard}
            onDiscard={handleDiscard}
            onCardTap={selectedRow !== null ? handlePlay : undefined}
            isPlayable={selectedRow !== null}
            showDeckCount={showDeckCount}
          />
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px self-stretch bg-white/10" />
        <div className="block md:hidden h-px w-full bg-white/10 flex-shrink-0" />

        {/* Row columns — scrollable vertically on mobile so stats are reachable */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="flex gap-2 sm:gap-3 justify-center min-w-0 pb-2">
            {rows.map((row, idx) => (
              <SolitaireRow
                key={idx}
                rowIndex={idx}
                row={row}
                accentColor={rowAccents[idx]}
                isSelected={selectedRow === idx}
                isHinted={hintPulse && validRows.includes(idx)}
                onTap={() => handleRowTap(idx)}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Instruction hint at bottom */}
      {flippedCard && selectedRow !== null && (
        <div className="text-center text-xs text-foreground/60 pb-2 flex-shrink-0">
          tap the column again to confirm • or tap the card to play
        </div>
      )}
    </div>
  );
}