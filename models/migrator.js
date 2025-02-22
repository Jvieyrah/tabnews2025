import migrationRunner from "node-pg-migrate";
import database from "../infra/database";
import { resolve } from "node:path";

const migrationsObject = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...migrationsObject,
      dbClient,
    });
    return pendingMigrations;
  } finally {
    if (dbClient) {
      await dbClient?.end();
    }
  }
}

async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...migrationsObject,
      dryRun: false,
      dbClient,
    });
    return migratedMigrations;
  } finally {
    if (dbClient) {
      await dbClient?.end();
    }
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
