import {
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
} from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { DeleteFeedbackService } from '../services/delete-feedback.service';

@Controller('feedbacks')
export class DeleteFeedbackController {
	constructor(private readonly service: DeleteFeedbackService) {}

	@Delete('/feedback/:id')
	@HttpCode(HttpStatus.OK)
	async handle(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
		return this.service.exec(id);
	}
}
