import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowRight, BookOpenCheck, Braces, Check, CheckCircle2, CircleDotDashed, LoaderCircle, LockKeyhole, Play, ScanSearch, ShieldCheck, Sparkles, TerminalSquare, WandSparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { api } from '../api'
import { compiledWorkflow as fallbackWorkflow, defaultPrompt, traceEvents as fallbackTrace } from '../data'
import type { CompiledWorkflow, TraceEvent } from '../types'
import { WorkflowMap } from './WorkflowMap'

const compilePhases = ['Parsing integration intent', 'Retrieving versioned API docs', 'Compiling typed workflow DAG', 'Validating scopes + schemas', 'Applying risk policies']

export function Studio() {
  const [prompt, setPrompt] = useState(defaultPrompt)
  const [workflow, setWorkflow] = useState<CompiledWorkflow>(fallbackWorkflow)
  const [compiling, setCompiling] = useState(false)
  const [phase, setPhase] = useState(0)
  const [compiled, setCompiled] = useState(true)
  const [running, setRunning] = useState(false)
  const [trace, setTrace] = useState<TraceEvent[]>([])
  const [visibleEvents, setVisibleEvents] = useState(0)

  useEffect(() => {
    if (!compiling) return
    const timer = window.setInterval(() => setPhase((value) => Math.min(value + 1, compilePhases.length - 1)), 520)
    return () => window.clearInterval(timer)
  }, [compiling])

  useEffect(() => {
    if (!running || visibleEvents >= trace.length) return
    const timer = window.setTimeout(() => setVisibleEvents((value) => value + 1), 650)
    return () => window.clearTimeout(timer)
  }, [running, trace.length, visibleEvents])

  useEffect(() => {
    if (running && trace.length > 0 && visibleEvents >= trace.length) setRunning(false)
  }, [running, trace.length, visibleEvents])

  const compile = async () => {
    setCompiled(false)
    setCompiling(true)
    setPhase(0)
    const result = await api.compile(prompt)
    await new Promise((resolve) => window.setTimeout(resolve, 2700))
    setWorkflow(result)
    setCompiling(false)
    setCompiled(true)
  }

  const execute = async () => {
    setRunning(true)
    setTrace([])
    setVisibleEvents(0)
    const result = await api.execute(workflow.id)
    setTrace(result.trace.length ? result.trace : fallbackTrace)
  }

  const wordCount = useMemo(() => prompt.trim().split(/\s+/).filter(Boolean).length, [prompt])

  return (
    <motion.div className="page studio-page" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="page-heading">
        <div><span className="section-kicker"><WandSparkles size={14} /> WORKFLOW COMPILER / GROUNDED MODE</span><h2>Describe the outcome.<br /><em>Inspect the proof.</em></h2></div>
        <div className="mode-switch"><span className="pulse-dot" /><span><small>RUNTIME MODE</small><strong>Guarded execution</strong></span><ShieldCheck size={17} /></div>
      </div>

      <section className="compiler-layout">
        <article className="prompt-panel panel">
          <header><span><Sparkles size={15} /> NATURAL-LANGUAGE INTENT</span><em>⌘ + ENTER</em></header>
          <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} aria-label="Describe an integration workflow" />
          <div className="prompt-meta"><span>{wordCount} words</span><span>6 systems detected</span><span>1 sensitive action</span></div>
          <button className="compile-button" disabled={compiling || prompt.length < 20} onClick={compile}>
            {compiling ? <><LoaderCircle className="spin" size={17} /> {compilePhases[phase]}</> : <><Braces size={17} /> Compile with evidence <ArrowRight size={16} /></>}
          </button>
          <p className="compiler-note"><LockKeyhole size={12} /> The compiler cannot execute actions. Publication requires deterministic validation.</p>
        </article>

        <article className="compiler-output panel">
          <header><span><TerminalSquare size={15} /> COMPILER OUTPUT</span><span className={compiling ? 'status-pill working' : 'status-pill'}>{compiling ? 'COMPILING' : 'VALID'}</span></header>
          <AnimatePresence mode="wait">
            {compiling ? (
              <motion.div key="compiling" className="compile-progress" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="compiler-orb"><i /><b>IX</b><span /></div>
                {compilePhases.map((item, index) => (
                  <div key={item} className={index < phase ? 'done' : index === phase ? 'active' : ''}>
                    <span>{index < phase ? <Check size={12} /> : index === phase ? <LoaderCircle className="spin" size={12} /> : index + 1}</span>
                    <strong>{item}</strong>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="summary" className="compiled-summary" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="summary-score"><span>{workflow.confidence}<small>%</small></span><em>COMPILER<br />CONFIDENCE</em></div>
                <div><small>WORKFLOW</small><strong>{workflow.name}</strong><p>{workflow.summary}</p></div>
                <div className="summary-tags"><span><ShieldCheck size={11} /> {workflow.risk}</span><span><BookOpenCheck size={11} /> {workflow.evidenceIds.length} evidence sources</span><span><Braces size={11} /> {workflow.nodes.length} typed nodes</span></div>
              </motion.div>
            )}
          </AnimatePresence>
        </article>
      </section>

      {compiled && (
        <motion.section className="workflow-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="workflow-title">
            <div><span>COMPILED WORKFLOW / v{workflow.version}</span><h3>{workflow.name}</h3></div>
            <div className="validation-strip">{workflow.validations.slice(0, 3).map((item) => <span key={item}><CheckCircle2 size={12} /> {item}</span>)}</div>
            <button className="run-button" onClick={execute} disabled={running}><Play size={14} fill="currentColor" /> {running ? 'EXECUTING…' : 'RUN WORKFLOW'}</button>
          </div>
          <WorkflowMap workflow={workflow} />
        </motion.section>
      )}

      <section className="studio-bottom">
        <article className="validation-panel panel">
          <header><span><ScanSearch size={15} /> DETERMINISTIC GATES</span><em>{workflow.validations.length}/{workflow.validations.length} PASSED</em></header>
          <div className="gate-grid">
            {workflow.validations.map((item, index) => <motion.div key={item} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.07 }}><span><Check size={11} /></span>{item}</motion.div>)}
          </div>
        </article>

        <article className="execution-panel panel">
          <header><span><CircleDotDashed size={15} /> EXECUTION TRACE</span><em>{running ? 'STREAMING' : trace.length ? 'PAUSED FOR APPROVAL' : 'AWAITING RUN'}</em></header>
          {trace.length === 0 ? (
            <div className="empty-trace"><Play size={20} /><span>Run the compiled workflow to stream its verified execution trace.</span></div>
          ) : (
            <div className="execution-events">
              {trace.slice(0, visibleEvents).map((event, index) => (
                <motion.div key={event.id} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} className={event.status}>
                  <span>{event.status === 'paused' ? <AlertTriangle size={13} /> : <Check size={13} />}</span>
                  <div><strong>{event.step}</strong><small>{event.message}</small></div>
                  <em>{event.duration}</em>
                </motion.div>
              ))}
            </div>
          )}
        </article>
      </section>
    </motion.div>
  )
}
