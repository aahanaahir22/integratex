import { Activity, Blocks, BookOpenText, Bot, Cable, ChevronRight, Command, FlaskConical, Gauge, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import type { NavId } from '../types'

interface SidebarProps {
  active: NavId
  onChange: (id: NavId) => void
}

const items: Array<{ id: NavId; label: string; icon: typeof Activity; badge?: string }> = [
  { id: 'overview', label: 'Mission control', icon: Command },
  { id: 'studio', label: 'Compiler studio', icon: Bot, badge: 'AI' },
  { id: 'failure', label: 'Failure lab', icon: FlaskConical, badge: '04' },
  { id: 'connectors', label: 'Connector mesh', icon: Cable, badge: '06' },
  { id: 'evidence', label: 'Evidence vault', icon: BookOpenText },
  { id: 'analytics', label: 'Reliability', icon: Gauge },
  { id: 'approvals', label: 'Guard rail', icon: ShieldCheck, badge: '02' },
]

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => onChange('overview')} aria-label="Open mission control">
        <span className="brand-mark"><Blocks size={18} /></span>
        <span><strong>INTEGRATE</strong><b>X</b></span>
      </button>

      <div className="workspace-chip">
        <span className="avatar">AA</span>
        <span><small>WORKSPACE</small><strong>Aahana / Lab</strong></span>
        <ChevronRight size={14} />
      </div>

      <nav>
        <span className="nav-label">CONTROL SURFACE</span>
        {items.map((item) => {
          const Icon = item.icon
          return (
            <button key={item.id} className={active === item.id ? 'active' : ''} onClick={() => onChange(item.id)}>
              {active === item.id && <motion.i layoutId="nav-active" transition={{ type: 'spring', stiffness: 350, damping: 32 }} />}
              <Icon size={17} />
              <span>{item.label}</span>
              {item.badge && <em>{item.badge}</em>}
            </button>
          )
        })}
      </nav>

      <div className="system-card">
        <div><span className="pulse-dot" /><small>SYSTEM HEALTH</small></div>
        <strong>All engines nominal</strong>
        <div className="health-bars"><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <span><b>99.98%</b> / last 24h</span>
      </div>

      <div className="sidebar-foot">
        <span><Activity size={13} /> 4 workers awake</span>
        <span>v0.9.7</span>
      </div>
    </aside>
  )
}
