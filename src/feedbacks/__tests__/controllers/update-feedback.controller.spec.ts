import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';

import { makeFeedback } from '../__data__/make-feedback';

import { UpdateFeedbackController } from '@/feedbacks/controllers/update-feeback.controller';
import { type UpdateFeedbackDto } from '@/feedbacks/dtos/update-feedback.dto';
import { type Feedback } from '@/feedbacks/feedback.entity';
import { UpdateFeedbackService } from '@/feedbacks/services/update-feedback.service';
import { FeedbackViewModel } from '@/feedbacks/view-models/feedback';

import { FeedbackNotFoundException } from '@/shared/lib/exceptions/feedback-not-found';

describe('UpdateFeedbackController', () => {
	let controller: UpdateFeedbackController;
	let service: UpdateFeedbackService;

	const id = faker.string.uuid();

	const updateFeedbackDto: UpdateFeedbackDto = {
		productId: faker.string.uuid(),
		userId: faker.string.uuid(),
		comment: faker.lorem.lines(1),
		rating: faker.number.int({
			min: 0,
			max: 5,
		}),
	};

	const feedback = makeFeedback({
		productId: updateFeedbackDto.productId,
		userId: updateFeedbackDto.userId,
	});

	beforeEach(async () => {
		const testingModule = await Test.createTestingModule({
			controllers: [UpdateFeedbackController],
			providers: [
				{
					provide: UpdateFeedbackService,
					useValue: {
						exec: jest.fn(),
					},
				},
			],
		}).compile();

		controller = testingModule.get<UpdateFeedbackController>(
			UpdateFeedbackController,
		);
		service = testingModule.get<UpdateFeedbackService>(UpdateFeedbackService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
		expect(service).toBeDefined();
	});

	it('should throw if no feedback is found with given id', async () => {
		jest
			.spyOn(service, 'exec')
			.mockRejectedValueOnce(FeedbackNotFoundException.byId(id));

		await expect(controller.handle(id, updateFeedbackDto)).rejects.toThrow(
			FeedbackNotFoundException.byId(id).message,
		);
	});

	it('should call service with correct arguments', async () => {
		jest.spyOn(service, 'exec').mockResolvedValueOnce({
			feedback,
		});

		await controller.handle(id, updateFeedbackDto);

		expect(service.exec).toHaveBeenCalledWith(id, updateFeedbackDto);
	});

	it('should return formatted feedback', async () => {
		const feedback2: Feedback = makeFeedback({
			...feedback,
			rating: 2,
			comment: 'Bad product',
		});

		jest.spyOn(service, 'exec').mockResolvedValueOnce({ feedback: feedback2 });

		const updatedFeedback = await controller.handle(id, updateFeedbackDto);

		expect(updatedFeedback).toEqual(FeedbackViewModel.toJson(feedback2));
	});

	afterAll(() => jest.clearAllMocks());
});
