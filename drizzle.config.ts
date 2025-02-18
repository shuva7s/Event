import { config } from 'dotenv';
import type { Config } from "drizzle-kit";

config({ path: '.env' });

export default {
  schema: "./database/schema.ts",
  out: "./migrations",
  driver: "pg",
  dbCredentials: {
    // url: process.env.DATABASE_URL!,
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
