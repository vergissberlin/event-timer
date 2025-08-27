import { EventsManager } from '../src/events';
import { SettingsManager } from '../src/settings';

describe('Base-Pfad Integration (Astro <base>)', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    const base = document.createElement('base');
    base.setAttribute('href', '/event-timer/');
    document.head.appendChild(base);
  });

  it('EventsManager nutzt Base-Href für Datenpfad', async () => {
    const em = new EventsManager();
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({ events: [] }) });
    await em.loadEvents();
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe('/event-timer/data/events.json');
  });

  it('SettingsManager nutzt Base-Href für Einstellungen', async () => {
    const sm = new SettingsManager();
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    await sm.loadSettings();
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe('/event-timer/data/settings.json');
  });
});


