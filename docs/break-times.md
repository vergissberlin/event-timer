# Pausenzeiten-Funktionalität

Die Event Timer PWA zeigt automatisch Pausenzeiten zwischen Events an und ermöglicht es Benutzern, diese ein- und auszublenden.

## Features

### 1. **Automatische Pausenzeiten-Berechnung**
- Berechnet automatisch die Zeit zwischen dem Ende eines Events und dem Start des nächsten Events
- Zeigt Pausenzeiten in benutzerfreundlichem Format an (z.B. "1h 30min Pause")
- Berücksichtigt die tatsächliche Dauer der Events

### 2. **Ein-/Ausblenden von Pausenzeiten**
- Toggle-Button in der oberen rechten Ecke der Übersicht
- Einstellung wird im localStorage gespeichert
- Sofortige visuelle Rückmeldung beim Umschalten

### 3. **Visuelle Darstellung**
- Blaue Hintergrundfarbe für Pausenzeiten-Zeilen
- Zentrierte Darstellung über die gesamte Tabellenbreite
- Icon und Zeitangabe mit Start- und Endzeit

## Implementierung

### Pausenzeiten-Berechnung

```typescript
public getBreakTimeBetweenEvents(event1: Event, event2: Event): number {
  const endTime1 = new Date(event1.startTime);
  endTime1.setSeconds(endTime1.getSeconds() + event1.duration);
  
  const startTime2 = new Date(event2.startTime);
  const timeDiff = startTime2.getTime() - endTime1.getTime();
  
  return Math.max(0, Math.floor(timeDiff / 1000));
}

public formatBreakTime(seconds: number): string {
  if (seconds === 0) return 'Keine Pause';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}min Pause`;
  } else {
    return `${minutes}min Pause`;
  }
}
```

### Toggle-Funktionalität

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

### Pausenzeiten-Zeile erstellen

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

## Einstellungen

### showBreakTimes
- **Typ**: `boolean`
- **Standard**: `true`
- **Beschreibung**: Steuert, ob Pausenzeiten in der Übersicht angezeigt werden

```json
{
  "settings": {
    "showBreakTimes": true
  }
}
```

## UI-Elemente

### Toggle-Button
- **Position**: Obere rechte Ecke der Übersicht
- **Icon**: `ti ti-clock-pause` (aktiviert) / `ti ti-clock-off` (deaktiviert)
- **Tooltip**: "Pausenzeiten anzeigen/verstecken"

### Pausenzeiten-Zeile
- **Hintergrund**: Blaue Farbe (`bg-blue-50` / `dark:bg-blue-900/20`)
- **Layout**: Zentriert über alle 6 Spalten
- **Inhalt**: Icon, Pausenzeit, Zeitraum

## Verhalten

### Anzeige-Logik
1. **Pausenzeiten aktiviert**: Zeigt Pausenzeiten zwischen allen Events an
2. **Pausenzeiten deaktiviert**: Versteckt alle Pausenzeiten-Zeilen
3. **Letztes Event**: Keine Pausenzeit nach dem letzten Event

### Formatierung
- **0 Sekunden**: "Keine Pause"
- **Weniger als 1 Stunde**: "Xmin Pause"
- **1 Stunde oder mehr**: "Xh Ymin Pause"

### Persistierung
- Einstellung wird im localStorage gespeichert
- Bleibt auch nach Browser-Neustart erhalten
- Wird beim Laden der Anwendung wiederhergestellt

## CSS-Klassen

### Pausenzeiten-Zeile
```css
.bg-blue-50 { background-color: #eff6ff !important; }
.dark .bg-blue-900\/20 { background-color: rgba(30, 58, 138, 0.2) !important; }
.text-blue-700 { color: #1d4ed8 !important; }
.dark .text-blue-300 { color: #93c5fd !important; }
```

## Testing

Die Pausenzeiten-Funktionalität wird durch die bestehenden Tests abgedeckt:

- **EventsManager**: Tests für `getBreakTimeBetweenEvents` und `formatBreakTime`
- **SettingsManager**: Tests für `showBreakTimes` Einstellung
- **UI**: Integrationstests für Toggle-Funktionalität

## Best Practices

1. **Performance**: Pausenzeiten werden nur bei Bedarf berechnet
2. **UX**: Sofortige visuelle Rückmeldung beim Toggle
3. **Accessibility**: Klare visuelle Unterscheidung durch Farbe und Icon
4. **Maintainability**: Zentrale Logik in EventsManager
5. **Flexibility**: Einfache Ein-/Ausblendung ohne Datenverlust

## Browser-Kompatibilität

- **localStorage**: Alle modernen Browser
- **Date-API**: Alle modernen Browser
- **CSS Grid**: Alle modernen Browser (für `colspan`)

## Fehlerbehandlung

- **Negative Pausenzeiten**: Werden auf 0 gesetzt
- **Fehlende Events**: Keine Pausenzeit angezeigt
- **Ungültige Daten**: Graceful Degradation

