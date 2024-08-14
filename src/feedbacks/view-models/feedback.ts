import { type Feedback } from '../feedback.entity';

type FeedbackJson = {
	id: string;
	userId: string;
	productId: string;
	comment: string;
	rating: number;
	createdAt: string | Date;
	updatedAt: string | Date;
};

export class FeedbackViewModel {
	static toJson(feedback: Feedback): FeedbackJson {
		return {
			id: feedback.id,
			userId: feedback.userId,
			productId: feedback.productId,
			comment: feedback.comment,
			rating: feedback.rating,
			createdAt: feedback.createdAt,
			updatedAt: feedback.updatedAt,
		};
	}
}
