
import { Request, Response } from "express";
import { apiFetch } from "../utils/network-call";
import { BaseAgent } from "../agent/baseAgent";


export class CredentialController {

  static async issueCredential(req: Request, res: Response, agent: BaseAgent){
    const { connectionId, name, email, phone } = req.body;
    if (!connectionId) {
      return res.status(400).send({ error: "connectionId is required" });
    }
    if (!agent.credentialDefinitionId) {
      return res
        .status(400)
        .send({ error: "credentialDefinitionId is required" });
    }
    const attributes = [
      {
        name: "name",
        value: `${name ?? "Jhon Doe"}`,
      },
      {
        name: "email",
        value: `${email ?? "jhon@gmail.com"}`,
      },
      {
        name: "phone",
        value: `${phone ?? "017000001"}`,
      }
    ];
    if (!Array.isArray(attributes) || attributes.length === 0) {
      return res
        .status(400)
        .send({ error: "attributes must be an array with at least one element" });
    }

    for (const attribute of attributes) {
      if (!attribute.name || !attribute.value) {
        return res
          .status(400)
          .send({ error: "attributes must have a name and value" });
      }
    }
    try {
      const result = await agent.issueAnonCredsCredential(
        connectionId,
        agent.credentialDefinitionId,
        attributes
      );

      // const revocationRegistryIndex = Math.floor(Math.random() * 99);

      // const result = await agent.issueRevocableCredential(
      //   connectionId,
      //   credentialDefinitionId,
      //   revocationRegistryDefinitionId,
      //   revocationRegistryIndex,
      //   attributes
      // );
      res.status(200).send(result);
    } catch (error: any) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  }

  static async issuedCredential(req: Request, res: Response, agent: BaseAgent) {
    const { credentialId } = req.query;

    try {
      const result = await agent.getIssuedCredenitalRecords(
        credentialId as string
      );
      res.status(200).send(result);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  static async revokeCredential(req: Request, res: Response, agent: BaseAgent) {
    const { credentialId } = req.body;
    try {
      await agent.revokeCredential(credentialId);
      res.status(200).send({message: "Credential revoked successfully"});
    } catch (error: any) {
      console.log('error: ', error);
      res.status(500).send({ error: error.message });
    }
  }
}