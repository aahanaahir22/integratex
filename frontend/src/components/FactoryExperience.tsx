import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, ArrowDown, ArrowRight, ArrowUpRight, Asterisk, Box, Braces, Check, CircleDot, Factory, FileSearch, Fingerprint, Github, KeyRound, LoaderCircle, LockKeyhole, PackageCheck, Play, RotateCcw, ScanLine, ShieldCheck, Sparkles, Stamp, Unplug, X, Zap } from 'lucide-react'
import { api } from '../api'
import { approvals, compiledWorkflow, connectors, defaultPrompt, evidence, failureScenarios, metrics } from '../data'
import type { Approval, CompiledWorkflow, TraceEvent } from '../types'

const stops = [
  { id: 'intake', number: '01', label: 'Intake' },
  { id: 'scanner', number: '02', label: 'Scanner' },
  { id: 'route', number: '03', label: 'Route' },
  { id: 'guard', number: '04', label: 'Guard' },
  { id: 'chaos', number: '05', label: 'Chaos' },
  { id: 'receipt', number: '06', label: 'Receipt' },
]

const compileStages = ['READING INTENT', 'FETCHING EVIDENCE', 'TYPING OPERATIONS', 'CHECKING POLICY', 'PRINTING ROUTE']
const recoveryStages = ['FAILURE CAPTURED', 'POLICY CLASSIFIED', 'BACKOFF APPLIED', 'DEPENDENCY ISOLATED', 'OUTCOME VERIFIED']
const crateColors = ['#f4ff3d', '#ff5a36', '#80e9ff', '#ff9dcc', '#eee9de', '#8ef3a5']

const wait = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

