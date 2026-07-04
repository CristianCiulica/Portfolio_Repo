/**
 * Proximity + facing based interaction system.
 * Installations register themselves; the player controller finds the best
 * candidate each frame and surfaces a prompt in the HUD. "E", click (desktop)
 * or the TAP button (touch) triggers it.
 */

export interface Interactable {
  id: string
  x: number
  y: number
  z: number
  radius: number
  prompt: string
  onInteract: () => void
  /** Called with 0..1 proximity factor every frame while player is near. */
  onProximity?: (t: number) => void
}

const registry = new Map<string, Interactable>()

export function registerInteractable(item: Interactable): () => void {
  registry.set(item.id, item)
  return () => registry.delete(item.id)
}

export function getInteractable(id: string) {
  return registry.get(id)
}

/**
 * Find the interactable the player is near and roughly facing.
 * fwdX/fwdZ is the camera forward on the XZ plane.
 */
export function findFocused(
  px: number,
  pz: number,
  fwdX: number,
  fwdZ: number,
): Interactable | null {
  let best: Interactable | null = null
  let bestScore = -Infinity
  for (const item of registry.values()) {
    const dx = item.x - px
    const dz = item.z - pz
    const dist = Math.hypot(dx, dz)
    // proximity callbacks fire in a generous bubble
    if (item.onProximity) {
      const t = 1 - Math.min(1, Math.max(0, (dist - item.radius) / (item.radius * 1.2)))
      item.onProximity(t)
    }
    if (dist > item.radius || dist < 0.001) continue
    const facing = (dx / dist) * fwdX + (dz / dist) * fwdZ
    if (facing < 0.35) continue
    const score = facing * 2 - dist / item.radius
    if (score > bestScore) {
      bestScore = score
      best = item
    }
  }
  return best
}
