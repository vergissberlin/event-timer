# Testing & Code Coverage

## Overview

This project includes comprehensive testing infrastructure with automated code coverage reporting for both local development and CI/CD pipelines.

## Test Framework

- **Jest**: JavaScript testing framework
- **ts-jest**: TypeScript support for Jest
- **jsdom**: DOM environment for browser-like testing
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing

## Test Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run tests for CI/CD
pnpm test:ci
```

## Code Coverage

### Local Coverage

When running `pnpm test:coverage`, the following reports are generated:

- **HTML Report**: `coverage/index.html` - Interactive coverage report
- **LCOV Report**: `coverage/lcov.info` - Standard coverage format
- **Console Output**: Summary in terminal

### CI/CD Coverage

The GitHub Actions workflow automatically generates and uploads coverage reports:

1. **Codecov Integration**: Uploads to Codecov.io for historical tracking
2. **GitHub Artifacts**: Stores coverage reports as build artifacts
3. **Pull Request Comments**: Automatically comments on PRs with coverage summary

### Coverage Configuration

Coverage is configured in `jest.config.js`:

```javascript
collectCoverageFrom: [
  'src/**/*.ts',
  '!src/**/*.d.ts',
  '!src/main.ts', // Exclude main app file
],
coverageDirectory: 'coverage',
coverageReporters: ['text', 'lcov', 'html'],
```

## GitHub Actions Integration

### Test Workflow

The `.github/workflows/test.yml` workflow:

1. **Runs on**: Push to main/develop, Pull Requests to main
2. **Matrix Testing**: Node.js 18.x and 20.x
3. **Quality Checks**: Type check, lint, format check
4. **Test Execution**: Runs all tests with coverage
5. **Coverage Upload**: Multiple coverage reporting methods

### Pull Request Coverage Comments

When a Pull Request is created or updated:

1. **Automatic Comment**: Coverage summary is posted as a comment
2. **Coverage Trend**: Shows coverage changes from previous commits
3. **File-level Details**: Highlights files with coverage changes
4. **Coverage Badge**: Visual indicator of coverage status

### Coverage Artifacts

- **Retention**: 30 days
- **Format**: HTML, LCOV, and text reports
- **Access**: Available in GitHub Actions artifacts

## Test Structure

```
tests/
├── setup.ts              # Jest setup & global mocks
├── audio.test.ts         # AudioManager tests
├── timer.test.ts         # Timer tests
├── events.test.ts        # EventsManager tests
├── settings.test.ts      # SettingsManager tests
└── favicon.test.ts       # FaviconGenerator tests
```

## Mocking Strategy

### Browser APIs

The test setup includes comprehensive mocks for browser APIs:

- **AudioContext**: Web Audio API
- **SpeechSynthesis**: Speech API
- **localStorage/sessionStorage**: Storage APIs
- **fetch**: Network requests
- **ResizeObserver**: Layout APIs
- **Fullscreen API**: Fullscreen functionality

### DOM Elements

- **document.head**: Head element manipulation
- **canvas**: Canvas API for image generation
- **Image**: Image preloading

## Coverage Goals

- **Minimum Coverage**: 80% overall
- **Critical Paths**: 100% coverage for core functionality
- **New Features**: 100% coverage requirement

## Troubleshooting

### Common Issues

1. **Mock Failures**: Ensure all browser APIs are properly mocked
2. **Timer Tests**: Use `jest.advanceTimersByTime()` for timer-based tests
3. **Async Tests**: Use proper async/await patterns
4. **Coverage Gaps**: Check excluded files in jest.config.js

### Debugging

```bash
# Run specific test file
pnpm test tests/audio.test.ts

# Run with verbose output
pnpm test --verbose

# Run with coverage for specific file
pnpm test --coverage --collectCoverageFrom="src/audio.ts"
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Mock Everything**: Don't rely on external dependencies
3. **Clear Assertions**: Use descriptive test names and assertions
4. **Coverage First**: Write tests before implementing features
5. **Regular Updates**: Keep tests in sync with code changes

## Future Improvements

- [ ] Integration tests for full user workflows
- [ ] Visual regression testing
- [ ] Performance testing
- [ ] Accessibility testing
- [ ] Cross-browser testing
