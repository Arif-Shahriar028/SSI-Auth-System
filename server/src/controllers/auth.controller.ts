import { Request, Response } from 'express';
import { User } from '../models/user.schema';
import { Error } from 'mongoose';
import { apiFetch } from '../network/fetch';
import { getConnectionResult, issueCredential } from '../network/api';
import { AuthRequest } from '../middlewares/user.auth';
export class AuthController {
  static async checkEmail(req: Request, res: Response): Promise<void> {
    try{
      const {email} = req.params;

      if(!email){
        res.status(400).send({success: false, error: "email not provided"});
        return;
      }

      const result = await User.findOne({email});

      if(!result){
        res.status(404).send({success: false, error: "user not found"});
        return;
      }

      const oobId = result.oobId;

      const response = await apiFetch(getConnectionResult(oobId), 'GET');

      console.log('email check response: ', JSON.stringify(response));
      
      if(!response || response[0].state !== "completed"){
        res.status(404).send({ 
          success: false, 
          error: 'No completed connection found for this email' 
        });
        return;
      }

      res.status(200).send({success: true, data:{
        email: result.email, 
        oobId: result.oobId, 
        sentCredential: result.sentCredential, 
        issuedCredential: result.issuedCredential
      }});

    }catch(error){
      res.status(500).send({success: false, error});
    }
  }

  static async verifyUser(req: AuthRequest, res: Response): Promise<any> {
    try{
      const user = req.user;
      const token = req.token;

      res.status(200).json({success: true, user});
    }catch (error){
      res.status(400).json({success: false, error})
    }
  }
}