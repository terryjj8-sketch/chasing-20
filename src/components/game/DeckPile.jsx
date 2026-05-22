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

export default function DeckPile({ deckCount, onFlip, flippedCard, onPlay, onDiscard, canPlay, isPaused, showDeckCount, onCardTap }) {
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
            style={{ width: 100, height: 148 }}
          >
            {/* Stack shadow cards */}
            {deckCount > 2 && (
              <div className="absolute rounded-lg" style={{
                width: 100, height: 148,
                top: -6, left: 6,
                background: '#1a5f7a',
                border: '3px solid rgba(255,255,255,0.3)',
              }} />
            )}
            {deckCount > 1 && (
              <div className="absolute rounded-lg" style={{
                width: 100, height: 148,
                top: -3, left: 3,
                background: '#1a5f7a',
                border: '3px solid rgba(255,255,255,0.3)',
              }} />
            )}

            {/* Top card */}
            {deckCount > 0 ? (
              <div
                className="absolute rounded-lg flex items-center justify-center overflow-hidden relative"
                style={{
                  width: 100, height: 148,
                  background: '#1a5f7a',
                  border: '3px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}
              >
                {/* Card back with badges and design */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-0 pointer-events-none p-2">
                  {/* Top badges */}
                  <div className="flex gap-1 mb-1">
                    <div style={{ width: 16, height: 16, background: '#ff5722', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="text-white text-[9px] font-bold">5</div>
                    <div style={{ width: 16, height: 16, background: '#0084d1', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="text-white text-[9px] font-bold">9</div>
                    <div style={{ width: 16, height: 16, background: '#52b54d', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="text-white text-[9px] font-bold">12</div>
                    <div style={{ width: 16, height: 16, background: '#ff5722', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="text-white text-[9px] font-bold">4</div>
                  </div>
                  
                  {/* Main title */}
                  <div className="text-center leading-tight">
                    <div className="text-yellow-50 text-[11px] font-black tracking-wider">CHASING</div>
                    <div className="text-yellow-400 text-[24px] font-black leading-none">20</div>
                  </div>
                  
                  {/* Middle badges */}
                  <div className="flex gap-1 mt-1 mb-1">
                    <div style={{ width: 16, height: 16, background: '#52b54d', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="text-white text-[9px] font-bold">6</div>
                    <div style={{ width: 20, height: 20, background: '#ffc107', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="text-white text-[12px] font-black">20</div>
                    <div style={{ width: 16, height: 16, background: '#0084d1', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="text-white text-[9px] font-bold">8</div>
                  </div>
                  
                  {/* Subtitle */}
                  <div className="text-center text-[7px] leading-tight">
                    <div className="text-red-400 font-bold">A NEW TWIST</div>
                    <div className="text-red-400 font-bold">ON SOLITAIRE</div>
                  </div>
                  
                  {/* Bottom text */}
                  <div className="text-yellow-50 text-[6px] font-bold mt-1">GET A ROW TO 20 TO WIN</div>
                  
                  {/* Bottom badges */}
                  <div className="flex gap-1 mt-1">
                    <div style={{ width: 16, height: 16, background: '#ff5722', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="text-white text-[8px] font-bold">15</div>
                    <div style={{ width: 16, height: 16, background: '#0084d1', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="text-white text-[9px] font-bold">1</div>
                    <div style={{ width: 16, height: 16, background: '#52b54d', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="text-white text-[8px] font-bold">17</div>
                  </div>
                  <div className="text-yellow-600 text-[5px] font-bold mt-0.5">A ZYGO GAME</div>
                </div>
              </div>
            ) : (
              <div className="absolute rounded-lg flex items-center justify-center" style={{
                width: 100, height: 148,
                border: '3px dashed rgba(255,255,255,0.2)',
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
                onClick={onCardTap}
                whileTap={onCardTap ? { scale: 0.95 } : {}}
                className="rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden"
                style={{
                  width: 100, height: 148,
                  background: '#ffffff',
                  border: onCardTap ? '2px solid #10B981' : '2px solid #e2e8f0',
                  cursor: onCardTap ? 'pointer' : 'default',
                  boxShadow: onCardTap ? '0 0 12px rgba(16,185,129,0.5)' : undefined,
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

      {/* Discard Button */}
      <AnimatePresence>
        {flippedCard && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.08 }}
            onClick={onDiscard}
            className="px-8 py-3 rounded-xl text-lg font-bold text-white shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)',
              boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)',
            }}
          >
            ✕ Discard
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}