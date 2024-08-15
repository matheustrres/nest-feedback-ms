import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { DeleteFeedbackController } from '../delete-feedback.controller';

import { DeleteFeedbackService } from '@/feedbacks/services/delete-feedback.service';

describe('DeleteFeedbackController', () => {
	let controller: DeleteFeedbackController;
	let service: DeleteFeedbackService;

	const id = 'random_uuid()';

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			controllers: [DeleteFeedbackController],
			providers: [
				{
					provide: DeleteFeedbackService,
					useValue: {
						exec: jest.fn(),
					},
				},
			],
		}).compile();

		controller = moduleRef.get<DeleteFeedbackController>(
			DeleteFeedbackController,
		);
		service = moduleRef.get<DeleteFeedbackService>(DeleteFeedbackService);
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
				new BadRequestException(`No feedback was found with ID "${id}".`),
			);

		const promise = controller.handle(id);

		await expect(promise).rejects.toThrow(
			`No feedback was found with ID "${id}".`,
		);
	});

	it('should call service with correct feedback id', async () => {
		const execSpy = jest.spyOn(service, 'exec').mockResolvedValueOnce();

		await controller.handle(id);

		expect(execSpy).toHaveBeenCalledWith(id);
	});

	it('should delete a feedback', async () => {
		const id = 'random_uuid()';
		const execSpy = jest.spyOn(service, 'exec');

		await controller.handle(id);

		expect(execSpy).toHaveBeenCalledWith(id);
	});
});
