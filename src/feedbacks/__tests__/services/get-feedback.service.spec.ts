import { Test } from '@nestjs/testing';

import { makeFeedback } from '../__data__/make-feedback';

import { FeedbacksRepository } from '@/feedbacks/feedbacks.repository';
import { GetFeedbackByIdService } from '@/feedbacks/services/get-feedback.service';

import { FeedbackNotFoundException } from '@/shared/lib/exceptions/feedback-not-found';

describe('GetFeedbackByIdService', () => {
	let service: GetFeedbackByIdService;
	let repository: FeedbacksRepository;

	beforeEach(async () => {
		const testingModule = await Test.createTestingModule({
			providers: [
				GetFeedbackByIdService,
				{
					provide: FeedbacksRepository,
					useValue: {
						findOne: jest.fn(),
					},
				},
			],
		}).compile();

		service = testingModule.get<GetFeedbackByIdService>(GetFeedbackByIdService);
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

	it('should find a feedback by its id', async () => {
		const feedback = makeFeedback();

		jest.spyOn(repository, 'findOne').mockResolvedValueOnce(feedback);

		const { feedback: foundFeedback } = await service.exec(feedback.id);

		expect(repository.findOne).toHaveBeenCalledWith({
			id: feedback.id,
		});
		expect(foundFeedback).toStrictEqual(feedback);
	});

	afterAll(() => jest.clearAllMocks());
});
