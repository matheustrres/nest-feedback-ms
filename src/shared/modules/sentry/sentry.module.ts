import { type DynamicModule, Module, type Provider } from '@nestjs/common';

import {
	SENTRY_MODULE_ASYNC_OPTIONS_TOKEN,
	SENTRY_TOKEN,
} from './sentry.config';
import {
	type SentryModuleAsyncOptions,
	type SentryModuleOptions,
} from './sentry.types';

import { NestSentry } from '@/@libs/sentry';

@Module({})
export class SentryModule {
	static forRoot(sentryModuleOptions: SentryModuleOptions): DynamicModule {
		NestSentry.init(sentryModuleOptions);

		return {
			module: SentryModule,
			global: true,
		};
	}

	static forRootAsync(
		sentryModuleAsyncOptions: SentryModuleAsyncOptions,
	): DynamicModule {
		const sentryProvider: Provider = {
			provide: SENTRY_TOKEN,
			useFactory: (sentryModuleOptions: SentryModuleOptions) =>
				NestSentry.init(sentryModuleOptions),
			inject: [SENTRY_MODULE_ASYNC_OPTIONS_TOKEN],
		};

		const sentryAsyncProviders: Provider[] = [
			{
				provide: SENTRY_MODULE_ASYNC_OPTIONS_TOKEN,
				useFactory: sentryModuleAsyncOptions.useFactory,
				inject: sentryModuleAsyncOptions.inject,
			},
		];

		return {
			module: SentryModule,
			imports: sentryModuleAsyncOptions.imports,
			providers: [...sentryAsyncProviders, sentryProvider],
			global: true,
		};
	}
}
