export interface AppTheme {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface FaviconTheme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface AppConfig {
  name: string;
  shortName: string;
  description: string;
  favicon: FaviconTheme;
}

export interface Event {
  id: string;
  title: string;
  startTime: string; // ISO 8601 datetime string
  duration: number; // in seconds
  icon?: string; // Tabler icon class
  background?: string;
  description: string;
}

export interface AppSettings {
  theme: AppTheme;
  app: AppConfig;
  audioEnabled: boolean;
  speechEnabled: boolean;
  fullscreenByDefault: boolean;
  autoStart: boolean;
  autoSwitchSeconds: number;
}

export interface EventsData {
  events: Event[];
}

export interface SettingsData {
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
  startSound: HTMLAudioElement;
  playWarning: () => void;
  playEnd: () => void;
  playStart: () => void;
  speakCountdown: (seconds: number) => void;
  isSpeechSupported: () => boolean;
  isAudioSupported: () => boolean;
  setAudioEnabled: (enabled: boolean) => void;
  setSpeechEnabled: (enabled: boolean) => void;
  resumeAudioContext: () => void;
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
