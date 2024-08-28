import { Injectable } from '@nestjs/common';

import { NestSentry, type SentryTypes } from '@/@libs/sentry';

@Injectable()
export class SentryService {
	captureException(
		exception: unknown,
		requestSessionStatus: SentryTypes.RequestSessionStatus,
	): void {
		NestSentry.captureException(exception, {
			requestSession: {
				status: requestSessionStatus,
			},
		});
	}
}
