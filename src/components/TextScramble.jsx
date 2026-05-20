import { useEffect, useState, useRef } from 'react'
import { useInView } from 'framer-motion'

const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export default function TextScramble({ text, className = '', as: Tag = 'span', delay = 0 }) {
  const [display, setDisplay] = useState('')
  const [started, setStarted] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!inView || started) return
    const timer = setTimeout(() => {
      setStarted(true)
      let iteration = 0
      const maxIterations = text.length * 3
      const interval = setInterval(() => {
        setDisplay(
          text.split('').map((char, i) => {
            if (char === ' ') return ' '
            if (i < iteration / 3) return text[i]
            return chars[Math.floor(Math.random() * chars.length)]
          }).join('')
        )
        iteration++
        if (iteration >= maxIterations) {
          setDisplay(text)
          clearInterval(interval)
        }
      }, 30)
    }, delay)
    return () => clearTimeout(timer)
  }, [inView, started, text, delay])

  return <Tag ref={ref} className={className}>{display || '\u00A0'}</Tag>
}
