import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function ThemeGuideArrow() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-yellow-300" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
        Choose your style
      </span>
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="text-yellow-300"
      >
        <ChevronRight className="w-5 h-5" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }} />
      </motion.div>
    </div>
  );
}