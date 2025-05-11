import orquestrator from "tests/orquestrator.js";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
});

describe("'Post' to 'api/v1/status'", () => {
  describe("Anonimous user", () => {
    test("Retrieving current system status fom the APIs", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "POST",
      });
      const responseBody = await response.json();
      expect(response.status).toBe(405);
      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Método não permitido para este endpoint",
        action: "Verifique se o método HTTP é valido para este endpoint",
        status_code: 405,
      });
    });
  });
});
