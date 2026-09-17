import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FactoryExperience } from './components/FactoryExperience'
import { Intro } from './components/Intro'

function App() {
  const [entered, setEntered] = useState(false)
  const [apiOnline, setApiOnline] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = 'factory'
    fetch('/health').then((response) => setApiOnline(response.ok)).catch(() => setApiOnline(false))
  }, [])

  return (
    <div className="data-factory-shell">
      <AnimatePresence>{!entered && <Intro onEnter={() => setEntered(true)} />}</AnimatePresence>
      {entered && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .55 }}>
          <FactoryExperience apiOnline={apiOnline} />
        </motion.div>
      )}
    </div>
  )
}

export default App
