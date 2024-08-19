import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';

import {
	ListProductFeedbacksBodyPipe,
	type ListProductFeedbacksDto,
} from '@/feedbacks/dtos/list-product-feedbacks.dto';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ListProductFeedbacksService } from '@/feedbacks/services/list-product-feedbacks.service';
import { FeedbackViewModel } from '@/feedbacks/view-models/feedback';

@Controller('feedbacks')
export class ListProductFeedbacksController {
	constructor(private readonly service: ListProductFeedbacksService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async handle(
		@Query(ListProductFeedbacksBodyPipe) dto: ListProductFeedbacksDto,
	) {
		const { feedbacks } = await this.service.exec(dto);

		return feedbacks.map(FeedbackViewModel.toJson);
	}
}
