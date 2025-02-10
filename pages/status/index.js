import useSwr from "swr";

async function fetchApi(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function Status() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
    </>
  );
}

function UpdatedAt() {
  const { data, isLoading } = useSwr("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
    dedumpingInterval: 2000,
  });

  const loadText = "carregando ...";

  let updatedAtText = loadText;
  let dbVersionText = loadText;
  let maxConnectionsText = loadText;
  let oppenedConnectionsText = loadText;

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pr-BR");
    dbVersionText = data.dependencies.database.version;
    maxConnectionsText = data.dependencies.database.max_connections;
    oppenedConnectionsText = data.dependencies.database.openned_connections;
  }
  return (
    <div>
      <p>Ùltima atualização {updatedAtText}</p>
      <p>Versão do postgress {dbVersionText}</p>
      <p>Maximo de conexôes {maxConnectionsText}</p>
      <p>Conexões abertas {oppenedConnectionsText}</p>
    </div>
  );
}

export default Status;
