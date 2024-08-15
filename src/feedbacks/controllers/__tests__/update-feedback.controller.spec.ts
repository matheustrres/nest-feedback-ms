import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { UpdateFeedbackController } from '../update-feeback.controller';

import { type UpdateFeedbackDto } from '@/feedbacks/dtos/update-feedback.dto';
import { Feedback } from '@/feedbacks/feedback.entity';
import { UpdateFeedbackService } from '@/feedbacks/services/update-feedback.service';
import { FeedbackViewModel } from '@/feedbacks/view-models/feedback';

describe('UpdateFeedbackController', () => {
	let controller: UpdateFeedbackController;
	let service: UpdateFeedbackService;

	const updateFeedbackDto: UpdateFeedbackDto = {
		feedbackId: faker.string.uuid(),
		productId: faker.string.uuid(),
		userId: faker.string.uuid(),
		comment: faker.lorem.lines(1),
		rating: faker.number.int({
			min: 0,
			max: 5,
		}),
	};

	const mockedFeedback = new Feedback({
		...updateFeedbackDto,
		comment: faker.lorem.lines(1),
		rating: faker.number.int({
			min: 0,
			max: 5,
		}),
	});

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
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

		controller = moduleRef.get<UpdateFeedbackController>(
			UpdateFeedbackController,
		);
		service = moduleRef.get<UpdateFeedbackService>(UpdateFeedbackService);
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});

	it('should throw if no feedback is found with given id', async () => {
		jest
			.spyOn(service, 'exec')
			.mockRejectedValueOnce(
				new NotFoundException(
					`No feedback was found with ID "${updateFeedbackDto.feedbackId}".`,
				),
			);

		const promise = controller.handle(
			updateFeedbackDto.feedbackId,
			updateFeedbackDto,
		);

		await expect(promise).rejects.toThrow(
			new NotFoundException(
				`No feedback was found with ID "${updateFeedbackDto.feedbackId}".`,
			),
		);
	});

	it('should call service with correct arguments', async () => {
		const execSpy = jest.spyOn(service, 'exec').mockResolvedValueOnce({
			feedback: mockedFeedback,
		});

		await controller.handle(updateFeedbackDto.feedbackId, updateFeedbackDto);

		expect(execSpy).toHaveBeenCalledWith(updateFeedbackDto);
	});

	it('should return formatted feedback', async () => {
		const updatedFeedback: Feedback = {
			...mockedFeedback,
			rating: 2,
			comment: 'Bad product',
		};

		jest
			.spyOn(service, 'exec')
			.mockResolvedValueOnce({ feedback: updatedFeedback });

		const result = await controller.handle(
			updateFeedbackDto.feedbackId,
			updateFeedbackDto,
		);

		expect(result).toEqual(FeedbackViewModel.toJson(updatedFeedback));
	});
});
