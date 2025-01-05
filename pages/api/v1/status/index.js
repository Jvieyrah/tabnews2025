import database from "infra/database";

async function status(request, response) {
  const dbReturn = await database.query(`
    SELECT 
        version() AS version,
        (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') AS max_connections,
        COUNT(*) AS current_connections
    FROM pg_stat_activity;
  `);

  const [
    {
      version,
      max_connections: maxConnections,
      current_connections: currentConnections,
    },
  ] = dbReturn.rows;

  console.log(version, maxConnections, currentConnections);
  const updatedAt = new Date().toISOString();
  response.status(200).json({
    updated_at: updatedAt,
    db_version: version,
    maximum_connections: maxConnections,
    connections_in_use: Number(currentConnections),
  });
}

export default status;
