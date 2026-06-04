import 'dotenv/config'
import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  APP_HOST: z.string().default('localhost'),
  APP_PORT: z.coerce.number().int().positive().default(3000),

  DI_MODE: z.enum(['explicit', 'decorator']).default('explicit'),
  TRANSPORT: z.enum(['express', 'hono', 'nest', 'grpc']).default('express')
})

const parsedEnv = EnvSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error('Invalid environment variables')
  console.error(parsedEnv.error.format())
  process.exit(1)
}

export const env = parsedEnv.data
