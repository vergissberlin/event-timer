import { EventsManager } from '../src/events';
import { Event, EventsData } from '../src/types';

describe('EventsManager', () => {
  let eventsManager: EventsManager;
  let mockEventsData: EventsData;

  beforeEach(() => {
    eventsManager = new EventsManager();
    
    mockEventsData = {
      events: [
        {
          id: 'event-1',
          title: 'Test Event 1',
          startTime: '2025-08-27T10:00:00',
          duration: 3600,
          icon: 'ti ti-calendar',
          background: 'https://example.com/image1.jpg',
          description: 'Test event 1 description'
        },
        {
          id: 'event-2',
          title: 'Test Event 2',
          startTime: '2025-08-27T12:00:00',
          duration: 1800,
          icon: 'ti ti-users',
          background: 'https://example.com/image2.jpg',
          description: 'Test event 2 description'
        },
        {
          id: 'event-3',
          title: 'Test Event 3',
          startTime: '2025-08-27T14:00:00',
          duration: 7200,
          icon: 'ti ti-presentation',
          background: 'https://example.com/image3.jpg',
          description: 'Test event 3 description'
        }
      ]
    };

    // Mock fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadEvents', () => {
    it('should load events successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventsData
      });

      const events = await eventsManager.loadEvents();

      expect(events).toEqual(mockEventsData.events);
      expect(global.fetch).toHaveBeenCalledWith('/data/events.json');
    });

    it('should handle fetch errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(eventsManager.loadEvents()).rejects.toThrow('Network error');
    });

    it('should handle invalid JSON response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'data' })
      });

      await expect(eventsManager.loadEvents()).rejects.toThrow('Invalid events data');
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

  describe('validateEvent', () => {
    it('should validate a valid event', () => {
      const validEvent = mockEventsData.events[0];
      const validated = eventsManager.validateEvent(validEvent);

      expect(validated).toEqual(validEvent);
    });

    it('should handle missing required fields', () => {
      const invalidEvent = {
        id: 'test',
        title: 'Test',
        // Missing startTime and duration
      } as any;

      expect(() => eventsManager.validateEvent(invalidEvent)).toThrow('Event must have startTime');
    });

    it('should handle invalid startTime format', () => {
      const invalidEvent = {
        id: 'test',
        title: 'Test',
        startTime: 'invalid-date',
        duration: 3600
      };

      expect(() => eventsManager.validateEvent(invalidEvent)).toThrow('Invalid startTime format');
    });

    it('should handle invalid duration', () => {
      const invalidEvent = {
        id: 'test',
        title: 'Test',
        startTime: '2025-08-27T10:00:00',
        duration: -100
      };

      expect(() => eventsManager.validateEvent(invalidEvent)).toThrow('Duration must be positive');
    });

    it('should provide default values for optional fields', () => {
      const minimalEvent = {
        id: 'test',
        title: 'Test',
        startTime: '2025-08-27T10:00:00',
        duration: 3600
      };

      const validated = eventsManager.validateEvent(minimalEvent);

      expect(validated.description).toBe('');
      expect(validated.icon).toBeUndefined();
      expect(validated.background).toBeUndefined();
    });
  });

  describe('getEventStatus', () => {
    beforeEach(async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventsData
      });
      await eventsManager.loadEvents();
    });

    it('should return upcoming for future events', () => {
      const futureEvent = {
        ...mockEventsData.events[0],
        startTime: '2025-12-31T23:59:59'
      };

      const status = eventsManager.getEventStatus(futureEvent);
      expect(status).toBe('upcoming');
    });

    it('should return running for current events', () => {
      const now = new Date();
      const currentEvent = {
        ...mockEventsData.events[0],
        startTime: new Date(now.getTime() - 1000).toISOString(), // Started 1 second ago
        duration: 3600
      };

      const status = eventsManager.getEventStatus(currentEvent);
      expect(status).toBe('running');
    });

    it('should return finished for past events', () => {
      const pastEvent = {
        ...mockEventsData.events[0],
        startTime: '2025-01-01T00:00:00',
        duration: 3600
      };

      const status = eventsManager.getEventStatus(pastEvent);
      expect(status).toBe('finished');
    });
  });

  describe('getTimeUntilStart', () => {
    beforeEach(async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventsData
      });
      await eventsManager.loadEvents();
    });

    it('should calculate time until start correctly', () => {
      const futureEvent = {
        ...mockEventsData.events[0],
        startTime: new Date(Date.now() + 7200000).toISOString() // 2 hours from now
      };

      const timeUntilStart = eventsManager.getTimeUntilStart(futureEvent);
      expect(timeUntilStart).toBeCloseTo(7200, -2); // Within 100 seconds
    });

    it('should return 0 for past events', () => {
      const pastEvent = {
        ...mockEventsData.events[0],
        startTime: '2025-01-01T00:00:00'
      };

      const timeUntilStart = eventsManager.getTimeUntilStart(pastEvent);
      expect(timeUntilStart).toBe(0);
    });
  });

  describe('getTimeRemaining', () => {
    beforeEach(async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventsData
      });
      await eventsManager.loadEvents();
    });

    it('should calculate remaining time for running events', () => {
      const now = new Date();
      const runningEvent = {
        ...mockEventsData.events[0],
        startTime: new Date(now.getTime() - 1800000).toISOString(), // Started 30 minutes ago
        duration: 3600
      };

      const timeRemaining = eventsManager.getTimeRemaining(runningEvent);
      expect(timeRemaining).toBeCloseTo(1800, -2); // 30 minutes remaining
    });

    it('should return 0 for finished events', () => {
      const finishedEvent = {
        ...mockEventsData.events[0],
        startTime: '2025-01-01T00:00:00',
        duration: 3600
      };

      const timeRemaining = eventsManager.getTimeRemaining(finishedEvent);
      expect(timeRemaining).toBe(0);
    });

    it('should return full duration for upcoming events', () => {
      const futureEvent = {
        ...mockEventsData.events[0],
        startTime: new Date(Date.now() + 7200000).toISOString() // 2 hours from now
      };

      const timeRemaining = eventsManager.getTimeRemaining(futureEvent);
      expect(timeRemaining).toBe(3600); // Full duration
    });
  });

  describe('formatDuration', () => {
    it('should format duration correctly', () => {
      expect(eventsManager.formatDuration(3661)).toBe('1:01:01');
      expect(eventsManager.formatDuration(3600)).toBe('1:00:00');
      expect(eventsManager.formatDuration(61)).toBe('0:01:01');
      expect(eventsManager.formatDuration(1)).toBe('0:00:01');
      expect(eventsManager.formatDuration(0)).toBe('0:00:00');
    });

    it('should handle large durations', () => {
      expect(eventsManager.formatDuration(36661)).toBe('10:11:01');
    });
  });

  describe('formatDateTime', () => {
    it('should format datetime correctly', () => {
      const dateString = '2025-08-27T14:30:00';
      const formatted = eventsManager.formatDateTime(dateString);
      
      expect(formatted).toMatch(/27\.08\.2025/);
      expect(formatted).toMatch(/14:30/);
    });

    it('should handle invalid date strings', () => {
      expect(() => eventsManager.formatDateTime('invalid-date')).toThrow();
    });
  });

  describe('getNextEvent', () => {
    beforeEach(async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventsData
      });
      await eventsManager.loadEvents();
    });

    it('should return the next upcoming event', () => {
      const nextEvent = eventsManager.getNextEvent(mockEventsData.events);
      
      // Should return the event with the earliest future start time
      expect(nextEvent).toBeDefined();
      expect(nextEvent?.id).toBe('event-1');
    });

    it('should return null when no upcoming events', () => {
      const pastEvents = mockEventsData.events.map(event => ({
        ...event,
        startTime: '2025-01-01T00:00:00'
      }));

      const nextEvent = eventsManager.getNextEvent(pastEvents);
      expect(nextEvent).toBeNull();
    });

    it('should handle empty events array', () => {
      const nextEvent = eventsManager.getNextEvent([]);
      expect(nextEvent).toBeNull();
    });
  });

  describe('getCurrentEvent', () => {
    beforeEach(async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventsData
      });
      await eventsManager.loadEvents();
    });

    it('should return the currently running event', () => {
      const now = new Date();
      const runningEvent = {
        ...mockEventsData.events[0],
        startTime: new Date(now.getTime() - 1800000).toISOString(), // Started 30 minutes ago
        duration: 3600
      };

      const events = [runningEvent];
      const currentEvent = eventsManager.getCurrentEvent(events);
      
      expect(currentEvent).toBeDefined();
      expect(currentEvent?.id).toBe(runningEvent.id);
    });

    it('should return null when no running events', () => {
      const currentEvent = eventsManager.getCurrentEvent(mockEventsData.events);
      expect(currentEvent).toBeNull();
    });

    it('should handle empty events array', () => {
      const currentEvent = eventsManager.getCurrentEvent([]);
      expect(currentEvent).toBeNull();
    });
  });

  describe('preloadImages', () => {
    it('should preload images successfully', async () => {
      const mockImage = {
        src: '',
        onload: null as any,
        onerror: null as any,
      };

      // Mock Image constructor
      global.Image = jest.fn().mockImplementation(() => mockImage);

      const events = [
        {
          id: 'test',
          title: 'Test',
          startTime: '2025-08-27T10:00:00',
          duration: 3600,
          background: 'https://example.com/image.jpg'
        }
      ];

      const preloadPromise = eventsManager.preloadImages(events);
      
      // Simulate successful image load
      setTimeout(() => {
        if (mockImage.onload) mockImage.onload();
      }, 0);

      await preloadPromise;
      expect(global.Image).toHaveBeenCalled();
    });

    it('should handle image load errors gracefully', async () => {
      const mockImage = {
        src: '',
        onload: null as any,
        onerror: null as any,
      };

      global.Image = jest.fn().mockImplementation(() => mockImage);

      const events = [
        {
          id: 'test',
          title: 'Test',
          startTime: '2025-08-27T10:00:00',
          duration: 3600,
          background: 'https://example.com/invalid.jpg'
        }
      ];

      const preloadPromise = eventsManager.preloadImages(events);
      
      // Simulate image load error
      setTimeout(() => {
        if (mockImage.onerror) mockImage.onerror();
      }, 0);

      await preloadPromise; // Should not throw
      expect(global.Image).toHaveBeenCalled();
    });

    it('should handle events without backgrounds', async () => {
      const events = [
        {
          id: 'test',
          title: 'Test',
          startTime: '2025-08-27T10:00:00',
          duration: 3600
          // No background
        }
      ];

      await expect(eventsManager.preloadImages(events)).resolves.toBeUndefined();
    });
  });

  describe('getEvents', () => {
    it('should return loaded events', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventsData
      });

      await eventsManager.loadEvents();
      const events = eventsManager.getEvents();

      expect(events).toEqual(mockEventsData.events);
    });

    it('should return empty array when no events loaded', () => {
      const events = eventsManager.getEvents();
      expect(events).toEqual([]);
    });
  });
});
