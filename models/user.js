import database from "../infra/database";
import { ValidationError, NotFoundError } from "../infra/errors.js";

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
}

const user = {
  create,
  findOneByUsername,
};

export default user;
