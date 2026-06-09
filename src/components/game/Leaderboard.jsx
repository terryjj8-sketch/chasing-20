import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, X, Clock } from 'lucide-react';
import { formatTime } from './GameTimer';

const LEADERBOARD_KEY = 'chasing20_leaderboard';
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const DIFF_LABELS = { easy: 'Beginner', medium: 'Novice', hard: 'Pro' };
const DIFF_COLORS = { easy: '#10b981', medium: '#f59e0b', hard: '#ec4899' };

function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
  } catch {
    return [];
  }
}

export default function Leaderboard({ onClose }) {
  const [tab, setTab] = useState('easy');
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const all = getLeaderboard();
    const filtered = all
      .filter(e => e.difficulty === tab && e.wins > 0)
      .sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        return (a.best_time || Infinity) - (b.best_time || Infinity);
      });
    setEntries(filtered);
  }, [tab]);

  const winPct = (e) => e.total_games > 0
    ? Math.round((e.wins / e.total_games) * 100)
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="relative bg-gray-900 border border-white/20 rounded-2xl p-5 mx-4 w-full max-w-sm text-white"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="font-black text-base">Leaderboard</div>
              <div className="text-[10px] text-white/40">(this device)</div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-1 mb-4">
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              onClick={() => setTab(d)}
              className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: tab === d ? DIFF_COLORS[d] + '33' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${tab === d ? DIFF_COLORS[d] : 'transparent'}`,
                color: tab === d ? DIFF_COLORS[d] : 'rgba(255,255,255,0.4)',
              }}
            >
              {DIFF_LABELS[d]}
            </button>
          ))}
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-8 text-white/30 text-sm">
            No wins recorded yet.<br />Keep playing!
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {entries.map((e, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{
                    background: i === 0 ? '#facc15' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : 'rgba(255,255,255,0.1)',
                    color: i < 3 ? '#1e1b4b' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{e.name || 'Player'}</div>
                  <div className="text-[10px] text-white/40">
                    {e.wins}W / {e.total_games}G · {winPct(e)}% win rate
                  </div>
                </div>
                {e.best_time && (
                  <div className="flex items-center gap-1 text-xs text-white/50 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatTime(e.best_time)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
