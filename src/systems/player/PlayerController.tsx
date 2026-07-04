import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useMuseum, isTouchDevice } from '../../state/store'
import { keys, useKeyboard, moveForward, moveBack, moveLeft, moveRight, sprinting, jumping } from '../input/useKeyboard'
import { playerState, touchInput, EYE_HEIGHT, PLAYER_RADIUS } from './playerState'
import { resolveCircle } from '../physics/colliders'
import { findFocused } from '../interactions'
import { roomAt } from '../../scene/layout'
import { playFootstep, initAudio } from '../audio/engine'

const ACCEL = 40
const FRICTION = 10
const WALK_SPEED = 3.4
const SPRINT_MULT = 1.8
const JUMP_VELOCITY = 4.4
const GRAVITY = 12
const LOOK_SMOOTHING = 18
const PITCH_LIMIT = Math.PI / 2 - 0.09

/** Pointer lock needs a user gesture; outside one it rejects — ignore that. */
function safeRequestLock(canvas: HTMLCanvasElement) {
  try {
    const p = canvas.requestPointerLock() as unknown as Promise<void> | undefined
    p?.catch?.(() => {})
  } catch {
    /* not available — HUD will invite a click */
  }
}

/** Rooms where footsteps echo more. */
const REVERBY: Record<string, number> = { hall: 0.55, lobby: 0.45, secret: 0.6 }

