import React, { createContext, useContext, useState } from 'react';

export const CARD_THEMES = {
  original: {
    id: 'original',
    label: 'Original',
    emoji: '🃏',
    cardBg: '#ffffff',
    cardBgSelected: '#fefce8',
    cardBorder: '#cbd5e1',
    cardBorderSelected: '#facc15',
    textColor: '#000000',
    subTextColor: 'rgba(0,0,0,0.6)',
    zeroBg: 'rgba(253,224,71,0.2)',
    selectedGlow: '0 0 20px rgba(250,204,21,0.7), 0 8px 24px rgba(0,0,0,0.4)',
    selectedOutline: '3px solid #facc15',
    innerBorderColor: '#cbd5e1',
    tickColor: '#94a3b8',
  },
  neon: {
    id: 'neon',
    label: 'Neon',
    emoji: '⚡',
    cardBg: '#0a0a1a',
    cardBgSelected: '#0d0d2e',
    cardBorder: '#7c3aed',
    cardBorderSelected: '#00ffcc',
    textColor: '#00ffcc',
    subTextColor: '#a78bfa',
    zeroBg: 'rgba(0,255,204,0.08)',
    selectedGlow: '0 0 25px rgba(0,255,204,0.8), 0 0 50px rgba(0,255,204,0.3)',
    selectedOutline: '3px solid #00ffcc',
    innerBorderColor: '#4c1d95',
    tickColor: '#7c3aed',
  },
  'old-school': {
    id: 'old-school',
    label: 'Old-School',
    emoji: '♠️',
    cardBg: '#f8fafc',
    cardBgSelected: '#f1f5f9',
    cardBorder: '#e2e8f0',
    cardBorderSelected: '#64748b',
    textColor: '#1e293b',
    subTextColor: '#64748b',
    zeroBg: 'rgba(100,116,139,0.08)',
    selectedGlow: '0 4px 20px rgba(0,0,0,0.15)',
    selectedOutline: '2px solid #64748b',
    innerBorderColor: 'transparent',
    tickColor: 'transparent',
  },
};

const ThemeContext = createContext({ theme: CARD_THEMES.original, setThemeId: () => {} });

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    const saved = localStorage.getItem('cardTheme');
    return (saved && CARD_THEMES[saved]) ? saved : 'original';
  });

  const setTheme = (id) => {
    setThemeId(id);
    localStorage.setItem('cardTheme', id);
  };

  return (
    <ThemeContext.Provider value={{ theme: CARD_THEMES[themeId] || CARD_THEMES.original, setThemeId: setTheme, themeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useCardTheme() {
  return useContext(ThemeContext);
}