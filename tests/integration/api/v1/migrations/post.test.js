import database from "../../../../../infra/database";
import orquestrator from "tests/orquestrator.js";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.clearDatabase();
});

describe("'POST' to 'api/v1/migrations'", () => {
  describe("Anonimous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const response1 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        const response1Body = await response1.json();
        expect(response1.status).toBe(201);
        expect(Array.isArray(response1Body)).toBe(true);
        expect(response1Body.length).toBeGreaterThan(0);

        const pgmigrations1 = await database.query(
          "select count(*) from pgmigrations;",
        );

        const count1 = parseInt(pgmigrations1.rows[0].count, 10);

        expect(count1).toBeGreaterThan(0);
      });
      test("For the second time", async () => {
        const response2 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        const response2Body = await response2.json();
        expect(response2.status).toBe(200);
        expect(Array.isArray(response2Body)).toBe(true);
        expect(response2Body.length).toBe(0);

        const pgmigrations2 = await database.query(
          "select count(*) from pgmigrations;",
        );

        const count2 = parseInt(pgmigrations2.rows[0].count, 20);

        expect(count2).toBeGreaterThan(0);
      });
    });
  });
});
