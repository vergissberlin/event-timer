import { AppSettings } from './types';

export class SettingsManager {
  private settings: AppSettings;
  private settingsUrl: string;

  constructor(settingsUrl?: string) {
    // Basis-URL aus <base> Tag ermitteln, um lokal und auf GitHub Pages zu funktionieren
    if (settingsUrl) {
      this.settingsUrl = settingsUrl;
    } else {
      const baseHref = (document.querySelector('base')?.getAttribute('href') || '/').replace(/\/$/, '');
      this.settingsUrl = `${baseHref}/data/settings.json`;
    }
    this.settings = this.getDefaultSettings();
  }

  public async loadSettings(): Promise<AppSettings> {
    try {
      const response = await fetch(this.settingsUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: any = await response.json();
      
      // Validate data structure - settings can be either at root level or in a 'settings' property
      const settingsData = data.settings || data;
      
      if (!settingsData || typeof settingsData !== 'object') {
        throw new Error('Invalid settings data structure');
      }
      
      this.settings = this.validateSettings(settingsData);
      
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

  private validateSettings(data: any): AppSettings {
    if (!data || typeof data !== 'object') {
      return this.getDefaultSettings();
    }
    
    return {
      app: {
        name: data.app?.name || 'Event Timer',
        shortName: data.app?.shortName || 'Timer',
        description: data.app?.description || 'Progressive Web App für Event-Timer'
      },
      audioEnabled: typeof data.audioEnabled === 'boolean' ? data.audioEnabled : true,
      speechEnabled: typeof data.speechEnabled === 'boolean' ? data.speechEnabled : true,
      autoStart: typeof data.autoStart === 'boolean' ? data.autoStart : false,
      autoSwitchSeconds: typeof data.autoSwitchSeconds === 'number' ? data.autoSwitchSeconds : 30,
      showBreakTimes: typeof data.showBreakTimes === 'boolean' ? data.showBreakTimes : true
    };
  }

  private getDefaultSettings(): AppSettings {
    return {
      app: {
        name: 'Event Timer',
        shortName: 'Timer',
        description: 'Progressive Web App für Event-Timer'
      },
      audioEnabled: true,
      speechEnabled: true,
      autoStart: false,
      autoSwitchSeconds: 30,
      showBreakTimes: true
    };
  }

  private updateFavicon(): void {
    // Favicon update is now handled differently
    // This method can be removed or simplified
  }

  public getSettings(): AppSettings {
    return this.settings;
  }

  public updateSettings(newSettings: AppSettings): void {
    this.settings = newSettings;
    // Save to localStorage for persistence
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
  }

  public getAppConfig(): AppSettings['app'] {
    return { ...this.settings.app };
  }
}
