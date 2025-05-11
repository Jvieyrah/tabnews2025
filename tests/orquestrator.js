import retry from "async-retry";
import { faker } from "@faker-js/faker";

import database from "../infra/database";
import migrator from "../models/migrator";
import user from "../models/user";

async function waitForAllServices() {
  await waitForWebServer();
  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
      onRetry: (error, attempt) => {
        console.log(
          `attempt: ${attempt} - failed to fetch Status page ${error.message}`,
        );
      },
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw new Error(`HTTP error ${response.status}`);
      }
    }
  }
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function createUser(newUserValues) {
  return await user.create({
    username:
      newUserValues.username || faker.internet.username().replace(/{_.-}/g, ""),
    email: newUserValues.email || faker.internet.email(),
    password: newUserValues.password || "validPassword",
  });
}

const orquestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
};

export default orquestrator;
