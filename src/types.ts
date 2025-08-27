export interface EventTheme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface Event {
  id: string;
  title: string;
  startTime: string; // ISO 8601 datetime string
  duration: number; // in seconds
  theme: EventTheme;
  icon?: string; // Tabler icon class
  background?: string;
  description: string;
}

export interface AppSettings {
  defaultTheme: EventTheme;
  audioEnabled: boolean;
  speechEnabled: boolean;
  fullscreenByDefault: boolean;
  autoStart: boolean;
}

export interface EventsData {
  events: Event[];
  settings: AppSettings;
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  timeRemaining: number;
  totalTime: number;
  startTime?: number;
  pauseTime?: number;
}

export interface AudioManager {
  warningSound: HTMLAudioElement;
  endSound: HTMLAudioElement;
  speechSynthesis: SpeechSynthesis;
  playWarning: () => void;
  playEnd: () => void;
  speak: (text: string) => void;
  stopSpeech: () => void;
}

export interface TimerCallbacks {
  onTick: (timeRemaining: number) => void;
  onWarning: () => void;
  onEnd: () => void;
  onEventStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export type TimerStatus = 'ready' | 'running' | 'paused' | 'finished' | 'warning';
