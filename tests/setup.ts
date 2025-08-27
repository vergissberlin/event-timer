// Jest Setup für DOM-Tests
import '@testing-library/jest-dom';

// Mock für Web Audio API
class MockAudioContext {
  currentTime = 0;
  destination = {};
  
  createOscillator() {
    return {
      frequency: { setValueAtTime: jest.fn() },
      type: 'sine',
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    };
  }
  
  createGain() {
    return {
      gain: { 
        setValueAtTime: jest.fn(),
        linearRampToValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn(),
      },
      connect: jest.fn(),
    };
  }
}

// Mock für Speech Synthesis
const mockSpeechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
};

// Mock für QRCode
jest.mock('qrcode', () => ({
  toCanvas: jest.fn(),
  toDataURL: jest.fn(),
}));

// Mock für Workbox
jest.mock('workbox-window', () => ({
  registerSW: jest.fn(),
}));

// Globale Mocks
Object.defineProperty(window, 'AudioContext', {
  value: MockAudioContext,
  writable: true,
});

Object.defineProperty(window, 'webkitAudioContext', {
  value: MockAudioContext,
  writable: true,
});

Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true,
});

Object.defineProperty(window, 'Notification', {
  value: {
    requestPermission: jest.fn(),
    permission: 'granted',
  },
  writable: true,
});

// Mock für fetch
global.fetch = jest.fn();

// Mock für localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock für sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

// Mock für ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock für IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock für requestAnimationFrame
global.requestAnimationFrame = jest.fn((callback) => {
  setTimeout(callback, 0);
  return 1;
});

// Mock für cancelAnimationFrame
global.cancelAnimationFrame = jest.fn();

// Mock für Fullscreen API
Object.defineProperty(document, 'fullscreenElement', {
  value: null,
  writable: true,
});

Object.defineProperty(document, 'exitFullscreen', {
  value: jest.fn(),
  writable: true,
});

// Mock für Element.requestFullscreen
Element.prototype.requestFullscreen = jest.fn();

// Mock für navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(),
    readText: jest.fn(),
  },
  writable: true,
});

// Mock für URL.createObjectURL
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

// Mock für console methods in tests
const originalConsole = { ...console };
beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
  jest.clearAllMocks();
});
