import orquestrator from "tests/orquestrator.js";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
});

describe("'Get' to 'api/v1/status'", () => {
  describe("Anonimous user", () => {
    test("Retrieving current system status fom the APIs", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      const responseBody = await response.json();
      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(response.status).toBe(200);
      expect(responseBody.updated_at).toBeDefined();
      expect(responseBody.dependencies.database.version).toBeDefined();
      expect(responseBody.dependencies.database.max_connections).toBeDefined();
      expect(
        responseBody.dependencies.database.openned_connections,
      ).toBeDefined();
      expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
      expect(responseBody.dependencies.database.version).toBe("16.0");
      expect(
        responseBody.dependencies.database.max_connections,
      ).toBeGreaterThan(1);
      expect(
        responseBody.dependencies.database.openned_connections,
      ).toBeGreaterThan(0);
    });
  });
});
