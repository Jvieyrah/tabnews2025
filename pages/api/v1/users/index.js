import { createRouter } from "next-connect";
import controller from "../../../../infra/controller";
import user from "../../../../models/user";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userImputValues = request.body;
  const newUser = await user.create(userImputValues);
  return response.status(201).json(newUser);
}
