import { ArrowDownRight, ArrowUpRight, Braces, Check, FileSearch, ShieldCheck, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface IntroProps {
  onEnter: () => void
}

const proof = [
  { label: 'Intent', detail: 'Human outcome', icon: Sparkles },
  { label: 'Evidence', detail: 'Versioned docs', icon: FileSearch },
  { label: 'Plan', detail: 'Typed workflow', icon: Braces },
  { label: 'Guard', detail: 'Policy decision', icon: ShieldCheck },
  { label: 'Outcome', detail: 'Verified receipt', icon: Check },
]

export function Intro({ onEnter }: IntroProps) {
  return (
    <motion.section className="loom-intro" exit={{ opacity: 0, scale: 1.025, filter: 'blur(10px)' }} transition={{ duration: 0.65 }}>
      <div className="intro-dossier">
        <header>
          <span>PRODUCT SYSTEM / 2026</span>
          <strong>AA — 01</strong>
        </header>

        <div className="intro-title" aria-label="IntegrateX">
          {'INTEGRATEX'.split('').map((letter, index) => (
            <motion.span key={`${letter}-${index}`} initial={{ opacity: 0, y: 70, rotate: index % 2 ? 4 : -4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 0.12 + index * 0.055, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>{letter}</motion.span>
          ))}
        </div>

        <motion.div className="intro-thesis" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <span><i /> AI-NATIVE INTEGRATION COMPILER</span>
          <h1>Turn messy business intent into <em>safe, inspectable systems.</em></h1>
          <p>A live workflow atelier where AI drafts the path, evidence grounds every operation, deterministic gates control execution, and failure becomes something you can rehearse.</p>
        </motion.div>

        <motion.button className="enter-loom" onClick={onEnter} initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}>
          <span>ENTER THE WORKFLOW LOOM<small>7 interactive product scenes</small></span>
          <ArrowDownRight size={24} />
        </motion.button>

        <footer><span>NO ACCOUNT</span><span>NO API KEY</span><span>SAFE SIMULATED EFFECTS</span></footer>
      </div>

      <div className="intro-proof">
        <div className="proof-label"><span>ONE REQUEST</span><ArrowUpRight size={16} /><strong>FIVE PROVABLE STATES</strong></div>
        <div className="proof-thread">
          <svg viewBox="0 0 600 660" preserveAspectRatio="none" aria-hidden="true">
            <motion.path d="M75 48 C410 42 156 190 390 250 S192 440 520 582" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45, duration: 2.2, ease: [0.16, 1, 0.3, 1] }} />
          </svg>
          {proof.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div key={item.label} className={`proof-step proof-step-${index + 1}`} initial={{ opacity: 0, scale: 0.65, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: index % 2 ? 2 : -2 }} transition={{ delay: 0.7 + index * 0.16, type: 'spring' }}>
                <span><Icon size={17} /></span>
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
              </motion.div>
            )
          })}
        </div>
        <motion.div className="proof-stamp" initial={{ opacity: 0, scale: 1.5, rotate: 25 }} animate={{ opacity: 1, scale: 1, rotate: -7 }} transition={{ delay: 1.4, type: 'spring' }}>
          <ShieldCheck size={25} /><strong>SAFE BY DESIGN</strong><span>SIMULATED SIDE EFFECTS</span>
        </motion.div>
        <p className="proof-note">A recruiter-ready product demo—not a scripted landing page.</p>
      </div>
    </motion.section>
  )
}
