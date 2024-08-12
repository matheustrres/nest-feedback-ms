import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { CreateFeedbackService } from './create-feedback.service';

import { type CreateFeedbackDto } from '../dtos/create-feedback.dto';
import { FeedbacksRepository } from '../feedbacks.repository';

describe('CreateFeedbackService', () => {
	let createFeedbackService: CreateFeedbackService;
	let feedbacksRepository: FeedbacksRepository;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				CreateFeedbackService,
				{
					provide: FeedbacksRepository,
					useValue: {
						createOne: jest.fn(),
						find: jest.fn(),
						findById: jest.fn(),
						removeOne: jest.fn(),
						updateOne: jest.fn(),
					},
				},
			],
		}).compile();

		createFeedbackService = moduleRef.get<CreateFeedbackService>(
			CreateFeedbackService,
		);
		feedbacksRepository =
			moduleRef.get<FeedbacksRepository>(FeedbacksRepository);
	});

	it('should be defined', () => {
		expect(createFeedbackService).toBeDefined();
		expect(feedbacksRepository).toBeDefined();
	});

	it('should throw if user has already sent a feedback for a product', async () => {
		const createFeedbackDto: CreateFeedbackDto = {
			userId: faker.string.uuid(),
			productId: faker.string.uuid(),
			comment: faker.lorem.text(),
			rating: faker.number.int({
				min: 0,
				max: 5,
			}),
		};

		jest
			.spyOn(feedbacksRepository, 'find')
			.mockResolvedValueOnce([{ ...createFeedbackDto }]);

		await expect(createFeedbackService.exec(createFeedbackDto)).rejects.toThrow(
			new BadRequestException(
				`User "${createFeedbackDto.userId} has already sent feedback for product "${createFeedbackDto.productId}".`,
			),
		);
	});
});
