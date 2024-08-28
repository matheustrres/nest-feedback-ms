import { z } from 'zod';

export const envSchema = z.object({
	PORT: z.coerce.number().optional().default(3333),
	NODE_ENV: z.enum(['production', 'development', 'staging', 'test']),
	MONGODB_USER: z.coerce.string(),
	MONGODB_PASSWORD: z.coerce.string(),
	MONGODB_DATABASE: z.coerce.string(),
	MONGODB_PORT: z.coerce.number().default(27017),
	MONGODB_URI: z.coerce.string().startsWith('mongodb://'),
	SENTRY_DSN: z.string(),
});

export type Env = z.infer<typeof envSchema>;
