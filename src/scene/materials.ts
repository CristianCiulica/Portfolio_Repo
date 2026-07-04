import * as THREE from 'three'

/**
 * Procedural textures — the museum ships zero texture binaries.
 * Canvas-generated concrete/plaster with value noise + faint stains.
 */

function valueNoiseCanvas(
  size: number,
  base: number,
  variance: number,
  stains: number,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const g = canvas.getContext('2d')!
  g.fillStyle = `rgb(${base},${base},${base})`
  g.fillRect(0, 0, size, size)

  // Fine grain
  const img = g.getImageData(0, 0, size, size)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * variance
    d[i] += n
    d[i + 1] += n
    d[i + 2] += n
  }
  g.putImageData(img, 0, 0)

  // Broad soft stains
  for (let i = 0; i < stains; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const r = size * (0.08 + Math.random() * 0.22)
    const grad = g.createRadialGradient(x, y, 0, x, y, r)
    const dark = Math.random() > 0.5
    grad.addColorStop(0, dark ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.03)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grad
    g.beginPath()
    g.arc(x, y, r, 0, Math.PI * 2)
    g.fill()
  }
  return canvas
}

function makeTexture(canvas: HTMLCanvasElement, repeat: number): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(repeat, repeat)
  tex.anisotropy = 4
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

let cache: {
  concrete: THREE.MeshStandardMaterial
  plaster: THREE.MeshStandardMaterial
  blackMetal: THREE.MeshStandardMaterial
  brass: THREE.MeshStandardMaterial
  darkFloor: THREE.MeshStandardMaterial
} | null = null

export function getMaterials() {
  if (cache) return cache

  const concreteCanvas = valueNoiseCanvas(512, 132, 14, 26)
  const concreteMap = makeTexture(concreteCanvas, 3)
  const concreteBump = new THREE.CanvasTexture(concreteCanvas)
  concreteBump.wrapS = concreteBump.wrapT = THREE.RepeatWrapping
  concreteBump.repeat.set(3, 3)

  const plasterCanvas = valueNoiseCanvas(512, 208, 6, 4)
  const plasterMap = makeTexture(plasterCanvas, 2)

  cache = {
    concrete: new THREE.MeshStandardMaterial({
      map: concreteMap,
      bumpMap: concreteBump,
      bumpScale: 0.4,
      roughness: 0.94,
      metalness: 0.02,
    }),
    plaster: new THREE.MeshStandardMaterial({
      map: plasterMap,
      roughness: 0.9,
      metalness: 0,
    }),
    blackMetal: new THREE.MeshStandardMaterial({
      color: '#161719',
      roughness: 0.38,
      metalness: 0.85,
    }),
    brass: new THREE.MeshStandardMaterial({
      color: '#8a6f45',
      roughness: 0.3,
      metalness: 0.9,
    }),
    darkFloor: new THREE.MeshStandardMaterial({
      color: '#232426',
      roughness: 0.25,
      metalness: 0.55,
    }),
  }
  return cache
}

export const ACCENT = '#d8b47e'
export const ACCENT_DIM = '#9a7f57'
export const WARM_LIGHT = '#ffd9a8'
export const COOL_FILL = '#8fa3bf'
