import { AudioManager } from './types';

export class AudioController implements AudioManager {
  public warningSound: HTMLAudioElement;
  public endSound: HTMLAudioElement;
  public speechSynthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.warningSound = document.getElementById('warningSound') as HTMLAudioElement;
    this.endSound = document.getElementById('endSound') as HTMLAudioElement;
    this.speechSynthesis = window.speechSynthesis;
    
    this.initializeAudio();
  }

  private initializeAudio(): void {
    // Set audio properties
    this.warningSound.volume = 0.7;
    this.endSound.volume = 0.8;
    
    // Preload audio files
    this.warningSound.load();
    this.endSound.load();
    
    // Handle audio loading errors
    this.warningSound.addEventListener('error', (e) => {
      console.warn('Warning sound failed to load:', e);
    });
    
    this.endSound.addEventListener('error', (e) => {
      console.warn('End sound failed to load:', e);
    });
  }

  public playWarning(): void {
    try {
      // Reset audio to beginning
      this.warningSound.currentTime = 0;
      this.warningSound.play().catch(e => {
        console.warn('Failed to play warning sound:', e);
      });
    } catch (error) {
      console.warn('Error playing warning sound:', error);
    }
  }

  public playEnd(): void {
    try {
      // Play 3-second beep pattern
      this.playEndBeepPattern();
    } catch (error) {
      console.warn('Error playing end sound:', error);
    }
  }

  public playStart(): void {
    try {
      // Play start sound (same as warning for now)
      this.warningSound.currentTime = 0;
      this.warningSound.play().catch(e => {
        console.warn('Failed to play start sound:', e);
      });
    } catch (error) {
      console.warn('Error playing start sound:', error);
    }
  }

  private playEndBeepPattern(): void {
    let beepCount = 0;
    const maxBeeps = 3;
    
    const playBeep = () => {
      if (beepCount >= maxBeeps) return;
      
      this.endSound.currentTime = 0;
      this.endSound.play().then(() => {
        beepCount++;
        setTimeout(playBeep, 1000); // Wait 1 second between beeps
      }).catch(e => {
        console.warn('Failed to play end beep:', e);
      });
    };
    
    playBeep();
  }

  public speak(text: string): void {
    try {
      // Stop any current speech
      this.stopSpeech();
      
      // Create new utterance
      this.currentUtterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance.lang = 'de-DE';
      this.currentUtterance.rate = 0.8;
      this.currentUtterance.pitch = 1.0;
      this.currentUtterance.volume = 0.8;
      
      // Speak the text
      this.speechSynthesis.speak(this.currentUtterance);
      
      // Handle speech end
      this.currentUtterance.onend = () => {
        this.currentUtterance = null;
      };
      
      this.currentUtterance.onerror = (event) => {
        console.warn('Speech synthesis error:', event);
        this.currentUtterance = null;
      };
      
    } catch (error) {
      console.warn('Error with speech synthesis:', error);
    }
  }

  public stopSpeech(): void {
    try {
      if (this.currentUtterance) {
        this.speechSynthesis.cancel();
        this.currentUtterance = null;
      }
    } catch (error) {
      console.warn('Error stopping speech:', error);
    }
  }

  public countdownSpeech(seconds: number): void {
    if (seconds <= 0 || seconds > 10) return;
    
    const text = seconds.toString();
    this.speak(text);
  }

  public isSpeechSupported(): boolean {
    return 'speechSynthesis' in window && this.speechSynthesis !== null;
  }

  public isAudioSupported(): boolean {
    return 'Audio' in window;
  }

  public setVolume(warningVolume: number, endVolume: number): void {
    this.warningSound.volume = Math.max(0, Math.min(1, warningVolume));
    this.endSound.volume = Math.max(0, Math.min(1, endVolume));
  }

  public mute(): void {
    this.warningSound.volume = 0;
    this.endSound.volume = 0;
  }

  public unmute(): void {
    this.warningSound.volume = 0.7;
    this.endSound.volume = 0.8;
  }
}
