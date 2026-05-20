import { useState, useEffect, useRef, useCallback } from 'react'
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap'
import { motion, AnimatePresence, useScroll, useInView, useSpring } from 'framer-motion'
import { FiArrowRight, FiExternalLink, FiGithub, FiSend, FiSun, FiMoon, FiDownload } from 'react-icons/fi'


import CodeWindow from './components/CodeWindow'
import Terminal from './components/Terminal'
import TiltCard from './components/TiltCard'
import MagneticButton from './components/MagneticButton'
import TextScramble from './components/TextScramble'

import MatrixRain from './components/MatrixRain'

import CommandPalette from './components/CommandPalette'
import SnakeGame from './components/SnakeGame'

import Fireworks from './components/Fireworks'
import ChatWidget from './components/ChatWidget'
import SkillModal from './components/SkillModal'
import TypingChallenge from './components/TypingChallenge'
import GitHubHeatmap from './components/GitHubHeatmap'
import CodePlayground from './components/CodePlayground'

import ProjectShowcase from './components/ProjectShowcase'
import SnowFall from './components/SnowFall'
import ThreeScene from './components/ThreeScene'
import SplineScene from './components/SplineScene'

const fadeUp={hidden:{opacity:0,y:60},visible:(d=0)=>({opacity:1,y:0,transition:{duration:0.8,delay:d,ease:[0.22,1,0.36,1]}})}
const fadeLeft={hidden:{opacity:0,x:-60},visible:(d=0)=>({opacity:1,x:0,transition:{duration:0.8,delay:d,ease:[0.22,1,0.36,1]}})}
const fadeRight={hidden:{opacity:0,x:60},visible:(d=0)=>({opacity:1,x:0,transition:{duration:0.8,delay:d,ease:[0.22,1,0.36,1]}})}
const stagger={visible:{transition:{staggerChildren:0.12}}}

function useTypingEffect(phrases){
  const [text,setText]=useState('');const [idx,setIdx]=useState(0);const [del,setDel]=useState(false)
  useEffect(()=>{const c=phrases[idx];const t=setTimeout(()=>{
    if(!del){setText(c.substring(0,text.length+1));if(text.length+1===c.length)setTimeout(()=>setDel(true),2000)}
    else{setText(c.substring(0,text.length-1));if(text.length-1===0){setDel(false);setIdx((idx+1)%phrases.length)}}
  },del?30:60);return()=>clearTimeout(t)},[text,idx,del]);return text
}

function Counter({target,duration=2}){
  const [count,setCount]=useState(0);const ref=useRef(null);const inView=useInView(ref,{once:true})
  useEffect(()=>{if(!inView)return;let s=0;const step=target/(duration*60)
    const i=setInterval(()=>{s+=step;if(s>=target){setCount(target);clearInterval(i)}else setCount(Math.floor(s))},1000/60)
    return()=>clearInterval(i)},[inView,target,duration])
  return <span ref={ref} className="stat-number text-gradient">{count}</span>
}

function Section({id,children,className=''}){
  const ref=useRef(null);const inView=useInView(ref,{once:true,margin:'-80px'})
  return <section id={id} ref={ref} className={`section-spacing ${className}`} style={{position:'relative',zIndex:1}}>{inView&&children}</section>
}

// LeetCode Ring
function LeetCodeCard(){
  const ref=useRef(null);const inView=useInView(ref,{once:true})
  const circ=2*Math.PI*52;const pct=400/600;const offset=circ*(1-pct)
  return(
    <motion.div ref={ref} className="leetcode-card hover-glow" initial={{opacity:0,scale:0.8}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:0.6,type:'spring'}}>
      <svg width="0" height="0"><defs><linearGradient id="lcGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs></svg>
      <div className="leetcode-ring">
        <svg viewBox="0 0 120 120"><circle className="ring-bg" cx="60" cy="60" r="52"/><circle className="ring-fill" cx="60" cy="60" r="52" strokeDasharray={circ} strokeDashoffset={inView?offset:circ}/></svg>
        <div className="leetcode-count"><Counter target={400}/></div>
      </div>
      <div className="leetcode-label">LeetCode Problems Solved</div>
      <div className="leetcode-breakdown">
        <div><span className="count lc-easy">180</span><span className="label">Easy</span></div>
        <div><span className="count lc-medium">170</span><span className="label">Medium</span></div>
        <div><span className="count lc-hard">50</span><span className="label">Hard</span></div>
      </div>
    </motion.div>
  )
}

