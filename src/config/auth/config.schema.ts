import { z } from 'zod';

export const authConfigSchema = z.object({
  jwtAccessSecret: z.string().min(1).max(255),
  jwtRefreshSecret: z.string().min(1).max(255),
});
