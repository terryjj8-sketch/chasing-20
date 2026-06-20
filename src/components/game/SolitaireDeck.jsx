import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FACTIONS } from './SolitaireCard';

// Stock pile (deck face-down) + Waste pile (current flipped card)
// Classic solitaire top-left placement style

function getCardSize(isMobile) {
  return isMobile ? { CARD_W: 62, CARD_H: 88 } : { CARD_W: 84, CARD_H: 120 };
}

function CardBack({ onClick, count, disabled, isMobile }) {
  const { CARD_W, CARD_H } = getCardSize(isMobile);
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

function CardFace({ card, isPlayable, isDraggable, isMobile, onDrag, onDragEnd }) {
  const isZero = card.value === 0;
  const faction = FACTIONS[card.suit ?? 0];
  const { CARD_W, CARD_H } = getCardSize(isMobile);
  const fontScale = isMobile ? 1 : 1.25;

  return (
    <motion.div
      key={`${card.value}-${card.suit}`}
      initial={{ rotateY: -90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3, type: 'spring' }}
      drag={isDraggable}
      dragSnapToOrigin
      dragElastic={0.15}
      dragMomentum={false}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.08, zIndex: 50, cursor: 'grabbing' }}
      className="rounded-lg flex items-center justify-center relative overflow-hidden select-none"
      style={{
        width: CARD_W,
        height: CARD_H,
        background: faction.bg,
        border: isPlayable ? '2px solid #10B981' : `2px solid ${faction.accent}55`,
        boxShadow: isPlayable
          ? '0 0 14px rgba(16,185,129,0.55), 0 4px 12px rgba(0,0,0,0.3)'
          : '0 4px 12px rgba(0,0,0,0.25)',
        cursor: isDraggable ? 'grab' : 'default',
        flexShrink: 0,
        touchAction: 'none',
        zIndex: 10,
      }}
    >
      <div className="absolute rounded-sm pointer-events-none" style={{ inset: 3, border: `1px solid ${faction.accent}33` }} />

      {/* Corner pips */}
      {!isZero && (
        <>
          <div className="absolute top-1 left-1.5 flex flex-col items-center leading-none">
            <span className="font-black leading-none" style={{ color: faction.fg, fontSize: 9 * fontScale }}>{card.value}</span>
            <span className="leading-none" style={{ fontSize: 9 * fontScale }}>{faction.symbol}</span>
          </div>
          <div className="absolute bottom-1 right-1.5 flex flex-col items-center leading-none rotate-180">
            <span className="font-black leading-none" style={{ color: faction.fg, fontSize: 9 * fontScale }}>{card.value}</span>
            <span className="leading-none" style={{ fontSize: 9 * fontScale }}>{faction.symbol}</span>
          </div>
        </>
      )}
      {isZero && (
        <>
          <div className="absolute top-1 left-1.5">
            <span className="font-black" style={{ color: faction.accent, fontSize: 8 * fontScale }}>★</span>
          </div>
          <div className="absolute top-1 right-1.5">
            <span className="font-black" style={{ color: faction.accent, fontSize: 8 * fontScale }}>★</span>
          </div>
        </>
      )}

      {/* Center value */}
      {isZero ? (
        <div className="text-center z-10 flex flex-col items-center gap-0.5">
          <div style={{ fontSize: 18 * fontScale }}>★</div>
          <div className="font-black tracking-widest" style={{ color: faction.accent, letterSpacing: '0.15em', fontSize: 13 * fontScale }}>WILD</div>
          <div style={{ fontSize: 18 * fontScale }}>★</div>
        </div>
      ) : (
        <div className="text-center z-10 flex flex-col items-center">
          <div className="font-black" style={{ color: faction.fg, fontSize: 30 * fontScale }}>{card.value}</div>
        </div>
      )}

      {/* Faction watermark */}
      {!isZero && (
        <div className="absolute bottom-5 left-0 right-0 text-center pointer-events-none" style={{ opacity: 0.18, fontSize: 13 * fontScale }}>
          {faction.symbol}
        </div>
      )}
    </motion.div>
  );
}

export default function SolitaireDeck({ deckCount, flippedCard, onFlip, onDiscard, onCardDrag, onCardDragEnd, showDeckCount, isMobile }) {
  const { CARD_W, CARD_H } = getCardSize(isMobile);
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
            isMobile={isMobile}
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
                isDraggable
                isMobile={isMobile}
                onDrag={onCardDrag}
                onDragEnd={onCardDragEnd}
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