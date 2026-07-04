/**
 * Kinematic collision: the player is a vertical capsule, the world is a list
 * of axis-aligned boxes (derived from the floor plan). We resolve on the XZ
 * plane by pushing the player out along the axis of least penetration.
 */

export interface BoxCollider {
  id: string
  minX: number
  maxX: number
  minZ: number
  maxZ: number
  enabled: boolean
}

const boxes = new Map<string, BoxCollider>()
let counter = 0

export function addCollider(
  minX: number,
  maxX: number,
  minZ: number,
  maxZ: number,
  id?: string,
): string {
  const key = id ?? `box-${counter++}`
  boxes.set(key, { id: key, minX, maxX, minZ, maxZ, enabled: true })
  return key
}

export function removeCollider(id: string) {
  boxes.delete(id)
}

export function setColliderEnabled(id: string, enabled: boolean) {
  const b = boxes.get(id)
  if (b) b.enabled = enabled
}

/**
 * Push a circle (player capsule cross-section) out of every enabled box.
 * Two passes so corner cases (literally) settle.
 */
export function resolveCircle(pos: { x: number; z: number }, radius: number) {
  for (let pass = 0; pass < 2; pass++) {
    for (const b of boxes.values()) {
      if (!b.enabled) continue
      const minX = b.minX - radius
      const maxX = b.maxX + radius
      const minZ = b.minZ - radius
      const maxZ = b.maxZ + radius
      if (pos.x <= minX || pos.x >= maxX || pos.z <= minZ || pos.z >= maxZ) continue
      const pushLeft = pos.x - minX
      const pushRight = maxX - pos.x
      const pushBack = pos.z - minZ
      const pushFront = maxZ - pos.z
      const min = Math.min(pushLeft, pushRight, pushBack, pushFront)
      if (min === pushLeft) pos.x = minX
      else if (min === pushRight) pos.x = maxX
      else if (min === pushBack) pos.z = minZ
      else pos.z = maxZ
    }
  }
}
