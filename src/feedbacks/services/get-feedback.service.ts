import { BadRequestException, Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FeedbacksRepository } from '../feedbacks.repository';

@Injectable()
export class GetFeedbackByIdService {
	constructor(private readonly feedbacksRepository: FeedbacksRepository) {}

	async exec(id: string) {
		const feedback = await this.feedbacksRepository.findOne({
			id,
		});

		if (!feedback) {
			throw new BadRequestException(`No feedback was found with ID "${id}".`);
		}

		return {
			feedback,
		};
	}
}
