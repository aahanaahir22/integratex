import { ArrowUpRight, AudioLines, CircleDotDashed } from 'lucide-react'
import { motion } from 'framer-motion'

interface IntroProps {
  onEnter: () => void
}

const glyphs = ['API', 'RAG', 'DAG', '429', 'JWT', 'SLA', '∆', 'JSON']

export function Intro({ onEnter }: IntroProps) {
  return (
    <motion.section className="intro" exit={{ opacity: 0, scale: 1.04, filter: 'blur(14px)' }} transition={{ duration: 0.75 }}>
      <div className="intro-topline">
        <span><CircleDotDashed size={14} /> INTEGRATION INTELLIGENCE / 01</span>
        <span className="intro-coords">37.7749° N / 122.4194° W</span>
      </div>

      <div className="intro-orbit" aria-hidden="true">
        <motion.div className="intro-ring ring-a" animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }} />
        <motion.div className="intro-ring ring-b" animate={{ rotate: -360 }} transition={{ duration: 17, repeat: Infinity, ease: 'linear' }} />
        <div className="intro-core"><span>IX</span><i /></div>
        {glyphs.map((glyph, index) => (
          <motion.span
            key={glyph}
            className={`orbit-glyph glyph-${index + 1}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
            transition={{ delay: 0.6 + index * 0.08, y: { duration: 2.8 + index * 0.2, repeat: Infinity } }}
          >{glyph}</motion.span>
        ))}
      </div>

      <div className="intro-copy">
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>AI-NATIVE WORKFLOW RELIABILITY PLATFORM</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          INTEGRATE<span>X</span>
        </motion.h1>
        <motion.div className="intro-statement" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <span>INTENT</span><i /> <span>EVIDENCE</span><i /> <span>EXECUTION</span><i /> <span>RECOVERY</span>
        </motion.div>
        <motion.button className="enter-button" onClick={onEnter} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15 }}>
          <span>ENTER THE SYSTEM</span>
          <ArrowUpRight size={20} />
          <b><AudioLines size={13} /> LIVE DEMO</b>
        </motion.button>
      </div>

      <div className="intro-bottomline">
        <span>DESIGNED FOR FAILURES</span>
        <span>RECOVERS WITH EVIDENCE</span>
        <span>BUILD 0.9.7 / GUARDED</span>
      </div>
    </motion.section>
  )
}
