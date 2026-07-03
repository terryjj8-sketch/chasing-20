import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SolitaireCard from './SolitaireCard';
import StatesCard from './StatesCard';
import GamesCard from './GamesCard';
import CalendarCard from './CalendarCard';
import WildToken from './WildToken';

const accentMap = {
  'row-1': '#B833FF',
  'row-2': '#FF3399',
  'row-3': '#FFD700',
  'row-4': '#00D4FF',
};

const FAN_OFFSET_DESKTOP = 34;
// Cap how tall a row column can grow so headers/labels never get pushed
// off-screen by a long cascade. Cards compress their fan spacing once a
// column would exceed this height, rather than growing without limit.
const MOBILE_MAX_COL_H = 260;
const DESKTOP_MAX_COL_H = 520;

// A row "clears" when it hits 20 cards and instantly reseeds down to 1.
// We detect that by watching for a sharp drop in card count between renders
// (rather than tracking it via a prop, since Game.jsx already resets the
// row's card array directly — no new prop needed here).
const CLEAR_DROP_THRESHOLD = 10;

export default function SolitaireRow({ rowIndex, row, accentColor, isDragOver, isHinted, rowRef, isMobile, showCardCount = true, gameMode = 'numbers' }) {
  const hex = accentMap[accentColor] || '#8B5CF6';
  const cards = row.cards;
  const prevCountRef = useRef(cards.length);
  const isNewCard = cards.length > prevCountRef.current;
  const [justCleared, setJustCleared] = useState(false);

  const CARD_W = isMobile ? 62 : 108;
  const CARD_H = isMobile ? 88 : 154;
  const MAX_COL_H = isMobile ? MOBILE_MAX_COL_H : DESKTOP_MAX_COL_H;

  useEffect(() => {
    const prevCount = prevCountRef.current;
    // A clear looks like a sudden big drop (e.g. 20 -> 1), not the normal
    // one-card-at-a-time growth of regular play.
    if (prevCount - cards.length >= CLEAR_DROP_THRESHOLD) {
      setJustCleared(true);
      const t = setTimeout(() => setJustCleared(false), 700);
      prevCountRef.current = cards.length;
      return () => clearTimeout(t);
    }
    prevCountRef.current = cards.length;
  }, [cards.length]);

  // Compress the fan so all cards fit within MAX_COL_H, on both mobile and desktop.
  // Always show at least the top card fully; older cards peek above it.
  const fanOffset = cards.length > 1
    ? Math.min(FAN_OFFSET_DESKTOP, (MAX_COL_H - CARD_H) / (cards.length - 1))
    : FAN_OFFSET_DESKTOP;

  const columnHeight = cards.length === 0
    ? CARD_H
    : Math.min(CARD_H + (cards.length - 1) * fanOffset, MAX_COL_H);

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rowIndex * 0.07 }}
      className="flex flex-col items-center gap-1.5"
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
        {showCardCount && (
          <span
            className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
            style={{ background: `${hex}22`, color: hex }}
          >
            {cards.length}
          </span>
        )}
        {(gameMode === 'states' || gameMode === 'games' || gameMode === 'calendar') && (
          <span
            className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
            style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}
            title="Wildcards used this row"
          >
            {row.wildCount || 0}/4 wild
          </span>
        )}
      </div>

      {/* Card column container */}
      <div
        className="relative rounded-lg transition-all duration-150 overflow-hidden"
        style={{
          width: CARD_W + 12,
          height: columnHeight + 12,
          padding: 6,
          background: isDragOver ? `${hex}25` : isHinted ? `${hex}18` : 'rgba(255,255,255,0.03)',
          border: isDragOver ? `2px solid ${hex}` : isHinted ? `2px solid ${hex}99` : '2px solid rgba(255,255,255,0.06)',
          boxShadow: isDragOver ? `0 0 18px ${hex}55` : isHinted ? `0 0 22px ${hex}88, 0 0 40px ${hex}44` : undefined,
          transition: 'box-shadow 0.15s, border-color 0.15s, background 0.15s, height 0.2s',
        }}
      >
        {cards.length === 0 ? (
          <div
            className="rounded flex items-center justify-center"
            style={{ width: CARD_W, height: CARD_H, border: `2px dashed ${hex}30` }}
          >
            <span style={{ color: `${hex}40`, fontSize: 18 }}>+</span>
          </div>
        ) : (
          <div className="relative" style={{ width: CARD_W, height: columnHeight }}>
            {cards.map((card, i) => {
              const isTopCard = i === cards.length - 1;
              const isNewTop = isTopCard && isNewCard;
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{ top: i * fanOffset, left: 0, zIndex: i + 1 }}
                >
                  {gameMode === 'states' ? (
                    <StatesCard card={card} width={CARD_W} height={CARD_H} isNew={isNewTop} animate={isNewTop} />
                  ) : gameMode === 'games' ? (
                    <GamesCard card={card} width={CARD_W} height={CARD_H} isNew={isNewTop} animate={isNewTop} />
                  ) : gameMode === 'calendar' ? (
                    <CalendarCard card={card} width={CARD_W} height={CARD_H} isNew={isNewTop} animate={isNewTop} />
                  ) : card.value === 0 ? (
                    <WildToken size={CARD_W} isNew={isNewTop} />
                  ) : (
                    <SolitaireCard
                      value={card.value}
                      suit={card.suit}
                      width={CARD_W}
                      height={CARD_H}
                      isNew={isNewTop}
                      cardIndex={i}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Drop-target indicator overlay (shown while dragging over a valid row) */}
        <AnimatePresence>
          {isDragOver && (
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

        {/* Row-cleared burst: fires when the row hits 20 and instantly reseeds */}
        <AnimatePresence>
          {justCleared && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1.15 }}
              exit={{ opacity: 0, scale: 1.6 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none rounded-lg"
              style={{ background: `${hex}30` }}
            >
              <span
                className="text-xl font-black"
                style={{ color: hex, textShadow: `0 0 12px ${hex}` }}
              >
                ✨ CLEARED!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats below column */}
      <div className="flex flex-col items-center gap-0.5 mt-1">
        <div className="text-[10px] text-foreground/40">
          wilds <span className="font-bold text-purple-300">{row.zeroCount}/3</span>
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
