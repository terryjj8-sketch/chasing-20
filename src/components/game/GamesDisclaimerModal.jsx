import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GamesDisclaimerModal({ onAccept }) {
  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 18 }}
          style={{
            background: 'linear-gradient(160deg, #1e1b4b 0%, #0f172a 100%)',
            border: '2px solid rgba(251,191,36,0.4)',
            borderRadius: 24, padding: 28, maxWidth: 420, width: '100%',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>⚖️</div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#fbbf24' }}>
              Games Edition — Disclaimer
            </h2>
          </div>

          {/* Body */}
          <div style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: 14,
            padding: '16px 18px', marginBottom: 20, lineHeight: 1.7,
          }}>
            <p style={{ margin: '0 0 12px', color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
              🎮 The game titles featured in this edition are the property of their respective owners.
            </p>
            <p style={{ margin: '0 0 12px', color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
              I do <strong style={{ color: '#fbbf24' }}>not</strong> hold any trademark authorization
              or rights to any of the games listed. All brand names, logos, and game titles
              belong to their respective rights holders.
            </p>
            <p style={{ margin: '0 0 12px', color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
              💸 This is <strong style={{ color: '#fbbf24' }}>not for profit</strong>. No commercial
              gain is made from the use of these titles.
            </p>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
              🎉 This is purely for <strong style={{ color: '#fbbf24' }}>entertainment purposes</strong> only.
            </p>
          </div>

          {/* Accept button */}
          <motion.button
            onClick={onAccept}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              width: '100%', background: 'linear-gradient(135deg,#f59e0b,#ef4444)',
              color: '#fff', border: 'none', borderRadius: 99, padding: '13px 0',
              fontSize: 16, fontWeight: 900, cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(239,68,68,0.45)',
            }}
          >
            I Understand — Let's Play! 🎮
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}