import React from 'react';
import { motion } from 'framer-motion';

// SVG starburst / 8-point star for wild cards placed in a row
export default function WildToken({ size = 52, isNew = false }) {
  const r = size / 2;
  const points = 8;
  const outerR = r - 2;
  const innerR = r * 0.42;
  const fontSize = Math.max(10, size * 0.22);

  // Build 8-point star polygon
  const starPoints = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? outerR : innerR;
    starPoints.push([
      r + radius * Math.cos(angle),
      r + radius * Math.sin(angle),
    ]);
  }
  const polyline = starPoints.map(p => p.join(',')).join(' ');

  const inner = (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
        {/* Solid background so no card underneath bleeds through */}
        <rect x={0} y={0} width={size} height={size} fill="#1a1a2e" rx={6} />

        {/* Outer glow */}
        <polygon
          points={polyline}
          fill="rgba(251,191,36,0.2)"
          stroke="rgba(251,191,36,0.5)"
          strokeWidth={size * 0.06}
          transform={`rotate(4 ${r} ${r})`}
        />
        {/* Main star */}
        <polygon
          points={polyline}
          fill="url(#wildGrad)"
          stroke="#fbbf24"
          strokeWidth={1.5}
        />
        <defs>
          <radialGradient id="wildGrad" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </radialGradient>
        </defs>
        {/* Center star text */}
        <text
          x={r}
          y={r + size * 0.08}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.28}
          fontWeight="900"
          fill="#fff"
          style={{ letterSpacing: '-0.5px', fontFamily: 'system-ui, sans-serif' }}
        >
          ★
        </text>

        {/* W in top-left corner */}
        <text
          x={4}
          y={fontSize + 2}
          fontSize={fontSize}
          fontWeight="900"
          fill="#fbbf24"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          W
        </text>

        {/* W in bottom-right corner (rotated 180°) */}
        <text
          x={size - 4}
          y={size - 4}
          fontSize={fontSize}
          fontWeight="900"
          fill="#fbbf24"
          textAnchor="end"
          transform={`rotate(180 ${size - 4} ${size - 4})`}
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          W
        </text>
      </svg>
    </div>
  );

  if (isNew) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -30, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.55, duration: 0.45 }}
      >
        {inner}
      </motion.div>
    );
  }

  return inner;
}
