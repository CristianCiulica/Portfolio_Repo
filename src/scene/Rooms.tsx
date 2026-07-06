import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
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

function WallCard({
  position,
  rotationY = 0,
  title,
  body,
  accent = ACCENT,
  width = 1.65,
}: {
  position: [number, number, number]
  rotationY?: number
  title: string
  body: string
  accent?: string
  width?: number
}) {
  const materials = useMemo(() => getMaterials(), [])
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh material={materials.blackMetal} position={[0, 0, -0.025]} castShadow>
        <boxGeometry args={[width, 1.02, 0.05]} />
      </mesh>
      <mesh position={[0, 0.43, 0.02]}>
        <planeGeometry args={[width * 0.78, 0.018]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
      <Text
        font={FONTS.sans600}
        fontSize={0.105}
        color="#fff4e4"
        anchorX="center"
        position={[0, 0.22, 0.045]}
        maxWidth={width - 0.28}
        textAlign="center"
      >
        {title}
      </Text>
      <Text
        font={FONTS.sans400}
        fontSize={0.07}
        color="#ded6c8"
        anchorX="center"
        anchorY="top"
        position={[0, -0.02, 0.045]}
        maxWidth={width - 0.32}
        textAlign="center"
        lineHeight={1.38}
      >
        {body}
      </Text>
    </group>
  )
}

function LibraryShelf({
  position,
  rotationY = 0,
  width = 3.4,
}: {
  position: [number, number, number]
  rotationY?: number
  width?: number
}) {
  const materials = useMemo(() => getMaterials(), [])
  const bookColors = ['#7d2f2f', '#2d5677', '#586b38', '#8a6d36', '#5b4275', '#8a4d2c']
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh material={materials.blackMetal} position={[0, 0, -0.04]} castShadow>
        <boxGeometry args={[width + 0.18, 2.5, 0.12]} />
      </mesh>
      {[-0.9, -0.15, 0.6].map((y, shelfIndex) => (
        <group key={y}>
          <mesh material={materials.brass} position={[0, y - 0.28, 0.06]}>
            <boxGeometry args={[width, 0.055, 0.24]} />
          </mesh>
          {Array.from({ length: 13 }).map((_, i) => {
            const bookW = 0.13 + (i % 3) * 0.025
            const bookH = 0.38 + ((i + shelfIndex) % 4) * 0.055
            const x = -width / 2 + 0.22 + i * 0.23
            return (
              <mesh key={i} position={[x, y - 0.04 + bookH / 2, 0.18]}>
                <boxGeometry args={[bookW, bookH, 0.16]} />
                <meshStandardMaterial color={bookColors[(i + shelfIndex) % bookColors.length]} roughness={0.72} metalness={0.04} />
              </mesh>
            )
          })}
        </group>
      ))}
      <Text
        font={FONTS.sans600}
        fontSize={0.085}
        color="#f4ead9"
        anchorX="center"
        position={[0, 1.02, 0.2]}
        letterSpacing={0.12}
      >
        ARCHIVE STACKS
      </Text>
    </group>
  )
}

// ── Lobby ──────────────────────────────────────────────────────────
export function Lobby() {
  return (
    <group>
      <LightShaft position={[0, 2.6, 10]} height={5.2} topRadius={0.9} bottomRadius={2.4} opacity={0.05} />

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
      <Text font={FONTS.sans400} fontSize={0.14} color="#d6cfbf" position={[-5.74, 2.2, 8]} rotation-y={Math.PI / 2} letterSpacing={0.16} anchorX="center">
        ABOUT
      </Text>
      <Text font={FONTS.sans400} fontSize={0.14} color="#d6cfbf" position={[5.74, 2.2, 8]} rotation-y={-Math.PI / 2} letterSpacing={0.16} anchorX="center">
        CONTACT
      </Text>
      <Text font={FONTS.sans400} fontSize={0.115} color="#d6cfbf" position={[0, 2.2, 4.24]} letterSpacing={0.08} anchorX="center" maxWidth={4.1}>
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
      <TextPanel
        position={[-13, 3.35, 4.26]}
        heading="About"
        body={'Computer Science student building practical systems: game AI, dashboards, compilers and this 3D portfolio museum.'}
        width={5.4}
        headingSize={0.42}
        bodySize={0.12}
      />
      <TextPanel
        position={[-13, 3.0, 11.74]}
        rotationY={Math.PI}
        heading="Current Focus"
        body={'C++ fundamentals, AI projects, frontend polish and software engineering habits.'}
        width={5.4}
        headingSize={0.34}
        bodySize={0.11}
      />
      <WallCard
        position={[-12.2, 1.62, 4.32]}
        title="SYSTEMS"
        body="C++ foundations, data structures and careful problem solving."
        width={1.55}
      />
      <WallCard
        position={[-10, 1.62, 4.32]}
        title="AI"
        body="Game trees, heuristics, machine learning and image-based experiments."
        accent="#8fc7ff"
        width={1.55}
      />
      <WallCard
        position={[-7.8, 1.62, 4.32]}
        title="PRODUCT"
        body="Frontend interfaces, dashboards and projects that explain themselves."
        accent="#9ee6b8"
        width={1.55}
      />
      <Pedestal
        position={[-10, 0, 9.8]}
        label="Curriculum Vitae"
        prompt="Take a copy of the CV"
        exhibit="octahedron"
        onInteract={() => window.open(PROFILE.resume, '_blank', 'noopener')}
      />
      <FloorLamp position={[-7, 0, 5.6]} />
      <pointLight position={[-10.5, 3.5, 8]} intensity={5} distance={8} color={ACCENT} />
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
    </group>
  )
}

