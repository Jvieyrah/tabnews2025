import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import database from "../../../../infra/database";
import { resolve } from "node:path";
import {
  InternalServerError,
  MethodNotAllowedError,
} from "../../../../infra/errors";

const router = createRouter();

router.get(migrationsHandler).post(migrationsHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  console.log(`\n Erro dentro do catch no next-connect de migrations`);
  const publicErrorObject = new InternalServerError({
    cause: error,
  });
  console.log(publicErrorObject);
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

async function migrationsHandler(request, response) {
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
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}
