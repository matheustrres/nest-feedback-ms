import { Injectable, NotFoundException } from '@nestjs/common';

import { type UpdateFeedbackDto } from '../dtos/update-feedback.dto';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FeedbacksRepository } from '../feedbacks.repository';

@Injectable()
export class UpdateFeedbackService {
	constructor(private readonly feedbacksRepository: FeedbacksRepository) {}

	async exec(dto: UpdateFeedbackDto) {
		const findQuery = {
			id: dto.feedbackId,
			userId: dto.userId,
			productId: dto.productId,
		};

		const feedback = await this.feedbacksRepository.findOne(findQuery);

		if (!feedback) {
			throw new NotFoundException(
				`No feedback was found with ID "${dto.feedbackId}".`,
			);
		}

		if (dto.comment) feedback.setComment(dto.comment);
		if (dto.rating) feedback.setRating(dto.rating);

		await this.feedbacksRepository.updateOne(findQuery, {
			$set: feedback,
		});

		return {
			feedback,
		};
	}
}
