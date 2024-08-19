import { Test } from '@nestjs/testing';

import { makeFeedback } from '../__data__/make-feedback';

import { FeedbacksRepository } from '@/feedbacks/feedbacks.repository';
import { UpdateFeedbackService } from '@/feedbacks/services/update-feedback.service';

import { FeedbackNotFoundException } from '@/shared/lib/exceptions/feedback-not-found';

describe('UpdateFeedbackService', () => {
	let service: UpdateFeedbackService;
	let repository: FeedbacksRepository;

	beforeEach(async () => {
		const testingModule = await Test.createTestingModule({
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

		service = testingModule.get<UpdateFeedbackService>(UpdateFeedbackService);
		repository = testingModule.get<FeedbacksRepository>(FeedbacksRepository);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(repository).toBeDefined();
	});

	it('should throw if no feedback is found with given id', async () => {
		jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

		await expect(
			service.exec('random_uuid()', {
				productId: 'random_uuid()',
				userId: 'random_uuid()',
			}),
		).rejects.toThrow(FeedbackNotFoundException.byId('random_uuid()'));
	});

	it('should update a feedback', async () => {
		const feedback = makeFeedback();

		jest.spyOn(repository, 'findOne').mockResolvedValueOnce(feedback);

		const { feedback: updatedFeedback } = await service.exec(feedback.id, {
			userId: feedback.userId,
			productId: feedback.productId,
			comment: 'Underrated comment',
			rating: 5,
		});

		expect(repository.updateOne).toHaveBeenNthCalledWith(
			1,
			{
				id: feedback.id,
				userId: feedback.userId,
				productId: feedback.productId,
			},
			{
				comment: 'Underrated comment',
				rating: 5,
				updatedAt: feedback.updatedAt,
			},
		);
		expect(updatedFeedback.comment).toEqual('Underrated comment');
		expect(updatedFeedback.rating).toEqual(5);
	});

	afterAll(() => jest.clearAllMocks());
});
