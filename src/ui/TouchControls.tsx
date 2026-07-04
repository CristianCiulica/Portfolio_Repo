import { useRef, useState } from 'react'
import { useMuseum, isTouchDevice } from '../state/store'
import { touchInput } from '../systems/player/playerState'
import { getInteractable } from '../systems/interactions'

/**
 * Mobile: virtual joystick (left) + look pad (right) + jump/sprint/tap.
 */
export function TouchControls() {
  const phase = useMuseum((s) => s.phase)
  const paused = useMuseum((s) => s.paused)
  const modal = useMuseum((s) => s.modal)
  const focused = useMuseum((s) => s.focused)
  const [nub, setNub] = useState({ x: 0, y: 0 })
  const [sprintOn, setSprintOn] = useState(false)
  const joyOrigin = useRef<{ x: number; y: number; pointerId: number } | null>(null)
  const lookLast = useRef<{ x: number; y: number; pointerId: number } | null>(null)

  if (!isTouchDevice || phase !== 'play' || paused || modal) return null

  const JOY_RADIUS = 52

  const onJoyDown = (e: React.PointerEvent) => {
    joyOrigin.current = { x: e.clientX, y: e.clientY, pointerId: e.pointerId }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onJoyMove = (e: React.PointerEvent) => {
    const o = joyOrigin.current
    if (!o || o.pointerId !== e.pointerId) return
    let dx = e.clientX - o.x
    let dy = e.clientY - o.y
    const len = Math.hypot(dx, dy)
    if (len > JOY_RADIUS) {
      dx = (dx / len) * JOY_RADIUS
      dy = (dy / len) * JOY_RADIUS
    }
    setNub({ x: dx, y: dy })
    touchInput.moveX = dx / JOY_RADIUS
    touchInput.moveY = -dy / JOY_RADIUS
  }
  const onJoyUp = () => {
    joyOrigin.current = null
    setNub({ x: 0, y: 0 })
    touchInput.moveX = 0
    touchInput.moveY = 0
  }

  const onLookDown = (e: React.PointerEvent) => {
    lookLast.current = { x: e.clientX, y: e.clientY, pointerId: e.pointerId }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onLookMove = (e: React.PointerEvent) => {
    const l = lookLast.current
    if (!l || l.pointerId !== e.pointerId) return
    touchInput.lookDX += e.clientX - l.x
    touchInput.lookDY += e.clientY - l.y
    l.x = e.clientX
    l.y = e.clientY
  }
  const onLookUp = () => {
    lookLast.current = null
  }

  return (
    <div className="touch">
      <div className="lookpad" onPointerDown={onLookDown} onPointerMove={onLookMove} onPointerUp={onLookUp} onPointerCancel={onLookUp} />
      <div
        className="joystick"
        onPointerDown={onJoyDown}
        onPointerMove={onJoyMove}
        onPointerUp={onJoyUp}
        onPointerCancel={onJoyUp}
      >
        <div
          className="joystick__nub"
          style={{ transform: `translate(calc(-50% + ${nub.x}px), calc(-50% + ${nub.y}px))` }}
        />
      </div>
      <div className="touch__buttons">
        {focused && (
          <button
            className="touch__btn touch__btn--active"
            onClick={() => getInteractable(focused.id)?.onInteract()}
          >
            TAP
          </button>
        )}
        <button
          className={`touch__btn ${sprintOn ? 'touch__btn--active' : ''}`}
          onClick={() => {
            setSprintOn((v) => {
              touchInput.sprint = !v
              return !v
            })
          }}
        >
          RUN
        </button>
        <button
          className="touch__btn"
          onPointerDown={() => {
            touchInput.jump = true
          }}
        >
          JUMP
        </button>
      </div>
    </div>
  )
}
