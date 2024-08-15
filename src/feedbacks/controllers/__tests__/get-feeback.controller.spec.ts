import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { GetFeedbackByIdController } from '../get-feedback.controller';

import { GetFeedbackByIdService } from '@/feedbacks/services/get-feedback.service';

describe('GetFeedbackByIdController', () => {
	let controller: GetFeedbackByIdController;
	let service: GetFeedbackByIdService;

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

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});

	it('should throw if no feedback is found with given id', async () => {
		const id = 'random_uuid()';

		jest
			.spyOn(service, 'exec')
			.mockRejectedValueOnce(
				new BadRequestException(`No feedback was found with ID "${id}".`),
			);

		const promise = controller.handle(id);

		await expect(promise).rejects.toThrow(
			`No feedback was found with ID "${id}".`,
		);
	});
});
