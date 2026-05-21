import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const accentMap = {
  'row-1': '#B833FF',
  'row-2': '#FF3399',
  'row-3': '#FFD700',
  'row-4': '#00D4FF',
};

export default function GameRow({ rowIndex, row, accentColor, isValid, isSelected, onTap }) {
  const hex = accentMap[accentColor] || '#8B5CF6';
  const topCard = row.cards[row.cards.length - 1];
  const [flashKey, setFlashKey] = useState(0);
  const cardCount = row.cards.length;

  useEffect(() => {
    if (cardCount > 0) {
      setFlashKey(k => k + 1);
    }
  }, [cardCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rowIndex * 0.08 }}
      onClick={isValid ? onTap : undefined}
      whileTap={isValid ? { scale: 0.97 } : {}}
      className="relative rounded-xl p-3 flex flex-col gap-2 backdrop-blur transition-all duration-150"
      style={{
        border: `2px solid ${isSelected ? '#ffffff' : hex}`,
        background: isSelected ? `${hex}35` : `${hex}10`,
        cursor: isValid ? 'pointer' : 'default',
        boxShadow: isSelected ? `0 0 16px ${hex}80` : undefined,
        opacity: isValid === false && isValid !== undefined ? 0.5 : 1,
      }}
    >
      {/* Flash burst on card play */}
      <AnimatePresence>
        <motion.div
          key={flashKey}
          initial={{ opacity: 1, scale: 0.6 }}
          animate={{ opacity: 0, scale: 2.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${hex}90 0%, ${hex}40 40%, transparent 70%)`,
            zIndex: 10,
          }}
        />
      </AnimatePresence>
      {/* Row label */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: hex }}>
          Row {rowIndex + 1}
        </span>
        <span className="text-xs text-foreground/50">{row.cards.length} cards</span>
      </div>

      {/* Top card display */}
      <div className="flex justify-center">
        {topCard ? (
          <motion.div
            key={row.cards.length}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="w-16 h-24 rounded-lg flex items-center justify-center shadow-lg"
            style={{
              background: topCard.value === 0
                ? 'linear-gradient(135deg, #9b59b6, #e91e8c)'
                : `linear-gradient(135deg, ${hex}cc, ${hex}66)`,
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            <div className="text-center">
              <div className="text-white text-2xl font-black">{topCard.value}</div>
              {topCard.value === 0 && <div className="text-white/70 text-[9px] font-bold">RESET</div>}
            </div>
          </motion.div>
        ) : (
          <div className="w-16 h-24 rounded-lg border-2 border-dashed flex items-center justify-center"
            style={{ borderColor: `${hex}40` }}>
            <span className="text-foreground/20 text-xs">—</span>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="flex justify-between text-center text-xs">
        <div>
          <div className="text-foreground/40">Current</div>
          <div className="font-bold text-foreground">
            {row.resetPending ? '?' : (row.currentNumber ?? '—')}
          </div>
        </div>
        <div>
          <div className="text-foreground/40">Zeros</div>
          <div className="font-bold text-purple-300">{row.zeroCount}/3</div>
        </div>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-[10px] font-bold text-white"
        >
          ✓ Selected
        </motion.div>
      )}

      {/* Reset pending indicator */}
      {row.resetPending && !isSelected && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center text-[10px] font-bold text-purple-300"
        >
          ✨ Reset pending
        </motion.div>
      )}
    </motion.div>
  );
}