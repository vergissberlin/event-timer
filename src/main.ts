import { Timer } from './timer';
import { AudioManager } from './audio';
import { EventsManager } from './events';
import { SettingsManager } from './settings';
import QRCode from 'qrcode';
import { Event, TimerCallbacks } from './types';

// Global type declaration
declare global {
  interface Window {
    eventTimerApp?: EventTimerApp;
  }
}

class EventTimerApp {
  private eventsManager: EventsManager;
  private settingsManager: SettingsManager;
  public audioManager: AudioManager;
  private currentTimer: Timer | null = null;
  private currentEvent: Event | null = null;
  private isFullscreen: boolean = false;
  private autoSwitchInterval: NodeJS.Timeout | null = null;

  // DOM Elements
  private loadingElement!: HTMLElement;
  private appElement!: HTMLElement;
  private eventSelectionElement!: HTMLElement;
  private timerScreenElement!: HTMLElement;
  private eventTableBody!: HTMLElement;
  private timerElement!: HTMLElement;
  private timerBackgroundElement!: HTMLElement;
  private eventTitleElement!: HTMLElement;
  private countdownTimerElement!: HTMLElement;
  private timelineBarElement!: HTMLElement;
  private currentTimeMarkerElement!: HTMLElement;
  private currentTimeDisplayElement!: HTMLElement;
  private hourMarkersElement!: HTMLElement;
  private themeToggleBtn!: HTMLButtonElement;
  private fullscreenBtnOverview!: HTMLButtonElement;
  private shareBtn!: HTMLButtonElement;
  private shareBtnTimer!: HTMLButtonElement;
  private qrModal!: HTMLElement;
  private closeQrModal!: HTMLButtonElement;
  private copyUrlBtn!: HTMLButtonElement;
  private downloadQrBtn!: HTMLButtonElement;
  private qrCode!: HTMLElement;
  private startBtn!: HTMLButtonElement;
  private pauseBtn!: HTMLButtonElement;
  private resetBtn!: HTMLButtonElement;
  private fullscreenBtn!: HTMLButtonElement;
  private backBtn!: HTMLButtonElement;
  private closeBtn!: HTMLButtonElement;
  private appTitle!: HTMLElement;
  private eventStatusInfo!: HTMLElement;
  private eventEndedMessage!: HTMLElement;
  private nextEventInfo!: HTMLElement;
  private nextEventTitle!: HTMLElement;
  private nextEventCountdown!: HTMLElement;
  private goToNextEventBtn!: HTMLButtonElement;

  constructor() {
    this.eventsManager = new EventsManager();
    this.settingsManager = new SettingsManager();
    this.audioManager = new AudioManager();
    
    this.initializeDOMElements();
    this.bindEventListeners();
    this.initializeApp();
  }

  private initializeDOMElements(): void {
    this.loadingElement = document.getElementById('loading')!;
    this.appElement = document.getElementById('app')!;
    this.eventSelectionElement = document.getElementById('eventSelection')!;
    this.timerScreenElement = document.getElementById('timerScreen')!;
    this.eventTableBody = document.getElementById('eventTableBody')!;
    this.timerElement = document.getElementById('timer')!;
    this.timerBackgroundElement = document.getElementById('timerBackground')!;
    this.eventTitleElement = document.getElementById('eventTitle')!;
    this.countdownTimerElement = document.getElementById('countdownTimer')!;
    this.timelineBarElement = document.getElementById('timelineBar')!;
    this.currentTimeMarkerElement = document.getElementById('currentTimeMarker')!;
    this.currentTimeDisplayElement = document.getElementById('currentTimeDisplay')!;
    this.hourMarkersElement = document.getElementById('hourMarkers')!;
    this.themeToggleBtn = document.getElementById('themeToggle') as HTMLButtonElement;
    this.fullscreenBtnOverview = document.getElementById('fullscreenBtnOverview') as HTMLButtonElement;
    this.shareBtn = document.getElementById('shareBtn') as HTMLButtonElement;
    this.shareBtnTimer = document.getElementById('shareBtnTimer') as HTMLButtonElement;
    this.qrModal = document.getElementById('qrModal')!;
    this.closeQrModal = document.getElementById('closeQrModal') as HTMLButtonElement;
    this.copyUrlBtn = document.getElementById('copyUrlBtn') as HTMLButtonElement;
    this.downloadQrBtn = document.getElementById('downloadQrBtn') as HTMLButtonElement;
    this.qrCode = document.getElementById('qrCode')!;
    this.startBtn = document.getElementById('startBtn') as HTMLButtonElement;
    this.pauseBtn = document.getElementById('pauseBtn') as HTMLButtonElement;
    this.resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
    this.fullscreenBtn = document.getElementById('fullscreenBtn') as HTMLButtonElement;
    this.backBtn = document.getElementById('backBtn') as HTMLButtonElement;
    this.closeBtn = document.getElementById('closeBtn') as HTMLButtonElement;
    this.appTitle = document.getElementById('appTitle')!;
    this.eventStatusInfo = document.getElementById('eventStatusInfo')!;
    this.eventEndedMessage = document.getElementById('eventEndedMessage')!;
    this.nextEventInfo = document.getElementById('nextEventInfo')!;
    this.nextEventTitle = document.getElementById('nextEventTitle')!;
    this.nextEventCountdown = document.getElementById('nextEventCountdown')!;
    this.goToNextEventBtn = document.getElementById('goToNextEventBtn') as HTMLButtonElement;
  }

