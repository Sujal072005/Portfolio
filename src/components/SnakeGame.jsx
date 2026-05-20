import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GRID = 20
const SPEED = 100

export default function SnakeGame({ active, onClose }) {
  const canvasRef = useRef(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const dirRef = useRef({ x: 1, y: 0 })
  const snakeRef = useRef([{ x: 10, y: 10 }])
  const foodRef = useRef({ x: 15, y: 15 })
  const intervalRef = useRef(null)

  const spawnFood = useCallback((canvas) => {
    const cols = Math.floor(canvas.width / GRID)
    const rows = Math.floor(canvas.height / GRID)
    foodRef.current = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows)
    }
  }, [])

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = 400
    canvas.height = 400

    snakeRef.current = [{ x: 10, y: 10 }]
    dirRef.current = { x: 1, y: 0 }
    setScore(0)
    setGameOver(false)
    spawnFood(canvas)

    const handleKey = (e) => {
      const d = dirRef.current
      if (e.key === 'ArrowUp' && d.y !== 1) dirRef.current = { x: 0, y: -1 }
      if (e.key === 'ArrowDown' && d.y !== -1) dirRef.current = { x: 0, y: 1 }
      if (e.key === 'ArrowLeft' && d.x !== 1) dirRef.current = { x: -1, y: 0 }
      if (e.key === 'ArrowRight' && d.x !== -1) dirRef.current = { x: 1, y: 0 }
      e.preventDefault()
    }
    window.addEventListener('keydown', handleKey)

    intervalRef.current = setInterval(() => {
      const snake = snakeRef.current
      const head = { x: snake[0].x + dirRef.current.x, y: snake[0].y + dirRef.current.y }
      const cols = Math.floor(canvas.width / GRID)
      const rows = Math.floor(canvas.height / GRID)

      if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || snake.some(s => s.x === head.x && s.y === head.y)) {
        setGameOver(true)
        clearInterval(intervalRef.current)
        return
      }

      snake.unshift(head)
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(s => s + 10)
        spawnFood(canvas)
      } else {
        snake.pop()
      }

      // Draw
      ctx.fillStyle = '#06060e'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Grid
      ctx.strokeStyle = 'rgba(139,92,246,0.05)'
      for (let i = 0; i < cols; i++) { ctx.beginPath(); ctx.moveTo(i*GRID,0); ctx.lineTo(i*GRID,canvas.height); ctx.stroke() }
      for (let i = 0; i < rows; i++) { ctx.beginPath(); ctx.moveTo(0,i*GRID); ctx.lineTo(canvas.width,i*GRID); ctx.stroke() }

      // Snake
      snake.forEach((s, i) => {
        const hue = (260 + i * 5) % 360
        ctx.fillStyle = i === 0 ? '#8b5cf6' : `hsl(${hue}, 70%, 55%)`
        ctx.shadowBlur = i === 0 ? 15 : 5
        ctx.shadowColor = '#8b5cf6'
        ctx.beginPath()
        ctx.roundRect(s.x * GRID + 1, s.y * GRID + 1, GRID - 2, GRID - 2, 4)
        ctx.fill()
      })

      // Food
      ctx.shadowBlur = 15
      ctx.shadowColor = '#ec4899'
      ctx.fillStyle = '#ec4899'
      ctx.beginPath()
      ctx.arc(foodRef.current.x * GRID + GRID/2, foodRef.current.y * GRID + GRID/2, GRID/2 - 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }, SPEED)

    return () => {
      clearInterval(intervalRef.current)
      window.removeEventListener('keydown', handleKey)
    }
  }, [active, spawnFood])

  if (!active) return null

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:'fixed', inset:0, zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.8)', backdropFilter:'blur(10px)' }}>
      <motion.div initial={{scale:0.8,y:30}} animate={{scale:1,y:0}} transition={{type:'spring',stiffness:200}}
        style={{ background:'#0d0d18', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:24, textAlign:'center', boxShadow:'0 30px 80px rgba(0,0,0,0.5)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", color:'#8b5cf6', fontSize:'0.9rem' }}>🐍 Snake Game</span>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", color:'#eaeaf0', fontSize:'1.1rem', fontWeight:700 }}>Score: {score}</span>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, color:'#9d9db5', padding:'4px 12px', cursor:'pointer', fontSize:'0.8rem' }}>✕ Close</button>
        </div>
        <canvas ref={canvasRef} style={{ borderRadius:12, border:'1px solid rgba(255,255,255,0.08)' }} />
        {gameOver && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{ marginTop:16, color:'#ec4899', fontFamily:"'JetBrains Mono',monospace", fontSize:'1.2rem', fontWeight:700 }}>
            Game Over! Score: {score}
            <button onClick={() => { setGameOver(false); snakeRef.current=[{x:10,y:10}]; dirRef.current={x:1,y:0}; setScore(0); }}
              style={{ display:'block', margin:'12px auto 0', padding:'10px 24px', background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', border:'none', borderRadius:10, color:'white', fontWeight:700, cursor:'pointer', fontFamily:'Outfit,sans-serif' }}>
              Play Again
            </button>
          </motion.div>
        )}
        <div style={{ marginTop:12, color:'#5e5e7a', fontSize:'0.75rem', fontFamily:"'JetBrains Mono',monospace" }}>Use arrow keys to move</div>
      </motion.div>
    </motion.div>
  )
}
