import { z } from 'zod';

export const envSchema = z.object({
	PORT: z.coerce.number().optional().default(3333),
	NODE_ENV: z
		.enum(['production', 'development', 'staging'])
		.default('development'),
	MONGODB_USER: z.string(),
	MONGODB_PASSWORD: z.string(),
	MONGODB_DATABASE: z.string(),
	MONGODB_PORT: z.coerce.number().default(27017),
	MONGODB_URI: z.string().startsWith('mongodb://'),
});

export type Env = z.infer<typeof envSchema>;
