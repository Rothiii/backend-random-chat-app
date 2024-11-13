import { Namespace, Server, Socket } from "socket.io";
import { ChatService } from "./chatService";
import jwt from "jsonwebtoken";
import { ErrorResponse, UserToken } from "../../models";

export class ChatController {
  private io: Namespace;
  private chatService: ChatService;

  constructor(io: Namespace) {
    this.io = io;
    this.chatService = new ChatService();
  }

  public initialize(): void {
    this.io.use(this.authenticateSocket);

    this.io.on("connection", (socket: Socket) => {
      console.log("A user connected:", socket.data.user.username);
      this.chatService.addUser(socket);

      socket.on("sendMessage", (message: string) => {
        console.log("Message received:", message);
        this.chatService.sendMessage(socket, message);
      });

      socket.on("joinRoomAck", (room_id) => {
        this.chatService.joinRoom(socket, room_id);
        console.log(socket.data.user.username, "acknowledged room:", room_id);
      });

      socket.on("disconnect", () => {
        this.chatService.removeUser(socket);
        // this.chatService.disconnectUser(socket);
      });

      socket.on("partnerDisconnected", () => {
        console.log("Partner disconnected");
        const room = socket.rooms.values().next().value;
        if (room) {
          socket.leave(room);
        }
        this.chatService.addUser(socket);
      });
    });
  }
  
  // Middleware to authenticate socket connections
  private authenticateSocket = async (
    socket: Socket,
    next: (err?: any) => void
  ) => {
    const token = socket.handshake.headers["authorization"]?.split(" ")[1];
    try {
      if (!token) {
        throw new ErrorResponse("Unauthorized", 401, ["token"], "UNAUTHORIZED");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET!); // Verify JWT and extract user
      socket.data.user = decoded as UserToken;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  };
}
