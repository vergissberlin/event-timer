import { AudioManager as AudioManagerInterface } from './types';

export class AudioManager implements AudioManagerInterface {
  private audioContext: AudioContext | null = null;
  public startSound: HTMLAudioElement;
  private speechSynthesis: SpeechSynthesis;
  private isAudioEnabled: boolean = true;
  private isSpeechEnabled: boolean = true;

  constructor() {
    // HTML Audio Elemente sicher initialisieren
    const startSoundElement = document.getElementById('startSound') as HTMLAudioElement;
    this.startSound = startSoundElement || new Audio();
    
    this.speechSynthesis = window.speechSynthesis;
    
    // Audio-Kontext initialisieren (wird erst bei Bedarf erstellt)
    this.initializeAudioContext();
  }

  private initializeAudioContext(): void {
    try {
      // AudioContext erstellen (wird erst bei erster Nutzung initialisiert)
      this.audioContext = null;
    } catch (error) {
      console.warn('Web Audio API nicht unterstützt:', error);
    }
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Web Audio API Sound-Generierung
  private generateTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3): void {
    try {
      const audioContext = this.getAudioContext();
      
      // Oscillator erstellen
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Verbinden
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Parameter setzen
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;
      
      // Fade in/out für weiche Übergänge
      const fadeTime = 0.1;
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + fadeTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + duration - fadeTime);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
      
      // Starten und stoppen
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      
    } catch (error) {
      console.warn('Fehler beim Generieren des Tons:', error);
      // Fallback zu HTML Audio
      this.playFallbackSound('warning');
    }
  }

  private generateBeepSequence(frequencies: number[], durations: number[], pauses: number[]): void {
    try {
      frequencies.forEach((frequency, index) => {
        const duration = durations[index] || 0.3;
        const pause = pauses[index] || 0.7;
        
        // Beep generieren
        this.generateTone(frequency, duration, 'square', 0.2);
        
        // Pause bis zum nächsten Beep
        setTimeout(() => {
          // Pause implementiert durch setTimeout
        }, (duration + pause) * 1000);
      });
      
    } catch (error) {
      console.warn('Fehler beim Generieren der Beep-Sequenz:', error);
      // Fallback zu HTML Audio
      this.playFallbackSound('end');
    }
  }

  private generateSweepTone(startFreq: number, endFreq: number, duration: number): void {
    try {
      const audioContext = this.getAudioContext();
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Frequenz-Sweep
      oscillator.frequency.setValueAtTime(startFreq, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(endFreq, audioContext.currentTime + duration);
      
      oscillator.type = 'sine';
      
      // Fade in/out
      const fadeTime = 0.1;
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + fadeTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + duration - fadeTime);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      
    } catch (error) {
      console.warn('Fehler beim Generieren des Sweep-Tons:', error);
      // Fallback zu HTML Audio
      this.playFallbackSound('start');
    }
  }

  // Fallback zu HTML Audio (nur für Browser ohne Web Audio API)
  private playFallbackSound(type: 'warning' | 'end' | 'start'): void {
    if (!this.isAudioEnabled) return;
    
    console.warn(`Web Audio API nicht verfügbar - ${type} Sound kann nicht abgespielt werden`);
  }

  // Öffentliche Methoden mit Web Audio API
  public playWarning(): void {
    if (!this.isAudioEnabled) return;
    
    // Web Audio API: 800Hz Sine-Wave, 0.5s
    this.generateTone(800, 0.5, 'sine', 0.3);
  }

  public playEnd(): void {
    if (!this.isAudioEnabled) return;
    
    // Web Audio API: Wärmere, sanftere End-Töne
    this.generateWarmEndSequence();
  }

  private generateWarmEndSequence(): void {
    try {
      // Erster Ton: Warme, tiefe Frequenz
      setTimeout(() => {
        this.generateTone(300, 0.4, 'sine', 0.25);
      }, 0);
      
      // Zweiter Ton: Sanfter Übergang
      setTimeout(() => {
        this.generateTone(350, 0.4, 'sine', 0.25);
      }, 1200);
      
      // Dritter Ton: Abschließender warmer Ton
      setTimeout(() => {
        this.generateTone(400, 0.5, 'sine', 0.3);
      }, 2400);
      
    } catch (error) {
      console.warn('Fehler beim Generieren der warmen End-Sequenz:', error);
      // Fallback zu einfachen Tönen
      this.generateBeepSequence([300, 350, 400], [0.4, 0.4, 0.5], [0.8, 0.8, 0.8]);
    }
  }

  public playStart(): void {
    if (!this.isAudioEnabled) return;
    
    // Web Audio API: Lauter, dramatischer Start-Ton
    // Mehrere Frequenzen für einen eindrucksvollen Sound
    this.generateStartSequence();
  }

  private generateStartSequence(): void {
    try {
      // Erste Sequenz: Aufsteigender Ton
      this.generateSweepTone(200, 800, 0.5);
      
      // Zweite Sequenz: Dramatischer Akkord nach kurzer Pause
      setTimeout(() => {
        this.generateChord([400, 600, 800], 0.8, 'square', 0.4);
      }, 600);
      
    } catch (error) {
      console.warn('Fehler beim Generieren des Start-Sequenz:', error);
      this.playFallbackSound('start');
    }
  }

  private generateChord(frequencies: number[], duration: number, type: OscillatorType = 'sine', volume: number = 0.3): void {
    try {
      const audioContext = this.getAudioContext();
      
      frequencies.forEach(frequency => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = type;
        
        // Fade in/out
        const fadeTime = 0.1;
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + fadeTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + duration - fadeTime);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      });
      
    } catch (error) {
      console.warn('Fehler beim Generieren des Akkords:', error);
    }
  }

  // EKG-ähnliche Beeps für die letzten 10 Sekunden
  public playEKGBeep(seconds: number): void {
    if (!this.isAudioEnabled) return;
    
    try {
      // EKG-ähnliche Beep-Sequenz basierend auf der verbleibenden Zeit
      if (seconds <= 10 && seconds > 0) {
        this.generateEKGBeep(seconds);
      }
    } catch (error) {
      console.warn('Fehler beim Generieren des EKG-Beeps:', error);
    }
  }

  private generateEKGBeep(seconds: number): void {
    if (!this.audioContext) return;
    
    const frequency = 800 + (10 - seconds) * 50; // Frequency increases as seconds decrease
    const duration = 0.1; // Short beep
    
    // Create oscillator for first beep
    const oscillator1 = this.audioContext.createOscillator();
    const gain1 = this.audioContext.createGain();
    
    oscillator1.connect(gain1);
    gain1.connect(this.audioContext.destination);
    
    oscillator1.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator1.type = 'square';
    
    gain1.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator1.start(this.audioContext.currentTime);
    oscillator1.stop(this.audioContext.currentTime + duration);
    
    // Create oscillator for second beep (after 0.2s delay)
    const oscillator2 = this.audioContext.createOscillator();
    const gain2 = this.audioContext.createGain();
    
    oscillator2.connect(gain2);
    gain2.connect(this.audioContext.destination);
    
    oscillator2.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator2.type = 'square';
    
    gain2.gain.setValueAtTime(0.3, this.audioContext.currentTime + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2 + duration);
    
    oscillator2.start(this.audioContext.currentTime + 0.2);
    oscillator2.stop(this.audioContext.currentTime + 0.2 + duration);
  }

  // Langer Ton bei null Sekunden
  public playZeroTone(): void {
    if (!this.isAudioEnabled) return;
    
    try {
      // Langer, eindringlicher Ton bei null
      this.generateLongZeroTone();
    } catch (error) {
      console.warn('Fehler beim Generieren des Null-Tons:', error);
    }
  }

  private generateLongZeroTone(): void {
    try {
      const audioContext = this.getAudioContext();
      
      // Langer Ton mit fallender Frequenz (Alarm-Charakteristik)
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Frequenz von hoch nach tief (Alarm-Effekt)
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 3.0);
      
      oscillator.type = 'sawtooth'; // Eindringlicher Klang
      
      // Lauter Start, dann leiser werdend
      gainNode.gain.setValueAtTime(0.6, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 3.0);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 3.0);
      
    } catch (error) {
      console.warn('Fehler beim Generieren des langen Null-Tons:', error);
    }
  }

  // Speech API für Countdown
  public speakCountdown(seconds: number): void {
    if (!this.isSpeechEnabled) return;
    
    try {
      // Bestehende Speech-Synthesen stoppen
      this.speechSynthesis.cancel();
      
      // Nur bei 10 Sekunden sprechen
      if (seconds === 10) {
        const utterance = new SpeechSynthesisUtterance('Noch 10 Sekunden');
        utterance.lang = 'de-DE';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        this.speechSynthesis.speak(utterance);
      }
      
    } catch (error) {
      console.warn('Speech API nicht verfügbar:', error);
    }
  }

  // Audio-Einstellungen
  public setAudioEnabled(enabled: boolean): void {
    this.isAudioEnabled = enabled;
  }

  public setSpeechEnabled(enabled: boolean): void {
    this.isSpeechEnabled = enabled;
  }

  public isAudioSupported(): boolean {
    return !!(window.AudioContext || (window as any).webkitAudioContext);
  }

  public isSpeechSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  // AudioContext für Benutzerinteraktion aktivieren (Browser-Requirement)
  public resumeAudioContext(): void {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}
