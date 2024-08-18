import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { CreateFeedbackController } from '../create-feedback.controller';

import { type CreateFeedbackDto } from '@/feedbacks/dtos/create-feedback.dto';
import { Feedback } from '@/feedbacks/feedback.entity';
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
		const moduleRef = await Test.createTestingModule({
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

		controller = moduleRef.get<CreateFeedbackController>(
			CreateFeedbackController,
		);
		service = moduleRef.get<CreateFeedbackService>(CreateFeedbackService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it('should throw an error if service throws a BadRequestException', async () => {
		jest
			.spyOn(service, 'exec')
			.mockRejectedValueOnce(
				new BadRequestException(
					`User "${createFeedbackDto.userId}" has already sent feedback for product "${createFeedbackDto.productId}".`,
				),
			);

		const promise = controller.handle(createFeedbackDto);

		await expect(promise).rejects.toThrow(BadRequestException);
	});

	it('should return formatted feedback', async () => {
		const mockedFeedback = new Feedback(createFeedbackDto);

		jest
			.spyOn(service, 'exec')
			.mockResolvedValueOnce({ feedback: mockedFeedback });

		const result = await controller.handle(createFeedbackDto);

		expect(service.exec).toHaveBeenCalledWith(createFeedbackDto);
		expect(result).toEqual(FeedbackViewModel.toJson(mockedFeedback));
	});
});
