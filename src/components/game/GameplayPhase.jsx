import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GameRow from './GameRow';
import DeckPile from './DeckPile';
import { canPlayCard } from '@/lib/deckUtils';

const rowAccents = ['row-1', 'row-2', 'row-3', 'row-4'];

export default function GameplayPhase({ gameState, onPlayCard, onDiscardCard, onFlipCard }) {
  const { drawPile, discardPile, rows, flippedCard } = gameState;

  const validRows = flippedCard
    ? rows.map((row, idx) => canPlayCard(flippedCard, row) ? idx : null).filter(idx => idx !== null)
    : [];

  const handlePlayOnRow = (rowIndex) => {
    if (flippedCard && validRows.includes(rowIndex)) {
      onPlayCard(rowIndex, flippedCard);
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
        <h1 className="text-3xl font-bold text-primary">Chasing 20</h1>
        <div className="flex gap-3 text-sm">
          <div className="bg-white/10 px-3 py-1.5 rounded-lg">
            <span className="text-foreground/50">Deck</span>
            <span className="text-foreground font-bold ml-2">{drawPile.length}</span>
          </div>
          <div className="bg-white/10 px-3 py-1.5 rounded-lg">
            <span className="text-foreground/50">Discarded</span>
            <span className="text-foreground font-bold ml-2">{discardPile.length}</span>
          </div>
        </div>
      </div>

      {/* Rows — spread horizontally across top */}
      <div className="grid grid-cols-4 gap-3">
        {rows.map((row, idx) => (
          <GameRow
            key={idx}
            rowIndex={idx}
            row={row}
            accentColor={rowAccents[idx]}
          />
        ))}
      </div>

      {/* Deck & Flip area — center stage */}
      <div className="flex-1 flex items-center justify-center">
        <DeckPile
          deckCount={drawPile.length}
          flippedCard={flippedCard}
          onFlip={onFlipCard}
          onPlayOnRow={handlePlayOnRow}
          onDiscard={handleDiscard}
          validRows={validRows}
          rowAccents={rowAccents}
        />
      </div>
    </div>
  );
}