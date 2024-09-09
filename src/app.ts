import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { ErrorMiddleware } from "./middlewares";
import { authRoute } from "./features/auth";
import { ChatController } from "./features/chat/chatController";
import morgan from "morgan";

dotenv.config();
const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.sendFile("D:/Data Kuliah/Semester 7/PAPB/Code/backend_chat_with_stranger/chat.testing.html");
});
app.use("/auth", authRoute);

const chatController = new ChatController(io);
chatController.initialize();

app.use(ErrorMiddleware.notFound);
app.use(ErrorMiddleware.returnError);

export default server;
