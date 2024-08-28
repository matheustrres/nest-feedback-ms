import {
	HttpException,
	HttpStatus,
	Catch,
	type ArgumentsHost,
} from '@nestjs/common';

import { BaseExceptionFilter } from './base-exception-filter';

import { type SentryService } from '@/shared/modules/sentry/sentry.service';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter<unknown> {
	constructor(private readonly sentryService: SentryService) {
		super();
	}

	catch(exception: unknown, host: ArgumentsHost) {
		const { response, endpoint } = this.getHttpContext(host);

		if (exception instanceof HttpException) {
			return this.sendErrorResponse(response, {
				code: exception.getStatus(),
				content: exception.message,
				endpoint,
				status: 'ERROR',
			});
		}

		this.logger.error(
			'Unhandled exception has been caught: ',
			console.trace(exception),
		);

		// Only unhandled exceptions will be sent to Sentry
		this.sentryService.captureException(exception, 'errored');

		return this.sendErrorResponse(response, {
			code: HttpStatus.INTERNAL_SERVER_ERROR,
			content: [],
			endpoint,
			status: 'Internal Server Error',
		});
	}
}
