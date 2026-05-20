import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function TiltCard({ children, className = '', glare = true }) {
  const ref = useRef(null)
  const [style, setStyle] = useState({})
  const [glareStyle, setGlareStyle] = useState({})

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -12
    const rotateY = ((x - centerX) / centerX) * 12

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`,
      transition: 'transform 0.1s ease'
    })

    if (glare) {
      const glareX = (x / rect.width) * 100
      const glareY = (y / rect.height) * 100
      setGlareStyle({
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(139,92,246,0.15) 0%, transparent 60%)`,
        opacity: 1
      })
    }
  }

  const handleLeave = () => {
    setStyle({ transform: 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)', transition: 'transform 0.5s ease' })
    setGlareStyle({ opacity: 0 })
  }

  return (
    <div ref={ref} className={`tilt-card-wrapper ${className}`} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ ...style, position: 'relative' }}>
      {glare && <div className="tilt-glare" style={glareStyle} />}
      {children}
    </div>
  )
}
