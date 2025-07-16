import {Request, Response} from 'express';
import { getCache } from '../lib/redis';
import { getConnectionResult, issueCredential } from '../network/api';
import { apiFetch } from '../network/fetch';

export class CredentialController{
  static async issueCredential(req: Request, res: Response): Promise<void>{
    try{
      const {email, name, phone} = req.body;

      console.log('req.body: ', JSON.stringify(req.body));

      // Get connection data for this email
      const oobId = await getCache(email);
      if (!oobId.value) {
        res.status(404).send({ 
          success: false, 
          error: 'No connection found for this email' 
        });
        return;
      }

      console.log('oobid: ', oobId.value);

      const response = await apiFetch(getConnectionResult(oobId.value), 'GET');
      if(!response ){
        res.status(404).send({ 
          success: false, 
          error: 'No completed connection found for this email' 
        });
        return;
      }

      const connectionId = response[0].id;

      console.log('connectionId: ', connectionId);

      // Issue Credential
      const issueResponse = await apiFetch(issueCredential, 'POST', {connectionId, name, email, phone});

      console.log('issueResponse: ', JSON.stringify(issueResponse));
      
      if(issueResponse.state === "offer-sent") {
        
        // send update to student by websocket
        res.status(200).send({
          success: true,
          message: 'Credential issued successfully'
        });
      } else {
        res.status(400).send({
          success: false,
          error: 'Failed to issue credential'
        });
      }

    }catch(error){
      res.status(500).send({
        success: false,
        error: (error as Error).message
      });
    }
  }
}