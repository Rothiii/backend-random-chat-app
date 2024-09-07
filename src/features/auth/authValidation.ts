import { z, ZodType } from "zod";

export class AuthValidation {
  static readonly LOGIN: ZodType = z.object({
    username_or_phone_number: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(6, "Username must be at least 6 characters"),
    full_name: z.string(),
    phone_number: z
      .string()
      .min(9, "Phone number must be at least 9 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });
}
