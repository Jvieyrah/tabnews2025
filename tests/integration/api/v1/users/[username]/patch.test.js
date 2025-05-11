import orquestrator from "tests/orquestrator.js";
import user from "../../../../../../models/user.js";
import password from "../../../../../../models/password.js";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.clearDatabase();
  await orquestrator.runPendingMigrations();
});

describe("'PATCH' to 'api/v1/users/[username]'", () => {
  describe("Anonymous User", () => {
    test("With unexistent 'username'", async () => {
      const user1DataInput = {
        username: "fakeUser",
        email: "fakeUser@email.com",
        password: "senha2",
      };

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/userX",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user1DataInput),
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

    test("With duplicared 'username' data", async () => {
      const user1DataInput = {
        username: "user1",
      };

      await orquestrator.createUser(user1DataInput);

      const user2DataInput = {
        username: "userX",
      };

      await orquestrator.createUser(user2DataInput);

      const missUpdatedUser = await fetch(
        "http://localhost:3000/api/v1/users/userX",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: "user1" }),
        },
      );

      expect(missUpdatedUser.status).toBe(400);

      expect(missUpdatedUser.headers.get("Content-Type")).toMatch(
        /application\/json/,
      );

      const missUpdatedUserResponse = await missUpdatedUser.json();

      expect(missUpdatedUserResponse).toEqual({
        name: "ValidationError",
        message: "Um dos dados informados já está sendo ultilizado",
        action: "Ultilize outros dados para realizar o trabalho",
        status_code: 400,
      });
    });

    test("With duplicared 'email' data", async () => {
      const user1DataInput = {
        email: "userC@email.com",
      };

      await orquestrator.createUser(user1DataInput);

      const user2DataInput = {
        email: "userD@email.com",
      };

      const createdUser2 = await orquestrator.createUser(user2DataInput);

      const missUpdatedUser = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser2.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "userC@email.com" }),
        },
      );

      expect(missUpdatedUser.status).toBe(400);

      expect(missUpdatedUser.headers.get("Content-Type")).toMatch(
        /application\/json/,
      );

      const missUpdatedUserResponse = await missUpdatedUser.json();

      expect(missUpdatedUserResponse).toEqual({
        name: "ValidationError",
        message: "Um dos dados informados já está sendo ultilizado",
        action: "Ultilize outros dados para realizar o trabalho",
        status_code: 400,
      });
    });

    test("With unique 'username' data", async () => {
      const user1DataInput = {
        username: "uniqueuser1",
      };

      await orquestrator.createUser(user1DataInput);

      const UpdatedUser = await fetch(
        "http://localhost:3000/api/v1/users/uniqueuser1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: "uniqueuser2" }),
        },
      );

      expect(UpdatedUser.status).toBe(201);

      const updatedUserResponse = await UpdatedUser.json();

      expect(updatedUserResponse).toEqual({
        id: updatedUserResponse.id,
        username: "uniqueuser2",
        email: updatedUserResponse.email,
        password: updatedUserResponse.password,
        created_at: updatedUserResponse.created_at,
        updated_at: updatedUserResponse.updated_at,
      });

      expect(
        updatedUserResponse.updated_at > updatedUserResponse.created_at,
      ).toBe(true);
    });

    test("With unique 'email' data", async () => {
      const user1DataInput = {
        email: "uniqueemailuser1@email.com",
      };

      const user = await orquestrator.createUser(user1DataInput);

      const UpdatedUser = await fetch(
        `http://localhost:3000/api/v1/users/${user.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "uniqueemailuser2@email.com" }),
        },
      );

      expect(UpdatedUser.status).toBe(201);

      const updatedUserResponse = await UpdatedUser.json();

      expect(updatedUserResponse).toEqual({
        id: updatedUserResponse.id,
        username: updatedUserResponse.username,
        email: "uniqueemailuser2@email.com",
        password: updatedUserResponse.password,
        created_at: updatedUserResponse.created_at,
        updated_at: updatedUserResponse.updated_at,
      });

      expect(
        updatedUserResponse.updated_at > updatedUserResponse.created_at,
      ).toBe(true);
    });

    test("With new 'password' data", async () => {
      const createdUser = await orquestrator.createUser({});

      const UpdatedUser = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: "senha3" }),
        },
      );

      expect(UpdatedUser.status).toBe(201);

      const updatedUserResponse = await UpdatedUser.json();

      expect(
        updatedUserResponse.updated_at > updatedUserResponse.created_at,
      ).toBe(true);

      const userInDatabase = await user.findOneByUsername(createdUser.username);
      const correctPasswordMatch = await password.compare(
        "senha3",
        userInDatabase.password,
      );
      expect(correctPasswordMatch).toBe(true);

      const inCorrectPasswordMatch = await password.compare(
        createdUser.password,
        userInDatabase.password,
      );
      expect(inCorrectPasswordMatch).toBe(false);
    });
  });
});
