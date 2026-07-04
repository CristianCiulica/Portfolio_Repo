import { useMemo } from 'react'
import { Text, Stars } from '@react-three/drei'
import { FONTS } from '../config/content'
import { getMaterials, ACCENT } from './materials'
import { LightShaft } from './fx/LightShaft'

/**
 * The night approach: plaza, colonnade, facade signage, moonlit sky.
 */
export function Exterior() {
  const materials = useMemo(() => getMaterials(), [])

  return (
    <group>
      <Stars radius={120} depth={40} count={2400} factor={3} saturation={0} fade speed={0.4} />

      {/* Plaza */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 27]} receiveShadow>
        <planeGeometry args={[60, 26]} />
        <primitive object={materials.concrete} attach="material" />
      </mesh>
      {/* Approach path */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 25]} receiveShadow>
        <planeGeometry args={[4, 22]} />
        <primitive object={materials.darkFloor} attach="material" />
      </mesh>

      {/* Facade signage */}
      <Text
        font={FONTS.serif300}
        fontSize={0.62}
        color="#ece6da"
        anchorX="center"
        position={[0, 4.35, 16.2]}
        letterSpacing={0.22}
      >
        CRISTIAN CIULICĂ
      </Text>
      <Text
        font={FONTS.sans400}
        fontSize={0.16}
        color={ACCENT}
        anchorX="center"
        position={[0, 3.75, 16.2]}
        letterSpacing={0.6}
      >
        A MUSEUM OF WORK
      </Text>

      {/* Warm light spilling from the entrance */}
      <pointLight position={[0, 2.4, 17]} intensity={7} distance={10} color="#ffd9a8" />
      <LightShaft position={[0, 1.6, 16.6]} height={3.2} topRadius={1.1} bottomRadius={1.8} color="#ffd9a8" opacity={0.05} />

      {/* Facade uplights */}
      <pointLight position={[-5, 0.4, 17.2]} intensity={4} distance={8} color="#b9c8e6" />
      <pointLight position={[5, 0.4, 17.2]} intensity={4} distance={8} color="#b9c8e6" />

      {/* Colonnade flanking the approach */}
      {[-1, 1].map((side) =>
        [22, 26, 30].map((z) => (
          <group key={`${side}-${z}`} position={[side * 7, 0, z]}>
            <mesh material={materials.concrete} castShadow position={[0, 1.9, 0]}>
              <boxGeometry args={[0.6, 3.8, 0.6]} />
            </mesh>
            <pointLight position={[side * -0.8, 0.25, 0]} intensity={2.2} distance={5} color="#ffd9a8" />
          </group>
        )),
      )}
    </group>
  )
}
