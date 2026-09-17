import { motion } from 'framer-motion'

const threads = [
  'M-80 160 C190 20 330 310 610 130 S1030 40 1380 210',
  'M-60 520 C220 690 390 330 650 520 S1040 760 1460 470',
  'M120 -80 C40 230 350 270 190 560 S280 900 480 1040',
  'M1120 -120 C890 160 1210 320 980 560 S870 870 1230 1060',
]

export function AmbientScene() {
  return (
    <div className="ambient-scene loom-ambient" aria-hidden="true">
      <div className="paper-grain" />
      <svg className="thread-field" viewBox="0 0 1400 900" preserveAspectRatio="none">
        {threads.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0.16, 0.34, 0.16] }}
            transition={{ pathLength: { duration: 2.2, delay: index * 0.18 }, opacity: { duration: 7 + index, repeat: Infinity } }}
          />
        ))}
      </svg>
      <motion.div className="floating-index index-a" animate={{ y: [0, -22, 0], rotate: [-2, 4, -2] }} transition={{ duration: 7, repeat: Infinity }}>API / 06</motion.div>
      <motion.div className="floating-index index-b" animate={{ y: [0, 18, 0], rotate: [4, -3, 4] }} transition={{ duration: 8.5, repeat: Infinity }}>TRACE / LIVE</motion.div>
      <div className="loom-corner corner-one" />
      <div className="loom-corner corner-two" />
    </div>
  )
}
