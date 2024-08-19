import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';

import { makeFeedback } from '../__data__/make-feedback';

import { ListProductFeedbacksController } from '@/feedbacks/controllers/list-product-feedbacks.controller';
import { ListProductFeedbacksService } from '@/feedbacks/services/list-product-feedbacks.service';
import { FeedbackViewModel } from '@/feedbacks/view-models/feedback';

describe('ListProductFeedbacksController', () => {
	let controller: ListProductFeedbacksController;
	let service: ListProductFeedbacksService;

	beforeEach(async () => {
		const testingModule = await Test.createTestingModule({
			controllers: [ListProductFeedbacksController],
			providers: [
				{
					provide: ListProductFeedbacksService,
					useValue: {
						exec: jest.fn(),
					},
				},
			],
		}).compile();

		controller = testingModule.get<ListProductFeedbacksController>(
			ListProductFeedbacksController,
		);
		service = testingModule.get<ListProductFeedbacksService>(
			ListProductFeedbacksService,
		);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
		expect(service).toBeDefined();
	});

	it('should return formatted feedbacks for a product', async () => {
		const productId = faker.string.uuid();

		const mockedFeedbacks = [
			makeFeedback({ productId }),
			makeFeedback({ productId }),
			makeFeedback({ productId }),
		];

		jest.spyOn(service, 'exec').mockResolvedValueOnce({
			feedbacks: mockedFeedbacks,
		});

		const feedbackList = await controller.handle({
			productId,
		});

		expect(service.exec).toHaveBeenCalledWith({
			productId,
		});
		expect(feedbackList).toHaveLength(mockedFeedbacks.length);
		for (const feedback of feedbackList) {
			expect(feedback).toMatchObject(FeedbackViewModel.toJson(feedback));
		}
	});

	afterAll(() => jest.clearAllMocks());
});
