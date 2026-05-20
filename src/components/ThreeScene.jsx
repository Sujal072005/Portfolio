import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, OrbitControls, Edges } from '@react-three/drei'
import * as THREE from 'three'

function SkillCube() {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  const S = 3.5 // Size of the cube
  const h = S / 2
  const eps = 0.15 // Offset to push text slightly outward from the edges
  
  const skills = [
    'React', 'Python', 'Node.js', 'TensorFlow', 
    'PyTorch', 'TypeScript', 'Docker', 'AWS', 
    'MongoDB', 'Next.js', 'LangChain', 'Git'
  ]

  const edges = [
    // X-axis edges
    { pos: [0, h+eps, h+eps], rot: [0, 0, 0], text: skills[0] }, 
    { pos: [0, -h-eps, h+eps], rot: [0, 0, 0], text: skills[1] },
    { pos: [0, h+eps, -h-eps], rot: [0, Math.PI, 0], text: skills[2] },
    { pos: [0, -h-eps, -h-eps], rot: [0, Math.PI, 0], text: skills[3] },

    // Y-axis edges
    { pos: [h+eps, 0, h+eps], rot: [0, 0, Math.PI / 2], text: skills[4] },
    { pos: [-h-eps, 0, h+eps], rot: [0, 0, -Math.PI / 2], text: skills[5] },
    { pos: [h+eps, 0, -h-eps], rot: [0, Math.PI, Math.PI / 2], text: skills[6] },
    { pos: [-h-eps, 0, -h-eps], rot: [0, Math.PI, -Math.PI / 2], text: skills[7] },

    // Z-axis edges
    { pos: [h+eps, h+eps, 0], rot: [0, Math.PI / 2, 0], text: skills[8] },
    { pos: [-h-eps, h+eps, 0], rot: [0, -Math.PI / 2, 0], text: skills[9] },
    { pos: [h+eps, -h-eps, 0], rot: [0, Math.PI / 2, 0], text: skills[10] },
    { pos: [-h-eps, -h-eps, 0], rot: [0, -Math.PI / 2, 0], text: skills[11] },
  ]

  return (
    <group ref={meshRef}>
      <mesh>
        <boxGeometry args={[S, S, S]} />
        <meshPhysicalMaterial 
          color="#0d0d18"
          transparent
          opacity={0.85}
          roughness={0.1}
          metalness={0.8}
          clearcoat={1}
        />
        <Edges scale={1} threshold={15} color="#ec4899" />
      </mesh>
      
      {edges.map((edge, i) => (
        <Text
          key={i}
          position={edge.pos}
          rotation={edge.rot}
          fontSize={0.45}
          color="#8b5cf6"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2"
          outlineWidth={0.03}
          outlineColor="#06060e"
        >
          {edge.text}
        </Text>
      ))}
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#06b6d4" />
      <SkillCube />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1}
      />
    </>
  )
}

export default function ThreeScene() {
  return (
    <div style={{
      width: '100%',
      height: '450px',
      borderRadius: '20px',
      overflow: 'hidden',
      position: 'relative',
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(6,6,14,0.5)'
    }}>
      <div style={{
        position: 'absolute',
        inset: '-2px',
        borderRadius: '22px',
        background: 'conic-gradient(from 0deg, #8b5cf6, #ec4899, #06b6d4, #22c55e, #8b5cf6)',
        zIndex: -1,
        opacity: 0.15,
        filter: 'blur(8px)',
        animation: 'rotateBorder 6s linear infinite'
      }} />

      <Suspense fallback={
        <div style={{
          width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'JetBrains Mono', monospace", color: '#8b5cf6', fontSize: '0.9rem'
        }}>
          <span style={{ animation: 'blink 1s step-end infinite' }}>Loading 3D Cube...</span>
        </div>
      }>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          dpr={[1, 2]}
          style={{ background: 'transparent' }}
        >
          <Scene />
        </Canvas>
      </Suspense>

      <div style={{
        position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)',
        letterSpacing: '2px', textTransform: 'uppercase', pointerEvents: 'none'
      }}>
        Interactive • Drag to rotate
      </div>
    </div>
  )
}
