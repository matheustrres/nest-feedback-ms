import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';

import { GetFeedbackByIdController } from '../get-feedback.controller';

import { type CreateFeedbackDto } from '@/feedbacks/dtos/create-feedback.dto';
import { Feedback } from '@/feedbacks/feedback.entity';
import { GetFeedbackByIdService } from '@/feedbacks/services/get-feedback.service';
import { FeedbackViewModel } from '@/feedbacks/view-models/feedback';

import { FeedbackNotFoundException } from '@/shared/lib/exceptions/feedback-not-found';

describe('GetFeedbackByIdController', () => {
	let controller: GetFeedbackByIdController;
	let service: GetFeedbackByIdService;

	const id = 'random_uuid()';

	const createFeedbackDto: CreateFeedbackDto = {
		userId: faker.string.uuid(),
		productId: faker.string.uuid(),
		comment: faker.lorem.lines(1),
		rating: faker.number.int({
			min: 0,
			max: 5,
		}),
	};

	const mockedFeedback = new Feedback(createFeedbackDto);

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			controllers: [GetFeedbackByIdController],
			providers: [
				{
					provide: GetFeedbackByIdService,
					useValue: {
						exec: jest.fn(),
					},
				},
			],
		}).compile();

		controller = moduleRef.get<GetFeedbackByIdController>(
			GetFeedbackByIdController,
		);
		service = moduleRef.get<GetFeedbackByIdService>(GetFeedbackByIdService);
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
			.mockRejectedValueOnce(FeedbackNotFoundException.byId(id));

		const promise = controller.handle(id);

		await expect(promise).rejects.toThrow(
			FeedbackNotFoundException.byId(id).message,
		);
	});

	it('should call service with correct feedback id', async () => {
		const execSpy = jest.spyOn(service, 'exec').mockResolvedValueOnce({
			feedback: mockedFeedback,
		});

		await controller.handle(id);

		expect(execSpy).toHaveBeenCalledWith(id);
	});

	it('should return formatted feedback', async () => {
		jest
			.spyOn(service, 'exec')
			.mockResolvedValueOnce({ feedback: mockedFeedback });

		const result = await controller.handle(id);

		expect(result).toEqual(FeedbackViewModel.toJson(mockedFeedback));
	});
});
