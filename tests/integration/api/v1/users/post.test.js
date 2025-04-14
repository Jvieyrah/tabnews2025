import orquestrator from "tests/orquestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.clearDatabase();
  await orquestrator.runPendingMigrations();
});

describe("'POST' to 'api/v1/users'", () => {
  describe("Anonymous User", () => {
    test("With unique and valid data", async () => {
      const userDataImput = {
        username: "jvieyrah",
        email: "email@email.com",
        password: "senha",
      };

      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDataImput),
      });

      const responseBody = await response1.json();

      expect(response1.status).toBe(201);
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "jvieyrah",
        email: "email@email.com",
        password: "senha",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4); // uud ver 4 é o padrão criado pela func gen_random_uuid() no postgres implementada na migration 'create user'
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
  });
});
