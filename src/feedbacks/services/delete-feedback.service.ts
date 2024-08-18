import { Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FeedbacksRepository } from '../feedbacks.repository';

import { FeedbackNotFoundException } from '@/shared/lib/exceptions/feedback-not-found';

@Injectable()
export class DeleteFeedbackService {
	constructor(private readonly feedbacksRepository: FeedbacksRepository) {}

	async exec(id: string): Promise<void> {
		const feedback = await this.feedbacksRepository.findOne({
			id,
		});

		if (!feedback) throw FeedbackNotFoundException.byId(id);

		await this.feedbacksRepository.removeOne(id);
	}
}
