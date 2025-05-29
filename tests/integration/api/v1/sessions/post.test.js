import orquestrator from "tests/orquestrator.js";
import { version as uuidVersion } from "uuid";
import user from "../../../../../models/user.js";
import password from "../../../../../models/password.js";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.clearDatabase();
  await orquestrator.runPendingMigrations();
});

describe("'POST' to 'api/v1/sessions'", () => {
  describe("Anonymous User", () => {
    test("With incorrect 'email' but correct 'password'", async () => {
      const userDataImput = {
        password: "correctUserPassword",
      };

      await orquestrator.createUser(userDataImput);

      const response1 = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "incorrectUserEmail@email.com",
          password: "correctUserPassword",
        }),
      });

      expect(response1.status).toBe(401);
      const responseBody = await response1.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Datos de autenticação não conferem",
        action: "Verifique se os dados enviados estão corretos",
        status_code: 401,
      });
    });
  });

  test("With correct 'email' but incorrect 'password'", async () => {
    const userDataImput = {
      email: "orrectUserEmail@email.com",
    };

    await orquestrator.createUser(userDataImput);

    const response1 = await fetch("http://localhost:3000/api/v1/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "correctUserEmail@email.com",
        password: "incorrectUserPassword",
      }),
    });

    expect(response1.status).toBe(401);
    const responseBody = await response1.json();
    expect(responseBody).toEqual({
      name: "UnauthorizedError",
      message: "Datos de autenticação não conferem",
      action: "Verifique se os dados enviados estão corretos",
      status_code: 401,
    });
  });

  test("With incorrect 'email' but incorrect 'password'", async () => {
    const userDataImput = {};

    await orquestrator.createUser(userDataImput);

    const response1 = await fetch("http://localhost:3000/api/v1/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "incorrectUserEmail@email.com",
        password: "incorrectUserPassword",
      }),
    });

    expect(response1.status).toBe(401);
    const responseBody = await response1.json();
    expect(responseBody).toEqual({
      name: "UnauthorizedError",
      message: "Datos de autenticação não conferem",
      action: "Verifique se os dados enviados estão corretos",
      status_code: 401,
    });
  });
});
