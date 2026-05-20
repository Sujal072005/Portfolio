import { useEffect, useRef } from 'react'

export default function StarField() {
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

    // Create stars with different layers (parallax depth)
    const starCount = 100
    const stars = []

    for (let i = 0; i < starCount; i++) {
      const depth = Math.random() * 3 + 1 // 1-4 depth layers
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 / depth + 0.3,
        speed: (0.008 / depth) + Math.random() * 0.004,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        depth,
        hue: Math.random() > 0.85 ? (Math.random() > 0.5 ? 260 : 200) : 0, // most white, some purple/cyan
        saturation: Math.random() > 0.85 ? 80 : 0,
      })
    }

    // Shooting stars
    const shootingStars = []
    let lastShootingStar = 0

    function createShootingStar() {
      const startX = Math.random() * canvas.width
      const startY = Math.random() * canvas.height * 0.4
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5
      shootingStars.push({
        x: startX,
        y: startY,
        length: 80 + Math.random() * 120,
        speed: 8 + Math.random() * 8,
        angle,
        opacity: 1,
        decay: 0.015 + Math.random() * 0.01,
        trail: []
      })
    }

    let time = 0

    function animate() {
      time += 1
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset)
        const opacity = 0.3 + twinkle * 0.35 + 0.35
        const size = star.size * (0.8 + twinkle * 0.2)

        // Glow effect for brighter stars
        if (star.size > 1.2) {
          const glowGrad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, size * 4)
          if (star.hue > 0) {
            glowGrad.addColorStop(0, `hsla(${star.hue}, ${star.saturation}%, 75%, ${opacity * 0.3})`)
          } else {
            glowGrad.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.15})`)
          }
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
          ctx.fillStyle = glowGrad
          ctx.fillRect(star.x - size * 4, star.y - size * 4, size * 8, size * 8)
        }

        ctx.beginPath()
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2)
        if (star.hue > 0) {
          ctx.fillStyle = `hsla(${star.hue}, ${star.saturation}%, 80%, ${opacity})`
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        }
        ctx.fill()

        // Subtle drift
        star.y += star.speed
        if (star.y > canvas.height + 5) {
          star.y = -5
          star.x = Math.random() * canvas.width
        }
      })

      // Shooting stars
      if (time - lastShootingStar > 600 + Math.random() * 800) {
        createShootingStar()
        lastShootingStar = time
      }

      shootingStars.forEach((ss, idx) => {
        ss.x += Math.cos(ss.angle) * ss.speed
        ss.y += Math.sin(ss.angle) * ss.speed
        ss.opacity -= ss.decay
        ss.trail.push({ x: ss.x, y: ss.y, opacity: ss.opacity })

        if (ss.trail.length > 20) ss.trail.shift()

        // Draw trail
        for (let i = 0; i < ss.trail.length; i++) {
          const t = ss.trail[i]
          const trailOpacity = (i / ss.trail.length) * t.opacity
          const trailSize = (i / ss.trail.length) * 2.5

          ctx.beginPath()
          ctx.arc(t.x, t.y, trailSize, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${trailOpacity * 0.8})`
          ctx.fill()
        }

        // Draw head with glow
        const headGrad = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 8)
        headGrad.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`)
        headGrad.addColorStop(0.5, `rgba(139, 92, 246, ${ss.opacity * 0.5})`)
        headGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = headGrad
        ctx.fillRect(ss.x - 8, ss.y - 8, 16, 16)

        if (ss.opacity <= 0) shootingStars.splice(idx, 1)
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
        pointerEvents: 'none'
      }}
    />
  )
}
