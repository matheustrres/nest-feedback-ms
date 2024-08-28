import { type ModuleMetadata } from '@nestjs/common';

import { type NestSentry } from '@/@libs/sentry';

export type SentryModuleOptions = Pick<
	NestSentry.NodeOptions,
	| 'dsn'
	| 'environment'
	| 'debug'
	| 'enabled'
	| 'enableTracing'
	| 'ignoreErrors'
	| 'integrations'
	| 'profilesSampleRate'
	| 'tracesSampleRate'
>;

export type SentryModuleAsyncOptions = Pick<ModuleMetadata, 'imports'> & {
	useFactory: (
		...args: any[]
	) => Promise<SentryModuleOptions> | SentryModuleOptions;
	inject: any[];
};
