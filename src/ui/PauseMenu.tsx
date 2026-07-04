import { motion, AnimatePresence } from 'framer-motion'
import { useMuseum } from '../state/store'
import { setMuted } from '../systems/audio/engine'

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="setting">
      <span className="setting__label">{label}</span>
      <button
        className={`toggle ${on ? 'toggle--on' : ''}`}
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => onChange(!on)}
      />
    </div>
  )
}

export function PauseMenu() {
  const phase = useMuseum((s) => s.phase)
  const paused = useMuseum((s) => s.paused)
  const setPaused = useMuseum((s) => s.setPaused)
  const setPhase = useMuseum((s) => s.setPhase)
  const settings = useMuseum((s) => s.settings)
  const updateSettings = useMuseum((s) => s.updateSettings)

  const open = phase === 'play' && paused

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="panel panel--narrow"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
          >
            <p className="panel__kicker">Paused</p>
            <h2 className="panel__title">Museum desk</h2>

            <div className="setting">
              <span className="setting__label">Mouse sensitivity</span>
              <input
                type="range"
                min={0.2}
                max={2}
                step={0.1}
                value={settings.sensitivity}
                aria-label="Mouse sensitivity"
                onChange={(e) => updateSettings({ sensitivity: Number(e.target.value) })}
              />
            </div>
            <Toggle
              label="Head bob"
              on={settings.headBob}
              onChange={(v) => updateSettings({ headBob: v })}
            />
            <Toggle
              label="Reduced motion"
              on={settings.reducedMotion}
              onChange={(v) => updateSettings({ reducedMotion: v, headBob: v ? false : settings.headBob })}
            />
            <Toggle
              label="Sound"
              on={!settings.muted}
              onChange={(v) => {
                setMuted(!v)
                updateSettings({ muted: !v })
              }}
            />
            <Toggle
              label="High quality"
              on={settings.quality === 'high'}
              onChange={(v) => updateSettings({ quality: v ? 'high' : 'low' })}
            />

            <div className="panel__actions">
              <button className="btn btn--primary" onClick={() => setPaused(false)}>
                Resume
              </button>
              <button
                className="btn"
                onClick={() => {
                  setPaused(false)
                  setPhase('gallery2d')
                }}
              >
                2D version
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
