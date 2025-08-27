import { Timer } from './timer';
import { AudioController } from './audio';
import { EventsManager } from './events';
import QRCode from 'qrcode';
import { Event, TimerCallbacks } from './types';

class EventTimerApp {
  private eventsManager: EventsManager;
  private audioController: AudioController;
  private currentTimer: Timer | null = null;
  private currentEvent: Event | null = null;
  private isFullscreen: boolean = false;

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
  private themeToggleBtn!: HTMLButtonElement;
  private fullscreenBtnOverview!: HTMLButtonElement;
  private shareBtn!: HTMLButtonElement;
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

  constructor() {
    this.eventsManager = new EventsManager();
    this.audioController = new AudioController();
    
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
    this.themeToggleBtn = document.getElementById('themeToggle') as HTMLButtonElement;
    this.fullscreenBtnOverview = document.getElementById('fullscreenBtnOverview') as HTMLButtonElement;
    this.shareBtn = document.getElementById('shareBtn') as HTMLButtonElement;
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
  }

  private bindEventListeners(): void {
    this.startBtn.addEventListener('click', () => this.startTimer());
    this.pauseBtn.addEventListener('click', () => this.pauseTimer());
    this.resetBtn.addEventListener('click', () => this.resetTimer());
    this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    this.backBtn.addEventListener('click', () => this.showEventSelection());
    this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    this.fullscreenBtnOverview.addEventListener('click', () => this.toggleFullscreen());
    this.shareBtn.addEventListener('click', () => this.showQrModal());
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
  }

  private async initializeApp(): Promise<void> {
    try {
      // Initialize theme
      this.initializeTheme();
      
      // Load events
      const events = await this.eventsManager.loadEvents();
      
      // Preload images
      await this.eventsManager.preloadImages();
      
      // Render event grid
      this.renderEventGrid(events);
      
      // Check for current event and auto-start if needed
      const currentEvent = this.eventsManager.getCurrentEvent(events);
      if (currentEvent && this.eventsManager.getSettings().autoStart) {
        this.selectEvent(currentEvent);
      }
      
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
    
    let statusClass = '';
    let statusText = '';
    
    switch (status) {
      case 'upcoming':
        statusClass = 'text-blue-400';
        statusText = 'Geplant';
        break;
      case 'running':
        statusClass = 'text-green-400';
        statusText = 'Läuft';
        break;
      case 'finished':
        statusClass = 'text-gray-500';
        statusText = 'Beendet';
        break;
    }
    
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
        <button class="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
          Starten
        </button>
      </td>
    `;
    
    // Add hover event listeners for timeline highlighting
    row.addEventListener('mouseenter', () => this.highlightTimelineSlot(event.id));
    row.addEventListener('mouseleave', () => this.unhighlightTimelineSlot(event.id));
    
    row.addEventListener('click', () => this.selectEvent(event));
    
    return row;
  }

  private selectEvent(event: Event): void {
    this.currentEvent = event;
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
  }

  private updateTimerScreen(): void {
    if (!this.currentEvent) return;
    
    // Update background
    if (this.currentEvent.background) {
      this.timerBackgroundElement.style.backgroundImage = `url(${this.currentEvent.background})`;
    } else {
      this.timerBackgroundElement.style.backgroundImage = 'none';
    }
    
    // Update event title
    const titleElement = this.eventTitleElement.querySelector('h2');
    if (titleElement) {
      titleElement.textContent = this.currentEvent.title;
    }
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
      this.currentTimer = new Timer(timeUntilStart, callbacks, this.audioController);
      
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
      this.currentTimer = new Timer(timeRemaining, callbacks, this.audioController);
      this.updateTimerDisplay(timeRemaining);
      
      // Hide countdown UI
      this.hideCountdownUI();
      
      if (timeRemaining > 0) {
        this.updateTimerStatus('Läuft');
        // Auto-start if event is currently running
        if (this.eventsManager.getSettings().autoStart) {
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
    if (this.eventTitleElement && !this.eventTitleElement.classList.contains('hidden')) {
      // Update countdown timer, keep main timer showing event duration
      this.countdownTimerElement.textContent = formattedTime;
    } else {
      // Update main timer
      this.timerElement.textContent = formattedTime;
      // Adjust font size to fit container
      this.adjustTimerFontSize();
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
    this.eventTitleElement.classList.remove('hidden');
  }
  
  private hideCountdownUI(): void {
    this.eventTitleElement.classList.add('hidden');
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
      const currentUrl = window.location.href;
      const qrDataUrl = await QRCode.toDataURL(currentUrl, {
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
      await navigator.clipboard.writeText(window.location.href);
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
      const currentUrl = window.location.href;
      const qrDataUrl = await QRCode.toDataURL(currentUrl, {
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

  private highlightTimelineSlot(eventId: string): void {
    // Find the timeline slot for this event
    const timelineSlot = this.timelineBarElement.querySelector(`[data-event-id="${eventId}"]`) as HTMLElement;
    if (timelineSlot) {
      timelineSlot.style.opacity = '1';
      timelineSlot.style.transform = 'scale(1.05)';
      timelineSlot.style.zIndex = '5';
      timelineSlot.style.outline = '2px solid #ffffff';
      timelineSlot.style.outlineOffset = '1px';
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
      timelineSlot.style.outline = 'none';
      timelineSlot.style.outlineOffset = '0';
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
      const isDark = document.documentElement.classList.contains('dark');
      tableRow.style.backgroundColor = isDark ? '#fbbf24' : '#fbbf24'; // Amber highlight for both modes
      tableRow.style.transform = 'scale(1.01)';
      tableRow.style.transition = 'all 0.2s ease-in-out';
      tableRow.style.outline = '2px solid #ffffff';
      tableRow.style.outlineOffset = '1px';
    }
  }

  private unhighlightTableRow(eventId: string): void {
    // Find the table row for this event
    const tableRow = this.eventTableBody.querySelector(`[data-event-id="${eventId}"]`) as HTMLElement;
    if (tableRow) {
      tableRow.style.backgroundColor = '';
      tableRow.style.transform = '';
      tableRow.style.transition = '';
      tableRow.style.outline = '';
      tableRow.style.outlineOffset = '';
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
    this.audioController.playStart();
    
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
      
      this.currentTimer = new Timer(timeRemaining, callbacks, this.audioController);
      this.updateTimerDisplay(timeRemaining);
      
      // Auto-start event timer
      if (this.eventsManager.getSettings().autoStart) {
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
  new EventTimerApp();
});

// Request notification permission
if ('Notification' in window) {
  Notification.requestPermission();
}
