import { Request, Response } from "express";
import WebSocketService from "../services/websocket.service";
import { getCache } from "../lib/redis";

export class WebhookController {
  // static async handleProofState(req: Request, res: Response): Promise<void> {
  //   try{
  //     const content = req.body;
  //     if(content.type === "proof-state"){
  //       const proofRecordId = content.payload.id;

  //       const existingProofRecord = await ProofRequest.findOne({proofRecordId});

  //       if(existingProofRecord){
  //         // If state: done and verified, then save presentation
  //         /**
  //          * call savePresentation function from presentation controller
  //          * pass { email, proofRecordId } to savePresentation as 
  //          */
  //         if(content.payload.state == 'done' && content.payload.isVerified){
  //           const result = await PresentationController.savePresentation(existingProofRecord.email, proofRecordId, existingProofRecord.credentialId, existingProofRecord.revocationStatusId);
  //           if(result.success){
  //             existingProofRecord.presentationSaved = true;
  //             existingProofRecord.presentationId = result.presentationId;
  //           }
  //         }

  //         existingProofRecord.status = content.payload.state;
  //         existingProofRecord.isVerified = content.payload.isVerified ? 'verified': 'not-verified';
  //         existingProofRecord.createdAt = new Date();

  //         await existingProofRecord.save();

  //         WebSocketService.getInstance().notifyProofRequestUpdate(process.env.ADMIN_EMAIL || 'admin@bracu.ac.bd', {
  //           message: 'Proof state updated'
  //         })

  //         WebSocketService.getInstance().notifyProofRequestUpdate(existingProofRecord.email, {
  //           message: 'Proof state updated'
  //         })

  //         res.status(200).send({success: true})
  //         return;
  //       }
  //     }
  //     res.status(401).send({success: false});
  //   }catch(error){
  //     console.log('error: ', error);
  //     res.status(500).send({success: false});
  //   }
  // }

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