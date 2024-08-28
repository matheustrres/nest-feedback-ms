import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { GlobalExceptionFilter } from '@/shared/lib/exceptions/filters/global-exception-filter';
import { ZodExceptionFilter } from '@/shared/lib/exceptions/filters/zod-exception-filter';
import { EnvService } from '@/shared/modules/env/env.service';
import { SentryService } from '@/shared/modules/sentry/sentry.service';

(async () => {
	const app = await NestFactory.create(AppModule);

	const sentryService = app.get(SentryService);

	app.enableShutdownHooks();
	app.useGlobalFilters(
		new GlobalExceptionFilter(sentryService),
		new ZodExceptionFilter(),
	);

	const envService = app.get(EnvService);

	await app.listen(envService.getKey('PORT'));
})();
