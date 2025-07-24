import express from 'express';

import { BaseAgent } from '../agent/baseAgent';
import { ConnectionController } from '../controllers/connection.controller';
import { CredentialController } from '../controllers/credential.controller';
import { ProofController } from '../controllers/proof.controller';
import { BasicController } from '../controllers/basic.controller';

const router = express.Router();


// Agent's Basic functionality 
export default function createRoute(agent: BaseAgent) {
  
  // Connection routes
  router.post('/create-invitation', (req, res) => ConnectionController.createInvitation(req, res, agent));
  router.get('/connections', (req, res) => ConnectionController.getConnection(req, res, agent));

  // Credential routes
  router.post('/issue-credential', (req, res) => CredentialController.issueCredential(req, res, agent));
  router.get('/issued-credentials', (req, res) => CredentialController.issuedCredential(req, res, agent));

  // Proof-request routes
  router.post('/send-proof-request', (req, res) => ProofController.sendProofRequest(req, res, agent));
  router.post('/send-conn-less-proof-request', (req, res) => ProofController.sendConnLessProofRequest(req, res, agent));
  router.get('/proof-records', (req, res) => ProofController.getProofRecords(req, res, agent));
  router.get('/proof-record', (req, res) => ProofController.getProofRecord(req, res, agent));
  router.get('/proof-data/:proofRecordId', (req, res) => ProofController.getProofData(req, res, agent));

  return router;
}

