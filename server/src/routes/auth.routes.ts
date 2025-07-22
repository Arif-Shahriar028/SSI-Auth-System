import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router: Router = Router();

router.get("/check/:email", AuthController.checkEmail);

export default router;
