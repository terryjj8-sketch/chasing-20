import React, { useState, useEffect, useRef } from 'react';
import SolitaireRow from './SolitaireRow';
import SolitaireDeck from './SolitaireDeck';
import GameTimer from './GameTimer';
import RowCompleteToast from './RowCompleteToast';
import { canPlayCard } from '@/lib/deckUtils';
import { Button } from '@/components/ui/button';
import { Undo2, Pause, Play, RotateCcw, HelpCircle, X } from 'lucide-react';

const rowAccents = ['row-1', 'row-2', 'row-3', 'row-4'];

export default function GameplayPhase({ gameState, onPlayCard, onDiscardCard, onFlipCard, onUndo, canUndo, elapsedSeconds, isPaused, onTogglePause, onRestart, difficulty, completedRowAlert, onClearRowAlert }) {
  const { drawPile, discardPile, rows, flippedCard } = gameState;
  const showDeckCount = difficulty === 'easy';
  const [dragOverRow, setDragOverRow] = useState(null);
  const isMobile = window.innerWidth < 768;
  const rowRefs = useRef([]);

  const [hintPulse, setHintPulse] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const flippedCardKey = flippedCard ? `${flippedCard.value}-${flippedCard.suit}` : null;
  useEffect(() => {
    setDragOverRow(null);
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

  // Find which row (if any) the pointer is currently over, restricted to valid rows
  const findRowUnderPoint = (x, y) => {
    for (let idx = 0; idx < rowRefs.current.length; idx++) {
      const el = rowRefs.current[idx];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return idx;
      }
    }
    return null;
  };

  const handleCardDrag = (event, info) => {
    const idx = findRowUnderPoint(info.point.x, info.point.y);
    setDragOverRow(idx !== null && validRows.includes(idx) ? idx : null);
  };

  const handleCardDragEnd = (event, info) => {
    const idx = findRowUnderPoint(info.point.x, info.point.y);
    if (idx !== null && validRows.includes(idx) && flippedCard) {
      onPlayCard(idx, flippedCard);
    }
    setDragOverRow(null);
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
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHint(true)}
            className="bg-black/30 hover:bg-black/50 text-foreground px-2 border border-white/10 h-7"
            title="How to play"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </Button>
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
            onClick={onTogglePause}
            className="bg-black/30 hover:bg-black/50 text-foreground px-2 border border-white/10 h-7"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </Button>
          {/* Restart separated with a gap and red tint to avoid accidental taps */}
          <div className="w-px h-5 bg-white/10 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onRestart}
            className="bg-red-900/30 hover:bg-red-800/50 text-red-300 px-2 border border-red-500/20 h-7"
            title="Restart game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Main table area — fills remaining height */}
      <div className="flex-1 flex flex-col md:flex-row px-2 sm:px-3 gap-2 md:gap-8 pb-2 md:pb-4 min-h-0 items-stretch md:items-center md:justify-center">

        {/* Deck / waste area */}
        <div className="flex-shrink-0 flex justify-center items-center md:items-start">
          <SolitaireDeck
            deckCount={drawPile.length}
            flippedCard={flippedCard}
            onFlip={onFlipCard}
            onDiscard={handleDiscard}
            onCardDrag={handleCardDrag}
            onCardDragEnd={handleCardDragEnd}
            showDeckCount={showDeckCount}
            isMobile={isMobile}
          />
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px self-stretch bg-white/10" />
        <div className="block md:hidden h-px w-full bg-white/10 flex-shrink-0" />

        {/* Row columns — scrollable vertically on mobile so stats are reachable */}
        <div className="flex-shrink-0 min-h-0 overflow-y-auto">
          <div className="flex gap-3 sm:gap-4 md:gap-6 justify-center min-w-0 pb-2">
            {rows.map((row, idx) => (
              <SolitaireRow
                key={idx}
                rowIndex={idx}
                row={row}
                accentColor={rowAccents[idx]}
                isDragOver={dragOverRow === idx}
                isHinted={hintPulse && validRows.includes(idx)}
                rowRef={(el) => (rowRefs.current[idx] = el)}
                isMobile={isMobile}
                showCardCount={difficulty === 'easy'}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Hint overlay */}
      {showHint && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowHint(false)}>
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 mx-6 max-w-sm text-white" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg">How to play a card</h3>
              <button onClick={() => setShowHint(false)} className="text-white/50 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <ol className="space-y-3 text-sm text-white/80">
              <li className="flex gap-2"><span className="font-black text-yellow-400">1.</span> A card from the deck automatically flips face-up for you.</li>
              <li className="flex gap-2"><span className="font-black text-yellow-400">2.</span> <span className="font-bold text-white">Drag the face-up card</span> onto a row to play it there. Valid rows glow as you drag.</li>
              <li className="flex gap-2"><span className="font-black text-yellow-400">3.</span> Got a <span className="font-bold text-yellow-300 mx-1">★ WILD</span>? Drag it onto any row to reset the counter. Don't want the card? Tap <span className="font-bold text-red-400 ml-1">Discard</span>.</li>
            </ol>
          </div>
        </div>
      )}

      {/* Instruction hint at bottom */}
      {flippedCard && (
        <div className="text-center text-xs text-foreground/60 pb-2 flex-shrink-0">
          drag the card onto a glowing row to play it
        </div>
      )}
    </div>
  );
}