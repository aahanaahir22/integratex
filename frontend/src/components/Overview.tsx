import { ArrowRight, BookOpenCheck, Braces, CheckCircle2, CircleDot, Clock3, GitBranch, RadioTower, RotateCcw, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { traceEvents } from '../data'
import type { NavId } from '../types'

interface OverviewProps {
  navigate: (id: NavId) => void
}

export function Overview({ navigate }: OverviewProps) {
  return (
    <motion.div className="page overview" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse-dot" /> INTEGRATION INTELLIGENCE IS ONLINE</div>
          <h1>Make APIs<br /><span>behave.</span></h1>
          <p>Translate intent into evidence-backed workflows that validate before they act, recover when systems fail, and explain every decision.</p>
          <div className="hero-actions">
            <button className="primary-action" onClick={() => navigate('studio')}><Sparkles size={17} /> Compile a workflow <ArrowRight size={16} /></button>
            <button className="ghost-action" onClick={() => navigate('failure')}><RotateCcw size={16} /> Break the system</button>
          </div>
          <div className="hero-proof">
            <span><CheckCircle2 size={13} /> Typed plans</span>
            <span><CheckCircle2 size={13} /> Grounded RAG</span>
            <span><CheckCircle2 size={13} /> Guarded actions</span>
          </div>
        </div>

        <div className="mesh-visual" aria-label="Animated connector mesh">
          <div className="mesh-label"><RadioTower size={13} /> LIVE CONNECTOR MESH</div>
          <motion.div className="orbit orbit-outer" animate={{ rotateZ: 360, rotateX: [63, 68, 63] }} transition={{ rotateZ: { duration: 28, repeat: Infinity, ease: 'linear' }, rotateX: { duration: 6, repeat: Infinity } }} />
          <motion.div className="orbit orbit-mid" animate={{ rotateZ: -360, rotateY: [0, 12, 0] }} transition={{ rotateZ: { duration: 20, repeat: Infinity, ease: 'linear' }, rotateY: { duration: 7, repeat: Infinity } }} />
          <motion.div className="orbit orbit-inner" animate={{ rotateZ: 360 }} transition={{ duration: 13, repeat: Infinity, ease: 'linear' }} />
          <div className="mesh-core"><span>IX</span><i /><b>ORCHESTRATOR</b></div>
          <motion.span className="mesh-node node-stripe" animate={{ y: [0, -8, 0] }} transition={{ duration: 3.2, repeat: Infinity }}>ST</motion.span>
          <motion.span className="mesh-node node-hubspot" animate={{ y: [0, 7, 0] }} transition={{ duration: 4.1, repeat: Infinity }}>HS</motion.span>
          <motion.span className="mesh-node node-slack" animate={{ x: [0, 6, 0] }} transition={{ duration: 3.7, repeat: Infinity }}>SL</motion.span>
          <motion.span className="mesh-node node-github" animate={{ x: [0, -7, 0] }} transition={{ duration: 4.4, repeat: Infinity }}>GH</motion.span>
          <div className="packet packet-a" /><div className="packet packet-b" /><div className="packet packet-c" />
          <div className="mesh-caption"><span><i /> 6 CONNECTORS</span><span><i /> 18 CONTRACTS</span><span><i /> 4 WORKERS</span></div>
        </div>
      </section>

      <section className="stat-grid">
        <article><div><Zap size={16} /><span>RUNS / 24H</span></div><strong>1,284</strong><em>+12.6%</em><div className="mini-bars">{[30, 44, 35, 65, 52, 78, 69, 90].map((n, i) => <i key={i} style={{ height: `${n}%` }} />)}</div></article>
        <article><div><ShieldCheck size={16} /><span>SUCCESS RATE</span></div><strong>97.8%</strong><em>+2.4%</em><div className="ring-stat" style={{ '--progress': '97.8%' } as React.CSSProperties}><span /></div></article>
        <article><div><RotateCcw size={16} /><span>AUTO-RECOVERED</span></div><strong>43</strong><em>93.4%</em><div className="recovery-lines"><i /><i /><i /></div></article>
        <article><div><Clock3 size={16} /><span>P95 OVERHEAD</span></div><strong>286<small>ms</small></strong><em className="blue">−18ms</em><svg viewBox="0 0 100 30"><polyline points="0,7 12,10 24,8 37,15 49,13 61,20 74,17 87,25 100,22" /></svg></article>
      </section>

      <section className="overview-lower">
        <article className="live-run panel">
          <header><div><span className="icon-box"><GitBranch size={16} /></span><span><small>ACTIVE EXECUTION</small><strong>Payment → Revenue Signal</strong></span></div><button onClick={() => navigate('studio')}>OPEN TRACE <ArrowRight size={13} /></button></header>
          <div className="run-meta"><span><CircleDot size={12} /> exec_7A1F9C</span><span>workflow v3</span><span>guarded mode</span><em>RUNNING</em></div>
          <div className="trace-rail">
            {traceEvents.map((event, index) => (
              <motion.div key={event.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.12 }} className={event.status}>
                <span className="trace-icon">{event.status === 'paused' ? <ShieldCheck size={14} /> : <CheckCircle2 size={14} />}</span>
                <span><strong>{event.step}</strong><small>{event.connector} · {event.message}</small></span>
                <em>{event.duration}</em>
              </motion.div>
            ))}
          </div>
        </article>

        <article className="principle panel">
          <header><span className="icon-box"><Braces size={16} /></span><span><small>CORE PRINCIPLE / 01</small><strong>AI proposes.<br /><b>Code decides.</b></strong></span></header>
          <p>No model output reaches an external API until it passes typed schema, contract, scope and risk-policy validation.</p>
          <div className="principle-stack">
            <span><Sparkles size={13} /> INTENT</span><i /><span><BookOpenCheck size={13} /> EVIDENCE</span><i /><span><ShieldCheck size={13} /> POLICY</span><i /><span><Zap size={13} /> ACTION</span>
          </div>
        </article>
      </section>
    </motion.div>
  )
}
