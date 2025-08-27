import { Event, EventsData } from './types';

export class EventsManager {
  private events: Event[] = [];
  private dataUrl: string;

  constructor(dataUrl: string = '/data/events.json') {
    this.dataUrl = dataUrl;
  }

  public async loadEvents(): Promise<Event[]> {
    try {
      const response = await fetch(this.dataUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: EventsData = await response.json();
      
      // Validate data structure
      if (!data.events || !Array.isArray(data.events)) {
        throw new Error('Invalid events data structure');
      }
      
      this.events = data.events.map(event => this.validateEvent(event));
      
      console.log(`Loaded ${this.events.length} events`);
      return this.events;
      
    } catch (error) {
      console.error('Failed to load events:', error);
      // Return default events if loading fails
      return this.getDefaultEvents();
    }
  }

  private validateEvent(event: any): Event {
    // Ensure all required fields are present
    const validatedEvent: Event = {
      id: event.id || `event-${Date.now()}`,
      title: event.title || 'Unbekanntes Event',
      startTime: event.startTime || new Date().toISOString(),
      duration: Math.max(1, event.duration || 300), // Minimum 1 second
      description: event.description || 'Keine Beschreibung verfügbar'
    };

    // Optional fields
    if (event.icon) {
      validatedEvent.icon = event.icon;
    }
    
    if (event.background) {
      validatedEvent.background = event.background;
    }

    return validatedEvent;
  }



  private getDefaultEvents(): Event[] {
    return [
      {
        id: 'default-presentation',
        title: 'Standard Präsentation',
        startTime: new Date().toISOString(),
        duration: 1800,
        description: '30-minütige Standard-Präsentation'
      },
      {
        id: 'default-break',
        title: 'Pause',
        startTime: new Date().toISOString(),
        duration: 900,
        description: '15-minütige Pause'
      }
    ];
  }



  public getEventById(id: string): Event | undefined {
    return this.events.find(event => event.id === id);
  }



  public async preloadImages(): Promise<void> {
    const imagePromises: Promise<void>[] = [];
    
    this.events.forEach(event => {
      if (event.background) {
        imagePromises.push(this.preloadImage(event.background));
      }
    });

    try {
      await Promise.all(imagePromises);
      console.log('All images preloaded successfully');
    } catch (error) {
      console.warn('Some images failed to preload:', error);
    }
  }

  private preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  public getEventsByCategory(category?: string): Event[] {
    if (!category) return this.getEvents();
    
    // Simple category filtering - can be extended
    return this.events.filter(event => 
      event.title.toLowerCase().includes(category.toLowerCase()) ||
      event.description.toLowerCase().includes(category.toLowerCase())
    );
  }

  public getEventsByDuration(minDuration?: number, maxDuration?: number): Event[] {
    return this.events.filter(event => {
      if (minDuration && event.duration < minDuration) return false;
      if (maxDuration && event.duration > maxDuration) return false;
      return true;
    });
  }

  public formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      if (minutes > 0) {
        return `${hours}h ${minutes}min`;
      } else {
        return `${hours}h`;
      }
    } else {
      return `${minutes}min`;
    }
  }

  public getDurationDescription(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} Stunde${hours > 1 ? 'n' : ''} ${minutes > 0 ? `${minutes} Minute${minutes > 1 ? 'n' : ''}` : ''}`;
    } else {
      return `${minutes} Minute${minutes > 1 ? 'n' : ''}`;
    }
  }

  public getEventStatus(event: Event): 'upcoming' | 'running' | 'finished' {
    const now = new Date();
    const startTime = new Date(event.startTime);
    const endTime = new Date(startTime.getTime() + event.duration * 1000);

    if (now < startTime) {
      return 'upcoming';
    } else if (now >= startTime && now < endTime) {
      return 'running';
    } else {
      return 'finished';
    }
  }

  public getTimeUntilStart(event: Event): number {
    const now = new Date();
    const startTime = new Date(event.startTime);
    return Math.max(0, Math.floor((startTime.getTime() - now.getTime()) / 1000));
  }

  public getTimeRemaining(event: Event): number {
    const now = new Date();
    const startTime = new Date(event.startTime);
    const endTime = new Date(startTime.getTime() + event.duration * 1000);
    return Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000));
  }

  public formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleString('de-DE', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  public getNextEvent(events: Event[]): Event | null {
    const now = new Date();
    const upcomingEvents = events
      .filter(event => new Date(event.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  }

  public getCurrentEvent(events: Event[]): Event | null {
    const now = new Date();
    return events.find(event => {
      const startTime = new Date(event.startTime);
      const endTime = new Date(startTime.getTime() + event.duration * 1000);
      return now >= startTime && now < endTime;
    }) || null;
  }

  public getEvents(): Event[] {
    return this.events || [];
  }
}