import user from "./user";
import password from "./password";
import { NotFoundError, UnauthorizedError } from "../infra/errors";

async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const storedUser = await findOneByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Datos de autenticação não conferem",
        action: "Verifique se os dados enviados estão corretos",
      });
    }
    throw error;
  }

  async function findOneByEmail(email) {
    try {
      return await user.findOneByEmail(email);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "Datos de autenticação não conferem",
          action: "Verifique se os dados enviados estão corretos",
        });
      }
      throw error;
    }
  }
  async function validatePassword(providedPassword, returnedPassword) {
    const correctPasswordMatch = await password.compare(
      providedPassword,
      returnedPassword,
    );

    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: "Datos de autenticação não conferem",
        action: "Verifique se os dados enviados estão corretos",
      });
    }
  }
}

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
