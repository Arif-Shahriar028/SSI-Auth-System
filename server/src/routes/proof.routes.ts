import { Router } from "express";
import { ProofController } from "../controllers/proof.controller";

const router: Router = Router();

router.post("/conn-less-proof-req", ProofController.connLessProofRequest);
router.post("/send-request", ProofController.proofRequest);

export default router;