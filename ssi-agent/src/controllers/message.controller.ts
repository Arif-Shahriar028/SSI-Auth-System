
import { Request, Response } from "express";
import { BaseAgent } from "../agent/baseAgent";


export class MessageController  {
  static async sendMessage(req: Request, res: Response, agent: BaseAgent){
    const { connectionId, message } = req.body;
    if (!connectionId) {
      return res.status(400).send({ error: "connectionId is required" });
    }
    if (!message) {
      return res.status(400).send({ error: "message is required" });
    }
    try {
      const result = await agent.sendMessage(connectionId, message);
      res.status(200).send(result);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }
}