module.exports = {
  displayName: 'pp-performer',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/pp-performer',
  // Coverage thresholds - CI will fail if coverage drops below these
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 60,
      lines: 70,
      statements: 70,
    },
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/**/*.spec.ts',
    '!src/test-setup.ts',
    '!src/env.d.ts',
    '!src/environments/*.ts', // Environment files use import.meta.env (build-time injection)
  ],
  // Don't treat environment.test.ts as a test file
  testPathIgnorePatterns: ['/node_modules/', 'environment\\.test\\.ts$'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  // Mock environment files for tests - avoids import.meta.env issues
  moduleNameMapper: {
    '^.*/environments/environment$': '<rootDir>/src/environments/environment.test.ts',
    '^.*/environments/environment.prod$': '<rootDir>/src/environments/environment.test.ts',
  },
};
