import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const botResponses = {
  'hello': "Hey there! 👋 I'm Sujal's portfolio bot. Ask me anything about him!",
  'hi': "Hi! 👋 Want to know about Sujal's skills, projects, or experience?",
  'skills': "Sujal is skilled in Python, JavaScript, React, Node.js, TensorFlow, PyTorch, and more! He's currently deep into Gen AI & LLMs 🤖",
  'projects': "Sujal has built: 🤖 AI Chatbot Platform, 👁️ Gesture Recognition System, 📊 ML Dashboard, 🎨 AI Image Generator, and many more!",
  'experience': "Sujal is a Software Developer Engineer learning ML & Gen AI. He's solved 400+ LeetCode problems and built 10+ projects! 🚀",
  'leetcode': "400+ problems solved! 💪 180 Easy, 170 Medium, 50 Hard. Sujal loves algorithmic problem solving!",
  'language': "Python is Sujal's favorite! 🐍 But he's also proficient in JavaScript, TypeScript, Java, and C++.",
  'contact': "You can reach Sujal via the contact form below, or through GitHub, LinkedIn, or Twitter! 📧",
  'ai': "Sujal is passionate about Generative AI, LLMs, prompt engineering, RAG pipelines, and building AI-powered applications! 🧠",
  'hobby': "When not coding, Sujal explores AI research papers, contributes to open-source, and experiments with new frameworks! 🔬",
  'hire': "Sujal is currently available for opportunities! Check the contact section to reach out 💼",
  'fun': "Fun fact: Sujal's coffee consumption is ∞ cups per day ☕ and he once debugged code in his dreams! 😄",
}

function getResponse(input) {
  const lower = input.toLowerCase()
  for (const [key, val] of Object.entries(botResponses)) {
    if (lower.includes(key)) return val
  }
  return "Great question! 🤔 Try asking about Sujal's skills, projects, experience, leetcode, AI work, or hobbies!"
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ from: 'bot', text: "Hey! 👋 I'm Sujal's AI assistant. Ask me anything about him!" }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(m => [...m, { from: 'user', text: userMsg }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages(m => [...m, { from: 'bot', text: getResponse(userMsg) }])
      setTyping(false)
    }, 600 + Math.random() * 800)
  }

  return (
    <>
      {/* Toggle */}
      <motion.button onClick={() => setOpen(o => !o)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        style={{ position:'fixed', bottom:24, right:24, zIndex:9999, width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', border:'none', color:'white', fontSize:'1.5rem', cursor:'pointer', boxShadow:'0 8px 30px rgba(139,92,246,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        {open ? '✕' : '💬'}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, y:20, scale:0.9 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:20, scale:0.9 }} transition={{ duration:0.25, ease:[0.22,1,0.36,1] }}
            style={{ position:'fixed', bottom:90, right:24, zIndex:9999, width:360, maxHeight:480, background:'#0d0d18', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden', boxShadow:'0 30px 60px rgba(0,0,0,0.5)', display:'flex', flexDirection:'column' }}>
            {/* Header */}
            <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#8b5cf6,#ec4899)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>🤖</div>
              <div><div style={{ fontWeight:700, fontSize:'0.9rem', color:'#eaeaf0' }}>Sujal's AI Bot</div><div style={{ fontSize:'0.7rem', color:'#22c55e' }}>● Online</div></div>
            </div>
            {/* Messages */}
            <div style={{ flex:1, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:10, maxHeight:320 }}>
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} style={{
                  alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%', padding:'10px 14px', borderRadius: m.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.from === 'user' ? 'linear-gradient(135deg,#8b5cf6,#6d28d9)' : 'rgba(255,255,255,0.05)',
                  color: '#eaeaf0', fontSize:'0.85rem', lineHeight:1.5
                }}>{m.text}</motion.div>
              ))}
              {typing && <div style={{ color:'#9d9db5', fontSize:'0.8rem', fontStyle:'italic' }}>typing...</div>}
              <div ref={bottomRef} />
            </div>
            {/* Input */}
            <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:8 }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about Sujal..." style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'10px 14px', color:'#eaeaf0', fontSize:'0.85rem', outline:'none', fontFamily:'Outfit,sans-serif' }} />
              <button onClick={send} style={{ background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', border:'none', borderRadius:10, padding:'10px 16px', color:'white', cursor:'pointer', fontSize:'0.9rem' }}>→</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