function TimelineRail() {
  const start = -2.85
  const gap = 1.9
  return (
    <group position={[9.78, 2.75, -12]} rotation-y={-Math.PI / 2}>
      <Text
        font={FONTS.serif300}
        fontSize={0.24}
        color="#fff3df"
        anchorX="center"
        position={[0, 0.92, 0.035]}
        letterSpacing={0.12}
        maxWidth={5.6}
      >
        TIMELINE
      </Text>
      <mesh position={[0, 0.36, 0.02]}>
        <planeGeometry args={[6.2, 0.025]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </mesh>
      {TIMELINE.map((t, i) => {
        const x = start + i * gap
        return (
          <group key={t.year} position={[x, 0.36, 0.045]}>
            <mesh>
              <circleGeometry args={[0.095, 32]} />
              <meshBasicMaterial color={ACCENT} toneMapped={false} />
            </mesh>
            <mesh position={[0, 0, -0.01]}>
              <circleGeometry args={[0.16, 32]} />
              <meshBasicMaterial color="#1b1d22" />
            </mesh>
            <Text
              font={FONTS.serif500}
              fontSize={0.22}
              color="#ffe2ad"
              anchorX="center"
              anchorY="bottom"
              position={[0, 0.22, 0.035]}
            >
              {t.year}
            </Text>
            <Text
              font={FONTS.sans600}
              fontSize={0.084}
              color="#f4ead9"
              anchorX="center"
              anchorY="top"
              position={[0, -0.22, 0.035]}
              maxWidth={1.15}
              textAlign="center"
              lineHeight={1.2}
            >
              {t.title}
            </Text>
          </group>
        )
      })}
    </group>
  )
}

// ── North gallery: Skills · Journey · Certificates ─────────────────
export function NorthGallery() {
  const materials = useMemo(() => getMaterials(), [])

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

      {/* Large skill wall on the north face, facing the entrance */}
      <Text
        font={FONTS.serif300}
        fontSize={0.28}
        color="#fff3df"
        anchorX="center"
        position={[-2.05, 4.45, -15.78]}
        letterSpacing={0.2}
        maxWidth={12}
      >
        SKILL WALL
      </Text>
      <Text
        font={FONTS.sans400}
        fontSize={0.09}
        color="#d8c7a6"
        anchorX="center"
        position={[-2.05, 4.12, -15.78]}
        letterSpacing={0.18}
        maxWidth={8}
      >
        LANGUAGES · FRONTEND · FRAMEWORKS
      </Text>
      <mesh material={materials.brass} position={[-2.05, 4.02, -15.74]}>
        <boxGeometry args={[12.7, 0.04, 0.04]} />
      </mesh>
      <mesh material={materials.brass} position={[-2.05, 0.62, -15.74]}>
        <boxGeometry args={[12.7, 0.04, 0.04]} />
      </mesh>
      <mesh material={materials.blackMetal} position={[-2.05, 2.35, -15.82]}>
        <boxGeometry args={[13.1, 3.8, 0.04]} />
      </mesh>
      <pointLight position={[-5.9, 3.5, -13.85]} intensity={3.2} distance={7.5} color={ACCENT} />
      <pointLight position={[1.8, 3.5, -13.85]} intensity={3.2} distance={7.5} color={ACCENT} />
      {SKILLS.map((g, i) => (
        <SkillMonolith key={g.id} group={g} position={[-6.3 + i * 4.25, 0, -15.69]} />
      ))}

      {/* Certificates on the west wall */}
      <FloorLamp position={[-8.65, 0, -8.65]} height={2.1} />
      {CERTIFICATES.map((c, i) => (
        <CertFrame
          key={c.id}
          cert={c}
          position={[-9.76, 2.55, -9.9 - i * 2.15]}
          rotationY={Math.PI / 2}
          crooked={i === CERTIFICATES.length - 1}
        />
      ))}

      <TimelineRail />
    </group>
  )
}

