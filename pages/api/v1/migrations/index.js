import migrationRunner from "node-pg-migrate";
import database from "infra/database";
import { join } from "node:path";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const migrationsObject = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(migrationsObject);
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  }
  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...migrationsObject,
      dryRun: false,
    });

    await dbClient.end();

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    return response.status(200).json(migratedMigrations);
  }
  return response.status(405).end(); // Method Not Allowed
}
