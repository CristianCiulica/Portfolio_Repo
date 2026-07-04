# MUSEUM — Cristian Ciulică, Interactive Portfolio

A first-person explorable 3D art museum. Every room is a skill, every project is an installation.

---

## 1. Overall Architecture

```
┌──────────────────────────────────────────────────────────────┐
│ index.html  (SEO shell: metadata, OG, JSON-LD, noscript)     │
└──────────────────────────────────────────────────────────────┘
                │
┌──────────────▼───────────────────────────────────────────────┐
│ App.tsx                                                      │
│  ├─ <Experience/>  R3F <Canvas>                              │
│  │    ├─ Systems: PlayerController, Colliders, AudioEngine   │
│  │    ├─ Scene:   Museum (rooms, installations, FX)          │
│  │    └─ Effects: Bloom, Vignette, (DOF on desktop)          │
│  └─ UI layer (DOM, Framer Motion)                            │
│       ├─ IntroOverlay   (title, "Enter" / "Skip intro")      │
│       ├─ HUD            (crosshair, prompts, controls hint)  │
│       ├─ ProjectModal   (immersive in-gallery presentation)  │
│       ├─ SettingsPanel  (sensitivity, quality, motion, mute) │
│       ├─ TouchControls  (virtual joystick + look pad)        │
│       └─ Gallery2D      (accessible / reduced-motion mode)   │
└──────────────────────────────────────────────────────────────┘
State: zustand store (game phase, player, unlocks, settings, audio).
Content: single typed data file `src/config/content.ts` — the museum
is *generated* from data; adding a project adds an installation.
```

**Key decisions**
- **Custom kinematic collision** (capsule vs. AABB wall list derived from the floor-plan data) instead of a physics engine — deterministic, zero-dependency, ~0 ms budget, no tunneling at museum scale.
- **Floor-plan-as-data**: `src/scene/layout.ts` defines rooms, walls and door openings once; wall meshes, colliders, light fixtures and the minimap all derive from it. No drift between visuals and physics.
- **Procedural materials & audio**: concrete/plaster textures are canvas-generated, footsteps/ambience are WebAudio-synthesized. Zero binary assets to download → instant load, no CDN risk.
- **Two render tiers** (desktop / mobile) selected at boot + a full 2D DOM gallery for reduced-motion, no-WebGL and screen-reader users.

## 2. Folder Structure

```
src/
  main.tsx  App.tsx
  config/content.ts          ← all portfolio data (projects, skills…)
  state/store.ts             ← zustand: phase, settings, unlocks
  systems/
    input/useKeyboard.ts     ← WASD/space/shift, remap-safe (event.code)
    input/TouchControls.tsx  ← virtual joystick + drag-look
    player/PlayerController.tsx ← movement, inertia, jump, head-bob, collision
    physics/colliders.ts     ← AABB list built from layout, capsule resolver
    audio/engine.ts          ← WebAudio graph: ambience, footsteps, UI, reverb
  scene/
    layout.ts                ← floor plan: rooms, walls, doorways, spot rails
    materials.ts             ← procedural concrete, glass, black metal
    Museum.tsx               ← assembles everything from layout + content
    Lighting.tsx  Effects.tsx
    fx/Dust.tsx  fx/LightShaft.tsx
    installations/
      ProjectScreen.tsx      ← emissive framed screen + spotlight + prompt
      CertFrame.tsx  SkillMonolith.tsx  Pedestal.tsx  InfoPanel.tsx
    rooms/ (Exterior, Lobby, About, ProjectsHall, Skills, Experience,
            Certificates, Contact, SecretRoom)
  ui/ (IntroOverlay, Hud, ProjectModal, SettingsPanel, Gallery2D, …)
```

## 3. User Flow

```
Load → SEO shell → boot screen (progress)
  → EXTERIOR NIGHT: cinematic dolly toward the museum, name typography
  → "ENTER THE GALLERY" / "Skip intro" / "View 2D version"
  → doors slide open, camera hands off to first person (pointer lock)
  → LOBBY (orientation: floor text hints, controls card)
      ├─ ABOUT wing            (portrait installation, bio wall)
      ├─ PROJECTS HALL         (6 installations, each lit + interactive)
      │     click → ProjectModal (title, tech, description, GitHub, Live)
      ├─ SKILLS GALLERY        (monoliths with animated proficiency light)
      ├─ EXPERIENCE ROOM       (timeline wall)
      ├─ CERTIFICATES WALL     (diplomas as framed art)
      ├─ CONTACT ROOM          (form terminal + socials)
      └─ SECRET ROOM           (hidden — see §Easter egg)
Esc → pause/settings at any time. "M" minimap. "F" interact fallback.
```

