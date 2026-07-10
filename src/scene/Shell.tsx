import { useEffect, useMemo } from 'react'
import { MeshReflectorMaterial } from '@react-three/drei'
import { buildSegments, INTERIOR, WALL_T } from './layout'
import { getMaterials } from './materials'
import { addCollider, removeCollider } from '../systems/physics/colliders'

/**
 * The building itself: walls (from the floor plan), floor, ceiling, skylight.
 * Wall meshes and wall colliders derive from the same data — no drift.
 */
export function Shell() {
  const segments = useMemo(() => buildSegments(), [])
  const materials = useMemo(() => getMaterials(), [])

  // Register colliders for solid segments + building furniture-free zones
  useEffect(() => {
    const ids = segments
      .filter((s) => s.collider)
      .map((s) =>
        addCollider(s.cx - s.sx / 2, s.cx + s.sx / 2, s.cz - s.sz / 2, s.cz + s.sz / 2),
      )
    return () => ids.forEach(removeCollider)
  }, [segments])

  return (
    <group>
      {/* Walls */}
      {segments.map((s, i) => {
        const isX = s.sx > s.sz
        return (
          <group key={i}>
            {/* Main Wall */}
            <mesh position={[s.cx, s.cy, s.cz]} material={materials.plaster}>
              <boxGeometry args={[s.sx, s.sy, s.sz]} />
            </mesh>
            
            {/* Plinth / Baseboard (8cm tall, slightly thicker than wall) */}
            <mesh position={[s.cx, 0.04, s.cz]} material={materials.concrete}>
              <boxGeometry args={[isX ? s.sx : s.sx + 0.06, 0.08, isX ? s.sz + 0.06 : s.sz]} />
            </mesh>

            {/* Ceiling LED Edge Profile (only if wall reaches ceiling) */}
            {s.cy + s.sy / 2 > 5.1 && (
              <mesh position={[s.cx, s.cy + s.sy / 2 - 0.02, s.cz]}>
                <boxGeometry args={[isX ? s.sx : s.sx + 0.08, 0.04, isX ? s.sz + 0.08 : s.sz]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffddaa" emissiveIntensity={2} />
              </mesh>
            )}
          </group>
        )
      })}

      {/* Interior floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, (INTERIOR.minZ + INTERIOR.maxZ) / 2]} receiveShadow>
        <planeGeometry args={[INTERIOR.maxX - INTERIOR.minX, INTERIOR.maxZ - INTERIOR.minZ]} />
        <MeshReflectorMaterial
          resolution={256}
          mirror={0.35}
          mixBlur={2.5}
          mixStrength={1.1}
          blur={[140, 60]}
          depthScale={0.5}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#d4d1cc"
          roughness={0.45}
          metalness={0.25}
        />
      </mesh>

      {/* Ceiling slabs (hole left over the lobby skylight) */}
      <CeilingWithSkylight />

      {/* Exterior plinth the museum sits on */}
      <mesh position={[0, -0.28, -3]} receiveShadow>
        <boxGeometry args={[34, 0.5, 42]} />
        <primitive object={materials.concrete} attach="material" />
      </mesh>
    </group>
  )
}

const CEIL_Y = 5.2
// Skylight hole over lobby center (0, 10), 3.6 × 3.6
const HOLE = { minX: -1.8, maxX: 1.8, minZ: 8.2, maxZ: 11.8 }

function CeilingWithSkylight() {
  const materials = useMemo(() => getMaterials(), [])
  const { minX, maxX, minZ, maxZ } = INTERIOR
  // 4 slabs around the hole
  const slabs: [number, number, number, number][] = [
    [minX, maxX, minZ, HOLE.minZ], // north of hole (big)
    [minX, maxX, HOLE.maxZ, maxZ], // south strip
    [minX, HOLE.minX, HOLE.minZ, HOLE.maxZ], // west strip
    [HOLE.maxX, maxX, HOLE.minZ, HOLE.maxZ], // east strip
  ]
  return (
    <group>
      {slabs.map(([x0, x1, z0, z1], i) => (
        <mesh key={i} position={[(x0 + x1) / 2, CEIL_Y + WALL_T / 2, (z0 + z1) / 2]}>
          <boxGeometry args={[x1 - x0, WALL_T, z1 - z0]} />
          <primitive object={materials.darkWood || materials.concrete} attach="material" />
        </mesh>
      ))}
      {/* Skylight glass */}
      <mesh
        position={[(HOLE.minX + HOLE.maxX) / 2, CEIL_Y + 0.05, (HOLE.minZ + HOLE.maxZ) / 2]}
        rotation-x={-Math.PI / 2}
      >
        <planeGeometry args={[HOLE.maxX - HOLE.minX, HOLE.maxZ - HOLE.minZ]} />
        <meshPhysicalMaterial
          color="#bcd2ee"
          transparent
          opacity={0.18}
          roughness={0.05}
          metalness={0.1}
          side={2}
        />
      </mesh>
    </group>
  )
}
