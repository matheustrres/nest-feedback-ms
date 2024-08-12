import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envSchema } from './env.schema';
import { EnvService } from './env.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: false,
			envFilePath: '.env',
			validate: (config: Record<string, any>) => envSchema.parse(config),
		}),
	],
	providers: [EnvService],
	exports: [EnvService],
})
export class EnvModule {}
