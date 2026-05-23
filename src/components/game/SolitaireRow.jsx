import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SolitaireCard from './SolitaireCard';

const accentMap = {
  'row-1': '#B833FF',
  'row-2': '#FF3399',
  'row-3': '#FFD700',
  'row-4': '#00D4FF',
};

// Responsive card sizing: smaller on mobile, full size on larger screens
// We use a fixed size here; the GameplayPhase handles layout stacking
const CARD_W = 62;
const CARD_H = 88;
const FAN_OFFSET = 20; // vertical offset per fanned card

export default function SolitaireRow({ rowIndex, row, accentColor, isSelected, onTap }) {
  const hex = accentMap[accentColor] || '#8B5CF6';
  const cards = row.cards;
  const prevCountRef = useRef(cards.length);
  const isNewCard = cards.length > prevCountRef.current;

  useEffect(() => {
    prevCountRef.current = cards.length;
  });

  // Column height: empty slot or fanned cards
  const columnHeight = cards.length === 0
    ? CARD_H
    : CARD_H + (cards.length - 1) * FAN_OFFSET;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rowIndex * 0.07 }}
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col items-center gap-1.5"
      style={{ cursor: 'pointer' }}
    >
      {/* Column header */}
      <div className="flex items-center gap-1.5 mb-1">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: hex, boxShadow: `0 0 6px ${hex}` }}
        />
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: hex }}>
          Row {rowIndex + 1}
        </span>
        <span
          className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
          style={{ background: `${hex}22`, color: hex }}
        >
          {cards.length}
        </span>
      </div>

      {/* Card column container */}
      <div
        className="relative rounded-lg transition-all duration-150"
        style={{
          width: CARD_W + 12,
          height: columnHeight + 12,
          padding: 6,
          background: isSelected ? `${hex}25` : 'rgba(255,255,255,0.03)',
          border: isSelected ? `2px solid ${hex}` : '2px solid rgba(255,255,255,0.06)',
          boxShadow: isSelected ? `0 0 18px ${hex}55` : undefined,
        }}
      >
        {cards.length === 0 ? (
          // Empty slot placeholder
          <div
            className="rounded flex items-center justify-center"
            style={{
              width: CARD_W,
              height: CARD_H,
              border: `2px dashed ${hex}30`,
            }}
          >
            <span style={{ color: `${hex}40`, fontSize: 18 }}>+</span>
          </div>
        ) : (
          // Fanned card stack
          <div className="relative" style={{ width: CARD_W, height: columnHeight }}>
            {cards.map((card, i) => {
              const isTopCard = i === cards.length - 1;
              const isNewTop = isTopCard && isNewCard;
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{ top: i * FAN_OFFSET, left: 0, zIndex: i + 1 }}
                >
                  <SolitaireCard
                    value={card.value}
                    suit={card.suit}
                    width={CARD_W}
                    height={CARD_H}
                    isNew={isNewTop}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Selected checkmark overlay */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-1 right-1 rounded-full w-5 h-5 flex items-center justify-center z-20"
              style={{ background: hex }}
            >
              <span className="text-white text-[10px] font-black">✓</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats below column */}
      <div className="flex flex-col items-center gap-0.5 mt-1">
        <div className="text-[10px] text-foreground/40">
          zeros <span className="font-bold text-purple-300">{row.zeroCount}/3</span>
        </div>
        {row.resetPending && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-[9px] font-bold text-purple-300"
          >
            ✨ reset pending
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}