import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CreateFeedbackController } from './controllers/create-feedback.controller';
import { DeleteFeedbackController } from './controllers/delete-feedback.controller';
import { GetFeedbackByIdController } from './controllers/get-feedback.controller';
import { UpdateFeedbackController } from './controllers/update-feeback.controller';
import { Feedback, FeedbackSchema } from './feedback.entity';
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
	controllers: [
		CreateFeedbackController,
		DeleteFeedbackController,
		GetFeedbackByIdController,
		UpdateFeedbackController,
	],
	providers: [
		FeedbacksRepository,
		CreateFeedbackService,
		DeleteFeedbackService,
		GetFeedbackByIdService,
		UpdateFeedbackService,
	],
})
export class FeedbacksModule {}
