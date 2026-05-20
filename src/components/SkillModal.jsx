import { motion, AnimatePresence } from 'framer-motion'

const skillData = {
  'Python': { level: 90, desc: 'My primary language for AI/ML, backend, and scripting. Used in nearly every project.', projects: ['AI Chatbot Platform', 'Gesture Recognition', 'AI Image Generator'], icon: '🐍', color: '#3776ab' },
  'JavaScript': { level: 85, desc: 'Building dynamic web experiences, full-stack apps, and interactive UIs.', projects: ['ML Dashboard', 'Portfolio Website'], icon: '⚡', color: '#f7df1e' },
  'TypeScript': { level: 80, desc: 'Type-safe JavaScript for larger, scalable applications and APIs.', projects: ['ML Dashboard'], icon: '🔷', color: '#3178c6' },
  'Java': { level: 75, desc: 'Used for data structures, algorithms, and competitive programming.', projects: ['LeetCode Solutions'], icon: '☕', color: '#ed8b00' },
  'C++': { level: 70, desc: 'High-performance computing, competitive programming, and system-level work.', projects: ['LeetCode Solutions'], icon: '⚙️', color: '#00599c' },
  'SQL': { level: 65, desc: 'Database queries, data analysis, and backend integrations.', projects: ['ML Dashboard', 'AI Chatbot Platform'], icon: '🗃️', color: '#336791' },
  'React': { level: 85, desc: 'My go-to frontend framework. Component-based UIs with hooks and state management.', projects: ['ML Dashboard', 'Portfolio Website'], icon: '⚛️', color: '#61dafb' },
  'Next.js': { level: 80, desc: 'Server-side rendering, static generation, and full-stack React applications.', projects: ['ML Dashboard'], icon: '▲', color: '#ffffff' },
  'Node.js': { level: 85, desc: 'Backend APIs, real-time servers, and full-stack JavaScript applications.', projects: ['ML Dashboard', 'AI Chatbot Platform'], icon: '🟢', color: '#68a063' },
  'Express': { level: 75, desc: 'RESTful APIs and middleware for Node.js backend services.', projects: ['ML Dashboard'], icon: '🚂', color: '#ffffff' },
  'HTML/CSS': { level: 80, desc: 'Semantic markup, responsive layouts, animations, and modern CSS techniques.', projects: ['Portfolio Website'], icon: '🎨', color: '#e34f26' },
  'MongoDB': { level: 70, desc: 'NoSQL database for flexible, document-based data storage.', projects: ['ML Dashboard', 'AI Chatbot Platform'], icon: '🍃', color: '#47a248' },
  'TensorFlow': { level: 80, desc: 'Deep learning framework for building and training neural networks.', projects: ['AI Image Generator', 'Gesture Recognition'], icon: '🧠', color: '#ff6f00' },
  'PyTorch': { level: 85, desc: 'My preferred ML framework. Dynamic computation graphs and research-friendly.', projects: ['AI Image Generator'], icon: '🔥', color: '#ee4c2c' },
  'Scikit-learn': { level: 75, desc: 'Classical ML algorithms, data preprocessing, and model evaluation.', projects: ['ML Dashboard'], icon: '📊', color: '#f7931e' },
  'Hugging Face': { level: 70, desc: 'Transformers, pre-trained models, and NLP pipelines.', projects: ['AI Chatbot Platform'], icon: '🤗', color: '#ffbd45' },
  'OpenAI API': { level: 75, desc: 'GPT-4 integration, prompt engineering, and conversational AI.', projects: ['AI Chatbot Platform'], icon: '🤖', color: '#412991' },
  'LangChain': { level: 70, desc: 'Building LLM-powered apps with chains, agents, and RAG pipelines.', projects: ['AI Chatbot Platform'], icon: '🔗', color: '#1c3c3c' },
  'Git': { level: 85, desc: 'Version control, branching strategies, and collaborative workflows.', projects: ['All Projects'], icon: '📝', color: '#f05032' },
  'Docker': { level: 75, desc: 'Containerization for consistent dev/prod environments and deployment.', projects: ['ML Dashboard'], icon: '🐳', color: '#2496ed' },
  'AWS': { level: 70, desc: 'Cloud services — EC2, S3, Lambda, and deployment pipelines.', projects: ['ML Dashboard'], icon: '☁️', color: '#ff9900' },
  'VS Code': { level: 80, desc: 'My daily driver IDE with custom extensions and productivity workflows.', projects: ['All Projects'], icon: '💻', color: '#007acc' },
  'Linux': { level: 65, desc: 'Server administration, shell scripting, and development environments.', projects: ['ML Dashboard'], icon: '🐧', color: '#fcc624' },
  'Jupyter': { level: 70, desc: 'Interactive notebooks for ML experimentation and data analysis.', projects: ['AI Image Generator', 'Gesture Recognition'], icon: '📓', color: '#f37626' },
}

export default function SkillModal({ skill, onClose }) {
  const data = skillData[skill]
  if (!data) return null

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          style={{ width: '100%', maxWidth: 440, background: '#0d0d18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(139,92,246,0.08)' }}>

          {/* Header with color accent */}
          <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${data.color}, #8b5cf6)` }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                {data.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#eaeaf0' }}>{skill}</h3>
                <span style={{ fontSize: '0.8rem', color: '#9d9db5' }}>Proficiency</span>
              </div>
              <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#9d9db5', padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Outfit,sans-serif' }}>✕</button>
            </div>

            {/* Proficiency Bar */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9d9db5', marginBottom: 6 }}>
                <span>Level</span>
                <span style={{ color: data.color, fontWeight: 700 }}>{data.level}%</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.level}%` }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  style={{ height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${data.color}, #8b5cf6)`, boxShadow: `0 0 15px ${data.color}40` }}
                />
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '20px 28px 28px' }}>
            <p style={{ fontSize: '0.95rem', color: '#9d9db5', lineHeight: 1.7, margin: '0 0 20px' }}>{data.desc}</p>

            <div style={{ fontSize: '0.78rem', color: '#5e5e7a', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 10 }}>Used in Projects</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {data.projects.map((p, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  style={{ padding: '8px 16px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 10, fontSize: '0.82rem', color: '#a78bfa', fontWeight: 500 }}>
                  {p}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
