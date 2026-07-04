import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text, useTexture } from '@react-three/drei'
import { PROFILE, PROJECTS, SKILLS, CERTIFICATES, TIMELINE, FONTS, SECRET } from '../config/content'
import { getMaterials, ACCENT, ACCENT_DIM } from './materials'
import { ProjectScreen } from './installations/ProjectScreen'
import { CertFrame } from './installations/CertFrame'
import { SkillMonolith } from './installations/SkillMonolith'
import { Pedestal } from './installations/Pedestal'
import { TextPanel } from './installations/TextPanel'
import { Dust } from './fx/Dust'
import { LightShaft } from './fx/LightShaft'
import { addCollider, removeCollider } from '../systems/physics/colliders'
import { useMuseum } from '../state/store'

function Bench({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  const materials = useMemo(() => getMaterials(), [])
  useEffect(() => {
    const [x, , z] = position
    const c = Math.cos(rotationY)
    const hx = Math.abs(c) > 0.5 ? 1.1 : 0.3
    const hz = Math.abs(c) > 0.5 ? 0.3 : 1.1
    const id = addCollider(x - hx, x + hx, z - hz, z + hz)
    return () => removeCollider(id)
  }, [])
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh material={materials.blackMetal} castShadow position={[0, 0.42, 0]}>
        <boxGeometry args={[2.1, 0.08, 0.55]} />
      </mesh>
      <mesh material={materials.blackMetal} position={[-0.85, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.4, 0.5]} />
      </mesh>
      <mesh material={materials.blackMetal} position={[0.85, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.4, 0.5]} />
      </mesh>
    </group>
  )
}

// ── Lobby ──────────────────────────────────────────────────────────
export function Lobby() {
  return (
    <group>
      <LightShaft position={[0, 2.6, 10]} height={5.2} topRadius={0.9} bottomRadius={2.4} opacity={0.05} />
      <Dust center={[0, 2.4, 10]} size={[10, 4.5, 10]} count={220} />

      {/* Museum name above the hall doorway */}
      <Text
        font={FONTS.serif300}
        fontSize={0.5}
        color="#ece6da"
        anchorX="center"
        position={[0, 3.9, 4.25]}
        letterSpacing={0.18}
      >
        CRISTIAN CIULICĂ
      </Text>
      <Text
        font={FONTS.sans400}
        fontSize={0.13}
        color={ACCENT}
        anchorX="center"
        position={[0, 3.45, 4.25]}
        letterSpacing={0.5}
      >
        GALLERY OF WORK
      </Text>

      {/* Wayfinding */}
      <Text font={FONTS.sans400} fontSize={0.16} color="#8f8a7d" position={[-5.75, 2.2, 8]} rotation-y={Math.PI / 2} letterSpacing={0.3} anchorX="center">
        ABOUT
      </Text>
      <Text font={FONTS.sans400} fontSize={0.16} color="#8f8a7d" position={[5.75, 2.2, 8]} rotation-y={-Math.PI / 2} letterSpacing={0.3} anchorX="center">
        CONTACT
      </Text>
      <Text font={FONTS.sans400} fontSize={0.16} color="#8f8a7d" position={[0, 2.2, 4.25]} letterSpacing={0.3} anchorX="center">
        PROJECTS  ·  SKILLS  ·  JOURNEY
      </Text>

      <Bench position={[-3.4, 0, 12.5]} rotationY={Math.PI / 2} />
      <Bench position={[3.4, 0, 12.5]} rotationY={Math.PI / 2} />
    </group>
  )
}

// ── About wing ─────────────────────────────────────────────────────
function PortraitFrame() {
  const materials = useMemo(() => getMaterials(), [])
  const texture = useTexture(PROFILE.portrait)
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
  }, [texture])
  return (
    <group position={[-13.78, 2.05, 8]} rotation-y={Math.PI / 2}>
      <mesh material={materials.brass} position={[0, 0, -0.04]} castShadow>
        <boxGeometry args={[2.15, 2.7, 0.1]} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1.95, 2.5]} />
        <meshStandardMaterial map={texture} roughness={0.5} />
      </mesh>
      <Text font={FONTS.sans400} fontSize={0.075} color={ACCENT_DIM} anchorX="center" position={[0, -1.55, 0.02]} letterSpacing={0.16}>
        {`THE DEVELOPER, ${PROFILE.location.toUpperCase()}`}
      </Text>
      <spotLight position={[0, 2, 1.8]} angle={0.6} penumbra={0.8} intensity={24} distance={8} color="#ffe3bd" decay={1.6}>
        <object3D attach="target" position={[0, -2, -1.6]} />
      </spotLight>
    </group>
  )
}

