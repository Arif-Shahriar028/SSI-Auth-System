
import { Request, Response } from "express";
import { BaseAgent } from "../agent/baseAgent";


export class BasicController  {
  static async getWalletDids(req: Request, res: Response, agent: BaseAgent){
    const { method } = req.query;

    try {
      const result = await agent.getWalletDids(method as string);
      res.status(200).send(result);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  static async createSchema(req: Request, res: Response, agent: BaseAgent){
    const { did, name, version, attributes } = req.body;
    const regex = /^\d+\.\d+\.\d+$/;
    if (!Array.isArray(attributes) || attributes.length === 0) {
      return res
        .status(400)
        .send({ error: "attributes must be an array with at least one element" });
    }
    if (!regex.test(version)) {
      return res
        .status(400)
        .send({ error: "version must be in the format x.x.x" });
    }
    if (!did) {
      return res.status(400).send({ error: "did is required" });
    }
    if (!name) {
      return res.status(400).send({ error: "schema name is required" });
    }

    const schema = {
      issuerId: did,
      name,
      version,
      attrNames: attributes,
    };
    try {
      const result = await agent.createSchema(did, schema);
      res.status(200).send(result);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

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