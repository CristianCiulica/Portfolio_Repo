import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Label as Text } from './Label'
import type { Project } from '../../config/content'
import { FONTS } from '../../config/content'
import { coverTexture } from '../covers'
import { getMaterials } from '../materials'
import { registerInteractable } from '../../systems/interactions'
import { useMuseum } from '../../state/store'
import { playActivate } from '../../systems/audio/engine'

const SCREEN_W = 3.3
const SCREEN_H = 2.06
const FRAME_PAD = 0.16

const scratch = new THREE.Vector3()

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
  const texture = useMemo(() => {
    if (!project.image) return coverTexture(project)
    const t = new THREE.TextureLoader().load(project.image)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    return t
  }, [project])
  const screenMat = useRef<THREE.MeshStandardMaterial>(null!)
  const spot = useRef<THREE.SpotLight>(null!)
  const glowMat = useRef<THREE.MeshBasicMaterial>(null!)
  const tilt = useRef<THREE.Group>(null!)
  const activation = useRef(0)
  const proximity = useRef(0)
  const wasOn = useRef(false)

  // World position for the interaction system
  const world = useMemo(() => new THREE.Vector3(...position), [position])

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
    const poweringUp = target > activation.current + 0.01
    if (target === 1 && !wasOn.current) wasOn.current = true
    const rate = poweringUp ? 3.4 : 2.2
    activation.current += (target - activation.current) * Math.min(1, rate * dt)
    const a = activation.current
    // A short CRT-style flutter only while powering up — steady otherwise
    const flicker =
      poweringUp && a > 0.2 && a < 0.9
        ? 0.82 + 0.18 * Math.sin(state.clock.elapsedTime * 47) * Math.sin(state.clock.elapsedTime * 31)
        : 1
    if (screenMat.current) screenMat.current.emissiveIntensity = a * 1.05 * flicker
    if (spot.current) spot.current.intensity = 4 + a * 26
    if (glowMat.current) glowMat.current.opacity = a * 0.09

    // Subtle "notice the visitor" tilt toward the camera
    if (tilt.current && tilt.current.parent) {
      const local = tilt.current.parent.worldToLocal(scratch.copy(state.camera.position))
      const want =
        proximity.current > 0.05
          ? THREE.MathUtils.clamp(Math.atan2(local.x, local.z) * 0.06, -0.05, 0.05)
          : 0
      tilt.current.rotation.y += (want - tilt.current.rotation.y) * Math.min(1, 3 * dt)
    }
  })

  return (
    <group position={position} rotation-y={rotationY}>
      <group ref={tilt}>
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
        {/* Soft halo behind the frame — kept clear of the wall so nothing z-fights */}
        <mesh position={[0, 0, -0.11]} renderOrder={2}>
          <planeGeometry args={[SCREEN_W + 1.4, SCREEN_H + 1.2]} />
          <meshBasicMaterial
            ref={glowMat}
            color={project.accent}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            depthTest={true}
          />
        </mesh>

        {/* Brass plaque with the title & tech engraving */}
        <mesh position={[0, -SCREEN_H / 2 - 0.46, 0]} material={materials.brass}>
          <boxGeometry args={[SCREEN_W * 0.78, 0.56, 0.03]} />
        </mesh>
        <Text
          font={FONTS.serif500}
          fontSize={0.17}
          color="#f2ecdf"
          anchorX="center"
          anchorY="middle"
          position={[0, -SCREEN_H / 2 - 0.37, 0.045]}
          maxWidth={SCREEN_W * 0.72}
          textAlign="center"
        >
          {project.title}
        </Text>
        <Text
          font={FONTS.sans400}
          fontSize={0.072}
          color="#3d2f1c"
          anchorX="center"
          anchorY="middle"
          position={[0, -SCREEN_H / 2 - 0.58, 0.045]}
          letterSpacing={0.14}
          maxWidth={SCREEN_W * 0.74}
          textAlign="center"
        >
          {project.tech.slice(0, 4).join('  ·  ').toUpperCase()}
        </Text>
      </group>

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
