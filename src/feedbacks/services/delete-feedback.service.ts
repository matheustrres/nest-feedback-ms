import { BadRequestException, Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FeedbacksRepository } from '../feedbacks.repository';

@Injectable()
export class DeleteFeedbackService {
	constructor(private readonly feedbacksRepository: FeedbacksRepository) {}

	async exec(id: string): Promise<void> {
		const feedback = await this.feedbacksRepository.findOne({
			id,
		});

		if (!feedback) {
			throw new BadRequestException(`No feedback was found with ID "${id}".`);
		}

		await this.feedbacksRepository.removeOne(id);
	}
}
