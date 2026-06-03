import React, { useEffect, useState } from 'react'; import { motion } from 'framer-motion'; import { Trophy, X, Clock } from 'lucide-react'; import { formatTime } from './GameTimer'; const LEADERBOARD_KEY = 'chasing20_leaderboard'; const DIFFICULTIES = ['easy', 'medium', 'hard']; const DIFF_LABELS = { easy: 'Beginner', medium: 'Novice', hard: 'Pro' }; const DIFF_COLORS = { easy: '#10b981', medium: '#f59e0b', hard: '#ec4899' }; // Read all leaderboard entries from localStorage function getLeaderboard() { try { return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]'); } catch { return []; } } export default function Leaderboard({ onClose }) { const [tab, setTab] = useState('easy'); const [entries, setEntries] = useState([]); useEffect(() => { const all = getLeaderboard(); const filtered = all .filter(e => e.difficulty === tab && e.wins > 0) .sort((a, b) => { if (b.wins !== a.wins) return b.wins - a.wins; return (a.best_time || Infinity) - (b.best_time || Infinity); }); setEntries(filtered); }, [tab]); const winPct = (e) => e.total_games > 0 ? Math.round((e.wins / e.total_games) * 100) : 0; return ( 
e.stopPropagation()} > {/* Header */} 
Leaderboard
(this device) 
{/* Tabs */} 
{DIFFICULTIES.map(d => ( setTab(d)} className="flex-1 py-2.5 text-sm font-bold transition-all" style={{ color: tab === d ? DIFF_COLORS[d] : 'rgba(255,255,255,0.4)', borderBottom: tab === d ? `2px solid ${DIFF_COLORS[d]}` : '2px solid transparent', background: 'transparent', }} > {DIFF_LABELS[d]} ))} 
{/* Table */} 
{entries.length === 0 ? ( 
No wins recorded yet. Be the first! 
) : ( 
#	Player	Best 	Win %
{entries.map((e, i) => ( 
{i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1} 	{e.player_name} 	{e.best_time ? formatTime(e.best_time) : '—'} 	= 50 ? '#4ade80' : '#f87171', }} > {winPct(e)}% ({e.wins}/{e.total_games}) 
))} 
)} 
); } 
import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Clock, Target } from 'lucide-react';
import { formatTime } from './GameTimer';

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const DIFF_LABELS = { easy: 'Beginner', medium: 'Novice', hard: 'Pro' };
const DIFF_COLORS = { easy: '#10b981', medium: '#f59e0b', hard: '#ec4899' };

const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

export default function Leaderboard({ onClose }) {
  const [tab, setTab] = useState('easy');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    base44.entities.LeaderboardEntry.filter({ difficulty: tab }, 'best_time', 20)
      .then(data => {
        // Sort: wins desc, then best_time asc
        const sorted = [...data]
          .filter(e => e.wins > 0)
          .sort((a, b) => {
            if (b.wins !== a.wins) return b.wins - a.wins;
            return (a.best_time || Infinity) - (b.best_time || Infinity);
          });
        setEntries(sorted);
      })
      .finally(() => setLoading(false));
  }, [tab]);

  const winPct = (e) => e.total_games > 0 ? Math.round((e.wins / e.total_games) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="bg-gray-900 border border-white/20 rounded-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h2 className="font-black text-lg text-white">Global Leaderboard</h2>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              onClick={() => setTab(d)}
              className="flex-1 py-2.5 text-sm font-bold transition-all"
              style={{
                color: tab === d ? DIFF_COLORS[d] : 'rgba(255,255,255,0.4)',
                borderBottom: tab === d ? `2px solid ${DIFF_COLORS[d]}` : '2px solid transparent',
                background: 'transparent',
              }}
            >
              {DIFF_LABELS[d]}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-y-auto max-h-80">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-10 text-white/40 text-sm">No wins recorded yet. Be the first!</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 text-xs uppercase">
                  <th className="text-left px-5 py-2">#</th>
                  <th className="text-left px-2 py-2">Player</th>
                  <th className="text-right px-2 py-2 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" /> Best
                  </th>
                  <th className="text-right px-5 py-2">Win %</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={e.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 font-black" style={{ color: medalColors[i] || 'rgba(255,255,255,0.5)' }}>
                      {i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}
                    </td>
                    <td className="px-2 py-3 text-white font-semibold truncate max-w-[120px]">{e.player_name}</td>
                    <td className="px-2 py-3 text-right font-mono text-white/80">
                      {e.best_time ? formatTime(e.best_time) : '—'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="font-bold" style={{ color: winPct(e) >= 50 ? '#4ade80' : '#f87171' }}>
                        {winPct(e)}%
                      </span>
                      <span className="text-white/30 text-xs ml-1">({e.wins}/{e.total_games})</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
