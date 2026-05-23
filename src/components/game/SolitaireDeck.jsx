import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCardTheme } from '@/lib/ThemeContext';

const SUIT_SYMBOLS = [
  { symbol: '♠', color: '#1e293b' },
  { symbol: '♥', color: '#e11d48' },
  { symbol: '♦', color: '#e11d48' },
  { symbol: '♣', color: '#1e293b' },
];

// Stock pile (deck face-down) + Waste pile (current flipped card)
// Classic solitaire top-left placement style

// On mobile we use slightly smaller cards
const CARD_W = 62;
const CARD_H = 88;

function CardBack({ onClick, count, disabled }) {
  return (
    <motion.div
      onClick={disabled ? undefined : onClick}
      whileTap={disabled ? {} : { scale: 0.94 }}
      className="relative cursor-pointer select-none"
      style={{ width: CARD_W, height: CARD_H }}
    >
      {count > 2 && (
        <div className="absolute rounded-lg" style={{
          width: CARD_W, height: CARD_H,
          top: -5, left: 5,
          background: 'linear-gradient(135deg, #2a7f9e 0%, #1a5f7a 100%)',
          border: '2px solid rgba(255,255,255,0.4)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }} />
      )}
      {count > 1 && (
        <div className="absolute rounded-lg" style={{
          width: CARD_W, height: CARD_H,
          top: -2.5, left: 2.5,
          background: 'linear-gradient(135deg, #2a7f9e 0%, #1a5f7a 100%)',
          border: '2px solid rgba(255,255,255,0.4)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }} />
      )}
      {count > 0 && (
        <div
          className="absolute rounded-lg flex items-center justify-center overflow-hidden shadow-lg"
          style={{
            width: CARD_W, height: CARD_H,
            background: 'linear-gradient(135deg, #2a7f9e 0%, #1a5f7a 100%)',
            border: '2px solid rgba(255,255,255,0.5)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
          }}
        >
          <div className="text-center leading-tight pointer-events-none">
            <div className="text-yellow-100 text-[11px] font-black tracking-wider">CHASING</div>
            <div className="text-yellow-300 text-[28px] font-black leading-none">20</div>
            <div className="text-yellow-100 text-[7px] font-bold mt-1 tracking-widest">SOLITAIRE</div>
          </div>
        </div>
      )}
      {count === 0 && (
        <div className="rounded-lg flex items-center justify-center"
          style={{ width: CARD_W, height: CARD_H, border: '2px dashed rgba(255,255,255,0.2)' }}>
          <span className="text-foreground/30 text-xs">Empty</span>
        </div>
      )}
    </motion.div>
  );
}

function CardFace({ card, onTap, isPlayable }) {
  const { theme } = useCardTheme();
  const isOldSchool = theme.id === 'old-school';
  const isZero = card.value === 0;
  const suitInfo = (card.suit !== undefined && card.suit !== null) ? SUIT_SYMBOLS[card.suit] : null;
  const textColor = (isOldSchool && suitInfo && !isZero) ? suitInfo.color : '#000000';

  return (
    <motion.div
      key={`${card.value}-${card.suit}`}
      initial={{ rotateY: -90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3, type: 'spring' }}
      onClick={onTap}
      whileTap={onTap ? { scale: 0.95 } : {}}
      className="rounded-lg flex items-center justify-center relative overflow-hidden select-none"
      style={{
        width: CARD_W,
        height: CARD_H,
        background: '#fff',
        border: isPlayable ? '2px solid #10B981' : '2px solid #e2e8f0',
        boxShadow: isPlayable
          ? '0 0 14px rgba(16,185,129,0.55), 0 4px 12px rgba(0,0,0,0.3)'
          : '0 4px 12px rgba(0,0,0,0.25)',
        cursor: onTap ? 'pointer' : 'default',
        flexShrink: 0,
      }}
    >
      <div className="absolute rounded-sm pointer-events-none" style={{ inset: 3, border: '1px solid #e2e8f0' }} />
      {/* Corner labels */}
      {isOldSchool && suitInfo && !isZero ? (
        <>
          <div className="absolute top-1 left-1.5 flex flex-col items-center leading-none">
            <span className="font-black text-[10px]" style={{ color: textColor }}>{card.value}</span>
            <span className="text-[9px]" style={{ color: textColor }}>{suitInfo.symbol}</span>
          </div>
          <div className="absolute bottom-1 right-1.5 flex flex-col items-center leading-none">
            <span className="font-black text-[10px]" style={{ color: textColor }}>{card.value}</span>
            <span className="text-[9px]" style={{ color: textColor }}>{suitInfo.symbol}</span>
          </div>
        </>
      ) : (
        <>
          <div className="absolute top-1.5 left-2 text-black font-black leading-none text-[11px]">
            {isZero ? '0' : card.value}
          </div>
          <div className="absolute bottom-1.5 right-2 text-black font-black leading-none text-[11px]">
            {isZero ? '0' : card.value}
          </div>
        </>
      )}
      {/* Center value */}
      <div className="text-center z-10">
        <div className="text-3xl font-black" style={{ color: textColor }}>{isZero ? '0' : card.value}</div>
        {isOldSchool && suitInfo && !isZero && (
          <div className="text-base leading-none" style={{ color: textColor }}>{suitInfo.symbol}</div>
        )}
        {isZero && <div className="text-black/50 text-[8px] font-bold -mt-1">RESET</div>}
      </div>
    </motion.div>
  );
}

export default function SolitaireDeck({ deckCount, flippedCard, onFlip, onDiscard, onCardTap, isPlayable, showDeckCount }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Stock + Waste row — horizontal on all sizes */}
      <div className="flex items-end gap-3 sm:gap-4">
        {/* Stack pile */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] text-foreground/40 uppercase tracking-widest">Stack</span>
          <CardBack
            onClick={deckCount > 0 && !flippedCard ? onFlip : undefined}
            count={deckCount}
            disabled={deckCount === 0 || !!flippedCard}
          />
          {showDeckCount && (
            <span className="text-[10px] text-foreground/30">{deckCount} left</span>
          )}
        </div>

        {/* Waste pile / Current card */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] text-foreground/40 uppercase tracking-widest">Current</span>
          <AnimatePresence mode="wait">
            {flippedCard ? (
              <CardFace
                key={`${flippedCard.value}-${flippedCard.suit}`}
                card={flippedCard}
                onTap={onCardTap}
                isPlayable={isPlayable}
              />
            ) : (
              <motion.div
                key="empty-waste"
                className="rounded-lg flex items-center justify-center"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  border: '2px dashed rgba(255,255,255,0.1)',
                }}
              >
                <span className="text-foreground/20 text-[10px] text-center px-1">
                  {deckCount > 0 ? 'Flip a card' : 'Deck empty'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Discard button */}
      <AnimatePresence>
        {flippedCard && (
          <motion.button
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.85 }}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.06 }}
            onClick={onDiscard}
            className="px-6 py-2 rounded-xl text-sm font-bold text-white shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)',
              boxShadow: '0 4px 14px rgba(255,107,107,0.4)',
            }}
          >
            ✕ Discard
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}