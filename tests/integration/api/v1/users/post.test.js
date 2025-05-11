import orquestrator from "tests/orquestrator.js";
import { version as uuidVersion } from "uuid";
import user from "../../../../../models/user.js";
import password from "../../../../../models/password.js";

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
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4); // uud ver 4 é o padrão criado pela func gen_random_uuid() no postgres implementada na migration 'create user'
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOneByUsername("jvieyrah");
      const correctPasswordMatch = await password.compare(
        userDataImput.password,
        userInDatabase.password,
      );
      expect(correctPasswordMatch).toBe(true);

      const inCorrectPasswordMatch = await password.compare(
        "any word",
        userInDatabase.password,
      );
      expect(inCorrectPasswordMatch).toBe(false);
    });
  });

  test("With duplicared email data", async () => {
    const userDataImput = {
      username: "jvieyrah2",
      email: "email2@email.com",
      password: "senha2",
    };

    const userDataImput2 = {
      username: "jvieyrah3",
      email: "Email2@email.com",
      password: "senha3",
    };

    await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDataImput),
    });

    const response2 = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDataImput2),
    });

    const responseBody = await response2.json();

    expect(response2.status).toBe(400);
    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "Um dos dados informados já está sendo ultilizado",
      action: "Ultilize outros dados para realizar o trabalho",
      status_code: 400,
    });
  });

  test("With duplicared username data", async () => {
    const userDataImput = {
      username: "jvieyrah",
      email: "email@email.com",
      password: "senha2",
    };

    const userDataImput2 = {
      username: "JVieyrah",
      email: "Email2@email.com",
      password: "senha3",
    };

    await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDataImput),
    });

    const response2 = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDataImput2),
    });

    const responseBody = await response2.json();

    expect(response2.status).toBe(400);
    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "Um dos dados informados já está sendo ultilizado",
      action: "Ultilize outros dados para realizar o trabalho",
      status_code: 400,
    });
  });
});
