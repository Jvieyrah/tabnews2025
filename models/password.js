import bcriptjs from "bcryptjs";

const PEPPER = process.env.PEPPER;

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function hash(password) {
  const SALT = getNumberOfRounds();
  const pepperedPassword = password + PEPPER;

  return await bcriptjs.hash(pepperedPassword, SALT);
}

async function compare(password, hashedPassword) {
  const pepperedPassword = password + PEPPER;

  return await bcriptjs.compare(pepperedPassword, hashedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
