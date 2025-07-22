import { Router } from "express";
import { ConnectionController } from "../controllers/connection.controller";

const router: Router = Router();

router.post("/create-invitation", ConnectionController.newConnectionInvitation);
router.get("/:email", ConnectionController.getConnectionData);
router.get("/id/:email", ConnectionController.getConnectionId);

export default router;