// Floating code snippets
const snippets=['const ai = new NeuralNetwork()','model.fit(X_train, y_train)','import tensorflow as tf','async function fetchData() {}','git push origin main','docker build -t app .','npm install @langchain/core','torch.nn.Linear(256, 128)']
function FloatingCode(){return<>{snippets.map((c,i)=><div key={i} className="floating-code" style={{left:`${(i*13+5)%90}%`,animationDelay:`${i*2.5}s`,animationDuration:`${18+Math.random()*10}s`}}>{c}</div>)}</>}

function useParallax(){const[o,setO]=useState({x:0,y:0});useEffect(()=>{const h=e=>{setO({x:(e.clientX/window.innerWidth-0.5)*2,y:(e.clientY/window.innerHeight-0.5)*2})};window.addEventListener('mousemove',h);return()=>window.removeEventListener('mousemove',h)},[]);return o}

// Live Clock
function LiveClock(){const[time,setTime]=useState(new Date());useEffect(()=>{const i=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(i)},[]);const h=time.getHours(),m=time.getMinutes(),s=time.getSeconds(),ampm=h>=12?'PM':'AM';const h12=h%12||12;return(<div className="live-clock"><span className="clock-dot"/><span>{`${h12}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} ${ampm} IST`}</span></div>)}

