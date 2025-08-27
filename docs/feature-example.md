# Feature Development Example

This document demonstrates how to apply the new feature development rules using a practical example: **Adding a Timer Pause/Resume Feature**.

## Example: Timer Pause/Resume Feature

### 1. Pre-Implementation Phase

#### Planning

- **Feature Requirements**: Users can pause and resume timers
- **API Design**: Add `pause()` and `resume()` methods to Timer class
- **UI Changes**: Add pause/resume buttons to timer interface
- **Test Cases**: Pause during countdown, resume from paused state, edge cases

#### Documentation Planning

- Update README.md with new timer controls
- Add API documentation for new methods
- Create usage examples
- Update screenshots showing pause/resume buttons

### 2. Documentation First Approach

#### Update README.md

````markdown
## Timer Controls

### Pause/Resume

The timer supports pausing and resuming functionality for better control over your events.

**Usage:**

- Click the pause button (⏸️) to pause the timer
- Click the resume button (▶️) to continue the countdown
- The timer maintains its remaining time when paused

**Example:**

```typescript
const timer = new Timer(60);
timer.start();
timer.pause(); // Pause at 45 seconds remaining
timer.resume(); // Continue from 45 seconds
```
````

````

#### Update API Documentation
```markdown
## Timer Class

### Methods

#### pause(): void
Pauses the timer countdown. The timer maintains its current state and remaining time.

**Throws:**
- `TimerError` if timer is not running

**Example:**
```typescript
const timer = new Timer(60);
timer.start();
timer.pause(); // Timer is now paused
````

#### resume(): void

Resumes the timer countdown from where it was paused.

**Throws:**

- `TimerError` if timer is not paused

**Example:**

```typescript
timer.resume(); // Timer continues from paused state
```

#### isPaused(): boolean

Returns whether the timer is currently paused.

**Returns:**

- `boolean` - true if timer is paused, false otherwise

````

### 3. Test-Driven Development

#### Step 1: Write Failing Tests
```typescript
// tests/timer.test.ts
describe('Timer Pause/Resume', () => {
  let timer: Timer;

  beforeEach(() => {
    timer = new Timer(60);
  });

  describe('pause()', () => {
    it('should pause the timer when running', () => {
      timer.start();
      timer.pause();

      expect(timer.isPaused()).toBe(true);
      expect(timer.isRunning()).toBe(false);
    });

    it('should throw error when timer is not running', () => {
      expect(() => timer.pause()).toThrow(TimerError);
      expect(() => timer.pause()).toThrow('Timer is not running');
    });

    it('should maintain remaining time when paused', () => {
      timer.start();

      // Wait 5 seconds
      jest.advanceTimersByTime(5000);

      timer.pause();
      expect(timer.getRemainingTime()).toBe(55);
    });
  });

  describe('resume()', () => {
    it('should resume the timer when paused', () => {
      timer.start();
      timer.pause();
      timer.resume();

      expect(timer.isPaused()).toBe(false);
      expect(timer.isRunning()).toBe(true);
    });

    it('should throw error when timer is not paused', () => {
      expect(() => timer.resume()).toThrow(TimerError);
      expect(() => timer.resume()).toThrow('Timer is not paused');
    });

    it('should continue from paused time', () => {
      timer.start();
      jest.advanceTimersByTime(5000);
      timer.pause();

      const pausedTime = timer.getRemainingTime();
      timer.resume();

      // Wait 2 more seconds
      jest.advanceTimersByTime(2000);

      expect(timer.getRemainingTime()).toBe(pausedTime - 2);
    });
  });

  describe('isPaused()', () => {
    it('should return false for new timer', () => {
      expect(timer.isPaused()).toBe(false);
    });

    it('should return true when paused', () => {
      timer.start();
      timer.pause();
      expect(timer.isPaused()).toBe(true);
    });

    it('should return false when resumed', () => {
      timer.start();
      timer.pause();
      timer.resume();
      expect(timer.isPaused()).toBe(false);
    });
  });
});
````

#### Step 2: Implement Feature

```typescript
// src/timer.ts
export class Timer {
  private paused: boolean = false;
  private pausedTime: number = 0;
  private pausedRemainingTime: number = 0;

  pause(): void {
    if (!this.isRunning) {
      throw new TimerError('Timer is not running', 'NOT_RUNNING');
    }

    this.paused = true;
    this.pausedTime = Date.now();
    this.pausedRemainingTime = this.getRemainingTime();
    this.stop();
  }

  resume(): void {
    if (!this.paused) {
      throw new TimerError('Timer is not paused', 'NOT_PAUSED');
    }

    this.paused = false;
    this.start(this.pausedRemainingTime);
  }

  isPaused(): boolean {
    return this.paused;
  }
}

