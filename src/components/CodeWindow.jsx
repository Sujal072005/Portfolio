import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const codeLines = [
  { text: 'class ', kw: true, rest: [{ text: 'Developer', cls: true }, { text: ':' }] },
  { text: '    def ', kw: true, rest: [{ text: '__init__', cls: true }, { text: '(' }, { text: 'self', self: true }, { text: '):' }] },
  { text: '        self.name = ', rest: [{ text: '"Sujal"', str: true }] },
  { text: '        self.role = ', rest: [{ text: '"SDE"', str: true }] },
  { text: '        self.skills = [' },
  { text: '            ', rest: [{ text: '"ML"', str: true }, { text: ', ' }, { text: '"Gen AI"', str: true }, { text: ',' }] },
  { text: '            ', rest: [{ text: '"Full-Stack"', str: true }] },
  { text: '        ]' },
  { text: '' },
  { text: '    def ', kw: true, rest: [{ text: 'build', cls: true }, { text: '(' }, { text: 'self', self: true }, { text: '):' }] },
  { text: '        return ', kw: true, rest: [{ text: '"Amazing things 🚀"', str: true }] },
]

export default function CodeWindow() {
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= codeLines.length) { clearInterval(timer); return prev }
        return prev + 1
      })
    }, 180)
    return () => clearInterval(timer)
  }, [])

  const renderParts = (line) => {
    const parts = []
    if (line.kw) parts.push(<span key="kw" className="code-keyword">{line.text}</span>)
    else parts.push(<span key="t">{line.text}</span>)
    if (line.rest) {
      line.rest.forEach((p, i) => {
        if (p.cls) parts.push(<span key={`c${i}`} className="code-class">{p.text}</span>)
        else if (p.str) parts.push(<span key={`s${i}`} className="code-string">{p.text}</span>)
        else if (p.self) parts.push(<span key={`sl${i}`} className="code-self">{p.text}</span>)
        else parts.push(<span key={`p${i}`}>{p.text}</span>)
      })
    }
    return parts
  }

  return (
    <div className="code-window">
      <div className="code-header">
        <div className="d-flex gap-2">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span className="code-title">portfolio.py</span>
      </div>
      <div className="code-body">
        <AnimatePresence>
          {codeLines.slice(0, visibleLines).map((line, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
              {renderParts(line)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
