import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import database from "../../../../infra/database";
import { resolve } from "node:path";
import controller from "../../../../infra/controller";

const router = createRouter();

router.get(getHandler).post(postHandler);

export default router.handler(controller.errorHandlers);

const migrationsObject = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...migrationsObject,
      dbClient,
    });
    return response.status(200).json(pendingMigrations);
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}

async function postHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...migrationsObject,
      dryRun: false,
      dbClient,
    });

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    return response.status(200).json(migratedMigrations);
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}
