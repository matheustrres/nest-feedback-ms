import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Feedback, FeedbackSchema } from './feedback.entity';
import { FeedbacksController } from './feedbacks.controller';
import { FeedbacksRepository } from './feedbacks.repository';
import { CreateFeedbackService } from './services/create-feedback.service';
import { DeleteFeedbackService } from './services/delete-feedback.service';
import { GetFeedbackByIdService } from './services/get-feedback.service';
import { UpdateFeedbackService } from './services/update-feedback.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Feedback.name,
				schema: FeedbackSchema,
			},
		]),
	],
	controllers: [FeedbacksController],
	providers: [
		FeedbacksRepository,
		CreateFeedbackService,
		DeleteFeedbackService,
		GetFeedbackByIdService,
		UpdateFeedbackService,
	],
})
export class FeedbacksModule {}
