import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  defaultViewport: { width: 1280, height: 800 },
})
const page = await browser.newPage()
page.on('response', (r) => {
  if (r.status() >= 400) console.log(r.status(), r.url())
})
await page.goto('http://localhost:5173/Portfolio_Repo/', { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise((r) => setTimeout(r, 4000))
await browser.close()
