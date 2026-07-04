import { Suspense, useEffect, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { PerformanceMonitor, AdaptiveDpr } from '@react-three/drei'
import { Museum } from './scene/Museum'
import { Effects } from './scene/Effects'
import { PlayerController } from './systems/player/PlayerController'
import { CinematicRig } from './systems/CinematicRig'
import { useMuseum, isTouchDevice } from './state/store'

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
  const quality = useMuseum((s) => s.settings.quality)
  const updateSettings = useMuseum((s) => s.updateSettings)
  const [dpr, setDpr] = useState<number>(Math.min(isTouchDevice ? 1.5 : 2, window.devicePixelRatio))

  return (
    <Canvas
      shadows={quality === 'high'}
      dpr={dpr}
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
      camera={{ fov: 70, near: 0.1, far: 160, position: [4.2, 2.7, 32.5] }}
      style={{ position: 'fixed', inset: 0, background: '#07080c' }}
    >
      <color attach="background" args={['#07080c']} />
      <fog attach="fog" args={['#0a0b10', 18, 90]} />
      <PerformanceMonitor
        onDecline={() => {
          setDpr(1)
          updateSettings({ quality: 'low' })
        }}
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