export default function App(){
  const [scrolled,setScrolled]=useState(false)
  const [activeSection,setActiveSection]=useState('hero')
  const {scrollYProgress}=useScroll()
  const scaleX=useSpring(scrollYProgress,{stiffness:100,damping:30})
  const parallax=useParallax()
  const [theme,setTheme]=useState('dark')
  const [matrixActive,setMatrixActive]=useState(false)
  const [snakeActive,setSnakeActive]=useState(false)
  const [typingActive,setTypingActive]=useState(false)
  const [fireworksActive,setFireworksActive]=useState(false)
  const [selectedSkill,setSelectedSkill]=useState(null)
  const [toast,setToast]=useState('')
  const [formSent,setFormSent]=useState(false)
  const konamiRef=useRef([])
  const konamiCode=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

  const typedText=useTypingEffect(['intelligent systems.','machine learning models.','generative AI apps.','full-stack solutions.','the future with code.'])

  useEffect(()=>{const h=e=>{konamiRef.current.push(e.key);konamiRef.current=konamiRef.current.slice(-10);if(konamiRef.current.join(',')=== konamiCode.join(',')){setMatrixActive(true);konamiRef.current=[]}};window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h)},[])

  useEffect(()=>{const h=()=>{setScrolled(window.scrollY>50);['hero','about','skills','playground','projects','journey','contact'].forEach(id=>{const el=document.getElementById(id);if(el&&window.scrollY>=el.offsetTop-200&&window.scrollY<el.offsetTop+el.offsetHeight-200)setActiveSection(id)})};window.addEventListener('scroll',h);return()=>window.removeEventListener('scroll',h)},[])

  const toggleTheme=()=>{const next=theme==='dark'?'light':'dark';setTheme(next);document.body.className=next==='light'?'light':''}
  const scrollTo=id=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'})
  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(''),3000)}
  const handleSubmit=e=>{e.preventDefault();setFormSent(true);setFireworksActive(true);showToast('🚀 Message sent!');setTimeout(()=>{setFormSent(false);e.target.reset()},3000)}

  const skills=[
    {icon:'⚡',title:'Languages',tags:['Python','JavaScript','TypeScript','Java','C++','SQL']},
    {icon:'🌐',title:'Web Dev',tags:['React','Next.js','Node.js','Express','HTML/CSS','MongoDB']},
    {icon:'🤖',title:'AI / ML',tags:['TensorFlow','PyTorch','Scikit-learn','Hugging Face','OpenAI API','LangChain']},
    {icon:'🛠️',title:'Tools & Cloud',tags:['Git','Docker','AWS','VS Code','Linux','Jupyter']}
  ]
  const projects=[
    {icon:'🤖',title:'AI Chatbot Platform',desc:'Conversational AI powered by GPT-4 with memory, context awareness, and RAG pipeline.',tags:['Python','GPT-4','LangChain'],grad:'grad1'},
    {icon:'👁️',title:'Gesture Recognition',desc:'Real-time hand gesture recognition with interactive particle effects and visual responses.',tags:['Python','OpenCV','MediaPipe'],grad:'grad2'},
    {icon:'📊',title:'ML Dashboard',desc:'Full-stack dashboard for model performance, training metrics, and dataset analytics.',tags:['React','Node.js','MongoDB'],grad:'grad3'},
    {icon:'🎨',title:'AI Image Generator',desc:'Text-to-image generation with Stable Diffusion and custom fine-tuned models.',tags:['Stable Diffusion','Python','Flask'],grad:'grad4'}
  ]
  const timeline=[
    {date:'2025 — Present',title:'Generative AI & LLMs',desc:'Deep diving into LLMs, prompt engineering, RAG pipelines, and building AI-powered apps.'},
    {date:'2024 — 2025',title:'Machine Learning Deep Dive',desc:'Mastering neural networks, computer vision, NLP, and deep learning frameworks.'},
    {date:'2023 — 2024',title:'Full-Stack Development',desc:'Building end-to-end web applications with React, Node.js, and cloud services.'},
    {date:'2022 — 2023',title:'The Beginning',desc:'Started programming with Python and web technologies. Fell in love with building.'}
  ]

  return(<>
    {/* Background layers */}
    <SnowFall/>
    <div className="noise-overlay"/>
    <MatrixRain active={matrixActive} onClose={()=>setMatrixActive(false)}/>
    <SnakeGame active={snakeActive} onClose={()=>setSnakeActive(false)}/>
    <TypingChallenge active={typingActive} onClose={()=>setTypingActive(false)}/>
    <Fireworks active={fireworksActive} onDone={()=>setFireworksActive(false)}/>
    <ChatWidget/>
    {selectedSkill && <SkillModal skill={selectedSkill} onClose={()=>setSelectedSkill(null)}/>}
    <CommandPalette onNavigate={id=>{scrollTo(id)}} onToggleTheme={toggleTheme} onTriggerMatrix={()=>setMatrixActive(true)} onTriggerGame={()=>setSnakeActive(true)} onTriggerTyping={()=>setTypingActive(true)} theme={theme}/>

    <AnimatePresence>{toast&&<motion.div className="toast-notification" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:30}}>{toast}</motion.div>}</AnimatePresence>

    <motion.div style={{scaleX,position:'fixed',top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,#8b5cf6,#ec4899,#06b6d4)',transformOrigin:'0%',zIndex:9999}}/>


    {/* Theme Toggle */}
    <motion.button className="theme-toggle" onClick={toggleTheme} whileTap={{scale:0.85,rotate:180}} aria-label="Toggle theme">
      {theme==='dark'?<FiSun size={18}/>:<FiMoon size={18}/>}
    </motion.button>

    {/* Hints */}
    <div className="konami-hint">↑↑↓↓←→←→BA</div>
    <div className="cmd-hint"><kbd>Ctrl</kbd>+<kbd>K</kbd> Command Palette</div>

    {/* NAVBAR */}
    <Navbar expand="lg" className={`custom-navbar ${scrolled?'scrolled':''}`} fixed="top">
      <Container>
        <Navbar.Brand onClick={()=>scrollTo('hero')} className="nav-logo" role="button"><span className="bracket">&lt;</span>Sujal<span className="bracket">/&gt;</span></Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav"/>
        <Navbar.Collapse id="main-nav" className="justify-content-end">
          <Nav>{['about','skills','playground','projects','journey','contact'].map(s=><Nav.Link key={s} onClick={()=>scrollTo(s)} className={`nav-link-custom ${activeSection===s?'active':''}`}>{s.charAt(0).toUpperCase()+s.slice(1)}</Nav.Link>)}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    {/* HERO */}
    <section id="hero" className="hero-section">
      <Container><Row className="align-items-center gy-5">
        <Col lg={7}><motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp} custom={0} className="d-flex gap-3 align-items-center flex-wrap mb-4">
            <div className="hero-badge"><span className="badge-dot"/><span>Available for opportunities</span></div>
            <LiveClock/>
          </motion.div>
          <motion.h1 variants={fadeUp} custom={0.1} className="hero-title mb-2">Hi, I'm <span className="highlight glitch" data-text="Sujal">Sujal</span></motion.h1>
          <motion.div variants={fadeUp} custom={0.2} className="typed-line mb-4">I build <span className="text-gradient">{typedText}</span><span className="cursor-blink">|</span></motion.div>
          <motion.p variants={fadeUp} custom={0.3} className="hero-desc mb-4">Software Developer Engineer crafting intelligent solutions at the intersection of <span className="text-gradient">Machine Learning</span> & <span className="text-gradient">Generative AI</span>. Turning complex problems into elegant code.</motion.p>
          <motion.div variants={fadeUp} custom={0.4} className="d-flex gap-3 flex-wrap mb-5">
            <MagneticButton className="btn-glow btn-primary-glow" onClick={()=>scrollTo('projects')}>View My Work <FiArrowRight/></MagneticButton>
            <MagneticButton className="btn-glow btn-outline-glow" onClick={()=>scrollTo('contact')}>Let's Talk</MagneticButton>
            <MagneticButton className="btn-resume" onClick={()=>showToast('📄 Resume downloading...')}><FiDownload/> Resume</MagneticButton>
          </motion.div>
          <motion.div variants={fadeUp} custom={0.5}><Row className="g-3">
            {[{n:400,l:'LeetCode'},{n:10,l:'Projects'},{n:5,l:'Technologies'},{n:3,l:'AI Models'}].map((s,i)=>
              <Col xs={3} key={i}><TiltCard><motion.div className="stat-card" whileHover={{borderColor:'rgba(139,92,246,0.5)'}}>
                <Counter target={s.n}/><span className="text-gradient" style={{fontSize:'1.2rem',fontWeight:800}}>+</span>
                <div className="stat-label">{s.l}</div>
              </motion.div></TiltCard></Col>
            )}
          </Row></motion.div>
        </motion.div></Col>
        <Col lg={5}><motion.div initial={{opacity:0,x:80,rotateY:15}} animate={{opacity:1,x:0,rotateY:0}} transition={{duration:1,delay:0.4,ease:[0.22,1,0.36,1]}} style={{transform:`translateX(${parallax.x*10}px) translateY(${parallax.y*10}px)`}}>
          <CodeWindow/>
        </motion.div></Col>
      </Row>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.5}} className="scroll-indicator text-center mt-5"><div className="mouse"><div className="wheel"/></div><span>Scroll to explore</span></motion.div>
      </Container>
    </section>

    {/* ABOUT */}
    <Section id="about"><Container>
      <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="text-center mb-5 center-header">
        <span className="section-tag">&lt;about&gt;</span><h2 className="section-title">About <TextScramble text="Me" className="highlight"/></h2><div className="section-line"/>
      </motion.div>
      <Row className="gy-5 align-items-start">
        <Col lg={6}><motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeLeft} className="about-text">
          <p>I'm a passionate <strong>Software Developer Engineer</strong> with a deep curiosity for AI. My journey started with writing my first lines of code, and has evolved into building intelligent systems that push boundaries.</p>
          <p>Currently diving deep into <strong>Machine Learning</strong> and <strong>Generative AI</strong>, I'm fascinated by how neural networks can learn, create, and transform industries.</p>
          <p>When I'm not coding, you'll find me exploring AI research papers, contributing to open-source, or experimenting with new frameworks.</p>
          <div className="d-flex flex-column gap-3 mt-4">
            {[{icon:'🎯',t:'Focus',s:'Full-Stack + AI/ML'},{icon:'🚀',t:'Goal',s:'Build AI-first products'},{icon:'💡',t:'Passion',s:'Innovation & Learning'}].map((h,i)=>
              <motion.div key={i} className="highlight-card" whileHover={{x:10,borderColor:'rgba(139,92,246,0.5)'}} initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.15,ease:[0.22,1,0.36,1]}}>
                <span className="highlight-icon">{h.icon}</span><div><strong>{h.t}</strong><span>{h.s}</span></div>
              </motion.div>
            )}
          </div>
        </motion.div></Col>
        <Col lg={6}><motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeRight}><Terminal/></motion.div></Col>
      </Row>
    </Container></Section>

    {/* SKILLS + CUBE + LEETCODE */}
    <Section id="skills"><Container>
      <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="text-center mb-5 center-header">
        <span className="section-tag">&lt;skills&gt;</span><h2 className="section-title">Tech <TextScramble text="Arsenal" className="highlight"/></h2><div className="section-line"/>
      </motion.div>
      <Row className="g-4 mb-5">
        {skills.map((s,i)=><Col md={6} key={i}><TiltCard><motion.div className="skill-card gradient-border hover-glow" initial={{opacity:0,y:50}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1,duration:0.7,ease:[0.22,1,0.36,1]}}>
          <motion.div className="skill-icon" animate={{rotate:[0,10,-10,0]}} transition={{duration:4,repeat:Infinity,delay:i*0.5}}>{s.icon}</motion.div>
          <h4>{s.title}</h4><div>{s.tags.map((t,j)=><motion.span key={j} className="skill-tag" onClick={()=>setSelectedSkill(t)} style={{cursor:'pointer'}} whileHover={{scale:1.15,y:-3,boxShadow:'0 4px 20px rgba(139,92,246,0.4)'}} whileTap={{scale:0.9}}>{t}</motion.span>)}</div>
        </motion.div></TiltCard></Col>)}
      </Row>
      {/* Skill Proficiency Bars */}

      {/* 3D Tech Scene + LeetCode row */}
      <Row className="g-4 align-items-stretch mb-5">
        <Col lg={8}>
          <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.8,ease:[0.22,1,0.36,1]}}>
            <ThreeScene/>
          </motion.div>
        </Col>
        <Col lg={4}><LeetCodeCard/></Col>
      </Row>
      {/* GitHub Activity Heatmap */}
      <Row className="g-4 mb-4">
        <Col xs={12}><GitHubHeatmap/></Col>
      </Row>
      {/* Typing Challenge Trigger */}
      <Row className="g-4">
        <Col xs={12}>
          <motion.div
            initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
            transition={{duration:0.7,ease:[0.22,1,0.36,1]}}
            className="typing-challenge-banner hover-glow"
            onClick={()=>setTypingActive(true)}
            style={{padding:'24px 28px',background:'var(--glass)',border:'1px solid var(--glass-border)',borderRadius:'var(--radius)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}
          >
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <motion.span animate={{rotate:[0,10,-10,0]}} transition={{duration:3,repeat:Infinity}} style={{fontSize:'2rem'}}>⌨️</motion.span>
              <div>
                <h4 style={{margin:0,fontSize:'1.05rem',fontWeight:700,color:'var(--text)'}}>Typing Speed Challenge</h4>
                <p style={{margin:0,fontSize:'0.82rem',color:'var(--text3)'}}>Test your coding speed with real code snippets</p>
              </div>
            </div>
            <MagneticButton className="btn-glow btn-primary-glow" style={{fontSize:'0.85rem',padding:'10px 24px'}} onClick={(e)=>{e.stopPropagation();setTypingActive(true)}}>Start Challenge 🚀</MagneticButton>
          </motion.div>
        </Col>
      </Row>
    </Container></Section>

    {/* INTERACTIVE PLAYGROUND */}
    <Section id="playground"><Container>
      <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="text-center mb-5 center-header">
        <span className="section-tag">&lt;playground&gt;</span><h2 className="section-title">Code <TextScramble text="Playground" className="highlight"/></h2><div className="section-line"/>
        <p className="section-subtitle">Try writing and running code right here — interactive demo of my dev environment</p>
      </motion.div>
      <Row className="g-4 mb-5">
        <Col xs={12}><CodePlayground/></Col>
      </Row>
      {/* Spline 3D Interactive Scene */}
      <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.8,delay:0.2,ease:[0.22,1,0.36,1]}} className="text-center mb-4">
        <h3 style={{fontSize:'1.3rem',fontWeight:700,marginBottom:8}}>Toon 3D <span className="text-gradient">Interactive Model</span></h3>
        <p style={{color:'var(--text3)',fontSize:'0.88rem'}}>A stylized toon-shaded 3D scene — drag, rotate & zoom to explore the model in real time</p>
      </motion.div>
      <Row className="g-4">
        <Col xs={12}>
          <motion.div initial={{opacity:0,scale:0.95}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:0.7,ease:[0.22,1,0.36,1]}}>
            <SplineScene/>
          </motion.div>
        </Col>
      </Row>
    </Container></Section>

    {/* PROJECTS */}
    <Section id="projects"><Container>
      <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="text-center mb-5 center-header">
        <span className="section-tag">&lt;projects&gt;</span><h2 className="section-title">Featured <TextScramble text="Projects" className="highlight"/></h2><div className="section-line"/>
      </motion.div>
      {/* Interactive Project Showcase */}
      <div className="mb-5"><ProjectShowcase/></div>
      <Row className="g-4">{projects.map((p,i)=><Col md={6} key={i}><TiltCard><motion.div className="project-card gradient-border" initial={{opacity:0,y:60}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1,duration:0.7,ease:[0.22,1,0.36,1]}}>
        <div className="project-visual"><div className={`project-visual-bg ${p.grad}`}/><motion.span style={{position:'relative',zIndex:1,fontSize:'4rem'}} animate={{y:[0,-12,0],rotate:[0,5,-5,0]}} transition={{duration:4,repeat:Infinity,ease:'easeInOut'}}>{p.icon}</motion.span>
          <div className="project-overlay"><motion.a href="#" className="project-link-btn" whileHover={{scale:1.2,rotate:10}}><FiExternalLink size={20}/></motion.a><motion.a href="#" className="project-link-btn" whileHover={{scale:1.2,rotate:-10}}><FiGithub size={20}/></motion.a></div>
        </div>
        <div className="project-info"><div className="project-tags">{p.tags.map((t,j)=><motion.span key={j} whileHover={{scale:1.1}}>{t}</motion.span>)}</div><h4>{p.title}</h4><p>{p.desc}</p></div>
      </motion.div></TiltCard></Col>)}</Row>
    </Container></Section>

    {/* JOURNEY */}
    <Section id="journey"><Container>
      <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="text-center mb-5 center-header">
        <span className="section-tag">&lt;journey&gt;</span><h2 className="section-title">My <TextScramble text="Journey" className="highlight"/></h2><div className="section-line"/>
      </motion.div>
      <div className="timeline-wrapper" style={{maxWidth:800,margin:'0 auto'}}><div className="timeline-line"/>
        {timeline.map((t,i)=><div key={i} className="timeline-item">
          <motion.div className="timeline-dot" initial={{scale:0}} whileInView={{scale:1}} viewport={{once:true}} transition={{delay:i*0.2,type:'spring',stiffness:200}}/>
          <Row><Col md={{span:5,offset:i%2===0?0:7}} className={i%2===0?'text-md-end':''}>
            <motion.div className="timeline-card hover-glow" initial={i%2===0?{opacity:0,x:-60}:{opacity:0,x:60}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.15,duration:0.7,ease:[0.22,1,0.36,1]}} whileHover={{scale:1.03}}>
              <span className="timeline-date">{t.date}</span><h4>{t.title}</h4><p>{t.desc}</p>
            </motion.div>
          </Col></Row>
        </div>)}
      </div>
    </Container></Section>

    {/* CONTACT */}
    <Section id="contact"><Container>
      <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="text-center mb-5 center-header">
        <span className="section-tag">&lt;contact&gt;</span><h2 className="section-title">Let's <TextScramble text="Connect" className="highlight"/></h2><div className="section-line"/><p className="section-subtitle">Have a project in mind? I'd love to hear from you.</p>
      </motion.div>
      <Row className="gy-4">
        <Col lg={5}><motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={stagger} className="d-flex flex-column gap-3">
          {[{e:'📧',t:'Email',s:'sujalranjan98@gmail.com',h:'mailto:sujalranjan98@gmail.com'},{e:'🐙',t:'GitHub',s:'github.com/Sujal072005',h:'https://github.com/Sujal072005'},{e:'📱',t:'Phone',s:'+91 7318939229',h:'tel:7318939229'}].map((c,i)=>
            <motion.a key={i} href={c.h} className="contact-card-link hover-glow" variants={fadeLeft} custom={i*0.1} whileHover={{x:12,scale:1.02}}>
              <span className="contact-emoji">{c.e}</span><div><strong>{c.t}</strong><span className="sub">{c.s}</span></div><FiArrowRight className="arrow"/>
            </motion.a>
          )}
        </motion.div></Col>
        <Col lg={7}><motion.form onSubmit={handleSubmit} initial={{opacity:0,x:60}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.7,ease:[0.22,1,0.36,1]}}>
          <input type="text" className="form-control-custom mb-3" placeholder="Your Name" required/>
          <input type="email" className="form-control-custom mb-3" placeholder="Your Email" required/>
          <textarea className="form-control-custom mb-3" rows={4} placeholder="Your Message" required/>
          <MagneticButton className="btn-submit" style={formSent?{background:'linear-gradient(135deg,#22c55e,#16a34a)'}:{}}>
            {formSent?'✓ Message Sent!':<><span>Send Message</span><FiSend/></>}
          </MagneticButton>
        </motion.form></Col>
      </Row>
    </Container></Section>

    {/* FOOTER */}
    <footer className="footer" style={{position:'relative',zIndex:1}}><Container className="text-center"><motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
      <span className="footer-logo"><span style={{color:'var(--accent)'}}>&lt;</span>Sujal<span style={{color:'var(--accent)'}}>/&gt;</span></span>
      <p>Designed & Built with 💜 by Sujal</p><p>© 2026 All rights reserved.</p>
    </motion.div></Container></footer>
  </>)
}
