# Pre-PR Validation

Run all validation checks before creating a pull request. This command will:

1. Identify changed files and determine what needs testing
2. Create or update unit tests for new/modified code
3. Run linting and fix any issues
4. Run the build to catch compilation errors
5. Run unit tests with coverage
6. Check coverage thresholds and add tests if needed
7. Run E2E tests
8. Report results and readiness for PR

## Instructions

Execute the following steps in order. If any step fails, attempt to fix it before proceeding.

### Step 1: Analyze Changes
Run `git diff main --name-only` to identify changed files. Categorize them:
- New components/services that need unit tests
- Modified files that may need test updates
- Files that are test files themselves

### Step 2: Create/Update Unit Tests
For each new or significantly modified source file:
- Check if a corresponding `.spec.ts` file exists
- If not, create one with meaningful tests
- If it exists, verify tests cover the changes
- Follow existing test patterns in the codebase

### Step 3: Run Lint
```bash
npx nx run-many -t lint
```
Fix any linting errors that arise.

### Step 4: Run Build
```bash
npx nx run-many -t build
```
Fix any compilation errors.

### Step 5: Run Unit Tests with Coverage
```bash
npx nx run pp-performer:test --coverage
```
Review the coverage report. Current thresholds:
- Branches: 70%
- Functions: 60%
- Lines: 70%
- Statements: 70%

### Step 6: Improve Coverage if Needed
If coverage is below thresholds:
- Identify uncovered lines from the coverage report
- Add tests targeting those specific code paths
- Re-run tests to verify improvement
- Repeat until thresholds are met

### Step 7: Run E2E Tests
```bash
npx nx run pp-performer-e2e:e2e
```
Fix any failing E2E tests.

### Step 8: Final Report
Summarize:
- All checks passed/failed
- Coverage percentages
- Any issues that couldn't be auto-fixed
- Recommendation: Ready for PR or needs manual intervention

If all checks pass, inform the user they can proceed with creating the PR.
