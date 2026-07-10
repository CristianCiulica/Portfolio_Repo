import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useTexture, RoundedBox } from '@react-three/drei'
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
              <RoundedBox key={i} position={[x, y - 0.04 + bookH / 2, 0.18]} args={[bookW, bookH, 0.16]} radius={0.012} smoothness={4}>
                <meshStandardMaterial color={bookColors[(i + shelfIndex) % bookColors.length]} roughness={0.72} metalness={0.04} />
              </RoundedBox>
            )
          })}
        </group>
      ))}
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
function WallpaperWall({
  position,
  rotationY,
}: {
  position: [number, number, number]
  rotationY: number
}) {
  const texture = useTexture('/Portfolio_Repo/Images/wallpaper.jpg')
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 2)
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[8, 5.2]} />
        <meshStandardMaterial map={texture} roughness={0.8} />
      </mesh>
      <spotLight position={[0, 4, 3]} angle={1.2} penumbra={1} intensity={15} distance={10} color="#ffd4a3">
        <object3D attach="target" position={[0, 0, 0]} />
      </spotLight>
    </group>
  )
}

export function AboutRoom() {
  return (
    <group>
      <WallpaperWall position={[-13.85, 2.6, 8]} rotationY={Math.PI / 2} />
      
      {/* About text on the right wall */}
      <TextPanel
        position={[-9.8, 2.8, 4.26]}
        align="center"
        heading="About"
        body={'Computer Science student building practical systems: game AI, dashboards, compilers and this 3D portfolio museum.'}
        width={5}
        headingSize={0.3}
        bodySize={0.12}
      />
      {/* Targeted spot light for the About text on the right wall */}
      <spotLight position={[-9.8, 4.5, 7]} angle={0.8} penumbra={0.7} intensity={25} distance={12} color="#fff1e0">
        <object3D attach="target" position={[-9.8, 2.8, 4.26]} />
      </spotLight>

      {/* WallCards on the Left Wall */}
      <WallCard
        position={[-8.2, 2.4, 11.74]}
        rotationY={Math.PI}
        title="AI"
        body="Game trees, heuristics, machine learning and image-based experiments."
        accent="#8fc7ff"
        width={1.7}
      />
      <WallCard
        position={[-11.2, 2.4, 11.74]}
        rotationY={Math.PI}
        title="SYSTEMS"
        body="C++ foundations, data structures and careful problem solving."
        width={1.7}
      />
      <WallCard
        position={[-8.2, 0.8, 11.74]}
        rotationY={Math.PI}
        title="PROJECTS"
        body="Frontend interfaces, dashboards and projects that explain themselves."
        accent="#9ee6b8"
        width={1.7}
      />
      <WallCard
        position={[-11.2, 0.8, 11.74]}
        rotationY={Math.PI}
        title="EXPERIENCE"
        body="Computer Science student building practical systems and architectures."
        width={1.7}
      />

      {/* Center exhibit */}
      <Pedestal
        position={[-10, 0, 8]}
        label="Curriculum Vitae"
        prompt="Take a copy of the CV"
        exhibit="cv"
        onInteract={() => window.open(PROFILE.resume, '_blank', 'noopener')}
      />
      
      <FloorLamp position={[-7, 0, 5.6]} />
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

// ── Library Helper Components ────────────────────────────────────────
function Wainscoting({ width, depth, position }: { width: number; depth: number; position: [number, number, number] }) {
  const materials = useMemo(() => getMaterials(), [])
  const thickness = 0.1
  return (
    <group position={position}>
      {/* Back wall */}
      <mesh material={materials.blackMetal} position={[0, 0.6, -depth / 2]}>
        <boxGeometry args={[width, 1.2, thickness]} />
      </mesh>
      <mesh material={materials.brass} position={[0, 1.2, -depth / 2]}>
        <boxGeometry args={[width, 0.04, thickness + 0.02]} />
      </mesh>
      
      {/* Left wall */}
      <mesh material={materials.blackMetal} position={[-width / 2, 0.6, 0]}>
        <boxGeometry args={[thickness, 1.2, depth]} />
      </mesh>
      <mesh material={materials.brass} position={[-width / 2, 1.2, 0]}>
        <boxGeometry args={[thickness + 0.02, 0.04, depth]} />
      </mesh>

      {/* Right wall */}
      <mesh material={materials.blackMetal} position={[width / 2, 0.6, 0]}>
        <boxGeometry args={[thickness, 1.2, depth]} />
      </mesh>
      <mesh material={materials.brass} position={[width / 2, 1.2, 0]}>
        <boxGeometry args={[thickness + 0.02, 0.04, depth]} />
      </mesh>
    </group>
  )
}

function Chandelier({ position }: { position: [number, number, number] }) {
  const materials = useMemo(() => getMaterials(), [])
  return (
    <group position={position}>
      <mesh material={materials.brass} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1]} />
      </mesh>
      <mesh material={materials.brass} position={[0, -0.5, 0]}>
        <torusGeometry args={[0.4, 0.02, 16, 64]} rotation-x={Math.PI / 2} />
      </mesh>
      <pointLight position={[0, -0.5, 0]} intensity={15} distance={10} color="#ffdfb0" />
    </group>
  )
}

function PersianRug({ position, width, depth }: { position: [number, number, number]; width: number; depth: number }) {
  return (
    <mesh position={position} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial color="#6a2222" roughness={0.9} />
    </mesh>
  )
}

