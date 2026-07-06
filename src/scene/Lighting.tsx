import { WARM_LIGHT, COOL_FILL } from './materials'

/**
 * Global light rig. Installations bring their own accent spotlights;
 * this provides the ambient base, the moonlit exterior and per-room fills.
 */
export function Lighting() {
  return (
    <group>
      {/* Base — bright, airy gallery light. Carries most of the fill so we
          can run fewer dynamic point lights (each one is evaluated per
          fragment on a forward renderer). */}
      <ambientLight intensity={0.46} color="#e9edf4" />
      <hemisphereLight intensity={0.7} color="#dfe6f0" groundColor="#5c554a" />

      {/* Moonlight over the exterior approach */}
      <directionalLight
        position={[14, 20, 34]}
        intensity={0.85}
        color="#b9c8e6"
        castShadow
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
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      >
        {/* target as child of the light → points straight down */}
        <object3D attach="target" position={[0, -1, 0]} />
      </spotLight>

      {/* Warm per-room ceiling fills — trimmed to one strong light per zone.
          The lobby/about/contact also get warmth from the interactive floor
          lamps, so a single wide fill each is plenty. */}
      <pointLight position={[0, 4.4, 9]} intensity={13} distance={15} color={WARM_LIGHT} />
      <pointLight position={[-10, 4.4, 8]} intensity={11} distance={12} color={WARM_LIGHT} />
      <pointLight position={[10, 4.4, 8]} intensity={11} distance={12} color={WARM_LIGHT} />
      <pointLight position={[-7, 4.6, -2]} intensity={15} distance={17} color={WARM_LIGHT} />
      <pointLight position={[7, 4.6, -2]} intensity={15} distance={17} color={WARM_LIGHT} />
      <pointLight position={[0, 4.4, -12]} intensity={14} distance={17} color={WARM_LIGHT} />
      <pointLight position={[6, 4.2, -19]} intensity={6} distance={9} color={WARM_LIGHT} />
      {/* Cool fill so shadows never go pure black */}
      <pointLight position={[0, 3.5, -2]} intensity={4} distance={28} color={COOL_FILL} />
    </group>
  )
}