  private bindEventListeners(): void {
    this.startBtn.addEventListener('click', () => this.startTimer());
    this.pauseBtn.addEventListener('click', () => this.pauseTimer());
    this.resetBtn.addEventListener('click', () => this.resetTimer());
    this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    this.backBtn.addEventListener('click', () => this.showEventSelection());
    this.closeBtn.addEventListener('click', () => this.showEventSelection());
    this.goToNextEventBtn.addEventListener('click', () => this.goToNextEvent());
    this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    this.fullscreenBtnOverview.addEventListener('click', () => this.toggleFullscreen());
    this.shareBtn.addEventListener('click', () => this.showQrModal());
    this.shareBtnTimer.addEventListener('click', () => this.showQrModal());
    this.closeQrModal.addEventListener('click', () => this.hideQrModal());
    this.copyUrlBtn.addEventListener('click', () => this.copyUrl());
    this.downloadQrBtn.addEventListener('click', () => this.downloadQrCode());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.toggleTimer();
      } else if (e.code === 'KeyR') {
        this.resetTimer();
      } else if (e.code === 'KeyF') {
        this.toggleFullscreen();
      } else if (e.code === 'Escape') {
        if (this.isFullscreen) {
          this.exitFullscreen();
        } else {
          this.showEventSelection();
        }
      }
    });

    // Fullscreen change events
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement;
      this.updateFullscreenButton();
      // Adjust timer font size when fullscreen changes
      if (this.currentTimer) {
        this.adjustTimerFontSize();
      }
    });

    // Window resize events
    window.addEventListener('resize', () => {
      if (this.currentTimer) {
        this.adjustTimerFontSize();
      }
    });

    // Browser back/forward navigation
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });
  }

  private async initializeApp(): Promise<void> {
    try {
      // Initialize theme
      this.initializeTheme();
      
      // Load settings and update app title
      const settings = await this.settingsManager.loadSettings();
      this.updateAppTitle(settings.app.name);
      this.updateManifest(settings.app);
      
      // Load events
      const events = await this.eventsManager.loadEvents();
      
      // Preload images
      await this.eventsManager.preloadImages();
      
      // Render event grid
      this.renderEventGrid(events);
      
      // Initialize routing
      this.initializeRouting(events);
      
      // Start auto-switch timer
      this.startAutoSwitchTimer();
      
      // Show app
      this.loadingElement.classList.add('hidden');
      this.appElement.classList.remove('hidden');
      
      console.log('Event Timer App initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.showError('Fehler beim Laden der Events');
    }
  }

  private renderEventGrid(events: Event[]): void {
    this.eventTableBody.innerHTML = '';
    
    events.forEach(event => {
      const eventRow = this.createEventRow(event);
      this.eventTableBody.appendChild(eventRow);
    });
    
    // Render timeline
    this.renderTimeline(events);
    
    // Render hour markers
    this.renderHourMarkers();
    
    // Update current time marker and display
    this.updateCurrentTimeMarker();
    
    // Update current time marker and display every minute
    setInterval(() => {
      this.updateCurrentTimeMarker();
    }, 60000);
  }

  private createEventRow(event: Event): HTMLElement {
    const row = document.createElement('tr');
    row.className = 'border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer';
    row.setAttribute('data-event-id', event.id);
    
    const duration = this.eventsManager.formatDuration(event.duration);
    const status = this.eventsManager.getEventStatus(event);
    const dateTime = this.eventsManager.formatDateTime(event.startTime);
    
    // Check if this is the next upcoming event
    const events = this.eventsManager.getEvents();
    const nextEvent = this.eventsManager.getNextEvent(events);
    const isNextEvent = nextEvent && nextEvent.id === event.id;
    
    let statusClass = '';
    let statusText = '';
    let rowBackgroundClass = '';
    let buttonDisabled = false;
    let buttonClass = 'px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors';
    
    switch (status) {
      case 'upcoming':
        statusClass = 'text-blue-400';
        statusText = 'Geplant';
        if (isNextEvent) {
          rowBackgroundClass = 'bg-blue-50 dark:bg-blue-900/20';
        }
        break;
      case 'running':
        statusClass = 'text-green-400';
        statusText = 'Läuft';
        break;
      case 'finished':
        statusClass = 'text-gray-500';
        statusText = 'Beendet';
        buttonDisabled = true;
        buttonClass = 'px-3 py-1 text-sm bg-gray-400 text-gray-200 rounded cursor-not-allowed';
        break;
    }
    
    row.className = `border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer ${rowBackgroundClass}`;
    
    row.innerHTML = `
      <td class="px-4 py-3">
        ${event.icon ? `<i class="${event.icon} text-xl text-gray-600 dark:text-gray-300"></i>` : '<i class="ti ti-calendar text-xl text-gray-500"></i>'}
      </td>
      <td class="px-4 py-3">
        <div>
          <div class="font-semibold text-gray-900 dark:text-white">${event.title}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">${event.description}</div>
        </div>
      </td>
      <td class="px-4 py-3 text-gray-700 dark:text-gray-300">${dateTime}</td>
      <td class="px-4 py-3 text-gray-700 dark:text-gray-300">${duration}</td>
      <td class="px-4 py-3">
        <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusClass} bg-opacity-20">
          ${statusText}
        </span>
      </td>
      <td class="px-4 py-3">
        <button class="${buttonClass}" ${buttonDisabled ? 'disabled' : ''}>
          Starten
        </button>
      </td>
    `;
    
    // Add hover event listeners for timeline highlighting
    row.addEventListener('mouseenter', () => this.highlightTimelineSlot(event.id));
    row.addEventListener('mouseleave', () => this.unhighlightTimelineSlot(event.id));
    
    // Only allow clicking if event is not finished
    if (!buttonDisabled) {
      row.addEventListener('click', () => this.selectEvent(event));
    }
    
    return row;
  }

  private selectEvent(event: Event): void {
    this.currentEvent = event;
    
    // Stop auto-switch timer when manually selecting an event
    this.stopAutoSwitchTimer();
    
    this.navigateToEvent(event.id);
  }

  private navigateToEvent(eventId: string): void {
    const url = `/event-timer/event/${eventId}`;
    window.history.pushState({ eventId }, '', url);
    this.showTimerScreen();
    this.initializeTimer();
  }

  private showTimerScreen(): void {
    this.eventSelectionElement.classList.add('hidden');
    this.timerScreenElement.classList.remove('hidden');
    
    this.updateTimerScreen();
    
    // Adjust timer font size after screen is shown
    setTimeout(() => {
      this.adjustTimerFontSize();
    }, 100);
  }

  private showEventSelection(): void {
    this.timerScreenElement.classList.add('hidden');
    this.eventSelectionElement.classList.remove('hidden');
    
    if (this.currentTimer) {
      this.currentTimer.stop();
      this.currentTimer = null;
    }
    
    this.currentEvent = null;
    
    // Restart auto-switch timer for overview
    this.startAutoSwitchTimer();
    
    // Update URL to root (with subdirectory)
    window.history.pushState({}, '', '/event-timer/');
  }

  private updateTimerScreen(): void {
    if (!this.currentEvent) return;
    
    // Update background
    if (this.currentEvent.background) {
      this.timerBackgroundElement.style.backgroundImage = `url(${this.currentEvent.background})`;
    } else {
      this.timerBackgroundElement.style.backgroundImage = 'none';
    }
    
    // Update event title with icon
    const titleElement = this.eventTitleElement.querySelector('h2');
    if (titleElement) {
      const icon = this.currentEvent.icon || 'ti ti-calendar';
      titleElement.innerHTML = `<i class="${icon} mr-4 text-4xl md:text-6xl"></i>${this.currentEvent.title}`;
    }
    
    // Update event status info
    this.updateEventStatusInfo();
  }



  private initializeTimer(): void {
    if (!this.currentEvent) return;
    
    const callbacks: TimerCallbacks = {
      onTick: (timeRemaining: number) => this.updateTimerDisplay(timeRemaining),
      onWarning: () => this.handleWarning(),
      onEnd: () => this.handleTimerEnd(),
      onEventStart: () => this.handleEventStart(),
      onPause: () => this.updateTimerStatus('Pausiert'),
      onResume: () => this.updateTimerStatus('Läuft'),
      onReset: () => this.updateTimerStatus('Bereit zum Starten')
    };
    
    // Calculate time remaining based on start time
    const timeRemaining = this.eventsManager.getTimeRemaining(this.currentEvent);
    const timeUntilStart = this.eventsManager.getTimeUntilStart(this.currentEvent);
    
    if (timeUntilStart > 0) {
      // Event hasn't started yet, show countdown to start
              this.currentTimer = new Timer(timeUntilStart, callbacks, this.audioManager);
      
      // Show event duration in main timer, countdown in small timer
      this.timerElement.textContent = this.currentTimer.formatTime(this.currentEvent.duration);
      this.countdownTimerElement.textContent = this.currentTimer.formatTime(timeUntilStart);
      
      this.updateTimerStatus(`Startet in ${this.eventsManager.formatDuration(timeUntilStart)}`);
      
      // Show countdown UI
      this.showCountdownUI();
      
      // Auto-start countdown
      this.currentTimer.start();
      
    } else {
      // Event is running or finished
      this.currentTimer = new Timer(timeRemaining, callbacks, this.audioManager);
      this.updateTimerDisplay(timeRemaining);
      
      // Hide countdown UI
      this.hideCountdownUI();
      
      if (timeRemaining > 0) {
        this.updateTimerStatus('Läuft');
        // Auto-start if event is currently running
        if (this.settingsManager.getSettings().autoStart) {
          this.currentTimer.start();
        }
      } else {
        this.updateTimerStatus('Beendet');
      }
    }
  }

  private updateTimerDisplay(timeRemaining: number): void {
    if (!this.currentTimer) return;
    
    const formattedTime = this.currentTimer.formatTime(timeRemaining);
    
    // Check if we're in countdown mode
    const countdownSection = this.eventTitleElement.querySelector('#countdownSection');
    if (countdownSection && !countdownSection.classList.contains('hidden')) {
      // Update countdown timer, keep main timer showing event duration
      this.countdownTimerElement.textContent = formattedTime;
    } else {
      // Update main timer
      this.timerElement.textContent = formattedTime;
      // Adjust font size to fit container
      this.adjustTimerFontSize();
    }
    
    // Check if event is finished
    if (this.currentEvent) {
      const status = this.eventsManager.getEventStatus(this.currentEvent);
      if (status === 'finished') {
        // Dim the timer for finished events
        this.timerElement.style.color = '#6b7280'; // Gray color for finished events
        this.timerElement.style.opacity = '0.5';
        this.timerElement.classList.remove('timer-warning');
        return;
      } else {
        // Reset timer styling for active events
        this.timerElement.style.opacity = '1';
      }
    }
    
    // Add warning class for last minute and last 10 seconds
    if ((timeRemaining <= 60 && timeRemaining > 0) || (timeRemaining <= 10 && timeRemaining > 0)) {
      this.timerElement.classList.add('timer-warning');
      this.timerElement.style.color = '#ef4444'; // Red color for warning
    } else {
      this.timerElement.classList.remove('timer-warning');
      this.timerElement.style.color = '#ffffff'; // White color normal
    }
  }

  private adjustTimerFontSize(): void {
    const timerElement = this.timerElement;
    const container = this.timerScreenElement;
    
    if (!timerElement || !container) return;
    
    // Reset font size to start calculation
    timerElement.style.fontSize = '1px';
    
    // Get container dimensions
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Calculate optimal font size (80% of container to leave some margin)
    const maxWidth = containerWidth * 0.8;
    const maxHeight = containerHeight * 0.8;
    
    // Start with a reasonable font size
    let fontSize = Math.min(maxWidth / 8, maxHeight); // 8 characters for HH:MM:SS
    
    // Binary search for the best font size
    let minSize = 1;
    let maxSize = fontSize * 2;
    
    while (minSize <= maxSize) {
      fontSize = Math.floor((minSize + maxSize) / 2);
      timerElement.style.fontSize = `${fontSize}px`;
      
      const rect = timerElement.getBoundingClientRect();
      
      if (rect.width <= maxWidth && rect.height <= maxHeight) {
        minSize = fontSize + 1;
      } else {
        maxSize = fontSize - 1;
      }
    }
    
    // Set final font size
    timerElement.style.fontSize = `${maxSize}px`;
  }
  
  private showCountdownUI(): void {
    const countdownSection = this.eventTitleElement.querySelector('#countdownSection');
    if (countdownSection) {
      countdownSection.classList.remove('hidden');
    }
  }
  
  private hideCountdownUI(): void {
    const countdownSection = this.eventTitleElement.querySelector('#countdownSection');
    if (countdownSection) {
      countdownSection.classList.add('hidden');
    }
  }

  private renderTimeline(events: Event[]): void {
    this.timelineBarElement.innerHTML = '';
    
    // Sort events by start time
    const sortedEvents = events.sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    
    sortedEvents.forEach(event => {
      const eventSlot = this.createEventSlot(event);
      this.timelineBarElement.appendChild(eventSlot);
    });
  }

  private renderHourMarkers(): void {
    this.hourMarkersElement.innerHTML = '';
    
    // Create markers for each hour (0-24)
    for (let hour = 0; hour <= 24; hour++) {
      const marker = document.createElement('div');
      const position = (hour / 24) * 100;
      
      marker.className = 'absolute top-0 h-full w-px bg-gray-400 dark:bg-gray-500 opacity-50';
      marker.style.left = `${position}%`;
      
      this.hourMarkersElement.appendChild(marker);
    }
  }

  private createEventSlot(event: Event): HTMLElement {
    const slot = document.createElement('div');
    
    // Calculate position and width based on start time and duration
    const startTime = new Date(event.startTime);
    const startHour = startTime.getHours() + startTime.getMinutes() / 60;
    const durationHours = event.duration / 3600;
    
    const leftPosition = (startHour / 24) * 100;
    const width = (durationHours / 24) * 100;
    
    // Get status for color
    const status = this.eventsManager.getEventStatus(event);
    let bgColor = 'bg-gray-500';
    
    switch (status) {
      case 'upcoming':
        bgColor = 'bg-blue-500';
        break;
      case 'running':
        bgColor = 'bg-green-500';
        break;
      case 'finished':
        bgColor = 'bg-gray-600';
        break;
    }
    
    slot.className = `absolute h-full ${bgColor} rounded-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer`;
    slot.setAttribute('data-event-id', event.id);
    slot.setAttribute('data-status', status);
    slot.style.left = `${leftPosition}%`;
    slot.style.width = `${width}%`;
    slot.style.minWidth = '2px';
    
    // Add tooltip
    slot.title = `${event.title} (${this.eventsManager.formatDateTime(event.startTime)} - ${this.eventsManager.formatDuration(event.duration)})`;
    
    // Add hover event listeners for table row highlighting
    slot.addEventListener('mouseenter', () => this.highlightTableRow(event.id));
    slot.addEventListener('mouseleave', () => this.unhighlightTableRow(event.id));
    
    // Add click handler
    slot.addEventListener('click', () => this.selectEvent(event));
    
    return slot;
  }

  private updateCurrentTimeMarker(): void {
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    const position = (currentHour / 24) * 100;
    
    // Update marker position
    this.currentTimeMarkerElement.style.left = `${position}%`;
    
    // Update time display position and content
    this.currentTimeDisplayElement.style.left = `${position}%`;
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.currentTimeDisplayElement.textContent = `${hours}:${minutes}`;
  }

  private initializeTheme(): void {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  private toggleTheme(): void {
    const isDark = document.documentElement.classList.contains('dark');
    
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }

  private showQrModal(): void {
    this.generateQrCode();
    this.qrModal.classList.remove('hidden');
  }

  private hideQrModal(): void {
    this.qrModal.classList.add('hidden');
  }

  private async generateQrCode(): Promise<void> {
    try {
      // Determine the correct URL based on current context
      let targetUrl: string;
      
      if (this.currentEvent) {
        // On detail page, generate QR code for the specific event
        const eventUrl = `${window.location.origin}/event/${this.currentEvent.id}`;
        targetUrl = eventUrl;
      } else {
        // On overview page, generate QR code for the overview
        targetUrl = window.location.href;
      }
      
      const qrDataUrl = await QRCode.toDataURL(targetUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      this.qrCode.innerHTML = `<img src="${qrDataUrl}" alt="QR Code" class="w-full h-auto">`;
    } catch (error) {
      console.error('Error generating QR code:', error);
      this.qrCode.innerHTML = '<p class="text-red-500">Fehler beim Generieren des QR-Codes</p>';
    }
  }

  private async copyUrl(): Promise<void> {
    try {
      // Determine the correct URL based on current context
      let targetUrl: string;
      
      if (this.currentEvent) {
        // On detail page, copy the specific event URL
        const eventUrl = `${window.location.origin}/event/${this.currentEvent.id}`;
        targetUrl = eventUrl;
      } else {
        // On overview page, copy the current URL
        targetUrl = window.location.href;
      }
      
      await navigator.clipboard.writeText(targetUrl);
      this.copyUrlBtn.innerHTML = '<i class="ti ti-check mr-2"></i>Kopiert!';
      setTimeout(() => {
        this.copyUrlBtn.innerHTML = '<i class="ti ti-copy mr-2"></i>URL kopieren';
      }, 2000);
    } catch (error) {
      console.error('Error copying URL:', error);
      this.copyUrlBtn.innerHTML = '<i class="ti ti-x mr-2"></i>Fehler!';
      setTimeout(() => {
        this.copyUrlBtn.innerHTML = '<i class="ti ti-copy mr-2"></i>URL kopieren';
      }, 2000);
    }
  }

  private async downloadQrCode(): Promise<void> {
    try {
      // Determine the correct URL based on current context
      let targetUrl: string;
      
      if (this.currentEvent) {
        // On detail page, generate QR code for the specific event
        const eventUrl = `${window.location.origin}/event/${this.currentEvent.id}`;
        targetUrl = eventUrl;
      } else {
        // On overview page, generate QR code for the overview
        targetUrl = window.location.href;
      }
      
      const qrDataUrl = await QRCode.toDataURL(targetUrl, {
        width: 400,
        margin: 4,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      const link = document.createElement('a');
      link.download = 'event-timer-qr.png';
      link.href = qrDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      this.downloadQrBtn.innerHTML = '<i class="ti ti-x mr-2"></i>Fehler!';
      setTimeout(() => {
        this.downloadQrBtn.innerHTML = '<i class="ti ti-download mr-2"></i>Download';
      }, 2000);
    }
  }

  private initializeRouting(events: Event[]): void {
    const path = window.location.pathname;
    const eventMatch = path.match(/^\/event\/(.+)$/);
    
    if (eventMatch) {
      const eventId = eventMatch[1];
      const event = events.find(e => e.id === eventId);
      
      if (event) {
        this.currentEvent = event;
        this.showTimerScreen();
        this.initializeTimer();
      } else {
        // Event not found, redirect to overview
        this.showEventSelection();
      }
    } else {
      // Check for current event and auto-start if needed
      const currentEvent = this.eventsManager.getCurrentEvent(events);
      if (currentEvent && this.settingsManager.getSettings().autoStart) {
        this.selectEvent(currentEvent);
      } else {
        this.showEventSelection();
      }
    }
  }

  private handleRouteChange(): void {
    const path = window.location.pathname;
    const eventMatch = path.match(/^\/event-timer\/event\/(.+)$/);
    
    if (eventMatch) {
      const eventId = eventMatch[1];
      const events = this.eventsManager.getEvents();
      const event = events.find(e => e.id === eventId);
      
      if (event) {
        this.currentEvent = event;
        this.showTimerScreen();
        this.initializeTimer();
      } else {
        this.showEventSelection();
      }
    } else {
      this.showEventSelection();
    }
  }

  private highlightTimelineSlot(eventId: string): void {
    // Find the timeline slot for this event
    const timelineSlot = this.timelineBarElement.querySelector(`[data-event-id="${eventId}"]`) as HTMLElement;
    if (timelineSlot) {
      timelineSlot.style.opacity = '1';
      timelineSlot.style.transform = 'scale(1.05)';
      timelineSlot.style.zIndex = '5';
      timelineSlot.style.backgroundColor = '#fbbf24'; // Amber color for highlight
    }
  }

  private unhighlightTimelineSlot(eventId: string): void {
    // Find the timeline slot for this event
    const timelineSlot = this.timelineBarElement.querySelector(`[data-event-id="${eventId}"]`) as HTMLElement;
    if (timelineSlot) {
      timelineSlot.style.opacity = '0.8';
      timelineSlot.style.transform = 'scale(1)';
      timelineSlot.style.zIndex = 'auto';
      // Reset to original background color based on status
      const status = timelineSlot.getAttribute('data-status');
      if (status === 'upcoming') {
        timelineSlot.style.backgroundColor = '#3b82f6'; // blue-500
      } else if (status === 'running') {
        timelineSlot.style.backgroundColor = '#10b981'; // green-500
      } else if (status === 'finished') {
        timelineSlot.style.backgroundColor = '#4b5563'; // gray-600
      }
    }
  }

  private highlightTableRow(eventId: string): void {
    // Find the table row for this event
    const tableRow = this.eventTableBody.querySelector(`[data-event-id="${eventId}"]`) as HTMLElement;
    if (tableRow) {
      tableRow.style.backgroundColor = '#fbbf24'; // Amber highlight
      tableRow.style.transform = 'scale(1.01)';
      tableRow.style.transition = 'all 0.2s ease-in-out';
    }
  }

  private unhighlightTableRow(eventId: string): void {
    // Find the table row for this event
    const tableRow = this.eventTableBody.querySelector(`[data-event-id="${eventId}"]`) as HTMLElement;
    if (tableRow) {
      tableRow.style.backgroundColor = '';
      tableRow.style.transform = '';
      tableRow.style.transition = '';
    }
  }

  private updateTimerStatus(status: string): void {
    // Status is no longer displayed on the timer screen
    console.log('Timer Status:', status);
  }

  private handleWarning(): void {
    this.updateTimerStatus('Letzte Minute!');
    // Visual feedback is handled by CSS animation
  }

  private handleTimerEnd(): void {
    this.updateTimerStatus('Zeit abgelaufen!');
    this.timerElement.classList.add('timer-warning');
    
    // Show completion notification
    setTimeout(() => {
      this.showCompletionNotification();
    }, 1000);
  }

  private handleEventStart(): void {
    // Flash effect and audio notification
    this.timerElement.style.animation = 'flash 0.5s ease-in-out';
    this.audioManager.playStart();
    
    // Remove flash animation after it completes
    setTimeout(() => {
      this.timerElement.style.animation = '';
    }, 500);
    
    // Switch to event timer
    this.hideCountdownUI();
    this.initializeEventTimer();
  }

  private initializeEventTimer(): void {
    if (!this.currentEvent) return;
    
    const timeRemaining = this.eventsManager.getTimeRemaining(this.currentEvent);
    
    if (timeRemaining > 0) {
      const callbacks: TimerCallbacks = {
        onTick: (timeRemaining: number) => this.updateTimerDisplay(timeRemaining),
        onWarning: () => this.handleWarning(),
        onEnd: () => this.handleTimerEnd(),
        onEventStart: () => this.handleEventStart(),
        onPause: () => this.updateTimerStatus('Pausiert'),
        onResume: () => this.updateTimerStatus('Läuft'),
        onReset: () => this.updateTimerStatus('Bereit zum Starten')
      };
      
      this.currentTimer = new Timer(timeRemaining, callbacks, this.audioManager);
      this.updateTimerDisplay(timeRemaining);
      
      // Auto-start event timer
              if (this.settingsManager.getSettings().autoStart) {
        this.currentTimer.start();
      }
    }
  }

  private showCompletionNotification(): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Timer abgelaufen', {
        body: `${this.currentEvent?.title} ist beendet`,
        icon: '/icons/icon-192x192.png'
      });
    }
  }

  private startTimer(): void {
    if (!this.currentTimer) return;
    
    this.currentTimer.start();
    this.startBtn.classList.add('hidden');
    this.pauseBtn.classList.remove('hidden');
    this.updateTimerStatus('Läuft');
  }

  private pauseTimer(): void {
    if (!this.currentTimer) return;
    
    this.currentTimer.pause();
    this.pauseBtn.classList.add('hidden');
    this.startBtn.classList.remove('hidden');
    this.updateTimerStatus('Pausiert');
  }

  private toggleTimer(): void {
    if (!this.currentTimer) return;
    
    if (this.currentTimer.isRunning()) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  private resetTimer(): void {
    if (!this.currentTimer) return;
    
    this.currentTimer.reset();
    this.startBtn.classList.remove('hidden');
    this.pauseBtn.classList.add('hidden');
    this.updateTimerStatus('Bereit zum Starten');
  }

  private toggleFullscreen(): void {
    if (this.isFullscreen) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  }

  private enterFullscreen(): void {
    if (this.timerScreenElement.requestFullscreen) {
      this.timerScreenElement.requestFullscreen();
    }
  }

  private exitFullscreen(): void {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  private updateFullscreenButton(): void {
    const icon = this.fullscreenBtn.querySelector('svg');
    if (icon) {
      if (this.isFullscreen) {
        icon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"></path>
        `;
      } else {
        icon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
        `;
      }
    }
  }

  private updateEventStatusInfo(): void {
    if (!this.currentEvent) return;
    
    const events = this.eventsManager.getEvents();
    const status = this.eventsManager.getEventStatus(this.currentEvent);
    
    // Show status info container
    this.eventStatusInfo.classList.remove('hidden');
    
    if (status === 'finished') {
      // Show event ended message
      this.eventEndedMessage.classList.remove('hidden');
      
      // Find and show next event
      const nextEvent = this.eventsManager.getNextEvent(events);
      if (nextEvent) {
        this.nextEventInfo.classList.remove('hidden');
        this.nextEventTitle.textContent = nextEvent.title;
        
        // Calculate time until next event starts
        const timeUntilNext = this.eventsManager.getTimeUntilStart(nextEvent);
        this.nextEventCountdown.textContent = this.eventsManager.formatDuration(timeUntilNext);
        
        // Update countdown every minute
        this.updateNextEventCountdown(nextEvent);
      } else {
        this.nextEventInfo.classList.add('hidden');
      }
    } else {
      // Hide status info for running/upcoming events
      this.eventEndedMessage.classList.add('hidden');
      this.nextEventInfo.classList.add('hidden');
    }
  }

  private updateNextEventCountdown(nextEvent: Event): void {
    const updateCountdown = () => {
      const timeUntilNext = this.eventsManager.getTimeUntilStart(nextEvent);
      this.nextEventCountdown.textContent = this.eventsManager.formatDuration(timeUntilNext);
    };
    
    // Update immediately
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
  }

  private startAutoSwitchTimer(): void {
    const settings = this.settingsManager.getSettings();
    const autoSwitchSeconds = settings.autoSwitchSeconds || 30;
    
    // Clear existing interval
    if (this.autoSwitchInterval) {
      clearInterval(this.autoSwitchInterval);
    }
    
    // Check every second for events that should auto-switch
    this.autoSwitchInterval = setInterval(() => {
      const events = this.eventsManager.getEvents();
      const now = new Date();
      
      events.forEach(event => {
        const eventStart = new Date(event.startTime);
        const timeUntilStart = (eventStart.getTime() - now.getTime()) / 1000;
        
        // If event starts in exactly autoSwitchSeconds, navigate to it
        if (timeUntilStart > 0 && timeUntilStart <= autoSwitchSeconds && timeUntilStart > autoSwitchSeconds - 1) {
          console.log(`Auto-switching to event: ${event.title} (starts in ${Math.round(timeUntilStart)}s)`);
          this.selectEvent(event);
        }
      });
    }, 1000);
  }

  private stopAutoSwitchTimer(): void {
    if (this.autoSwitchInterval) {
      clearInterval(this.autoSwitchInterval);
      this.autoSwitchInterval = null;
    }
  }

  private goToNextEvent(): void {
    const events = this.eventsManager.getEvents();
    const nextEvent = this.eventsManager.getNextEvent(events);
    
    if (nextEvent) {
      this.selectEvent(nextEvent);
    } else {
      // If no next event, go back to overview
      this.showEventSelection();
    }
  }

  private updateAppTitle(title: string): void {
    if (this.appTitle) {
      this.appTitle.textContent = title;
    }
    // Also update document title
    document.title = title;
  }

  private updateManifest(appConfig: { name: string; shortName: string; description: string }): void {
    // Update document title and meta description
    document.title = appConfig.name;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', appConfig.description);
    }
    
          // Update manifest dynamically
      const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
      if (manifestLink) {
        // Create a new manifest with updated values
        const manifest = {
          name: appConfig.name,
          short_name: appConfig.shortName,
          description: appConfig.description,
          start_url: "/event-timer/",
          display: "standalone",
          background_color: "#1e293b",
          theme_color: "#1e293b",
          orientation: "portrait-primary",
          scope: "/event-timer/",
          lang: "de",
          icons: [
            {
              src: "/event-timer/icons/icon-72x72.png",
              sizes: "72x72",
              type: "image/png",
              purpose: "maskable any"
            },
            {
              src: "/event-timer/icons/icon-96x96.png",
              sizes: "96x96",
              type: "image/png",
              purpose: "maskable any"
            },
            {
              src: "/event-timer/icons/icon-128x128.png",
              sizes: "128x128",
              type: "image/png",
              purpose: "maskable any"
            },
            {
              src: "/event-timer/icons/icon-144x144.png",
              sizes: "144x144",
              type: "image/png",
              purpose: "maskable any"
            },
            {
              src: "/event-timer/icons/icon-152x152.png",
              sizes: "152x152",
              type: "image/png",
              purpose: "maskable any"
            },
            {
              src: "/event-timer/icons/icon-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable any"
            },
            {
              src: "/event-timer/icons/icon-384x384.png",
              sizes: "384x384",
              type: "image/png",
              purpose: "maskable any"
            },
            {
              src: "/event-timer/icons/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable any"
            }
          ],
          categories: ["productivity", "utilities"],
          screenshots: [
            {
              src: "/event-timer/screenshots/desktop.png",
              sizes: "1280x720",
            type: "image/png",
            form_factor: "wide"
          },
          {
            src: "/screenshots/mobile.png",
            sizes: "390x844",
            type: "image/png",
            form_factor: "narrow"
          }
        ]
      };
      
      // Create blob and update manifest link
      const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      manifestLink.href = url;
      
      // Clean up URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }

  private showError(message: string): void {
    this.loadingElement.innerHTML = `
      <div class="text-center">
        <div class="text-red-500 text-6xl mb-4">⚠️</div>
        <p class="text-xl text-red-400">${message}</p>
        <button onclick="location.reload()" class="mt-4 px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700 transition-colors">
          Erneut versuchen
        </button>
      </div>
    `;
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.eventTimerApp = new EventTimerApp();
});

// AudioContext bei Benutzerinteraktion aktivieren
document.addEventListener('click', () => {
  if (window.eventTimerApp?.audioManager) {
    window.eventTimerApp.audioManager.resumeAudioContext();
  }
}, { once: true });

// Request notification permission
if ('Notification' in window) {
  Notification.requestPermission();
}