// ── The Archive (secret room) ──────────────────────────────────────
export function SecretRoom() {
  const unlocked = useMuseum((s) => s.secretUnlocked)
  const materials = useMemo(() => getMaterials(), [])

  return (
    <group>
      {/* Warm sanctuary light, only meaningful once discovered */}
      <pointLight position={[6, 3.6, -19]} intensity={unlocked ? 9 : 0} distance={9} color={ACCENT} />
      <LightShaft position={[6, 2.4, -19]} height={4.6} topRadius={0.5} bottomRadius={1.7} color={ACCENT} opacity={unlocked ? 0.07 : 0} />

      <TextPanel
        position={[3.15, 3.85, -21.74]}
        heading="The Library"
        body="A quiet hidden room for notes, goals and the ideas behind the work."
        width={5.4}
        headingSize={0.42}
        bodySize={0.11}
      />

      <LibraryShelf position={[3.05, 1.6, -19.2]} rotationY={Math.PI / 2} width={3.2} />
      <LibraryShelf position={[8.95, 1.6, -19.2]} rotationY={-Math.PI / 2} width={3.2} />
      <LibraryShelf position={[6, 1.6, -21.72]} width={4.2} />

      <mesh material={materials.blackMetal} position={[6, 0.42, -18.15]} castShadow>
        <boxGeometry args={[2.8, 0.16, 1.05]} />
      </mesh>
      <mesh material={materials.brass} position={[6, 0.53, -18.15]}>
        <boxGeometry args={[2.9, 0.035, 1.12]} />
      </mesh>
      <Text
        font={FONTS.sans600}
        fontSize={0.12}
        color="#fff1dc"
        anchorX="center"
        position={[6, 0.68, -17.72]}
        rotation-x={-Math.PI / 2}
        maxWidth={2.5}
        textAlign="center"
      >
        {SECRET.favoriteTech.join('  ·  ')}
      </Text>
      <Text
        font={FONTS.sans400}
        fontSize={0.088}
        color="#e3d8c6"
        anchorX="center"
        position={[6, 2.85, -16.22]}
        rotation-y={Math.PI}
        lineHeight={1.55}
        maxWidth={5.6}
        textAlign="center"
      >
        {SECRET.goals.join('\n')}
      </Text>
    </group>
  )
}

// ── Contact room ───────────────────────────────────────────────────
export function ContactRoom() {
  const setModal = useMuseum((s) => s.setModal)
  return (
    <group>
      <TextPanel
        position={[7.05, 3.42, 4.26]}
        heading="Contact"
        body={'For internships, collaborations or project questions.'}
        width={2.55}
        headingSize={0.4}
        bodySize={0.095}
      />
      <mesh position={[11.55, 2.5, 4.23]}>
        <planeGeometry args={[3.65, 1.08]} />
        <meshBasicMaterial color="#111318" />
      </mesh>
      <Text
        font={FONTS.serif500}
        fontSize={0.2}
        color="#fff4e4"
        anchorX="center"
        position={[11.55, 2.76, 4.27]}
        maxWidth={3.25}
        textAlign="center"
      >
        {PROFILE.email}
      </Text>
      <Text
        font={FONTS.sans400}
        fontSize={0.08}
        color="#d8b47e"
        anchorX="center"
        position={[11.55, 2.26, 4.27]}
        letterSpacing={0.1}
        maxWidth={3.2}
        textAlign="center"
      >
        EMAIL · GITHUB · LINKEDIN · RESUME
      </Text>
      <WallCard
        position={[7.3, 1.72, 11.73]}
        rotationY={Math.PI}
        title="EMAIL"
        body="Best for direct messages and internship conversations."
      />
      <WallCard
        position={[10, 1.72, 11.73]}
        rotationY={Math.PI}
        title="CODE"
        body="GitHub holds the projects; LinkedIn holds the professional trail."
        accent="#8fc7ff"
      />
      <WallCard
        position={[12.7, 1.72, 11.73]}
        rotationY={Math.PI}
        title="RESUME"
        body="One click at the terminal opens the current CV."
        accent="#9ee6b8"
      />
      <Pedestal
        position={[10, 0, 8]}
        label="Guestbook Terminal"
        prompt="Leave a message"
        exhibit="torusKnot"
        onInteract={() => setModal({ type: 'contact' })}
      />
      <FloorLamp position={[7.2, 0, 5.55]} />
      <FloorLamp position={[12.8, 0, 5.55]} />
      <pointLight position={[10, 3.7, 8]} intensity={6} distance={9} color={ACCENT} />
      <Text
        font={FONTS.sans400}
        fontSize={0.12}
        color="#f0e7d8"
        anchorX="center"
        position={[13.76, 2.3, 8]}
        rotation-y={-Math.PI / 2}
        lineHeight={2.2}
        letterSpacing={0.08}
        maxWidth={6}
        textAlign="center"
      >
        {PROFILE.socials.map((s) => s.label.toUpperCase()).join('\n')}
      </Text>
    </group>
  )
}
