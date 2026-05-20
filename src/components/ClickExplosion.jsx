import { useEffect, useRef } from 'react'

export default function ClickExplosion() {
  const canvasRef = useRef(null)
  const explosionsRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#a78bfa', '#f472b6', '#22d3ee']

    class ExplosionParticle {
      constructor(x, y) {
        this.x = x; this.y = y
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 8 + 3
        this.vx = Math.cos(angle) * speed
        this.vy = Math.sin(angle) * speed
        this.life = 1
        this.decay = Math.random() * 0.02 + 0.015
        this.size = Math.random() * 5 + 2
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.gravity = 0.1
        this.trail = []
      }
      update() {
        this.trail.push({ x: this.x, y: this.y, life: this.life })
        if (this.trail.length > 5) this.trail.shift()
        this.vy += this.gravity
        this.x += this.vx
        this.y += this.vy
        this.vx *= 0.98
        this.life -= this.decay
      }
      draw(ctx) {
        // Trail
        for (let i = 0; i < this.trail.length; i++) {
          const t = this.trail[i]
          ctx.beginPath()
          ctx.arc(t.x, t.y, this.size * (i / this.trail.length) * 0.5, 0, Math.PI * 2)
          ctx.fillStyle = this.color + Math.floor((i / this.trail.length) * this.life * 40).toString(16).padStart(2, '0')
          ctx.fill()
        }
        // Main
        ctx.beginPath()
        ctx.arc(this.x, this.y, Math.max(0, this.size * this.life), 0, Math.PI * 2)
        ctx.fillStyle = this.color + Math.floor(Math.max(0, this.life) * 255).toString(16).padStart(2, '0')
        ctx.fill()
        // Glow
        ctx.beginPath()
        ctx.arc(this.x, this.y, Math.max(0, this.size * this.life * 2), 0, Math.PI * 2)

        ctx.fillStyle = this.color + '15'
        ctx.fill()
      }
    }

    // Ring shockwave
    class ShockWave {
      constructor(x, y) {
        this.x = x; this.y = y
        this.radius = 0; this.maxRadius = 80
        this.life = 1
      }
      update() {
        this.radius += 4
        this.life = 1 - this.radius / this.maxRadius
      }
      draw(ctx) {
        if (this.life <= 0) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(139, 92, 246, ${this.life * 0.4})`
        ctx.lineWidth = 2 * this.life
        ctx.stroke()
      }
    }

    const handleClick = (e) => {
      const particles = []
      for (let i = 0; i < 30; i++) {
        particles.push(new ExplosionParticle(e.clientX, e.clientY))
      }
      const wave = new ShockWave(e.clientX, e.clientY)
      explosionsRef.current.push({ particles, wave })
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      explosionsRef.current = explosionsRef.current.filter(exp => {
        exp.wave.update()
        exp.wave.draw(ctx)
        exp.particles = exp.particles.filter(p => {
          p.update()
          p.draw(ctx)
          return p.life > 0
        })
        return exp.particles.length > 0 || exp.wave.life > 0
      })
      animId = requestAnimationFrame(animate)
    }
    animate()

    window.addEventListener('click', handleClick)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9998, pointerEvents: 'none' }} />
}
