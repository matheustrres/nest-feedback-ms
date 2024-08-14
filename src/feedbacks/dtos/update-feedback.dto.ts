import z from 'zod';

const updateFeedbackDto = z.object({
	feedbackId: z.string().uuid(),
	userId: z.string().uuid(),
	productId: z.string().uuid(),
	comment: z.string().min(20).max(255).optional(),
	rating: z.number().min(0).max(5).optional(),
});

export type UpdateFeedbackDto = z.infer<typeof updateFeedbackDto>;
