import { EventsManager } from '../src/events';
import { Event } from '../src/types';

describe('EventsManager', () => {
  let eventsManager: EventsManager;

  beforeEach(() => {
    eventsManager = new EventsManager();
  });

  const mockEventsData = {
    events: [
      {
        id: 'event-1',
        title: 'Test Event 1',
        startTime: '2025-08-27T10:00:00',
        duration: 3600,
        description: 'Test description 1'
      },
      {
        id: 'event-2',
        title: 'Test Event 2',
        startTime: '2025-08-27T12:00:00',
        duration: 1800,
        description: 'Test description 2'
      }
    ]
  };

  describe('loadEvents', () => {
    it('should load events successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventsData
      });

      const events = await eventsManager.loadEvents();

      expect(events).toHaveLength(2);
      expect(events[0].title).toBe('Test Event 1');
      expect(events[1].title).toBe('Test Event 2');
    });

    it('should handle empty events array', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: [] })
      });

      const events = await eventsManager.loadEvents();

      expect(events).toEqual([]);
    });
  });



  describe('formatDuration', () => {
    it('should format duration correctly', () => {
      expect(eventsManager.formatDuration(0)).toBe('0min');
      expect(eventsManager.formatDuration(60)).toBe('1min');
      expect(eventsManager.formatDuration(3600)).toBe('1h');
      expect(eventsManager.formatDuration(5400)).toBe('1h 30min');
      expect(eventsManager.formatDuration(7200)).toBe('2h');
    });

    it('should handle large durations', () => {
      expect(eventsManager.formatDuration(86400)).toBe('24h');
      expect(eventsManager.formatDuration(90000)).toBe('25h');
    });
  });

  describe('getEvents', () => {
    it('should return loaded events', () => {
      const events = eventsManager.getEvents();
      expect(Array.isArray(events)).toBe(true);
    });

    it('should return empty array when no events loaded', () => {
      const events = eventsManager.getEvents();
      expect(events).toEqual([]);
    });
  });
});
