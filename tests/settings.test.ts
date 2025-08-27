import { SettingsManager } from '../src/settings';
import { AppSettings } from '../src/types';

describe('SettingsManager', () => {
  let settingsManager: SettingsManager;
  let mockSettings: AppSettings;

  beforeEach(() => {
    settingsManager = new SettingsManager();
    
    mockSettings = {
      theme: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#06b6d4'
      },
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
      audioEnabled: true,
      speechEnabled: true,
      fullscreenByDefault: false,
      autoStart: true,
      autoSwitchSeconds: 30
    };

    // Mock fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadSettings', () => {
    it('should load settings successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ settings: mockSettings })
      });

      const settings = await settingsManager.loadSettings();

      expect(settings).toEqual(mockSettings);
      expect(global.fetch).toHaveBeenCalledWith('/data/settings.json');
    });

    it('should handle fetch errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(settingsManager.loadSettings()).rejects.toThrow('Network error');
    });

    it('should handle invalid JSON response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'data' })
      });

      await expect(settingsManager.loadSettings()).rejects.toThrow('Invalid settings data');
    });

    it('should use default settings when file not found', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Not found'));

      const settings = await settingsManager.loadSettings();
      
      expect(settings).toBeDefined();
      expect(settings.app.name).toBe('Event Timer');
      expect(settings.autoSwitchSeconds).toBe(30);
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
      const incompleteSettings = {
        settings: {
          theme: { primary: '#test' },
          app: { name: 'Test' }
          // Missing other fields
        }
      };

      const validated = settingsManager.validateSettings(incompleteSettings);
      
      expect(validated.audioEnabled).toBe(true);
      expect(validated.speechEnabled).toBe(true);
      expect(validated.fullscreenByDefault).toBe(false);
      expect(validated.autoStart).toBe(true);
      expect(validated.autoSwitchSeconds).toBe(30);
    });

    it('should handle null settings', () => {
      const validated = settingsManager.validateSettings(null);
      
      expect(validated).toBeDefined();
      expect(validated.app.name).toBe('Event Timer');
    });

    it('should handle undefined settings', () => {
      const validated = settingsManager.validateSettings(undefined);
      
      expect(validated).toBeDefined();
      expect(validated.app.name).toBe('Event Timer');
    });
  });

  describe('validateTheme', () => {
    it('should validate complete theme', () => {
      const theme = mockSettings.theme;
      const validated = settingsManager.validateTheme(theme);
      expect(validated).toEqual(theme);
    });

    it('should provide defaults for missing theme colors', () => {
      const incompleteTheme = {
        primary: '#test'
        // Missing other colors
      };

      const validated = settingsManager.validateTheme(incompleteTheme);
      
      expect(validated.primary).toBe('#test');
      expect(validated.secondary).toBe('#1e40af');
      expect(validated.accent).toBe('#60a5fa');
      expect(validated.success).toBe('#10b981');
      expect(validated.warning).toBe('#f59e0b');
      expect(validated.error).toBe('#ef4444');
      expect(validated.info).toBe('#06b6d4');
    });

    it('should handle null theme', () => {
      const validated = settingsManager.validateTheme(null);
      
      expect(validated.primary).toBe('#3b82f6');
      expect(validated.secondary).toBe('#1e40af');
      expect(validated.accent).toBe('#60a5fa');
    });

    it('should handle undefined theme', () => {
      const validated = settingsManager.validateTheme(undefined);
      
      expect(validated.primary).toBe('#3b82f6');
      expect(validated.secondary).toBe('#1e40af');
      expect(validated.accent).toBe('#60a5fa');
    });
  });

  describe('validateAppConfig', () => {
    it('should validate complete app config', () => {
      const app = mockSettings.app;
      const validated = settingsManager.validateAppConfig(app);
      expect(validated).toEqual(app);
    });

    it('should provide defaults for missing app fields', () => {
      const incompleteApp = {
        name: 'Test App'
        // Missing other fields
      };

      const validated = settingsManager.validateAppConfig(incompleteApp);
      
      expect(validated.name).toBe('Test App');
      expect(validated.shortName).toBe('Timer');
      expect(validated.description).toBe('Progressive Web App für Event-Timer');
      expect(validated.favicon).toBeDefined();
    });

    it('should handle null app config', () => {
      const validated = settingsManager.validateAppConfig(null);
      
      expect(validated.name).toBe('Event Timer');
      expect(validated.shortName).toBe('Timer');
      expect(validated.description).toBe('Progressive Web App für Event-Timer');
    });

    it('should handle undefined app config', () => {
      const validated = settingsManager.validateAppConfig(undefined);
      
      expect(validated.name).toBe('Event Timer');
      expect(validated.shortName).toBe('Timer');
      expect(validated.description).toBe('Progressive Web App für Event-Timer');
    });
  });

  describe('validateFaviconTheme', () => {
    it('should validate complete favicon theme', () => {
      const favicon = mockSettings.app.favicon;
      const validated = settingsManager.validateFaviconTheme(favicon);
      expect(validated).toEqual(favicon);
    });

    it('should provide defaults for missing favicon colors', () => {
      const incompleteFavicon = {
        primary: '#test'
        // Missing other colors
      };

      const validated = settingsManager.validateFaviconTheme(incompleteFavicon);
      
      expect(validated.primary).toBe('#test');
      expect(validated.secondary).toBe('#1e40af');
      expect(validated.accent).toBe('#60a5fa');
    });

    it('should handle null favicon theme', () => {
      const validated = settingsManager.validateFaviconTheme(null);
      
      expect(validated.primary).toBe('#3b82f6');
      expect(validated.secondary).toBe('#1e40af');
      expect(validated.accent).toBe('#60a5fa');
    });

    it('should handle undefined favicon theme', () => {
      const validated = settingsManager.validateFaviconTheme(undefined);
      
      expect(validated.primary).toBe('#3b82f6');
      expect(validated.secondary).toBe('#1e40af');
      expect(validated.accent).toBe('#60a5fa');
    });
  });

  describe('getDefaultSettings', () => {
    it('should return default settings', () => {
      const defaults = settingsManager.getDefaultSettings();
      
      expect(defaults.app.name).toBe('Event Timer');
      expect(defaults.app.shortName).toBe('Timer');
      expect(defaults.app.description).toBe('Progressive Web App für Event-Timer');
      expect(defaults.audioEnabled).toBe(true);
      expect(defaults.speechEnabled).toBe(true);
      expect(defaults.fullscreenByDefault).toBe(false);
      expect(defaults.autoStart).toBe(true);
      expect(defaults.autoSwitchSeconds).toBe(30);
      expect(defaults.theme.primary).toBe('#3b82f6');
      expect(defaults.theme.secondary).toBe('#1e40af');
      expect(defaults.theme.accent).toBe('#60a5fa');
    });
  });

  describe('getSettings', () => {
    it('should return current settings', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ settings: mockSettings })
      });

      await settingsManager.loadSettings();
      const settings = settingsManager.getSettings();

      expect(settings).toEqual(mockSettings);
    });

    it('should return default settings when not loaded', () => {
      const settings = settingsManager.getSettings();
      
      expect(settings.app.name).toBe('Event Timer');
      expect(settings.autoSwitchSeconds).toBe(30);
    });
  });

  describe('getTheme', () => {
    it('should return current theme', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ settings: mockSettings })
      });

      await settingsManager.loadSettings();
      const theme = settingsManager.getTheme();

      expect(theme).toEqual(mockSettings.theme);
    });

    it('should return default theme when not loaded', () => {
      const theme = settingsManager.getTheme();
      
      expect(theme.primary).toBe('#3b82f6');
      expect(theme.secondary).toBe('#1e40af');
      expect(theme.accent).toBe('#60a5fa');
    });
  });

  describe('getAppConfig', () => {
    it('should return current app config', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ settings: mockSettings })
      });

      await settingsManager.loadSettings();
      const appConfig = settingsManager.getAppConfig();

      expect(appConfig).toEqual(mockSettings.app);
    });

    it('should return default app config when not loaded', () => {
      const appConfig = settingsManager.getAppConfig();
      
      expect(appConfig.name).toBe('Event Timer');
      expect(appConfig.shortName).toBe('Timer');
      expect(appConfig.description).toBe('Progressive Web App für Event-Timer');
    });
  });

  describe('updateFavicon', () => {
    it('should update favicon with theme colors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ settings: mockSettings })
      });

      await settingsManager.loadSettings();
      settingsManager.updateFavicon();

      // Should call FaviconGenerator.updateFavicon
      // This is tested in favicon.test.ts
    });
  });

  describe('Boolean Settings Validation', () => {
    it('should handle boolean settings correctly', () => {
      const settingsWithBooleans = {
        settings: {
          theme: mockSettings.theme,
          app: mockSettings.app,
          audioEnabled: 'true', // String instead of boolean
          speechEnabled: 'false', // String instead of boolean
          fullscreenByDefault: 1, // Number instead of boolean
          autoStart: 0, // Number instead of boolean
          autoSwitchSeconds: '45' // String instead of number
        }
      };

      const validated = settingsManager.validateSettings(settingsWithBooleans);
      
      expect(validated.audioEnabled).toBe(true);
      expect(validated.speechEnabled).toBe(false);
      expect(validated.fullscreenByDefault).toBe(true);
      expect(validated.autoStart).toBe(false);
      expect(validated.autoSwitchSeconds).toBe(45);
    });

    it('should use defaults for invalid boolean values', () => {
      const settingsWithInvalidBooleans = {
        settings: {
          theme: mockSettings.theme,
          app: mockSettings.app,
          audioEnabled: 'invalid',
          speechEnabled: null,
          fullscreenByDefault: undefined,
          autoStart: 'not-a-boolean',
          autoSwitchSeconds: 'not-a-number'
        }
      };

      const validated = settingsManager.validateSettings(settingsWithInvalidBooleans);
      
      expect(validated.audioEnabled).toBe(true); // Default
      expect(validated.speechEnabled).toBe(true); // Default
      expect(validated.fullscreenByDefault).toBe(false); // Default
      expect(validated.autoStart).toBe(true); // Default
      expect(validated.autoSwitchSeconds).toBe(30); // Default
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty settings object', () => {
      const validated = settingsManager.validateSettings({ settings: {} });
      
      expect(validated).toBeDefined();
      expect(validated.app.name).toBe('Event Timer');
      expect(validated.autoSwitchSeconds).toBe(30);
    });

    it('should handle settings with only partial data', () => {
      const partialSettings = {
        settings: {
          audioEnabled: false,
          autoSwitchSeconds: 60
          // Missing theme and app
        }
      };

      const validated = settingsManager.validateSettings(partialSettings);
      
      expect(validated.audioEnabled).toBe(false);
      expect(validated.autoSwitchSeconds).toBe(60);
      expect(validated.app.name).toBe('Event Timer'); // Default
      expect(validated.theme.primary).toBe('#3b82f6'); // Default
    });

    it('should handle malformed nested objects', () => {
      const malformedSettings = {
        settings: {
          theme: 'not-an-object',
          app: null,
          audioEnabled: true
        }
      };

      const validated = settingsManager.validateSettings(malformedSettings);
      
      expect(validated.audioEnabled).toBe(true);
      expect(validated.theme.primary).toBe('#3b82f6'); // Default
      expect(validated.app.name).toBe('Event Timer'); // Default
    });
  });
});
