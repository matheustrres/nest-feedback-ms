import z from 'zod';

import { ZodValidationPipe } from '@/shared/lib/pipes/zod-validation.pipe';

const listProductFeedbacksDto = z.object({
	productId: z.string().uuid(),
	skip: z.coerce.number().default(0).optional(),
	limit: z.coerce.number().default(10).optional(),
});

export const ListProductFeedbacksBodyPipe = new ZodValidationPipe(
	listProductFeedbacksDto,
);

export type ListProductFeedbacksDto = z.infer<typeof listProductFeedbacksDto>;
