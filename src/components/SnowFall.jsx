import { useEffect, useRef } from 'react'

export default function SnowFall() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const flakes = []
    const count = 60

    for (let i = 0; i < count; i++) {
      flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.8,
        speed: Math.random() * 0.3 + 0.15,
        drift: Math.random() * 0.4 - 0.2,
        opacity: Math.random() * 0.4 + 0.15,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.003 + 0.001,
      })
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      flakes.forEach(f => {
        f.sway += f.swaySpeed
        f.y += f.speed
        f.x += f.drift + Math.sin(f.sway) * 0.2

        if (f.y > canvas.height + 5) {
          f.y = -5
          f.x = Math.random() * canvas.width
        }
        if (f.x > canvas.width + 5) f.x = -5
        if (f.x < -5) f.x = canvas.width + 5

        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`
        ctx.fill()
      })

      animId = requestAnimationFrame(animate)
    }
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
      }}
    />
  )
}
