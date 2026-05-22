import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const rowColors = ['#B833FF', '#FF3399', '#FFD700', '#00D4FF'];
const rowNames = ['Row 1', 'Row 2', 'Row 3', 'Row 4'];

export default function RowCompleteToast({ completedRow, onDone }) {
  // Auto-dismiss after 2.5s
  useEffect(() => {
    if (completedRow === null) return;
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [completedRow]);

  const color = completedRow !== null ? rowColors[completedRow] : '#fff';
  const name = completedRow !== null ? rowNames[completedRow] : '';

  return (
    <AnimatePresence>
      {completedRow !== null && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ type: 'spring', bounce: 0.4, duration: 0.5 }}
          className="fixed top-16 left-1/2 z-50 pointer-events-none"
          style={{ transform: 'translateX(-50%)' }}
        >
          <div
            className="flex flex-col items-center px-7 py-4 rounded-2xl shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${color}33 0%, ${color}18 100%)`,
              border: `2px solid ${color}`,
              backdropFilter: 'blur(12px)',
              boxShadow: `0 8px 40px ${color}55`,
            }}
          >
            <div className="text-3xl mb-1">🎉</div>
            <div className="font-black text-lg text-white tracking-wide">{name} — COMPLETE!</div>
            <div className="text-sm mt-1" style={{ color }}>
              Keep going, finish the deck!
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}