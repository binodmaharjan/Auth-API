import { Router } from 'express';
import { LoginUser, RegisterUser, RefetchRefreshToken, SendResetPassword, ForgotPassword, ChangePassword } from '../controllers/AuthController';
import { ConstantRoutes } from '../constants/ConstantRoutes';
import { authorize } from '../middleware/authorize';
import { validateForm } from '../middleware/validate-form';
import { AuthValidator } from '../validators/AuthValidator';

const router = Router();
const { auth } = ConstantRoutes;

router.post(auth.register, validateForm(AuthValidator.registerUser()), RegisterUser);
router.post(auth.login, validateForm(AuthValidator.loginUser()), LoginUser);
router.post(auth.refreshToken, RefetchRefreshToken);
router.post(auth.forgotPassword, validateForm(AuthValidator.forgotPassword()), ForgotPassword);
router.post(auth.resetPassword, validateForm(AuthValidator.resetPassword()), SendResetPassword);
router.post(auth.changePassword, authorize(), validateForm(AuthValidator.changePassword()), ChangePassword);

export default router;
