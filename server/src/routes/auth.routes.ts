import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { userAuth } from '../middlewares/user.auth';

const router: Router = Router();

router.get("/check/:email", AuthController.checkEmail);
router.get("/verify", userAuth, AuthController.verifyUser);

export default router;
