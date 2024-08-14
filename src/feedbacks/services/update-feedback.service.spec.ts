import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { UpdateFeedbackService } from './update-feedback.service';

import { FeedbacksRepository } from '../feedbacks.repository';

describe('UpdateFeedbackService', () => {
	let updateFeedbackService: UpdateFeedbackService;
	let feedbacksRepository: FeedbacksRepository;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				UpdateFeedbackService,
				{
					provide: FeedbacksRepository,
					useValue: {
						findOne: jest.fn(),
						updateOne: jest.fn(),
					},
				},
			],
		}).compile();

		updateFeedbackService = moduleRef.get<UpdateFeedbackService>(
			UpdateFeedbackService,
		);
		feedbacksRepository =
			moduleRef.get<FeedbacksRepository>(FeedbacksRepository);
	});

	it('should be defined', () => {
		expect(updateFeedbackService).toBeDefined();
		expect(feedbacksRepository).toBeDefined();
	});

	it('should throw if no feedback is found with given id', async () => {
		jest.spyOn(feedbacksRepository, 'findOne').mockResolvedValueOnce(null);

		await expect(
			updateFeedbackService.exec({
				feedbackId: 'random_uuid()',
				productId: 'random_uuid()',
				userId: 'random_uuid()',
			}),
		).rejects.toThrow(
			new BadRequestException(`No feedback was found with ID "random_uuid()".`),
		);
	});
});
