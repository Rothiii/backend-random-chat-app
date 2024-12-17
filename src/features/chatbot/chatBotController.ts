import { Request, Response, NextFunction } from 'express';
import { ChatBotService } from './chatBotService';

export class ChatBotController {
  static async getResponseFromBot(req: Request, res: Response, next: NextFunction) {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format" });
      }

      const data = await ChatBotService.getResponseFromBot(
        messages,
      );

      return res.status(200).json({
        success: true,
        data: data,
        message: 'chat successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}