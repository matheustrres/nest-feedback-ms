import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';

import { DeleteFeedbackService } from '../delete-feedback.service';

import { Feedback } from '@/feedbacks/feedback.entity';
import { FeedbacksRepository } from '@/feedbacks/feedbacks.repository';

import { FeedbackNotFoundException } from '@/shared/lib/exceptions/feedback-not-found';

describe('DeleteFeedbackService', () => {
	let deleteFeedbackService: DeleteFeedbackService;
	let feedbacksRepository: FeedbacksRepository;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				DeleteFeedbackService,
				{
					provide: FeedbacksRepository,
					useValue: {
						findOne: jest.fn(),
						removeOne: jest.fn(),
					},
				},
			],
		}).compile();

		deleteFeedbackService = moduleRef.get<DeleteFeedbackService>(
			DeleteFeedbackService,
		);
		feedbacksRepository =
			moduleRef.get<FeedbacksRepository>(FeedbacksRepository);
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(deleteFeedbackService).toBeDefined();
		expect(feedbacksRepository).toBeDefined();
	});

	it('should throw if no feedback is found with given id', async () => {
		jest.spyOn(feedbacksRepository, 'findOne').mockResolvedValueOnce(null);

		await expect(deleteFeedbackService.exec('random_uuid()')).rejects.toThrow(
			FeedbackNotFoundException.byId('random_uuid()'),
		);
	});

	it('should delete a feedback', async () => {
		const mockedFeedback = new Feedback({
			userId: faker.string.uuid(),
			productId: faker.string.uuid(),
			comment: faker.lorem.text(),
			rating: faker.number.int({
				min: 0,
				max: 5,
			}),
		});

		jest
			.spyOn(feedbacksRepository, 'findOne')
			.mockResolvedValueOnce(mockedFeedback);

		await expect(
			deleteFeedbackService.exec(mockedFeedback.id),
		).resolves.not.toThrow();
		expect(feedbacksRepository.removeOne).toHaveBeenCalledWith(
			mockedFeedback.id,
		);
	});
});
