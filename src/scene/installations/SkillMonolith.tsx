import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Label as Text } from './Label'
import type { SkillGroup } from '../../config/content'
import { FONTS } from '../../config/content'
import { ACCENT, ACCENT_DIM } from '../materials'
import { registerInteractable } from '../../systems/interactions'
import { useMuseum } from '../../state/store'
import { playActivate } from '../../systems/audio/engine'

/**
 * Wall-mounted skill family display. Kept under the legacy component name so
 * the room composition can swap the old monoliths without touching imports.
 */
export function SkillMonolith({
  group,
  position,
}: {
  group: SkillGroup
  position: [number, number, number]
}) {
  const [x, y, z] = position
  const materials = useMemo(
    () => ({
      plaque: new THREE.MeshStandardMaterial({
        color: '#17191e',
        roughness: 0.56,
        metalness: 0.18,
        emissive: '#14100a',
        emissiveIntensity: 0.18,
      }),
      inner: new THREE.MeshStandardMaterial({
        color: '#22262d',
        roughness: 0.72,
        metalness: 0.08,
        emissive: '#0b0d10',
        emissiveIntensity: 0.12,
      }),
      brass: new THREE.MeshStandardMaterial({
        color: ACCENT_DIM,
        roughness: 0.36,
        metalness: 0.82,
      }),
      chip: new THREE.MeshBasicMaterial({ color: '#2e333c' }),
    }),
    [],
  )

  useEffect(() => {
    const unregister = registerInteractable({
      id: `skills-${group.id}`,
      x,
      y: 2.1,
      z: z + 0.85,
      radius: 3.1,
      prompt: `Inspect ${group.label}`,
      onInteract: () => {
        const s = useMuseum.getState()
        if (!s.settings.muted) playActivate()
        s.setModal({ type: 'skills', id: group.id })
      },
    })
    return () => {
      unregister()
    }
  }, [group.id, group.label, x, y, z])

  const PANEL_W = 3.85
  const PANEL_H = 3.08
  const rowTop = 2.62
  const rowGap = group.skills.length > 5 ? 0.36 : 0.44

  return (
    <group position={position}>
      <mesh material={materials.plaque} castShadow receiveShadow position={[0, 2.42, 0]}>
        <boxGeometry args={[PANEL_W, PANEL_H, 0.08]} />
      </mesh>
      <mesh material={materials.inner} position={[0, 2.42, 0.085]}>
        <planeGeometry args={[PANEL_W - 0.28, PANEL_H - 0.28]} />
      </mesh>

      <mesh material={materials.brass} position={[0, 3.93, 0.14]}>
        <boxGeometry args={[PANEL_W + 0.18, 0.045, 0.045]} />
      </mesh>
      <mesh material={materials.brass} position={[0, 0.91, 0.14]}>
        <boxGeometry args={[PANEL_W + 0.18, 0.045, 0.045]} />
      </mesh>
      <mesh material={materials.brass} position={[-PANEL_W / 2 - 0.09, 2.42, 0.14]}>
        <boxGeometry args={[0.045, PANEL_H + 0.16, 0.045]} />
      </mesh>
      <mesh material={materials.brass} position={[PANEL_W / 2 + 0.09, 2.42, 0.14]}>
        <boxGeometry args={[0.045, PANEL_H + 0.16, 0.045]} />
      </mesh>

      <Text
        font={FONTS.serif500}
        fontSize={0.3}
        color="#fff3df"
        anchorX="center"
        position={[0, 3.54, 0.18]}
        maxWidth={PANEL_W - 0.36}
      >
        {group.label}
      </Text>
      <Text
        font={FONTS.sans400}
        fontSize={0.074}
        color="#f1cf9a"
        anchorX="center"
        position={[0, 3.17, 0.18]}
        letterSpacing={0.08}
        maxWidth={PANEL_W - 0.42}
      >
        {group.blurb.toUpperCase()}
      </Text>

      {group.skills.map((s, i) => {
        const y = rowTop - i * rowGap
        return (
          <group key={s.name}>
            <mesh material={materials.chip} position={[0, y, 0.165]}>
              <planeGeometry args={[2.9, 0.2]} />
            </mesh>
            <Text
              font={FONTS.sans600}
              fontSize={0.116}
              color="#fffaf1"
              anchorX="center"
              position={[0, y + 0.032, 0.19]}
              maxWidth={2.6}
              textAlign="center"
            >
              {s.name}
            </Text>
          </group>
        )
      })}

      <pointLight position={[0, 2.35, 1.2]} intensity={2.8} distance={4.8} color={ACCENT} />
    </group>
  )
}
