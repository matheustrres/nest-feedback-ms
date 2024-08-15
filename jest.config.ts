import { type Config } from 'jest';

export default {
	roots: ['<rootDir>/src'],
	moduleFileExtensions: ['js', 'json', 'ts'],
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
	moduleNameMapper: {
		'@/tests/(.+)': '<rootDir>/tests/$1',
		'@/feedbacks/(.+)': '<rootDir>/src/feedbacks/$1',
		'@/shared/(.+)': '<rootDir>/src/shared/$1',
	},
} as Config;