export function AboutRoom() {
  return (
    <group>
      <PortraitFrame />
      <TextPanel
        position={[-12.6, 3.1, 4.35]}
        heading="About"
        body={PROFILE.bio}
        width={5.6}
      />
      <TextPanel
        position={[-12.6, 3.0, 11.65]}
        rotationY={Math.PI}
        heading="Now"
        body={'Computer Science @ UNITBV — Brașov, Romania\nCurrently deep in: C++, machine learning, systems.\nOpen to internships and collaborations.'}
        width={5.6}
      />
      <Pedestal
        position={[-10, 0, 9.8]}
        label="Curriculum Vitae"
        prompt="Take a copy of the CV"
        exhibit="octahedron"
        onInteract={() => window.open(PROFILE.resume, '_blank', 'noopener')}
      />
      <Dust center={[-10, 2.2, 8]} size={[7, 3.5, 7]} count={120} />
    </group>
  )
}

// ── Projects hall ──────────────────────────────────────────────────
export function ProjectsHall() {
  const p = PROJECTS
  return (
    <group>
      {/* North wall pair */}
      <ProjectScreen project={p[0]} position={[-5, 2.0, -7.72]} />
      <ProjectScreen project={p[1]} position={[5, 2.0, -7.72]} />
      {/* South wall pair */}
      <ProjectScreen project={p[2]} position={[-8.5, 2.0, 3.72]} rotationY={Math.PI} />
      <ProjectScreen project={p[3]} position={[8.5, 2.0, 3.72]} rotationY={Math.PI} />
      {/* End walls */}
      <ProjectScreen project={p[4]} position={[-14.72, 2.0, -2]} rotationY={Math.PI / 2} />
      <ProjectScreen project={p[5]} position={[14.72, 2.0, -2]} rotationY={-Math.PI / 2} />

      <Text
        font={FONTS.serif300}
        fontSize={0.42}
        color="#ece6da"
        anchorX="center"
        position={[0, 4.2, -7.7]}
        letterSpacing={0.24}
      >
        SELECTED WORKS
      </Text>

      <Bench position={[0, 0, -2]} />
      <Bench position={[0, 0, 0]} />
      <Dust center={[0, 2.4, -2]} size={[28, 4.5, 11]} count={500} />
    </group>
  )
}

// ── Skills gallery ─────────────────────────────────────────────────
export function SkillsGallery() {
  return (
    <group>
      {SKILLS.map((g, i) => (
        <SkillMonolith key={g.id} group={g} position={[-12.6 + i * 2.7, 0, -13]} />
      ))}
      <TextPanel
        position={[-13.5, 3.9, -15.65]}
        heading="Skills Gallery"
        body="Approach a monolith to wake it. The light shows how far each craft has come — none of them are finished. Good."
        width={4.6}
      />
      <Dust center={[-10, 2, -12]} size={[9, 3.5, 7]} count={120} />
    </group>
  )
}

// ── Experience / journey room ──────────────────────────────────────
export function ExperienceRoom() {
  return (
    <group>
      <TextPanel position={[-2.9, 3.9, -15.65]} heading="The Journey" width={4} />
      {TIMELINE.map((t, i) => {
        const onWest = i % 2 === 0
        const z = -9.6 - Math.floor(i / 2) * 3.2
        return (
          <group key={t.year}>
            <Text
              font={FONTS.serif500}
              fontSize={0.5}
              color={ACCENT}
              anchorX="left"
              position={onWest ? [-3.85, 2.9, z] : [3.85, 2.9, z]}
              rotation-y={onWest ? Math.PI / 2 : -Math.PI / 2}
            >
              {t.year}
            </Text>
            <TextPanel
              position={onWest ? [-3.85, 2.25, z] : [3.85, 2.25, z]}
              rotationY={onWest ? Math.PI / 2 : -Math.PI / 2}
              heading={t.title}
              body={t.detail}
              headingSize={0.24}
              bodySize={0.13}
              width={2.9}
            />
          </group>
        )
      })}
      <Dust center={[0, 2, -12]} size={[7, 3.5, 7]} count={100} />
    </group>
  )
}

