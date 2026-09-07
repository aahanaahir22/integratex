import { lazy, Suspense, useEffect, useState } from 'react'
import { Bell, ChevronDown, CircleHelp, Menu, Palette, Wifi, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { NavId } from './types'
import { AmbientScene } from './components/AmbientScene'
import { Intro } from './components/Intro'
import { Sidebar } from './components/Sidebar'

const Overview = lazy(() => import('./components/Overview').then((module) => ({ default: module.Overview })))
const Studio = lazy(() => import('./components/Studio').then((module) => ({ default: module.Studio })))
const FailureLab = lazy(() => import('./components/FailureLab').then((module) => ({ default: module.FailureLab })))
const Connectors = lazy(() => import('./components/Connectors').then((module) => ({ default: module.Connectors })))
const EvidenceVault = lazy(() => import('./components/EvidenceVault').then((module) => ({ default: module.EvidenceVault })))
const Analytics = lazy(() => import('./components/Analytics').then((module) => ({ default: module.Analytics })))
const Approvals = lazy(() => import('./components/Approvals').then((module) => ({ default: module.Approvals })))

const pageNames: Record<NavId, string> = {
  overview: 'Mission control',
  studio: 'Compiler studio',
  failure: 'Failure lab',
  connectors: 'Connector mesh',
  evidence: 'Evidence vault',
  analytics: 'Reliability signals',
  approvals: 'Guard rail',
}

const themes = [
  { id: 'arcade', label: 'Neon arcade' },
  { id: 'solar', label: 'Solar riot' },
  { id: 'glacier', label: 'Glacier pulse' },
] as const

type ThemeId = (typeof themes)[number]['id']

function App() {
  const [entered, setEntered] = useState(false)
  const [active, setActive] = useState<NavId>('overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [apiOnline, setApiOnline] = useState(false)
  const [theme, setTheme] = useState<ThemeId>(() => {
    const saved = window.localStorage.getItem('integratex-theme')
    return themes.some((item) => item.id === saved) ? saved as ThemeId : 'arcade'
  })

  useEffect(() => {
    fetch('/health').then((response) => setApiOnline(response.ok)).catch(() => setApiOnline(false))
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('integratex-theme', theme)
  }, [theme])

  const cycleTheme = () => {
    const index = themes.findIndex((item) => item.id === theme)
    setTheme(themes[(index + 1) % themes.length].id)
  }

  const themeLabel = themes.find((item) => item.id === theme)?.label ?? 'Neon arcade'

  const navigate = (id: NavId) => {
    setActive(id)
    setMobileOpen(false)
  }

  return (
    <div className="app-shell">
      <AmbientScene />
      <AnimatePresence>{!entered && <Intro onEnter={() => setEntered(true)} />}</AnimatePresence>
      {entered && (
        <motion.div className="console-shell" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.7 }}>
          <div className={mobileOpen ? 'sidebar-wrap open' : 'sidebar-wrap'}><Sidebar active={active} onChange={navigate} /></div>
          {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}
          <div className="console-main">
            <header className="topbar">
              <button className="menu-button" onClick={() => setMobileOpen((value) => !value)}>{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button>
              <div className="breadcrumb"><span>INTEGRATEX</span><i>/</i><strong>{pageNames[active].toUpperCase()}</strong></div>
              <div className="topbar-actions">
                <button className="theme-button" onClick={cycleTheme} aria-label={`Change theme. Current theme: ${themeLabel}`} title="Cycle visual theme"><Palette size={15} /><span>{themeLabel}</span><i /></button>
                <span className={`api-state ${apiOnline ? 'online' : ''}`}><Wifi size={13} /> {apiOnline ? 'API LIVE' : 'DEMO MODE'}</span>
                <button className="icon-button"><CircleHelp size={16} /></button>
                <button className="icon-button notification"><Bell size={16} /><i /></button>
                <button className="user-button"><span>AA</span><ChevronDown size={13} /></button>
              </div>
            </header>
            <main>
              <Suspense fallback={<div className="page-loading"><span /><strong>LOADING CONTROL SURFACE</strong></div>}>
                <AnimatePresence mode="wait">
                  {active === 'overview' && <Overview key="overview" navigate={navigate} />}
                  {active === 'studio' && <Studio key="studio" />}
                  {active === 'failure' && <FailureLab key="failure" />}
                  {active === 'connectors' && <Connectors key="connectors" />}
                  {active === 'evidence' && <EvidenceVault key="evidence" />}
                  {active === 'analytics' && <Analytics key="analytics" />}
                  {active === 'approvals' && <Approvals key="approvals" />}
                </AnimatePresence>
              </Suspense>
            </main>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default App
