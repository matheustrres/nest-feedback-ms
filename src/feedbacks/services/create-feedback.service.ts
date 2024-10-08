import { BadRequestException, Injectable } from '@nestjs/common';

import { Feedback } from '../feedback.entity';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FeedbacksRepository } from '../feedbacks.repository';

import { type CreateFeedbackDto } from '@/feedbacks/dtos/create-feedback.dto';

@Injectable()
export class CreateFeedbackService {
	constructor(private readonly feedbacksRepository: FeedbacksRepository) {}

	async exec(dto: CreateFeedbackDto) {
		const hasUserAlreadySentFeedbackForProduct =
			await this.feedbacksRepository.findOne({
				productId: dto.productId,
				userId: dto.userId,
			});

		if (hasUserAlreadySentFeedbackForProduct) {
			throw new BadRequestException(
				`User "${dto.userId}" has already sent feedback for product "${dto.productId}".`,
			);
		}

		const feedback = new Feedback(dto);

		await this.feedbacksRepository.createOne(feedback);

		return {
			feedback,
		};
	}
}
