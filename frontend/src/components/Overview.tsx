import { ArrowDownRight, ArrowRight, Asterisk, Braces, Check, CircleDot, FileSearch, Fingerprint, RotateCcw, ShieldCheck, Sparkles, Split, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { traceEvents } from '../data'
import type { NavId } from '../types'

interface OverviewProps {
  navigate: (id: NavId) => void
}

const loomSteps = [
  { label: 'Intent', detail: 'Describe the business outcome', icon: Sparkles, className: 'loom-node-intent' },
  { label: 'Evidence', detail: 'Retrieve versioned API truth', icon: FileSearch, className: 'loom-node-evidence' },
  { label: 'Validate', detail: 'Check types, scopes and contracts', icon: Braces, className: 'loom-node-validate' },
  { label: 'Approval', detail: 'Pause irreversible decisions', icon: ShieldCheck, className: 'loom-node-approval' },
  { label: 'Execute', detail: 'Run with bounded retries', icon: Zap, className: 'loom-node-execute' },
  { label: 'Verified', detail: 'Record the business receipt', icon: Fingerprint, className: 'loom-node-verified' },
]

const principles = [
  ['01', 'Ground before generation', 'Every suggested API operation points back to a versioned source.'],
  ['02', 'Separate proposing from acting', 'Model output becomes a typed candidate; policy code owns the decision.'],
  ['03', 'Design recovery as a feature', 'Retries, idempotency, isolation and verification are visible—not hidden.'],
]

export function Overview({ navigate }: OverviewProps) {
  return (
    <motion.div className="page overview loom-overview" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <section className="loom-hero">
        <div className="loom-hero-copy">
          <span className="section-kicker"><Asterisk size={15} /> THE PRODUCT THESIS / 00</span>
          <h1>Give<br /><em>chaos</em><br />a shape.</h1>
          <p>IntegrateX turns a plain-language business request into a grounded, typed and recoverable workflow—then exposes every assumption before anything acts.</p>
          <div className="loom-hero-actions">
            <button onClick={() => navigate('studio')}><span>COMPOSE A WORKFLOW<small>Start with natural language</small></span><ArrowDownRight size={22} /></button>
            <button onClick={() => navigate('failure')}><RotateCcw size={17} /> Rehearse a failure</button>
          </div>
          <div className="hero-margin-note"><Split size={15} /><span><strong>Not a chatbot wrapper.</strong> A product system for inspectable integration decisions.</span></div>
        </div>

        <div className="workflow-loom" aria-label="Intent woven through evidence, validation, approval, execution and verification">
          <div className="loom-canvas-label"><CircleDot size={13} /> LIVE PRODUCT MODEL <span>DRAG THE KNOTS</span></div>
          <svg viewBox="0 0 760 650" preserveAspectRatio="none" aria-hidden="true">
            <motion.path className="loom-path path-main" d="M70 110 C250 30 250 250 420 180 S530 340 690 300 S515 530 670 580" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }} />
            <motion.path className="loom-path path-split" d="M210 146 C300 330 90 345 160 520 S380 420 510 510" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .28, duration: 2.3, ease: [0.16, 1, 0.3, 1] }} />
            <motion.path className="loom-path path-proof" d="M420 180 C395 410 640 385 670 580" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .55, duration: 1.8 }} />
          </svg>
          {loomSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div key={step.label} drag dragConstraints={{ left: -18, right: 18, top: -18, bottom: 18 }} dragElastic={0.12} whileHover={{ scale: 1.05, rotate: 0 }} className={`loom-knot ${step.className}`} initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1, rotate: index % 2 ? 2 : -2 }} transition={{ delay: .38 + index * .12, type: 'spring' }}>
                <span><Icon size={16} /></span><strong>{step.label}</strong><small>{step.detail}</small>
              </motion.div>
            )
          })}
          <motion.div className="loom-pulse" animate={{ offsetDistance: ['0%', '100%'] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }} />
          <div className="loom-legend"><span><i /> PROPOSAL</span><span><i /> DETERMINISTIC GATE</span><span><i /> RECEIPT</span></div>
        </div>
      </section>

      <section className="capability-tape" aria-label="Product capabilities">
        <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
          {[0, 1].map((set) => <span key={set}>INTENT → TYPED DAG <i /> VERSIONED EVIDENCE <i /> HUMAN APPROVAL <i /> FAILURE REHEARSAL <i /> VERIFIED OUTCOME <i /></span>)}
        </motion.div>
      </section>

      <section className="loom-story">
        <div className="principle-ledger">
          <header><span>DESIGN PRINCIPLES</span><strong>What makes the system trustworthy?</strong></header>
          {principles.map(([number, title, detail], index) => (
            <motion.article key={number} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .12 }}>
              <span>{number}</span><div><h3>{title}</h3><p>{detail}</p></div><ArrowRight size={18} />
            </motion.article>
          ))}
        </div>

        <article className="trace-receipt">
          <header><span>EXECUTION RECEIPT</span><em>SEEDED DEMO TRACE</em></header>
          <div className="receipt-title"><small>WORKFLOW / V3</small><h3>Payment → Revenue signal</h3><span>trc_91BX</span></div>
          <div className="receipt-events">
            {traceEvents.map((event, index) => (
              <motion.div key={event.id} initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }} className={event.status}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><strong>{event.step}</strong><small>{event.connector} · {event.message}</small></div>
                <em>{event.duration}</em>
                <i>{event.status === 'paused' ? <ShieldCheck size={12} /> : <Check size={12} />}</i>
              </motion.div>
            ))}
          </div>
          <footer><span><Fingerprint size={13} /> Audit-ready</span><span><ShieldCheck size={13} /> Guarded</span><button onClick={() => navigate('studio')}>OPEN COMPOSER <ArrowRight size={13} /></button></footer>
        </article>
      </section>

      <section className="outcome-poster">
        <span>FROM PROMPT</span><i />
        <strong>PROOF, NOT<br /><em>AI THEATRE.</em></strong>
        <p>Compile the plan. Inspect the source. Approve the risk. Break the dependency. Verify the recovery.</p>
        <button onClick={() => navigate('evidence')}>FOLLOW THE RECEIPTS <ArrowRight size={16} /></button>
      </section>
    </motion.div>
  )
}
