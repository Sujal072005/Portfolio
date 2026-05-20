import { motion } from 'framer-motion'

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 2.5, ease: [0.22, 1, 0.36, 1] } }
}

export default function HandwrittenName() {
  return (
    <svg viewBox="0 0 400 100" width="320" height="80" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="penGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      {/* S */}
      <motion.path d="M30 30 C50 15, 55 20, 50 35 C45 50, 20 50, 20 60 C20 75, 50 80, 55 65" fill="none" stroke="url(#penGrad)" strokeWidth="3.5" strokeLinecap="round" variants={pathVariants} initial="hidden" animate="visible" />
      {/* u */}
      <motion.path d="M75 40 L75 65 C75 75, 90 78, 95 65 L95 40" fill="none" stroke="url(#penGrad)" strokeWidth="3.5" strokeLinecap="round" variants={pathVariants} initial="hidden" animate="visible" style={{ animationDelay: '0.3s' }} />
      {/* j */}
      <motion.path d="M120 40 L120 75 C120 90, 105 88, 105 80" fill="none" stroke="url(#penGrad)" strokeWidth="3.5" strokeLinecap="round" variants={pathVariants} initial="hidden" animate="visible" />
      <motion.circle cx="120" cy="28" r="3" fill="#ec4899" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, type: 'spring' }} />
      {/* a */}
      <motion.path d="M155 55 C155 40, 140 38, 138 50 C136 62, 148 70, 155 65 L155 40 L155 70" fill="none" stroke="url(#penGrad)" strokeWidth="3.5" strokeLinecap="round" variants={pathVariants} initial="hidden" animate="visible" />
      {/* l */}
      <motion.path d="M175 25 L175 70" fill="none" stroke="url(#penGrad)" strokeWidth="3.5" strokeLinecap="round" variants={pathVariants} initial="hidden" animate="visible" />
      {/* Underline swoosh */}
      <motion.path d="M15 85 C80 95, 140 88, 185 82" fill="none" stroke="url(#penGrad)" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }} transition={{ delay: 2, duration: 1, ease: 'easeOut' }} />
    </svg>
  )
}
