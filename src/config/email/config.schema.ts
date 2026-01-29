import { z } from 'zod';

export const emailConfigSchema = z.object({
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  SMTP_SENDER: z.string(),
});
