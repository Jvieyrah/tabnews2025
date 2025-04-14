import database from "../infra/database";

async function create(imputValues) {
  const newUser = await database.query({
    text: `INSERT INTO
                users (username, email, password) 
            VALUES
                ($1, $2, $3)
            RETURNING   
                *
                ;`,
    values: [imputValues.username, imputValues.email, imputValues.password],
  });
  return newUser.rows[0];
}

const user = {
  create,
};

export default user;
