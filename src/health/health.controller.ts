import { Controller, Get } from '@nestjs/common';
/* eslint-disable @typescript-eslint/consistent-type-imports */
import {
	HealthCheckService,
	HttpHealthIndicator,
	HealthCheck,
	MongooseHealthIndicator,
	HealthCheckResult,
	MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
	constructor(
		private readonly health: HealthCheckService,
		private readonly http: HttpHealthIndicator,
		private readonly mongoose: MongooseHealthIndicator,
		private readonly memory: MemoryHealthIndicator,
	) {}

	@Get('/ping')
	@HealthCheck()
	async checkPing(): Promise<HealthCheckResult> {
		return this.health.check([
			() => this.http.pingCheck('Google', 'https://www.google.com.br/'),
		]);
	}

	@Get('/database')
	@HealthCheck()
	async checkMongoose() {
		return this.health.check([async () => this.mongoose.pingCheck('mongoose')]);
	}

	@Get('/memory')
	@HealthCheck()
	check() {
		return this.health.check([
			() => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
		]);
	}
}
