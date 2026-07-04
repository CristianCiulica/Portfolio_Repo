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
}: {
  position: [number, number, number]
  label: string
  prompt: string
  onInteract: () => void
  exhibit?: 'icosahedron' | 'torusKnot' | 'octahedron'
  accent?: string
}) {
  const materials = useMemo(() => getMaterials(), [])
  const item = useRef<THREE.Mesh>(null!)
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
    <group position={position}>
      {/* Plinth */}
      <mesh material={materials.blackMetal} castShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[0.7, 1.1, 0.7]} />
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
      <mesh ref={item} position={[0, 1.42, 0]}>
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
