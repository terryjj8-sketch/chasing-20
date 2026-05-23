import React from 'react';
import { motion } from 'framer-motion';
import { CARD_THEMES, useCardTheme } from '@/lib/ThemeContext';

export default function ThemeSelector() {
  const { themeId, setThemeId } = useCardTheme();

  return (
    <div className="flex items-center gap-1.5">
      {Object.values(CARD_THEMES).map(t => (
        <motion.button
          key={t.id}
          onClick={() => setThemeId(t.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={t.label}
          className="p-1.5 rounded-lg text-xs font-bold transition-all border"
          style={{
            background: themeId === t.id ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.06)',
            borderColor: themeId === t.id ? 'rgba(168,85,247,0.8)' : 'rgba(255,255,255,0.15)',
            color: themeId === t.id ? '#e9d5ff' : 'rgba(255,255,255,0.5)',
          }}
        >
          {t.emoji}
        </motion.button>
      ))}
    </div>
  );
}