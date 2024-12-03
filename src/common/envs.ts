import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  ORIGIN_CORS: string;
  DATABASE_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    ORIGIN_CORS: joi.string().required(),
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  ORIGIN_CORS: process.env.ORIGIN_CORS,
  DATABASE_URL: process.env.DATABASE_URL,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,
  ORIGIN_CORS: envVars.ORIGIN_CORS,
  DATABASE_URL: envVars.DATABASE_URL,
};
