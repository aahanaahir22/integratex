import { Activity, Cable, Check, ChevronRight, Clock3, Fingerprint, KeyRound, RefreshCcw, Search, ShieldCheck, Workflow } from 'lucide-react'
import { motion } from 'framer-motion'
import { connectors } from '../data'

export function Connectors() {
  return (
    <motion.div className="page connectors-page" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="page-heading">
        <div><span className="section-kicker"><Cable size={14} /> CONNECTOR REGISTRY / CONTRACT-AWARE</span><h2>Every API has a<br /><em>technical passport.</em></h2></div>
        <div className="connector-summary"><div><strong>06</strong><small>ACTIVE</small></div><div><strong>184</strong><small>OPERATIONS</small></div><div><strong>18</strong><small>CONTRACTS</small></div></div>
      </div>

      <div className="filter-bar"><Search size={15} /><input placeholder="Search connector, scope, or operation…" /><button>ALL SYSTEMS <ChevronRight size={13} /></button><span><i className="pulse-dot" /> Contract monitor live</span></div>

      <section className="connector-grid">
        {connectors.map((connector, index) => (
          <motion.article key={connector.id} className="connector-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }} style={{ '--connector': connector.color } as React.CSSProperties}>
            <header><span className="connector-logo">{connector.short}</span><span className={`connector-health ${connector.status}`}><i /> {connector.status.toUpperCase()}</span><button><ChevronRight size={15} /></button></header>
            <small>{connector.category.toUpperCase()}</small><h3>{connector.name}</h3>
            <div className="passport-grid"><span><small>AUTH</small><strong><KeyRound size={11} /> {connector.auth}</strong></span><span><small>VERSION</small><strong>{connector.version}</strong></span><span><small>OPERATIONS</small><strong>{connector.operations}</strong></span><span><small>P95 LATENCY</small><strong>{connector.latency}ms</strong></span></div>
            <div className="scope-list">{connector.scopes.map((scope) => <span key={scope}><ShieldCheck size={10} /> {scope}</span>)}</div>
            <footer><span><RefreshCcw size={11} /> Contract tested {connector.lastContractTest}</span><span className="contract-signal"><i /><i /><i /><i /><i /></span></footer>
          </motion.article>
        ))}
      </section>

      <section className="contract-guardian panel">
        <div className="guardian-visual"><Fingerprint size={42} /><span /><i /></div>
        <div><span className="section-kicker"><Workflow size={13} /> CONTRACT GUARDIAN</span><h3>No silent schema drift.</h3><p>Versioned OpenAPI contracts are continuously diffed. Breaking changes identify affected workflows before production execution.</p></div>
        <div className="guardian-stats"><span><Check size={12} /><b>18/18</b> contracts valid</span><span><Activity size={12} /><b>0</b> breaking changes</span><span><Clock3 size={12} /><b>2m</b> last scan</span></div>
      </section>
    </motion.div>
  )
}
