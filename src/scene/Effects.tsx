import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useMuseum } from '../state/store'

export function Effects() {
  const quality = useMuseum((s) => s.settings.quality)
  const high = quality === 'high'

  return (
    <EffectComposer multisampling={high ? 4 : 0}>
      <Bloom
        intensity={high ? 0.55 : 0.4}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.25}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.22} darkness={0.78} />
    </EffectComposer>
  )
}
