import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { Label as Text } from './installations/Label'
import { FONTS } from '../config/content'
import { getMaterials, ACCENT } from './materials'
import { LightShaft } from './fx/LightShaft'

/** A slowly turning sculpture on the plaza, flanking the entrance. */
function PlazaSculpture({ position, sign }: { position: [number, number, number]; sign: number }) {
  const mesh = useRef<THREE.Mesh>(null!)
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c9ccd2',
        metalness: 0.9,
        roughness: 0.28,
      }),
    [],
  )
  useFrame((_, dt) => {
    if (mesh.current) mesh.current.rotation.y += dt * 0.15 * sign
  })
  return (
    <group position={position}>
      {/* Plinth */}
      <mesh castShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[1.1, 0.7, 1.1]} />
        <meshStandardMaterial color="#e7e5df" roughness={0.85} />
      </mesh>
      <mesh ref={mesh} material={mat} castShadow position={[0, 1.85, 0]}>
        <torusKnotGeometry args={[0.5, 0.16, 128, 24]} />
      </mesh>
      <pointLight position={[0, 1.9, 0]} intensity={2.6} distance={5} color="#cfe0ff" />
    </group>
  )
}

/** A planter box with a soft glowing hedge — quiet warmth along the walk. */
function Planter({ position }: { position: [number, number, number] }) {
  const materials = useMemo(() => getMaterials(), [])
  return (
    <group position={position}>
      <mesh material={materials.concrete} castShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[1.4, 0.6, 1.4]} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[1.24, 0.34, 1.24]} />
        <meshStandardMaterial color="#3c5c46" roughness={0.9} />
      </mesh>
    </group>
  )
}

/**
 * The night approach: reflecting plaza, colonnade with path lights,
 * flanking sculptures and planters, moonlit sky. No name on the building.
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
      {/* Dark polished approach path */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 25]} receiveShadow>
        <planeGeometry args={[4, 22]} />
        <primitive object={materials.darkFloor} attach="material" />
      </mesh>
      {/* Reflecting water strips either side of the path */}
      {[-3.4, 3.4].map((x) => (
        <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0.004, 26]}>
          <planeGeometry args={[1.6, 20]} />
          <meshStandardMaterial color="#0d1826" roughness={0.08} metalness={0.6} />
        </mesh>
      ))}

      {/* Building signage — no personal name on the facade */}
      <Text
        font={FONTS.serif300}
        fontSize={0.6}
        color="#ece6da"
        anchorX="center"
        position={[0, 4.35, 16.2]}
        letterSpacing={0.3}
      >
        THE GALLERY
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

      {/* Sculptures flanking the entrance */}
      <PlazaSculpture position={[-6.5, 0, 19]} sign={1} />
      <PlazaSculpture position={[6.5, 0, 19]} sign={-1} />

      {/* Glowing path-light strips guiding the walk in */}
      {[20, 24, 28, 32].map((z) =>
        [-2.4, 2.4].map((x) => (
          <group key={`${x}-${z}`} position={[x, 0, z]}>
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[0.12, 0.1, 0.6]} />
              <meshStandardMaterial color="#fff2d8" emissive="#ffd9a8" emissiveIntensity={2.2} toneMapped={false} />
            </mesh>
            <pointLight position={[0, 0.25, 0]} intensity={1.1} distance={3} color="#ffd9a8" />
          </group>
        )),
      )}

      {/* Planters between the colonnade */}
      <Planter position={[-9, 0, 24]} />
      <Planter position={[9, 0, 24]} />
      <Planter position={[-9, 0, 30]} />
      <Planter position={[9, 0, 30]} />

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
