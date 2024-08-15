import z from 'zod';

import { ZodValidationPipe } from '@/shared/lib/pipes/zod-validation.pipe';

const updateFeedbackDto = z.object({
	userId: z.string().uuid(),
	productId: z.string().uuid(),
	comment: z.string().min(20).max(255).optional(),
	rating: z.number().min(0).max(5).optional(),
});

export const UpdateFeedbackBodyPipe = new ZodValidationPipe(updateFeedbackDto);

export type UpdateFeedbackDto = z.infer<typeof updateFeedbackDto>;
