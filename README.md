# Cristian Ciulică — A Museum of Work

An explorable **first-person 3D art museum** portfolio. Every room is a skill, every
project is an installation. Built with React, TypeScript, Three.js and React Three Fiber.

**Live:** https://cristianciulica.github.io/Portfolio_Repo/

## Experience

- Cinematic night approach → glass doors part → seamless first-person handoff
- **WASD + mouse look**, sprint, jump, head-bob, inertia, full collision
- Mobile: virtual joystick + look pad, auto quality tiering
- 8 rooms: Lobby · About · Projects Hall · Skills Gallery · The Journey ·
  Certificates · Contact · **one hidden room** (look for something slightly wrong…)
- Projects power on as you approach; click/E opens an in-gallery presentation
- Procedural everything: concrete textures, ambience, footsteps and reverb are all
  generated in code — zero texture/audio binaries shipped
- Accessible **2D wing** with full content parity (reduced motion / no WebGL / screen readers)

## Stack

React 19 · Vite · TypeScript · Three.js · @react-three/fiber · drei ·
postprocessing (Bloom, Vignette) · zustand · GSAP · Framer Motion · WebAudio

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full design: floor-plan-as-data,
custom capsule collision, lighting rig, performance strategy.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173/Portfolio_Repo/
npm run build      # typecheck + production bundle → dist/
node scripts/walkthrough.mjs   # automated headless walkthrough + screenshots (needs Chrome + dev server)
```

## Deploy

Pushing to `main` builds and deploys via GitHub Actions
([.github/workflows/deploy.yml](.github/workflows/deploy.yml)).
One-time setup: repo **Settings → Pages → Source: GitHub Actions**.

The previous static site is preserved in [`legacy/`](legacy/).

---

**Let's build something great.** [GitHub](https://github.com/CristianCiulica) • [LinkedIn](https://www.linkedin.com/in/cristian-ciulic%C4%83-66299038a/) • [Instagram](https://instagram.com/cristian.ciulica)
