import database from "infra/database";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public");
}

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
