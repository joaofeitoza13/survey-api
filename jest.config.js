module.exports = {
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/domain/**',
    '!**/env.ts'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: { '.+\\.ts$': 'ts-jest' },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}
