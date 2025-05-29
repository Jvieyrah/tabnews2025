import { createRouter } from "next-connect";
import controller from "../../../../infra/controller";
import authentication from "../../../../models/authentication";
import { UnauthorizedError } from "../../../../infra/errors";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;
  const getAuthenticatedUser = await authentication.getAuthenticatedUser(
    userInputValues.email,
    userInputValues.password,
  );
  return response.status(201).json({});
}