export function FactoryExperience({ apiOnline }: { apiOnline: boolean }) {
  const [activeStop, setActiveStop] = useState('intake')
  const [prompt, setPrompt] = useState(defaultPrompt)
  const [workflow, setWorkflow] = useState<CompiledWorkflow>(compiledWorkflow)
  const [compiling, setCompiling] = useState(false)
  const [compileStage, setCompileStage] = useState(0)
  const [routeReady, setRouteReady] = useState(false)
  const [activeEvidence, setActiveEvidence] = useState(evidence[0].id)
  const [activeConnector, setActiveConnector] = useState(connectors[0].id)
  const [approvalStatus, setApprovalStatus] = useState<Approval['status']>('pending')
  const [decisionBusy, setDecisionBusy] = useState(false)
  const [selectedFailure, setSelectedFailure] = useState(failureScenarios[0].id)
  const [chaosRunning, setChaosRunning] = useState(false)
  const [chaosStep, setChaosStep] = useState(-1)
  const [trace, setTrace] = useState<TraceEvent[]>([])
  const [traceVisible, setTraceVisible] = useState(0)
  const [running, setRunning] = useState(false)

  const selectedEvidence = evidence.find((item) => item.id === activeEvidence) ?? evidence[0]
  const selectedConnector = connectors.find((item) => item.id === activeConnector) ?? connectors[0]
  const selectedScenario = failureScenarios.find((item) => item.id === selectedFailure) ?? failureScenarios[0]
  const wordCount = useMemo(() => prompt.trim().split(/\s+/).filter(Boolean).length, [prompt])

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('.factory-stop')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > .42) setActiveStop(entry.target.id)
      })
    }, { threshold: [.42, .6] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!compiling) return
    const timer = window.setInterval(() => setCompileStage((value) => Math.min(value + 1, compileStages.length - 1)), 440)
    return () => window.clearInterval(timer)
  }, [compiling])

  useEffect(() => {
    if (!chaosRunning) return
    const timer = window.setTimeout(() => {
      setChaosStep((value) => {
        if (value >= recoveryStages.length - 1) {
          setChaosRunning(false)
          return value
        }
        return value + 1
      })
    }, 720)
    return () => window.clearTimeout(timer)
  }, [chaosRunning, chaosStep])

  useEffect(() => {
    if (!running || traceVisible >= trace.length) {
      if (running && trace.length && traceVisible >= trace.length) setRunning(false)
      return
    }
    const timer = window.setTimeout(() => setTraceVisible((value) => value + 1), 520)
    return () => window.clearTimeout(timer)
  }, [running, trace.length, traceVisible])

  const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const compile = async () => {
    setCompiling(true)
    setRouteReady(false)
    setCompileStage(0)
    const [result] = await Promise.all([api.compile(prompt), wait(2450)])
    setWorkflow(result)
    setCompiling(false)
    setRouteReady(true)
  }

  const decide = async (decision: 'approve' | 'reject') => {
    setDecisionBusy(true)
    await api.decideApproval(approvals[0].id, decision)
    setApprovalStatus(decision === 'approve' ? 'approved' : 'rejected')
    setDecisionBusy(false)
  }

  const injectFailure = () => {
    setChaosStep(0)
    setChaosRunning(true)
  }

  const runWorkflow = async () => {
    setRunning(true)
    setTrace([])
    setTraceVisible(0)
    const result = await api.execute(workflow.id)
    setTrace(result.trace)
  }

  return (
    <div className="factory-experience">
      <header className="factory-cap">
        <button onClick={() => goTo('intake')} className="factory-logo"><Factory size={18} /><span>INTEGRATE<b>X</b></span></button>
        <div className="factory-status"><i className={apiOnline ? 'live' : ''} /><span>{apiOnline ? 'BACKEND CONNECTED' : 'SAFE DEMO ENGINE'}</span></div>
        <a href="https://github.com/aahanaahir22/integratex" target="_blank" rel="noreferrer"><Github size={15} /> SOURCE <ArrowUpRight size={13} /></a>
      </header>

      <nav className="floor-selector" aria-label="Factory stations">
        <span className="rail-line" />
        {stops.map((stop) => (
          <button key={stop.id} onClick={() => goTo(stop.id)} className={activeStop === stop.id ? 'active' : ''} aria-label={`Go to ${stop.label}`}>
            <i>{stop.number}</i><span>{stop.label}</span>
          </button>
        ))}
      </nav>

      <main>
        <section id="intake" className="factory-stop intake-stop">
          <div className="section-flag"><span>FACTORY STOP</span><strong>01 / INTAKE</strong></div>
          <div className="intake-headline">
            <span className="overline"><Asterisk size={15} /> AI-NATIVE INTEGRATION COMPILER</span>
            <h1>YOUR<br />MESS.<br /><em>OUR MATERIAL.</em></h1>
            <p>Describe a business outcome in plain language. IntegrateX turns it into a typed route with evidence, policy gates and recovery built in.</p>
          </div>

          <div className={`intake-machine ${compiling ? 'working' : ''} ${routeReady ? 'ready' : ''}`}>
            <div className="intake-funnel"><span>RAW<br />INTENT</span><i /><i /></div>
            <div className="intake-drum">
              <motion.span animate={compiling ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 2.2, repeat: compiling ? Infinity : 0, ease: 'linear' }}><Braces size={33} /></motion.span>
              <strong>{compiling ? compileStages[compileStage] : routeReady ? 'ROUTE READY' : 'WAITING'}</strong>
            </div>
            <div className="intake-chute"><i /><i /><i /><motion.b animate={compiling ? { x: [0, 235] } : routeReady ? { x: 235 } : { x: 0 }} transition={{ duration: 2.2 }}><Box size={21} /></motion.b></div>
            <div className="intake-output"><PackageCheck size={29} /><span>WF / {workflow.version}<small>{workflow.nodes.length} OPERATIONS</small></span></div>
          </div>

          <div className="shipping-label">
            <header><span>SHIPMENT: BUSINESS INTENT</span><b>IX-0001</b></header>
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} aria-label="Describe the workflow to compile" />
            <div className="shipping-meta"><span>{wordCount} WORDS</span><span>MODE: GUARDED</span><span>SIDE EFFECTS: SIMULATED</span></div>
            <button onClick={compile} disabled={compiling || prompt.length < 20}>
              {compiling ? <><LoaderCircle className="spin" size={18} /> {compileStages[compileStage]}</> : <><Sparkles size={18} /> PRINT THE ROUTE <ArrowRight size={17} /></>}
            </button>
          </div>

          <button className="next-floor" onClick={() => goTo('scanner')}><span>NEXT: VERIFY THE MATERIAL</span><ArrowDown size={18} /></button>
        </section>

        <section id="scanner" className="factory-stop scanner-stop">
          <div className="section-flag inverted"><span>FACTORY STOP</span><strong>02 / EVIDENCE SCANNER</strong></div>
          <div className="scanner-heading">
            <span className="overline"><ScanLine size={15} /> VERSION-BOUND DOCUMENTATION</span>
            <h2>NO SOURCE?<br /><em>NO ROUTE.</em></h2>
            <p>Every suggested operation travels with the exact documentation that justified it.</p>
          </div>

          <div className="source-cascade">
            {evidence.map((item, index) => (
              <motion.button key={item.id} onClick={() => setActiveEvidence(item.id)} className={activeEvidence === item.id ? 'active' : ''} whileHover={{ x: 16 }}>
                <span>0{index + 1}</span><strong>{item.connector}</strong><small>{item.version}</small><ArrowRight size={15} />
              </motion.button>
            ))}
          </div>

          <div className="inspection-table">
            <div className="scanner-track"><motion.i animate={{ x: ['0%', '850%'] }} transition={{ duration: 3.3, repeat: Infinity, ease: 'easeInOut' }} /></div>
            <AnimatePresence mode="wait">
              <motion.article key={selectedEvidence.id} initial={{ opacity: 0, rotate: -3, y: 22 }} animate={{ opacity: 1, rotate: -.6, y: 0 }} exit={{ opacity: 0, rotate: 3, y: -15 }}>
                <header><span><FileSearch size={17} /> VERIFIED SOURCE</span><b>{Math.round(selectedEvidence.confidence * 100)}% MATCH</b></header>
                <small>{selectedEvidence.id} / {selectedEvidence.version}</small>
                <h3>{selectedEvidence.title}</h3>
                <blockquote>“{selectedEvidence.excerpt}”</blockquote>
                <footer><span>{selectedEvidence.source}</span><span>HASH {selectedEvidence.hash}</span></footer>
              </motion.article>
            </AnimatePresence>
            <div className="scan-verdict"><Fingerprint size={25} /><span>MODEL MAY CITE IT.<strong>ONLY CODE MAY AUTHORIZE IT.</strong></span></div>
          </div>
        </section>

        <section id="route" className="factory-stop route-stop">
          <div className="section-flag"><span>FACTORY STOP</span><strong>03 / ROUTING YARD</strong></div>
          <div className="route-title"><span className="overline"><Unplug size={15} /> TYPED WORKFLOW MANIFEST</span><h2>ONE REQUEST.<br /><em>{workflow.nodes.length} PHYSICAL STOPS.</em></h2></div>

          <div className="route-belt">
            <div className="route-spine" />
            {workflow.nodes.map((node, index) => (
              <motion.div key={node.id} className={`route-parcel ${node.data.status}`} initial={{ opacity: 0, y: index % 2 ? -45 : 45 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .11 }}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <i>{node.data.approval ? <LockKeyhole size={16} /> : node.data.evidence ? <FileSearch size={16} /> : <Zap size={16} />}</i>
                <small>{node.data.eyebrow}</small>
                <strong>{node.data.label}</strong>
                <em>{node.data.connector}</em>
              </motion.div>
            ))}
          </div>

          <div className="validation-stamps">
            <span>ROUTE INSPECTION</span>
            {workflow.validations.map((item) => <motion.b key={item} whileHover={{ rotate: -3, scale: 1.04 }}><Check size={12} /> {item}</motion.b>)}
          </div>

          <div className="crate-yard">
            <header><span>AVAILABLE API CARGO</span><strong>CLICK A CRATE TO INSPECT</strong></header>
            <div className="crate-row">
              {connectors.map((connector, index) => (
                <button key={connector.id} onClick={() => setActiveConnector(connector.id)} className={activeConnector === connector.id ? 'active' : ''} style={{ background: crateColors[index] }}>
                  <span>{connector.short}</span><strong>{connector.name}</strong><small>{connector.operations} OPS</small>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={selectedConnector.id} className="crate-manifest" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                <span><KeyRound size={14} /> {selectedConnector.auth}</span><span>VERSION {selectedConnector.version}</span><span>P95 {selectedConnector.latency}MS</span><span>{selectedConnector.scopes.join(' · ')}</span><b><CircleDot size={11} /> CONTRACT {selectedConnector.status.toUpperCase()}</b>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section id="guard" className={`factory-stop guard-stop gate-${approvalStatus}`}>
          <div className="section-flag"><span>FACTORY STOP</span><strong>04 / HUMAN GUARD</strong></div>
          <div className="guard-copy">
            <span className="overline"><ShieldCheck size={15} /> IRREVERSIBLE ACTION DETECTED</span>
            <h2>THE MACHINE<br /><em>KNOWS WHEN<br />TO STOP.</em></h2>
            <p>Existing customer records are never changed because a model “felt confident.” A person sees the evidence and owns the decision.</p>
          </div>

          <div className="gate-machine" aria-label={`Approval gate is ${approvalStatus}`}>
            <div className="gate-light"><i /><i /><i /></div>
            <motion.div className="gate-arm" animate={{ rotate: approvalStatus === 'approved' ? -72 : 0 }} transition={{ type: 'spring', stiffness: 80 }}><span>HUMAN APPROVAL REQUIRED</span></motion.div>
            <div className="gate-road"><motion.span animate={approvalStatus === 'approved' ? { x: 280 } : { x: 0 }} transition={{ duration: 1.4 }}><Box size={23} /></motion.span></div>
            <strong>{approvalStatus === 'approved' ? 'PASSAGE OPEN' : approvalStatus === 'rejected' ? 'ROUTE CANCELLED' : 'AUTOMATION PAUSED'}</strong>
          </div>

          <div className="decision-slip">
            <header><span>DECISION SLIP</span><b>{approvals[0].id}</b></header>
            <small>PROPOSED ACTION</small><h3>{approvals[0].action}</h3><p>{approvals[0].reason}</p>
            <pre><span>− lifecycle_stage: lead</span>{'\n'}<b>+ lifecycle_stage: customer</b>{'\n'}<span>− latest_order_value: 0</span>{'\n'}<b>+ latest_order_value: 12900</b></pre>
            {approvalStatus === 'pending' ? (
              <div className="decision-buttons">
                <button onClick={() => decide('reject')} disabled={decisionBusy}><X size={16} /> REJECT</button>
                <button onClick={() => decide('approve')} disabled={decisionBusy}>{decisionBusy ? <LoaderCircle className="spin" size={16} /> : <Stamp size={16} />} APPROVE ONCE</button>
              </div>
            ) : <div className={`decision-mark ${approvalStatus}`}>{approvalStatus === 'approved' ? <Check size={22} /> : <X size={22} />} {approvalStatus.toUpperCase()} · AUDIT RECORDED</div>}
          </div>
        </section>

        <section id="chaos" className="factory-stop chaos-stop">
          <div className="section-flag inverted"><span>FACTORY STOP</span><strong>05 / CHAOS TEST</strong></div>
          <div className="chaos-heading"><span className="overline"><AlertTriangle size={15} /> CONTROLLED FAILURE FLOOR</span><h2>BREAK THE<br /><em>ROUTE.</em></h2><p>Real systems fail. Here, recovery is something recruiters can watch—not a claim hidden in a README.</p></div>

          <div className="failure-dial">
            <span>CHOOSE A FAULT</span>
            <div>
              {failureScenarios.map((scenario, index) => (
                <button key={scenario.id} className={selectedFailure === scenario.id ? 'active' : ''} onClick={() => { setSelectedFailure(scenario.id); setChaosStep(-1); setChaosRunning(false) }}>
                  <i style={{ transform: `rotate(${index * 32 - 46}deg)` }} />
                  <strong>{scenario.code}</strong><small>{scenario.name}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="fault-manifest">
            <span>TARGET / {selectedScenario.target}</span><h3>{selectedScenario.name}</h3><p>{selectedScenario.description}</p><strong>RECOVERY PLAN: {selectedScenario.recovery}</strong>
            <button onClick={injectFailure} disabled={chaosRunning}>{chaosRunning ? <><RotateCcw className="spin" size={18} /> FAILURE IN PROGRESS</> : <><Zap size={18} /> INJECT {selectedScenario.code}</>}</button>
          </div>

          <div className={`recovery-pipe ${chaosRunning ? 'running' : ''} ${chaosStep === recoveryStages.length - 1 ? 'recovered' : ''}`}>
            <div className="pipe-line"><motion.i animate={chaosRunning ? { left: ['2%', '96%'] } : { left: '2%' }} transition={{ duration: 3.4, ease: 'linear' }} /></div>
            {recoveryStages.map((stage, index) => (
              <div key={stage} className={index < chaosStep ? 'done' : index === chaosStep ? 'active' : ''}>
                <span>{index < chaosStep || chaosStep === recoveryStages.length - 1 ? <Check size={13} /> : index + 1}</span><strong>{stage}</strong><small>{index === 2 ? '2.4S' : index <= chaosStep ? `${12 + index * 21}MS` : '—'}</small>
              </div>
            ))}
          </div>
        </section>

        <section id="receipt" className="factory-stop receipt-stop">
          <div className="section-flag"><span>FACTORY STOP</span><strong>06 / FINAL RECEIPT</strong></div>
          <div className="receipt-heading"><span className="overline"><Fingerprint size={15} /> VERIFIED BUSINESS OUTCOME</span><h2>IF IT HAPPENED,<br /><em>THERE IS A RECEIPT.</em></h2></div>

          <div className="receipt-printer">
            <div className="printer-body"><span>IX / OUTPUT</span><i /><button onClick={runWorkflow} disabled={running}><Play size={17} fill="currentColor" /> {running ? 'PRINTING…' : 'RUN + PRINT TRACE'}</button></div>
            <motion.div className="thermal-paper" animate={{ height: trace.length ? 590 : 225 }}>
              <header><Factory size={19} /><strong>INTEGRATEX</strong><span>EXECUTION RECEIPT</span></header>
              <p>{workflow.name}</p><small>TRACE / trc_91BX · MODE / GUARDED</small>
              <div className="paper-rule" />
              {trace.length === 0 ? <div className="paper-empty"><Play size={20} /> PRESS RUN TO PRINT VERIFIED EVENTS</div> : (
                <div className="printed-events">
                  {trace.slice(0, traceVisible).map((event, index) => (
                    <motion.div key={event.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}><span>{String(index + 1).padStart(2, '0')}</span><strong>{event.step}</strong><small>{event.duration}</small><em>{event.status === 'paused' ? 'GUARDED' : 'OK'}</em></motion.div>
                  ))}
                </div>
              )}
              <footer><span>AI PROPOSED</span><span>CODE DECIDED</span><span>HUMAN CONTROLLED</span></footer>
            </motion.div>
          </div>

          <div className="outcome-wall">
            <header><span>SEEDED DEMO SIGNALS</span><strong>REPRODUCIBLE PROTOCOL IN REPOSITORY</strong></header>
            {metrics.map((metric, index) => (
              <div key={metric.label} style={{ background: crateColors[index] }}><span>0{index + 1}</span><small>{metric.label}</small><strong>{metric.value}</strong><em>{metric.delta}</em></div>
            ))}
          </div>

          <div className="factory-exit">
            <span>THE ROUTE IS COMPLETE.</span>
            <h3>NOT AN AI<br />DASHBOARD.<br /><em>A SAFE SYSTEM.</em></h3>
            <p>FastAPI · typed plans · versioned evidence · policy gates · human approval · failure recovery · audit traces</p>
            <div><a href="https://github.com/aahanaahir22/integratex" target="_blank" rel="noreferrer"><Github size={17} /> INSPECT THE ENGINEERING <ArrowUpRight size={15} /></a><button onClick={() => goTo('intake')}>RUN IT AGAIN <RotateCcw size={15} /></button></div>
          </div>
        </section>
      </main>
    </div>
  )
}
