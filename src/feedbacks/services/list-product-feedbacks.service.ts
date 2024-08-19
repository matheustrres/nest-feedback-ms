import { Injectable } from '@nestjs/common';

import { type ListProductFeedbacksDto } from '@/feedbacks/dtos/list-product-feedbacks.dto';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FeedbacksRepository } from '@/feedbacks/feedbacks.repository';

@Injectable()
export class ListProductFeedbacksService {
	constructor(private readonly feedbacksRepository: FeedbacksRepository) {}

	async exec({ productId, limit, skip }: ListProductFeedbacksDto) {
		const feedbacks = await this.feedbacksRepository.find(
			{
				productId,
			},
			{
				limit,
				skip,
			},
		);

		return {
			feedbacks,
		};
	}
}
