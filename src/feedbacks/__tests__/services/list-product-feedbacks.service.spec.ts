import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';

import { makeFeedback } from '../__data__/make-feedback';

import { FeedbacksRepository } from '@/feedbacks/feedbacks.repository';
import { ListProductFeedbacksService } from '@/feedbacks/services/list-product-feedbacks.service';

describe('ListProductFeedbacks', () => {
	let service: ListProductFeedbacksService;
	let repository: FeedbacksRepository;

	beforeEach(async () => {
		const testingModule = await Test.createTestingModule({
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

		service = testingModule.get<ListProductFeedbacksService>(
			ListProductFeedbacksService,
		);
		repository = testingModule.get<FeedbacksRepository>(FeedbacksRepository);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(repository).toBeDefined();
	});

	it('should list all feedbacks for a product', async () => {
		const productId = faker.string.uuid();

		jest.spyOn(repository, 'find').mockResolvedValueOnce([
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

		const { feedbacks } = await service.exec({
			productId,
		});

		expect(feedbacks).toHaveLength(5);
		for (let i = 0; i <= 3; i++) {
			expect(feedbacks[i]!.productId).toEqual(productId);
		}
	});

	afterAll(() => jest.clearAllMocks());
});
