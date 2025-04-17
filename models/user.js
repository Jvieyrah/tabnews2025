import database from "../infra/database";
import { ValidationError } from "../infra/errors.js";
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
};

export default user;
