import React from 'react';
import { motion } from 'framer-motion';

const monthColors = {
  january: '#60a5fa', february: '#f472b6', march: '#4ade80', april: '#facc15',
  may: '#fb7185', june: '#fbbf24', july: '#ef4444', august: '#a78bfa',
  september: '#f97316', october: '#fb923c', november: '#d97706', december: '#22c55e',
};

const dayColors = {
  sun: '#ef4444', mon: '#3b82f6', tue: '#10b981', wed: '#f59e0b',
  thu: '#8b5cf6', fri: '#ec4899', sat: '#06b6d4',
};

export default function CalendarCard({ card, width = 62, height = 88, animate = false, isNew = false }) {
  const isHoliday = card.isHoliday;
  const isMonthCard = card.type === 'month';
  const isDayCard = card.type === 'day';
  const scale = width / 62;

  const accent = isHoliday
    ? '#f59e0b'
    : isMonthCard
    ? (monthColors[card.monthId] || '#8b5cf6')
    : (dayColors[card.dayId] || '#0ea5e9');

  const inner = (
    <div style={{
      position: 'relative',
      width, height,
      borderRadius: width * 0.13,
      background: '#fff',
      boxShadow: isHoliday
        ? '0 3px 12px ' + accent + '55, 0 1px 4px rgba(0,0,0,0.1)'
        : '0 2px 8px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)',
      flexShrink: 0,
      userSelect: 'none',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 2,
        borderRadius: width * 0.1,
        border: '1px solid rgba(255,255,255,0.8)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.28,
        background: isHoliday
          ? 'linear-gradient(135deg, #f59e0b, #d97706)'
          : 'linear-gradient(135deg, ' + accent + 'ee, ' + accent + 'bb)',
        borderRadius: (width * 0.13) + 'px ' + (width * 0.13) + 'px 0 0',
      }} />

      <div style={{ position: 'absolute', top: width * 0.05, left: width * 0.08, lineHeight: 1 }}>
        <div style={{ fontSize: scale * 13 }}>{card.emoji || (isDayCard ? '\ud83d\udcc5' : '')}</div>
      </div>

      <div style={{ position: 'absolute', top: width * 0.06, right: width * 0.08, lineHeight: 1 }}>
        <div style={{ fontSize: scale * 7.5, fontWeight: 900, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
          {card.short}
        </div>
      </div>

      <div style={{ position: 'absolute', top: height * 0.3, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, padding: '0 3px', textAlign: 'center' }}>
        <span style={{ fontSize: scale * (isHoliday ? 18 : isMonthCard ? 18 : 22), lineHeight: 1 }}>
          {isHoliday || isMonthCard ? card.emoji : ''}
        </span>
        <span style={{ fontSize: scale * (isDayCard ? 11 : 8), fontWeight: 900, color: accent, lineHeight: 1.15 }}>
          {isDayCard ? card.short : card.label}
        </span>
        {isHoliday && (
          <span style={{ fontSize: scale * 5.5, color: accent, fontWeight: 800, letterSpacing: 0.5 }}>HOLIDAY</span>
        )}
        {isMonthCard && (
          <span style={{ fontSize: scale * 5.5, color: accent, fontWeight: 800, letterSpacing: 0.5 }}>MONTH</span>
        )}
        {isDayCard && (
          <span style={{ fontSize: scale * 5.5, color: accent, fontWeight: 800, letterSpacing: 0.5 }}>DAY</span>
        )}
      </div>
    </div>
  );

  if (animate || isNew) {
    return (
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 15 }}>
        {inner}
      </motion.div>
    );
  }
  return inner;
}
