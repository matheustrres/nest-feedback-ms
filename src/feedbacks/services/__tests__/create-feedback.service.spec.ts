import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { type CreateFeedbackDto } from '../../dtos/create-feedback.dto';
import { Feedback } from '../../feedback.entity';
import { FeedbacksRepository } from '../../feedbacks.repository';
import { CreateFeedbackService } from '../create-feedback.service';

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
						findOne: jest.fn(),
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
			.spyOn(feedbacksRepository, 'findOne')
			.mockResolvedValueOnce(new Feedback(createFeedbackDto));

		await expect(createFeedbackService.exec(createFeedbackDto)).rejects.toThrow(
			new BadRequestException(
				`User "${createFeedbackDto.userId} has already sent feedback for product "${createFeedbackDto.productId}".`,
			),
		);
	});

	it('should create a feedback for a product successfully', async () => {
		jest.spyOn(feedbacksRepository, 'findOne').mockResolvedValueOnce(null);

		const result = await createFeedbackService.exec(createFeedbackDto);

		expect(feedbacksRepository.findOne).toHaveBeenCalledWith({
			productId: createFeedbackDto.productId,
			userId: createFeedbackDto.userId,
		});
		expect(feedbacksRepository.createOne).toHaveBeenCalledTimes(1);
		expect(result.feedback).toHaveProperty('userId', createFeedbackDto.userId);
		expect(result.feedback).toHaveProperty(
			'productId',
			createFeedbackDto.productId,
		);
		expect(result.feedback).toHaveProperty(
			'comment',
			createFeedbackDto.comment,
		);
		expect(result.feedback).toHaveProperty('rating', createFeedbackDto.rating);
	});
});
