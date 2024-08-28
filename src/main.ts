import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { EnvService } from '@/shared/modules/env/env.service';

(async () => {
	const app = await NestFactory.create(AppModule);

	app.enableShutdownHooks();

	const envService = app.get(EnvService);

	await app.listen(envService.getKey('PORT'));
})();
