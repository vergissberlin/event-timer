# GitHub Actions Configuration

## Overview

This document describes the GitHub Actions workflow used in the Event Timer PWA project for continuous integration, testing, and deployment.

## Workflow

### CI/CD Pipeline (`.github/workflows/ci.yml`)

**Purpose**: Complete CI/CD pipeline that runs tests, linting, and deploys to GitHub Pages

**Triggers**:
- Push to `main` branch
- Push to `develop` branch
- Pull requests to `main` branch
- Manual workflow dispatch

**Concurrency**:
- Group: `ci-${{ github.ref }}`
- Cancels in-progress runs when new commits are pushed
- Prevents concurrent runs on the same branch

**Jobs**:

#### 1. Test Job
**Purpose**: Run quality checks and tests on multiple Node.js versions

**Matrix Strategy**:
- Node.js versions: 18.x, 20.x

**Steps**:
- Checkout code
- Setup Node.js (matrix)
- Setup pnpm 8
- Install dependencies
- Type check
- Lint
- Format check
- Run tests
- Upload coverage to Codecov
- Upload coverage artifact (with matrix version suffix)
- Comment PR with coverage (if PR)

#### 2. Build and Deploy Job
**Purpose**: Build and deploy the application to GitHub Pages

**Dependencies**: Requires successful completion of test job
**Conditions**: Only runs on `main` branch pushes

**Steps**:
- Checkout code
- Setup Node.js 22
- Setup pnpm 8
- Install dependencies
- Type check
- Lint
- Build application
- Setup Pages
- Upload artifact
- Deploy to GitHub Pages

## Concurrency Management

### Problem Solved

The original configuration had multiple deadlock issues:

1. **Artifact Conflicts**: Multiple workflows trying to create artifacts with the same name
2. **Concurrency Deadlocks**: Multiple workflows competing for the same concurrency groups
3. **Branch Conflicts**: Separate workflows running on overlapping branches

### Solution

1. **Single Workflow**: Combined all CI/CD activities into one workflow
2. **Unique Artifact Names**: Added matrix version suffix to prevent conflicts
3. **Sequential Jobs**: Deploy job only runs after successful test completion
4. **Branch-Specific Concurrency**: Single concurrency group per branch

### Concurrency Rules

#### Current Configuration
```yaml
# Single workflow with sequential jobs
concurrency:
  group: "ci-${{ github.ref }}"
  cancel-in-progress: true

jobs:
  test:
    # Runs on all triggers
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
  build-and-deploy:
    needs: test  # Only runs after test job succeeds
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
```

#### Artifact Naming
```yaml
# Unique names prevent conflicts
- name: Upload coverage to GitHub
  uses: actions/upload-artifact@v4
  with:
    name: coverage-report-${{ matrix.node-version }}  # Unique per matrix
    path: coverage/
```

## Branch Strategy

### Main Branch (`main`)
- **Test Job**: Runs on every push and pull request
- **Deploy Job**: Runs only after successful tests
- **Purpose**: Production deployment with quality gates

### Develop Branch (`develop`)
- **Test Job**: Runs on every push
- **Deploy Job**: Does not run
- **Purpose**: Development and testing

### Feature Branches
- **Test Job**: Runs on pull requests to main
- **Deploy Job**: Does not run
- **Purpose**: Feature development and testing

## Quality Gates

### Required Checks (Test Job)
- ✅ TypeScript compilation
- ✅ ESLint passes
- ✅ Prettier formatting
- ✅ All tests pass
- ✅ Minimum 80% test coverage

### Deployment Requirements (Build Job)
- ✅ All quality gates pass (test job succeeded)
- ✅ Only deploys from `main` branch
- ✅ Only deploys on push events (not pull requests)
- ✅ Manual approval not required (automatic deployment)

## Artifacts

### Coverage Reports
- **Location**: `./coverage/`
- **Format**: LCOV
- **Upload**: Codecov and GitHub Artifacts
- **Naming**: `coverage-report-{node-version}` (prevents conflicts)
- **Retention**: 30 days

### Build Artifacts
- **Location**: `./dist/`
- **Format**: Static files for GitHub Pages
- **Upload**: GitHub Pages artifact
- **Deployment**: Automatic to GitHub Pages

