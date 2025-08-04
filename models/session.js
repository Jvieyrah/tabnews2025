import database from "../infra/database";
import crypto from "node:crypto";

const EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1000; // 30 DAYS

async function create(userId) {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);
  const newSession = await insertQuery(token, userId, expiresAt);
  return newSession;

  async function insertQuery(token, userId, expiresAt) {
    const results = await database.query({
      text: `
      INSERT INTO
        sessions (token, user_id, expires_at)
      VALUES
        ($1,$2,$3)
      RETURNING
        *;
        `,
      values: [token, userId, expiresAt],
    });
    return results.rows[0];
  }
}

async function findOneValidByToken(token) {
  const sessionFound = await runSelectQuery(token);
  return sessionFound;

  async function runSelectQuery(token) {
    const result = await database.query({
      text: `
      SELECT
       * 
      FROM
       sessions
      WHERE
       token = $1
       AND expires_at > NOW()
      LIMIT
       1
       ;`,
      values: [token],
    });
    return result.rows[0];
  }
}

const session = {
  create,
  findOneValidByToken,
  EXPIRATION_IN_MILLISECONDS,
};

export default session;
