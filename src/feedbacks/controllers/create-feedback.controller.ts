import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { type CreateFeedbackDto } from '../dtos/create-feedback.dto';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CreateFeedbackService } from '../services/create-feedback.service';
import { FeedbackViewModel } from '../view-models/feedback';

@Controller('feedbacks')
export class CreateFeedbackController {
	constructor(private readonly service: CreateFeedbackService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async handle(@Body() createFeedbackDto: CreateFeedbackDto) {
		const { feedback } = await this.service.exec(createFeedbackDto);

		return FeedbackViewModel.toJson(feedback);
	}
}
