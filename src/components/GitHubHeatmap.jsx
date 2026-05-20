import { useState, useMemo } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef } from 'react'

// Generate realistic-looking contribution data for 52 weeks
function generateContributions() {
  const data = []
  const now = new Date()
  for (let week = 51; week >= 0; week--) {
    const weekData = []
    for (let day = 0; day < 7; day++) {
      const date = new Date(now)
      date.setDate(date.getDate() - (week * 7 + (6 - day)))
      
      // More realistic pattern: higher activity on weekdays, streaks, etc.
      let base = Math.random()
      const isWeekend = day === 0 || day === 6
      if (isWeekend) base *= 0.5
      
      // Add some burst patterns (project sprints)
      const weekFactor = Math.sin((52 - week) / 8) * 0.3 + 0.7
      base *= weekFactor
      
      let level = 0
      if (base > 0.85) level = 4
      else if (base > 0.65) level = 3
      else if (base > 0.4) level = 2
      else if (base > 0.2) level = 1
      
      const contributions = level === 0 ? 0 : Math.floor(Math.random() * (level * 4)) + 1
      
      weekData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        level,
        contributions
      })
    }
    data.push(weekData)
  }
  return data
}

const levelColors = {
  0: 'rgba(139, 92, 246, 0.04)',
  1: 'rgba(139, 92, 246, 0.2)',
  2: 'rgba(139, 92, 246, 0.4)',
  3: 'rgba(139, 92, 246, 0.65)',
  4: 'rgba(139, 92, 246, 0.9)',
}

const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function GitHubHeatmap() {
  const contributions = useMemo(() => generateContributions(), [])
  const [tooltip, setTooltip] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const totalContributions = useMemo(() => {
    return contributions.flat().reduce((sum, d) => sum + d.contributions, 0)
  }, [contributions])

  const longestStreak = useMemo(() => {
    const flat = contributions.flat()
    let current = 0, max = 0
    for (const d of flat) {
      if (d.contributions > 0) { current++; max = Math.max(max, current) }
      else current = 0
    }
    return max
  }, [contributions])

  const handleMouseEnter = (e, cell) => {
    const rect = e.target.getBoundingClientRect()
    setTooltip(cell)
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 8 })
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: '28px',
        background: 'var(--glass)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius)',
        position: 'relative',
        overflow: 'hidden'
      }}
      className="hover-glow"
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
            <span style={{ marginRight: 8 }}>📊</span>
            Coding Activity
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>
            {totalContributions} contributions in the last year
          </p>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'Total', value: totalContributions, color: '#8b5cf6' },
            { label: 'Streak', value: `${longestStreak}d`, color: '#22c55e' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap grid */}
      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ display: 'flex', gap: 3, minWidth: 'fit-content' }}>
          {/* Day labels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginRight: 4, paddingTop: 20 }}>
            {dayLabels.map((d, i) => (
              <div key={i} style={{ height: 13, fontSize: '0.6rem', color: 'var(--text3)', display: 'flex', alignItems: 'center', fontFamily: "'JetBrains Mono', monospace" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {contributions.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Month label on first week of month */}
              <div style={{ height: 17, fontSize: '0.6rem', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>
                {wi % 4 === 0 ? monthLabels[new Date(week[0]?.date).getMonth()] || '' : ''}
              </div>
              {week.map((cell, di) => (
                <motion.div
                  key={di}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: (wi * 7 + di) * 0.002 }}
                  onMouseEnter={(e) => handleMouseEnter(e, cell)}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    width: 13, height: 13, borderRadius: 3,
                    background: levelColors[cell.level],
                    border: '1px solid rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  whileHover={{ scale: 1.5, boxShadow: '0 0 12px rgba(139,92,246,0.5)' }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, marginTop: 12, fontSize: '0.65rem', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>
        <span>Less</span>
        {[0, 1, 2, 3, 4].map(l => (
          <div key={l} style={{ width: 13, height: 13, borderRadius: 3, background: levelColors[l], border: '1px solid rgba(255,255,255,0.03)' }} />
        ))}
        <span>More</span>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: 'translate(-50%, -100%)',
              padding: '8px 14px',
              background: '#1a1a2e',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              fontSize: '0.75rem',
              color: '#eaeaf0',
              zIndex: 99999,
              pointerEvents: 'none',
              fontFamily: "'JetBrains Mono', monospace",
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 25px rgba(0,0,0,0.4)'
            }}
          >
            <strong style={{ color: '#8b5cf6' }}>{tooltip.contributions}</strong> contributions on {tooltip.date}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
