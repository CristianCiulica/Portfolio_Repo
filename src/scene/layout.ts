/**
 * The museum floor plan, defined once as data.
 * Wall meshes, colliders, doorway lintels and the minimap all derive from this.
 * Units are meters. y is up. The visitor enters walking toward -z.
 */

export const WALL_H = 5.2
export const WALL_T = 0.3
export const DOOR_H = 3.0

export interface WallRun {
  /** 'x' walls run along the x axis (fixed z); 'z' walls run along z (fixed x). */
  axis: 'x' | 'z'
  fixed: number
  from: number
  to: number
  /** Intervals along the run that are doorway openings. */
  openings?: [number, number][]
}

export const WALLS: WallRun[] = [
  // ── Facade & lobby ─────────────────────────────────────────────
  { axis: 'x', fixed: 16, from: -6, to: 6, openings: [[-1.7, 1.7]] }, // entrance
  { axis: 'z', fixed: -6, from: 4, to: 16, openings: [[6.7, 9.3]] }, // lobby → about
  { axis: 'z', fixed: 6, from: 4, to: 16, openings: [[6.7, 9.3]] }, // lobby → contact
  // ── About (west wing) & Contact (east wing) ────────────────────
  { axis: 'x', fixed: 12, from: -14, to: -6 },
  { axis: 'x', fixed: 12, from: 6, to: 14 },
  { axis: 'z', fixed: -14, from: 4, to: 12 },
  { axis: 'z', fixed: 14, from: 4, to: 12 },
  // ── Projects hall ──────────────────────────────────────────────
  { axis: 'x', fixed: 4, from: -15, to: 15, openings: [[-2.2, 2.2]] }, // lobby → hall
  { axis: 'z', fixed: -15, from: -8, to: 4 },
  { axis: 'z', fixed: 15, from: -8, to: 4 },
  {
    axis: 'x',
    fixed: -8,
    from: -15,
    to: 15,
    openings: [
      [-11.5, -8.5], // → skills
      [-1.5, 1.5], // → experience
      [8.5, 11.5], // → certificates
    ],
  },
  // ── North wing: Skills / Experience / Certificates ─────────────
  { axis: 'z', fixed: -15, from: -16, to: -8 },
  { axis: 'z', fixed: -5, from: -16, to: -8 },
  { axis: 'x', fixed: -16, from: -15, to: -5 },
  { axis: 'z', fixed: -4, from: -16, to: -8 },
  { axis: 'z', fixed: 4, from: -16, to: -8 },
  { axis: 'x', fixed: -16, from: -4, to: 4, openings: [[-1.3, 1.3]] }, // secret panel
  { axis: 'z', fixed: 5, from: -16, to: -8 },
  { axis: 'z', fixed: 15, from: -16, to: -8 },
  { axis: 'x', fixed: -16, from: 5, to: 15 },
  // ── Secret room ────────────────────────────────────────────────
  { axis: 'z', fixed: -4, from: -22, to: -16 },
  { axis: 'z', fixed: 4, from: -22, to: -16 },
  { axis: 'x', fixed: -22, from: -4, to: 4 },
]

export interface Segment {
  cx: number
  cy: number
  cz: number
  sx: number
  sy: number
  sz: number
  collider: boolean
}

/** Expand wall runs into box segments, with lintels above doorways. */
export function buildSegments(): Segment[] {
  const segs: Segment[] = []
  for (const w of WALLS) {
    const spans: { from: number; to: number; y: number; h: number; collider: boolean }[] = []
    const openings = [...(w.openings ?? [])].sort((a, b) => a[0] - b[0])
    let cursor = w.from
    for (const [a, b] of openings) {
      if (a > cursor) spans.push({ from: cursor, to: a, y: 0, h: WALL_H, collider: true })
      spans.push({ from: a, to: b, y: DOOR_H, h: WALL_H - DOOR_H, collider: false }) // lintel
      cursor = b
    }
    if (cursor < w.to) spans.push({ from: cursor, to: w.to, y: 0, h: WALL_H, collider: true })

    for (const s of spans) {
      const len = s.to - s.from
      const mid = (s.from + s.to) / 2
      segs.push(
        w.axis === 'x'
          ? { cx: mid, cy: s.y + s.h / 2, cz: w.fixed, sx: len, sy: s.h, sz: WALL_T, collider: s.collider }
          : { cx: w.fixed, cy: s.y + s.h / 2, cz: mid, sx: WALL_T, sy: s.h, sz: len, collider: s.collider },
      )
    }
  }
  return segs
}

export interface RoomDef {
  id: string
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export const ROOMS: RoomDef[] = [
  { id: 'lobby', minX: -6, maxX: 6, minZ: 4, maxZ: 16 },
  { id: 'about', minX: -14, maxX: -6, minZ: 4, maxZ: 12 },
  { id: 'contact', minX: 6, maxX: 14, minZ: 4, maxZ: 12 },
  { id: 'hall', minX: -15, maxX: 15, minZ: -8, maxZ: 4 },
  { id: 'skills', minX: -15, maxX: -5, minZ: -16, maxZ: -8 },
  { id: 'experience', minX: -4, maxX: 4, minZ: -16, maxZ: -8 },
  { id: 'certificates', minX: 5, maxX: 15, minZ: -16, maxZ: -8 },
  { id: 'secret', minX: -4, maxX: 4, minZ: -22, maxZ: -16 },
]

export function roomAt(x: number, z: number): string {
  for (const r of ROOMS) {
    if (x >= r.minX && x <= r.maxX && z >= r.minZ && z <= r.maxZ) return r.id
  }
  return 'exterior'
}

/** Interior floor footprint (also used for the reflective slab). */
export const INTERIOR = { minX: -15, maxX: 15, minZ: -22, maxZ: 16 }

export const SPAWN = { x: 0, y: 0, z: 13.2, yaw: 0 } // yaw 0 faces -z

export const DOORS = [
  { id: 'door-skills', x: -10, z: -8, axis: 'x' as const, width: 3 },
  { id: 'door-experience', x: 0, z: -8, axis: 'x' as const, width: 3 },
  { id: 'door-certificates', x: 10, z: -8, axis: 'x' as const, width: 3 },
]
