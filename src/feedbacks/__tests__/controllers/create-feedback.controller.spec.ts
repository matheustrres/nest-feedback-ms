import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { makeFeedback } from '../__data__/make-feedback';

import { CreateFeedbackController } from '@/feedbacks/controllers/create-feedback.controller';
import { type CreateFeedbackDto } from '@/feedbacks/dtos/create-feedback.dto';
import { CreateFeedbackService } from '@/feedbacks/services/create-feedback.service';
import { FeedbackViewModel } from '@/feedbacks/view-models/feedback';

describe('CreateFeedbackController', () => {
	let controller: CreateFeedbackController;
	let service: CreateFeedbackService;

	const createFeedbackDto: CreateFeedbackDto = {
		userId: faker.string.uuid(),
		productId: faker.string.uuid(),
		comment: faker.lorem.lines(1),
		rating: faker.number.int({
			min: 0,
			max: 5,
		}),
	};

	beforeEach(async () => {
		const testingModule = await Test.createTestingModule({
			controllers: [CreateFeedbackController],
			providers: [
				{
					provide: CreateFeedbackService,
					useValue: {
						exec: jest.fn(),
					},
				},
			],
		}).compile();

		controller = testingModule.get<CreateFeedbackController>(
			CreateFeedbackController,
		);
		service = testingModule.get<CreateFeedbackService>(CreateFeedbackService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});

	it('should throw an error if service throws a BadRequestException', async () => {
		jest
			.spyOn(service, 'exec')
			.mockRejectedValueOnce(
				new BadRequestException(
					`User "${createFeedbackDto.userId}" has already sent feedback for product "${createFeedbackDto.productId}".`,
				),
			);

		await expect(controller.handle(createFeedbackDto)).rejects.toThrow(
			BadRequestException,
		);
	});

	it('should return formatted feedback', async () => {
		const feedback = makeFeedback(createFeedbackDto);

		jest.spyOn(service, 'exec').mockResolvedValueOnce({ feedback });

		const createdFeedback = await controller.handle(createFeedbackDto);

		expect(service.exec).toHaveBeenCalledWith(createFeedbackDto);
		expect(createdFeedback).toEqual(FeedbackViewModel.toJson(feedback));
	});

	afterAll(() => jest.clearAllMocks());
});
