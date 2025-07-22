import { Request, Response } from "express";
import WebSocketService from "../services/websocket.service";
import { getCache } from "../lib/redis";
import { apiFetch } from "../network/fetch";
import { getProofData } from "../network/api";

export class WebhookController {
  static async handleProofState(req: Request, res: Response): Promise<void> {
    try{
      const content = req.body;
      if(content.type === "proof-state"){
        const proofRecordId = content.payload.id;

        const proofRecord = await apiFetch(getProofData(proofRecordId), 'GET');

        if(proofRecord){
          const email = proofRecord.presentation.anoncreds.requested_proof.revealed_attr_groups.name.values.email.raw;
          const name = proofRecord.presentation.anoncreds.requested_proof.revealed_attr_groups.name.values.name.raw;
          const phone = proofRecord.presentation.anoncreds.requested_proof.revealed_attr_groups.name.values.phone.raw;
          
          console.log('proof data: ', email, name, phone);
          WebSocketService.getInstance().notifyProofRequestUpdate(email, {
            success: true,  
            message: 'proof verified',
            credentials: {
              email,
              name,
              phone
            }
          });
            
          res.status(200).send({success: true})
          return;
        }
        
      }

      res.status(401).send({success: false});
    }catch(error){
      console.log('error: ', error);
      res.status(500).send({success: false});
    }
  }

  static async handleCredentialState(req: Request, res: Response): Promise<void> {
    try{
      const content = req.body;
      if(content.type === "credential-state"){
        const credentialAttributes = content.payload.credentialAttributes;

        let email: string = ""
        credentialAttributes.map((attribute: {name: string, value: string})=>{
          if(attribute.name == "email"){
            email = attribute.value
          }
        })

        console.log('------->>>>> credential accepted by: ', email);

        WebSocketService.getInstance().notifyCredentialUpdate(email, {
          success: true,  
          message: 'credential accepted'
        });

        res.status(200).send({success: true})
        return;
      }
      res.status(401).send({success: false});
    }catch(error){
      console.log('error: ', error);
      res.status(500).send({success: false});
    }
  }

  static async handleConnectionState(req: Request, res: Response): Promise<void> {
    try{

      const content = req.body;

      if(content.type == "connection-state"){
        const email = content.payload.alias;

        console.log('-------->>>>>> connection created by: ', email);

        WebSocketService.getInstance().notifyConnectionUpdate(email, {
          success: true,
          message: "connection established"
        });

        res.status(200).send({success: true});
        return;
      }

      res.status(401).send({success: false});
    }catch(error){
      console.log('error: ', error);
      res.status(500).send({success: false});
    }
  }
}