// import database from "../../../../../infra/database";
// import orquestrator from "tests/orquestrator.js";

// beforeAll(async () => {
//   await orquestrator.waitForAllServices();
//   await orquestrator.clearDatabase();
// });

// describe("'POST' to 'api/v1/users'", () => {
//   describe("Anonymous User", () => {
//     test("With unique and valid data", async () => {
//       await database.query({
//         text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $#);",
//         values: ["jvieyrah", "email@email.com", "senha"],
//       });

//       const user = await database.query("SELECT * FROM users;");
//       console.log("rows: ", user.row());
//       const response1 = await fetch("http://localhost:3000/api/v1/users", {
//         method: "POST",
//       });

//       expect(response1.status).toBe(201);
//     });
//   });
// });
