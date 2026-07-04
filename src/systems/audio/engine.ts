/**
 * Procedural museum audio: everything is synthesized with WebAudio.
 * - ambience: slow detuned drones + air (filtered noise) through a generated reverb
 * - footsteps: filtered noise taps, pitch-randomized
 * - UI/interaction cues: soft sine blips
 * - doors: low filtered whoosh
 */

let ctx: AudioContext | null = null
let master: GainNode | null = null
let reverb: ConvolverNode | null = null
let ambienceStarted = false
let muted = false

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext ?? (window as any).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = muted ? 0 : 0.9
    master.connect(ctx.destination)

    // Generated impulse response: exponentially decaying stereo noise = concrete hall
    const len = ctx.sampleRate * 2.2
    const impulse = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch)
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8)
      }
    }
    reverb = ctx.createConvolver()
    reverb.buffer = impulse
    const wet = ctx.createGain()
    wet.gain.value = 0.35
    reverb.connect(wet)
    wet.connect(master)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

/** Call from any user gesture; idempotent. */
export function initAudio() {
  const c = ensureContext()
  if (!c || ambienceStarted) return
  ambienceStarted = true
  startAmbience(c)
}

export function setMuted(m: boolean) {
  muted = m
  if (master && ctx) {
    master.gain.setTargetAtTime(m ? 0 : 0.9, ctx.currentTime, 0.1)
  }
}

function noiseBuffer(c: AudioContext, seconds: number): AudioBuffer {
  const buf = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buf
}

function startAmbience(c: AudioContext) {
  if (!master || !reverb) return
  const bed = c.createGain()
  bed.gain.value = 0
  bed.connect(master)
  bed.connect(reverb)
  bed.gain.setTargetAtTime(0.05, c.currentTime, 4)

  // Two slow, slightly detuned drones an octave apart
  for (const [freq, amp] of [
    [55, 0.5],
    [110.4, 0.25],
    [164.8, 0.1],
  ] as const) {
    const osc = c.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    const g = c.createGain()
    g.gain.value = amp
    // Very slow amplitude breathing
    const lfo = c.createOscillator()
    lfo.frequency.value = 0.02 + Math.random() * 0.03
    const lfoGain = c.createGain()
    lfoGain.gain.value = amp * 0.5
    lfo.connect(lfoGain)
    lfoGain.connect(g.gain)
    osc.connect(g)
    g.connect(bed)
    osc.start()
    lfo.start()
  }

  // Air: heavily low-passed noise loop
  const noise = c.createBufferSource()
  noise.buffer = noiseBuffer(c, 4)
  noise.loop = true
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 380
  const airGain = c.createGain()
  airGain.gain.value = 0.16
  noise.connect(lp)
  lp.connect(airGain)
  airGain.connect(bed)
  noise.start()
}

/** Short filtered noise tap. reverbAmount 0..1 grows inside big rooms. */
export function playFootstep(runFactor = 0, reverbAmount = 0.3) {
  const c = ensureContext()
  if (!c || !master || !reverb) return
  const src = c.createBufferSource()
  src.buffer = noiseBuffer(c, 0.12)
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 260 + Math.random() * 160 + runFactor * 120
  filter.Q.value = 1.2
  const g = c.createGain()
  const peak = 0.05 + runFactor * 0.03 + Math.random() * 0.015
  g.gain.setValueAtTime(peak, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.13)
  src.connect(filter)
  filter.connect(g)
  g.connect(master)
  const wetSend = c.createGain()
  wetSend.gain.value = reverbAmount
  g.connect(wetSend)
  wetSend.connect(reverb)
  src.start()
}

function blip(freq: number, dur: number, gain: number, type: OscillatorType = 'sine') {
  const c = ensureContext()
  if (!c || !master || !reverb) return
  const osc = c.createOscillator()
  osc.type = type
  osc.frequency.value = freq
  const g = c.createGain()
  g.gain.setValueAtTime(gain, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.0005, c.currentTime + dur)
  osc.connect(g)
  g.connect(master)
  g.connect(reverb)
  osc.start()
  osc.stop(c.currentTime + dur + 0.05)
}

export function playHover() {
  blip(880, 0.12, 0.03)
}

export function playActivate() {
  blip(523.25, 0.25, 0.05)
  setTimeout(() => blip(783.99, 0.35, 0.045), 90)
}

export function playClose() {
  blip(392, 0.2, 0.04)
}

export function playDoor() {
  const c = ensureContext()
  if (!c || !master || !reverb) return
  const src = c.createBufferSource()
  src.buffer = noiseBuffer(c, 0.9)
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(120, c.currentTime)
  filter.frequency.linearRampToValueAtTime(600, c.currentTime + 0.5)
  filter.frequency.linearRampToValueAtTime(90, c.currentTime + 0.9)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.06, c.currentTime + 0.25)
  g.gain.exponentialRampToValueAtTime(0.0005, c.currentTime + 0.9)
  src.connect(filter)
  filter.connect(g)
  g.connect(master)
  g.connect(reverb)
  src.start()
}

export function playSecret() {
  // Low stone rumble + rising shimmer
  const c = ensureContext()
  if (!c || !master || !reverb) return
  const src = c.createBufferSource()
  src.buffer = noiseBuffer(c, 1.8)
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 90
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.12, c.currentTime + 0.3)
  g.gain.exponentialRampToValueAtTime(0.0005, c.currentTime + 1.8)
  src.connect(filter)
  filter.connect(g)
  g.connect(master)
  g.connect(reverb)
  src.start()
  setTimeout(() => blip(659.25, 0.6, 0.04), 700)
  setTimeout(() => blip(987.77, 0.9, 0.035), 950)
}
