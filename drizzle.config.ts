import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";
import { envs } from './src/common/envs';

config({ path: '.env' });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: envs.DATABASE_URL!,
  },
});
