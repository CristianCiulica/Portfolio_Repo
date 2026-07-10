import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Label as Text } from './Label'
import { FONTS } from '../../config/content'
import { getMaterials, ACCENT } from '../materials'
import { registerInteractable } from '../../systems/interactions'
import { addCollider, removeCollider } from '../../systems/physics/colliders'
import { useMuseum } from '../../state/store'
import { playActivate } from '../../systems/audio/engine'

/**
 * A museum pedestal with a slowly rotating exhibit floating in a glass case.
 */
export function Pedestal({
  position,
  label,
  prompt,
  onInteract,
  exhibit = 'icosahedron',
  accent = ACCENT,
  rotationY = 0,
}: {
  position: [number, number, number]
  label: string
  prompt: string
  onInteract: () => void
  exhibit?: 'icosahedron' | 'torusKnot' | 'octahedron' | 'cv' | 'book'
  accent?: string
  rotationY?: number
}) {
  const materials = useMemo(() => getMaterials(), [])
  const item = useRef<THREE.Group>(null!)
  const proximity = useRef(0)
  const light = useRef<THREE.PointLight>(null!)

  useEffect(() => {
    const [x, , z] = position
    const cid = addCollider(x - 0.42, x + 0.42, z - 0.42, z + 0.42)
    const unregister = registerInteractable({
      id: `pedestal-${label}`,
      x,
      y: 1.2,
      z,
      radius: 2.6,
      prompt,
      onInteract: () => {
        const s = useMuseum.getState()
        if (!s.settings.muted) playActivate()
        onInteract()
      },
      onProximity: (t) => {
        proximity.current = t
      },
    })
    return () => {
      removeCollider(cid)
      unregister()
    }
  }, [label, prompt])

  useFrame(({ clock }, dt) => {
    if (item.current) {
      item.current.rotation.y += dt * (0.3 + proximity.current * 0.7)
      item.current.rotation.x = Math.sin(clock.elapsedTime * 0.4) * 0.15
      item.current.position.y = 1.42 + Math.sin(clock.elapsedTime * 0.8) * 0.035
    }
    if (light.current) light.current.intensity = 0.9 + proximity.current * 1.6
  })

  return (
    <group position={position} rotation-y={rotationY}>
      {/* Plinth */}
      <mesh material={materials.whiteStone} position={[0, 0.545, 0]}>
        <boxGeometry args={[0.7, 1.1, 0.7]} />
      </mesh>
      {/* Under-glow ring (slightly wider than plinth, floating 1mm above floor to prevent z-fighting) */}
      <mesh position={[0, 0.021, 0]}>
        <boxGeometry args={[0.74, 0.04, 0.74]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffddaa" emissiveIntensity={3} />
      </mesh>
      <mesh material={materials.brass} position={[0, 1.11, 0]}>
        <boxGeometry args={[0.74, 0.03, 0.74]} />
      </mesh>
      {/* Glass case */}
      <mesh position={[0, 1.45, 0]}>
        <boxGeometry args={[0.62, 0.66, 0.62]} />
        <meshPhysicalMaterial
          color="#cfe0ee"
          transparent
          opacity={0.12}
          roughness={0.05}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Floating exhibit */}
      <group ref={item} position={[0, 1.42, 0]}>
        {exhibit === 'cv' ? (
          <group>
            {/* The paper */}
            <mesh castShadow>
              <boxGeometry args={[0.21, 0.297, 0.002]} />
              <meshStandardMaterial color="#ffffff" roughness={0.9} />
            </mesh>
            {/* Fake CV lines */}
            <mesh position={[0, 0.08, 0.0015]}>
              <planeGeometry args={[0.15, 0.012]} />
              <meshBasicMaterial color="#333333" />
            </mesh>
            <mesh position={[-0.02, 0.04, 0.0015]}>
              <planeGeometry args={[0.11, 0.006]} />
              <meshBasicMaterial color="#666666" />
            </mesh>
            <mesh position={[0, 0, 0.0015]}>
              <planeGeometry args={[0.15, 0.006]} />
              <meshBasicMaterial color="#999999" />
            </mesh>
            <mesh position={[0, -0.03, 0.0015]}>
              <planeGeometry args={[0.15, 0.006]} />
              <meshBasicMaterial color="#999999" />
            </mesh>
            <mesh position={[0, -0.06, 0.0015]}>
              <planeGeometry args={[0.15, 0.006]} />
              <meshBasicMaterial color="#999999" />
            </mesh>
          </group>
        ) : exhibit === 'book' ? (
          <group position={[0, -0.05, 0]} rotation-x={0.1} rotation-z={0.05}>
            {/* Left page */}
            <group rotation-y={0.6}>
              <mesh position={[-0.075, 0, 0]} castShadow>
                <boxGeometry args={[0.15, 0.22, 0.015]} />
                <meshStandardMaterial color="#f0e6d2" roughness={0.9} />
              </mesh>
              {/* Left cover */}
              <mesh position={[-0.075, 0, -0.008]} castShadow>
                <boxGeometry args={[0.152, 0.23, 0.002]} />
                <meshStandardMaterial color="#24452e" roughness={0.8} />
              </mesh>
            </group>
            {/* Right page */}
            <group rotation-y={-0.6}>
              <mesh position={[0.075, 0, 0]} castShadow>
                <boxGeometry args={[0.15, 0.22, 0.015]} />
                <meshStandardMaterial color="#f0e6d2" roughness={0.9} />
              </mesh>
              {/* Right cover */}
              <mesh position={[0.075, 0, -0.008]} castShadow>
                <boxGeometry args={[0.152, 0.23, 0.002]} />
                <meshStandardMaterial color="#24452e" roughness={0.8} />
              </mesh>
            </group>
            {/* Cover binding */}
            <mesh position={[0, 0, -0.01]} castShadow>
              <boxGeometry args={[0.03, 0.23, 0.015]} />
              <meshStandardMaterial color="#24452e" roughness={0.7} />
            </mesh>
          </group>
        ) : (
          <mesh castShadow>
            {exhibit === 'torusKnot' ? (
              <torusKnotGeometry args={[0.13, 0.045, 96, 16]} />
            ) : exhibit === 'octahedron' ? (
              <octahedronGeometry args={[0.19, 0]} />
            ) : (
              <icosahedronGeometry args={[0.19, 0]} />
            )}
            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={0.28}
              roughness={0.25}
              metalness={0.7}
            />
          </mesh>
        )}
      </group>
      <pointLight ref={light} position={[0, 1.5, 0]} intensity={0.9} distance={3.5} color={accent} />
      <Text
        font={FONTS.sans400}
        fontSize={0.075}
        color="#cfc8ba"
        anchorX="center"
        position={[0, 0.86, 0.37]}
        letterSpacing={0.14}
      >
        {label.toUpperCase()}
      </Text>
    </group>
  )
}
