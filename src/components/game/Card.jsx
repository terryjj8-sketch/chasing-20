import React from 'react';
import { motion } from 'framer-motion';

const rowColors = [
  'hsl(var(--row-1))',
  'hsl(var(--row-2))',
  'hsl(var(--row-3))',
  'hsl(var(--row-4))',
];

export default function Card({ value, rowIndex = 0, isSelected = false, size = 'normal' }) {
  const isZero = value === 0;
  const sizeClasses = {
    small: 'w-16 h-24',
    normal: 'w-20 h-32',
    large: 'w-32 h-48',
  };

  const bgColor = isZero ? 'from-purple-500 to-pink-500' : `from-blue-500 to-blue-600`;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`${sizeClasses[size]} rounded-lg shadow-lg cursor-pointer flex items-center justify-center relative overflow-hidden`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-90`}
      />
      
      {isZero && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
        />
      )}

      <div className="absolute inset-1 rounded-md border-2 border-white/30" />

      <div className="relative z-10 text-center">
        <div className="text-white text-xl font-bold drop-shadow-lg">
          {isZero ? '0' : value}
        </div>
        {isZero && (
          <div className="text-white/80 text-xs font-semibold mt-1">RESET</div>
        )}
      </div>
    </motion.div>
  );
}