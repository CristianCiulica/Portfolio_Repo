import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useMuseum } from '../state/store'
import { playerState, EYE_HEIGHT } from './player/playerState'
import { SPAWN } from '../scene/layout'

const TITLE_POS = new THREE.Vector3(4.2, 2.7, 32.5)
const TITLE_LOOK = new THREE.Vector3(0, 3.2, 16)

/**
 * Owns the camera during the title screen (slow drift on the plaza) and the
 * fly-in cinematic, then hands off to the first-person controller with an
 * exactly matching pose.
 */
export function CinematicRig() {
  const camera = useThree((s) => s.camera)
  const phase = useMuseum((s) => s.phase)
  const reducedMotion = useMuseum((s) => s.settings.reducedMotion)
  const flight = useRef({ t: 0 })
  const timeline = useRef<gsap.core.Timeline | null>(null)

  // Title screen: gentle drift so the plaza feels alive behind the typography
  useFrame(({ clock }) => {
    if (phase === 'title') {
      const t = clock.elapsedTime
      camera.position.set(
        TITLE_POS.x + Math.sin(t * 0.11) * 1.6,
        TITLE_POS.y + Math.sin(t * 0.07) * 0.4,
        TITLE_POS.z + Math.cos(t * 0.09) * 1.2,
      )
      camera.lookAt(TITLE_LOOK)
    }
  })

  useEffect(() => {
    if (phase !== 'cinematic') return
    const store = useMuseum.getState()

    const finish = () => {
      playerState.x = SPAWN.x
      playerState.y = 0
      playerState.z = SPAWN.z
      playerState.yaw = SPAWN.yaw
      playerState.pitch = 0
      playerState.vx = playerState.vy = playerState.vz = 0
      useMuseum.getState().setPhase('play')
    }

    if (reducedMotion) {
      finish()
      return
    }

    // Waypoints: plaza → down the path → through the doors → lobby spawn
    const path = new THREE.CatmullRomCurve3([
      camera.position.clone(),
      new THREE.Vector3(2.5, 2.2, 27),
      new THREE.Vector3(0, EYE_HEIGHT + 0.15, 21),
      new THREE.Vector3(0, EYE_HEIGHT, 17.2),
      new THREE.Vector3(SPAWN.x, EYE_HEIGHT, SPAWN.z),
    ])
    const look = new THREE.Vector3()
    const state = flight.current
    state.t = 0

    timeline.current = gsap.timeline({ onComplete: finish })
    timeline.current.to(state, {
      t: 1,
      duration: 7,
      ease: 'power2.inOut',
      onUpdate: () => {
        const p = path.getPoint(state.t)
        camera.position.copy(p)
        // Look ahead along the path, easing toward straight-ahead at the end
        const ahead = path.getPoint(Math.min(1, state.t + 0.06))
        look.copy(ahead)
        const straight = new THREE.Vector3(p.x, EYE_HEIGHT, p.z - 4)
        look.lerp(straight, state.t * state.t)
        camera.lookAt(look)
      },
    })

    const skip = () => timeline.current?.progress(1)
    window.addEventListener('museum:skip-intro', skip)
    return () => {
      window.removeEventListener('museum:skip-intro', skip)
      timeline.current?.kill()
    }
  }, [phase, reducedMotion, camera])

  return null
}
