import { useEffect, useState, useRef } from 'react'
import { useInView } from 'framer-motion'

const jsonContent = `{
  "languages": ["Python", "JS", "TS"],
  "focus": "AI/ML + Full-Stack",
  "learning": ["Gen AI", "LLMs"],
  "passion": "Building the future",
  "coffee_cups_daily": "∞"
}`

export default function Terminal() {
  const [text, setText] = useState('')
  const [started, setStarted] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!inView || started) return
    setStarted(true)
    let i = 0
    const timer = setInterval(() => {
      setText(jsonContent.substring(0, i + 1))
      i++
      if (i >= jsonContent.length) clearInterval(timer)
    }, 18)
    return () => clearInterval(timer)
  }, [inView, started])

  return (
    <div className="terminal" ref={ref}>
      <div className="terminal-header">
        <div className="d-flex gap-2">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span className="terminal-title">sujal@dev: ~</span>
      </div>
      <div className="terminal-body">
        <div className="mb-2">
          <span className="prompt">$</span> cat interests.json
        </div>
        <pre className="terminal-json" style={{ margin: 0 }}>{text}<span className="cursor-blink">█</span></pre>
      </div>
    </div>
  )
}
