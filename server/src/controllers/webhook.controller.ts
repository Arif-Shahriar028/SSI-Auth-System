import { Request, Response } from "express";
import WebSocketService from "../services/websocket.service";
import { getCache } from "../lib/redis";
import { apiFetch } from "../network/fetch";
import { getProofData } from "../network/api";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.schema";

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

          const token = jwt.sign(
            { email, name, phone },
            process.env.JWT_SECRET || 'my-secret-key',
            { expiresIn: '24h' }
          );

          WebSocketService.getInstance().notifyProofRequestUpdate(email, {
            success: true,  
            message: 'proof verified',
            credentials: {
              email,
              name,
              phone,
              token
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

        let email: string = "";
        let name: string = "";
        let phone: string = "";

        credentialAttributes.map((attribute: {name: string, value: string})=>{
          if(attribute.name == "email"){
            email = attribute.value
          }
          else if(attribute.name == "name"){
            name = attribute.value;
          }
          else if(attribute.name == "phone"){
            phone = attribute.value; 
          }
        })

        const user = await User.findOne({email});
        if(user){
          user.issuedCredential = true;
          await user.save();
        }

        const token = jwt.sign(
          { email, name, phone },
          process.env.JWT_SECRET || 'my-secret-key',
          { expiresIn: '24h' }
        );

        WebSocketService.getInstance().notifyCredentialUpdate(email, {
          success: true,  
          message: 'credential accepted',
          credentials: {
            email,
            name,
            phone,
            token
          }
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