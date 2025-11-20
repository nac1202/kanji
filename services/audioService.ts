
// Simple synthesizer service for game sound effects
// No external files required

class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.3; // Master volume
    }
    return this.ctx;
  }

  /**
   * Must be called on a user interaction (button click) to unlock audio context
   */
  public async init() {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  }

  private playTone(
    freq: number, 
    type: OscillatorType, 
    duration: number, 
    startTimeOffset: number = 0,
    vol: number = 1.0
  ) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTimeOffset);

    gain.gain.setValueAtTime(vol, ctx.currentTime + startTimeOffset);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTimeOffset + duration);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(ctx.currentTime + startTimeOffset);
    osc.stop(ctx.currentTime + startTimeOffset + duration);
  }

  // "Pop" sound for general clicks
  playPop() {
    this.playTone(600, 'sine', 0.1);
  }

  // "Pin-Pon!" - Cheerful major 3rd
  playCorrect() {
    const now = 0;
    this.playTone(660, 'sine', 0.15, now, 0.8); // E5
    this.playTone(880, 'sine', 0.4, now + 0.1, 0.8); // A5 (Wait, let's do C-E-G or similar)
    // Let's do a classic quiz show "Pin-Pon" (High C -> Higher C)
    // B4 (493) -> G5 (783) is common, lets try:
    // C5 (523) -> C6 (1046)
    // Actually simpler:
    this.playTone(1046.50, 'sine', 0.1, 0, 0.6); // High C
    this.playTone(880.00, 'sine', 0.4, 0.1, 0.6); // A
  }

  // "Buu-Buu..." - Descending low tone
  playIncorrect() {
    const ctx = this.getContext();
    if (this.isMuted) return;
    
    // Using sawtooth for a buzzier "wrong" sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    // Slide down
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.4);
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
    
    // Second beep
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(200, ctx.currentTime + 0.2);
    osc2.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.6);
    gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.2);
    gain2.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    
    osc2.connect(gain2);
    gain2.connect(this.masterGain!);
    osc2.start(ctx.currentTime + 0.2);
    osc2.stop(ctx.currentTime + 0.6);
  }

  // Game Start / Level Up Sound
  playStart() {
    const now = 0;
    // C - E - G - C (Arpeggio)
    this.playTone(523.25, 'triangle', 0.1, now);
    this.playTone(659.25, 'triangle', 0.1, now + 0.1);
    this.playTone(783.99, 'triangle', 0.1, now + 0.2);
    this.playTone(1046.50, 'triangle', 0.3, now + 0.3);
  }

  // Victory Fanfare
  playFanfare() {
    const now = 0;
    // Ta-da-da-ta-daaaa!
    this.playTone(523.25, 'triangle', 0.1, now); // C
    this.playTone(523.25, 'triangle', 0.1, now + 0.15); // C
    this.playTone(523.25, 'triangle', 0.1, now + 0.3); // C
    this.playTone(659.25, 'triangle', 0.4, now + 0.45); // E
    this.playTone(783.99, 'triangle', 0.6, now + 0.6); // G
  }
}

export const audio = new AudioService();
