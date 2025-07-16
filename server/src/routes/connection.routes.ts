import { Router } from "express";
import { ConnectionController } from "../controllers/connection.controller";

const router: Router = Router();

router.post("/create-invitation", ConnectionController.newConnectionInvitation);
router.get("/:email", ConnectionController.getConnectionData);

export default router;