import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
} from '@nestjs/common';

import {
	UpdateFeedbackBodyPipe,
	type UpdateFeedbackDto,
} from '../dtos/update-feedback.dto';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UpdateFeedbackService } from '../services/update-feedback.service';
import { FeedbackViewModel } from '../view-models/feedback';

@Controller('feedbacks')
export class UpdateFeedbackController {
	constructor(private readonly service: UpdateFeedbackService) {}

	@Patch('/feedback/:id')
	@HttpCode(HttpStatus.OK)
	async handle(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body(UpdateFeedbackBodyPipe)
		{ productId, userId, comment, rating }: UpdateFeedbackDto,
	) {
		const { feedback } = await this.service.exec(id, {
			userId,
			productId,
			comment,
			rating,
		});

		return FeedbackViewModel.toJson(feedback);
	}
}
