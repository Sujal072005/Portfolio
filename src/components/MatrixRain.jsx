import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

export default function MatrixRain({ active, onClose }) {
  const [init, setInit] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setInit(true))
  }, [])

  // Classic matrix rain via canvas (for the character fall effect)
  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]|/\\=+-*&^%$#@!sujal'
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops = Array(columns).fill(1)

    let animId
    function draw() {
      ctx.fillStyle = 'rgba(6, 6, 14, 0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Multi-color matrix
        const brightness = Math.random()
        if (brightness > 0.97) {
          ctx.fillStyle = '#ffffff'
          ctx.shadowColor = '#22c55e'
          ctx.shadowBlur = 15
        } else if (brightness > 0.9) {
          ctx.fillStyle = '#4ade80'
          ctx.shadowBlur = 8
          ctx.shadowColor = '#22c55e'
        } else if (brightness > 0.7) {
          ctx.fillStyle = '#22c55e'
          ctx.shadowBlur = 0
        } else {
          ctx.fillStyle = `rgba(34, 197, 94, ${0.3 + Math.random() * 0.4})`
          ctx.shadowBlur = 0
        }

        ctx.fillText(char, x, y)
        ctx.shadowBlur = 0

        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    const timeout = setTimeout(() => onClose(), 8000)
    return () => { cancelAnimationFrame(animId); clearTimeout(timeout) }
  }, [active, onClose])

  // tsParticles green rain overlay
  const particleOptions = useMemo(() => ({
    fullScreen: { enable: false },
    fpsLimit: 60,
    particles: {
      number: { value: 50 },
      color: { value: ['#22c55e', '#4ade80', '#86efac'] },
      shape: { type: 'char', options: { char: { value: ['0', '1', '{', '}', '<', '>', '/', '\\'], font: 'JetBrains Mono', weight: '400' } } },
      opacity: { value: { min: 0.1, max: 0.7 }, animation: { enable: true, speed: 1, sync: false } },
      size: { value: { min: 8, max: 16 } },
      move: {
        enable: true,
        speed: { min: 3, max: 12 },
        direction: 'bottom',
        straight: true,
        outModes: { default: 'out' }
      },
      rotate: { value: { min: -15, max: 15 }, animation: { enable: true, speed: 5 } }
    },
    detectRetina: true
  }), [])

  if (!active) return null

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 99999, cursor: 'pointer' }}
      onClick={onClose}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />

      {init && (
        <Particles
          id="matrix-particles"
          options={particleOptions}
          style={{ position: 'absolute', inset: 0, zIndex: 1 }}
        />
      )}

      {/* Scan line effect */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 3px)',
        animation: 'scanMove 8s linear infinite'
      }} />

      {/* Center text */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        fontFamily: "'JetBrains Mono', monospace", fontSize: '2.5rem', color: '#22c55e',
        textShadow: '0 0 20px #22c55e, 0 0 40px #22c55e, 0 0 80px rgba(34,197,94,0.5)',
        textAlign: 'center', zIndex: 3, letterSpacing: '4px'
      }}>
        <div style={{ animation: 'glitchText 0.5s infinite' }}>
          🎮 KONAMI CODE ACTIVATED
        </div>
        <div style={{
          fontSize: '0.9rem', opacity: 0.7, marginTop: 16,
          animation: 'blink 1s step-end infinite'
        }}>
          &gt; ACCESS GRANTED — Click to dismiss_
        </div>
      </div>

      <style>{`
        @keyframes scanMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(6px); }
        }
        @keyframes glitchText {
          0%, 90%, 100% { transform: translate(0); }
          92% { transform: translate(-3px, 2px) skewX(-1deg); }
          94% { transform: translate(3px, -1px) skewX(1deg); }
          96% { transform: translate(-2px, -2px); }
          98% { transform: translate(2px, 1px) skewX(-0.5deg); }
        }
      `}</style>
    </div>
  )
}
