import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Label as Text } from './installations/Label'
import { PROFILE, PROJECTS, MORE_PROJECTS, SKILLS, CERTIFICATES, TIMELINE, FONTS, SECRET } from '../config/content'
import { getMaterials, ACCENT, ACCENT_DIM } from './materials'
import { ProjectScreen } from './installations/ProjectScreen'
import { CertFrame } from './installations/CertFrame'
import { SkillMonolith } from './installations/SkillMonolith'
import { Pedestal } from './installations/Pedestal'
import { TextPanel } from './installations/TextPanel'
import { Trophy } from './installations/Trophy'
import { FloorLamp } from './installations/FloorLamp'
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

      {/* Building sign above the hall doorway (no name on the building) */}
      <Text
        font={FONTS.serif300}
        fontSize={0.42}
        color="#ece6da"
        anchorX="center"
        position={[0, 3.9, 4.24]}
        letterSpacing={0.2}
        maxWidth={11}
      >
        THE GALLERY
      </Text>
      <Text
        font={FONTS.sans400}
        fontSize={0.12}
        color={ACCENT}
        anchorX="center"
        position={[0, 3.5, 4.24]}
        letterSpacing={0.5}
      >
        A MUSEUM OF WORK
      </Text>

      {/* Warm interactive lamps flanking the lobby */}
      <FloorLamp position={[-4.7, 0, 11]} />
      <FloorLamp position={[4.7, 0, 11]} />

      {/* Wayfinding */}
      <Text font={FONTS.sans400} fontSize={0.15} color="#8f8a7d" position={[-5.74, 2.2, 8]} rotation-y={Math.PI / 2} letterSpacing={0.3} anchorX="center">
        ABOUT
      </Text>
      <Text font={FONTS.sans400} fontSize={0.15} color="#8f8a7d" position={[5.74, 2.2, 8]} rotation-y={-Math.PI / 2} letterSpacing={0.3} anchorX="center">
        CONTACT
      </Text>
      <Text font={FONTS.sans400} fontSize={0.15} color="#8f8a7d" position={[0, 2.2, 4.24]} letterSpacing={0.28} anchorX="center">
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
    <group position={[-13.73, 2.05, 8]} rotation-y={Math.PI / 2}>
      <mesh material={materials.brass} position={[0, 0, -0.05]} castShadow>
        <boxGeometry args={[2.15, 2.7, 0.1]} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[1.95, 2.5]} />
        <meshStandardMaterial map={texture} roughness={0.5} />
      </mesh>
      <Text font={FONTS.sans400} fontSize={0.075} color={ACCENT_DIM} anchorX="center" position={[0, -1.55, 0.04]} letterSpacing={0.16}>
        {`THE DEVELOPER, ${PROFILE.location.toUpperCase()}`}
      </Text>
      <spotLight position={[0, 2, 1.8]} angle={0.6} penumbra={0.8} intensity={24} distance={8} color="#ffe3bd" decay={1.6}>
        <object3D attach="target" position={[0, -2, -1.8]} />
      </spotLight>
    </group>
  )
}

export function AboutRoom() {
  return (
    <group>
      <PortraitFrame />
      <TextPanel position={[-13, 3.15, 4.26]} heading="About" body={PROFILE.bio} width={5.4} />
      <TextPanel
        position={[-13, 3.0, 11.74]}
        rotationY={Math.PI}
        heading="Now"
        body={'Computer Science @ UNITBV — Brașov, Romania.\nCurrently deep in: C++, machine learning, systems.\nOpen to internships and collaborations.'}
        width={5.4}
      />
      <Pedestal
        position={[-10, 0, 9.8]}
        label="Curriculum Vitae"
        prompt="Take a copy of the CV"
        exhibit="octahedron"
        onInteract={() => window.open(PROFILE.resume, '_blank', 'noopener')}
      />
      <FloorLamp position={[-7, 0, 5.6]} />
      <Dust center={[-10, 2.2, 8]} size={[7, 3.5, 7]} count={120} />
    </group>
  )
}

// ── Projects hall ──────────────────────────────────────────────────
export function ProjectsHall() {
  const main = PROJECTS
  const more = MORE_PROJECTS
  return (
    <group>
      {/* Main projects: flanking the gallery door + west end wall */}
      <ProjectScreen project={main[0]} position={[-6, 2.0, -7.58]} />
      <ProjectScreen project={main[1]} position={[6, 2.0, -7.58]} />
      <ProjectScreen project={main[2]} position={[-14.58, 2.0, -2]} rotationY={Math.PI / 2} />
      {/* Earlier work: east end wall + south wall pair */}
      <ProjectScreen project={more[0]} position={[14.58, 2.0, -2]} rotationY={-Math.PI / 2} />
      <ProjectScreen project={more[1]} position={[-8.5, 2.0, 3.58]} rotationY={Math.PI} />
      <ProjectScreen project={more[2]} position={[8.5, 2.0, 3.58]} rotationY={Math.PI} />

      <Text
        font={FONTS.serif300}
        fontSize={0.4}
        color="#ece6da"
        anchorX="center"
        position={[0, 4.3, -7.6]}
        letterSpacing={0.22}
        maxWidth={12}
      >
        MAIN PROJECTS
      </Text>
      <Text
        font={FONTS.serif300}
        fontSize={0.28}
        color="#b9b2a2"
        anchorX="center"
        position={[0, 4.3, 3.76]}
        rotation-y={Math.PI}
        letterSpacing={0.22}
        maxWidth={12}
      >
        MORE WORKS
      </Text>

      {/* The Krontech cup, center stage */}
      <Trophy position={[0, 0, -2]} />
      <Bench position={[-4.2, 0, 0.6]} />
      <Bench position={[4.2, 0, 0.6]} />
      <Dust center={[0, 2.4, -2]} size={[28, 4.5, 11]} count={500} />
    </group>
  )
}

