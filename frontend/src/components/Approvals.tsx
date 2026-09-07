import { useState } from 'react'
import { AlertTriangle, Check, ChevronRight, Clock3, Eye, Fingerprint, LockKeyhole, ShieldCheck, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { api } from '../api'
import { approvals as initialApprovals } from '../data'
import type { Approval } from '../types'

export function Approvals() {
  const [items, setItems] = useState<Approval[]>(initialApprovals)
  const [selected, setSelected] = useState<Approval | null>(initialApprovals[0])

  const decide = async (id: string, decision: 'approve' | 'reject') => {
    await api.decideApproval(id, decision)
    setItems((current) => current.map((item) => item.id === id ? { ...item, status: decision === 'approve' ? 'approved' : 'rejected' } : item))
    setSelected((current) => current?.id === id ? { ...current, status: decision === 'approve' ? 'approved' : 'rejected' } : current)
  }

  return (
    <motion.div className="page approvals-page" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="page-heading">
        <div><span className="section-kicker"><ShieldCheck size={14} /> HUMAN-IN-THE-LOOP / GUARDED MODE</span><h2>Automation stops<br /><em>where risk begins.</em></h2></div>
        <div className="guard-status"><LockKeyhole size={21} /><span><small>POLICY ENGINE</small><strong>Actively guarding 4 workflows</strong></span></div>
      </div>

      <section className="approval-layout">
        <article className="approval-queue panel">
          <header><span><Clock3 size={15} /> APPROVAL QUEUE</span><em>{items.filter((item) => item.status === 'pending').length} PENDING</em></header>
          {items.map((item) => (
            <button key={item.id} className={`${selected?.id === item.id ? 'active' : ''} ${item.status}`} onClick={() => setSelected(item)}>
              <span className="approval-icon"><AlertTriangle size={16} /></span>
              <span><small>{item.id} · {item.createdAt}</small><strong>{item.action}</strong><em>{item.workflow}</em></span>
              <span className="queue-status">{item.status.toUpperCase()}</span><ChevronRight size={15} />
            </button>
          ))}
        </article>

        <article className="approval-detail panel">
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div key={`${selected.id}-${selected.status}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                <header><span><Fingerprint size={15} /> DECISION CONTEXT</span><span className={`risk-badge ${selected.status}`}>{selected.status === 'pending' ? selected.risk : selected.status.toUpperCase()}</span></header>
                <div className="decision-title"><small>ACTION REQUEST</small><h3>{selected.action}</h3><p>{selected.reason}</p></div>
                <div className="decision-grid"><span><small>WORKFLOW</small><strong>{selected.workflow}</strong></span><span><small>REQUESTED BY</small><strong>{selected.requestedBy}</strong></span><span><small>POLICY</small><strong>crm.mutation.guard.v4</strong></span><span><small>TRACE</small><strong>trc_91BX</strong></span></div>
                <div className="diff-view"><header><span>PROPOSED RECORD DIFF</span><button><Eye size={12} /> View evidence</button></header><pre><span>- lifecycle_stage: &quot;lead&quot;</span>{'\n'}<b>+ lifecycle_stage: &quot;customer&quot;</b>{'\n'}<span>- latest_order_value: 0</span>{'\n'}<b>+ latest_order_value: 12900</b></pre></div>
                {selected.status === 'pending' ? (
                  <div className="decision-actions"><button className="reject" onClick={() => decide(selected.id, 'reject')}><X size={15} /> REJECT</button><button className="approve" onClick={() => decide(selected.id, 'approve')}><Check size={15} /> APPROVE ONCE</button></div>
                ) : (
                  <div className={`decision-complete ${selected.status}`}>{selected.status === 'approved' ? <Check size={16} /> : <X size={16} />} Decision recorded in immutable audit trail.</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </article>
      </section>
    </motion.div>
  )
}
