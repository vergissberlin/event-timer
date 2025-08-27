# Theme Management

The Event Timer web app supports automatic theme management with localStorage persistence and operating system integration.

## Features

### 1. localStorage Persistence
- The selected theme is stored in `localStorage` under the key `theme`
- Values: `light`, `dark`, or `null` (to use system theme)
- Persists across browser sessions

### 2. Operating System Integration
- Default: If no theme is stored in localStorage, the system theme is used
- Automatic adaptation: Changes to the system theme are applied automatically (only if no theme is stored)
- Media Query: Uses `window.matchMedia('(prefers-color-scheme: dark)')`

### 3. Manual Toggle
- Theme toggle button in the top-right corner
- Switches between light and dark mode
- Automatically saves the selection in localStorage
- Updates button icons accordingly

## Implementation

### Theme Initialization

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

### Theme Toggle

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

### Button State Update

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

## CSS Classes

### Dark Mode Classes
The application uses Tailwind CSS dark mode classes:

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

## Behavior

### Priority Order
1. **Stored theme** (localStorage) - highest priority
2. **System theme** - default if nothing is stored
3. **Light mode** - fallback

### System Theme Changes
- **With stored theme**: No automatic adaptation
- **Without stored theme**: Automatically adapts to system changes

### Button Behavior
- **Sun icon**: Shown in dark mode (click to switch to light mode)
- **Moon icon**: Shown in light mode (click to switch to dark mode)
- **Automatic update**: On theme changes and system changes

## Testing

The theme functionality is covered by comprehensive tests:

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

## Browser Compatibility

- **localStorage**: All modern browsers
- **matchMedia**: All modern browsers
- **prefers-color-scheme**: Chrome 76+, Firefox 67+, Safari 12.1+, Edge 79+

## Error Handling

- **localStorage unavailable**: Fallback to system theme
- **matchMedia unsupported**: Fallback to light mode
- **Missing CSS classes**: Graceful degradation

## Best Practices

1. **Consistency**: Theme status is always stored in localStorage
2. **Performance**: Event listeners are registered only once
3. **UX**: Immediate visual feedback on theme changes
4. **Accessibility**: Clear visual distinction between light and dark mode
5. **Maintainability**: Centralized theme management logic in a single class
