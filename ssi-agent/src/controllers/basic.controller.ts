
import { Request, Response } from "express";
import { BaseAgent } from "../agent/baseAgent";


export class BasicController  {

  static async getSchemas(req: Request, res: Response, agent: BaseAgent){
    const { schemaId } = req.query;
    try {
      const result = await agent.getSchema(schemaId as string);
      res.status(200).send(result);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  static async createCredDef(req: Request, res: Response, agent: BaseAgent){
    const { did, schemaId, tag } = req.body;

    if (!did) {
      return res.status(400).send({ error: "did is required" });
    }
    if (!schemaId) {
      return res.status(400).send({ error: "schemaId is required" });
    }

    try {
      const result = await agent.createCredentialDefinition(did, schemaId, tag);
      res.status(200).send(result);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  static async getCredDefs(req: Request, res: Response, agent: BaseAgent){
    const { credentialDefinitionId } = req.query;

    try {
      const result = await agent.getCredentialDefinition(
        credentialDefinitionId as string
      );
      res.status(200).send(result);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

}