import { useMuseum } from '../state/store'
import { WARM_LIGHT, COOL_FILL } from './materials'

/**
 * Global light rig. Installations bring their own accent spotlights;
 * this provides the ambient base, the moonlit exterior and per-room fills.
 */
export function Lighting() {
  const quality = useMuseum((s) => s.settings.quality)
  const high = quality === 'high'

  return (
    <group>
      {/* Base */}
      <ambientLight intensity={0.09} color="#c8cfdd" />
      <hemisphereLight intensity={0.14} color="#aebad0" groundColor="#26221c" />

      {/* Moonlight over the exterior approach */}
      <directionalLight
        position={[14, 20, 34]}
        intensity={0.85}
        color="#b9c8e6"
        castShadow={high}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-far={70}
        shadow-bias={-0.0004}
      />

      {/* Lobby skylight shaft */}
      <spotLight
        position={[0, 5.1, 10]}
        angle={0.62}
        penumbra={0.9}
        intensity={38}
        distance={14}
        color="#cfd9ec"
        castShadow={high}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      >
        {/* target as child of the light → points straight down */}
        <object3D attach="target" position={[0, -1, 0]} />
      </spotLight>

      {/* Warm per-room ceiling fills (cheap points, no shadows) */}
      <pointLight position={[0, 4.4, 10]} intensity={7} distance={12} color={WARM_LIGHT} />
      <pointLight position={[-10, 4.4, 8]} intensity={6.5} distance={10} color={WARM_LIGHT} />
      <pointLight position={[10, 4.4, 8]} intensity={6.5} distance={10} color={WARM_LIGHT} />
      <pointLight position={[-8, 4.6, -2]} intensity={8} distance={14} color={WARM_LIGHT} />
      <pointLight position={[8, 4.6, -2]} intensity={8} distance={14} color={WARM_LIGHT} />
      <pointLight position={[-10, 4.4, -12]} intensity={7} distance={11} color={WARM_LIGHT} />
      <pointLight position={[0, 4.4, -12]} intensity={7} distance={11} color={WARM_LIGHT} />
      <pointLight position={[10, 4.4, -12]} intensity={7} distance={11} color={WARM_LIGHT} />
      {/* Cool fill so shadows never go pure black */}
      <pointLight position={[0, 3.5, -2]} intensity={2} distance={26} color={COOL_FILL} />
    </group>
  )
}
