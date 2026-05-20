import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const faces = [
  { label:'React', color:'#61dafb', symbol:'⚛️' },
  { label:'Python', color:'#3776ab', symbol:'🐍' },
  { label:'TensorFlow', color:'#ff6f00', symbol:'🧠' },
  { label:'Node.js', color:'#68a063', symbol:'🟢' },
  { label:'PyTorch', color:'#ee4c2c', symbol:'🔥' },
  { label:'Docker', color:'#2496ed', symbol:'🐳' },
]

export default function TechCube() {
  return (
    <div className="cube-scene">
      <motion.div className="cube" animate={{rotateX:[0,360],rotateY:[0,360]}} transition={{duration:20,repeat:Infinity,ease:'linear'}}>
        {faces.map((f, i) => (
          <div key={i} className={`cube-face cube-face-${i}`} style={{
            '--face-color': f.color
          }}>
            <span className="cube-symbol">{f.symbol}</span>
            <span className="cube-label">{f.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
