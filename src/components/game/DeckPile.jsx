import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function TickRing({ size = 16, cx = 8, cy = 8, r = 5, ticks = 20 }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {Array.from({ length: ticks }).map((_, i) => {
        const angle = (i / ticks) * 2 * Math.PI - Math.PI / 2;
        const inner = r - 1.5;
        const x1 = cx + inner * Math.cos(angle);
        const y1 = cy + inner * Math.sin(angle);
        const x2 = cx + r * Math.cos(angle);
        const y2 = cy + r * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={i % 5 === 0 ? 1 : 0.6}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

export default function DeckPile({ deckCount, onFlip, flippedCard, onPlay, onDiscard, canPlay, isPaused, showDeckCount }) {
  const handleTap = () => {
    if (deckCount === 0 || flippedCard || isPaused) return;
    onFlip();
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
                background: '#1a5f7a',
                border: '2px solid rgba(255,255,255,0.3)',
              }} />
            )}
            {deckCount > 1 && (
              <div className="absolute rounded-lg" style={{
                width: 80, height: 120,
                top: -2, left: 2,
                background: '#1a5f7a',
                border: '2px solid rgba(255,255,255,0.3)',
              }} />
            )}

            {/* Top card */}
            {deckCount > 0 ? (
              <div
                className="absolute rounded-lg flex items-center justify-center overflow-hidden relative"
                style={{
                  width: 80, height: 120,
                  background: '#1a5f7a',
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}
              >
                {/* Card back branding */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-0 pointer-events-none">
                  <div className="text-center">
                    <div className="text-amber-50 text-[6px] font-black uppercase tracking-widest leading-tight">Chasing</div>
                    <div className="text-yellow-400 text-[16px] font-black leading-none">20</div>
                  </div>
                  <div className="text-amber-50 text-[5px] font-bold uppercase tracking-wider mt-1 leading-tight">A New Twist</div>
                </div>
                <div className="absolute bottom-1.5 right-1.5 text-white/20 text-[9px] font-bold">{deckCount}</div>
              </div>
            ) : (
              <div className="absolute rounded-lg flex items-center justify-center" style={{
                width: 80, height: 120,
                border: '2px dashed rgba(255,255,255,0.2)',
              }}>
                <span className="text-foreground/30 text-xs text-center">Empty</span>
              </div>
            )}
          </motion.div>

          {showDeckCount && <span className="text-xs text-foreground/40 font-medium">{deckCount} left</span>}
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
                className="rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden"
                style={{
                  width: 100, height: 148,
                  background: '#ffffff',
                  border: '2px solid #e2e8f0',
                }}
              >
                <div className="absolute inset-1 rounded-md border-2 border-slate-300" />
                
                {/* Corner tick rings */}
                <div className="absolute top-1 left-1 pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const angle = (i / 20) * 2 * Math.PI - Math.PI / 2;
                      const inner = 5;
                      const x1 = 10 + (inner - 2) * Math.cos(angle);
                      const y1 = 10 + (inner - 2) * Math.sin(angle);
                      const x2 = 10 + 5 * Math.cos(angle);
                      const y2 = 10 + 5 * Math.sin(angle);
                      return (
                        <line
                          key={i}
                          x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke="#94a3b8"
                          strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </svg>
                </div>
                <div className="absolute top-1 right-1 pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const angle = (i / 20) * 2 * Math.PI - Math.PI / 2;
                      const inner = 5;
                      const x1 = 10 + (inner - 2) * Math.cos(angle);
                      const y1 = 10 + (inner - 2) * Math.sin(angle);
                      const x2 = 10 + 5 * Math.cos(angle);
                      const y2 = 10 + 5 * Math.sin(angle);
                      return (
                        <line
                          key={i}
                          x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke="#94a3b8"
                          strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </svg>
                </div>
                <div className="absolute bottom-1 left-1 pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const angle = (i / 20) * 2 * Math.PI - Math.PI / 2;
                      const inner = 5;
                      const x1 = 10 + (inner - 2) * Math.cos(angle);
                      const y1 = 10 + (inner - 2) * Math.sin(angle);
                      const x2 = 10 + 5 * Math.cos(angle);
                      const y2 = 10 + 5 * Math.sin(angle);
                      return (
                        <line
                          key={i}
                          x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke="#94a3b8"
                          strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </svg>
                </div>
                <div className="absolute bottom-1 right-1 pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const angle = (i / 20) * 2 * Math.PI - Math.PI / 2;
                      const inner = 5;
                      const x1 = 10 + (inner - 2) * Math.cos(angle);
                      const y1 = 10 + (inner - 2) * Math.sin(angle);
                      const x2 = 10 + 5 * Math.cos(angle);
                      const y2 = 10 + 5 * Math.sin(angle);
                      return (
                        <line
                          key={i}
                          x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke="#94a3b8"
                          strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </svg>
                </div>

                <div className="relative z-10 text-center">
                  <div className="text-black text-4xl font-black">
                    {flippedCard.value === 0 ? '0' : flippedCard.value}
                  </div>
                  {flippedCard.value === 0 && (
                    <div className="text-black/70 text-xs font-semibold mt-1">RESET</div>
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
              onClick={onPlay}
              disabled={!canPlay}
              className="px-6 py-2 rounded-lg text-sm font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: canPlay ? '#10B981' : '#6B7280',
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