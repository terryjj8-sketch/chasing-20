import React from 'react';
import { motion } from 'framer-motion';

// Custom factions — 0 & 1 are dark, 2 & 3 are red
// Each has a unique symbol instead of traditional suits
export const FACTIONS = [
  { symbol: '⚡', label: 'Storm',  isDark: true,  bg: '#1a1a2e', fg: '#e2e8f0', accent: '#60a5fa' }, // dark blue
  { symbol: '🌑', label: 'Void',   isDark: true,  bg: '#0f1a0f', fg: '#d1fae5', accent: '#4ade80' }, // dark green
  { symbol: '🔥', label: 'Blaze',  isDark: false, bg: '#fff0f0', fg: '#991b1b', accent: '#ef4444' }, // light red
  { symbol: '🌸', label: 'Dawn',   isDark: false, bg: '#fff5f8', fg: '#9d174d', accent: '#f472b6' }, // light pink
];

export default function SolitaireCard({ value, suit, width = 52, height = 72, animate = false, isNew = false, cardIndex }) {
  const isZero = value === 0;
  const faction = FACTIONS[suit ?? 0];

  const inner = (
    <div
      className="rounded-lg flex items-center justify-center relative overflow-hidden select-none"
      style={{
        width,
        height,
        background: faction.bg,
        border: `2px solid ${faction.accent}55`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
        flexShrink: 0,
      }}
    >
      {/* Inner border */}
      <div
        className="absolute rounded-sm pointer-events-none"
        style={{ inset: 3, border: `1px solid ${faction.accent}33` }}
      />

      {/* Corner pips */}
      <div className="absolute top-1 left-1.5 flex flex-col items-center leading-none">
        <span className="font-black leading-none" style={{ fontSize: width < 60 ? 8 : 9, color: faction.accent }}>
          {isZero ? '★' : value}
        </span>
        {!isZero && <span className="leading-none" style={{ fontSize: width < 60 ? 8 : 10 }}>{faction.symbol}</span>}
      </div>
      <div className="absolute bottom-1 right-1.5 flex flex-col items-center leading-none rotate-180">
        <span className="font-black leading-none" style={{ fontSize: width < 60 ? 8 : 9, color: faction.accent }}>
          {isZero ? '★' : value}
        </span>
        {!isZero && <span className="leading-none" style={{ fontSize: width < 60 ? 8 : 10 }}>{faction.symbol}</span>}
      </div>

      {/* Center */}
      {isZero ? (
        <div className="text-center z-10 flex flex-col items-center gap-0.5">
          <div style={{ fontSize: width < 60 ? 14 : 18 }}>★</div>
          <div className="font-black tracking-widest" style={{ fontSize: width < 60 ? 10 : 13, color: faction.accent, letterSpacing: '0.15em' }}>
            WILD
          </div>
          <div style={{ fontSize: width < 60 ? 14 : 18 }}>★</div>
        </div>
      ) : (
        <div className="text-center z-10 flex flex-col items-center">
          <div
            className="font-black"
            style={{ fontSize: width < 56 ? 18 : width < 70 ? 22 : 32, color: faction.fg }}
          >
            {value}
          </div>
        </div>
      )}

      {/* Faction watermark in center-bottom */}
      {!isZero && (
        <div
          className="absolute bottom-5 left-0 right-0 text-center pointer-events-none"
          style={{ fontSize: width < 60 ? 10 : 13, opacity: 0.18 }}
        >
          {faction.symbol}
        </div>
      )}
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