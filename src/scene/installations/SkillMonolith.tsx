import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import type { SkillGroup } from '../../config/content'
import { FONTS } from '../../config/content'
import { getMaterials, ACCENT } from '../materials'
import { registerInteractable } from '../../systems/interactions'
import { addCollider, removeCollider } from '../../systems/physics/colliders'
import { useMuseum } from '../../state/store'
import { playActivate } from '../../systems/audio/engine'

/**
 * A black monolith per skill family. A warm light column inside it rises
 * to the group's average proficiency as the visitor approaches.
 */
export function SkillMonolith({
  group,
  position,
}: {
  group: SkillGroup
  position: [number, number, number]
}) {
  const materials = useMemo(() => getMaterials(), [])
  const glow = useRef<THREE.Mesh>(null!)
  const glowMat = useRef<THREE.MeshBasicMaterial>(null!)
  const proximity = useRef(0)
  const fill = useRef(0)

  const avg = useMemo(
    () => group.skills.reduce((acc, s) => acc + s.level, 0) / group.skills.length,
    [group],
  )
  const H = 3.1
  const maxFill = 0.25 + avg * 0.75

  useEffect(() => {
    const [x, , z] = position
    const cid = addCollider(x - 0.55, x + 0.55, z - 0.35, z + 0.35)
    const unregister = registerInteractable({
      id: `skills-${group.id}`,
      x,
      y: 1.5,
      z,
      radius: 2.8,
      prompt: `Inspect ${group.label}`,
      onInteract: () => {
        const s = useMuseum.getState()
        if (!s.settings.muted) playActivate()
        s.setModal({ type: 'skills', id: group.id })
      },
      onProximity: (t) => {
        proximity.current = t
      },
    })
    return () => {
      removeCollider(cid)
      unregister()
    }
  }, [group.id])

  useFrame(({ clock }, dt) => {
    const target = proximity.current > 0.15 ? maxFill : 0.08
    fill.current += (target - fill.current) * Math.min(1, 1.6 * dt)
    const h = fill.current * (H - 0.3)
    if (glow.current) {
      glow.current.scale.y = h
      glow.current.position.y = 0.15 + h / 2
    }
    if (glowMat.current) {
      const pulse = 0.85 + 0.15 * Math.sin(clock.elapsedTime * 1.4)
      glowMat.current.opacity = (0.4 + proximity.current * 0.6) * pulse
    }
  })

  return (
    <group position={position}>
      {/* Monolith body */}
      <mesh material={materials.blackMetal} castShadow receiveShadow position={[0, H / 2, 0]}>
        <boxGeometry args={[1.0, H, 0.6]} />
      </mesh>
      {/* Light column recessed in the front face */}
      <mesh ref={glow} position={[0, 0.15, 0.301]} scale={[1, 0.01, 1]}>
        <planeGeometry args={[0.14, 1]} />
        <meshBasicMaterial
          ref={glowMat}
          color={ACCENT}
          transparent
          opacity={0.4}
          toneMapped={false}
        />
      </mesh>
      {/* Engraved label */}
      <Text
        font={FONTS.serif300}
        fontSize={0.22}
        color="#e8e2d6"
        anchorX="center"
        position={[0, H + 0.35, 0]}
        rotation-y={0}
      >
        {group.label}
      </Text>
      <Text
        font={FONTS.sans400}
        fontSize={0.085}
        color="#a89f8e"
        anchorX="left"
        anchorY="top"
        position={[0.62, H - 0.55, 0.05]}
        lineHeight={1.7}
        maxWidth={1.4}
      >
        {group.skills.map((s) => s.name).join('\n')}
      </Text>
      <pointLight position={[0, 1.6, 0.8]} intensity={1.6} distance={4} color={ACCENT} />
    </group>
  )
}
