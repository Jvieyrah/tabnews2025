const nextJest = require("next/jest");
const dotenv = require("dotenv");

const createJestConfig = nextJest();

dotenv.config({ path: ".env.development" });

const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
});

module.exports = jestConfig;
