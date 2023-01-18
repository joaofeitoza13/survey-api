const config = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/domain/**',
    '!<rootDir>/src/main/server.ts',
    '!<rootDir>/src/**/protocols/**',
    '!<rootDir>/src/**/*-protocols.ts'

  ],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: { '.+\\.ts$': 'ts-jest' }
}
module.exports = config
