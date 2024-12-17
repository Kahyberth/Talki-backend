import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  ORIGIN_CORS: string;
  LIVEKIT_API_KEY: string;
  LIVEKIT_API_SECRET: string;
  LIVEKIT_SERVER_URL: string;
  API_URL: string;
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    ORIGIN_CORS: joi.string().required(),
    LIVEKIT_API_KEY: joi.string().required(),
    LIVEKIT_API_SECRET: joi.string().required(),
    LIVEKIT_SERVER_URL: joi.string().required(),
    API_URL: joi.string().required(),
    TURSO_DATABASE_URL: joi.string().required(),
    TURSO_AUTH_TOKEN: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  ORIGIN_CORS: process.env.ORIGIN_CORS,
  LIVEKIT_API_KEY: process.env.LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET: process.env.LIVEKIT_API_SECRET,
  LIVEKIT_SERVER_URL: process.env.LIVEKIT_SERVER_URL,
  API_URL: process.env.API_URL,
  TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,
  ORIGIN_CORS: envVars.ORIGIN_CORS,
  LIVEKIT_API_KEY: envVars.LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET: envVars.LIVEKIT_API_SECRET,
  LIVEKIT_SERVER_URL: envVars.LIVEKIT_SERVER_URL,
  API_URL: envVars.API_URL,
  TURSO_DATABASE_URL: envVars.TURSO_DATABASE_URL,
  TURSO_AUTH_TOKEN: envVars.TURSO_AUTH_TOKEN,
};
