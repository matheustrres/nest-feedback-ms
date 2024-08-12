import z from 'zod';

const createFeedbackDto = z.object({
	userId: z.string().uuid(),
	productId: z.string().uuid(),
	comment: z.string().min(20).max(255),
	rating: z.number().min(0).max(5),
});

export type CreateFeedbackDto = z.infer<typeof createFeedbackDto>;
