import { useEffect, useRef } from 'react'

export default function Fireworks({ active, onDone }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const rockets = []
    const particles = []
    const colors = ['#8b5cf6','#ec4899','#06b6d4','#22c55e','#f59e0b','#a78bfa','#f472b6','#22d3ee']
    let frame = 0

    // Launch rockets
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        rockets.push({
          x: Math.random() * canvas.width * 0.6 + canvas.width * 0.2,
          y: canvas.height,
          targetY: Math.random() * canvas.height * 0.4 + 50,
          speed: 6 + Math.random() * 3,
          color: colors[i % colors.length],
          trail: []
        })
      }, i * 300)
    }

    function animate() {
      ctx.fillStyle = 'rgba(6, 6, 14, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.trail.push({ x: r.x, y: r.y, life: 1 })
        if (r.trail.length > 8) r.trail.shift()
        r.y -= r.speed
        r.x += (Math.random() - 0.5) * 1

        // Trail
        r.trail.forEach((t, ti) => {
          t.life -= 0.12
          ctx.beginPath()
          ctx.arc(t.x, t.y, 2 * t.life, 0, Math.PI * 2)
          ctx.fillStyle = r.color + Math.floor(t.life * 180).toString(16).padStart(2,'0')
          ctx.fill()
        })

        // Rocket
        ctx.beginPath()
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#fff'
        ctx.fill()

        if (r.y <= r.targetY) {
          // Explode
          for (let j = 0; j < 60; j++) {
            const angle = (Math.PI * 2 / 60) * j + Math.random() * 0.3
            const speed = 2 + Math.random() * 4
            particles.push({
              x: r.x, y: r.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 1,
              color: colors[Math.floor(Math.random() * colors.length)],
              size: 2 + Math.random() * 2,
              gravity: 0.04
            })
          }
          rockets.splice(i, 1)
        }
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy; p.vy += p.gravity
        p.vx *= 0.98; p.life -= 0.012

        if (p.life <= 0) { particles.splice(i, 1); continue }

        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(0, p.size * p.life), 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.floor(Math.max(0, p.life) * 255).toString(16).padStart(2,'0')
        ctx.shadowBlur = 10
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.shadowBlur = 0
      }

      frame++
      if (frame < 400 && (rockets.length > 0 || particles.length > 0)) {
        requestAnimationFrame(animate)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        onDone()
      }
    }
    animate()
  }, [active, onDone])

  if (!active) return null
  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, zIndex:99998, pointerEvents:'none' }} />
}
