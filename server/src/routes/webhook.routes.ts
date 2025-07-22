import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';

const router: Router = Router();

//todo: add apiKeyAuth here

// student specific
router.post('/proof-state', WebhookController.handleProofState);
router.post('/credential-state', WebhookController.handleCredentialState);
router.post('/connection-state', WebhookController.handleConnectionState);

// admin specific
export default router;