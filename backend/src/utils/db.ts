import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || "5432"),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  // Tune pool to limit concurrent connections per container instance.
  // Adjust via env: PGPOOL_MAX, PG_IDLE_MS, PG_CONN_TIMEOUT_MS
  max: parseInt(process.env.PGPOOL_MAX || "10"),
  idleTimeoutMillis: parseInt(process.env.PG_IDLE_MS || "30000"),
  connectionTimeoutMillis: parseInt(process.env.PG_CONN_TIMEOUT_MS || "2000"),
});
