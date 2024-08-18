import { Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FeedbacksRepository } from '../feedbacks.repository';

import { FeedbackNotFoundException } from '@/shared/lib/exceptions/feedback-not-found';

@Injectable()
export class GetFeedbackByIdService {
	constructor(private readonly feedbacksRepository: FeedbacksRepository) {}

	async exec(id: string) {
		const feedback = await this.feedbacksRepository.findOne({
			id,
		});

		if (!feedback) throw FeedbackNotFoundException.byId(id);

		return {
			feedback,
		};
	}
}