## 4. Scene Graph

```
<Canvas shadows dpr=[1,2]>
 ├─ <PlayerRig> (camera + capsule + footstep emitter)
 ├─ <Museum>
 │   ├─ <Shell>          walls/floors/ceiling from layout (merged geometry)
 │   ├─ <ReflectiveFloor> MeshReflectorMaterial (desktop tier)
 │   ├─ <Rooms×9>        each lazy-mounts contents when player is near
 │   ├─ <Doors>          auto-sliding via proximity sensors
 │   └─ <Fx>             instanced dust, shaft cones, flicker candles
 ├─ <Lighting>           see §6
 └─ <EffectComposer>     Bloom, Vignette, ToneMapping (ACES)
```

## 5. Camera System

- **Intro**: GSAP timeline drives a dolly path (position + lookAt targets), ease `power2.inOut`; ends exactly at the FP spawn pose → seamless handoff.
- **First person**: pointer-lock yaw/pitch with exponential smoothing (sensitivity user-set 0.2–2.0), pitch clamp ±85°.
- **Feel**: acceleration 40 u/s², friction 10/s, sprint ×1.8; head-bob = dual sine (vertical + lateral) scaled by ground speed, disabled by Reduced Motion; landing dip on jump; idle sway 0.15°.
- **Mobile**: left virtual stick = move, right half of screen = look drag; no pointer lock needed.

## 6. Lighting System

- Base: very low ambient (0.08) + cool HDRI-like hemisphere for fill.
- **Museum spots**: per-installation `SpotLight` (warm 3200K, penumbra 0.6) mounted on ceiling rails from layout data — only the nearest N cast shadows (shadow budget: 3 desktop / 1 mobile).
- Warm strip “cove” lighting: emissive geometry + bloom (reads as area light without the cost).
- God rays: skylight shaft in the lobby via additive soft cone mesh + dust.
- Exterior: moonlight directional + façade uplights for the intro.

## 7. Asset List (all generated or already in repo)

| Asset | Source |
|---|---|
| 6 project screenshots | `Images/projects/*` (reused as screen textures) |
| 3 diplomas | `Images/Courses/*` (framed art) |
| Profile portrait | `Images/Profile/profile.jpg` |
| Concrete / plaster / metal textures | canvas-procedural at boot |
| Fonts | Inter var (UI) + drei `<Text>` SDF |
| Audio (ambience, footsteps, UI, hum) | WebAudio synthesis (zero files) |
| Resume PDF | `Resume/…` (linked from About + 2D gallery) |

## 8. Animation Plan

- GSAP: intro dolly, door slides, secret-wall reveal, project-screen power-on (scanline scale + emissive ramp).
- Framer Motion: all DOM (intro type-on, modal spring, HUD prompts).
- R3F `useFrame`: head-bob, pedestal rotation, dust drift, proximity glow, screen flicker, hologram float.
- Proximity system: each installation registers a trigger radius; entering fires `activate` (lights up, sound cue), leaving powers down.

## 9. Performance Strategy

- Merged static geometry for the shell (1 draw call per material).
- Instancing: dust (1 draw call), frames, rail fixtures.
- Room-level lazy mounting + distance culling (`visible` toggling — no per-frame allocation).
- Shadow budget with nearest-N shadow map assignment; all other lights unshadowed.
- `dpr` clamp 1–2, dynamic resolution drop if frame time > 22 ms for 60 frames.
- Textures: screenshots downscaled to ≤1024, mipmapped, anisotropy 4.
- No per-frame `new` in hot paths (scratch vectors module-level).
- Postprocessing tiering: mobile = Bloom only; desktop = Bloom + Vignette (+DOF optional in settings).

## 10. Mobile Strategy

- Boot-time tier detection (UA + `maxTextureSize` + devicePixelRatio).
- Mobile tier: no reflector floor (dark gloss envMap instead), 1 shadow light, half-res bloom, dust count /4, DPR cap 1.5.
- Touch UI: joystick (left), look-drag (right), context "TAP" interact button replaces crosshair-click.
- Landscape hint; portrait works but suggests rotating.
- `Gallery2D` one tap away — full content parity, semantic HTML.

## Easter egg — Secret Room

In the Certificates wing one frame hangs **slightly crooked**. Interacting with
it straightens it, plays a stone-slide sound, and a wall panel in the
Experience room recedes, revealing the **Archive**: developer timeline,
fun facts, favorite tech shrine, and future-goals star wall.
