import { useState } from 'react'
import { ArrowUpRight, BookOpenCheck, Braces, Check, Copy, FileCheck2, FileSearch, Fingerprint, Library, Search, ShieldCheck, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { evidence } from '../data'

export function EvidenceVault() {
  const [activeId, setActiveId] = useState(evidence[0].id)
  const active = evidence.find((item) => item.id === activeId) ?? evidence[0]

  return (
    <motion.div className="page evidence-page" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="page-heading">
        <div><span className="section-kicker"><Library size={14} /> DOCUMENTATION RAG / VERSION-BOUND</span><h2>Every AI decision<br /><em>shows its receipts.</em></h2></div>
        <div className="evidence-score"><div className="score-ring"><span>96<small>%</small></span></div><span><small>GROUNDING SCORE</small><strong>Above acceptance gate</strong></span></div>
      </div>

      <section className="evidence-layout">
        <aside className="source-list panel">
          <header><span><FileSearch size={15} /> RETRIEVED SOURCES</span><em>{evidence.length} MATCHES</em></header>
          <div className="evidence-search"><Search size={14} /><span>payment → CRM workflow</span></div>
          {evidence.map((item, index) => (
            <button key={item.id} className={activeId === item.id ? 'active' : ''} onClick={() => setActiveId(item.id)}>
              <span className="source-rank">0{index + 1}</span>
              <span><small>{item.connector} · {item.version}</small><strong>{item.title}</strong><em>{Math.round(item.confidence * 100)}% match</em></span>
            </button>
          ))}
        </aside>

        <article className="document-viewer panel">
          <header><span><BookOpenCheck size={15} /> EVIDENCE DETAIL</span><div><button title="Copy evidence"><Copy size={13} /></button><button title="Open source"><ArrowUpRight size={13} /></button></div></header>
          <div className="doc-banner"><span className="doc-logo">{active.connector.slice(0, 2).toUpperCase()}</span><span><small>{active.connector.toUpperCase()} / {active.version}</small><h3>{active.title}</h3><p>{active.section}</p></span><span className="verified-stamp"><ShieldCheck size={14} /> VERIFIED SOURCE</span></div>
          <div className="doc-content">
            <span className="line-number">142</span>
            <blockquote>“{active.excerpt}”</blockquote>
            <div className="highlight-line" />
          </div>
          <div className="evidence-meta"><span><small>EVIDENCE ID</small><strong>{active.id}</strong></span><span><small>CONTENT HASH</small><strong>{active.hash}</strong></span><span><small>CONFIDENCE</small><strong className="mint">{Math.round(active.confidence * 100)}%</strong></span><span><small>API VERSION</small><strong>{active.version}</strong></span></div>
          <div className="source-path"><Fingerprint size={13} /><span>{active.source}</span><Check size={12} /></div>
        </article>

        <aside className="grounding-panel panel">
          <header><span><Sparkles size={15} /> WHY THIS SOURCE?</span></header>
          <div className="reason-orb"><span>{Math.round(active.confidence * 100)}</span><i /></div>
          <p>This source directly supports the generated operation and matches the selected connector version.</p>
          <div className="reason-list"><span><Check size={11} /> Connector match</span><span><Check size={11} /> Operation match</span><span><Check size={11} /> Version match</span><span><Check size={11} /> Required scope found</span></div>
          <div className="model-boundary"><Braces size={15} /><span><small>MODEL BOUNDARY</small><strong>Proposal only</strong><p>Deterministic code validates this evidence before execution.</p></span></div>
        </aside>
      </section>

      <section className="rag-pipeline">
        <span><FileCheck2 size={14} /> VERSIONED DOCS</span><i /><span><Search size={14} /> METADATA FILTER</span><i /><span><Library size={14} /> VECTOR RETRIEVAL</span><i /><span><Sparkles size={14} /> TYPED PLAN</span><i /><span><ShieldCheck size={14} /> POLICY GATE</span>
      </section>
    </motion.div>
  )
}
