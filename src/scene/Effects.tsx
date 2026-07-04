import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useMuseum } from '../state/store'

export function Effects() {
  const quality = useMuseum((s) => s.settings.quality)
  const high = quality === 'high'

  return (
    <EffectComposer multisampling={high ? 2 : 0}>
      <Bloom
        intensity={high ? 0.45 : 0.35}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.25}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.16} darkness={0.55} />
    </EffectComposer>
  )
}
