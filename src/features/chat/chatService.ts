import { User } from "@prisma/client";
import { ChatWithRandomStrangerRequest, ChatRoom } from "./chatModel";
import { Socket } from "socket.io";

export class ChatService {
  private users: User[] = [];
  private rooms: Map<string, ChatRoom> = new Map();
  private userConnections: Map<string, string[]> = new Map();
  private roomUsers: Map<string, { user1: User, user2: User }> = new Map();

  // Add user to list of available users
  public addUser(socket: Socket): void {
    const user = socket.data.user;
    socket.join(user.username);
    user.isOnline = true;
    user.availability = "available";
    console.log("User added:", user.username); // Logging user addition
    this.users.push(user);
    this.tryMatchUser(socket);
  }

  public removeUser(socket: Socket): void {
    const user = socket.data.user;
    console.log("Removing user:", user.username); // Logging user removal
    // socket.emit("partnerDisconnected", "Your chat partner has disconnected.");
    this.users = this.users.filter((u) => u.user_id !== user.user_id);
  }
  // when user disconnects from the chat room, remove the user from the list of available users and remove the other user from the chat room
  // Update disconnectUser function to handle partner disconnection
//   public disconnectUser(socket: Socket): void {
//     const user = socket.data.user;
//     const room = Array.from(socket.rooms)[0]; // Assuming the room ID is the second entry
//     if (room) {
//         const roomUsers = this.roomUsers.get(room);
//         if (roomUsers) {
//             const otherUser = roomUsers.user1.user_id === user.user_id ? roomUsers.user2 : roomUsers.user1;
            
//             // Emit an event to the other user that their partner disconnected
//             if (otherUser) {
//                 socket.to(otherUser.username).emit("partnerDisconnected", "Your chat partner has disconnected.");
                
//                 // Mark the other user as available to be matched again
//                 otherUser.availability = "available";
//                 const otherUserSocket = socket.nsp.sockets.get(otherUser.username);
//                 if (otherUserSocket) {
//                     this.tryMatchUser(otherUserSocket); // Retry match for other user
//                 }
//             }
            
//             socket.leave(room);
//             this.roomUsers.delete(room);
//         }
//     }
//   console.log("User disconnected:", user.username);
// }


  public tryMatchUser(socket: Socket): void {
    const user = socket.data.user;
    console.log("list of mapping usernames", this.users.map(u => u.username)); // Logging all users
    console.log("Current user:", user.username); // Logging current user
    
    const availableUsers = this.users.find(u => 
      u.user_id !== user.user_id && u.availability === "available" 
    );
    console.log("Available user found:", availableUsers?.username);
    if (availableUsers) {
      this.connectUsers(socket, availableUsers);
      socket.emit("matching", "Connected to a random chat room!");
    } else {
      socket.emit("waiting", "Looking for another user...");
    }
  }

  private hasMatchedBefore(user1: string, user2: string): boolean {
    const previousMatches = this.userConnections.get(user1) || [];
    return previousMatches.includes(user2);
  }

  private connectUsers(socket: Socket, targetUser: User): void {
    const user = socket.data.user;
    
    const room_id = `${user.username}-${targetUser.username}`;
    socket.leave(user.username);
    socket.join(room_id);
    socket.to(targetUser.username).emit("joinRoom", room_id, "Connected to a random chat room!");
    console.log(`Notifying ${targetUser.username} to join room ${room_id}`);

    user.availability = "busy";
    targetUser.availability = "busy";
    console.log("Room created:", room_id);
    console.log("User availability updated:", user.availability, "and", targetUser.availability);

    // Track that they have matched
    this.addConnection(user.user_id, targetUser.user_id);
    this.addConnection(targetUser.user_id, user.user_id);
  }

  private addConnection(userId: string, targetUserId: string): void {
    const connections = this.userConnections.get(userId) || [];
    connections.push(targetUserId);
    this.userConnections.set(userId, connections);
  }

  // Handle sending message
  public sendMessage(socket: Socket, message: string): void {
    const room = Array.from(socket.rooms)[1];
    if (room) {
      console.log(`Nama room: ${room}`)
      socket.to(room).emit("receiveMessage", {
        username: socket.data.user.username,
        message: message,
      });
    }
  }

  public joinRoom(socket: Socket, room_id: string): void {
    socket.leave(socket.data.user.username);
    socket.join(room_id);
    console.log(socket.data.user.username, "joined room:", room_id);
  }
}