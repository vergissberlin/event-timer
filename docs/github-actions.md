# GitHub Actions Configuration

## Overview

This document describes the GitHub Actions workflows used in the Event Timer PWA project for continuous integration, testing, and deployment.

## Workflows

### 1. Deploy Workflow (`.github/workflows/deploy.yml`)

**Purpose**: Build and deploy the application to GitHub Pages

**Triggers**:
- Push to `main` branch
- Pull requests to `main` branch
- Manual workflow dispatch

**Concurrency**:
- Group: `pages-deploy-${{ github.ref }}`
- Prevents concurrent deployments on the same branch
- Does not cancel in-progress deployments

**Jobs**:
1. **build-and-deploy**: Builds the application and deploys to GitHub Pages

**Steps**:
- Checkout code
- Setup Node.js 22
- Setup pnpm 8
- Install dependencies
- Type check
- Build application
- Setup Pages
- Upload artifact
- Deploy to GitHub Pages (only on main branch)

### 2. Test Workflow (`.github/workflows/test.yml`)

**Purpose**: Run tests, linting, and code quality checks

**Triggers**:
- Push to `develop` branch
- Pull requests to `main` branch

**Concurrency**:
- Group: `tests-${{ github.ref }}`
- Cancels in-progress test runs when new commits are pushed

**Jobs**:
1. **test**: Runs tests on multiple Node.js versions

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
- Upload coverage artifact
- Comment PR with coverage (if PR)

## Concurrency Management

### Problem Solved

The original configuration had multiple deadlock issues:

1. **Workflow vs Workflow**: Both workflows were competing for the same concurrency group
2. **Workflow vs Job**: The deploy workflow had concurrency defined at both workflow and job level
3. **Branch Conflicts**: Test workflow ran on both `main` and `develop`, conflicting with deploy workflow

### Solution

1. **Separate Concurrency Groups**: Each workflow now has its own concurrency group
2. **Single Concurrency Definition**: Concurrency is defined only at workflow level, not at job level
3. **Branch-Specific Groups**: Concurrency groups include the branch reference to prevent conflicts
4. **Different Triggers**: Test workflow only runs on `develop` pushes, deploy workflow on `main` pushes

### Concurrency Rules

#### Correct Configuration (Current)
```yaml
# Deploy Workflow - Only at workflow level
concurrency:
  group: "pages-deploy-${{ github.ref }}"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    # No concurrency at job level
    runs-on: ubuntu-latest
```

#### Test Workflow
```yaml
# Test Workflow - Only at workflow level
concurrency:
  group: "tests-${{ github.ref }}"
  cancel-in-progress: true

jobs:
  test:
    # No concurrency at job level
    runs-on: ubuntu-latest
```

#### ❌ Incorrect Configuration (Causes Deadlock)
```yaml
# DON'T DO THIS - Concurrency at both levels
concurrency:
  group: "pages-deploy"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    concurrency:  # This causes deadlock!
      group: "pages-deploy"
      cancel-in-progress: false
```

#### Concurrency Behavior

##### Deploy Workflow
- **Group**: Unique per branch (`pages-deploy-refs/heads/main`)
- **Behavior**: Queues new deployments, doesn't cancel running ones
- **Reason**: Production deployments should complete even if new commits arrive

##### Test Workflow
- **Group**: Unique per branch (`tests-refs/heads/develop`)
- **Behavior**: Cancels in-progress tests when new commits arrive
- **Reason**: Tests should always run on the latest code

## Branch Strategy

### Main Branch (`main`)
- **Deploy Workflow**: Builds and deploys to GitHub Pages
- **Test Workflow**: Runs on pull requests only
- **Purpose**: Production deployment

### Develop Branch (`develop`)
- **Deploy Workflow**: Does not run
- **Test Workflow**: Runs on every push
- **Purpose**: Development and testing

### Feature Branches
- **Deploy Workflow**: Does not run
- **Test Workflow**: Runs on pull requests to main
- **Purpose**: Feature development and testing

## Quality Gates

### Required Checks
- ✅ TypeScript compilation
- ✅ ESLint passes
- ✅ Prettier formatting
- ✅ All tests pass
- ✅ Minimum 80% test coverage

### Deployment Requirements
- ✅ All quality gates pass
- ✅ Only deploys from `main` branch
- ✅ Manual approval not required (automatic deployment)

## Artifacts

### Coverage Reports
- **Location**: `./coverage/`
- **Format**: LCOV
- **Upload**: Codecov and GitHub Artifacts
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

### Optional Secrets
- `CODECOV_TOKEN`: For enhanced Codecov integration
- `NPM_TOKEN`: For publishing to npm (if needed)

## Troubleshooting

### Common Issues

#### 1. Concurrency Deadlock
**Symptoms**: "Canceling since a deadlock was detected for concurrency group"
**Causes**:
- Multiple workflows using the same concurrency group
- Concurrency defined at both workflow and job level
- Branch conflicts between workflows

**Solutions**:
- Use unique concurrency groups per workflow: `pages-deploy-${{ github.ref }}` vs `tests-${{ github.ref }}`
- Define concurrency only at workflow level, not at job level
- Separate workflow triggers to avoid conflicts

#### 2. Build Failures
**Symptoms**: TypeScript compilation errors
**Solution**: Run `pnpm type-check` locally before pushing

#### 3. Test Failures
**Symptoms**: Tests failing in CI but passing locally
**Solution**: 
- Check Node.js version compatibility
- Ensure all dependencies are installed
- Run `pnpm test:ci` locally

#### 4. Deployment Failures
**Symptoms**: Build succeeds but deployment fails
**Solution**:
- Check GitHub Pages settings
- Verify repository permissions
- Check for large files in build output

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
- Keep workflows focused and single-purpose
- Use matrix strategies for multiple environments
- Implement proper concurrency controls

### 2. Performance
- Cache dependencies and build artifacts
- Use pnpm for faster installs
- Parallelize jobs where possible

### 3. Security
- Use minimal required permissions
- Don't expose secrets in logs
- Use `GITHUB_TOKEN` for repository access

### 4. Reliability
- Implement proper error handling
- Use retry mechanisms for flaky operations
- Monitor workflow success rates

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
