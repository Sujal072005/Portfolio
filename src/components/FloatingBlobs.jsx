import { useEffect, useRef } from 'react'

export default function FloatingBlobs() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId, time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Metaball-style blobs
    const blobs = [
      { x: 0.3, y: 0.3, r: 200, vx: 0.3, vy: 0.2, color: [139, 92, 246], phase: 0 },
      { x: 0.7, y: 0.6, r: 180, vx: -0.25, vy: 0.15, color: [236, 72, 153], phase: 1.5 },
      { x: 0.5, y: 0.8, r: 160, vx: 0.2, vy: -0.3, color: [6, 182, 212], phase: 3 },
      { x: 0.2, y: 0.7, r: 220, vx: -0.15, vy: -0.2, color: [167, 139, 250], phase: 4.5 },
      { x: 0.8, y: 0.2, r: 190, vx: 0.18, vy: 0.25, color: [34, 197, 94], phase: 6 },
      { x: 0.6, y: 0.4, r: 170, vx: -0.22, vy: -0.18, color: [244, 114, 182], phase: 7.5 },
    ]

    function drawBlob(blob, t) {
      const cx = blob.x * canvas.width + Math.sin(t * 0.2 + blob.phase) * 50
      const cy = blob.y * canvas.height + Math.cos(t * 0.15 + blob.phase * 0.7) * 40
      const pulsedR = blob.r + Math.sin(t * 0.3 + blob.phase) * 20

      // Draw organic blob shape using bezier curves
      const points = 8
      ctx.beginPath()

      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2
        const noise = Math.sin(angle * 3 + t * 1.2 + blob.phase) * 20 +
                      Math.cos(angle * 2 - t * 0.8 + blob.phase * 0.5) * 15
        const r = pulsedR + noise
        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          // Use quadratic curves for smoother shape
          const prevAngle = ((i - 0.5) / points) * Math.PI * 2
          const prevNoise = Math.sin(prevAngle * 3 + t * 1.2 + blob.phase) * 20 +
                            Math.cos(prevAngle * 2 - t * 0.8 + blob.phase * 0.5) * 15
          const cpR = pulsedR + prevNoise
          const cpX = cx + Math.cos(prevAngle) * cpR * 1.1
          const cpY = cy + Math.sin(prevAngle) * cpR * 1.1
          ctx.quadraticCurveTo(cpX, cpY, x, y)
        }
      }

      ctx.closePath()

      // Gradient fill
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulsedR * 1.3)
      gradient.addColorStop(0, `rgba(${blob.color[0]}, ${blob.color[1]}, ${blob.color[2]}, 0.06)`)
      gradient.addColorStop(0.4, `rgba(${blob.color[0]}, ${blob.color[1]}, ${blob.color[2]}, 0.03)`)
      gradient.addColorStop(1, `rgba(${blob.color[0]}, ${blob.color[1]}, ${blob.color[2]}, 0)`)

      ctx.fillStyle = gradient
      ctx.filter = 'blur(30px)'
      ctx.fill()
      ctx.filter = 'none'
    }

    function animate() {
      time += 0.008
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'lighter'

      blobs.forEach(blob => drawBlob(blob, time))

      ctx.globalCompositeOperation = 'source-over'
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
        pointerEvents: 'none'
      }}
    />
  )
}
