import database from "../../../../../infra/database";
import orquestrator from "tests/orquestrator.js";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public");
});

test("'GET' to 'api/v1/migrations' should return 200", async () => {
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
  const responseDel = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "DELETE",
  });
  const responsePatch = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "PATCH",
  });
  const responsePut = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "PUT",
  });

  expect(responseDel.status).toBe(405);
  expect(responsePatch.status).toBe(405);
  expect(responsePut.status).toBe(405);
  expect(Array.isArray(responseDel)).toBe(false);
  expect(Array.isArray(responsePatch)).toBe(false);
  expect(Array.isArray(responsePut)).toBe(false);
  const pgmigrations = await database.query(
    "select count(*) from pgmigrations;",
  );
  const count = parseInt(pgmigrations.rows[0].count, 10);
  expect(count).toBe(0);
});
