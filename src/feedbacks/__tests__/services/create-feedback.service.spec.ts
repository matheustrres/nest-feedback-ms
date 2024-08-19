import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { makeFeedback } from '../__data__/make-feedback';

import { type CreateFeedbackDto } from '@/feedbacks/dtos/create-feedback.dto';
import { FeedbacksRepository } from '@/feedbacks/feedbacks.repository';
import { CreateFeedbackService } from '@/feedbacks/services/create-feedback.service';

describe('CreateFeedbackService', () => {
	let service: CreateFeedbackService;
	let repository: FeedbacksRepository;

	const dto: CreateFeedbackDto = {
		userId: faker.string.uuid(),
		productId: faker.string.uuid(),
		comment: faker.lorem.text(),
		rating: faker.number.int({
			min: 0,
			max: 5,
		}),
	};

	beforeEach(async () => {
		const testingModule = await Test.createTestingModule({
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

		service = testingModule.get<CreateFeedbackService>(CreateFeedbackService);
		repository = testingModule.get<FeedbacksRepository>(FeedbacksRepository);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(repository).toBeDefined();
	});

	it('should throw if user has already sent feedback for a product', async () => {
		jest.spyOn(repository, 'findOne').mockResolvedValueOnce(makeFeedback(dto));

		await expect(service.exec(dto)).rejects.toThrow(
			new BadRequestException(
				`User "${dto.userId}" has already sent feedback for product "${dto.productId}".`,
			),
		);
	});

	it('should create a feedback for a product successfully', async () => {
		jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

		const { feedback } = await service.exec(dto);

		expect(repository.findOne).toHaveBeenCalledWith({
			productId: dto.productId,
			userId: dto.userId,
		});
		expect(repository.createOne).toHaveBeenCalledTimes(1);
		expect(feedback).toHaveProperty('userId', dto.userId);
		expect(feedback).toHaveProperty('productId', dto.productId);
		expect(feedback).toHaveProperty('comment', dto.comment);
		expect(feedback).toHaveProperty('rating', dto.rating);
	});

	afterAll(() => jest.clearAllMocks());
});
