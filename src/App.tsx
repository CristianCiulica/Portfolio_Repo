import { Suspense, lazy, useEffect, useState } from 'react'
import { useMuseum } from './state/store'
import { IntroOverlay } from './ui/IntroOverlay'
import { Hud } from './ui/Hud'
import { Modals } from './ui/Modals'
import { PauseMenu } from './ui/PauseMenu'
import { TouchControls } from './ui/TouchControls'
import { Gallery2D } from './ui/Gallery2D'

// The 3D bundle (three + r3f) loads lazily so the title typography is instant
const Experience = lazy(() => import('./Experience').then((m) => ({ default: m.Experience })))

function BootScreen() {
  return (
    <div className="boot" role="status" aria-label="Loading museum">
      <div className="boot__bar" />
      <p className="boot__label">Preparing the museum</p>
    </div>
  )
}

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export default function App() {
  const phase = useMuseum((s) => s.phase)
  const setPhase = useMuseum((s) => s.setPhase)
  const [canRender3D] = useState(webglAvailable)

  // Boot → title once mounted; users without WebGL go straight to 2D
  useEffect(() => {
    if (phase === 'boot') {
      setPhase(canRender3D ? 'title' : 'gallery2d')
    }
  }, [phase, canRender3D, setPhase])

  const show3D = canRender3D && phase !== 'gallery2d' && phase !== 'boot'

  return (
    <>
      {show3D && (
        <Suspense fallback={<BootScreen />}>
          <Experience />
        </Suspense>
      )}
      {phase === 'boot' && <BootScreen />}
      <IntroOverlay />
      <Hud />
      <TouchControls />
      <PauseMenu />
      <Modals />
      <Gallery2D />
    </>
  )
}
