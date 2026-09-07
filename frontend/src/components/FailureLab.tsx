import { useEffect, useState } from 'react'
import { AlertOctagon, ArrowRight, Check, CircleDotDashed, FlaskConical, Gauge, Network, Pause, Play, RefreshCcw, RotateCcw, ShieldAlert, TimerReset, TriangleAlert } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { failureScenarios } from '../data'

const recoverySteps = [
  { name: 'Failure intercepted', detail: 'HTTP response normalized as provider.rate_limit', icon: AlertOctagon },
  { name: 'Policy classified', detail: 'Transient and safe to retry within a 12s budget', icon: ShieldAlert },
  { name: 'Backoff scheduled', detail: 'Retry-After respected + 182ms jitter applied', icon: TimerReset },
  { name: 'Dependency isolated', detail: 'Circuit remains closed; unrelated branch continues', icon: Network },
  { name: 'Outcome verified', detail: 'Third attempt accepted with remote object ID', icon: Check },
]

export function FailureLab() {
  const [selected, setSelected] = useState(failureScenarios[0])
  const [running, setRunning] = useState(false)
  const [step, setStep] = useState(0)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!running) return
    if (step >= recoverySteps.length) {
      setRunning(false)
      return
    }
    const timer = window.setTimeout(() => {
      setStep((value) => value + 1)
      if (step === 1 || step === 2) setAttempt((value) => value + 1)
    }, 850)
    return () => window.clearTimeout(timer)
  }, [running, step])

  const inject = () => {
    setStep(0)
    setAttempt(1)
    setRunning(true)
  }

  return (
    <motion.div className="page failure-page" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="page-heading">
        <div><span className="section-kicker danger"><FlaskConical size={14} /> RESILIENCE SIMULATOR / CONTROLLED</span><h2>Break it on purpose.<br /><em>Watch it recover.</em></h2></div>
        <div className="lab-score"><span>93.4<small>%</small></span><em>AUTO-RECOVERY<br />LAST 7 DAYS</em></div>
      </div>

      <section className="scenario-grid">
        {failureScenarios.map((scenario) => (
          <button key={scenario.id} className={`${selected.id === scenario.id ? 'selected' : ''} ${scenario.severity}`} onClick={() => { setSelected(scenario); setRunning(false); setStep(0) }}>
            <span className="scenario-code">{scenario.code}</span>
            <span><small>{scenario.severity.toUpperCase()} IMPACT</small><strong>{scenario.name}</strong><p>{scenario.description}</p></span>
            <ArrowRight size={15} />
          </button>
        ))}
      </section>

      <section className="lab-console">
        <article className="injection-config panel">
          <header><span><TriangleAlert size={15} /> INJECTION PROFILE</span><span className="danger-pill">SANDBOX ONLY</span></header>
          <div className="failure-symbol">{selected.code}<span /></div>
          <div className="config-row"><small>SCENARIO</small><strong>{selected.name}</strong></div>
          <div className="config-row"><small>TARGET</small><strong>{selected.target}</strong></div>
          <div className="config-row"><small>EXPECTED RECOVERY</small><strong>{selected.recovery}</strong></div>
          <div className="config-row"><small>SAFETY</small><strong><Check size={12} /> Synthetic endpoint · no real transaction</strong></div>
          <button className="inject-button" onClick={inject} disabled={running}>{running ? <><RefreshCcw className="spin" size={15} /> INJECTING FAILURE…</> : <><Play size={15} fill="currentColor" /> INJECT {selected.name.toUpperCase()}</>}</button>
        </article>

        <article className="recovery-console panel">
          <header><span><RotateCcw size={15} /> RECOVERY ENGINE</span><span className={running ? 'status-pill working' : step === recoverySteps.length ? 'status-pill recovered' : 'status-pill'}>{running ? 'RECOVERING' : step === recoverySteps.length ? 'RECOVERED' : 'ARMED'}</span></header>
          <div className="recovery-head">
            <div><small>TRACE ID</small><strong>trc_91BX_429</strong></div>
            <div><small>ATTEMPT</small><strong>{attempt || '—'} / 3</strong></div>
            <div><small>BUDGET</small><strong>12.0s</strong></div>
            <div><small>SIDE EFFECTS</small><strong className="mint">0 duplicate</strong></div>
          </div>
          <div className="recovery-timeline">
            {recoverySteps.map((item, index) => {
              const Icon = item.icon
              const complete = index < step
              const active = running && index === step
              return (
                <motion.div key={item.name} className={`${complete ? 'complete' : ''} ${active ? 'active' : ''}`}>
                  <span>{complete ? <Check size={14} /> : active ? <CircleDotDashed className="spin" size={14} /> : <Icon size={14} />}</span>
                  <div><strong>{item.name}</strong><small>{item.detail}</small></div>
                  <em>{complete ? index === 2 ? '2.4s' : `${12 + index * 19}ms` : active ? 'LIVE' : '—'}</em>
                </motion.div>
              )
            })}
          </div>
          <AnimatePresence>
            {step === recoverySteps.length && !running && (
              <motion.div className="recovered-banner" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><Check size={16} /> BUSINESS OUTCOME VERIFIED <span>remote_id: hs_48291</span></motion.div>
            )}
          </AnimatePresence>
        </article>
      </section>

      <section className="reliability-strip">
        <span><Gauge size={15} /><b>Design truth:</b> IntegrateX claims effectively-once business behaviour—not impossible exactly-once delivery.</span>
        <div><span><i className="mint-bg" /> IDEMPOTENCY</span><span><i className="violet-bg" /> DEDUPLICATION</span><span><i className="blue-bg" /> CHECKPOINTS</span><span><i className="yellow-bg" /> VERIFICATION</span></div>
      </section>
    </motion.div>
  )
}