// ── Certificates wall ──────────────────────────────────────────────
export function CertificatesWall() {
  return (
    <group>
      {CERTIFICATES.map((c, i) => (
        <CertFrame
          key={c.id}
          cert={c}
          position={[7.4 + i * 2.6, 2.1, -15.72]}
          crooked={i === CERTIFICATES.length - 1}
        />
      ))}
      <TextPanel
        position={[5.3, 3.4, -12]}
        rotationY={Math.PI / 2}
        heading="Certificates"
        body="Proof of the hours. One of these was hung in a hurry."
        width={3.4}
      />
      <Dust center={[10, 2, -12]} size={[9, 3.5, 7]} count={120} />
    </group>
  )
}

// ── Contact room ───────────────────────────────────────────────────
export function ContactRoom() {
  const setModal = useMuseum((s) => s.setModal)
  return (
    <group>
      <TextPanel
        position={[7.2, 3.2, 4.35]}
        heading="Contact"
        body={'The museum is staffed by exactly one person,\nand he answers his mail.'}
        width={5.6}
      />
      <Pedestal
        position={[10, 0, 8]}
        label="Guestbook Terminal"
        prompt="Leave a message"
        exhibit="torusKnot"
        onInteract={() => setModal({ type: 'contact' })}
      />
      <Text
        font={FONTS.sans400}
        fontSize={0.14}
        color="#98917f"
        anchorX="center"
        position={[13.78, 2.3, 8]}
        rotation-y={-Math.PI / 2}
        lineHeight={2.2}
        letterSpacing={0.12}
      >
        {PROFILE.socials.map((s) => s.label.toUpperCase()).join('\n')}
      </Text>
      <Dust center={[10, 2.2, 8]} size={[7, 3.5, 7]} count={120} />
    </group>
  )
}

// ── The Archive (secret room) ──────────────────────────────────────
export function SecretRoom() {
  const unlocked = useMuseum((s) => s.secretUnlocked)
  const setModal = useMuseum((s) => s.setModal)
  const stars = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    if (stars.current) stars.current.rotation.y = clock.elapsedTime * 0.03
  })

  return (
    <group>
      {/* Warm sanctuary light, only meaningful once discovered */}
      <pointLight position={[0, 3.6, -19]} intensity={unlocked ? 9 : 0} distance={9} color={ACCENT} />
      <LightShaft position={[0, 2.4, -19]} height={4.6} topRadius={0.5} bottomRadius={1.7} color={ACCENT} opacity={unlocked ? 0.07 : 0} />

      <TextPanel
        position={[-2.9, 3.7, -21.65]}
        heading="The Archive"
        body="You found the room that isn't on the map. This is where the museum keeps the person behind the plaques."
        width={5.6}
      />

      <Pedestal
        position={[0, 0, -19]}
        label="The Archive"
        prompt="Open the Archive"
        exhibit="torusKnot"
        accent={ACCENT}
        onInteract={() => setModal({ type: 'archive' })}
      />

      {/* Favorite tech shrine */}
      <Text
        font={FONTS.sans600}
        fontSize={0.22}
        color={ACCENT}
        anchorX="center"
        position={[-3.85, 2.2, -19]}
        rotation-y={Math.PI / 2}
        lineHeight={2}
        letterSpacing={0.14}
      >
        {SECRET.favoriteTech.join('\n')}
      </Text>
      <Text
        font={FONTS.sans400}
        fontSize={0.11}
        color="#98917f"
        anchorX="center"
        position={[3.85, 2.4, -19]}
        rotation-y={-Math.PI / 2}
        lineHeight={1.9}
        maxWidth={4.4}
        textAlign="center"
      >
        {SECRET.goals.join('\n')}
      </Text>

      {/* Slow constellation */}
      <group ref={stars} position={[0, 3.4, -19]}>
        {Array.from({ length: 40 }).map((_, i) => {
          const a = (i / 40) * Math.PI * 2
          const r = 1.2 + (i % 5) * 0.35
          return (
            <mesh key={i} position={[Math.cos(a) * r, Math.sin(i * 2.7) * 0.7, Math.sin(a) * r]}>
              <sphereGeometry args={[0.016, 6, 6]} />
              <meshBasicMaterial color={ACCENT} toneMapped={false} />
            </mesh>
          )
        })}
      </group>
      <Dust center={[0, 2, -19]} size={[7, 3.5, 5]} count={150} />
    </group>
  )
}
