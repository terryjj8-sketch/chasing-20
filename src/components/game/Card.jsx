import React from 'react';
import { motion } from 'framer-motion';

function TickRing({ cx = 10, cy = 10, r = 7, ticks = 20 }) {
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
            stroke="#94a3b8"
            strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

export default function Card({ value, rowIndex = 0, isSelected = false, size = 'normal' }) {
  const isZero = value === 0;
  const sizeClasses = {
    small: 'w-16 h-24',
    normal: 'w-20 h-32',
    large: 'w-32 h-48',
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`${sizeClasses[size]} rounded-lg shadow-lg cursor-pointer flex items-center justify-center relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-white" />
      
      {isZero && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-yellow-100/30"
        />
      )}

      <div className="absolute inset-1 rounded-md border-2 border-slate-300" />

      {/* Corner tick rings */}
      <div className="absolute top-1 left-1"><TickRing /></div>
      <div className="absolute top-1 right-1"><TickRing /></div>
      <div className="absolute bottom-1 left-1"><TickRing /></div>
      <div className="absolute bottom-1 right-1"><TickRing /></div>

      <div className="relative z-10 text-center">
        <div className="text-black text-4xl font-black">
          {isZero ? '0' : value}
        </div>
        {isZero && (
          <div className="text-black/70 text-sm font-semibold mt-2">RESET</div>
        )}
      </div>
    </motion.div>
  );
}