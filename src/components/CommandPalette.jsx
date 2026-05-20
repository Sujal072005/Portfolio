import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiSun, FiMoon, FiArrowRight, FiCommand, FiZap } from 'react-icons/fi'

export default function CommandPalette({ onNavigate, onToggleTheme, onTriggerMatrix, onTriggerGame, onTriggerTyping, theme }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)

  const allCommands = [
    { id:'about', label:'Go to About', icon:'👤', action:()=>onNavigate('about') },
    { id:'skills', label:'Go to Skills', icon:'⚡', action:()=>onNavigate('skills') },
    { id:'playground', label:'Go to Code Playground', icon:'🔮', action:()=>onNavigate('playground') },
    { id:'projects', label:'Go to Projects', icon:'📁', action:()=>onNavigate('projects') },
    { id:'journey', label:'Go to Journey', icon:'🗺️', action:()=>onNavigate('journey') },
    { id:'contact', label:'Go to Contact', icon:'📧', action:()=>onNavigate('contact') },
    { id:'hero', label:'Back to Top', icon:'🏠', action:()=>onNavigate('hero') },
    { id:'theme', label:`Toggle ${theme==='dark'?'Light':'Dark'} Mode`, icon: theme==='dark'?'☀️':'🌙', action:onToggleTheme },
    { id:'matrix', label:'Activate Matrix Rain', icon:'🎮', action:onTriggerMatrix },
    { id:'snake', label:'Play Snake Game', icon:'🐍', action:onTriggerGame },
    { id:'typing', label:'Typing Speed Challenge', icon:'⌨️', action:onTriggerTyping },
  ]

  const filtered = allCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setOpen(o => !o); setQuery(''); setSelected(0) }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => { if (open && inputRef.current) inputRef.current.focus() }, [open])

  useEffect(() => { setSelected(0) }, [query])

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && filtered[selected]) { filtered[selected].action(); setOpen(false) }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.15}}
          style={{ position:'fixed', inset:0, zIndex:99999, display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:'20vh', background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)' }}
          onClick={() => setOpen(false)}>
          <motion.div initial={{opacity:0,scale:0.95,y:-20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:-20}}
            transition={{duration:0.2,ease:[0.25,0.46,0.45,0.94]}}
            onClick={e => e.stopPropagation()}
            style={{ width:'100%', maxWidth:520, background:'#12121a', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden', boxShadow:'0 30px 80px rgba(0,0,0,0.5)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <FiSearch style={{color:'#8b5cf6',flexShrink:0}} />
              <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Type a command..." style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'#eaeaf0', fontSize:'1rem', fontFamily:'Outfit,sans-serif' }} />
              <kbd style={{ padding:'3px 8px', background:'rgba(255,255,255,0.06)', borderRadius:6, fontSize:'0.7rem', color:'#9d9db5', border:'1px solid rgba(255,255,255,0.08)' }}>ESC</kbd>
            </div>
            <div style={{ maxHeight:320, overflowY:'auto', padding:'8px' }}>
              {filtered.map((cmd, i) => (
                <div key={cmd.id} onClick={()=>{cmd.action();setOpen(false)}}
                  onMouseEnter={()=>setSelected(i)}
                  style={{
                    display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderRadius:10, cursor:'pointer',
                    background: i===selected ? 'rgba(139,92,246,0.12)' : 'transparent',
                    transition:'background 0.15s ease'
                  }}>
                  <span style={{fontSize:'1.2rem'}}>{cmd.icon}</span>
                  <span style={{flex:1,color: i===selected?'#eaeaf0':'#9d9db5',fontWeight:500,transition:'color 0.15s'}}>{cmd.label}</span>
                  {i===selected && <FiArrowRight style={{color:'#8b5cf6'}} />}
                </div>
              ))}
              {filtered.length === 0 && <div style={{textAlign:'center',color:'#5e5e7a',padding:20}}>No commands found</div>}
            </div>
            <div style={{ display:'flex', gap:16, padding:'12px 20px', borderTop:'1px solid rgba(255,255,255,0.06)', fontSize:'0.72rem', color:'#5e5e7a' }}>
              <span>↑↓ Navigate</span><span>↵ Select</span><span>Esc Close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
