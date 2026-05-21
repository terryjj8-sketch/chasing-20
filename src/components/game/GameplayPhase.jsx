import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Card from './Card';
import GameRow from './GameRow';
import { canPlayCard } from '@/lib/deckUtils';

const rowAccents = ['row-1', 'row-2', 'row-3', 'row-4'];

export default function GameplayPhase({ gameState, onPlayCard, onDiscardCard }) {
  const currentCard = gameState.currentCard;
  const validRows = currentCard
    ? gameState.rows
        .map((row, idx) => canPlayCard(currentCard, row) ? idx : null)
        .filter(idx => idx !== null)
    : [];

  const handlePlayOnRow = (rowIndex) => {
    if (currentCard && validRows.includes(rowIndex)) {
      onPlayCard(rowIndex, currentCard);
    }
  };

  const handleDiscard = () => {
    if (currentCard) {
      onDiscardCard(currentCard);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary">Chasing 20</h1>
        <div className="flex gap-8 mt-4 text-sm">
          <div className="bg-card/50 px-4 py-2 rounded-lg">
            <span className="text-muted-foreground">Deck:</span>
            <span className="text-foreground font-bold ml-2">{gameState.drawPile.length}</span>
          </div>
          <div className="bg-card/50 px-4 py-2 rounded-lg">
            <span className="text-muted-foreground">Discard:</span>
            <span className="text-foreground font-bold ml-2">{gameState.discardPile.length}</span>
          </div>
        </div>
      </div>

      {/* Current Card */}
      <motion.div
        key={currentCard ? `${currentCard.value}-${gameState.drawPile.length}` : 'empty'}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 mb-12"
      >
        <h2 className="text-lg text-muted-foreground">Current Card</h2>
        {currentCard ? (
          <Card value={currentCard.value} size="large" />
        ) : (
          <div className="w-32 h-48 bg-card/30 rounded-lg border-2 border-dashed border-muted-foreground flex items-center justify-center">
            <span className="text-muted-foreground">No more cards</span>
          </div>
        )}

        {currentCard && (
          <div className="flex gap-3">
            {validRows.length > 0 ? (
              validRows.map(rowIdx => (
                <Button
                  key={rowIdx}
                  onClick={() => handlePlayOnRow(rowIdx)}
                  className={`bg-${rowAccents[rowIdx]} hover:bg-${rowAccents[rowIdx]}/90 text-white`}
                >
                  Play on Row {rowIdx + 1}
                </Button>
              ))
            ) : null}
            <Button
              onClick={handleDiscard}
              variant="outline"
            >
              Discard
            </Button>
          </div>
        )}
      </motion.div>

      {/* Rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {gameState.rows.map((row, idx) => (
          <GameRow
            key={idx}
            rowIndex={idx}
            row={row}
            accentColor={rowAccents[idx]}
          />
        ))}
      </div>
    </div>
  );
}