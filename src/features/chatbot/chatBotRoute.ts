import { Router } from "express";
import { JwtMiddleware } from "../../middlewares/jwt_middleware";
import { ChatBotController } from "./chatBotController";

const chatBotRoute: Router = Router();

chatBotRoute.post("/chat/completions", ChatBotController.getResponseFromBot);

export default chatBotRoute;
