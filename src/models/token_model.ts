import { JwtPayload } from "jsonwebtoken";

export interface UserToken extends JwtPayload {
  user_id: string;
  username: string;
  full_name: string;
  phone_number: string;
  availability: string;
}