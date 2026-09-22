import type { Config } from 'jest';
import { getJestProjectsAsync } from '@nx/jest';

export default async (): Promise<Config> => ({
  projects: await getJestProjectsAsync(),
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
});
