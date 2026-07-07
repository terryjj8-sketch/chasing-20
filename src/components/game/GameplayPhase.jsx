import React, { useState, useEffect, useRef } from 'react';
import SolitaireRow from './SolitaireRow';
import SolitaireDeck from './SolitaireDeck';
import GameTimer from './GameTimer';
import RowCompleteToast from './RowCompleteToast';
import { canPlayCard } from '@/lib/deckUtils';
import { canPlayStatesCard } from '@/lib/statesData';
import { canPlayGamesCard } from '@/lib/gamesData';
import { canPlayCalendarCard } from '@/lib/calendarData';
import { Button } from '@/components/ui/button';
import { Undo2, Pause, Play, RotateCcw, HelpCircle, X } from 'lucide-react';

const rowAccents = ['row-1', 'row-2', 'row-3', 'row-4'];

export default function GameplayPhase({ gameState, onPlayCard, onDiscardCard, onFlipCard, onMergeRows, onToggleCall, onLockCalls, onFlipRow, onUndo, canUndo, elapsedSeconds, isPaused, onTogglePause, onRestart, difficulty, completedRowAlert, onClearRowAlert }) {
  const { drawPile, discardPile, rows, flippedCard, callsLocked } = gameState;
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

  const gameMode = gameState.gameMode || 'numbers';
  const isCalling = gameMode === 'numbers' && !callsLocked;
  const calledCount = rows.filter(r => r.called).length;
  const checkCanPlay = (card, row) =>
    gameMode === 'states' ? canPlayStatesCard(card, row) :
    gameMode === 'games' ? canPlayGamesCard(card, row) :
    gameMode === 'calendar' ? canPlayCalendarCard(card, row) :
    canPlayCard(card, row);

  const validRows = flippedCard && !isCalling
    ? rows.map((row, idx) => checkCanPlay(flippedCard, row) ? idx : null).filter(idx => idx !== null)
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

  const canMergeInto = (srcIdx, tgtIdx) => {
    if (gameMode !== 'numbers' || srcIdx === tgtIdx) return false;
    const sRow = rows[srcIdx], tRow = rows[tgtIdx];
    if (!sRow || !tRow || sRow.cards.length === 0 || tRow.cards.length === 0) return false;
    if (sRow.called && tRow.called) return false;
    const tEnd = tRow.cards[tRow.cards.length - 1].value;
    const first = sRow.cards[0].value;
    const last = sRow.cards[sRow.cards.length - 1].value;
    return Math.abs(tEnd - first) <= 1 || Math.abs(tEnd - last) <= 1;
  };

  const handleRowDrag = (srcIdx) => (event, info) => {
    const idx = findRowUnderPoint(info.point.x, info.point.y);
    setDragOverRow(idx !== null && canMergeInto(srcIdx, idx) ? idx : null);
  };

  const handleRowDragEnd = (srcIdx) => (event, info) => {
    const idx = findRowUnderPoint(info.point.x, info.point.y);
    if (idx !== null && canMergeInto(srcIdx, idx) && onMergeRows) onMergeRows(srcIdx, idx);
    setDragOverRow(null);
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
    if (isCalling) return;
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

      {/* CALL YOUR ROADS banner */}
      {isCalling && (
        <div className="flex-shrink-0 px-4 py-2 flex flex-col items-center gap-2">
          <div className="text-center">
            <div className="text-sm font-black tracking-widest" style={{ color: '#fbbf24' }}>CALL YOUR ROADS</div>
            <div className="text-xs text-foreground/70">Tap the two rows you plan to build to 20 — only called roads can win.</div>
          </div>
          <button
            onClick={onLockCalls}
            disabled={calledCount !== 2}
            className="px-5 py-1.5 rounded-lg text-xs font-black tracking-widest transition-all"
            style={{
              background: calledCount === 2 ? '#fbbf24' : 'rgba(255,255,255,0.08)',
              color: calledCount === 2 ? '#111' : 'rgba(255,255,255,0.35)',
              boxShadow: calledCount === 2 ? '0 0 16px rgba(251,191,36,0.5)' : 'none',
            }}
          >
            {calledCount === 2 ? 'LOCK IN MY ROADS' : calledCount === 1 ? 'PICK 1 MORE ROAD' : 'PICK 2 ROADS'}
          </button>
        </div>
      )}

      {/* Main table area — fills remaining height */}
      <div className="flex-1 flex flex-col md:flex-row px-2 sm:px-3 gap-2 md:gap-8 pt-2 md:pt-6 pb-2 md:pb-4 min-h-0 items-stretch md:items-center md:justify-center">

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
            gameMode={gameMode}
          />
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px self-stretch bg-white/10" />
        <div className="block md:hidden h-px w-full bg-white/10 flex-shrink-0" />

        {/* Row columns — scrollable vertically on mobile so stats are reachable */}
        <div className="flex-shrink-0 min-h-0 overflow-y-auto">
          <div className="flex gap-3 sm:gap-4 md:gap-6 justify-center min-w-0 pb-2">
            {rows.map((row, idx) => (
              <div
                key={idx}
                onClick={isCalling ? () => onToggleCall && onToggleCall(idx) : undefined}
                style={isCalling ? { cursor: 'pointer' } : undefined}
              >
              <SolitaireRow
                rowIndex={idx}
                row={row}
                accentColor={rowAccents[idx]}
                isDragOver={dragOverRow === idx}
                rowDraggable={!isCalling && gameMode === 'numbers' && row.cards.length > 0}
                onRowDrag={handleRowDrag(idx)}
                onRowDragEnd={handleRowDragEnd(idx)}
                isHinted={hintPulse && validRows.includes(idx)}
                rowRef={(el) => (rowRefs.current[idx] = el)}
                isMobile={isMobile}
                showCardCount={difficulty === 'easy'}
                onFlipRow={!isCalling && gameMode === 'numbers' ? () => onFlipRow && onFlipRow(idx) : undefined}
                gameMode={gameMode}
              />
              </div>
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
              <li className="flex gap-2"><span className="font-black text-yellow-400">2.</span> <span className="font-bold text-white">Drag the face-up card</span> onto a row — it must be the <span className="font-bold text-white">same, one higher, or one lower</span> than that row's last card. Valid rows glow.</li>
              {gameMode === 'numbers' ? (
                <>
                  <li className="flex gap-2"><span className="font-black text-yellow-400">3.</span> <span className="font-bold text-white">Merge rows:</span> drag a row's <span className="font-bold text-white">label</span> onto another row. If the ends connect (same/±1), the whole row stacks on — it'll even flip around to fit.</li>
                  <li className="flex gap-2"><span className="font-black text-yellow-400">4.</span> <span className="font-bold text-white">Flip a road:</span> tap its <span className="font-bold" style={{ color: '#38bdf8' }}>⇅ FLIP</span> chip to reverse it — the start becomes the playable end. Once per road.</li>
                  <li className="flex gap-2"><span className="font-black text-yellow-400">5.</span> Can't play? Tap <span className="font-bold text-red-400">Discard</span> — the deck reshuffles discards when it runs dry, but cards played on rows are gone for good.</li>
                  <li className="flex gap-2"><span className="font-black text-yellow-400">★</span> <span className="font-bold text-yellow-300">WIN: build your two CALLED roads to 20+ cards</span> before the deck runs out.</li>
                </>
              ) : (
                <li className="flex gap-2"><span className="font-black text-yellow-400">3.</span> Got a <span className="font-bold text-yellow-300 mx-1">★ WILD</span>? Drag it onto any row to reset the counter. Don't want the card? Tap <span className="font-bold text-red-400 ml-1">Discard</span>.</li>
              )}
            </ol>
          </div>
        </div>
      )}

      {/* Instruction hint at bottom */}
      {flippedCard && !isCalling && (
        <div className="text-center text-xs text-foreground/60 pb-2 flex-shrink-0">
          drag the card onto a glowing row to play it
        </div>
      )}
    </div>
  );
}