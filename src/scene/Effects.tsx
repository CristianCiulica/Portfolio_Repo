import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export function Effects() {
  return (
    <EffectComposer multisampling={2}>
      <Bloom
        intensity={0.05}
        luminanceThreshold={1.1}
        luminanceSmoothing={0.3}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.2} darkness={0.35} />
    </EffectComposer>
  )
}
