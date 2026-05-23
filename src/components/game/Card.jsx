import React from 'react';
import { motion } from 'framer-motion';
import { useCardTheme } from '@/lib/ThemeContext';

// suits are stored as numbers 0-3 in deckUtils
const SUIT_SYMBOLS = [
  { symbol: '♠', color: '#1e293b' }, // 0 spades
  { symbol: '♥', color: '#e11d48' }, // 1 hearts
  { symbol: '♦', color: '#e11d48' }, // 2 diamonds
  { symbol: '♣', color: '#1e293b' }, // 3 clubs
];

function TickRing({ cx = 10, cy = 10, r = 7, ticks = 20, color = '#94a3b8' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      {Array.from({ length: ticks }).map((_, i) => {
        const angle = (i / ticks) * 2 * Math.PI - Math.PI / 2;
        const inner = r - 2;
        const x1 = cx + inner * Math.cos(angle);
        const y1 = cy + inner * Math.sin(angle);
        const x2 = cx + r * Math.cos(angle);
        const y2 = cy + r * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color}
            strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

export default function Card({ value, suit, rowIndex = 0, isSelected = false, size = 'normal' }) {
  const { theme } = useCardTheme();
  const isZero = value === 0;
  const isOldSchool = theme.id === 'old-school';
  const suitInfo = (suit !== undefined && suit !== null) ? SUIT_SYMBOLS[suit] : null;
  const resolvedTextColor = isOldSchool && !isZero && suitInfo ? suitInfo.color : theme.textColor;

  const sizeClasses = {
    small: 'w-16 h-24',
    normal: 'w-20 h-32',
    large: 'w-32 h-48',
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      animate={isSelected ? { y: -8 } : { y: 0 }}
      className={`${sizeClasses[size]} rounded-lg shadow-lg cursor-pointer flex items-center justify-center relative overflow-hidden`}
      style={{
        outline: isSelected ? theme.selectedOutline : undefined,
        outlineOffset: isSelected ? '2px' : undefined,
        boxShadow: isSelected ? theme.selectedGlow : '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      <div className="absolute inset-0" style={{ background: isSelected ? theme.cardBgSelected : theme.cardBg }} />

      {isZero && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0"
          style={{ background: theme.zeroBg }}
        />
      )}

      <div
        className="absolute inset-1 rounded-md border-2"
        style={{ borderColor: isSelected ? theme.cardBorderSelected : theme.innerBorderColor }}
      />

      {/* Corner tick rings (non-old-school themes) */}
      {theme.tickColor !== 'transparent' && (
        <>
          <div className="absolute top-1 left-1"><TickRing color={theme.tickColor} /></div>
          <div className="absolute top-1 right-1"><TickRing color={theme.tickColor} /></div>
          <div className="absolute bottom-1 left-1"><TickRing color={theme.tickColor} /></div>
          <div className="absolute bottom-1 right-1"><TickRing color={theme.tickColor} /></div>
        </>
      )}

      {/* Old-School: corner suit + number pips */}
      {isOldSchool && !isZero && suitInfo && (
        <>
          <div className="absolute top-1 left-1.5 flex flex-col items-center leading-none">
            <span className="text-xs font-black" style={{ color: suitInfo.color }}>{value}</span>
            <span className="text-xs" style={{ color: suitInfo.color }}>{suitInfo.symbol}</span>
          </div>
          <div className="absolute bottom-1 right-1.5 flex flex-col items-center leading-none rotate-180">
            <span className="text-xs font-black" style={{ color: suitInfo.color }}>{value}</span>
            <span className="text-xs" style={{ color: suitInfo.color }}>{suitInfo.symbol}</span>
          </div>
        </>
      )}

      <div className="relative z-10 text-center">
        <div className="text-4xl font-black" style={{ color: resolvedTextColor }}>
          {isZero ? '0' : value}
        </div>
        {isOldSchool && !isZero && suitInfo && (
          <div className="text-lg mt-0.5" style={{ color: suitInfo.color }}>{suitInfo.symbol}</div>
        )}
        {isZero && (
          <div className="text-sm font-semibold mt-2" style={{ color: theme.subTextColor }}>RESET</div>
        )}
      </div>
    </motion.div>
  );
}