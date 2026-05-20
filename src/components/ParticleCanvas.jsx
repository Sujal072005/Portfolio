import { useCallback, useMemo } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { useState, useEffect } from 'react'

export default function ParticleCanvas() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setInit(true))
  }, [])

  const options = useMemo(() => ({
    fullScreen: { enable: false },
    fpsLimit: 60,
    particles: {
      number: { value: 35, density: { enable: true, width: 1200, height: 800 } },
      color: {
        value: ['#8b5cf6', '#ec4899', '#06b6d4', '#a78bfa', '#f472b6'],
        animation: { enable: true, speed: 2, sync: false }
      },
      shape: { type: ['circle', 'star'] },
      opacity: {
        value: { min: 0.05, max: 0.3 },
        animation: { enable: true, speed: 0.15, startValue: 'random', sync: false }
      },
      size: {
        value: { min: 1, max: 4 },
        animation: { enable: true, speed: 0.5, startValue: 'random', sync: false }
      },
      links: {
        enable: true,
        distance: 140,
        color: '#8b5cf6',
        opacity: 0.08,
        width: 1,
        triangles: { enable: true, opacity: 0.015 }
      },
      move: {
        enable: true,
        speed: { min: 0.05, max: 0.2 },
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'bounce' },
        attract: { enable: true, rotate: { x: 600, y: 1200 } }
      },
      twinkle: {
        particles: { enable: true, frequency: 0.03, opacity: 0.8, color: { value: '#ffffff' } }
      }
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: ['grab', 'bubble'] },
        onClick: { enable: true, mode: 'push' }
      },
      modes: {
        grab: { distance: 180, links: { opacity: 0.25, color: '#a78bfa' } },
        bubble: { distance: 200, size: 6, duration: 0.3, opacity: 0.6 },
        push: { quantity: 3 },
        repulse: { distance: 150, duration: 0.4 }
      }
    },
    detectRetina: true,
    smooth: true
  }), [])

  if (!init) return null

  return (
    <Particles
      id="tsparticles-bg"
      options={options}
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
