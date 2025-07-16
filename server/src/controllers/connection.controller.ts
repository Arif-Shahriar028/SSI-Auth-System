import {Request, Response} from 'express'
import { apiFetch } from '../network/fetch';
import { createInvitation, getConnectionResult } from '../network/api';
import { getCache, setCache } from '../lib/redis';

export class ConnectionController {
  static async newConnectionInvitation (req: Request, res: Response): Promise<any> {
    try{
      const { email } = req.body;

      const label = process.env.ISSUER_LABEL || 'E-Shop';
      const alias = email;
      const result = await apiFetch(createInvitation, 'POST', {label, alias});

      await setCache(email, result.invitation.id);

      res.status(200).send({success: true, response: result});
    }catch(error){
      res.status(500).send({success: false, error});
    }
  }


  static async getConnectionData(req: Request, res: Response): Promise<void> {
    try{
      const {email} = req.params;

      const oobId = await getCache(email);

      if(oobId){
        const result = await apiFetch(getConnectionResult(oobId.value), 'GET');
        
        res.status(200).send({success: true, response: result});
        return;
      }

      res.status(404).send({success: false, error: "Connection not found"});
    }catch(error){
      res.status(500).send({success: false, error: error});
    }
  }
}