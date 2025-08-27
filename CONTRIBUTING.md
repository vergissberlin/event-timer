# Contributing Guide

Welcome to the Event Timer PWA project! This guide will help you contribute to the project.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git

### Setup

```bash
# Clone repository
git clone https://github.com/vergissberlin/event-timer.git
cd event-timer

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test
```

## 🏗️ Project Structure

```
event-timer/
├── .github/workflows/   # GitHub Actions
│   ├── deploy.yml       # Deployment Workflow
│   ├── ci.yml          # CI/CD Pipeline
│   └── test.yml        # Test Workflow
├── src/
│   ├── main.ts          # Main application logic
│   ├── timer.ts         # Timer class
│   ├── audio.ts         # Audio management
│   ├── events.ts        # Event management
│   ├── settings.ts      # Settings management
│   ├── favicon.ts       # Favicon generator
│   └── types.ts         # TypeScript types
├── tests/
│   ├── setup.ts         # Jest setup & mocks
│   ├── audio.test.ts    # AudioManager tests
│   ├── timer.test.ts    # Timer tests
│   ├── events.test.ts   # EventsManager tests
│   ├── settings.test.ts # SettingsManager tests
│   └── favicon.test.ts  # FaviconGenerator tests
├── docs/                # Technical documentation
├── data/
│   ├── events.json      # Event configuration
│   └── settings.json    # App settings
└── public/              # Static assets
```

## 🧪 Testing

### Test Framework

- **Jest** as test runner
- **jsdom** for DOM tests
- **ts-jest** for TypeScript support
- **@testing-library/jest-dom** for DOM assertions

### Test Commands

```bash
pnpm test              # Run all tests
pnpm test:watch        # Tests in watch mode
pnpm test:coverage     # Tests with coverage report
pnpm test:ci           # Tests for CI/CD
```

### Test Conventions

- Unit tests for all classes and functions
- Mock external dependencies (fetch, Audio API, etc.)
- Test coverage minimum 80%
- Descriptive test names in English

### Test Structure

```typescript
describe('ClassName', () => {
  describe('methodName', () => {
    it('should do something when condition', () => {
      // Arrange
      const instance = new ClassName();

      // Act
      const result = instance.methodName();

      // Assert
      expect(result).toBe(expectedValue);
    });
  });
});
```

## 🔧 Development

### Development Workflow

#### Feature Development Process

1. **Documentation First**: Update documentation before implementing features
2. **Test-Driven Development**: Write tests before implementing features
3. **Complete Coverage**: Every new feature must include:
   - Unit tests for all new functions/classes
   - Integration tests for feature workflows
   - Documentation updates (README, API docs, etc.)
   - TypeScript type definitions
   - Error handling and edge cases

#### Feature Checklist

Before committing any feature:

- [ ] Feature implementation complete
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Documentation updated (README, API docs, etc.)
- [ ] TypeScript types defined
- [ ] Error handling implemented
- [ ] Edge cases covered
- [ ] Code reviewed and linted
- [ ] Build passes successfully
- [ ] All tests pass

#### Code Quality Standards

- **Documentation Updates**: Always update relevant documentation when adding/modifying features
  - README.md for user-facing changes
  - CONTRIBUTING.md for development process changes
  - docs/ directory for technical documentation
  - API documentation for new public interfaces
- **Test Coverage**: Maintain minimum 80% test coverage
  - New features must have comprehensive test coverage
  - Bug fixes must include regression tests
  - Refactoring must preserve existing test coverage
- **Type Safety**: All new code must be fully typed
  - No `any` types without explicit justification
  - Interface definitions for all data structures
  - Proper error handling with typed exceptions

### Code Style

- **TypeScript**: Use strict typing
- **ESLint**: Code quality and consistency
- **Prettier**: Automatic formatting
- **Conventional Commits**: Standardized commit messages

### Commands

```bash
pnpm type-check        # TypeScript type check
pnpm lint              # ESLint
pnpm format            # Prettier formatting
pnpm build             # Production build
```

### Git Workflow

