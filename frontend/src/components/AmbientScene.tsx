import { motion } from 'framer-motion'

export function AmbientScene() {
  return (
    <div className="ambient-scene" aria-hidden="true">
      <div className="noise" />
      <div className="grid-plane" />
      <div className="reactor-beam beam-one" />
      <div className="reactor-beam beam-two" />
      <motion.div className="aurora aurora-one" animate={{ x: [0, 70, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.18, 0.96, 1] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="aurora aurora-two" animate={{ x: [0, -80, 30, 0], y: [0, 50, -10, 0], scale: [1, 0.9, 1.15, 1] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.span className="ambient-chip chip-one" animate={{ y: [0, -18, 0], rotate: [-4, 3, -4] }} transition={{ duration: 5, repeat: Infinity }}>SIGNAL // 01</motion.span>
      <motion.span className="ambient-chip chip-two" animate={{ y: [0, 15, 0], rotate: [5, -2, 5] }} transition={{ duration: 6.5, repeat: Infinity }}>RECOVER // 99</motion.span>
      <div className="scanline" />
    </div>
  )
}
