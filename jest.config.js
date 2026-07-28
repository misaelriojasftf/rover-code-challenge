
export default {
    testEnvironment: 'node',
    injectGlobals: true,
    moduleNameMapper: {
        '^#application/(.*)$': '<rootDir>/src/application/$1',
        '^#domain/(.*)$': '<rootDir>/src/domain/$1',
        '^#infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    },
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/cli.js',
        '!src/**/constants/**',
        '!src/**/*.entity.js',
        '!src/**/domain/**/*.repository.js',
        '!src/**/utils/logger.util.js',
        '!src/**/index.js',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: [
        'text',
        'html',
        'lcov',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 90,
            lines: 90,
            statements: 90,
        },

    },
};
