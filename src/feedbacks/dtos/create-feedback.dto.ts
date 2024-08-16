import z from 'zod';

import { ZodValidationPipe } from '@/shared/lib/pipes/zod-validation.pipe';

const createFeedbackDto = z.object({
	userId: z.string().uuid(),
	productId: z.string().uuid(),
	comment: z.string().min(20).max(255),
	rating: z.coerce.number().min(0).max(5),
});

export const CreateFeedbackBodyPipe = new ZodValidationPipe(createFeedbackDto);

export type CreateFeedbackDto = z.infer<typeof createFeedbackDto>;
