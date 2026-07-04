import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { DOORS, DOOR_H, WALL_T } from './layout'
import { getMaterials } from './materials'
import { addCollider, setColliderEnabled, removeCollider } from '../systems/physics/colliders'
import { playDoor, playSecret } from '../systems/audio/engine'
import { useMuseum } from '../state/store'

/** A pair of panels that slide apart when the camera approaches. */
function SlidingDoor({ id, x, z, width }: { id: string; x: number; z: number; width: number }) {
  const materials = useMemo(() => getMaterials(), [])
  const left = useRef<THREE.Mesh>(null!)
  const right = useRef<THREE.Mesh>(null!)
  const openT = useRef(0)
  const wasOpen = useRef(false)
  const camera = useThree((s) => s.camera)
  const half = width / 2

  useEffect(() => {
    const cid = addCollider(x - half, x + half, z - WALL_T / 2, z + WALL_T / 2, `col-${id}`)
    return () => removeCollider(cid)
  }, [id, x, z, half])

  useFrame((_, dt) => {
    const dx = camera.position.x - x
    const dz = camera.position.z - z
    const near = dx * dx + dz * dz < 3.2 * 3.2
    if (near !== wasOpen.current) {
      wasOpen.current = near
      if (!useMuseum.getState().settings.muted) playDoor()
      setColliderEnabled(`col-${id}`, !near)
    }
    const target = near ? 1 : 0
    openT.current += (target - openT.current) * Math.min(1, 3.5 * dt)
    const slide = openT.current * (half - 0.05)
    left.current.position.x = x - half / 2 - slide
    right.current.position.x = x + half / 2 + slide
  })

  return (
    <group>
      <mesh ref={left} position={[x - half / 2, DOOR_H / 2, z]} material={materials.blackMetal} castShadow>
        <boxGeometry args={[half, DOOR_H, 0.12]} />
      </mesh>
      <mesh ref={right} position={[x + half / 2, DOOR_H / 2, z]} material={materials.blackMetal} castShadow>
        <boxGeometry args={[half, DOOR_H, 0.12]} />
      </mesh>
      {/* Brass door track */}
      <mesh position={[x, DOOR_H + 0.06, z]} material={materials.brass}>
        <boxGeometry args={[width + 0.4, 0.12, 0.2]} />
      </mesh>
    </group>
  )
}

/** Entrance: tall glass panels that part for the visitor. */
function EntranceDoor() {
  const left = useRef<THREE.Mesh>(null!)
  const right = useRef<THREE.Mesh>(null!)
  const openT = useRef(0)
  const wasOpen = useRef(false)
  const camera = useThree((s) => s.camera)
  const phase = useMuseum((s) => s.phase)

  useEffect(() => {
    addCollider(-1.7, 1.7, 16 - WALL_T / 2, 16 + WALL_T / 2, 'col-entrance')
    return () => removeCollider('col-entrance')
  }, [])

  useFrame((_, dt) => {
    const dx = camera.position.x
    const dz = camera.position.z - 16
    const near = (dx * dx + dz * dz < 4.5 * 4.5 && phase !== 'title') || phase === 'cinematic'
    if (near !== wasOpen.current) {
      wasOpen.current = near
      if (!useMuseum.getState().settings.muted) playDoor()
      setColliderEnabled('col-entrance', !near)
    }
    openT.current += ((near ? 1 : 0) - openT.current) * Math.min(1, 2.2 * dt)
    const slide = openT.current * 1.62
    left.current.position.x = -0.85 - slide
    right.current.position.x = 0.85 + slide
  })

  const glass = (
    <meshPhysicalMaterial
      color="#9fb4c8"
      transparent
      opacity={0.22}
      roughness={0.04}
      metalness={0.2}
      side={2}
    />
  )
  return (
    <group>
      <mesh ref={left} position={[-0.85, DOOR_H / 2, 16]}>
        <boxGeometry args={[1.7, DOOR_H, 0.06]} />
        {glass}
      </mesh>
      <mesh ref={right} position={[0.85, DOOR_H / 2, 16]}>
        <boxGeometry args={[1.7, DOOR_H, 0.06]} />
        {glass}
      </mesh>
    </group>
  )
}

/** The hidden wall panel guarding the Archive. */
function SecretPanel() {
  const materials = useMemo(() => getMaterials(), [])
  const panel = useRef<THREE.Mesh>(null!)
  const unlocked = useMuseum((s) => s.secretUnlocked)
  const t = useRef(0)
  const played = useRef(false)

  useEffect(() => {
    addCollider(-1.3, 1.3, -16 - WALL_T / 2, -16 + WALL_T / 2, 'col-secret')
    return () => removeCollider('col-secret')
  }, [])

  useEffect(() => {
    if (unlocked) {
      setColliderEnabled('col-secret', false)
      if (!played.current) {
        played.current = true
        if (!useMuseum.getState().settings.muted) playSecret()
      }
    }
  }, [unlocked])

  useFrame((_, dt) => {
    const target = unlocked ? 1 : 0
    t.current += (target - t.current) * Math.min(1, 0.8 * dt)
    // The panel sinks into the floor
    panel.current.position.y = DOOR_H / 2 - t.current * (DOOR_H + 0.2)
  })

  return (
    <mesh ref={panel} position={[0, DOOR_H / 2, -16]} material={materials.plaster} castShadow>
      <boxGeometry args={[2.6, DOOR_H, WALL_T * 0.9]} />
    </mesh>
  )
}

export function Doors() {
  return (
    <group>
      <EntranceDoor />
      {DOORS.map((d) => (
        <SlidingDoor key={d.id} id={d.id} x={d.x} z={d.z} width={d.width} />
      ))}
      <SecretPanel />
    </group>
  )
}
