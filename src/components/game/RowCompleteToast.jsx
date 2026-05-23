import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const rowColors = ['#B833FF', '#FF3399', '#FFD700', '#00D4FF'];
const rowNames = ['Row 1', 'Row 2', 'Row 3', 'Row 4'];
const encouragements = [
  "You hit 20 — now keep going!",
  "20 cards! Don't stop now!",
  "Row complete! Chase the rest!",
  "You're on fire! Keep it up!",
];

export default function RowCompleteToast({ completedRow, onDone }) {
  useEffect(() => {
    if (completedRow === null) return;
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [completedRow]);

  const color = completedRow !== null ? rowColors[completedRow] : '#fff';
  const name = completedRow !== null ? rowNames[completedRow] : '';
  const message = completedRow !== null ? encouragements[completedRow % encouragements.length] : '';

  return (
    <AnimatePresence>
      {completedRow !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: -40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -30 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.55 }}
          className="fixed top-20 left-1/2 z-50 pointer-events-none"
          style={{ transform: 'translateX(-50%)' }}
        >
          <div
            className="flex flex-col items-center px-8 py-5 rounded-2xl shadow-2xl text-center"
            style={{
              background: `linear-gradient(135deg, #0f2d1a 0%, #081a0e 100%)`,
              border: `2.5px solid ${color}`,
              backdropFilter: 'blur(16px)',
              boxShadow: `0 0 60px ${color}66, 0 8px 40px rgba(0,0,0,0.6)`,
              minWidth: 260,
            }}
          >
            <motion.div
              animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1.1, 1.2, 1] }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="text-4xl mb-2"
            >
              🎉
            </motion.div>
            <div
              className="font-black text-2xl tracking-wide mb-1"
              style={{ color }}
            >
              {name} — 20!
            </div>
            <div className="text-sm font-semibold text-white/80 leading-snug">
              {message}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}