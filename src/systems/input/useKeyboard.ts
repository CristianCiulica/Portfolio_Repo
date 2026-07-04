import { useEffect } from 'react'

/** Physical-key state, safe across keyboard layouts (uses event.code). */
export const keys: Record<string, boolean> = {}

let listenersAttached = false

export function useKeyboard() {
  useEffect(() => {
    if (listenersAttached) return
    listenersAttached = true
    const down = (e: KeyboardEvent) => {
      keys[e.code] = true
      // Keep the page from scrolling while playing
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault()
      }
    }
    const up = (e: KeyboardEvent) => {
      keys[e.code] = false
    }
    const blur = () => {
      for (const k of Object.keys(keys)) keys[k] = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
  }, [])
}

export const moveForward = () => (keys.KeyW || keys.ArrowUp ? 1 : 0)
export const moveBack = () => (keys.KeyS || keys.ArrowDown ? 1 : 0)
export const moveLeft = () => (keys.KeyA || keys.ArrowLeft ? 1 : 0)
export const moveRight = () => (keys.KeyD || keys.ArrowRight ? 1 : 0)
export const sprinting = () => !!(keys.ShiftLeft || keys.ShiftRight)
export const jumping = () => !!keys.Space
