import { motion, AnimatePresence } from 'framer-motion'
import { useMuseum, isTouchDevice } from '../state/store'
import { initAudio } from '../systems/audio/engine'
import { PROFILE } from '../config/content'

/** Title screen shown over the drifting exterior camera. */
export function IntroOverlay() {
  const phase = useMuseum((s) => s.phase)
  const setPhase = useMuseum((s) => s.setPhase)
  const reducedMotion = useMuseum((s) => s.settings.reducedMotion)

  const enter = () => {
    initAudio()
    // Reduced motion skips the flight inside CinematicRig itself
    setPhase('cinematic')
  }

  return (
    <AnimatePresence>
      {phase === 'title' && (
        <motion.div
          className="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.2 } }}
        >
          <motion.div
            className="intro__card"
            initial={{ opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.25, duration: 1, ease: [0.2, 0.9, 0.25, 1] } }}
          >
            <motion.p
              className="intro__kicker"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.8 } }}
            >
              A museum of work
            </motion.p>
            <motion.h1
              className="intro__title"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.7, duration: 1 } }}
            >
              {PROFILE.name}
            </motion.h1>
            <motion.p
              className="intro__subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1.1, duration: 0.9 } }}
            >
              {PROFILE.title} — every room a skill, every project an installation.
            </motion.p>
            <motion.div
              className="intro__actions"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 1.4, duration: 0.8 } }}
            >
              <button className="btn btn--primary" onClick={enter}>
                Enter the gallery
              </button>
              <button className="btn" onClick={() => setPhase('gallery2d')}>
                View 2D version
              </button>
            </motion.div>
          </motion.div>
          <motion.p
            className="intro__hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 2.2, duration: 1 } }}
          >
            {isTouchDevice
              ? 'Joystick to walk · drag to look'
              : 'WASD to walk · mouse to look · E to interact'}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
