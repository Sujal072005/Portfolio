import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const projects = [
  {
    title: 'AI Chatbot Platform',
    icon: '🤖',
    shortDesc: 'Conversational AI with GPT-4 and RAG',
    fullDesc: 'A production-grade conversational AI platform powered by GPT-4 with memory, context awareness, and a custom RAG pipeline for knowledge retrieval. Features multi-turn conversations, personality customization, and streaming responses.',
    tags: ['Python', 'GPT-4', 'LangChain', 'FastAPI', 'Redis'],
    metrics: [
      { label: 'Response Time', value: '<200ms' },
      { label: 'Accuracy', value: '94%' },
      { label: 'Conversations', value: '10K+' },
    ],
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    features: ['RAG Pipeline', 'Streaming Responses', 'Multi-turn Context', 'Personality Engine'],
    status: 'Production'
  },
  {
    title: 'Gesture Recognition',
    icon: '👁️',
    shortDesc: 'Real-time hand tracking & visual effects',
    fullDesc: 'A real-time hand gesture recognition system using computer vision that creates interactive particle effects and visual responses based on hand movements. Supports fist, pinch, and swipe gestures.',
    tags: ['Python', 'OpenCV', 'MediaPipe', 'WebGL'],
    metrics: [
      { label: 'FPS', value: '60fps' },
      { label: 'Gestures', value: '12+' },
      { label: 'Latency', value: '<50ms' },
    ],
    gradient: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
    features: ['Hand Tracking', 'Particle Effects', 'Gesture Library', 'Real-time Processing'],
    status: 'Complete'
  },
  {
    title: 'ML Dashboard',
    icon: '📊',
    shortDesc: 'Full-stack model performance analytics',
    fullDesc: 'A comprehensive full-stack dashboard for monitoring model performance, visualizing training metrics, dataset analytics, and A/B testing results. Features real-time WebSocket updates and interactive charting.',
    tags: ['React', 'Node.js', 'MongoDB', 'D3.js', 'Socket.io'],
    metrics: [
      { label: 'Models Tracked', value: '50+' },
      { label: 'Uptime', value: '99.9%' },
      { label: 'Data Points', value: '1M+' },
    ],
    gradient: 'linear-gradient(135deg, #22c55e, #06b6d4)',
    features: ['Real-time Updates', 'Interactive Charts', 'A/B Testing', 'Auto Alerts'],
    status: 'Production'
  },
  {
    title: 'AI Image Generator',
    icon: '🎨',
    shortDesc: 'Text-to-image with custom fine-tuned models',
    fullDesc: 'A text-to-image generation platform using Stable Diffusion with custom fine-tuned models. Features style transfer, inpainting, outpainting, and prompt engineering tools with a gallery system.',
    tags: ['Stable Diffusion', 'Python', 'Flask', 'CUDA'],
    metrics: [
      { label: 'Gen Time', value: '<5s' },
      { label: 'Styles', value: '20+' },
      { label: 'Images', value: '50K+' },
    ],
    gradient: 'linear-gradient(135deg, #f59e0b, #ec4899)',
    features: ['Style Transfer', 'Inpainting', 'Prompt Engineering', 'Gallery System'],
    status: 'Beta'
  },
]

function ProjectDetailCard({ project, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, rotateY: -90 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'var(--glass)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      {/* Gradient header */}
      <div style={{
        height: 100, background: project.gradient, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <motion.span
          animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ fontSize: '3rem', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
        >
          {project.icon}
        </motion.span>
        <div style={{
          position: 'absolute', top: 12, right: 12,
          padding: '4px 12px', borderRadius: 20,
          background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)',
          fontSize: '0.7rem', color: 'white', fontWeight: 600,
          fontFamily: "'JetBrains Mono', monospace"
        }}>
          {project.status}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--text)' }}>
          {project.title}
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.7, margin: '0 0 16px' }}>
          {project.fullDesc}
        </p>

        {/* Metrics */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {project.metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              style={{
                flex: 1, padding: '12px', textAlign: 'center',
                background: 'rgba(139,92,246,0.06)', borderRadius: 12,
                border: '1px solid rgba(139,92,246,0.1)'
              }}
            >
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent2)', fontFamily: "'JetBrains Mono', monospace" }}>
                {m.value}
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {project.features.map((f, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              style={{
                padding: '5px 12px', borderRadius: 8,
                background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)',
                fontSize: '0.72rem', color: 'var(--accent2)', fontWeight: 500
              }}
            >
              {f}
            </motion.span>
          ))}
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {project.tags.map((t, i) => (
            <span key={i} style={{
              padding: '4px 10px', borderRadius: 6,
              background: 'rgba(255,255,255,0.04)', fontSize: '0.68rem',
              color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace"
            }}>
              {t}
            </span>
          ))}
        </div>

        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02, x: -4 }}
          whileTap={{ scale: 0.98 }}
          style={{
            padding: '8px 20px', borderRadius: 10, border: '1px solid var(--glass-border)',
            background: 'var(--glass)', color: 'var(--text2)', cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 6
          }}
        >
          ← Back to overview
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function ProjectShowcase() {
  const [expandedProject, setExpandedProject] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref}>
      <AnimatePresence mode="wait">
        {expandedProject !== null ? (
          <ProjectDetailCard
            key="detail"
            project={projects[expandedProject]}
            onBack={() => setExpandedProject(null)}
          />
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}
          >
            {projects.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setExpandedProject(i)}
                style={{
                  background: 'var(--glass)', border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius)', overflow: 'hidden', cursor: 'pointer',
                  transition: 'box-shadow 0.3s ease',
                  position: 'relative'
                }}
                className="hover-glow"
              >
                {/* Mini gradient bar */}
                <div style={{ height: 3, background: p.gradient }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                      style={{ fontSize: '1.8rem' }}
                    >
                      {p.icon}
                    </motion.span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>{p.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text3)' }}>{p.shortDesc}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {p.tags.slice(0, 3).map((t, j) => (
                      <span key={j} style={{
                        padding: '3px 10px', borderRadius: 6,
                        background: 'rgba(139,92,246,0.08)',
                        fontSize: '0.68rem', color: 'var(--accent2)'
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div style={{
                    marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: '0.7rem', color: 'var(--text3)'
                  }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{p.status}</span>
                    <motion.span
                      whileHover={{ x: 4 }}
                      style={{ color: 'var(--accent2)' }}
                    >
                      View Details →
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
