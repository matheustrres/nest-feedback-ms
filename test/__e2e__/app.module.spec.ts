import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';

describe('AppModule (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();

		await app.init();
	});

	it('/GET', () => {
		return request(app.getHttpServer())
			.get('/')
			.expect(200)
			.expect('Hello World!');
	});

	afterAll(async () => {
		await app.close();
	});
});
