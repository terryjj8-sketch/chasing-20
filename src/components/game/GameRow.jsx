import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

export default function GameRow({ rowIndex, row, accentColor }) {
  const accentHex = {
    'row-1': '#B833FF',
    'row-2': '#FF3399',
    'row-3': '#FFD700',
    'row-4': '#00D4FF',
  }[accentColor] || '#8B5CF6';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rowIndex * 0.1 }}
      className="bg-card/50 border-2 rounded-lg p-6 backdrop-blur"
      style={{ borderColor: accentHex }}
    >
      {/* Row Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground">Row {rowIndex + 1}</h3>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Cards</div>
            <div className="text-2xl font-bold" style={{ color: accentHex }}>
              {row.cards.length}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Current #</div>
            <div className="text-2xl font-bold text-foreground">
              {row.resetPending ? '?' : row.currentNumber || '—'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Zeros Used</div>
            <div className="text-2xl font-bold text-purple-400">
              {row.zeroCount} / 3
            </div>
          </div>
        </div>
      </div>

      {/* Cards Display */}
      <div className="bg-background/30 rounded-lg p-4 min-h-[100px] flex flex-wrap gap-2 items-start content-start overflow-y-auto max-h-32">
        {row.cards.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No cards yet
          </div>
        ) : (
          row.cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              <Card value={card.value} size="small" />
            </motion.div>
          ))
        )}
      </div>

      {/* Reset Pending Status */}
      {row.resetPending && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-3 text-center text-sm font-bold text-purple-400"
        >
          ✨ Waiting for next card to set new number
        </motion.div>
      )}
    </motion.div>
  );
}