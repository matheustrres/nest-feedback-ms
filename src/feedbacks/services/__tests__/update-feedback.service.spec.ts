import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { UpdateFeedbackService } from '../update-feedback.service';

import { Feedback } from '@/feedbacks/feedback.entity';
import { FeedbacksRepository } from '@/feedbacks/feedbacks.repository';

describe('UpdateFeedbackService', () => {
	let updateFeedbackService: UpdateFeedbackService;
	let feedbacksRepository: FeedbacksRepository;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
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

		updateFeedbackService = moduleRef.get<UpdateFeedbackService>(
			UpdateFeedbackService,
		);
		feedbacksRepository =
			moduleRef.get<FeedbacksRepository>(FeedbacksRepository);
	});

	it('should be defined', () => {
		expect(updateFeedbackService).toBeDefined();
		expect(feedbacksRepository).toBeDefined();
	});

	it('should throw if no feedback is found with given id', async () => {
		jest.spyOn(feedbacksRepository, 'findOne').mockResolvedValueOnce(null);

		await expect(
			updateFeedbackService.exec({
				feedbackId: 'random_uuid()',
				productId: 'random_uuid()',
				userId: 'random_uuid()',
			}),
		).rejects.toThrow(
			new BadRequestException(`No feedback was found with ID "random_uuid()".`),
		);
	});

	it('should update a feedback', async () => {
		const mockedFeedback = new Feedback({
			userId: faker.string.uuid(),
			productId: faker.string.uuid(),
			comment: 'Just a simple comment',
			rating: 1,
		});

		jest
			.spyOn(feedbacksRepository, 'findOne')
			.mockResolvedValueOnce(mockedFeedback);

		const { feedback } = await updateFeedbackService.exec({
			feedbackId: mockedFeedback.id,
			userId: mockedFeedback.userId,
			productId: mockedFeedback.productId,
			comment: 'Underrated comment',
			rating: 5,
		});

		expect(feedbacksRepository.updateOne).toHaveBeenNthCalledWith(
			1,
			{
				id: mockedFeedback.id,
				userId: mockedFeedback.userId,
				productId: mockedFeedback.productId,
			},
			{
				comment: 'Underrated comment',
				rating: 5,
				updatedAt: feedback.updatedAt,
			},
		);
		expect(feedback.comment).toEqual('Underrated comment');
		expect(feedback.rating).toEqual(5);
	});
});
