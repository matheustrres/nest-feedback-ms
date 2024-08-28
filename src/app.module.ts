import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { FeedbacksModule } from '@/feedbacks/feedbacks.module';

import { HealthModule } from '@/health/health.module';

import { GlobalExceptionFilter } from '@/shared/lib/exceptions/filters/global-exception-filter';
import { ZodExceptionFilter } from '@/shared/lib/exceptions/filters/zod-exception-filter';
import { DatabaseModule } from '@/shared/modules/database/database.module';
import { EnvModule } from '@/shared/modules/env/env.module';
import { EnvService } from '@/shared/modules/env/env.service';
import { SentryModule } from '@/shared/modules/sentry/sentry.module';
import { type SentryModuleOptions } from '@/shared/modules/sentry/sentry.types';

@Module({
	imports: [
		SentryModule.forRootAsync({
			imports: [EnvModule],
			useFactory: (envService: EnvService): SentryModuleOptions => {
				const nodeEnv = envService.getKeyOrThrow('NODE_ENV');

				return {
					dsn: envService.getKeyOrThrow('SENTRY_DSN'),
					environment: nodeEnv,
					enabled: nodeEnv === 'production',
					tracesSampleRate: nodeEnv === 'production' ? 0.1 : 1.0,
					debug: nodeEnv === 'development',
					integrations: [nodeProfilingIntegration()],
					profilesSampleRate: 1.0,
				};
			},
			inject: [EnvService],
		}),
		DatabaseModule,
		HealthModule,
		FeedbacksModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useClass: GlobalExceptionFilter,
		},
		{
			provide: APP_FILTER,
			useClass: ZodExceptionFilter,
		},
	],
})
export class AppModule {}
