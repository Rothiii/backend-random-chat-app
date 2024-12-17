import z, { ZodType } from "zod";

export class ChatBotValidation {
  static readonly CHAT_BOT: ZodType = z.object({
    messages: z.string().array(),
  });
}