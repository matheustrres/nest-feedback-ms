import {
	type ArgumentsHost,
	Catch,
	type ExceptionFilter,
} from '@nestjs/common';
import { type Request, type Response } from 'express';
import { ZodError, type ZodIssue } from 'zod';

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
	catch(exception: ZodError, host: ArgumentsHost): Response {
		const httpCtx = host.switchToHttp();

		const req = httpCtx.getRequest<Request>();
		const res = httpCtx.getResponse<Response>();

		const endpoint = `${req.method} ${req.path}`;

		return res.status(400).json({
			timestamp: new Date().toISOString(),
			status: 'ERROR',
			statusCode: 400,
			content: this.#mapIssuesToResponse(exception.issues),
			endpoint,
		});
	}

	#mapIssuesToResponse(issues: ZodIssue[]) {
		return issues.map(({ code, path, message }) => ({
			code,
			path: path[0],
			message,
		}));
	}
}
