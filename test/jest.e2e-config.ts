import { type Config } from 'jest';

import jestConfig from '../jest.config';

export default {
	...jestConfig,
	roots: ['<rootDir>/test/__e2e__'],
	rootDir: '..',
	displayName: 'E2E Test',
	testRegex: '.*\\.spec\\.ts$',
} as Config;
