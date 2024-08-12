import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from './shared/env/env.module';
import { EnvService } from './shared/env/env.service';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [EnvModule],
			useFactory: (envService: EnvService) => {
				const user = envService.getKeyOrThrow('MONGODB_USER');
				const pass = envService.getKeyOrThrow('MONGODB_PASSWORD');
				const localPort = envService.getKeyOrThrow('MONGODB_PORT');
				const dbName = envService.getKeyOrThrow('MONGODB_DATABASE');

				return {
					user,
					pass,
					localPort,
					dbName,
					uri: `mongodb://${user}:${pass}@localhost:27017/${dbName}?authSource=admin`,
				};
			},
			inject: [EnvService],
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