## Environment Variables

### Required Secrets
- `GITHUB_TOKEN`: Automatically provided by GitHub
- No additional secrets required for basic functionality

### Required Permissions
The workflow requires the following permissions:
- `contents: read`: Read repository contents
- `pages: write`: Deploy to GitHub Pages
- `id-token: write`: GitHub Pages authentication
- `issues: write`: Comment on issues (for coverage reports)
- `pull-requests: write`: Comment on pull requests (for coverage reports)

### Optional Secrets
- `CODECOV_TOKEN`: For enhanced Codecov integration
- `NPM_TOKEN`: For publishing to npm (if needed)

## Troubleshooting

### Common Issues

#### 1. Artifact Conflicts
**Symptoms**: "Failed to CreateArtifact: Received non-retryable error: Failed request: (409) Conflict: an artifact with this name already exists"
**Causes**: Multiple matrix runs trying to create artifacts with the same name

**Solutions**:
- Use unique artifact names with matrix version suffix
- Ensure only one workflow creates artifacts
- Use sequential job execution

#### 2. Concurrency Deadlock
**Symptoms**: "Canceling since a deadlock was detected for concurrency group"
**Causes**: Multiple workflows using the same concurrency group

**Solutions**:
- Use single workflow with sequential jobs
- Use branch-specific concurrency groups
- Define concurrency only at workflow level

#### 3. Build Failures
**Symptoms**: TypeScript compilation errors
**Solution**: Run `pnpm type-check` locally before pushing

#### 4. Test Failures
**Symptoms**: Tests failing in CI but passing locally
**Solution**: 
- Check Node.js version compatibility
- Ensure all dependencies are installed
- Run `pnpm test:ci` locally

#### 5. Deployment Failures
**Symptoms**: Build succeeds but deployment fails
**Solution**:
- Check GitHub Pages settings
- Verify repository permissions
- Check for large files in build output

#### 6. Permission Errors
**Symptoms**: "Resource not accessible by integration" or "403 Forbidden"
**Causes**: Missing required permissions for GitHub Actions

**Solutions**:
- Ensure workflow has required permissions defined
- Check repository settings for Actions permissions
- Verify `GITHUB_TOKEN` has sufficient scope
- For coverage comments: Ensure `issues: write` and `pull-requests: write` permissions

### Debugging

#### Enable Debug Logging
```yaml
env:
  ACTIONS_STEP_DEBUG: true
```

#### Check Workflow Logs
1. Go to Actions tab in GitHub
2. Select the failed workflow run
3. Check individual job logs
4. Look for error messages and stack traces

#### Local Testing
```bash
# Test build process
pnpm build

# Test all quality checks
pnpm type-check
pnpm lint
pnpm format --check
pnpm test:ci
```

## Best Practices

### 1. Workflow Design
- Single workflow for all CI/CD activities
- Sequential job execution for dependencies
- Matrix strategies for multiple environments
- Proper concurrency controls

### 2. Performance
- Cache dependencies and build artifacts
- Use pnpm for faster installs
- Parallelize matrix runs where possible
- Avoid redundant installations

### 3. Security
- Use minimal required permissions
- Don't expose secrets in logs
- Use `GITHUB_TOKEN` for repository access

### 4. Reliability
- Implement proper error handling
- Use retry mechanisms for flaky operations
- Monitor workflow success rates
- Ensure artifacts have unique names

## Future Improvements

### Planned Enhancements
- [ ] Add performance testing workflow
- [ ] Implement automated dependency updates
- [ ] Add security scanning
- [ ] Implement staging deployment
- [ ] Add automated release creation

### Monitoring
- [ ] Track workflow execution times
- [ ] Monitor test coverage trends
- [ ] Alert on repeated failures
- [ ] Track deployment success rates

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Deployment](https://docs.github.com/en/pages)
- [Concurrency in GitHub Actions](https://docs.github.com/en/actions/using-jobs/using-concurrency)
- [Matrix Strategy](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)
- [Job Dependencies](https://docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow#defining-prerequisite-jobs)
