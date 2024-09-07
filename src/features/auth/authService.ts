import { prisma } from "../../databases";
import { comparePassword, Validation, hashPassword } from "../../utils";
import { ErrorResponse } from "../../models";
import { AuthValidation } from "./authValidation";
import {
  LoginRequest,
  LoginResponse,
  CurrentLoggedInUserResponse,
  RegisterRequest,
  RegisterResponse,
} from "./authModel";
import jwt from "jsonwebtoken";

export class AuthService {
  static async login(data: LoginRequest): Promise<LoginResponse> {
    const validateData = Validation.validate(AuthValidation.LOGIN, data);

    if (!validateData.username_or_phone_number) {
      throw new ErrorResponse(
        "Email or phone number is required",
        400,
        ["email", "phone_number"],
        "REQUIRED"
      );
    }

    const userData = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: validateData.username_or_phone_number,
          },
          {
            phone_number: validateData.username_or_phone_number,
          },
        ],
        deleted_at: null,
      },
      select: {
        user_id: true,
        password: true,
      },
    });

    if (!userData) {
      throw new ErrorResponse(
        "Invalid Email or Phone Number",
        401,
        ["email", "password"],
        "INVALID_username_or_phone_number"
      );
    }

    const isPasswordMatch = await comparePassword(
      validateData.password,
      userData.password
    );

    if (!isPasswordMatch) {
      throw new ErrorResponse(
        "Invalid Password",
        401,
        ["email", "password"],
        "INVALID_PASSWORD"
      );
    }

    const token = jwt.sign(
      {
        user_id: userData.user_id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    return {
      token,
    };
  }

  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    const validateData = Validation.validate(AuthValidation.REGISTER, data);

    const hashingPassword = await hashPassword(validateData.password);

    const userData = await prisma.user.create({
      data: {
        username: validateData.username,
        full_name: validateData.full_name,
        phone_number: validateData.phone_number,
        password: hashingPassword,
        availability: "available",
      },
      select: {
        user_id: true,
        username: true,
        full_name: true,
        phone_number: true,
      },
    });

    return userData;
  }

  static async currentLoggedIn(
    user_id: string
  ): Promise<CurrentLoggedInUserResponse> {
    const userData = await prisma.user.findUnique({
      where: {
        user_id,
      },
      select: {
        user_id: true,
        username: true,
        full_name: true,
        phone_number: true,
      },
    });

    if (!userData) {
      throw new ErrorResponse(
        "User not found",
        404,
        ["user_id"],
        "USER_NOT_FOUND"
      );
    }

    return userData;
  }
}
