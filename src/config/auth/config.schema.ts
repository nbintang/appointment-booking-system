import { z } from 'zod';

export const authConfigSchema = z.object({
  jwtAccessSecret: z.string().min(1).max(255),
});
