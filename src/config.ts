import { z } from "zod";

const configSchema = z.object({
  wordpressUrl: z.string().url(),
  wordpressUser: z.string().min(1),
  wordpressAppPassword: z.string().min(1),
  aiProvider: z.string().optional(),
  httpPort: z.coerce.number().int().positive().optional(),
});

export type AppConfig = z.infer<typeof configSchema>;

export const loadConfig = (): AppConfig => {
  const config = {
    wordpressUrl: process.env.WORDPRESS_URL,
    wordpressUser: process.env.WORDPRESS_USER,
    wordpressAppPassword: process.env.WORDPRESS_APP_PASSWORD,
    aiProvider: process.env.AI_PROVIDER,
    httpPort: process.env.HTTP_PORT,
  };

  return configSchema.parse(config);
};
