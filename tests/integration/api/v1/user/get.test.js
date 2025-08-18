import orquestrator from "tests/orquestrator.js";
import session from "../../../../../models/session";

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

    test("With invalid session", async () => {
      const invalidToken =
        "4b9bc54e02af8f95401d4425e6a94dab2435d1f0100b1409d11d6487864d043ef510c565233d2a26757b7f28a47aac38";
      const response1 = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${invalidToken}`,
        },
      });

      expect(response1.status).toBe(401);

      const responseBody = await response1.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui sessão ativa",
        action: "Verifique se ste usuário está logado e tente novamente",
        status_code: 401,
      });
    });

    test("With expired session", async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - session.EXPIRATION_IN_MILLISECONDS),
      });

      const createdUser = await orquestrator.createUser({
        username: "UserWithxpiredSession",
      });

      const sessionObject = await orquestrator.createSession(createdUser.id);
      const token = sessionObject.token;

      jest.useRealTimers();

      const response1 = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${token}`,
        },
      });

      expect(response1.status).toBe(401);

      const responseBody = await response1.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui sessão ativa",
        action: "Verifique se ste usuário está logado e tente novamente",
        status_code: 401,
      });
    });
  });
});
