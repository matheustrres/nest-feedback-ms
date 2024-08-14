import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { DeleteFeedbackService } from './delete-feedback.service';

import { FeedbacksRepository } from '../feedbacks.repository';

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

	it('should be defined', () => {
		expect(deleteFeedbackService).toBeDefined();
		expect(feedbacksRepository).toBeDefined();
	});

	it('should throw if no feedback is found with given id', async () => {
		jest.spyOn(feedbacksRepository, 'findOne').mockResolvedValueOnce(null);

		await expect(deleteFeedbackService.exec('random_uuid()')).rejects.toThrow(
			new BadRequestException(`No feedback was found with ID "random_uuid()".`),
		);
	});
});
