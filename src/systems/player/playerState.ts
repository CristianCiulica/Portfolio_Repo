/**
 * Mutable, render-loop-friendly player state shared across systems without
 * triggering React re-renders. The zustand store holds UI-relevant state;
 * this holds the 60fps-hot values.
 */

export const playerState = {
  x: 0,
  y: 0, // feet height above floor
  z: 30,
  yaw: 0,
  pitch: 0,
  vx: 0,
  vy: 0,
  vz: 0,
  speed: 0, // horizontal ground speed (for bob/steps)
  grounded: true,
}

/** Touch input written by the virtual joystick / look pad. */
export const touchInput = {
  moveX: 0, // -1..1
  moveY: 0, // -1..1 (forward positive)
  lookDX: 0, // accumulated pixels since last frame
  lookDY: 0,
  sprint: false,
  jump: false,
}

export const EYE_HEIGHT = 1.7
export const PLAYER_RADIUS = 0.35
