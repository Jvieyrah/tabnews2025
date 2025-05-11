import database from "../infra/database";
import { ValidationError, NotFoundError } from "../infra/errors.js";
import password from "../models/password.js";

async function findOneByUsername(username) {
  const foundUser = await runSelectQuery(username);
  return foundUser;
  async function runSelectQuery(value) {
    const result = await database.query({
      text: `SELECT * FROM
                  users 
              WHERE
                 LOWER(username) = LOWER($1)
              LIMIT
                  1
                  ;`,
      values: [value],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema",
        action: "Verifique se o username está digitado corretamente",
      });
    }
    return result.rows[0];
  }
}

async function create(inputValues) {
  await validateUniqueEmailOrUsername(inputValues);
  await hashPasswordInObject(inputValues);
  const newUser = await runInsertQuery(inputValues);
  return newUser;

  async function runInsertQuery(values) {
    const createdUser = await database.query({
      text: `INSERT INTO
                  users (username, email, password) 
              VALUES
                  ($1, $2, $3)
              RETURNING   
                  *
                  ;`,
      values: [values.username, values.email, values.password],
    });
    return createdUser.rows[0];
  }
}

async function update(username, userInputValues) {
  const isUpdatingUsername =
    "username" in userInputValues &&
    username.toLowerCase() !== userInputValues.username.toLowerCase();

  const currentUser = await findOneByUsername(username);
  if (isUpdatingUsername || "email" in userInputValues) {
    await validateUniqueEmailOrUsername(userInputValues);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const newUserValues = { ...currentUser, ...userInputValues };

  const updateduser = await runUpdatedQuery(newUserValues);
  return updateduser;

  async function runUpdatedQuery(newUserValues) {
    const updatedUser = await database.query({
      text: `UPDATE 
                users
              SET 
                username = $2,
                email = $3,
                password = $4,
                updated_at = timezone('UTC', now())
              WHERE
               id = $1
              RETURNING
                *
              `,

      values: [
        newUserValues.id,
        newUserValues.username,
        newUserValues.email,
        newUserValues.password,
      ],
    });
    return updatedUser.rows[0];
  }
}

async function validateUniqueEmailOrUsername(values) {
  const result = await database.query({
    text: `SELECT email FROM
                  users 
              WHERE
                 LOWER(email) = LOWER($1) or LOWER(username) = LOWER($2)
                  ;`,
    values: [values.email, values.username],
  });

  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "Um dos dados informados já está sendo ultilizado",
      action: "Ultilize outros dados para realizar o trabalho",
    });
  }
}

async function hashPasswordInObject(objectValues) {
  const hashedPassword = await password.hash(objectValues.password);
  objectValues.password = hashedPassword;
}

const user = {
  create,
  findOneByUsername,
  update,
};

export default user;
