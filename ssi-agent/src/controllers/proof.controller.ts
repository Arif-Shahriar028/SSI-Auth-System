
import { Request, Response } from "express";
import { BaseAgent } from "../agent/baseAgent";
import { AnonCredsRequestedAttribute, AnonCredsRequestedPredicate } from "@credo-ts/anoncreds";


export class ProofController {
  static async sendProofRequest(req: Request, res: Response, agent: BaseAgent){
    const { proofRequestlabel, connectionId, version } = req.body;
    const attributes: Record<string, AnonCredsRequestedAttribute> = {
      name: {
        names: ["name", "email", "phone"],
        restrictions:
          agent.credentialDefinitionId
            ? [{ cred_def_id: agent.credentialDefinitionId }]
            : [],
      },
    };
    const predicates: Record<string, AnonCredsRequestedPredicate> = {
      name: {
        name: "age",
        p_type: ">=",
        p_value: 20,
        restrictions:
        agent.credentialDefinitionId
            ? [{ cred_def_id: agent.credentialDefinitionId }]
            : [],
      },
    };
    if (!proofRequestlabel) {
      return res.status(400).send({ error: "proofRequestlabel is required" });
    }
    if (!connectionId) {
      return res.status(400).send({ error: "connectionId is required" });
    }

    try {
      const result = await agent.sendProofRequest({
        proofRequestlabel,
        connectionId,
        version,
        attributes,
        // predicates,
      });
      res.status(200).send(result);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  static async sendConnLessProofRequest(req: Request, res: Response, agent: BaseAgent){
    const { proofRequestlabel, version } = req.body;
    const attributes: Record<string, AnonCredsRequestedAttribute> = {
      name: {
        names: ["name", "email", "phone"],
        restrictions:
          agent.credentialDefinitionId
            ? [{ cred_def_id: agent.credentialDefinitionId }]
            : [],
      },
    };
    
    if (!proofRequestlabel) {
      return res.status(400).send({ error: "proofRequestlabel is required" });
    }

    try {
      const result = await agent.sendConnLessProofRequest({
        proofRequestlabel,
        version,
        attributes,
        // predicates,
      });
      res.status(200).send({success: true, data: result});
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  static async getProofRecords(req: Request, res: Response, agent: BaseAgent){
    const { proofRecordId } = req.query;

    try {
      const result = await agent.getProofRecords(proofRecordId as string);
      res.status(200).send(result);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  static async getProofRecord(req: Request, res: Response, agent: BaseAgent){
    const {proofRecordId} = req.query;

    console.log('proofrecordid: ', proofRecordId);

    try{
      const result = await agent.getProofRecord(proofRecordId as string);
      res.status(200).send(result);
    }catch (error: any){
      res.status(500).send({ error: error.message });
    }
  }

  static async getProofData(req: Request, res: Response, agent: BaseAgent){
    const { proofRecordId } = req.params;
    if (!proofRecordId) {
      return res.status(400).send({ error: "proofRecordId is required" });
    }

    try {
      const result = await agent.getProofData(proofRecordId);
      res.status(200).send(result);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

}