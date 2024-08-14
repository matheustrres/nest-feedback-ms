import { Body, Controller, Param, Patch } from '@nestjs/common';

import { type UpdateFeedbackDto } from '../dtos/update-feedback.dto';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UpdateFeedbackService } from '../services/update-feedback.service';
import { FeedbackViewModel } from '../view-models/feedback';

@Controller('feedbacks')
export class UpdateFeedbackController {
	constructor(private readonly service: UpdateFeedbackService) {}

	@Patch('/feedback/:id')
	async handle(
		@Param('id') id: string,
		@Body() { productId, userId, comment, rating }: UpdateFeedbackDto,
	) {
		const { feedback } = await this.service.exec({
			feedbackId: id,
			userId,
			productId,
			comment,
			rating,
		});

		return FeedbackViewModel.toJson(feedback);
	}
}
