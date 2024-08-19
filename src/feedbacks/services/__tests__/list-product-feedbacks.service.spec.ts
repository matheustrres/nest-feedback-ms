import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';

import { Feedback, type FeedbackProps } from '@/feedbacks/feedback.entity';
import { FeedbacksRepository } from '@/feedbacks/feedbacks.repository';
import { ListProductFeedbacksService } from '@/feedbacks/services/list-product-feedbacks.service';

function makeFeedback(props?: Partial<FeedbackProps>): Feedback {
	return new Feedback({
		userId: props?.userId || faker.string.uuid(),
		productId: props?.productId || faker.string.uuid(),
		comment: props?.comment || faker.lorem.lines(1),
		rating:
			props?.rating ||
			faker.number.int({
				min: 0,
				max: 5,
			}),
	});
}

describe('ListProductFeedbacks', () => {
	let listProductFeedbacksService: ListProductFeedbacksService;
	let feedbacksRepository: FeedbacksRepository;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				ListProductFeedbacksService,
				{
					provide: FeedbacksRepository,
					useValue: {
						find: jest.fn(),
					},
				},
			],
		}).compile();

		listProductFeedbacksService = moduleRef.get<ListProductFeedbacksService>(
			ListProductFeedbacksService,
		);
		feedbacksRepository =
			moduleRef.get<FeedbacksRepository>(FeedbacksRepository);
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(listProductFeedbacksService).toBeDefined();
		expect(feedbacksRepository).toBeDefined();
	});

	it('should list all feedbacks for a product', async () => {
		const productId = faker.string.uuid();

		jest.spyOn(feedbacksRepository, 'find').mockResolvedValueOnce([
			makeFeedback({
				productId,
			}),
			makeFeedback({
				productId,
			}),
			makeFeedback({
				productId,
			}),
			makeFeedback({
				productId,
			}),
			makeFeedback(),
		]);

		const { feedbacks } = await listProductFeedbacksService.exec({
			productId,
		});

		expect(feedbacks).toHaveLength(5);
		for (let i = 0; i <= 3; i++) {
			expect(feedbacks[i]!.productId).toEqual(productId);
		}
	});
});
