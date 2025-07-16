import { Router } from "express";
import { CredentialController } from "../controllers/credential.controller";

const router: Router = Router();

router.post("/issue", CredentialController.issueCredential);

export default router;