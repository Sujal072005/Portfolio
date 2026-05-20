import { Suspense, useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

const SHAPES = [
  { id: 'knot', label: 'Torus Knot' },
  { id: 'icosahedron', label: 'Icosahedron' },
  { id: 'torus', label: 'Torus' },
  { id: 'dodecahedron', label: 'Dodecahedron' }
]

function ToonShape({ activeShapeId }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4
    }
  })

  return (
    <mesh ref={meshRef} scale={1.5}>
      {activeShapeId === 'knot' && <torusKnotGeometry args={[1, 0.3, 128, 16]} />}
      {activeShapeId === 'icosahedron' && <icosahedronGeometry args={[1.5, 0]} />}
      {activeShapeId === 'torus' && <torusGeometry args={[1.2, 0.4, 16, 64]} />}
      {activeShapeId === 'dodecahedron' && <dodecahedronGeometry args={[1.5, 0]} />}
      
      <meshToonMaterial color="#8b5cf6" />
    </mesh>
  )
}

export default function SplineScene() {
  const [activeShape, setActiveShape] = useState(SHAPES[0])

  return (
    <div style={{
      width: '100%',
      height: '400px',
      borderRadius: '20px',
      overflow: 'hidden',
      position: 'relative',
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(6,6,14,0.5)'
    }}>
      {/* Gradient border glow */}
      <div style={{
        position: 'absolute',
        inset: '-2px',
        borderRadius: '22px',
        background: 'conic-gradient(from 180deg, #ec4899, #8b5cf6, #06b6d4, #ec4899)',
        zIndex: -1,
        opacity: 0.12,
        filter: 'blur(8px)',
        animation: 'rotateBorder 8s linear infinite'
      }} />

      <Suspense fallback={
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'JetBrains Mono', monospace", color: '#8b5cf6', fontSize: '0.9rem'
        }}>
          Loading Toon Shape...
        </div>
      }>
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]} style={{ background: 'transparent' }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
          <ToonShape activeShapeId={activeShape.id} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </Suspense>

      {/* Shape Selector UI */}
      <div style={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        padding: '6px',
        background: 'rgba(6,6,14,0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '30px',
        zIndex: 5
      }}>
        {SHAPES.map((shape) => (
          <button
            key={shape.id}
            onClick={() => setActiveShape(shape)}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: 'none',
              background: activeShape.id === shape.id ? 'rgba(139,92,246,0.8)' : 'transparent',
              color: activeShape.id === shape.id ? '#fff' : 'rgba(255,255,255,0.6)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {shape.label}
          </button>
        ))}
      </div>

      {/* Label */}
      <div style={{
        position: 'absolute',
        bottom: 14,
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.72rem',
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        pointerEvents: 'none',
        zIndex: 3
      }}>
        Toon 3D • Interactive
      </div>
    </div>
  )
}
