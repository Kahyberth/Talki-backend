import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  ORIGIN_CORS: string;
  DATABASE_URL: string;
  LIVEKIT_API_KEY: string;
  LIVEKIT_API_SECRET: string;
  LIVEKIT_SERVER_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    ORIGIN_CORS: joi.string().required(),
    DATABASE_URL: joi.string().required(),
    LIVEKIT_API_KEY: joi.string().required(),
    LIVEKIT_API_SECRET: joi.string().required(),
    LIVEKIT_SERVER_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  ORIGIN_CORS: process.env.ORIGIN_CORS,
  DATABASE_URL: process.env.DATABASE_URL,
  LIVEKIT_API_KEY: process.env.LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET: process.env.LIVEKIT_API_SECRET,
  LIVEKIT_SERVER_URL: process.env.LIVEKIT_SERVER_URL,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,
  ORIGIN_CORS: envVars.ORIGIN_CORS,
  DATABASE_URL: envVars.DATABASE_URL,
  LIVEKIT_API_KEY: envVars.LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET: envVars.LIVEKIT_API_SECRET,
  LIVEKIT_SERVER_URL: envVars.LIVEKIT_SERVER_URL,
};
