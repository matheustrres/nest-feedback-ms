import {
	Controller,
	Post,
	Body,
	Get,
	Param,
	Delete,
	HttpCode,
	HttpStatus,
	Patch,
} from '@nestjs/common';

import { type CreateFeedbackDto } from './dtos/create-feedback.dto';
import { type UpdateFeedbackDto } from './dtos/update-feedback.dto';
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { CreateFeedbackService } from './services/create-feedback.service';
import { DeleteFeedbackService } from './services/delete-feedback.service';
import { GetFeedbackByIdService } from './services/get-feedback.service';
import { UpdateFeedbackService } from './services/update-feedback.service';
import { FeedbackViewModel } from './view-models/feedback';

@Controller('feedbacks')
export class FeedbacksController {
	constructor(
		private readonly createFeedbackService: CreateFeedbackService,
		private readonly deleteFeedbackService: DeleteFeedbackService,
		private readonly getFeedbackByIdService: GetFeedbackByIdService,
		private readonly updateFeedbackService: UpdateFeedbackService,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() createFeedbackDto: CreateFeedbackDto) {
		const { feedback } =
			await this.createFeedbackService.exec(createFeedbackDto);

		return FeedbackViewModel.toJson(feedback);
	}

	@Get('/feedback/:id')
	@HttpCode(HttpStatus.OK)
	async findOne(@Param('id') id: string) {
		const { feedback } = await this.getFeedbackByIdService.exec(id);

		return FeedbackViewModel.toJson(feedback);
	}

	@Patch('/feedback/:id')
	async update(
		@Param('id') id: string,
		@Body() { productId, userId, comment, rating }: UpdateFeedbackDto,
	) {
		const { feedback } = await this.updateFeedbackService.exec({
			feedbackId: id,
			userId,
			productId,
			comment,
			rating,
		});

		return FeedbackViewModel.toJson(feedback);
	}

	@Delete('/feedback/:id')
	@HttpCode(HttpStatus.OK)
	async delete(@Param('id') id: string): Promise<void> {
		return this.deleteFeedbackService.exec(id);
	}
}
