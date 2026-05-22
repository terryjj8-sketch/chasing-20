import React from 'react';
import { motion } from 'framer-motion';

// A small playing card face used in the solitaire layout
export default function SolitaireCard({ value, width = 52, height = 72, animate = false, isNew = false, dimmed = false, glowing = false, glowColor = '#10B981' }) {
  const isZero = value === 0;

  const inner = (
    <div
      className="rounded-md flex items-center justify-center relative overflow-hidden select-none"
      style={{
        width,
        height,
        background: '#fff',
        border: glowing ? `2px solid ${glowColor}` : '1.5px solid #cbd5e1',
        boxShadow: glowing
          ? `0 0 10px ${glowColor}88, 0 2px 6px rgba(0,0,0,0.3)`
          : '0 2px 6px rgba(0,0,0,0.25)',
        opacity: dimmed ? 0.4 : 1,
        flexShrink: 0,
      }}
    >
      {/* Inner border */}
      <div className="absolute rounded-sm pointer-events-none"
        style={{ inset: 3, border: '1px solid #e2e8f0' }} />

      {/* Corner value - top left */}
      <div className="absolute top-1 left-1.5 text-black font-black leading-none"
        style={{ fontSize: width < 44 ? 9 : 11 }}>
        {isZero ? '0' : value}
      </div>
      {/* Corner value - bottom right (rotated) */}
      <div className="absolute bottom-1 right-1.5 text-black font-black leading-none rotate-180"
        style={{ fontSize: width < 44 ? 9 : 11 }}>
        {isZero ? '0' : value}
      </div>

      {/* Center */}
      <div className="text-center z-10">
        <div className="text-black font-black" style={{ fontSize: width < 44 ? 16 : 22 }}>
          {isZero ? '0' : value}
        </div>
        {isZero && (
          <div className="text-black/50 font-bold" style={{ fontSize: 7, marginTop: -2 }}>RESET</div>
        )}
      </div>
    </div>
  );

  if (animate || isNew) {
    return (
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: -10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.4, duration: 0.35 }}
      >
        {inner}
      </motion.div>
    );
  }

  return inner;
}