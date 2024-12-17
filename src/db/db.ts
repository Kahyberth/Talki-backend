import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { envs } from 'src/common/envs';

const db = drizzle({
  connection: {
    url: envs.TURSO_DATABASE_URL!,
    authToken: envs.TURSO_AUTH_TOKEN!,
  },
});

export default db;
