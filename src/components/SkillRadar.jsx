import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const skills = [
  { name: 'Python', level: 90, category: 'Languages', color: '#3776ab', icon: '🐍' },
  { name: 'JavaScript', level: 85, category: 'Languages', color: '#f7df1e', icon: '⚡' },
  { name: 'React', level: 85, category: 'Frontend', color: '#61dafb', icon: '⚛️' },
  { name: 'Node.js', level: 85, category: 'Backend', color: '#68a063', icon: '🟢' },
  { name: 'TensorFlow', level: 80, category: 'AI/ML', color: '#ff6f00', icon: '🧠' },
  { name: 'PyTorch', level: 85, category: 'AI/ML', color: '#ee4c2c', icon: '🔥' },
  { name: 'TypeScript', level: 80, category: 'Languages', color: '#3178c6', icon: '🔷' },
  { name: 'Docker', level: 75, category: 'DevOps', color: '#2496ed', icon: '🐳' },
  { name: 'MongoDB', level: 70, category: 'Database', color: '#47a248', icon: '🍃' },
  { name: 'AWS', level: 70, category: 'Cloud', color: '#ff9900', icon: '☁️' },
  { name: 'Next.js', level: 80, category: 'Frontend', color: '#ffffff', icon: '▲' },
  { name: 'LangChain', level: 70, category: 'AI/ML', color: '#1c3c3c', icon: '🔗' },
]

const categories = ['All', ...new Set(skills.map(s => s.category))]

export default function SkillRadar() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [hoveredSkill, setHoveredSkill] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const filtered = activeCategory === 'All' ? skills : skills.filter(s => s.category === activeCategory)
  const sorted = [...filtered].sort((a, b) => b.level - a.level)

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
      }}
      className="hover-glow"
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
            <span style={{ marginRight: 8 }}>🎯</span>
            Skill Proficiency
          </h4>
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '5px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: activeCategory === cat ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)',
                color: activeCategory === cat ? '#a78bfa' : 'var(--text3)',
                fontSize: '0.72rem', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
                borderWidth: 1, borderStyle: 'solid',
                borderColor: activeCategory === cat ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.05)',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Skill bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sorted.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setHoveredSkill(skill.name)}
            onMouseLeave={() => setHoveredSkill(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 12,
              background: hoveredSkill === skill.name ? 'rgba(139,92,246,0.06)' : 'transparent',
              transition: 'all 0.2s ease', cursor: 'default'
            }}
          >
            <span style={{ fontSize: '1.2rem', width: 28, textAlign: 'center' }}>{skill.icon}</span>
            <span style={{
              width: 90, fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)',
              fontFamily: "'JetBrains Mono', monospace",
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
            }}>
              {skill.name}
            </span>

            {/* Bar container */}
            <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: '100%', borderRadius: 4,
                  background: `linear-gradient(90deg, ${skill.color}99, ${skill.color})`,
                  boxShadow: hoveredSkill === skill.name ? `0 0 15px ${skill.color}50` : 'none',
                  transition: 'box-shadow 0.3s ease',
                  position: 'relative'
                }}
              >
                {/* Shimmer effect on hover */}
                {hoveredSkill === skill.name && (
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    style={{
                      position: 'absolute', top: 0, left: 0,
                      width: '40%', height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    }}
                  />
                )}
              </motion.div>
            </div>

            <motion.span
              animate={{ scale: hoveredSkill === skill.name ? 1.15 : 1 }}
              style={{
                width: 40, textAlign: 'right',
                fontSize: '0.82rem', fontWeight: 700,
                color: skill.color,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {skill.level}%
            </motion.span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
