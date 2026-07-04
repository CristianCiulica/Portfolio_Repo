import { create } from 'zustand'

export type Phase = 'boot' | 'title' | 'cinematic' | 'play' | 'gallery2d'

export type Modal =
  | { type: 'project'; id: string }
  | { type: 'cert'; id: string }
  | { type: 'skills'; id: string }
  | { type: 'archive' }
  | { type: 'contact' }
  | { type: 'trophy' }
  | null

export interface Settings {
  sensitivity: number
  headBob: boolean
  reducedMotion: boolean
  muted: boolean
  quality: 'high' | 'low'
}

export const isTouchDevice =
  typeof window !== 'undefined' &&
  (navigator.maxTouchPoints > 1 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface MuseumStore {
  phase: Phase
  setPhase: (p: Phase) => void
  paused: boolean
  setPaused: (p: boolean) => void
  modal: Modal
  setModal: (m: Modal) => void
  focused: { id: string; prompt: string } | null
  setFocused: (f: { id: string; prompt: string } | null) => void
  secretUnlocked: boolean
  unlockSecret: () => void
  toast: string | null
  setToast: (t: string | null) => void
  currentRoom: string
  setCurrentRoom: (r: string) => void
  minimap: boolean
  toggleMinimap: () => void
  pointerLocked: boolean
  setPointerLocked: (v: boolean) => void
  settings: Settings
  updateSettings: (s: Partial<Settings>) => void
}

export const useMuseum = create<MuseumStore>((set) => ({
  phase: 'boot',
  setPhase: (phase) => set({ phase }),
  paused: false,
  setPaused: (paused) => set({ paused }),
  modal: null,
  setModal: (modal) => set({ modal }),
  focused: null,
  setFocused: (focused) => set({ focused }),
  secretUnlocked: false,
  unlockSecret: () => set({ secretUnlocked: true }),
  toast: null,
  setToast: (toast) => set({ toast }),
  currentRoom: 'exterior',
  setCurrentRoom: (currentRoom) => set({ currentRoom }),
  minimap: true,
  toggleMinimap: () => set((s) => ({ minimap: !s.minimap })),
  pointerLocked: false,
  setPointerLocked: (pointerLocked) => set({ pointerLocked }),
  settings: {
    sensitivity: 1,
    headBob: !prefersReducedMotion,
    reducedMotion: prefersReducedMotion,
    muted: false,
    quality: isTouchDevice ? 'low' : 'high',
  },
  updateSettings: (partial) => set((s) => ({ settings: { ...s.settings, ...partial } })),
}))

if (import.meta.env.DEV) {
  ;(window as any).__useMuseum = useMuseum
}
