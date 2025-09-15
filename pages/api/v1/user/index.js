import { createRouter } from "next-connect";
import controller from "../../../../infra/controller";
import session from "../../../../models/session";
import user from "../../../../models/user";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const sessionToken = request.cookies.session_id;
  const sessionObject = await session.findOneValidByToken(sessionToken);
  const userFound = await user.findOneByUserId(sessionObject.user_id);

  return response.status(200).json(userFound);
}
