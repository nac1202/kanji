
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

  // "Pin-Pon!"
  playCorrect() {
    this.playTone(1046.50, 'sine', 0.1, 0, 0.6); // High C
    this.playTone(880.00, 'sine', 0.4, 0.1, 0.6); // A
  }

  // "Buu-Buu..."
  playIncorrect() {
    const ctx = this.getContext();
    if (this.isMuted) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
    
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

  // Game Start
  playStart() {
    const now = 0;
    this.playTone(523.25, 'triangle', 0.1, now);
    this.playTone(659.25, 'triangle', 0.1, now + 0.1);
    this.playTone(783.99, 'triangle', 0.1, now + 0.2);
    this.playTone(1046.50, 'triangle', 0.3, now + 0.3);
  }

  // Victory Fanfare
  playFanfare() {
    const now = 0;
    this.playTone(523.25, 'triangle', 0.1, now); 
    this.playTone(523.25, 'triangle', 0.1, now + 0.15); 
    this.playTone(523.25, 'triangle', 0.1, now + 0.3); 
    this.playTone(659.25, 'triangle', 0.4, now + 0.45); 
    this.playTone(783.99, 'triangle', 0.6, now + 0.6); 
  }

  // Level Up / Evolution Sound (Magical rising)
  playEvolution() {
    const ctx = this.getContext();
    if (this.isMuted) return;

    const now = ctx.currentTime;
    // Arpeggio up quickly
    [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98].forEach((freq, i) => {
        this.playTone(freq, 'sine', 0.2, i * 0.08, 0.5);
    });
  }
}

export const audio = new AudioService();
