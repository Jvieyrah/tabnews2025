import { createRouter } from "next-connect";
import database from "../../../../infra/database";
import {
  InternalServerError,
  MethodNotAllowedError,
} from "../../../../infra/errors";

const router = createRouter();

router.get(getHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  console.log(`\n Erro dentro do catch no next-connect de status`);
  const publicErrorObject = new InternalServerError({
    cause: error,
  });
  console.log(publicErrorObject);
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

async function getHandler(request, response) {
  const versionResult = await database.query(`SHOW server_version;`);
  const maxConnectionsResult = await database.query(`SHOW max_connections;`);
  const version = versionResult.rows[0].server_version;
  const maxConnections = parseInt(
    maxConnectionsResult.rows[0].max_connections,
    10,
  );

  const dbName = process.env.POSTGRES_DB;
  const opennedConnectionsResult = await database.query({
    text: `SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1 ;`,
    values: [dbName],
  });
  const opennedConnectionsValue = opennedConnectionsResult.rows[0].count;

  const updatedAt = new Date().toISOString();
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: version,
        max_connections: maxConnections,
        openned_connections: opennedConnectionsValue,
      },
    },
  });
}
