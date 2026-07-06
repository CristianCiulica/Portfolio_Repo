import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export function Effects() {
  return (
    <EffectComposer multisampling={2}>
      <Bloom
        intensity={0.42}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.25}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.16} darkness={0.55} />
    </EffectComposer>
  )
}
