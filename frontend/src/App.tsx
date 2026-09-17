import { lazy, Suspense, useEffect, useState } from 'react'
import { ArrowUpRight, CircleDot, Github, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { NavId } from './types'
import { AmbientScene } from './components/AmbientScene'
import { Intro } from './components/Intro'

const Overview = lazy(() => import('./components/Overview').then((module) => ({ default: module.Overview })))
const Studio = lazy(() => import('./components/Studio').then((module) => ({ default: module.Studio })))
const FailureLab = lazy(() => import('./components/FailureLab').then((module) => ({ default: module.FailureLab })))
const Connectors = lazy(() => import('./components/Connectors').then((module) => ({ default: module.Connectors })))
const EvidenceVault = lazy(() => import('./components/EvidenceVault').then((module) => ({ default: module.EvidenceVault })))
const Analytics = lazy(() => import('./components/Analytics').then((module) => ({ default: module.Analytics })))
const Approvals = lazy(() => import('./components/Approvals').then((module) => ({ default: module.Approvals })))

const scenes: Array<{ id: NavId; number: string; label: string; verb: string }> = [
  { id: 'overview', number: '00', label: 'The Loom', verb: 'Understand' },
  { id: 'studio', number: '01', label: 'Compose', verb: 'Build' },
  { id: 'evidence', number: '02', label: 'Receipts', verb: 'Ground' },
  { id: 'approvals', number: '03', label: 'Decision', verb: 'Guard' },
  { id: 'failure', number: '04', label: 'Chaos', verb: 'Recover' },
  { id: 'connectors', number: '05', label: 'Passport', verb: 'Connect' },
  { id: 'analytics', number: '06', label: 'Outcomes', verb: 'Measure' },
]

function App() {
  const [entered, setEntered] = useState(false)
  const [active, setActive] = useState<NavId>('overview')
  const [apiOnline, setApiOnline] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = 'loom'
    fetch('/health').then((response) => setApiOnline(response.ok)).catch(() => setApiOnline(false))
  }, [])

  const activeIndex = scenes.findIndex((scene) => scene.id === active)
  const activeScene = scenes[activeIndex]

  return (
    <div className="loom-shell">
      <AmbientScene />
      <AnimatePresence>{!entered && <Intro onEnter={() => setEntered(true)} />}</AnimatePresence>
      {entered && (
        <motion.div className="loom-experience" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16, duration: 0.55 }}>
          <header className="loom-header">
            <button className="loom-brand" onClick={() => setActive('overview')} aria-label="Open IntegrateX overview">
              <span>IX</span>
              <strong>INTEGRATEX<small>WORKFLOW INTELLIGENCE</small></strong>
            </button>

            <nav className="scene-nav" aria-label="Product areas">
              {scenes.map((scene) => (
                <button key={scene.id} className={active === scene.id ? 'active' : ''} onClick={() => setActive(scene.id)}>
                  <small>{scene.number}</small>
                  <span>{scene.label}</span>
                  {active === scene.id && <motion.i layoutId="scene-active" />}
                </button>
              ))}
            </nav>

            <div className="loom-header-actions">
              <span className={apiOnline ? 'runtime-state live' : 'runtime-state'}><CircleDot size={12} /> {apiOnline ? 'API LIVE' : 'SAFE SIMULATION'}</span>
              <a href="https://github.com/aahanaahir22/integratex" target="_blank" rel="noreferrer"><Github size={15} /><span>SOURCE</span><ArrowUpRight size={13} /></a>
            </div>
          </header>

          <div className="scene-progress" aria-hidden="true"><motion.span animate={{ width: `${((activeIndex + 1) / scenes.length) * 100}%` }} /></div>

          <main className="loom-main">
            <Suspense fallback={<div className="page-loading"><Sparkles size={18} /><strong>THREADING THE NEXT SCENE</strong></div>}>
              <AnimatePresence mode="wait">
                {active === 'overview' && <Overview key="overview" navigate={setActive} />}
                {active === 'studio' && <Studio key="studio" />}
                {active === 'failure' && <FailureLab key="failure" />}
                {active === 'connectors' && <Connectors key="connectors" />}
                {active === 'evidence' && <EvidenceVault key="evidence" />}
                {active === 'analytics' && <Analytics key="analytics" />}
                {active === 'approvals' && <Approvals key="approvals" />}
              </AnimatePresence>
            </Suspense>
          </main>

          <footer className="scene-footer">
            <span>{activeScene.number} / {activeScene.verb.toUpperCase()}</span>
            <strong>AI PROPOSES <i /> DETERMINISTIC CODE DECIDES</strong>
            <span>SAFE SIDE-EFFECT SIMULATION</span>
          </footer>
        </motion.div>
      )}
    </div>
  )
}

export default App
