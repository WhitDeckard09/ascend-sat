/** Tiny WebAudio blips. No asset files, and it stays silent if audio is blocked. */

let ctx: AudioContext | null = null

const context = (): AudioContext | null => {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

const tone = (freq: number, start: number, duration: number, gain: number) => {
  const ac = context()
  if (!ac) return
  const osc = ac.createOscillator()
  const vol = ac.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  vol.gain.setValueAtTime(0, ac.currentTime + start)
  vol.gain.linearRampToValueAtTime(gain, ac.currentTime + start + 0.012)
  vol.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + duration)
  osc.connect(vol).connect(ac.destination)
  osc.start(ac.currentTime + start)
  osc.stop(ac.currentTime + start + duration + 0.02)
}

export const playCorrect = () => {
  tone(660, 0, 0.14, 0.12)
  tone(880, 0.08, 0.2, 0.1)
}

export const playWrong = () => {
  tone(196, 0, 0.22, 0.11)
  tone(146, 0.06, 0.26, 0.09)
}

export const playComplete = () => {
  tone(523, 0, 0.16, 0.11)
  tone(659, 0.1, 0.16, 0.11)
  tone(784, 0.2, 0.34, 0.12)
}
