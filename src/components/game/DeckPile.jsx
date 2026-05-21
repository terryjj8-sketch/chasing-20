import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeckPile({ deckCount, onFlip, flippedCard, onPlayOnRow, onDiscard, validRows, rowAccents }) {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleTap = () => {
    if (deckCount === 0 || flippedCard || isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      onFlip();
      setIsFlipping(false);
    }, 300);
  };

  const accentHex = {
    'row-1': '#B833FF',
    'row-2': '#FF3399',
    'row-3': '#FFD700',
    'row-4': '#00D4FF',
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-8 items-start justify-center">
        {/* Deck Stack */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-foreground/50 uppercase tracking-widest">Deck</span>
          <motion.div
            onClick={handleTap}
            whileTap={deckCount > 0 && !flippedCard ? { scale: 0.95 } : {}}
            className="relative cursor-pointer select-none"
            style={{ width: 80, height: 120 }}
          >
            {/* Stack shadow cards */}
            {deckCount > 2 && (
              <div className="absolute rounded-lg" style={{
                width: 80, height: 120,
                top: -4, left: 4,
                background: 'linear-gradient(135deg, #3a2060 0%, #1e1040 100%)',
                border: '2px solid rgba(255,255,255,0.1)',
              }} />
            )}
            {deckCount > 1 && (
              <div className="absolute rounded-lg" style={{
                width: 80, height: 120,
                top: -2, left: 2,
                background: 'linear-gradient(135deg, #4a2880 0%, #2a1660 100%)',
                border: '2px solid rgba(255,255,255,0.1)',
              }} />
            )}

            {/* Top card */}
            {deckCount > 0 ? (
              <motion.div
                animate={isFlipping ? { rotateY: 90 } : { rotateY: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute rounded-lg flex items-center justify-center overflow-hidden"
                style={{
                  width: 80, height: 120,
                  background: 'linear-gradient(135deg, #6a38c0 0%, #3a1880 100%)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}
              >
                {/* Card back pattern */}
                <div className="absolute inset-2 rounded border-2 border-white/20 flex items-center justify-center">
                  <div className="text-white/30 text-3xl font-bold">✦</div>
                </div>
                <div className="absolute bottom-2 right-2 text-white/20 text-xs font-bold">{deckCount}</div>
              </motion.div>
            ) : (
              <div className="absolute rounded-lg flex items-center justify-center" style={{
                width: 80, height: 120,
                border: '2px dashed rgba(255,255,255,0.2)',
              }}>
                <span className="text-foreground/30 text-xs text-center">Empty</span>
              </div>
            )}
          </motion.div>

          {deckCount > 0 && !flippedCard && (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xs text-primary font-semibold"
            >
              Tap to flip
            </motion.span>
          )}
        </div>

        {/* Flipped Card Area */}
        <div className="flex flex-col items-center gap-2" style={{ minWidth: 120 }}>
          <span className="text-xs text-foreground/50 uppercase tracking-widest">Current</span>
          <AnimatePresence mode="wait">
            {flippedCard ? (
              <motion.div
                key={`flipped-${flippedCard.value}`}
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.35, type: 'spring' }}
                className="rounded-xl flex items-center justify-center shadow-2xl"
                style={{
                  width: 100, height: 148,
                  background: flippedCard.value === 0
                    ? 'linear-gradient(135deg, #9b59b6, #e91e8c)'
                    : 'linear-gradient(135deg, #1e88e5, #0d47a1)',
                  border: '3px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 0 30px rgba(255,255,255,0.2)',
                }}
              >
                <div className="text-center">
                  <div className="text-white text-4xl font-black drop-shadow-lg">
                    {flippedCard.value === 0 ? '0' : flippedCard.value}
                  </div>
                  {flippedCard.value === 0 && (
                    <div className="text-white/80 text-xs font-bold mt-1">RESET</div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty-flipped"
                className="rounded-xl flex items-center justify-center"
                style={{
                  width: 100, height: 148,
                  border: '2px dashed rgba(255,255,255,0.15)',
                }}
              >
                <span className="text-foreground/20 text-xs text-center px-2">
                  {deckCount > 0 ? 'Flip a card' : 'Deck empty'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons */}
      <AnimatePresence>
        {flippedCard && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex gap-3 justify-center"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => validRows.length > 0 && onPlayOnRow(validRows[0])}
              disabled={validRows.length === 0}
              className="px-6 py-2 rounded-lg text-sm font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: validRows.length > 0 ? '#10B981' : '#6B7280',
              }}
            >
              Play
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onDiscard}
              className="px-6 py-2 rounded-lg text-sm font-bold bg-white/10 text-white border border-white/20"
            >
              Discard
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}