import migrationRunner from "node-pg-migrate";
import database from "../../../../infra/database";
import { resolve } from "node:path";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(request.method)) {
    const errorMessage = {
      error: `Method ${request.method} not allowed`,
    };
    return response.status(405).json(errorMessage);
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migrationsObject = {
      dbClient: dbClient,
      dryRun: true,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(migrationsObject);
      return response.status(200).json(pendingMigrations);
    }
    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...migrationsObject,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }
      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error("problemas com o DB: ", error);
    response.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}
