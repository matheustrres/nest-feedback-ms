import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { ZodExceptionFilter } from '@/shared/lib/exceptions/filters/zod-exception.filter';
import { EnvService } from '@/shared/modules/env/env.service';

(async () => {
	const app = await NestFactory.create(AppModule);

	app.enableShutdownHooks();
	app.useGlobalFilters(new ZodExceptionFilter());

	const envService = app.get(EnvService);

	await app.listen(envService.getKey('PORT'));
})();