1. **Fork** the repository
2. **Create branch**: `git checkout -b feature/new-feature`
3. **Commit changes**: `git commit -m 'feat: add new feature'`
4. **Push to fork**: `git push origin feature/new-feature`
5. **Create Pull Request**

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug in timer logic
docs: update README
test: add tests for AudioManager
refactor: refactor code
style: improve formatting
```

## 🎵 Audio Development

### Web Audio API

The app uses Web Audio API for dynamic sound generation:

```typescript
// Example: Generate tone
private generateTone(frequency: number, duration: number): void {
  const audioContext = this.getAudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}
```

### Audio Features

- **Warning Sound**: 800Hz Sine-Wave, 0.5s
- **End Sound**: 3x 600Hz Square-Wave beeps
- **Start Sound**: Dramatic sequence (Sweep + Chord)
- **Speech Countdown**: Last 10 seconds

## 🎨 UI/UX Development

### Design System

- **Tailwind CSS**: Utility-first CSS framework
- **Montserrat**: Primary font
- **Tabler Icons**: Icon library
- **Dark/Light Mode**: Automatic adaptation

### Responsive Design

- **Mobile First**: Mobile-optimized
- **Breakpoints**: sm, md, lg, xl
- **Touch-Friendly**: Large touch targets

### Accessibility

- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard support
- **Color Contrast**: WCAG 2.1 AA compliance
- **Focus Management**: Clear focus indicators

## 🔄 CI/CD Pipeline

### GitHub Actions

- **Type Check**: TypeScript compilation
- **Lint**: ESLint with TypeScript rules
- **Format**: Prettier code formatting
- **Tests**: Jest unit tests with coverage
- **Build**: Vite production build
- **Deploy**: Automatic GitHub Pages deployment

### Quality Gates

- ✅ All tests must pass
- ✅ Code coverage minimum 80%
- ✅ ESLint without errors
- ✅ Prettier formatting correct
- ✅ TypeScript without errors

## 📚 Documentation

### Technical Documentation

See [docs/](docs/) directory:

- [Architecture.md](docs/architecture.md) - System architecture
- [API.md](docs/api.md) - API documentation
- [Testing.md](docs/testing.md) - Testing strategies
- [Deployment.md](docs/deployment.md) - Deployment guide

### Code Documentation

- **JSDoc**: For all public methods
- **TypeScript**: Strict typing
- **README**: User documentation
- **Inline Comments**: For complex logic

## 🐛 Bug Reports

### Bug Report Template

```markdown
## Bug Description

Brief description of the problem

## Steps to Reproduce

1. Open the app
2. Click on event X
3. Observe error Y

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Environment

- Browser: Chrome 120
- OS: macOS 14.0
- App Version: 1.0.0

## Additional Information

Screenshots, console logs, etc.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description

Brief description of desired feature

## Use Case

Why this feature is needed

## Proposed Solution

How the implementation could look

## Alternatives Considered

Other solution approaches

## Additional Information

Mockups, examples, etc.
```

## 🤝 Pull Request Process

### PR Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Code review completed
- [ ] CI/CD pipeline passed
- [ ] No breaking changes (or documented)

### PR Template

```markdown
## Changes

Description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

How changes were tested

## Screenshots

If UI changes

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
```

## 📋 Coding Standards

### TypeScript

```typescript
// Strict typing
interface Event {
  id: string;
  title: string;
  startTime: string;
  duration: number;
}

// No any types without justification
function processEvent(event: Event): void {
  // Implementation
}
```

### Error Handling

```typescript
// Graceful degradation
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.warn('Operation failed:', error);
  return fallbackValue;
}
```

### Performance

- **Lazy Loading**: Images and assets
- **Debouncing**: Event handlers
- **Memoization**: Expensive calculations
- **Bundle Optimization**: Tree shaking

## 🎯 Roadmap

### Planned Features

- [ ] Offline synchronization
- [ ] Push notifications
- [ ] Multi-event timer
- [ ] Export/import events
- [ ] Advanced audio options

### Technical Improvements

- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Increase test coverage
- [ ] Reduce bundle size

## 📞 Support

### Questions & Discussion

- **Issues**: For bugs and feature requests
- **Discussions**: For general questions
- **Wiki**: For detailed documentation

### Contact

- **Maintainer**: [@vergissberlin](https://github.com/vergissberlin)
- **Repository**: [event-timer](https://github.com/vergissberlin/event-timer)

## 📄 License

By contributing to the project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for your contributions! 🚀
