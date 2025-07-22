import { Request, Response } from "express";
import { apiFetch } from "../network/fetch";
import { getConnectionResult, sendConnLessProofRequest, sendProofRequest } from "../network/api";
import * as QRCode from 'qrcode-terminal';
import { User } from "../models/user.schema";

export class ProofController {
  static async connLessProofRequest(req: Request, res: Response): Promise<void> {
    try{
      const result = await apiFetch(sendConnLessProofRequest, "POST", {proofRequestlabel: "Identity verification", version: "1.0.0"});
      
      // QRCode.generate(result.data, { small: true }, (qrcode: string) => {
      //   console.log(qrcode);
      // });

      res.status(201).json({success: true, data: result});
    }catch(e){
      res.status(500).json({success: false, error: e});
    }
  }

  static async proofRequest(req: Request, res: Response): Promise<void> {
    try{
      const {email} = req.body;

      const user = await User.findOne({email});
      if(!user){
        res.status(404).send({ 
          success: false, 
          error: 'No user found of this email' 
        });
        return;
      }

      const oobId = user.oobId;
      
      const response = await apiFetch(getConnectionResult(oobId), 'GET');
      if(!response ){
        res.status(404).send({ 
          success: false, 
          error: 'No completed connection found for this email' 
        });
        return;
      }

      const connectionId = response[0].id;
            
      if(!connectionId){
        res.status(400).json({success: false, error: "connection id not found"});
        return;
      }

      const result = await apiFetch(sendProofRequest, "POST", {proofRequestlabel: "Identity verification", connectionId, version: "1.0.0"});

      res.status(201).json({success: true, data: result});
    }catch(e){
      res.status(500).json({success: false, error: e});
    }
  }
}