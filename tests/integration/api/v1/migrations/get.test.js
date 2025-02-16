import database from "../../../../../infra/database";
import orquestrator from "tests/orquestrator.js";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.clearDatabase();
});

describe("'Get' to 'api/v1/migrations'", () => {
  describe("Anonimous user", () => {
    test("Retrieving pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      const responseBody = await response.json();
      expect(response.status).toBe(200);
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
      const pgmigrations = await database.query(
        "select count(*) from pgmigrations;",
      );

      const count = parseInt(pgmigrations.rows[0].count, 10);

      expect(count).toBe(0);
    });

    test("'DEL/PUT/PATCH' to 'api/v1/migrations' should return 405", async () => {
      const MethodNotAllowedError = {
        name: "MethodNotAllowedError",
        message: "Método não permitido para este endpoint",
        action: "Verifique se o método HTTP é valido para este endpoint",
        status_code: 405,
      };

      const responseDel = await fetch(
        "http://localhost:3000/api/v1/migrations",
        {
          method: "DELETE",
        },
      );
      const responsePatch = await fetch(
        "http://localhost:3000/api/v1/migrations",
        {
          method: "PATCH",
        },
      );
      const responsePut = await fetch(
        "http://localhost:3000/api/v1/migrations",
        {
          method: "PUT",
        },
      );

      expect(responseDel.status).toBe(405);
      expect(responsePatch.status).toBe(405);
      expect(responsePut.status).toBe(405);
      expect(await responseDel.json()).toEqual(MethodNotAllowedError);
      expect(await responsePatch.json()).toEqual(MethodNotAllowedError);
      expect(await responsePut.json()).toEqual(MethodNotAllowedError);
      const pgmigrations = await database.query(
        "select count(*) from pgmigrations;",
      );
      const count = parseInt(pgmigrations.rows[0].count, 10);
      expect(count).toBe(0);
    });
  });
});
