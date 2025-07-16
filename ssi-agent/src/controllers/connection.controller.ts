
import { Request, Response } from "express";
import { BaseAgent } from "../agent/baseAgent";


export class ConnectionController  {
  static async createInvitation(req: Request, res: Response, agent: BaseAgent){
    const { label, alias, domain } = req.body;
    const agent_domain = process.env.ISSUER_AGENT_PUBLIC_ENDPOINT;
    try {
      const result = await agent.createInvitation({ label, alias, domain: agent_domain });
      res.status(200).send(result);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  static async getConnection(req: Request, res: Response, agent: BaseAgent){
    const { connectionId, outOfBandId } = req.query;
    try {
      const result = await agent.getConnections({
        connectionId: connectionId as string,
        outOfBandId: outOfBandId as string,
      });
      res.status(200).send(result);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }
}