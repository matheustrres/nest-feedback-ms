import { Test } from '@nestjs/testing';

import { makeFeedback } from '../__data__/make-feedback';

import { GetFeedbackByIdController } from '@/feedbacks/controllers/get-feedback.controller';
import { GetFeedbackByIdService } from '@/feedbacks/services/get-feedback.service';
import { FeedbackViewModel } from '@/feedbacks/view-models/feedback';

import { FeedbackNotFoundException } from '@/shared/lib/exceptions/feedback-not-found';

describe('GetFeedbackByIdController', () => {
	let controller: GetFeedbackByIdController;
	let service: GetFeedbackByIdService;

	const id = 'random_uuid()';

	const feedback = makeFeedback();

	beforeEach(async () => {
		const testingModule = await Test.createTestingModule({
			controllers: [GetFeedbackByIdController],
			providers: [
				{
					provide: GetFeedbackByIdService,
					useValue: {
						exec: jest.fn(),
					},
				},
			],
		}).compile();

		controller = testingModule.get<GetFeedbackByIdController>(
			GetFeedbackByIdController,
		);
		service = testingModule.get<GetFeedbackByIdService>(GetFeedbackByIdService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});

	it('should throw if no feedback is found with given id', async () => {
		jest
			.spyOn(service, 'exec')
			.mockRejectedValueOnce(FeedbackNotFoundException.byId(id));

		const promise = controller.handle(id);

		await expect(promise).rejects.toThrow(
			FeedbackNotFoundException.byId(id).message,
		);
	});

	it('should call service with correct feedback id', async () => {
		jest.spyOn(service, 'exec').mockResolvedValueOnce({ feedback });

		await controller.handle(id);

		expect(service.exec).toHaveBeenCalledWith(id);
	});

	it('should return formatted feedback', async () => {
		jest.spyOn(service, 'exec').mockResolvedValueOnce({ feedback });

		const foundFeedback = await controller.handle(id);

		expect(foundFeedback).toEqual(FeedbackViewModel.toJson(feedback));
	});

	afterAll(() => jest.clearAllMocks());
});
