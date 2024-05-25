import { Request, Response } from 'express';
import { normalizeErr } from '../utils/NormalizeErrRes';
import { normalizeResp } from '../utils/NormalizeResp';
import { authenticate, hash, randomTokenString, refreshToken, register } from '../utils/AuthUtils';
import { Users } from '../models/users';
import { UserTypes } from '../types/Users';
import { ResetPassword } from '../models/resetpassword';
import moment from 'moment';
import { NotFoundError, ValidationError } from '../errors/error';
import { ChangePwTypes } from '../types/ChangePwProps';
import bcrypt from 'bcryptjs';
import { Email } from '../libs/email/email';
import { Op } from 'sequelize';
import { AuthRequest } from '../middleware/auth-request';

export const LoginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const account = await authenticate({ email, password });
    normalizeResp({ data: account, responseType: 'get', res });
  } catch (error: any) {
    normalizeErr({ data: error.message, errorType: error.errorType, res });
  }
};

export const RegisterUser = async (req: Request, res: Response) => {
  try {
    const account = await register(req.body);
    normalizeResp({
      data: 'Registration successful, please check your email for verification instructions',
      responseType: 'post',
      res,
    });

    const url = `${process.env.HOST_URL}/verify/${account.verificationToken}`;

    new Email({ email: account.email, firstName: account.userName, lastName: '', password: '' }, url).sendUserCreate();
  } catch (error: any) {
    normalizeErr({ data: error.message, errorType: 'notFound', res });
  }
};

export const RefetchRefreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const ip = req.ip as string;
    const account = await refreshToken({ token, ipAddress: ip });
    normalizeResp({ data: account, responseType: 'get', res });
  } catch (error: any) {
    console.log(error);

    normalizeErr({ data: error.message, errorType: 'notFound', res });
  }
};

//--------- Resetting and forgot password -----------

export const ForgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new ValidationError("Email doesn't exist");
    }
    const resetToken = randomTokenString();
    await ResetPassword.create({
      email: email,
      token: resetToken,
      expiredAt: moment().add(3, 'days'),
    });

    //send Email
    const url = `${process.env.HOST_URL}/resetpassword/${resetToken}`;
    if (user) await new Email({ email: email, firstName: user.userName, lastName: '', password: '' }, url).sendPasswordResetToken();

    normalizeResp({
      data: 'You will receive a reset email if user with that email exist',
      responseType: 'post',
      res,
    });
  } catch (error: any) {
    normalizeErr({ data: error.message, errorType: error.errorType, res });
  }
};

//Reset password
export const SendResetPassword = async (req: Request, res: Response) => {
  try {
    const token = req.params.resetToken;
    const { password } = req.body as UserTypes;
    const resetPassword = await ResetPassword.findOne({
      where: {
        token: token,
        expiredAt: {
          [Op.gt]: new Date(),
        },
      },
      order: [['id', 'DESC']],
    });

    if (!resetPassword) {
      throw new ValidationError('Token is invalid');
    }

    const user = await Users.findOne({
      where: { email: resetPassword?.email },
    });
    if (!user) {
      throw new NotFoundError('Users not found');
    }

    if (user) {
      user.password = hash(password);
      await user.save();
    }
    normalizeResp({
      data: 'Your Password has been changed successfully',
      responseType: 'post',
      res,
    });
  } catch (error: any) {
    normalizeErr({ data: error.message, errorType: error.errorType, res });
  }
};

export const ChangePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, password } = req.body as ChangePwTypes;
    const user = await Users.findByPk(req.userId);
    if (!user) {
      throw new ValidationError("Password doesn't exist");
    }

    const bPssword = await bcrypt.compare(oldPassword, user.password);
    if (!bPssword) {
      throw new ValidationError("Password doesn't exist");
    }

    user.password = hash(password);
    user.save();

    normalizeResp({
      data: 'Your password is changed.',
      responseType: 'post',
      res,
    });
  } catch (error: any) {
    normalizeErr({ data: error.message, errorType: error.errorType, res });
  }
};
