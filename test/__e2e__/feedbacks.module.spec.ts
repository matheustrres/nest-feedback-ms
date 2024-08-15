import { faker } from '@faker-js/faker';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { type Connection } from 'mongoose';
import request from 'supertest';

import { type CreateFeedbackDto } from '@/feedbacks/dtos/create-feedback.dto';
import { FeedbacksModule } from '@/feedbacks/feedbacks.module';

import { DatabaseModule } from '@/shared/modules/database/database.module';
import { DatabaseService } from '@/shared/modules/database/database.service';

describe('FeedbacksModule', () => {
	let app: INestApplication;
	let conn: Connection;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [FeedbacksModule, DatabaseModule],
		}).compile();

		app = moduleRef.createNestApplication();
		await app.init();

		conn = moduleRef.get<DatabaseService>(DatabaseService).getConnection();
	});

	it('should be defined', () => {
		expect(app).toBeDefined();
		expect(conn).toBeDefined();
	});

	describe('X POST /feedbacks', () => {
		const dto: CreateFeedbackDto = {
			userId: faker.string.uuid(),
			productId: faker.string.uuid(),
			comment: faker.lorem.lines(1),
			rating: faker.number.int({
				min: 0,
				max: 5,
			}),
		};

		it('should create a feedback', async () => {
			return request(app.getHttpServer())
				.post('/feedbacks')
				.send(dto)
				.expect(201)
				.then((res) => {
					expect(res.body).toMatchObject(dto);
				});
		});

		it('should return an error if user has already sent feedback for given product', async () => {
			await request(app.getHttpServer()).post('/feedbacks').send(dto);

			return request(app.getHttpServer())
				.post('/feedbacks')
				.send(dto)
				.expect(400)
				.expect({
					message: `User "${dto.userId} has already sent feedback for product "${dto.productId}".`,
					error: 'Bad Request',
					statusCode: 400,
				});
		});
	});

	afterAll(async () => {
		await conn.dropDatabase();
		await conn.close();
		await app.close();
	});
});
