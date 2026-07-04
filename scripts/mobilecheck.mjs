import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const OUT = process.env.OUT ?? '/tmp/museum-shots'
fs.mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
})
const page = await browser.newPage()
await page.emulate({
  viewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
})
const errors = []
page.on('pageerror', (e) => errors.push(e.message))

await page.goto('http://localhost:5173/Portfolio_Repo/', { waitUntil: 'networkidle2', timeout: 60000 })
await page.waitForFunction(() => !!window.__useMuseum, { timeout: 30000 })
await new Promise((r) => setTimeout(r, 2000))
await page.screenshot({ path: `${OUT}/m1-title.png` })

await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Enter the gallery'))
  b?.click()
})
await page.waitForFunction(() => window.__useMuseum.getState().phase === 'play', { timeout: 25000 })
await new Promise((r) => setTimeout(r, 1500))
await page.screenshot({ path: `${OUT}/m2-play.png` })

const state = await page.evaluate(() => ({
  joystick: !!document.querySelector('.joystick'),
  lookpad: !!document.querySelector('.lookpad'),
  buttons: [...document.querySelectorAll('.touch__btn')].map((b) => b.textContent),
  quality: window.__useMuseum.getState().settings.quality,
}))
console.log(JSON.stringify({ state, errors }, null, 2))
await browser.close()
