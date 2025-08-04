import orquestrator from "tests/orquestrator.js";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.clearDatabase();
  await orquestrator.runPendingMigrations();
});

describe("GET' to 'api/v1/user'", () => {
  describe("Default User", () => {
    test("With valid session", async () => {
      const createdUser = await orquestrator.createUser({
        username: "UserWithValidSession",
      });

      const sessionObject = await orquestrator.createSession(createdUser.id);
      const token = sessionObject.token;

      const response1 = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${token}`,
        },
      });

      expect(response1.status).toBe(200);

      const responseBody = await response1.json();

      expect(responseBody).toEqual({
        id: createdUser.id,
        username: "UserWithValidSession",
        email: createdUser.email,
        password: createdUser.password,
        created_at: createdUser.created_at.toISOString(),
        updated_at: createdUser.updated_at.toISOString(),
      });
    });
  });
});
