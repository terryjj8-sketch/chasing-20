import React, { useState, useEffect } from 'react';
import GameRow from './GameRow';
import DeckPile from './DeckPile';
import GameTimer from './GameTimer';
import { canPlayCard } from '@/lib/deckUtils';
import { Button } from '@/components/ui/button';
import { Undo2, Pause, Play } from 'lucide-react';

const rowAccents = ['row-1', 'row-2', 'row-3', 'row-4'];

export default function GameplayPhase({ gameState, onPlayCard, onDiscardCard, onFlipCard, onUndo, canUndo, elapsedSeconds, isPaused, onTogglePause }) {
  const { drawPile, discardPile, rows, flippedCard } = gameState;
  const [selectedRow, setSelectedRow] = useState(null);

  // Clear selection when flipped card changes (use card value/suit as stable key)
  const flippedCardKey = flippedCard ? `${flippedCard.value}-${flippedCard.suit}` : null;
  useEffect(() => {
    setSelectedRow(null);
  }, [flippedCardKey]);

  const validRows = flippedCard
    ? rows.map((row, idx) => canPlayCard(flippedCard, row) ? idx : null).filter(idx => idx !== null)
    : [];

  const handleRowTap = (idx) => {
    if (!flippedCard) return;
    if (!validRows.includes(idx)) return;
    setSelectedRow(prev => prev === idx ? null : idx);
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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col p-4 gap-6">

      {/* Title + Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Chasing 20</h1>
          <p className="text-sm text-foreground/60 mt-1">choose 4 cards, build your rows, Beat the deck.</p>
        </div>
        <div className="flex items-center gap-2" style={{ alignSelf: 'flex-start' }}>
          <GameTimer elapsedSeconds={elapsedSeconds} />
          <div className="bg-white/10 px-3 py-1.5 rounded-lg text-sm">
            <span className="text-foreground/50">Discarded</span>
            <span className="text-foreground font-bold ml-2">{discardPile.length}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="bg-white/10 hover:bg-white/20 text-foreground disabled:opacity-30 px-2"
            title="Undo last move"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Rows — tappable when a card is flipped */}
      <div className="grid grid-cols-4 gap-3">
        {rows.map((row, idx) => (
          <GameRow
            key={idx}
            rowIndex={idx}
            row={row}
            accentColor={rowAccents[idx]}
            isValid={flippedCard ? validRows.includes(idx) : undefined}
            isSelected={selectedRow === idx}
            onTap={() => handleRowTap(idx)}
          />
        ))}
      </div>

      {/* Deck & Flip area */}
      <div className="flex-1 flex items-center justify-center relative">
        <DeckPile
          deckCount={drawPile.length}
          flippedCard={flippedCard}
          onFlip={onFlipCard}
          onPlay={handlePlay}
          onDiscard={handleDiscard}
          canPlay={selectedRow !== null}
          isPaused={isPaused}
        />
        
        {/* Pause Button - Lower Right */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onTogglePause}
          className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 text-foreground"
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}