function LeatherArmchair({ position, rotationY }: { position: [number, number, number]; rotationY: number }) {
  const Leather = () => <meshStandardMaterial color="#382110" roughness={0.6} metalness={0.1} />
  const Wood = () => <meshStandardMaterial color="#1a110a" roughness={0.8} />
  return (
    <group position={position} rotation-y={rotationY}>
      {/* Seat Cushion */}
      <RoundedBox args={[0.8, 0.2, 0.7]} radius={0.05} smoothness={4} position={[0, 0.4, 0]}>
        <Leather />
      </RoundedBox>
      {/* Backrest */}
      <RoundedBox args={[0.8, 0.6, 0.2]} radius={0.05} smoothness={4} position={[0, 0.8, -0.25]} rotation-x={-0.15}>
        <Leather />
      </RoundedBox>
      {/* Armrests */}
      <RoundedBox args={[0.15, 0.15, 0.7]} radius={0.05} smoothness={4} position={[-0.45, 0.6, 0]}>
        <Leather />
      </RoundedBox>
      <RoundedBox args={[0.15, 0.15, 0.7]} radius={0.05} smoothness={4} position={[0.45, 0.6, 0]}>
        <Leather />
      </RoundedBox>
      {/* Armrest Supports */}
      <mesh position={[-0.45, 0.45, 0]}>
        <boxGeometry args={[0.1, 0.15, 0.5]} />
        <Wood />
      </mesh>
      <mesh position={[0.45, 0.45, 0]}>
        <boxGeometry args={[0.1, 0.15, 0.5]} />
        <Wood />
      </mesh>
      {/* Legs */}
      {[[-0.35, -0.25], [0.35, -0.25], [-0.35, 0.25], [0.35, 0.25]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.15, z]}>
          <cylinderGeometry args={[0.02, 0.01, 0.3]} />
          <Wood />
        </mesh>
      ))}
    </group>
  )
}

function TallPlant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Planter */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.3, 0.2, 0.5, 32]} />
        <meshStandardMaterial color="#e5e5e5" roughness={0.9} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.505, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.01, 32]} />
        <meshStandardMaterial color="#1a120b" roughness={1} />
      </mesh>
      
      {/* Main Trunk */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 1.0, 8]} />
        <meshStandardMaterial color="#4a3b2c" roughness={0.9} />
      </mesh>
      {/* Branch 1 */}
      <mesh position={[0.1, 1.2, 0.1]} rotation-z={-0.3} rotation-x={0.2}>
        <cylinderGeometry args={[0.015, 0.025, 0.6, 8]} />
        <meshStandardMaterial color="#4a3b2c" roughness={0.9} />
      </mesh>
      {/* Branch 2 */}
      <mesh position={[-0.1, 1.0, -0.1]} rotation-z={0.4} rotation-x={-0.2}>
        <cylinderGeometry args={[0.015, 0.025, 0.5, 8]} />
        <meshStandardMaterial color="#4a3b2c" roughness={0.9} />
      </mesh>

      {/* Foliage Clusters */}
      <group position={[0, 1.4, 0]}>
        <mesh>
          <dodecahedronGeometry args={[0.35, 1]} />
          <meshStandardMaterial color="#2d4c2b" roughness={0.8} />
        </mesh>
      </group>
      <group position={[0.25, 1.5, 0.25]}>
        <mesh>
          <dodecahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial color="#355733" roughness={0.8} />
        </mesh>
      </group>
      <group position={[-0.25, 1.25, -0.2]}>
        <mesh>
          <dodecahedronGeometry args={[0.25, 1]} />
          <meshStandardMaterial color="#254223" roughness={0.8} />
        </mesh>
      </group>
      <group position={[0.1, 1.1, -0.3]}>
        <mesh>
          <dodecahedronGeometry args={[0.2, 1]} />
          <meshStandardMaterial color="#2d4c2b" roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}

// ── The Archive (secret room) ──────────────────────────────────────
export function SecretRoom() {
  const unlocked = useMuseum((s) => s.secretUnlocked)
  
  return (
    <group>
      {/* Warm sanctuary light */}
      <pointLight position={[6, 3.6, -19]} intensity={unlocked ? 9 : 0} distance={9} color="#ffb86c" />

      {/* Architectural Elements */}
      <Wainscoting width={8} depth={6} position={[6, 0, -19]} />
      <Chandelier position={[6, 4.4, -19]} />

      {/* Cozy Rug */}
      <PersianRug position={[6, 0.01, -19]} width={5.6} depth={3.8} />

      {/* Central Pedestal & Platform */}
      <mesh position={[6, 0.02, -19]}>
        <cylinderGeometry args={[1.5, 1.55, 0.1, 32]} />
        <meshStandardMaterial color="#3a1e12" roughness={0.8} />
      </mesh>
      <Pedestal 
        position={[6, 0.07, -19]} 
        exhibit="book" 
        label="The Architect's Journal"
        prompt="Read the Journal"
        onInteract={() => window.open(PROFILE.resume, '_blank', 'noopener')}
      />

      {/* Reading Nook (Armchair facing exhibit, table removed) */}
      <LeatherArmchair position={[2.8, 0, -17.5]} rotationY={Math.atan2(3.2, -1.5)} />
      <FloorLamp position={[2.2, 0, -17.5]} />

      {/* Tall Plant */}
      <TallPlant position={[9.2, 0, -21.2]} />

      {/* Shelves */}
      <LibraryShelf position={[2.2, 1.25, -19.6]} rotationY={Math.PI / 2} width={3.2} />
      <LibraryShelf position={[9.8, 1.25, -19.6]} rotationY={-Math.PI / 2} width={3.2} />
      <LibraryShelf position={[6, 1.25, -21.72]} width={4.2} />
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
      
      {/* Front wall as you enter (East wing back wall) */}
      <WallpaperWall position={[13.85, 2.6, 8]} rotationY={-Math.PI / 2} />
    </group>
  )
}
