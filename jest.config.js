globalThis.ngJest = {
  skipNgcc: true,
  tsconfig: 'tsconfig.spec.json'
};

module.exports = {
  rootDir: '.',
  preset: 'jest-preset-angular',
  globalSetup: 'jest-preset-angular/global-setup',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  clearMocks: true,
  testTimeout: 20000,
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(ts|js|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: 'tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        isolatedModules: true
      }
    ]
  },
  coveragePathIgnorePatterns: ['/node_modules/', 'index.ts', 'public-api.ts', '.module.ts'],
  coverageDirectory: 'coverage'
};
