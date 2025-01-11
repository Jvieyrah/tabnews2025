import MigrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
  if (!["GET", "POST"].includes(request.method)) {
    return response.status(405).end(); // Method Not Allowed
  }

  const dryRun = request.method === "GET";

  const migrations = await MigrationRunner({
    databaseUrl: process.env.DATABASE_URL,
    dryRun,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  });

  return response.status(200).json(migrations);
}
