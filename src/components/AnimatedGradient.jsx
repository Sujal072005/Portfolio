import { useEffect, useRef } from 'react'

export default function AnimatedGradient() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Color palette
    const colors = [
      { r: 139, g: 92, b: 246 },   // purple
      { r: 236, g: 72, b: 153 },   // pink
      { r: 6, g: 182, b: 212 },    // cyan
      { r: 109, g: 40, b: 217 },   // deep purple
      { r: 34, g: 197, b: 94 },    // green
    ]

    // Gradient control points that move
    const points = colors.map((c, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: c,
      radius: 300 + Math.random() * 300
    }))

    function animate() {
      time += 0.005
      ctx.globalAlpha = 1
      ctx.fillStyle = 'rgba(6, 6, 14, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      points.forEach((p, i) => {
        // Organic movement using sine waves
        p.x += p.vx + Math.sin(time + i * 1.5) * 0.5
        p.y += p.vy + Math.cos(time + i * 1.2) * 0.5

        // Bounce off edges
        if (p.x < -p.radius) p.x = canvas.width + p.radius
        if (p.x > canvas.width + p.radius) p.x = -p.radius
        if (p.y < -p.radius) p.y = canvas.height + p.radius
        if (p.y > canvas.height + p.radius) p.y = -p.radius

        // Pulsing radius
        const pulseRadius = p.radius + Math.sin(time * 2 + i) * 50

        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, pulseRadius
        )
        const alpha = 0.02 + Math.sin(time + i * 0.7) * 0.008
        gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`)
        gradient.addColorStop(0.5, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha * 0.4})`)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.globalCompositeOperation = 'lighter'
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      ctx.globalCompositeOperation = 'source-over'
      animId = requestAnimationFrame(animate)
    }

    // Clear initial
    ctx.fillStyle = '#06060e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.4
      }}
    />
  )
}