// ── North gallery: Skills · Journey · Certificates ─────────────────
export function NorthGallery() {
  return (
    <group>
      {/* Title inside, above the door */}
      <Text
        font={FONTS.serif300}
        fontSize={0.34}
        color="#ece6da"
        anchorX="center"
        position={[0, 4.2, -8.24]}
        rotation-y={Math.PI}
        letterSpacing={0.22}
        maxWidth={14}
      >
        SKILLS &amp; JOURNEY
      </Text>

      {/* Skill monoliths, mid-room, facing the entrance */}
      {SKILLS.map((g, i) => (
        <SkillMonolith key={g.id} group={g} position={[-6.4 + i * 2.7, 0, -12.5]} />
      ))}

      {/* Certificates on the west wall */}
      {CERTIFICATES.map((c, i) => (
        <CertFrame
          key={c.id}
          cert={c}
          position={[-9.76, 2.1, -9.9 - i * 2.3]}
          rotationY={Math.PI / 2}
          crooked={i === CERTIFICATES.length - 1}
        />
      ))}

      {/* The journey timeline on the east wall */}
      {TIMELINE.map((t, i) => {
        const z = -9.4 - i * 1.75
        return (
          <group key={t.year}>
            <Text
              font={FONTS.serif500}
              fontSize={0.34}
              color={ACCENT}
              anchorX="left"
              position={[9.8, 3.05, z]}
              rotation-y={-Math.PI / 2}
            >
              {t.year}
            </Text>
            <TextPanel
              position={[9.8, 2.55, z]}
              rotationY={-Math.PI / 2}
              heading={t.title}
              body={t.detail}
              headingSize={0.17}
              bodySize={0.1}
              width={1.6}
            />
          </group>
        )
      })}

      <Dust center={[0, 2.2, -12]} size={[18, 3.5, 7]} count={260} />
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
      <pointLight position={[6, 3.6, -19]} intensity={unlocked ? 9 : 0} distance={9} color={ACCENT} />
      <LightShaft position={[6, 2.4, -19]} height={4.6} topRadius={0.5} bottomRadius={1.7} color={ACCENT} opacity={unlocked ? 0.07 : 0} />

      <TextPanel
        position={[3.4, 3.6, -21.74]}
        heading="The Archive"
        body="You found the room that isn't on the map. This is where the museum keeps the person behind the plaques."
        width={5.2}
      />

      <Pedestal
        position={[6, 0, -19]}
        label="The Archive"
        prompt="Open the Archive"
        exhibit="torusKnot"
        accent={ACCENT}
        onInteract={() => setModal({ type: 'archive' })}
      />

      {/* Favorite tech shrine */}
      <Text
        font={FONTS.sans600}
        fontSize={0.2}
        color={ACCENT}
        anchorX="center"
        position={[2.26, 2.2, -19]}
        rotation-y={Math.PI / 2}
        lineHeight={2}
        letterSpacing={0.14}
        maxWidth={4.5}
        textAlign="center"
      >
        {SECRET.favoriteTech.join('\n')}
      </Text>
      <Text
        font={FONTS.sans400}
        fontSize={0.105}
        color="#a89f8e"
        anchorX="center"
        position={[9.74, 2.4, -19]}
        rotation-y={-Math.PI / 2}
        lineHeight={1.9}
        maxWidth={4.6}
        textAlign="center"
      >
        {SECRET.goals.join('\n')}
      </Text>

      {/* Slow constellation */}
      <group ref={stars} position={[6, 3.4, -19]}>
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
      <Dust center={[6, 2, -19]} size={[7, 3.5, 5]} count={150} />
    </group>
  )
}

// ── Contact room ───────────────────────────────────────────────────
export function ContactRoom() {
  const setModal = useMuseum((s) => s.setModal)
  return (
    <group>
      <TextPanel
        position={[7.4, 3.15, 4.26]}
        heading="Contact"
        body={'The museum is staffed by exactly one person,\nand he answers his mail.'}
        width={5.4}
      />
      <Pedestal
        position={[10, 0, 8]}
        label="Guestbook Terminal"
        prompt="Leave a message"
        exhibit="torusKnot"
        onInteract={() => setModal({ type: 'contact' })}
      />
      <FloorLamp position={[7, 0, 5.6]} />
      <Text
        font={FONTS.sans400}
        fontSize={0.14}
        color="#98917f"
        anchorX="center"
        position={[13.76, 2.3, 8]}
        rotation-y={-Math.PI / 2}
        lineHeight={2.2}
        letterSpacing={0.12}
        maxWidth={6}
        textAlign="center"
      >
        {PROFILE.socials.map((s) => s.label.toUpperCase()).join('\n')}
      </Text>
      <Dust center={[10, 2.2, 8]} size={[7, 3.5, 7]} count={120} />
    </group>
  )
}
