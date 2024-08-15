import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
} from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { GetFeedbackByIdService } from '../services/get-feedback.service';
import { FeedbackViewModel } from '../view-models/feedback';

@Controller('feedbacks')
export class GetFeedbackByIdController {
	constructor(private readonly service: GetFeedbackByIdService) {}

	@Get('/feedback/:id')
	@HttpCode(HttpStatus.OK)
	async handle(@Param('id', new ParseUUIDPipe()) id: string) {
		const { feedback } = await this.service.exec(id);

		return FeedbackViewModel.toJson(feedback);
	}
}
