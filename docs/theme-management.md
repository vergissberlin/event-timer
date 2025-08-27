# Theme Management

Die Event Timer PWA unterstützt automatisches Theme-Management mit localStorage-Persistierung und Betriebssystem-Integration.

## Features

### 1. **localStorage Persistierung**
- Das ausgewählte Theme wird im `localStorage` unter dem Schlüssel `'theme'` gespeichert
- Werte: `'light'`, `'dark'` oder `null` (für System-Theme)
- Persistiert über Browser-Sessions hinweg

### 2. **Betriebssystem-Integration**
- **Standard**: Wenn kein Theme im localStorage gespeichert ist, wird das Betriebssystem-Theme verwendet
- **Automatische Anpassung**: Änderungen des Betriebssystem-Themes werden automatisch erkannt (nur wenn kein Theme gespeichert ist)
- **Media Query**: Verwendet `window.matchMedia('(prefers-color-scheme: dark)')`

### 3. **Manueller Toggle**
- Theme-Toggle-Button in der oberen rechten Ecke
- Wechselt zwischen Light und Dark Mode
- Speichert die Auswahl automatisch im localStorage
- Aktualisiert die Button-Icons entsprechend

## Implementierung

### Theme-Initialisierung

```typescript
private initializeTheme(): void {
  // Check for saved theme preference or default to system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Update button state after theme initialization
  this.updateThemeButtonState();
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only apply system preference if no theme is saved in localStorage
    const currentSavedTheme = localStorage.getItem('theme');
    if (!currentSavedTheme) {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // Update button state when system theme changes
      this.updateThemeButtonState();
    }
  });
}
```

### Theme-Toggle

```typescript
private toggleTheme(): void {
  const isDark = document.documentElement.classList.contains('dark');
  
  if (isDark) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
  
  // Update button state
  this.updateThemeButtonState();
}
```

### Button-Status-Update

```typescript
private updateThemeButtonState(): void {
  const isDark = document.documentElement.classList.contains('dark');
  const sunIcon = this.themeToggleBtn.querySelector('.ti-sun');
  const moonIcon = this.themeToggleBtn.querySelector('.ti-moon');
  
  if (sunIcon && moonIcon) {
    if (isDark) {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    } else {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    }
  }
}
```

## CSS-Klassen

### Dark Mode Klassen
Die Anwendung verwendet Tailwind CSS Dark Mode Klassen:

```css
/* Dark mode visibility classes */
.dark\:hidden { display: none !important; }
.dark\:inline { display: inline !important; }

/* Dark mode background colors */
.dark .bg-white { background-color: #1f2937 !important; }
.dark .bg-gray-200 { background-color: #374151 !important; }
.dark .bg-slate-700 { background-color: #475569 !important; }
.dark .bg-slate-800 { background-color: #334155 !important; }

/* Dark mode text colors */
.dark .text-gray-700 { color: #e5e7eb !important; }
.dark .text-gray-900 { color: #f9fafb !important; }
.dark .text-slate-300 { color: #cbd5e1 !important; }

/* Dark mode border colors */
.dark .border-gray-200 { border-color: #374151 !important; }
.dark .border-gray-700 { border-color: #e5e7eb !important; }

/* Dark mode hover states */
.dark .hover\:bg-gray-300:hover { background-color: #4b5563 !important; }
.dark .hover\:bg-slate-600:hover { background-color: #475569 !important; }
```

## Verhalten

### Prioritätsreihenfolge
1. **Gespeichertes Theme** (localStorage) - höchste Priorität
2. **Betriebssystem-Theme** - Standard, wenn nichts gespeichert ist
3. **Light Mode** - Fallback

### System-Theme-Änderungen
- **Mit gespeichertem Theme**: Keine automatische Anpassung
- **Ohne gespeichertes Theme**: Automatische Anpassung an Betriebssystem-Änderungen

### Button-Verhalten
- **Sonne-Icon**: Angezeigt im Dark Mode (klicken für Light Mode)
- **Mond-Icon**: Angezeigt im Light Mode (klicken für Dark Mode)
- **Automatische Aktualisierung**: Bei Theme-Änderungen und System-Änderungen

## Testing

Die Theme-Funktionalität wird durch umfassende Tests abgedeckt:

```typescript
describe('Theme Management', () => {
  describe('Theme Storage', () => {
    it('should save theme preference to localStorage');
    it('should retrieve theme preference from localStorage');
    it('should return null when no theme is saved');
  });

  describe('Theme Class Management', () => {
    it('should add dark class to document element');
    it('should remove dark class from document element');
    it('should check if dark class is present');
  });

  describe('System Theme Detection', () => {
    it('should detect system dark mode preference');
    it('should detect system light mode preference');
  });
});
```

## Browser-Kompatibilität

- **localStorage**: Alle modernen Browser
- **matchMedia**: Alle modernen Browser
- **prefers-color-scheme**: Chrome 76+, Firefox 67+, Safari 12.1+, Edge 79+

## Fehlerbehandlung

- **localStorage nicht verfügbar**: Fallback auf System-Theme
- **matchMedia nicht unterstützt**: Fallback auf Light Mode
- **CSS-Klassen nicht verfügbar**: Graceful Degradation

## Best Practices

1. **Konsistenz**: Theme-Status wird immer im localStorage gespeichert
2. **Performance**: Event-Listener werden nur einmal registriert
3. **UX**: Sofortige visuelle Rückmeldung bei Theme-Änderungen
4. **Accessibility**: Klare visuelle Unterscheidung zwischen Light und Dark Mode
5. **Maintainability**: Zentrale Theme-Management-Logik in einer Klasse
