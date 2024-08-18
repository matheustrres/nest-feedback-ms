import { type HttpExceptionOptions, NotFoundException } from '@nestjs/common';

export class FeedbackNotFoundException extends NotFoundException {
	private constructor(message: string, options?: HttpExceptionOptions) {
		super(message, options);
	}

	static byId(id: string): FeedbackNotFoundException {
		return new FeedbackNotFoundException(
			`No feedback was found with ID "${id}".`,
		);
	}
}
