/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',

	// Automatically clear mock calls and instances between every test
	clearMocks: true,

	// Indicates whether the coverage information should be collected while executing the test
	collectCoverage: false,

	// An array of glob patterns indicating a set of files for which coverage information should be collected
	collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx,js,jsx}'],

	// The directory where Jest should output its coverage files
	coverageDirectory: 'coverage',

	// The glob patterns Jest uses to detect test files
	testMatch: ['<rootDir>/tests/**/?(*.)+(spec|test).ts?(x)'],

	// A map from regular expressions to paths to transformers
	transform: {
		'^.+\\.[t|j]sx?$': 'ts-jest',
	},
	testTimeout: 20000,

	// Indicates whether each individual test should be reported during the run
	verbose: true,
};
