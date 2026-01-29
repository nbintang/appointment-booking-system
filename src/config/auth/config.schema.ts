import { z } from 'zod';

export const authConfigSchema = z.object({
  JWT_ACCESS_SECRET: z.string().min(1).max(255),
});
