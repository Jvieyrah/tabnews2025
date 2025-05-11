import { createRouter } from "next-connect";
import controller from "../../../../../infra/controller";
import user from "../../../../../models/user";

const router = createRouter();

router.get(getHandler);
router.patch(patchHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const { username } = request.query;
  const userData = await user.findOneByUsername(username);
  return response.status(200).json(userData);
}

async function patchHandler(request, response) {
  const { username } = request.query;
  const userInputValues = request.body;
  const updatedUser = await user.update(username, userInputValues);
  console.log(updatedUser);
  return response.status(201).json(updatedUser);
}
