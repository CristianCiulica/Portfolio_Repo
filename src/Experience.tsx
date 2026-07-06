import { Suspense, useEffect, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { PerformanceMonitor, AdaptiveDpr } from '@react-three/drei'
import { Museum } from './scene/Museum'
import { Effects } from './scene/Effects'
import { PlayerController } from './systems/player/PlayerController'
import { CinematicRig } from './systems/CinematicRig'
import { isTouchDevice } from './state/store'

/** Dev-only: exposes the R3F state so tooling can step frames in hidden tabs. */
function DevBridge() {
  const state = useThree()
  useEffect(() => {
    if (import.meta.env.DEV) {
      import('./systems/player/playerState').then((m) => {
        ;(window as any).__museum = { three: state, player: m.playerState }
      })
    }
  }, [state])
  return null
}

export function Experience() {
  // Retina panels report devicePixelRatio 2 → rendering at 2 quadruples the
  // pixel count and pins the GPU. Cap at 1.5, and let AdaptiveDpr drop further
  // only if needed.
  const maxDpr = isTouchDevice ? 1.25 : 1.5
  const [dpr, setDpr] = useState<number>(Math.min(maxDpr, window.devicePixelRatio))

  return (
    <Canvas
      shadows
      dpr={dpr}
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false, depth: true, toneMappingExposure: 1.25 }}
      camera={{ fov: 70, near: 0.1, far: 160, position: [4.2, 2.7, 32.5] }}
      style={{ position: 'fixed', inset: 0, background: '#07080c' }}
    >
      <color attach="background" args={['#07080c']} />
      <fog attach="fog" args={['#15171d', 24, 105]} />
      <PerformanceMonitor
        onDecline={() => {
          setDpr((d) => Math.max(1, d - 0.25))
        }}
        onIncline={() => setDpr(Math.min(maxDpr, window.devicePixelRatio))}
      >
        <Suspense fallback={null}>
          <Museum />
          <Effects />
        </Suspense>
        <PlayerController />
        <CinematicRig />
        <AdaptiveDpr pixelated />
        {import.meta.env.DEV && <DevBridge />}
      </PerformanceMonitor>
    </Canvas>
  )
}
