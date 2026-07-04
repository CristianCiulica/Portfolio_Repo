/**
 * Automated museum walkthrough: loads the app in headless Chrome,
 * enters the gallery, walks to each room, interacts, and screenshots.
 */
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const OUT = process.env.OUT ?? '/tmp/museum-shots'
fs.mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--use-angle=metal', '--enable-gpu', '--window-size=1280,800', '--hide-scrollbars'],
  defaultViewport: { width: 1280, height: 800 },
})
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('console: ' + m.text())
})

await page.goto('http://localhost:5173/Portfolio_Repo/', { waitUntil: 'networkidle2', timeout: 60000 })
await page.waitForFunction(() => !!window.__useMuseum, { timeout: 30000 })
await new Promise((r) => setTimeout(r, 2500))
await page.screenshot({ path: `${OUT}/01-title.png` })

// Enter the gallery
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Enter the gallery'))
  b?.click()
})
await new Promise((r) => setTimeout(r, 3500))
await page.screenshot({ path: `${OUT}/02-cinematic.png` })

// Wait for play phase
await page.waitForFunction(() => window.__useMuseum.getState().phase === 'play', { timeout: 20000 })
await new Promise((r) => setTimeout(r, 800))
await page.screenshot({ path: `${OUT}/03-lobby-spawn.png` })

// Helper: teleport the player and face a yaw, settle, screenshot
async function shot(name, x, z, yaw, pitch = 0, settleMs = 1700) {
  await page.evaluate(
    ({ x, z, yaw, pitch }) => {
      const p = window.__museum.player
      p.x = x
      p.z = z
      p.vx = p.vz = 0
      p.yaw = yaw
      p.pitch = pitch
      // also snap the controller's smoothing target by dispatching a custom event
      window.dispatchEvent(new CustomEvent('museum:snap-look', { detail: { yaw, pitch } }))
    },
    { x, z, yaw, pitch },
  )
  await new Promise((r) => setTimeout(r, settleMs))
  await page.screenshot({ path: `${OUT}/${name}.png` })
}

// Walk forward with real keys through the lobby (tests movement + collision)
await page.keyboard.down('KeyW')
await new Promise((r) => setTimeout(r, 2500))
await page.keyboard.up('KeyW')
await page.screenshot({ path: `${OUT}/04-walked-forward.png` })
const posAfterWalk = await page.evaluate(() => {
  const p = window.__museum.player
  return { x: +p.x.toFixed(2), z: +p.z.toFixed(2) }
})

// Rooms tour
await shot('05-projects-hall', 0, 1.5, 0)
await shot('06-project-screen-close', -5, -4.8, 0) // in front of first screen
const focusedAtScreen = await page.evaluate(() => window.__useMuseum.getState().focused)
// Open the project modal via E
await page.keyboard.press('KeyE')
await new Promise((r) => setTimeout(r, 1200))
await page.screenshot({ path: `${OUT}/07-project-modal.png` })
const modalOpen = await page.evaluate(() => window.__useMuseum.getState().modal)
await page.keyboard.press('Escape')
await new Promise((r) => setTimeout(r, 600))

await shot('08-skills', -10, -9.2, Math.PI, 0) // looking south? monoliths at z=-13 → face -z = yaw 0
await shot('08b-skills-face', -10, -10.2, 0)
await shot('09-experience', 0, -9.5, 0)
await shot('10-certificates', 10, -12, 0)
await shot('11-about', -7, 8, Math.PI / 2)
await shot('12-contact', 8, 8, -Math.PI / 2)
await shot('13-lobby-back', 0, 12, Math.PI)

// Secret: face the crooked frame (last certificate, x=12.6), straighten it
await shot('13b-at-crooked-frame', 12.6, -14.1, 0, 0.15, 1200)
const promptAtCert = await page.evaluate(() => window.__useMuseum.getState().focused)
await page.keyboard.press('KeyE')
await new Promise((r) => setTimeout(r, 1800))
await page.screenshot({ path: `${OUT}/13c-straightened.png` })
const secret = await page.evaluate(() => window.__useMuseum.getState().secretUnlocked)
await shot('14-secret-door-open', 0, -12.5, 0, 0, 3500)
await shot('15-archive', 0, -17.4, 0, 0)

// 2D gallery parity
await page.evaluate(() => {
  window.__useMuseum.getState().setModal(null)
  window.__useMuseum.getState().setPhase('gallery2d')
})
await new Promise((r) => setTimeout(r, 1200))
await page.screenshot({ path: `${OUT}/16-gallery2d.png` })
const g2dSections = await page.evaluate(() => document.querySelectorAll('.g2d section').length)

console.log(
  JSON.stringify(
    { posAfterWalk, focusedAtScreen, modalOpen, promptAtCert, secret, g2dSections, errors },
    null,
    2,
  ),
)
await browser.close()
