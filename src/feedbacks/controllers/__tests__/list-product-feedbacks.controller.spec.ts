import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';

import { ListProductFeedbacksController } from '@/feedbacks/controllers/list-product-feedbacks.controller';
import { type CreateFeedbackDto } from '@/feedbacks/dtos/create-feedback.dto';
import { Feedback } from '@/feedbacks/feedback.entity';
import { ListProductFeedbacksService } from '@/feedbacks/services/list-product-feedbacks.service';
import { FeedbackViewModel } from '@/feedbacks/view-models/feedback';

describe('ListProductFeedbacksController', () => {
	let controller: ListProductFeedbacksController;
	let service: ListProductFeedbacksService;

	function makeFeedback(props?: Partial<CreateFeedbackDto>): Feedback {
		return new Feedback({
			userId: props?.userId || faker.string.uuid(),
			productId: props?.userId || faker.string.uuid(),
			comment: props?.comment || faker.lorem.lines(1),
			rating:
				props?.rating ||
				faker.number.int({
					min: 0,
					max: 5,
				}),
		});
	}

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
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

		controller = moduleRef.get<ListProductFeedbacksController>(
			ListProductFeedbacksController,
		);
		service = moduleRef.get<ListProductFeedbacksService>(
			ListProductFeedbacksService,
		);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it('should return formatted feedbacks for a product', async () => {
		7;
		const productId = faker.string.uuid();

		const mockedFeedbacks = [
			makeFeedback({ productId }),
			makeFeedback({ productId }),
			makeFeedback({ productId }),
		];

		jest.spyOn(service, 'exec').mockResolvedValueOnce({
			feedbacks: mockedFeedbacks,
		});

		const feedbacks = await controller.handle({
			productId,
		});

		expect(service.exec).toHaveBeenCalledWith({
			productId,
		});
		expect(feedbacks).toHaveLength(mockedFeedbacks.length);
		for (const feedback of feedbacks) {
			expect(feedback).toMatchObject(FeedbackViewModel.toJson(feedback));
		}
	});
});
