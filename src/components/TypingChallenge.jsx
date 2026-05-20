import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const codeSnippets = [
  { lang: 'Python', code: 'def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)' },
  { lang: 'JavaScript', code: 'const fetchData = async (url) => {\n    const res = await fetch(url);\n    return res.json();\n}' },
  { lang: 'Python', code: 'model = Sequential([\n    Dense(128, activation="relu"),\n    Dropout(0.3),\n    Dense(10, activation="softmax")\n])' },
  { lang: 'JavaScript', code: 'const debounce = (fn, ms) => {\n    let timer;\n    return (...args) => {\n        clearTimeout(timer);\n        timer = setTimeout(() => fn(...args), ms);\n    };\n}' },
]

export default function TypingChallenge({ active, onClose }) {
  const [snippet, setSnippet] = useState(null)
  const [typed, setTyped] = useState('')
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const [totalKeystrokes, setTotalKeystrokes] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (active) {
      const s = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
      setSnippet(s)
      setTyped('')
      setStarted(false)
      setFinished(false)
      setWpm(0)
      setAccuracy(100)
      setErrors(0)
      setTotalKeystrokes(0)
      setElapsed(0)
      setTimeout(() => inputRef.current?.focus(), 200)
    }
    return () => clearInterval(timerRef.current)
  }, [active])

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - startTime)
      }, 100)
    }
    return () => clearInterval(timerRef.current)
  }, [started, finished, startTime])

  const handleKeyDown = useCallback((e) => {
    if (!snippet || finished) return
    if (e.key === 'Escape') { onClose(); return }

    if (e.key === 'Backspace') {
      setTyped(prev => prev.slice(0, -1))
      return
    }

    if (e.key.length > 1 && e.key !== 'Enter' && e.key !== 'Tab') return
    e.preventDefault()

    const char = e.key === 'Enter' ? '\n' : e.key === 'Tab' ? '    ' : e.key

    if (!started) {
      setStarted(true)
      setStartTime(Date.now())
    }

    const newTyped = typed + char
    setTyped(newTyped)
    setTotalKeystrokes(prev => prev + 1)

    // Check if character is correct
    const target = snippet.code
    if (char !== target[typed.length]) {
      setErrors(prev => prev + 1)
    }

    // Calculate WPM and accuracy
    const elapsedMin = (Date.now() - (startTime || Date.now())) / 60000
    const words = newTyped.length / 5
    if (elapsedMin > 0) setWpm(Math.round(words / elapsedMin))
    const newTotal = totalKeystrokes + 1
    const newErrors = char !== target[typed.length] ? errors + 1 : errors
    setAccuracy(Math.max(0, Math.round(((newTotal - newErrors) / newTotal) * 100)))

    // Check if complete
    if (newTyped.length >= target.length) {
      setFinished(true)
      clearInterval(timerRef.current)
    }
  }, [snippet, typed, started, finished, startTime, errors, totalKeystrokes, onClose])

  if (!active || !snippet) return null

  const target = snippet.code
  const progress = (typed.length / target.length) * 100

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 99998, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 680, background: '#0d0d18', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 80px rgba(139,92,246,0.08)'
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.5rem' }}>⌨️</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#eaeaf0' }}>Typing Challenge</h3>
              <span style={{ fontSize: '0.75rem', color: '#5e5e7a', fontFamily: "'JetBrains Mono', monospace" }}>{snippet.lang}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { label: 'WPM', value: wpm, color: '#8b5cf6' },
              { label: 'ACC', value: `${accuracy}%`, color: accuracy > 90 ? '#22c55e' : accuracy > 70 ? '#f59e0b' : '#ef4444' },
              { label: 'TIME', value: `${(elapsed / 1000).toFixed(1)}s`, color: '#06b6d4' }
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                <div style={{ fontSize: '0.6rem', color: '#5e5e7a', letterSpacing: 2, textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#9d9db5', padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Outfit,sans-serif' }}>✕</button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: 'rgba(255,255,255,0.04)' }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', borderRadius: 2 }}
          />
        </div>

        {/* Code display */}
        <div
          style={{
            padding: '24px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem',
            lineHeight: 2, minHeight: 200, cursor: 'text', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            position: 'relative'
          }}
          onClick={() => inputRef.current?.focus()}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          ref={inputRef}
        >
          {target.split('').map((char, i) => {
            let color = '#3a3a52' // untyped
            let bg = 'transparent'
            if (i < typed.length) {
              if (typed[i] === char) {
                color = '#22c55e'
              } else {
                color = '#ef4444'
                bg = 'rgba(239,68,68,0.15)'
              }
            } else if (i === typed.length) {
              bg = 'rgba(139,92,246,0.3)'
              color = '#eaeaf0'
            }
            return (
              <span key={i} style={{ color, background: bg, borderRadius: 2, transition: 'all 0.1s' }}>
                {char === '\n' ? '↵\n' : char}
              </span>
            )
          })}
          {!started && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                color: '#5e5e7a', fontSize: '0.8rem', textAlign: 'center'
              }}
            >
              Click here and start typing...
            </motion.div>
          )}
        </div>

        {/* Finished state */}
        <AnimatePresence>
          {finished && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '24px', borderTop: '1px solid rgba(255,255,255,0.06)',
                textAlign: 'center'
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{ fontSize: '2.5rem', marginBottom: 8 }}
              >
                {wpm > 60 ? '🔥' : wpm > 40 ? '⚡' : '👍'}
              </motion.div>
              <h4 style={{ color: '#eaeaf0', margin: '0 0 4px', fontWeight: 800 }}>
                {wpm > 60 ? 'Blazing Fast!' : wpm > 40 ? 'Great Speed!' : 'Nice Try!'}
              </h4>
              <p style={{ color: '#5e5e7a', fontSize: '0.85rem', margin: 0 }}>
                {wpm} WPM · {accuracy}% accuracy · {(elapsed / 1000).toFixed(1)}s
              </p>
              <button
                onClick={() => {
                  const s = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
                  setSnippet(s)
                  setTyped('')
                  setStarted(false)
                  setFinished(false)
                  setWpm(0)
                  setAccuracy(100)
                  setErrors(0)
                  setTotalKeystrokes(0)
                  setElapsed(0)
                  setTimeout(() => inputRef.current?.focus(), 100)
                }}
                style={{
                  marginTop: 16, padding: '10px 28px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', border: 'none',
                  color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                  fontSize: '0.9rem'
                }}
              >
                Try Again 🔄
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
