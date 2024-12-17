import { ErrorResponse } from "../../models";
import { Validation } from "../../utils";
import { ChatBotValidation } from "./chatBotValidation";
import axios from "axios";

export class ChatBotService {
  static async getResponseFromBot(data: any): Promise<any> {
    // const validateData = Validation.validate(ChatBotValidation.CHAT_BOT, data);

    // if (!validateData.messages) {
    //   throw new ErrorResponse(
    //     "Message is required",
    //     400,
    //     ["message"],
    //     "REQUIRED"
    //   );
    // }
    const response = await axios.post(process.env.LLM_URL!, {
        model: process.env.LLM_MODEL!,
        messages: data,
        stream: false,
    });
    // return response;
    return response.data;
  }
}