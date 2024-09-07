import { Request, Response, NextFunction } from "express";
import { AuthService } from "./authService";
import { UserToken } from "../../models";

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username_or_phone_number, password } = req.body;
      const token = await AuthService.login({
        username_or_phone_number,
        password,
      });
      return res.status(200).json({
        success: true,
        data: { ...token },
        message: "login successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, full_name, phone_number, password } = req.body;
      const data = await AuthService.register({
        username,
        full_name,
        phone_number,
        password,
      });
      return res.status(201).json({
        success: true,
        data: { ...data },
        message: "User registered successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async currentLoggedIn(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = res.locals.user as UserToken;
      const data = await AuthService.currentLoggedIn(user.user_id);
      return res.status(200).json({
        success: true,
        data: { ...data },
        message: "Current logged in user",
      });
    } catch (error) {
      next(error);
    }
  }
}