// src/types.ts
export class TimerError extends Error {
  constructor(
    message: string,
    public code: 'NOT_RUNNING' | 'NOT_PAUSED' | 'INVALID_DURATION'
  ) {
    super(message);
    this.name = 'TimerError';
  }
}
```

#### Step 3: Update UI

```typescript
// src/main.ts
private createTimerControls(): HTMLElement {
  const controls = document.createElement('div');
  controls.className = 'flex gap-2 mt-4';

  const pauseButton = document.createElement('button');
  pauseButton.innerHTML = '<i class="ti ti-player-pause"></i>';
  pauseButton.className = 'btn btn-secondary';
  pauseButton.onclick = () => this.timer.pause();

  const resumeButton = document.createElement('button');
  resumeButton.innerHTML = '<i class="ti ti-player-play"></i>';
  resumeButton.className = 'btn btn-secondary';
  resumeButton.onclick = () => this.timer.resume();

  controls.appendChild(pauseButton);
  controls.appendChild(resumeButton);

  return controls;
}
```

### 4. Complete Feature Coverage

#### Integration Tests

```typescript
// tests/integration.test.ts
describe('Timer Integration', () => {
  it('should handle pause/resume workflow correctly', async () => {
    const app = new EventTimerApp();
    await app.initialize();

    const event = app.getCurrentEvent();
    app.startEvent(event);

    // Wait 10 seconds
    jest.advanceTimersByTime(10000);

    // Pause timer
    app.pauseTimer();
    expect(app.isTimerPaused()).toBe(true);

    // Resume timer
    app.resumeTimer();
    expect(app.isTimerPaused()).toBe(false);

    // Verify timer continues correctly
    jest.advanceTimersByTime(5000);
    expect(app.getRemainingTime()).toBe(event.duration - 15);
  });
});
```

#### Error Handling Tests

```typescript
describe('Timer Error Handling', () => {
  it('should handle multiple pause calls gracefully', () => {
    const timer = new Timer(60);
    timer.start();
    timer.pause();

    expect(() => timer.pause()).toThrow(TimerError);
    expect(() => timer.pause()).toThrow('Timer is not running');
  });

  it('should handle resume without pause', () => {
    const timer = new Timer(60);
    expect(() => timer.resume()).toThrow(TimerError);
    expect(() => timer.resume()).toThrow('Timer is not paused');
  });
});
```

### 5. Documentation Updates

#### Update README.md with Screenshots

```markdown
## Timer Interface

![Timer with Pause/Resume Controls](docs/images/timer-pause-resume.png)

The timer interface now includes pause and resume controls for better event management.
```

#### Update API Documentation

````markdown
## Timer Events

### onPause

Fired when the timer is paused.

**Event Data:**

```typescript
{
  remainingTime: number;
  pausedAt: Date;
}
```
````

### onResume

Fired when the timer is resumed.

**Event Data:**

```typescript
{
  remainingTime: number;
  resumedAt: Date;
}
```

````

### 6. Final Verification

#### Code Quality Check
```bash
# Run linting
pnpm lint

# Run type checking
pnpm type-check

# Run tests
pnpm test

# Check coverage
pnpm test:coverage
````

#### Build Verification

```bash
# Build project
pnpm build

# Verify bundle size
ls -la dist/assets/
```

#### Manual Testing

- [ ] Timer pauses correctly
- [ ] Timer resumes from correct time
- [ ] UI buttons work as expected
- [ ] Error messages are clear
- [ ] Performance is acceptable
- [ ] Works on mobile devices

### 7. Commit Following Conventional Commits

```bash
git add .
git commit -m "feat(timer): add pause and resume functionality

- Add pause() and resume() methods to Timer class
- Implement pause/resume UI controls
- Add comprehensive test coverage for new features
- Update documentation with usage examples
- Add error handling for invalid pause/resume calls

Closes #123"
```

### 8. Pull Request Checklist

#### Feature Implementation

- [x] Feature works as expected
- [x] All edge cases handled
- [x] Error handling implemented
- [x] Performance considerations addressed

#### Testing

- [x] Unit tests written and passing
- [x] Integration tests written and passing
- [x] Test coverage meets requirements
- [x] Regression tests included

#### Documentation

- [x] README.md updated
- [x] API documentation updated
- [x] Code comments added
- [x] Examples provided

#### Code Quality

- [x] TypeScript types defined
- [x] ESLint passes
- [x] Prettier formatting applied
- [x] No console.log statements in production code

## Summary

This example demonstrates:

1. **Documentation First**: Updated README and API docs before implementation
2. **Test-Driven Development**: Wrote comprehensive tests before coding
3. **Complete Coverage**: Included unit tests, integration tests, and error handling
4. **Type Safety**: Defined proper TypeScript interfaces and error types
5. **UI Integration**: Updated user interface with new controls
6. **Quality Assurance**: Verified build, tests, and documentation
7. **Conventional Commits**: Used proper commit format with detailed description

Following this process ensures high-quality, well-tested, and properly documented features.
