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
  const currentRoom = useMuseum((s) => s.currentRoom)
  const [, force] = useState(0)
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 90)
    return () => clearInterval(id)
  }, [])

  // World → map: x right, z down. World x -16..16, z -23..17
  const W = 150
  const H = 185
  const sx = (x: number) => ((x + 16) / 32) * W
  const sz = (z: number) => ((z + 23) / 40) * H

  const px = sx(playerState.x)
  const py = sz(playerState.z)

  return (
    <div className="minimap">
      <div className="minimap__title">{ROOM_LABELS[currentRoom] ?? 'Museum'}</div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {ROOMS.filter((r) => r.id !== 'secret' || secretUnlocked).map((r) => {
          const here = r.id === currentRoom
          return (
            <rect
              key={r.id}
              x={sx(r.minX)}
              y={sz(r.minZ)}
              width={sx(r.maxX) - sx(r.minX)}
              height={sz(r.maxZ) - sz(r.minZ)}
              rx={3}
              fill={here ? 'rgba(216,180,126,0.28)' : 'rgba(255,255,255,0.05)'}
              stroke={here ? 'rgba(255,217,168,0.9)' : 'rgba(255,255,255,0.22)'}
              strokeWidth={here ? 1.5 : 1}
            />
          )
        })}
        {/* facing cone */}
        <line
          x1={px}
          y1={py}
          x2={px - Math.sin(playerState.yaw) * 11}
          y2={py - Math.cos(playerState.yaw) * 11}
          stroke="#ffd9a8"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle cx={px} cy={py} r={4.2} fill="#ffd9a8" stroke="#0b0b0e" strokeWidth={1.4} />
      </svg>
    </div>
  )
}
