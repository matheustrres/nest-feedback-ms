import { faker } from '@faker-js/faker';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { type Connection } from 'mongoose';
import request from 'supertest';

import { type CreateFeedbackDto } from '@/feedbacks/dtos/create-feedback.dto';
import { type UpdateFeedbackDto } from '@/feedbacks/dtos/update-feedback.dto';
import { type Feedback } from '@/feedbacks/feedback.entity';
import { FeedbacksModule } from '@/feedbacks/feedbacks.module';

import { GlobalExceptionFilter } from '@/shared/lib/exceptions/filters/global-exception-filter';
import { ZodExceptionFilter } from '@/shared/lib/exceptions/filters/zod-exception-filter';
import { DatabaseModule } from '@/shared/modules/database/database.module';
import { DatabaseService } from '@/shared/modules/database/database.service';

function makeCreateFeedbackDto(productId?: string): CreateFeedbackDto {
	return {
		userId: faker.string.uuid(),
		productId: productId ?? faker.string.uuid(),
		comment: faker.lorem.lines(1),
		rating: faker.number.int({
			min: 0,
			max: 5,
		}),
	};
}

describe('FeedbacksModule', () => {
	let app: INestApplication;
	let conn: Connection;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [FeedbacksModule, DatabaseModule],
		}).compile();

		app = moduleRef.createNestApplication();

		app.enableShutdownHooks();
		app.useGlobalFilters(new GlobalExceptionFilter());
		app.useGlobalFilters(new ZodExceptionFilter());

		await app.init();

		conn = moduleRef.get<DatabaseService>(DatabaseService).getConnection();
	});

	beforeEach(async () => {
		await conn.dropCollection('feedbacks');
	});

	it('should be defined', () => {
		expect(app).toBeDefined();
		expect(conn).toBeDefined();
	});

	describe('X POST /feedbacks', () => {
		it('should return an error if user has already sent feedback for given product', async () => {
			const server = app.getHttpServer();

			const dto = makeCreateFeedbackDto();

			await request(server).post('/feedbacks').send(dto);

			return request(server)
				.post('/feedbacks')
				.send(dto)
				.expect(400)
				.then((res) => {
					expect(res.body).toMatchObject({
						status: 'ERROR',
						code: 400,
						content: `User "${dto.userId}" has already sent feedback for product "${dto.productId}".`,
						endpoint: 'POST /feedbacks',
					});
					expect(res.body['timestamp']).toBeDefined();
				});
		});

		it('should return an error if incorret arguments are provided', async () => {
			return request(app.getHttpServer())
				.post('/feedbacks')
				.send({
					...makeCreateFeedbackDto(),
					rating: 10,
				})
				.expect(400)
				.expect((res) => {
					expect(res.body).toMatchObject({
						status: 'ERROR',
						code: 400,
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
			const dto = makeCreateFeedbackDto();

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

	describe('X GET /feedbacks?productId=', () => {
		it('should return an error if no productId is provided', async () => {
			return request(app.getHttpServer())
				.get('/feedbacks?=')
				.expect(400)
				.then((res) => {
					expect(res.body).toMatchObject({
						status: 'ERROR',
						code: 400,
						content: [
							{
								code: 'invalid_type',
								path: 'productId',
								message: 'Required',
							},
						],
						endpoint: 'GET /feedbacks',
					});
					expect(res.body['timestamp']).toBeDefined();
				});
		});

		it('should return an error if an invalid productId is provided', async () => {
			return request(app.getHttpServer())
				.get('/feedbacks?productId="123"')
				.expect(400)
				.then((res) => {
					expect(res.body).toMatchObject({
						status: 'ERROR',
						code: 400,
						content: [
							{
								code: 'invalid_string',
								path: 'productId',
								message: 'Invalid uuid',
							},
						],
						endpoint: 'GET /feedbacks',
					});
					expect(res.body['timestamp']).toBeDefined();
				});
		});

		it('should return all feedbacks for a product', async () => {
			const server = app.getHttpServer();

			const productId = faker.string.uuid();

			await Promise.all([
				request(server)
					.post('/feedbacks')
					.send(makeCreateFeedbackDto(productId)),
				request(server)
					.post('/feedbacks')
					.send(makeCreateFeedbackDto(productId)),
				request(server)
					.post('/feedbacks')
					.send(makeCreateFeedbackDto(productId)),
				request(server).post('/feedbacks').send(makeCreateFeedbackDto()),
				request(server).post('/feedbacks').send(makeCreateFeedbackDto()),
			]);

			return request(server)
				.get(`/feedbacks?productId=${productId}`)
				.expect(200)
				.then((res) => {
					const feedbacks = res.body as Feedback[];

					expect(feedbacks.length).toBe(3);
					for (const feedback of feedbacks) {
						expect(feedback.productId).toEqual(productId);
					}
				});
		});
	});

	describe('X GET /feedbacks/feedback/:id', () => {
		it('should return an error if an invalid UUID is provided', async () => {
			return request(app.getHttpServer())
				.get('/feedbacks/feedback/invalid-uuid')
				.expect(400)
				.then((res) => {
					expect(res.body).toMatchObject({
						status: 'ERROR',
						code: 400,
						content: 'Validation failed (uuid is expected)',
						endpoint: 'GET /feedbacks/feedback/invalid-uuid',
					});
					expect(res.body['timestamp']).toBeDefined();
				});
		});

		it('should return an error if no feedback is found with given id', async () => {
			const id = faker.string.uuid();

			return request(app.getHttpServer())
				.get(`/feedbacks/feedback/${id}`)
				.expect(404)
				.then((res) => {
					expect(res.body).toMatchObject({
						status: 'ERROR',
						code: 404,
						content: `No feedback was found with ID "${id}".`,
						endpoint: `GET /feedbacks/feedback/${id}`,
					});
					expect(res.body['timestamp']).toBeDefined();
				});
		});

		it('should return a feedback object', async () => {
			const server = app.getHttpServer();
			const dto = makeCreateFeedbackDto();

			const { body } = await request(server)
				.post('/feedbacks')
				.send(dto)
				.expect(201);

			return request(server)
				.get(`/feedbacks/feedback/${body['id']}`)
				.expect(200)
				.then((res) => {
					expect(res.body).toMatchObject(dto);
					expect(res.body['id']).toBeDefined();
					expect(res.body['createdAt']).toBeDefined();
					expect(res.body['updatedAt']).toBeDefined();
				});
		});
	});

	describe('X DELETE /feedbacks/feedback/:id', () => {
		it('should return an error if an invalid UUID is provided', async () => {
			return request(app.getHttpServer())
				.delete('/feedbacks/feedback/invalid-uuid')
				.expect(400)
				.then((res) => {
					expect(res.body).toMatchObject({
						status: 'ERROR',
						code: 400,
						content: 'Validation failed (uuid is expected)',
						endpoint: 'DELETE /feedbacks/feedback/invalid-uuid',
					});
					expect(res.body['timestamp']).toBeDefined();
				});
		});

		it('should return an error if no feedback is found with given id', async () => {
			const id = faker.string.uuid();

			return request(app.getHttpServer())
				.delete(`/feedbacks/feedback/${id}`)
				.expect(404)
				.then((res) => {
					expect(res.body).toMatchObject({
						status: 'ERROR',
						code: 404,
						content: `No feedback was found with ID "${id}".`,
						endpoint: `DELETE /feedbacks/feedback/${id}`,
					});
					expect(res.body['timestamp']).toBeDefined();
				});
		});

		it('should delete a feedback', async () => {
			const server = app.getHttpServer();

			const { body } = await request(server)
				.post('/feedbacks')
				.send(makeCreateFeedbackDto())
				.expect(201);

			return request(server)
				.delete(`/feedbacks/feedback/${body['id']}`)
				.expect(200);
		});
	});

	describe('X PATCH /feedbacks/feedback/:id', () => {
		it('should return an error if an invalid UUID is provided', async () => {
			return request(app.getHttpServer())
				.patch('/feedbacks/feedback/invalid-uuid')
				.send({
					userId: faker.string.uuid(),
					productId: faker.string.uuid(),
				} as UpdateFeedbackDto)
				.expect(400)
				.then((res) => {
					expect(res.body).toMatchObject({
						status: 'ERROR',
						code: 400,
						content: 'Validation failed (uuid is expected)',
						endpoint: 'PATCH /feedbacks/feedback/invalid-uuid',
					});
					expect(res.body['timestamp']).toBeDefined();
				});
		});

		it('should return an error if required arguments are not provided', async () => {
			const id = faker.string.uuid();

			return request(app.getHttpServer())
				.patch(`/feedbacks/feedback/${id}`)
				.send({
					comment: faker.lorem.lines(1),
				} as UpdateFeedbackDto)
				.expect(400)
				.expect((res) => {
					expect(res.body).toMatchObject({
						status: 'ERROR',
						code: 400,
						content: [
							{ code: 'invalid_type', path: 'userId', message: 'Required' },
							{ code: 'invalid_type', path: 'productId', message: 'Required' },
						],
						endpoint: `PATCH /feedbacks/feedback/${id}`,
					});
					expect(res.body['timestamp']).toBeDefined();
				});
		});

		it('should return an updated & formatted feedback', async () => {
			const server = app.getHttpServer();
			const dto = makeCreateFeedbackDto();

			const { body } = await request(server)
				.post('/feedbacks')
				.send(dto)
				.expect(201);

			return request(server)
				.patch(`/feedbacks/feedback/${body['id']}`)
				.send({
					userId: dto.userId,
					productId: dto.productId,
					comment: 'Just a random comment',
				} as UpdateFeedbackDto)
				.expect(200)
				.then((res) => {
					expect(res.body['comment']).toBe('Just a random comment');
					expect(res.body['rating']).toEqual(dto.rating);
				});
		});
	});

	afterAll(async () => {
		await conn.dropDatabase();
		await conn.close();
		await app.close();
	});
});
