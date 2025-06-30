import { pool } from "../utils/db";

export async function ensureUserExists(email: string) {
  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);

  if (existing.rows.length > 0) {
    return existing.rows[0].id; // UUID
  }

  const insert = await pool.query(
    "INSERT INTO users (email) VALUES ($1) RETURNING id",
    [email]
  );

  return insert.rows[0].id;
}
