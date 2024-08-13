import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { GetFeedbackByIdService } from './get-feedback.service';

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
});
