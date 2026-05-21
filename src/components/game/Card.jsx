import React from 'react';
import { motion } from 'framer-motion';

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

      <div className="relative z-10 text-center">
        <div className="text-black text-xl font-bold">
          {isZero ? '0' : value}
        </div>
        {isZero && (
          <div className="text-black/70 text-xs font-semibold mt-1">RESET</div>
        )}
      </div>
    </motion.div>
  );
}