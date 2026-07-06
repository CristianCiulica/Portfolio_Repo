import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Label as Text } from './Label'
import type { Certificate } from '../../config/content'
import { FONTS } from '../../config/content'
import { getMaterials, ACCENT_DIM } from '../materials'
import { registerInteractable } from '../../systems/interactions'
import { useMuseum } from '../../state/store'
import { playActivate, playHover } from '../../systems/audio/engine'

/**
 * A diploma hung as art in a brass frame.
 * One of them hangs crooked; straightening it opens the Archive.
 */
export function CertFrame({
  cert,
  position,
  rotationY = 0,
  crooked = false,
}: {
  cert: Certificate
  position: [number, number, number]
  rotationY?: number
  crooked?: boolean
}) {
  const materials = useMemo(() => getMaterials(), [])
  const texture = useTexture(cert.image)
  const group = useRef<THREE.Group>(null!)
  const tilt = useRef(crooked ? 0.085 : 0)
  const straightened = useRef(false)

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
  }, [texture])

  useEffect(() => {
    return registerInteractable({
      id: `cert-${cert.id}`,
      x: position[0],
      y: position[1],
      z: position[2],
      radius: 2.6,
      prompt: crooked && !straightened.current ? 'Straighten the frame' : `View “${cert.title}”`,
      onInteract: () => {
        const s = useMuseum.getState()
        if (crooked && !straightened.current && !s.secretUnlocked) {
          straightened.current = true
          if (!s.settings.muted) playHover()
          s.unlockSecret()
          s.setToast('Somewhere, stone slides against stone… (look along the far wall)')
          setTimeout(() => useMuseum.getState().setToast(null), 6000)
        } else {
          if (!s.settings.muted) playActivate()
          s.setModal({ type: 'cert', id: cert.id })
        }
      },
    })
  }, [cert.id, crooked])

  useFrame((_, dt) => {
    const target = straightened.current || !crooked ? 0 : 0.085
    tilt.current += (target - tilt.current) * Math.min(1, 2 * dt)
    if (group.current) group.current.rotation.z = tilt.current
  })

  const W = 1.7
  const H = 1.24

  return (
    <group position={position} rotation-y={rotationY}>
      <group ref={group}>
        <mesh material={materials.brass} castShadow position={[0, 0, -0.03]}>
          <boxGeometry args={[W + 0.14, H + 0.14, 0.08]} />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[W, H]} />
          <meshStandardMaterial map={texture} roughness={0.55} metalness={0} />
        </mesh>
      </group>
      <Text
        font={FONTS.sans400}
        fontSize={0.075}
        color="#fff2df"
        anchorX="center"
        anchorY="top"
        position={[0, -H / 2 - 0.16, 0.04]}
        maxWidth={W + 0.4}
        textAlign="center"
        lineHeight={1.35}
      >
        {cert.title}
      </Text>
      <Text
        font={FONTS.sans400}
        fontSize={0.058}
        color="#e4c48c"
        anchorX="center"
        anchorY="top"
        position={[0, -H / 2 - 0.44, 0.04]}
        letterSpacing={0.1}
        maxWidth={W + 0.4}
        textAlign="center"
      >
        {`${cert.issuer.toUpperCase()}  ·  ${cert.year}`}
      </Text>
      <spotLight
        position={[0, 1.8, 1.3]}
        angle={0.55}
        penumbra={0.8}
        intensity={16}
        distance={6}
        color="#ffe3bd"
        decay={1.6}
      >
        <object3D attach="target" position={[0, -1.8, -1.3]} />
      </spotLight>
    </group>
  )
}
