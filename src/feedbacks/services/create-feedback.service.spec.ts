import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { CreateFeedbackService } from './create-feedback.service';

import { type CreateFeedbackDto } from '../dtos/create-feedback.dto';
import { type Feedback } from '../feedback.entity';
import { FeedbacksRepository } from '../feedbacks.repository';

describe('CreateFeedbackService', () => {
	let createFeedbackService: CreateFeedbackService;
	let feedbacksRepository: FeedbacksRepository;

	const createFeedbackDto: CreateFeedbackDto = {
		userId: faker.string.uuid(),
		productId: faker.string.uuid(),
		comment: faker.lorem.text(),
		rating: faker.number.int({
			min: 0,
			max: 5,
		}),
	};

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				CreateFeedbackService,
				{
					provide: FeedbacksRepository,
					useValue: {
						createOne: jest.fn(),
						find: jest.fn(),
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

	afterAll(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(createFeedbackService).toBeDefined();
		expect(feedbacksRepository).toBeDefined();
	});

	it('should throw if user has already sent a feedback for a product', async () => {
		jest
			.spyOn(feedbacksRepository, 'find')
			.mockResolvedValueOnce([{ ...createFeedbackDto }]);

		await expect(createFeedbackService.exec(createFeedbackDto)).rejects.toThrow(
			new BadRequestException(
				`User "${createFeedbackDto.userId} has already sent feedback for product "${createFeedbackDto.productId}".`,
			),
		);
	});

	it('should create a feedback for a product successfully', async () => {
		const feedback: Feedback = {
			...createFeedbackDto,
		};

		jest.spyOn(feedbacksRepository, 'find').mockResolvedValueOnce([]);
		jest
			.spyOn(feedbacksRepository, 'createOne')
			.mockResolvedValueOnce(feedback);

		const result = await createFeedbackService.exec(createFeedbackDto);

		expect(feedbacksRepository.find).toHaveBeenCalledWith({
			productId: createFeedbackDto.productId,
			userId: createFeedbackDto.userId,
		});
		expect(feedbacksRepository.createOne).toHaveBeenCalledWith(feedback);
		expect(result).toEqual(feedback);
	});
});
