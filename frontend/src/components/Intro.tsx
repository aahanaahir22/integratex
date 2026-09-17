import { ArrowDown, Asterisk, Box, CircleDot, Factory, ScanLine } from 'lucide-react'
import { motion } from 'framer-motion'

interface IntroProps {
  onEnter: () => void
}

const beltWords = ['INTENT', 'EVIDENCE', 'POLICY', 'ACTION', 'RECEIPT']

export function Intro({ onEnter }: IntroProps) {
  return (
    <motion.section className="factory-intro" exit={{ y: '-100%', transition: { duration: .85, ease: [0.76, 0, 0.24, 1] } }}>
      <div className="intro-safety-stripe" />
      <header className="factory-intro-head">
        <span><Factory size={16} /> INTEGRATEX / FACTORY FLOOR 01</span>
        <span>PUBLIC DEMONSTRATION · SAFE OUTPUTS</span>
      </header>

      <div className="intro-wordmark" aria-label="IntegrateX">
        <motion.span initial={{ x: '-110%' }} animate={{ x: 0 }} transition={{ duration: .9, ease: [0.16, 1, 0.3, 1] }}>INTEGRATE</motion.span>
        <motion.b initial={{ scale: 0, rotate: -160 }} animate={{ scale: 1, rotate: -7 }} transition={{ delay: .5, type: 'spring', stiffness: 120 }}>X</motion.b>
      </div>

      <div className="intro-floor">
        <div className="intro-manifest">
          <span className="manifest-index">01 — 07</span>
          <h1>MESSY<br />REQUESTS<br /><em>GO IN.</em></h1>
          <p>Grounded, guarded and recoverable workflows come out.</p>
        </div>

        <div className="intro-machine" aria-hidden="true">
          <div className="machine-roof"><i /><i /><i /></div>
          <motion.div className="machine-wheel wheel-one" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}><span /><span /><span /><span /><span /><span /></motion.div>
          <motion.div className="machine-wheel wheel-two" animate={{ rotate: -360 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}><span /><span /><span /><span /><span /><span /></motion.div>
          <div className="machine-screen"><ScanLine size={28} /><strong>PROOF<br />ENGINE</strong><small>VALIDATING…</small></div>
          <div className="machine-slot"><Box size={22} /><motion.i animate={{ x: [0, 148, 148], opacity: [1, 1, 0] }} transition={{ duration: 3, repeat: Infinity, times: [0, .78, 1] }} /></div>
          <div className="machine-legs"><i /><i /></div>
        </div>

        <button className="factory-switch" onClick={onEnter}>
          <span><small>PULL TO START</small><strong>RUN THE FACTORY</strong></span>
          <motion.i animate={{ y: [0, 8, 0] }} transition={{ duration: 1.4, repeat: Infinity }}><ArrowDown size={29} /></motion.i>
        </button>
      </div>

      <div className="intro-conveyor" aria-hidden="true">
        <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
          {[0, 1].map((set) => <span key={set}>{beltWords.map((word) => <b key={`${set}-${word}`}><Asterisk size={13} /> {word}</b>)}</span>)}
        </motion.div>
      </div>

      <footer className="factory-intro-foot">
        <span><CircleDot size={13} /> NO ACCOUNT · NO KEY</span>
        <span>DESIGNED + ENGINEERED BY AAHANA AHIR</span>
      </footer>
    </motion.section>
  )
}
