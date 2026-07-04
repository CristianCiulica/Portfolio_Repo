import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text, useTexture } from '@react-three/drei'
import type { Project } from '../../config/content'
import { FONTS } from '../../config/content'
import { getMaterials, ACCENT } from '../materials'
import { registerInteractable } from '../../systems/interactions'
import { useMuseum } from '../../state/store'
import { playActivate } from '../../systems/audio/engine'

const SCREEN_W = 3.3
const SCREEN_H = 2.06
const FRAME_PAD = 0.16

/**
 * A wall-mounted digital installation: black metal frame, emissive screen
 * that powers on as the visitor approaches, museum spotlight, brass plaque.
 */
export function ProjectScreen({
  project,
  position,
  rotationY = 0,
}: {
  project: Project
  position: [number, number, number]
  rotationY?: number
}) {
  const materials = useMemo(() => getMaterials(), [])
  const texture = useTexture(project.image)
  const screenMat = useRef<THREE.MeshStandardMaterial>(null!)
  const spot = useRef<THREE.SpotLight>(null!)
  const glowMat = useRef<THREE.MeshBasicMaterial>(null!)
  const activation = useRef(0)
  const proximity = useRef(0)
  const wasOn = useRef(false)

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
  }, [texture])

  // World position for the interaction system
  const world = useMemo(() => {
    const v = new THREE.Vector3(...position)
    return v
  }, [position])

  useEffect(() => {
    return registerInteractable({
      id: `project-${project.id}`,
      x: world.x,
      y: world.y,
      z: world.z,
      radius: 3.4,
      prompt: `View “${project.title}”`,
      onInteract: () => {
        const s = useMuseum.getState()
        if (!s.settings.muted) playActivate()
        s.setModal({ type: 'project', id: project.id })
      },
      onProximity: (t) => {
        proximity.current = t
      },
    })
  }, [project.id, world])

  useFrame((state, dt) => {
    const target = proximity.current > 0.25 ? 1 : 0.12
    if (target === 1 && !wasOn.current) wasOn.current = true
    // Power-on ramps quickly with a touch of flicker; power-down is slower
    const rate = target > activation.current ? 3.2 : 1.2
    activation.current += (target - activation.current) * Math.min(1, rate * dt)
    const a = activation.current
    const flicker =
      a > 0.15 && a < 0.92
        ? 0.75 + 0.25 * Math.sin(state.clock.elapsedTime * 47) * Math.sin(state.clock.elapsedTime * 31)
        : 1
    if (screenMat.current) screenMat.current.emissiveIntensity = a * 1.05 * flicker
    if (spot.current) spot.current.intensity = 4 + a * 26
    if (glowMat.current) glowMat.current.opacity = a * 0.1
  })

  return (
    <group position={position} rotation-y={rotationY}>
      {/* Frame */}
      <mesh material={materials.blackMetal} castShadow position={[0, 0, -0.04]}>
        <boxGeometry args={[SCREEN_W + FRAME_PAD * 2, SCREEN_H + FRAME_PAD * 2, 0.14]} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        <meshStandardMaterial
          ref={screenMat}
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={0.12}
          roughness={0.35}
          metalness={0}
          toneMapped={true}
        />
      </mesh>
      {/* Soft halo behind the frame */}
      <mesh position={[0, 0, -0.13]}>
        <planeGeometry args={[SCREEN_W + 1.4, SCREEN_H + 1.2]} />
        <meshBasicMaterial
          ref={glowMat}
          color={project.accent}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Title & tech engraving */}
      <Text
        font={FONTS.serif500}
        fontSize={0.19}
        color="#e8e2d6"
        anchorX="center"
        anchorY="top"
        position={[0, -SCREEN_H / 2 - 0.3, 0.02]}
        maxWidth={SCREEN_W}
      >
        {project.title}
      </Text>
      <Text
        font={FONTS.sans400}
        fontSize={0.085}
        color={ACCENT}
        anchorX="center"
        anchorY="top"
        position={[0, -SCREEN_H / 2 - 0.58, 0.02]}
        letterSpacing={0.12}
        maxWidth={SCREEN_W}
      >
        {project.tech.slice(0, 4).join('   ·   ').toUpperCase()}
      </Text>

      {/* Brass plaque */}
      <mesh position={[0, -SCREEN_H / 2 - 0.44, 0]} material={materials.brass}>
        <boxGeometry args={[SCREEN_W * 0.72, 0.5, 0.02]} />
      </mesh>

      {/* Museum spotlight (no shadow — budget) */}
      <spotLight
        ref={spot}
        position={[0, 2.6, 1.9]}
        angle={0.7}
        penumbra={0.75}
        intensity={4}
        distance={9}
        color="#ffe3bd"
        decay={1.6}
      >
        <object3D attach="target" position={[0, -2.6, -1.9]} />
      </spotLight>
    </group>
  )
}
