/**
 * Audio synthesis helper using Web Audio API (procedural, zero 404 dependencies)
 * and Web Speech API for Vietnamese Text-To-Speech (TTS)
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isBgmPlaying = false;
  private bgmTimeoutId: number | null = null;
  private isMuted = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isBgmPlaying) {
      this.stopBgm();
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  // Soft melodic chime for exhibit opening or card flip
  public playChime(freq = 523.25) { // C5
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.15);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch {
      // Audio context ignore
    }
  }

  // Soft temple bell / chime when placing a lotus flower
  public playBell() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const harmonics = [440, 880, 1320, 1760];
      harmonics.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const initialVol = 0.12 / (idx + 1);
        gain.gain.setValueAtTime(initialVol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8 + idx * 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.2);
      });
    } catch {
      // Audio context ignore
    }
  }

  // Kid-friendly correct answer sound
  public playCorrect() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const now = ctx.currentTime + i * 0.1;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      });
    } catch {
      // Ignore
    }
  }

  // Kid-friendly try again sound
  public playTryAgain() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const notes = [440, 392]; // A4, G4
      notes.forEach((freq, i) => {
        const now = ctx.currentTime + i * 0.18;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch {
      // Ignore
    }
  }

  // Fanfare celebratory chime when completing quiz
  public playFanfare() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const chords = [
        [523.25, 659.25, 783.99], // C
        [587.33, 739.99, 880.00], // D
        [659.25, 830.61, 987.77], // E
        [783.99, 987.77, 1174.66, 1567.98], // G & C
      ];

      chords.forEach((chord, step) => {
        const time = ctx.currentTime + step * 0.22;
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, time);

          const duration = step === chords.length - 1 ? 1.0 : 0.35;
          gain.gain.setValueAtTime(0.001, time);
          gain.gain.linearRampToValueAtTime(0.1, time + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(time);
          osc.stop(time + duration + 0.05);
        });
      });
    } catch {
      // Ignore
    }
  }

  // Procedural Vietnamese pentatonic gentle instrumental music (Hò Ba Lý / Kim Tiền / Điệu Ru)
  // Pentatonic scale: D4, F4, G4, A4, C5, D5 (Rê - Fa - Sol - La - Đô - Rê)
  public toggleBgm(): boolean {
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public getBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public startBgm() {
    if (this.isBgmPlaying || this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    this.isBgmPlaying = true;
    const pentatonic = [
      293.66, // D4
      349.23, // F4
      392.00, // G4
      440.00, // A4
      523.25, // C5
      587.33, // D5
      698.46, // F5
      783.99, // G5
    ];

    // Melodic sequence inspired by peaceful traditional lullaby
    const melodyPattern = [
      0, 2, 3, 5,  4, 3, 2, 0,
      1, 2, 4, 3,  2, 0, 1, 0,
      3, 5, 6, 7,  5, 4, 3, 2,
      4, 3, 2, 0,  1, 2, 0, -1
    ];

    let noteIdx = 0;

    const playNextNote = () => {
      if (!this.isBgmPlaying || !this.ctx) return;
      const step = melodyPattern[noteIdx % melodyPattern.length];
      noteIdx++;

      if (step >= 0) {
        const freq = pentatonic[step % pentatonic.length];
        const now = this.ctx.currentTime;

        // Flute / Dan Tranh simulated tone
        const osc = this.ctx.createOscillator();
        const oscHarmonic = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        oscHarmonic.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        oscHarmonic.frequency.setValueAtTime(freq * 2, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.045, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

        osc.connect(gain);
        oscHarmonic.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        oscHarmonic.start(now);
        osc.stop(now + 0.7);
        oscHarmonic.stop(now + 0.7);
      }

      this.bgmTimeoutId = window.setTimeout(playNextNote, 420);
    };

    playNextNote();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimeoutId !== null) {
      window.clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
  }

  // Text-To-Speech for children (Vietnamese voice)
  public speakText(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95; // slightly slower for young kids
    utterance.pitch = 1.05; // warm and friendly

    // Try finding Vietnamese voice
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.includes('vi') || v.lang.includes('VN'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundCtrl = new SoundController();
