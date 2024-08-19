import { Test } from '@nestjs/testing';

import { DeleteFeedbackController } from '@/feedbacks/controllers/delete-feedback.controller';
import { DeleteFeedbackService } from '@/feedbacks/services/delete-feedback.service';

import { FeedbackNotFoundException } from '@/shared/lib/exceptions/feedback-not-found';

describe('DeleteFeedbackController', () => {
	let controller: DeleteFeedbackController;
	let service: DeleteFeedbackService;

	const id = 'random_uuid()';

	beforeEach(async () => {
		const testingModule = await Test.createTestingModule({
			controllers: [DeleteFeedbackController],
			providers: [
				{
					provide: DeleteFeedbackService,
					useValue: {
						exec: jest.fn(),
					},
				},
			],
		}).compile();

		controller = testingModule.get<DeleteFeedbackController>(
			DeleteFeedbackController,
		);
		service = testingModule.get<DeleteFeedbackService>(DeleteFeedbackService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
		expect(service).toBeDefined();
	});

	it('should throw if no feedback is found with given id', async () => {
		jest
			.spyOn(service, 'exec')
			.mockRejectedValueOnce(FeedbackNotFoundException.byId(id));

		await expect(controller.handle(id)).rejects.toThrow(
			FeedbackNotFoundException.byId(id).message,
		);
	});

	it('should call service with correct feedback id', async () => {
		jest.spyOn(service, 'exec').mockResolvedValueOnce();

		await controller.handle(id);

		expect(service.exec).toHaveBeenCalledWith(id);
	});

	it('should delete a feedback', async () => {
		jest.spyOn(service, 'exec');

		const id = 'random_uuid()';

		await controller.handle(id);

		expect(service.exec).toHaveBeenCalledWith(id);
	});

	afterAll(() => jest.clearAllMocks());
});
