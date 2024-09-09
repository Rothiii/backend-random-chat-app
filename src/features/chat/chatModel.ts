import { User } from "@prisma/client";

export type ChatWithRandomStrangerRequest = {
  user_id: string;
  message: string;
};

export type ChatRoom = {
  room_id: string;
  users: User[];
}