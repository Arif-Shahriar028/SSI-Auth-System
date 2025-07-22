import {Request, Response} from 'express'
import { apiFetch } from '../network/fetch';
import { createInvitation, getConnectionResult } from '../network/api';
import { getCache, setCache } from '../lib/redis';
import { User } from '../models/user.schema';

export class ConnectionController {
  static async newConnectionInvitation (req: Request, res: Response): Promise<any> {
    try{
      const { email } = req.body;

      const label = process.env.ISSUER_LABEL || 'E-Shop';
      const alias = email;
      const result = await apiFetch(createInvitation, 'POST', {label, alias});

      await setCache(`oobid-${email}`, result.invitation.id, 300);

      const user = new User({
        email,
        oobId: result.invitation.id
      })

      await user.save();

      res.status(200).send({success: true, data: result});
    }catch(error){
      res.status(500).send({success: false, error});
    }
  }


  static async getConnectionData(req: Request, res: Response): Promise<void> {
    try{
      const {email} = req.params;

      const oobId = await getCache(`oobid-${email}`);

      if(oobId){
        const result = await apiFetch(getConnectionResult(oobId.value), 'GET');
        
        res.status(200).send({success: true, data: result});
        return;
      }

      res.status(404).send({success: false, error: "Connection not found"});
    }catch(error){
      res.status(500).send({success: false, error: error});
    }
  }

  static async getConnectionId(req: Request, res: Response): Promise<void> {
    try{
      const {email} = req.params;

      const oobId = await getCache(`oobid-${email}`);

      if(oobId){
        const result = await apiFetch(getConnectionResult(oobId.value), 'GET');

        if(result && result.length > 0){
          res.status(200).send({success: true, data: {
            connectionId: result[0].id
          }});
          return;
        }
      }

      res.status(404).send({success: false, error: "Connection not found"});
    }catch(error){
      res.status(500).send({success: false, error: error});
    }
  }
}