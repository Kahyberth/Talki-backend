import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { envs } from 'src/common/envs';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: envs.TURSO_DATABASE_URL,
    authToken: envs.TURSO_AUTH_TOKEN,
  },
});
