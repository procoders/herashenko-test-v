module.exports = {
    roots: ['<rootDir>'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'js', 'node'],
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],
};
