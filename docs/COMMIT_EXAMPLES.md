# Example Next Commits (Conventional Commits Format)

## Feature Commits
```
feat: add dark mode toggle functionality
feat(audio): implement volume control for timer sounds
feat(timer): add pause/resume functionality
feat(events): add event categories and filtering
feat(ui): add responsive design for mobile devices
```

## Bug Fix Commits
```
fix: resolve timer accuracy issues with requestAnimationFrame
fix(audio): correct Web Audio API initialization error
fix(timer): fix off-by-one error in countdown display
fix(events): handle invalid date formats gracefully
fix(ui): correct z-index issues in modal overlays
```

## Documentation Commits
```
docs: update README with new audio features
docs: add API documentation for EventsManager
docs: improve installation instructions
docs: add troubleshooting section
docs: update contributing guidelines
```

## Test Commits
```
test: add unit tests for Timer class
test: improve test coverage for AudioManager
test: add integration tests for event loading
test: mock browser APIs for reliable testing
test: add performance benchmarks
```

## Refactor Commits
```
refactor: extract timer logic into separate class
refactor(audio): simplify Web Audio API usage
refactor(events): improve data validation logic
refactor(ui): separate concerns in main component
refactor: optimize bundle size with tree shaking
```

## Performance Commits
```
perf: optimize timer update frequency
perf: reduce bundle size by 15%
perf: improve image loading with lazy loading
perf: optimize audio context management
perf: reduce memory usage in event handling
```

## CI/CD Commits
```
ci: update GitHub Actions to use Node.js 20
ci: fix deprecated upload-artifact action
ci: add code coverage reporting
ci: optimize build pipeline
ci: add automated dependency updates
```

## Build Commits
```
build: update Vite to version 5.0
build: optimize production build process
build: add source maps for debugging
build: configure tree shaking for smaller bundles
build: update TypeScript configuration
```

## Chore Commits
```
chore: update dependencies to latest versions
chore: add .gitignore for IDE files
chore: configure Prettier formatting
chore: add ESLint configuration
chore: update package.json scripts
```

## Breaking Change Commits
```
feat!: change timer API to use milliseconds

BREAKING CHANGE: Timer constructor now expects milliseconds instead of seconds.
Update all timer calls to multiply by 1000.

Closes #123
```

## Commit with Body and Footer
```
feat(audio): implement spatial audio for immersive experience

Add 3D audio positioning for timer sounds to create a more immersive
user experience. This includes left/right channel separation and
distance-based volume adjustment.

- Add Web Audio API spatial audio support
- Implement HRTF (Head-Related Transfer Function) processing
- Add audio positioning configuration in settings

Closes #456
Fixes #789
```

## Revert Commits
```
revert: revert breaking change in timer API

This reverts commit abc123def456 which introduced breaking changes
to the timer API. The changes will be reimplemented in a backward-
compatible way in the next release.

Reverts #123
```
