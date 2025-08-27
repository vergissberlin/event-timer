import { AppSettings, SettingsData } from './types';
import { FaviconGenerator } from './favicon';

export class SettingsManager {
  private settings: AppSettings;
  private settingsUrl: string;

  constructor(settingsUrl: string = '/event-timer/data/settings.json') {
    this.settingsUrl = settingsUrl;
    this.settings = this.getDefaultSettings();
  }

  public async loadSettings(): Promise<AppSettings> {
    try {
      const response = await fetch(this.settingsUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: SettingsData = await response.json();
      
      // Validate data structure
      if (!data.settings) {
        throw new Error('Invalid settings data structure');
      }
      
      this.settings = this.validateSettings(data.settings);
      
      // Update favicon with theme colors
      this.updateFavicon();
      
      console.log('Settings loaded successfully');
      return this.settings;
      
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Return default settings if loading fails
      return this.getDefaultSettings();
    }
  }

  private validateSettings(settings: any): AppSettings {
    const defaultSettings = this.getDefaultSettings();
    
    if (!settings || typeof settings !== 'object') {
      return defaultSettings;
    }

    return {
      theme: this.validateTheme(settings.theme),
      app: this.validateAppConfig(settings.app),
      audioEnabled: typeof settings.audioEnabled === 'boolean' ? settings.audioEnabled : defaultSettings.audioEnabled,
      speechEnabled: typeof settings.speechEnabled === 'boolean' ? settings.speechEnabled : defaultSettings.speechEnabled,
      fullscreenByDefault: typeof settings.fullscreenByDefault === 'boolean' ? settings.fullscreenByDefault : defaultSettings.fullscreenByDefault,
      autoStart: typeof settings.autoStart === 'boolean' ? settings.autoStart : defaultSettings.autoStart,
      autoSwitchSeconds: typeof settings.autoSwitchSeconds === 'number' ? settings.autoSwitchSeconds : defaultSettings.autoSwitchSeconds
    };
  }

  private validateTheme(theme: any): AppSettings['theme'] {
    const defaultTheme = {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#60a5fa',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4'
    };

    if (!theme || typeof theme !== 'object') {
      return defaultTheme;
    }

    return {
      primary: theme.primary || defaultTheme.primary,
      secondary: theme.secondary || defaultTheme.secondary,
      accent: theme.accent || defaultTheme.accent,
      success: theme.success || defaultTheme.success,
      warning: theme.warning || defaultTheme.warning,
      error: theme.error || defaultTheme.error,
      info: theme.info || defaultTheme.info
    };
  }

  private validateAppConfig(app: any): AppSettings['app'] {
    const defaultApp = {
      name: 'Event Timer',
      shortName: 'Timer',
      description: 'Progressive Web App für Event-Timer',
      favicon: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa'
      }
    };

    if (!app || typeof app !== 'object') {
      return defaultApp;
    }

    return {
      name: app.name || defaultApp.name,
      shortName: app.shortName || defaultApp.shortName,
      description: app.description || defaultApp.description,
      favicon: this.validateFaviconTheme(app.favicon)
    };
  }

  private validateFaviconTheme(favicon: any): AppSettings['app']['favicon'] {
    const defaultFavicon = {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#60a5fa'
    };

    if (!favicon || typeof favicon !== 'object') {
      return defaultFavicon;
    }

    return {
      primary: favicon.primary || defaultFavicon.primary,
      secondary: favicon.secondary || defaultFavicon.secondary,
      accent: favicon.accent || defaultFavicon.accent
    };
  }

  private getDefaultSettings(): AppSettings {
    return {
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
        name: 'Event Timer',
        shortName: 'Timer',
        description: 'Progressive Web App für Event-Timer',
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
  }

  private updateFavicon(): void {
    FaviconGenerator.updateFavicon(this.settings.app.favicon);
  }

  public getSettings(): AppSettings {
    return { ...this.settings };
  }

  public getTheme(): AppSettings['theme'] {
    return { ...this.settings.theme };
  }

  public getAppConfig(): AppSettings['app'] {
    return { ...this.settings.app };
  }
}
