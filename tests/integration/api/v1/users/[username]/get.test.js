import orquestrator from "tests/orquestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.clearDatabase();
  await orquestrator.runPendingMigrations();
});

describe("'GET' to 'api/v1/users/[username]'", () => {
  describe("Anonymous User", () => {
    test("With exact case match", async () => {
      const userDataInput1 = {
        username: "SameCase",
      };

      await orquestrator.createUser(userDataInput1);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/SameCase",
        {
          method: "GET",
        },
      );

      expect(response2.status).toBe(200);
      const responseBody = await response2.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "SameCase",
        email: responseBody.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4); // uud ver 4 é o padrão criado pela func gen_random_uuid() no postgres implementada na migration 'create user'
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
    test("With case mismatch", async () => {
      const userDataInput1 = {
        username: "DiferrentCase",
      };

      await orquestrator.createUser(userDataInput1);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/diferrentcase",
        {
          method: "GET",
        },
      );

      expect(response2.status).toBe(200);
      const responseBody = await response2.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "DiferrentCase",
        email: responseBody.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4); // uud ver 4 é o padrão criado pela func gen_random_uuid() no postgres implementada na migration 'create user'
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
    test("With unexistent username", async () => {
      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/fakeUser",
        {
          method: "GET",
        },
      );

      expect(response2.status).toBe(404);
      const responseBody = await response2.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema",
        action: "Verifique se o username está digitado corretamente",
        status_code: 404,
      });
    });
  });
});
