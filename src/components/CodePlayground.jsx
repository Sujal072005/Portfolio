import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const initialCode = `# Try editing this code! 🚀
def greet(name):
    return f"Hello, {name}!"

result = greet("World")
print(result)`

const presetSnippets = [
  { label: 'Hello World', code: `# Classic Hello World\ndef greet(name):\n    return f"Hello, {name}!"\n\nresult = greet("World")\nprint(result)` },
  { label: 'Fibonacci', code: `# Fibonacci Generator\ndef fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nfor num in fibonacci(10):\n    print(num, end=" ")` },
  { label: 'Neural Net', code: `# Simple Neural Network\nimport torch.nn as nn\n\nclass SimpleNet(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.fc1 = nn.Linear(784, 128)\n        self.fc2 = nn.Linear(128, 10)\n\n    def forward(self, x):\n        x = torch.relu(self.fc1(x))\n        return self.fc2(x)` },
  { label: 'API Route', code: `// Express API Route\napp.get('/api/data', async (req, res) => {\n  try {\n    const data = await db.find({});\n    res.json({ success: true, data });\n  } catch (err) {\n    res.status(500).json({ error: err });\n  }\n});` },
]

// Simple pseudo-execution for demo
function executeCode(code) {
  const lines = code.split('\n')
  const output = []
  
  for (const line of lines) {
    const trimmed = line.trim()
    // Detect print statements
    const printMatch = trimmed.match(/^print\((.+)\)$/)
    if (printMatch) {
      let arg = printMatch[1].trim()
      // String literal
      if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
        output.push(arg.slice(1, -1))
      } else if (arg.startsWith('f"') || arg.startsWith("f'")) {
        output.push(arg.slice(2, -1).replace(/\{.*?\}/g, '...'))
      } else {
        output.push(`→ ${arg}`)
      }
    }
    // Detect console.log
    const logMatch = trimmed.match(/^console\.log\((.+)\)/)
    if (logMatch) {
      let arg = logMatch[1].trim()
      if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'")) || (arg.startsWith('`') && arg.endsWith('`'))) {
        output.push(arg.slice(1, -1))
      } else {
        output.push(`→ ${arg}`)
      }
    }
    // Detect return statements for display
    if (trimmed.startsWith('return ') && !trimmed.includes('def ')) {
      // Only show if it's a simple value
      const val = trimmed.replace('return ', '')
      if (val.startsWith('"') || val.startsWith("'") || val.startsWith('f"')) {
        // skip, shown by print
      }
    }
  }
  
  if (output.length === 0) {
    output.push('✓ Code parsed successfully')
    // Show structure info
    const funcs = lines.filter(l => l.trim().startsWith('def ') || l.trim().startsWith('function '))
    const classes = lines.filter(l => l.trim().startsWith('class '))
    if (classes.length > 0) output.push(`📦 ${classes.length} class(es) defined`)
    if (funcs.length > 0) output.push(`⚡ ${funcs.length} function(s) defined`)
    output.push(`📝 ${lines.length} lines of code`)
  }
  
  return output
}

export default function CodePlayground() {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState([])
  const [running, setRunning] = useState(false)
  const [activePreset, setActivePreset] = useState(0)
  const textareaRef = useRef(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const handleRun = () => {
    setRunning(true)
    setOutput([])
    
    // Simulate execution with delay for each line
    setTimeout(() => {
      const result = executeCode(code)
      result.forEach((line, i) => {
        setTimeout(() => {
          setOutput(prev => [...prev, line])
          if (i === result.length - 1) setRunning(false)
        }, i * 200)
      })
    }, 500)
  }

  const handlePreset = (idx) => {
    setActivePreset(idx)
    setCode(presetSnippets[idx].code)
    setOutput([])
  }

  const lineNumbers = code.split('\n').length

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="hover-glow"
      style={{
        background: 'var(--glass)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 18px', borderBottom: '1px solid var(--glass-border)',
        background: 'rgba(255,255,255,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>
            playground.py
          </span>
        </div>
        <motion.button
          onClick={handleRun}
          disabled={running}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '6px 18px', borderRadius: 8,
            background: running ? 'rgba(139,92,246,0.3)' : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            border: 'none', color: 'white', fontWeight: 700, cursor: running ? 'default' : 'pointer',
            fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem',
            display: 'flex', alignItems: 'center', gap: 6
          }}
        >
          {running ? (
            <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⟳</motion.span> Running...</>
          ) : (
            <>▶ Run</>
          )}
        </motion.button>
      </div>

      {/* Preset tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--glass-border)', overflow: 'auto' }}>
        {presetSnippets.map((p, i) => (
          <motion.button
            key={i}
            onClick={() => handlePreset(i)}
            whileHover={{ background: 'rgba(139,92,246,0.1)' }}
            style={{
              padding: '8px 16px', border: 'none', cursor: 'pointer',
              background: i === activePreset ? 'rgba(139,92,246,0.1)' : 'transparent',
              color: i === activePreset ? 'var(--accent2)' : 'var(--text3)',
              fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace",
              borderBottom: i === activePreset ? '2px solid var(--accent)' : '2px solid transparent',
              fontWeight: i === activePreset ? 600 : 400,
              whiteSpace: 'nowrap', transition: 'all 0.2s'
            }}
          >
            {p.label}
          </motion.button>
        ))}
      </div>

      {/* Editor */}
      <div style={{ display: 'flex', minHeight: 200 }}>
        {/* Line numbers */}
        <div style={{
          padding: '16px 12px', borderRight: '1px solid var(--glass-border)',
          fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem',
          color: 'var(--text3)', textAlign: 'right', userSelect: 'none',
          lineHeight: '1.65', minWidth: 36
        }}>
          {Array.from({ length: lineNumbers }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck={false}
          style={{
            flex: 1, padding: '16px', background: 'transparent', border: 'none',
            outline: 'none', color: 'var(--accent2)', resize: 'none',
            fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem',
            lineHeight: '1.65', minHeight: 200, caretColor: '#8b5cf6',
            tabSize: 4
          }}
          onKeyDown={e => {
            if (e.key === 'Tab') {
              e.preventDefault()
              const start = e.target.selectionStart
              const end = e.target.selectionEnd
              setCode(code.substring(0, start) + '    ' + code.substring(end))
              setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 4
              }, 0)
            }
          }}
        />
      </div>

      {/* Output panel */}
      <div style={{
        borderTop: '1px solid var(--glass-border)',
        background: 'rgba(0,0,0,0.2)',
        minHeight: 60
      }}>
        <div style={{
          padding: '8px 16px', borderBottom: '1px solid var(--glass-border)',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: 1 }}>Output</span>
          {running && (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}
            />
          )}
        </div>
        <div style={{
          padding: '12px 16px', fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.78rem', color: '#22c55e', minHeight: 40
        }}>
          <AnimatePresence>
            {output.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                style={{ marginBottom: 2 }}
              >
                <span style={{ color: 'var(--text3)', marginRight: 8 }}>{'>'}</span>
                {line}
              </motion.div>
            ))}
          </AnimatePresence>
          {output.length === 0 && !running && (
            <span style={{ color: 'var(--text3)', fontSize: '0.72rem' }}>Press ▶ Run to execute code</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
