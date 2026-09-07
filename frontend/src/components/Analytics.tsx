import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, CheckCircle2, Gauge, Radar, ShieldCheck, Timer, TrendingUp, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { metrics } from '../data'

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const coords = points.map((point, index) => `${(index / (points.length - 1)) * 100},${28 - ((point - min) / Math.max(max - min, 1)) * 24}`).join(' ')
  return <svg className="sparkline" viewBox="0 0 100 32" preserveAspectRatio="none"><polyline points={coords} style={{ stroke: color }} /></svg>
}

const failureBars = [
  { name: 'Rate limit', value: 78, count: 34, color: '#9d7bff' },
  { name: 'Timeout', value: 54, count: 23, color: '#70b8ff' },
  { name: 'Auth scope', value: 31, count: 13, color: '#ffce66' },
  { name: 'Schema drift', value: 20, count: 8, color: '#ff7b8b' },
]

export function Analytics() {
  return (
    <motion.div className="page analytics-page" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="page-heading">
        <div><span className="section-kicker"><Radar size={14} /> RELIABILITY SIGNALS / 7-DAY WINDOW</span><h2>Measure outcomes.<br /><em>Not AI theatre.</em></h2></div>
        <div className="range-picker"><button>24H</button><button className="active">7D</button><button>30D</button><button>90D</button></div>
      </div>

      <section className="metric-cards">
        {metrics.map((metric, index) => (
          <motion.article key={metric.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} style={{ '--metric': metric.tone } as React.CSSProperties}>
            <header><span>{index === 0 ? <Zap size={14} /> : index === 1 ? <ShieldCheck size={14} /> : index === 2 ? <Timer size={14} /> : <CheckCircle2 size={14} />}{metric.label.toUpperCase()}</span><em>{metric.delta.startsWith('-') ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}{metric.delta}</em></header>
            <strong>{metric.value}</strong>
            <Sparkline points={metric.points} color={metric.tone} />
          </motion.article>
        ))}
      </section>

      <section className="analytics-grid">
        <article className="throughput-chart panel">
          <header><span><Activity size={15} /> EXECUTION THROUGHPUT</span><em>1,284 RUNS</em></header>
          <div className="chart-y"><span>200</span><span>150</span><span>100</span><span>50</span><span>0</span></div>
          <div className="area-chart">
            <svg viewBox="0 0 700 220" preserveAspectRatio="none">
              <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9d7bff" stopOpacity=".45" /><stop offset="1" stopColor="#9d7bff" stopOpacity="0" /></linearGradient></defs>
              <path d="M0 185 C35 170,45 130,85 145 S140 178,180 125 S230 75,270 104 S330 150,370 92 S430 52,470 78 S530 112,570 60 S635 35,700 48 L700 220 L0 220Z" fill="url(#area)" />
              <path d="M0 185 C35 170,45 130,85 145 S140 178,180 125 S230 75,270 104 S330 150,370 92 S430 52,470 78 S530 112,570 60 S635 35,700 48" fill="none" stroke="#a88cff" strokeWidth="3" />
            </svg>
            <div className="chart-grid-lines"><i /><i /><i /><i /><i /></div>
            <div className="chart-x"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div>
          </div>
        </article>

        <article className="failure-chart panel">
          <header><span><BarChart3 size={15} /> FAILURE DISTRIBUTION</span><em>78 EVENTS</em></header>
          <div className="failure-bars">
            {failureBars.map((bar) => <div key={bar.name}><span><strong>{bar.name}</strong><em>{bar.count}</em></span><div><i style={{ width: `${bar.value}%`, background: bar.color }} /></div></div>)}
          </div>
          <footer><TrendingUp size={13} /> 93.4% of transient failures recovered without manual intervention.</footer>
        </article>
      </section>

      <section className="quality-grid">
        <article><Gauge size={18} /><span><small>SCHEMA CHANGES CAUGHT</small><strong>12 / 12</strong></span><em>100%</em></article>
        <article><ShieldCheck size={18} /><span><small>UNGUARDED RISKY ACTIONS</small><strong>0</strong></span><em>PASS</em></article>
        <article><Zap size={18} /><span><small>DUPLICATE SIDE EFFECTS</small><strong>0</strong></span><em>PASS</em></article>
        <article><CheckCircle2 size={18} /><span><small>CONTRACT TESTS</small><strong>184 / 184</strong></span><em>PASS</em></article>
      </section>
    </motion.div>
  )
}