export function PlayerController() {
  useKeyboard()
  const camera = useThree((s) => s.camera)
  const gl = useThree((s) => s.gl)

  const phase = useMuseum((s) => s.phase)
  const paused = useMuseum((s) => s.paused)
  const modal = useMuseum((s) => s.modal)

  const target = useRef({ yaw: playerState.yaw, pitch: playerState.pitch })
  const bobPhase = useRef(0)
  const bobAmp = useRef(0)
  const lastStepSign = useRef(1)
  const landedDip = useRef(0)
  const focusedId = useRef<string | null>(null)
  const roomRef = useRef('')

  const active = phase === 'play' && !paused && !modal

  // ── Pointer lock & mouse look (desktop) ──────────────────────────
  useEffect(() => {
    if (isTouchDevice) return
    const canvas = gl.domElement

    const requestLock = () => {
      const s = useMuseum.getState()
      if (s.phase === 'play' && !s.paused && !s.modal && document.pointerLockElement !== canvas) {
        safeRequestLock(canvas)
      }
    }
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return
      const sens = useMuseum.getState().settings.sensitivity * 0.0021
      target.current.yaw -= e.movementX * sens
      target.current.pitch -= e.movementY * sens
      target.current.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, target.current.pitch))
    }
    const onLockChange = () => {
      const s = useMuseum.getState()
      const locked = document.pointerLockElement === canvas
      s.setPointerLocked(locked)
      if (!locked && s.phase === 'play' && !s.modal && !s.paused) {
        s.setPaused(true)
      }
    }
    const onMouseDown = () => {
      const s = useMuseum.getState()
      initAudio()
      if (document.pointerLockElement === canvas && focusedId.current && !s.modal) {
        const item = findFocusedItem()
        item?.onInteract()
      } else {
        requestLock()
      }
    }
    canvas.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('pointerlockchange', onLockChange)
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('pointerlockchange', onLockChange)
    }
  }, [gl])

  // Re-request pointer lock when returning to play (resume button / modal close)
  useEffect(() => {
    if (isTouchDevice) return
    if (active && document.pointerLockElement !== gl.domElement) {
      // Works when we're inside the user-gesture window of the click that
      // resumed; otherwise fails quietly and the HUD invites a click.
      safeRequestLock(gl.domElement)
    }
    if (!active && (paused || modal) && document.pointerLockElement === gl.domElement) {
      document.exitPointerLock()
    }
  }, [active, paused, modal, gl])

  // Dev-only: lets tooling snap the look direction when teleporting
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const snap = (e: Event) => {
      const d = (e as CustomEvent).detail
      target.current.yaw = d.yaw
      target.current.pitch = d.pitch
    }
    window.addEventListener('museum:snap-look', snap)
    return () => window.removeEventListener('museum:snap-look', snap)
  }, [])

  // ── Interaction key ──────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = useMuseum.getState()
      if (e.code === 'KeyE' && s.phase === 'play' && !s.paused && !s.modal && focusedId.current) {
        findFocusedItem()?.onInteract()
      }
      if (e.code === 'KeyM' && s.phase === 'play' && !s.modal) s.toggleMinimap()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function findFocusedItem() {
    const fwdX = -Math.sin(playerState.yaw)
    const fwdZ = -Math.cos(playerState.yaw)
    return findFocused(playerState.x, playerState.z, fwdX, fwdZ)
  }

  // ── Main loop ────────────────────────────────────────────────────
  useFrame((_, rawDt) => {
    if (phase !== 'play') return
    const dt = Math.min(rawDt, 1 / 20)
    const p = playerState
    const settings = useMuseum.getState().settings

    // Touch look
    if (isTouchDevice && active) {
      const sens = settings.sensitivity * 0.0032
      target.current.yaw -= touchInput.lookDX * sens
      target.current.pitch -= touchInput.lookDY * sens
      target.current.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, target.current.pitch))
    }
    touchInput.lookDX = 0
    touchInput.lookDY = 0

    // Smoothed look
    const lk = 1 - Math.exp(-LOOK_SMOOTHING * dt)
    p.yaw += (target.current.yaw - p.yaw) * lk
    p.pitch += (target.current.pitch - p.pitch) * lk

    // Movement intent
    let ix = 0
    let iz = 0
    let sprint = false
    if (active) {
      iz = moveForward() - moveBack() + touchInput.moveY
      ix = moveRight() - moveLeft() + touchInput.moveX
      const len = Math.hypot(ix, iz)
      if (len > 1) {
        ix /= len
        iz /= len
      }
      sprint = sprinting() || touchInput.sprint
    }

    const maxSpeed = WALK_SPEED * (sprint ? SPRINT_MULT : 1)
    // World-space wish direction from camera yaw
    const sinY = Math.sin(p.yaw)
    const cosY = Math.cos(p.yaw)
    const wishX = (-sinY * iz + cosY * ix)
    const wishZ = (-cosY * iz - sinY * ix)

    p.vx += wishX * ACCEL * dt
    p.vz += wishZ * ACCEL * dt
    // Friction
    const damp = Math.exp(-FRICTION * dt)
    p.vx *= damp
    p.vz *= damp
    // Clamp
    const hSpeed = Math.hypot(p.vx, p.vz)
    if (hSpeed > maxSpeed) {
      p.vx = (p.vx / hSpeed) * maxSpeed
      p.vz = (p.vz / hSpeed) * maxSpeed
    }

    // Jump & gravity
    if (active && p.grounded && (jumping() || touchInput.jump)) {
      p.vy = JUMP_VELOCITY
      p.grounded = false
      touchInput.jump = false
    }
    if (!p.grounded) {
      p.vy -= GRAVITY * dt
    }
    p.y += p.vy * dt
    if (p.y <= 0) {
      if (!p.grounded && p.vy < -3) landedDip.current = Math.min(0.14, -p.vy * 0.025)
      p.y = 0
      p.vy = 0
      p.grounded = true
    }

    // Integrate & collide
    p.x += p.vx * dt
    p.z += p.vz * dt
    resolveCircle(p, PLAYER_RADIUS)
    p.speed = Math.hypot(p.vx, p.vz)

    // Head bob + footsteps
    const store = useMuseum.getState()
    const room = roomAt(p.x, p.z)
    if (room !== roomRef.current) {
      roomRef.current = room
      store.setCurrentRoom(room)
    }

    const speedT = Math.min(1, p.speed / WALK_SPEED)
    bobAmp.current += (speedT * (p.grounded ? 1 : 0) - bobAmp.current) * Math.min(1, 8 * dt)
    if (p.speed > 0.3 && p.grounded) {
      bobPhase.current += dt * (6 + p.speed * 1.6)
      const s = Math.sin(bobPhase.current)
      const sign = Math.sign(s)
      if (sign !== lastStepSign.current && sign !== 0) {
        lastStepSign.current = sign
        if (!settings.muted) {
          playFootstep(sprint ? 1 : 0, REVERBY[room] ?? 0.3)
        }
      }
    }
    landedDip.current *= Math.exp(-6 * dt)

    const bobOn = settings.headBob && !settings.reducedMotion
    const bobY = bobOn ? Math.sin(bobPhase.current) * 0.045 * bobAmp.current : 0
    const bobX = bobOn ? Math.cos(bobPhase.current * 0.5) * 0.025 * bobAmp.current : 0
    const idleSway = bobOn ? Math.sin(performance.now() * 0.0006) * 0.012 : 0

    camera.position.set(
      p.x + cosY * bobX,
      EYE_HEIGHT + p.y + bobY - landedDip.current + idleSway,
      p.z - sinY * bobX,
    )
    camera.rotation.order = 'YXZ'
    camera.rotation.set(p.pitch, p.yaw, bobOn ? Math.sin(bobPhase.current * 0.5) * 0.006 * bobAmp.current : 0)

    // Focused interactable (only refresh store when it changes)
    if (active) {
      const item = findFocusedItem()
      const id = item?.id ?? null
      if (id !== focusedId.current) {
        focusedId.current = id
        store.setFocused(item ? { id: item.id, prompt: item.prompt } : null)
      }
    } else if (focusedId.current) {
      focusedId.current = null
      store.setFocused(null)
    }
  })

  return null
}
