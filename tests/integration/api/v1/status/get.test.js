test("'GET' to 'api/v1/status' should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();
  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(response.status).toBe(200);
  expect(responseBody.updated_at).toBeDefined();
  expect(responseBody.db_version).toBeDefined();
  expect(responseBody.maximum_connections).toBeDefined();
  expect(responseBody.connections_in_use).toBeDefined();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
  expect(responseBody.maximum_connections).toBeGreaterThan(1);
  expect(responseBody.connections_in_use).toBeGreaterThan(0);
});
