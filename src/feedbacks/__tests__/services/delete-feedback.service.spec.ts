import { Test } from '@nestjs/testing';

import { makeFeedback } from '../__data__/make-feedback';

import { FeedbacksRepository } from '@/feedbacks/feedbacks.repository';
import { DeleteFeedbackService } from '@/feedbacks/services/delete-feedback.service';

import { FeedbackNotFoundException } from '@/shared/lib/exceptions/feedback-not-found';

describe('DeleteFeedbackService', () => {
	let service: DeleteFeedbackService;
	let repository: FeedbacksRepository;

	beforeEach(async () => {
		const testingModule = await Test.createTestingModule({
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

		service = testingModule.get<DeleteFeedbackService>(DeleteFeedbackService);
		repository = testingModule.get<FeedbacksRepository>(FeedbacksRepository);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(repository).toBeDefined();
	});

	it('should throw if no feedback is found with given id', async () => {
		jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

		await expect(service.exec('random_uuid()')).rejects.toThrow(
			FeedbackNotFoundException.byId('random_uuid()'),
		);
	});

	it('should delete a feedback', async () => {
		const feedback = makeFeedback();

		jest.spyOn(repository, 'findOne').mockResolvedValueOnce(feedback);

		await expect(service.exec(feedback.id)).resolves.not.toThrow();
		expect(repository.removeOne).toHaveBeenCalledWith(feedback.id);
	});

	afterAll(() => jest.clearAllMocks());
});
