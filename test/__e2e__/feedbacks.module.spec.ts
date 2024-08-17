import { faker } from '@faker-js/faker';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { type Connection } from 'mongoose';
import request from 'supertest';

import { type CreateFeedbackDto } from '@/feedbacks/dtos/create-feedback.dto';
import { FeedbacksModule } from '@/feedbacks/feedbacks.module';

import { ZodExceptionFilter } from '@/shared/lib/exceptions/filters/zod-exception.filter';
import { DatabaseModule } from '@/shared/modules/database/database.module';
import { DatabaseService } from '@/shared/modules/database/database.service';

const makeDto = (): CreateFeedbackDto => ({
	userId: faker.string.uuid(),
	productId: faker.string.uuid(),
	comment: faker.lorem.lines(1),
	rating: faker.number.int({
		min: 0,
		max: 5,
	}),
});

describe('FeedbacksModule', () => {
	let app: INestApplication;
	let conn: Connection;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [FeedbacksModule, DatabaseModule],
		}).compile();

		app = moduleRef.createNestApplication();
		app.useGlobalFilters(new ZodExceptionFilter());
		await app.init();

		conn = moduleRef.get<DatabaseService>(DatabaseService).getConnection();
	});

	it('should be defined', () => {
		expect(app).toBeDefined();
		expect(conn).toBeDefined();
	});

	describe('X POST /feedbacks', () => {
		it('should return an error if user has already sent feedback for given product', async () => {
			const server = app.getHttpServer();

			const dto = makeDto();

			await request(server).post('/feedbacks').send(dto);

			return request(server)
				.post('/feedbacks')
				.send(dto)
				.expect(400)
				.expect({
					message: `User "${dto.userId} has already sent feedback for product "${dto.productId}".`,
					error: 'Bad Request',
					statusCode: 400,
				});
		});

		it('should return an error if incorret arguments are provided', async () => {
			return request(app.getHttpServer())
				.post('/feedbacks')
				.send({
					...makeDto(),
					rating: 10,
				})
				.expect(400)
				.expect((res) => {
					expect(res.body).toMatchObject({
						status: 'ERROR',
						statusCode: 400,
						content: [
							{
								code: 'too_big',
								path: 'rating',
								message: 'Number must be less than or equal to 5',
							},
						],
						endpoint: 'POST /feedbacks',
					});

					expect(res.body['timestamp']).toBeDefined();
				});
		});

		it('should create a feedback', async () => {
			const dto = makeDto();

			return request(app.getHttpServer())
				.post('/feedbacks')
				.send(dto)
				.expect(201)
				.then((res) => {
					expect(res.body).toMatchObject(dto);
					expect(res.body['id']).toBeDefined();
					expect(res.body['createdAt']).toBeDefined();
					expect(res.body['updatedAt']).toBeDefined();
				});
		});
	});

	describe('X GET /feedbacks/feedback/:id', () => {
		it('should return an error if an invalid UUID is provided', async () => {
			return request(app.getHttpServer())
				.get('/feedbacks/feedback/invalid-uuid')
				.expect(400)
				.expect({
					message: 'Validation failed (uuid is expected)',
					error: 'Bad Request',
					statusCode: 400,
				});
		});

		it('should return an error if no feedback is found with given id', async () => {
			const id = faker.string.uuid();

			return request(app.getHttpServer())
				.get(`/feedbacks/feedback/${id}`)
				.expect(400)
				.expect({
					message: `No feedback was found with ID "${id}".`,
					error: 'Bad Request',
					statusCode: 400,
				});
		});

		it('should return a feedback object', async () => {
			const server = app.getHttpServer();
			const dto = makeDto();

			const { body } = await request(server)
				.post('/feedbacks')
				.send(dto)
				.expect(201);

			return request(server)
				.get(`/feedbacks/feedback/${body['id']}`)
				.expect(200)
				.then((res) => expect(res.body).toMatchObject(dto));
		});
	});

	describe('X DELETE /feedbacks/feedback/:id', () => {
		it('should return an error if an invalid UUID is provided', async () => {
			return request(app.getHttpServer())
				.delete('/feedbacks/feedback/invalid-uuid')
				.expect(400)
				.expect({
					message: 'Validation failed (uuid is expected)',
					error: 'Bad Request',
					statusCode: 400,
				});
		});

		it('should return an error if no feedback is found with given id', async () => {
			const id = faker.string.uuid();

			return request(app.getHttpServer())
				.del(`/feedbacks/feedback/${id}`)
				.expect(400)
				.expect({
					message: `No feedback was found with ID "${id}".`,
					error: 'Bad Request',
					statusCode: 400,
				});
		});

		it('should delete a feedback', async () => {
			const server = app.getHttpServer();

			const { body } = await request(server)
				.post('/feedbacks')
				.send(makeDto())
				.expect(201);

			return request(server)
				.delete(`/feedbacks/feedback/${body['id']}`)
				.expect(200);
		});
	});

	afterAll(async () => {
		await conn.dropDatabase();
		await conn.close();
		await app.close();
	});
});
