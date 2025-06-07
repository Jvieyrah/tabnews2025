import orquestrator from "tests/orquestrator.js";
import { version as uuidVersion } from "uuid";
import session from "../../../../../models/session";

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
      email: "correctUserEmail@email.com",
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

  test("With correct 'email' and correct 'password'", async () => {
    const userDataImput = {
      email: "correctEmail@email.com",
      password: "correctPassword",
    };

    const createdUser = await orquestrator.createUser(userDataImput);

    const response1 = await fetch("http://localhost:3000/api/v1/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "correctEmail@email.com",
        password: "correctPassword",
      }),
    });

    expect(response1.status).toBe(201);
    const responseBody = await response1.json();
    expect(responseBody).toEqual({
      id: expect.any(String),
      token: expect.any(String),
      expires_at: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      user_id: createdUser.id,
    });

    expect(uuidVersion(responseBody.id)).toBe(4); // uud ver 4 é o padrão criado pela func gen_random_uuid() no postgres implementada na migration 'create user'
    expect(Date.parse(responseBody.expires_at)).not.toBeNaN();
    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

    const expiresAt = new Date(responseBody.expires_at);
    const createdAt = new Date(responseBody.created_at);
    expiresAt.setMilliseconds(0);
    createdAt.setMilliseconds(0);
    expect(expiresAt - createdAt).toBe(session.EXPIRATION_IN_MILLISECONDS);
  });
});
