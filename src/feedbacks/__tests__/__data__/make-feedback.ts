import { faker } from '@faker-js/faker';

import { type CreateFeedbackDto } from '@/feedbacks/dtos/create-feedback.dto';
import { Feedback } from '@/feedbacks/feedback.entity';

export function makeFeedback(
	createFeedbackDto?: Partial<CreateFeedbackDto>,
): Feedback {
	return new Feedback({
		userId: createFeedbackDto?.userId ?? faker.string.uuid(),
		productId: createFeedbackDto?.productId ?? faker.string.uuid(),
		comment: faker.lorem.lines(1),
		rating: faker.number.int({
			min: 0,
			max: 5,
		}),
	});
}
