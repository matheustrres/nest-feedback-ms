import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseService } from './database.service';

import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [EnvModule],
			useFactory: (envService: EnvService) => ({
				uri: envService.getKey('MONGODB_URI'),
			}),
			inject: [EnvService],
		}),
	],
	providers: [DatabaseService],
	exports: [DatabaseService],
})
export class DatabaseModule {}
