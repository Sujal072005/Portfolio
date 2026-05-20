import { useEffect, useRef } from 'react'

export default function CursorTrail() {
  const canvasRef = useRef(null)
  const points = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const handleMove = (e) => {
      points.current.push({
        x: e.clientX, y: e.clientY,
        life: 1, hue: (Date.now() / 10) % 360
      })
      if (points.current.length > 50) points.current.shift()
    }
    window.addEventListener('mousemove', handleMove)

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const pts = points.current

      for (let i = pts.length - 1; i >= 0; i--) {
        pts[i].life -= 0.025
        if (pts[i].life <= 0) { pts.splice(i, 1); continue }

        const p = pts[i]
        const size = p.life * 8
        const alpha = p.life * 0.6

        // Outer glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, size * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha * 0.15})`
        ctx.fill()

        // Main dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size)
        grad.addColorStop(0, `hsla(${p.hue}, 90%, 70%, ${alpha})`)
        grad.addColorStop(1, `hsla(${p.hue + 30}, 80%, 60%, 0)`)
        ctx.fillStyle = grad
        ctx.fill()
      }

      // Draw connecting line
      if (pts.length > 1) {
        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x, pts[i].y)
        }
        ctx.strokeStyle = `hsla(${(Date.now() / 10) % 360}, 70%, 60%, 0.08)`
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMove)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', zIndex:2, pointerEvents:'none' }} />
}
