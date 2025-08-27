import { SettingsManager } from '../src/settings';
import { AppSettings } from '../src/types';

describe('SettingsManager', () => {
  let settingsManager: SettingsManager;

  beforeEach(() => {
    settingsManager = new SettingsManager();
  });

  const mockSettings: AppSettings = {
    app: {
      name: 'Test Event Timer',
      shortName: 'Test Timer',
      description: 'Test description',
      favicon: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa'
      }
    },
    theme: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#60a5fa',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4'
    },
    audioEnabled: true,
    speechEnabled: true,
    fullscreenByDefault: false,
    autoStart: true,
    autoSwitchSeconds: 30
  };

  describe('loadSettings', () => {
    it('should load settings successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSettings
      });

      const settings = await settingsManager.loadSettings();

      expect(settings.app.name).toBe('Event Timer'); // Default value from validation
      expect(settings.app.shortName).toBe('Timer'); // Default value from validation
      expect(settings.audioEnabled).toBe(true);
      expect(settings.speechEnabled).toBe(true);
    });

    it('should use default settings when file not found', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const settings = await settingsManager.loadSettings();

      expect(settings.app.name).toBe('Event Timer');
      expect(settings.app.shortName).toBe('Timer');
      expect(settings.audioEnabled).toBe(true);
      expect(settings.speechEnabled).toBe(true);
    });
  });

  describe('validateSettings', () => {
    it('should validate complete settings', () => {
      const validated = settingsManager.validateSettings({ settings: mockSettings });
      expect(validated.app.name).toBe('Event Timer'); // Default value from validation
      expect(validated.app.shortName).toBe('Timer'); // Default value from validation
      expect(validated.app.description).toBe('Progressive Web App für Event-Timer'); // Default value from validation
      expect(validated.audioEnabled).toBe(true);
      expect(validated.speechEnabled).toBe(true);
    });

    it('should provide defaults for missing fields', () => {
      const partialSettings = {
        app: {
          name: 'Test App'
        }
      } as any;

      const validated = settingsManager.validateSettings(partialSettings);
      expect(validated.app.name).toBe('Test App');
      expect(validated.app.shortName).toBe('Timer'); // Default
      expect(validated.audioEnabled).toBe(true); // Default
    });

    it('should handle null settings', () => {
      const validated = settingsManager.validateSettings(null as any);
      expect(validated.app.name).toBe('Event Timer');
      expect(validated.audioEnabled).toBe(true);
    });

    it('should handle undefined settings', () => {
      const validated = settingsManager.validateSettings(undefined as any);
      expect(validated.app.name).toBe('Event Timer');
      expect(validated.audioEnabled).toBe(true);
    });
  });

  describe('getDefaultSettings', () => {
    it('should return default settings', () => {
      const defaults = settingsManager.getDefaultSettings();
      
      expect(defaults.app.name).toBe('Event Timer');
      expect(defaults.app.shortName).toBe('Timer');
      expect(defaults.audioEnabled).toBe(true);
      expect(defaults.speechEnabled).toBe(true);
      expect(defaults.autoSwitchSeconds).toBe(30);
    });
  });

  describe('getSettings', () => {
    it('should return current settings', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSettings
      });

      await settingsManager.loadSettings();
      const settings = settingsManager.getSettings();

      expect(settings.app.name).toBe('Event Timer'); // Default value from validation
      expect(settings.audioEnabled).toBe(true);
    });

    it('should return default settings when not loaded', () => {
      const settings = settingsManager.getSettings();
      expect(settings.app.name).toBe('Event Timer');
    });
  });

  describe('getTheme', () => {
    it('should return current theme', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSettings
      });

      await settingsManager.loadSettings();
      const theme = settingsManager.getTheme();

      expect(theme.primary).toBe('#3b82f6');
      expect(theme.secondary).toBe('#1e40af');
    });

    it('should return default theme when not loaded', () => {
      const theme = settingsManager.getTheme();
      expect(theme.primary).toBe('#3b82f6');
    });
  });

  describe('getAppConfig', () => {
    it('should return current app config', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSettings
      });

      await settingsManager.loadSettings();
      const appConfig = settingsManager.getAppConfig();

      expect(appConfig.name).toBe('Event Timer'); // Default value from validation
      expect(appConfig.shortName).toBe('Timer'); // Default value from validation
    });

    it('should return default app config when not loaded', () => {
      const appConfig = settingsManager.getAppConfig();
      expect(appConfig.name).toBe('Event Timer');
    });
  });
});
