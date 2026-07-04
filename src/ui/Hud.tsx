import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMuseum, isTouchDevice } from '../state/store'
import { ROOM_LABELS } from '../config/content'
import { ROOMS } from '../scene/layout'
import { playerState } from '../systems/player/playerState'
import { setMuted } from '../systems/audio/engine'

export function Hud() {
  const phase = useMuseum((s) => s.phase)
  const paused = useMuseum((s) => s.paused)
  const modal = useMuseum((s) => s.modal)
  const focused = useMuseum((s) => s.focused)
  const toast = useMuseum((s) => s.toast)
  const currentRoom = useMuseum((s) => s.currentRoom)
  const minimap = useMuseum((s) => s.minimap)
  const muted = useMuseum((s) => s.settings.muted)
  const pointerLocked = useMuseum((s) => s.pointerLocked)
  const updateSettings = useMuseum((s) => s.updateSettings)
  const setPaused = useMuseum((s) => s.setPaused)
  const [showControls, setShowControls] = useState(true)

  // Fade the controls card after the first half minute of play
  useEffect(() => {
    if (phase !== 'play') return
    const t = setTimeout(() => setShowControls(false), 26000)
    return () => clearTimeout(t)
  }, [phase])

  if (phase === 'boot' || phase === 'title' || phase === 'gallery2d') return null

  const playing = phase === 'play' && !paused && !modal

  return (
    <div className="hud" aria-hidden={!playing}>
      {/* Skip during the fly-in */}
      <AnimatePresence>
        {phase === 'cinematic' && (
          <motion.button
            key="skip"
            className="btn btn--ghost"
            style={{ position: 'absolute', bottom: '2rem', right: '2rem', pointerEvents: 'auto', letterSpacing: '0.25em' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.8 } }}
            exit={{ opacity: 0 }}
            onClick={() => window.dispatchEvent(new Event('museum:skip-intro'))}
          >
            SKIP INTRO →
          </motion.button>
        )}
      </AnimatePresence>

      {playing && (
        <>
          <div className={`hud__crosshair ${focused ? 'hud__crosshair--focus' : ''}`} />

          {!isTouchDevice && !pointerLocked && (
            <motion.div
              className="hud__prompt"
              style={{ top: 'calc(50% + 5rem)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.4 } }}
            >
              Click to look around
            </motion.div>
          )}

          <AnimatePresence>
            {focused && (
              <motion.div
                key={focused.id}
                className="hud__prompt"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {!isTouchDevice && <kbd>E</kbd>}
                {focused.prompt}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoom}
              className="hud__room"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {ROOM_LABELS[currentRoom] ?? ''}
            </motion.div>
          </AnimatePresence>

          {showControls && !isTouchDevice && (
            <motion.div className="hud__controls" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div><kbd>W A S D</kbd> walk</div>
              <div><kbd>Shift</kbd> sprint &nbsp; <kbd>Space</kbd> jump</div>
              <div><kbd>E</kbd> interact &nbsp; <kbd>M</kbd> map &nbsp; <kbd>Esc</kbd> menu</div>
            </motion.div>
          )}

          {minimap && <Minimap />}

          <div className="hud__corner">
            <button
              className="hud__iconbtn"
              aria-label={muted ? 'Unmute' : 'Mute'}
              onClick={() => {
                setMuted(!muted)
                updateSettings({ muted: !muted })
              }}
            >
              {muted ? '🔇' : '🔊'}
            </button>
            <button className="hud__iconbtn" aria-label="Menu" onClick={() => setPaused(true)}>
              ☰
            </button>
          </div>
        </>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            className="hud__toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Top-down schematic of the floor plan with a live player dot. */
function Minimap() {
  const secretUnlocked = useMuseum((s) => s.secretUnlocked)
  const [, force] = useState(0)
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 120)
    return () => clearInterval(id)
  }, [])

  // World → map: x right, z down. World x -16..16, z -23..17
  const sx = (x: number) => ((x + 16) / 32) * 150
  const sz = (z: number) => ((z + 23) / 40) * 185

  return (
    <div className="minimap">
      <svg width={150} height={185} viewBox="0 0 150 185">
        {ROOMS.filter((r) => r.id !== 'secret' || secretUnlocked).map((r) => (
          <rect
            key={r.id}
            x={sx(r.minX)}
            y={sz(r.minZ)}
            width={sx(r.maxX) - sx(r.minX)}
            height={sz(r.maxZ) - sz(r.minZ)}
            fill="rgba(216,180,126,0.07)"
            stroke="rgba(216,180,126,0.4)"
            strokeWidth={1}
          />
        ))}
        <circle cx={sx(playerState.x)} cy={sz(playerState.z)} r={3.4} fill="#ffd9a8" />
        {/* facing tick: forward is (-sin yaw, -cos yaw) in world xz */}
        <line
          x1={sx(playerState.x)}
          y1={sz(playerState.z)}
          x2={sx(playerState.x) - Math.sin(playerState.yaw) * 9}
          y2={sz(playerState.z) - Math.cos(playerState.yaw) * 9}
          stroke="#ffd9a8"
          strokeWidth={1.4}
        />
      </svg>
    </div>
  )
}
