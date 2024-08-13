import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { GetFeedbackByIdService } from './get-feedback.service';

import { type Feedback } from '../feedback.entity';
import { FeedbacksRepository } from '../feedbacks.repository';

describe('GetFeedbackByIdService', () => {
	let getFeedbackByIdService: GetFeedbackByIdService;
	let feedbacksRepository: FeedbacksRepository;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				GetFeedbackByIdService,
				{
					provide: FeedbacksRepository,
					useValue: {
						find: jest.fn(),
					},
				},
			],
		}).compile();

		getFeedbackByIdService = moduleRef.get<GetFeedbackByIdService>(
			GetFeedbackByIdService,
		);
		feedbacksRepository =
			moduleRef.get<FeedbacksRepository>(FeedbacksRepository);
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(getFeedbackByIdService).toBeDefined();
		expect(feedbacksRepository).toBeDefined();
	});

	it('should throw if no feedback is found with given id', async () => {
		jest.spyOn(feedbacksRepository, 'find').mockResolvedValueOnce([]);

		await expect(getFeedbackByIdService.exec('random_uuid()')).rejects.toThrow(
			new BadRequestException(`No feedback was found with ID "random_uuid()".`),
		);
	});

	it('should find a feedback by its id', async () => {
		const mockedFeedback: Feedback = {
			id: faker.string.uuid(),
			userId: faker.string.uuid(),
			productId: faker.string.uuid(),
			comment: faker.lorem.text(),
			rating: faker.number.int({
				min: 0,
				max: 5,
			}),
			createdAt: faker.date.anytime(),
			updatedAt: faker.date.anytime(),
		};

		jest
			.spyOn(feedbacksRepository, 'find')
			.mockResolvedValueOnce([mockedFeedback]);

		const { feedback } = await getFeedbackByIdService.exec(mockedFeedback.id);

		expect(feedbacksRepository.find).toHaveBeenCalledWith({
			id: mockedFeedback.id,
		});
		expect(feedback).toStrictEqual(mockedFeedback);
	});
});
