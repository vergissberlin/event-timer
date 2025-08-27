# Break Times Feature

The Event Timer web app automatically displays break times between events and allows users to toggle their visibility.

## Features

### 1. Automatic Break Time Calculation
- Automatically calculates the time between the end of one event and the start of the next
- Displays break times in a user-friendly format (e.g., "1h 30min break")
- Respects each event's actual duration

### 2. Show/Hide Break Times
- Toggle button in the top-right corner of the overview
- Setting is persisted in localStorage
- Immediate visual feedback when toggled

### 3. Visual Representation
- Blue background color for break time rows
- Centered across the full table width
- Icon and time with start and end timestamps

## Implementation

### Break Time Calculation

```typescript
public getBreakTimeBetweenEvents(event1: Event, event2: Event): number {
  const endTime1 = new Date(event1.startTime);
  endTime1.setSeconds(endTime1.getSeconds() + event1.duration);
  
  const startTime2 = new Date(event2.startTime);
  const timeDiff = startTime2.getTime() - endTime1.getTime();
  
  return Math.max(0, Math.floor(timeDiff / 1000));
}

public formatBreakTime(seconds: number): string {
  if (seconds === 0) return 'No break';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}min break`;
  } else {
    return `${minutes}min break`;
  }
}
```

### Toggle Functionality

```typescript
private toggleBreakTimes(): void {
  const settings = this.settingsManager.getSettings();
  const newShowBreakTimes = !settings.showBreakTimes;
  
  // Update settings
  this.settingsManager.updateSettings({ ...settings, showBreakTimes: newShowBreakTimes });
  
  // Update button state
  this.updateBreakTimesButtonState();
  
  // Re-render event grid to show/hide break times
  const events = this.eventsManager.getEvents();
  this.renderEventGrid(events);
}
```

### Create Break Time Row

```typescript
private createBreakTimeRow(currentEvent: Event, nextEvent: Event): HTMLElement {
  const row = document.createElement('tr');
  row.className = 'border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20';
  row.setAttribute('data-break-time', 'true');
  
  const breakTimeSeconds = this.eventsManager.getBreakTimeBetweenEvents(currentEvent, nextEvent);
  const breakTimeText = this.eventsManager.formatBreakTime(breakTimeSeconds);
  
  // Calculate break time period
  const currentEventEnd = new Date(currentEvent.startTime);
  currentEventEnd.setSeconds(currentEventEnd.getSeconds() + currentEvent.duration);
  const nextEventStart = new Date(nextEvent.startTime);
  
  const breakStartTime = this.eventsManager.formatDateTime(currentEventEnd.toISOString());
  const breakEndTime = this.eventsManager.formatDateTime(nextEventStart.toISOString());
  
  row.innerHTML = `
    <td class="px-4 py-2 text-center" colspan="6">
      <div class="flex items-center justify-center space-x-2 text-blue-700 dark:text-blue-300">
        <i class="ti ti-clock-pause text-lg"></i>
        <span class="font-medium">${breakTimeText}</span>
        <span class="text-sm opacity-75">(${breakStartTime} - ${breakEndTime})</span>
      </div>
    </td>
  `;
  
  return row;
}
```

## Settings

### showBreakTimes
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Controls whether break times are shown in the overview

```json
{
  "settings": {
    "showBreakTimes": true
  }
}
```

## UI Elements

### Toggle Button
- **Position**: Top-right corner of the overview
- **Icon**: `ti ti-clock-pause` (enabled) / `ti ti-clock-off` (disabled)
- **Tooltip**: "Show/hide break times"

### Break Time Row
- **Background**: Blue (`bg-blue-50` / `dark:bg-blue-900/20`)
- **Layout**: Centered across all 6 columns
- **Content**: Icon, break time, time range

## Behavior

### Display Logic
1. **Break times enabled**: Show break times between all events
2. **Break times disabled**: Hide all break time rows
3. **Last event**: No break time after the last event

### Formatting
- **0 seconds**: "No break"
- **Less than 1 hour**: "Xmin break"
- **1 hour or more**: "Xh Ymin break"

### Persistence
- Setting is stored in localStorage
- Persists across browser sessions
- Restored on app load

## CSS Classes

### Break Time Row
```css
.bg-blue-50 { background-color: #eff6ff !important; }
.dark .bg-blue-900\/20 { background-color: rgba(30, 58, 138, 0.2) !important; }
.text-blue-700 { color: #1d4ed8 !important; }
.dark .text-blue-300 { color: #93c5fd !important; }
```

## Testing

The break times feature is covered by existing tests:

- **EventsManager**: Tests for `getBreakTimeBetweenEvents` and `formatBreakTime`
- **SettingsManager**: Tests for `showBreakTimes` setting
- **UI**: Integration tests for toggle functionality

## Best Practices

1. **Performance**: Break times are calculated only when needed
2. **UX**: Immediate visual feedback when toggled
3. **Accessibility**: Clear visual distinction with color and icon
4. **Maintainability**: Central logic in `EventsManager`
5. **Flexibility**: Easy show/hide without data loss

## Browser Compatibility

- **localStorage**: All modern browsers
- **Date API**: All modern browsers
- **CSS Grid**: All modern browsers (for `colspan`)

## Error Handling

- **Negative break times**: Clamped to 0
- **Missing events**: No break time shown
- **Invalid data**: Graceful degradation

