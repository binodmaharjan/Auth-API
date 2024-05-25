import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Users } from '../models/users';
import { RefreshToken } from '../models/refreshtoken';
import { ValidationError } from '../errors/error';
import { Op } from 'sequelize';
import { UserRegisterProp } from '../types/Users';

// Auth portion when logining in
export const authenticate = async ({ email, password }: { email: string; password: string }) => {
  const user = await Users.findOne({
    where: { email: (email as string).toLowerCase() },
  });
  const isPasswordValid = user && (await bcrypt.compare(password, user.password));
  if (!user || !isPasswordValid) {
    throw new ValidationError('Email or password is incorrect');
  } else {
    if (!user.isActive) {
      throw new ValidationError('User is not active');
    }

    // Auth success so generate a jwt token and refresh token
    const jwtToken = generateJwtToken(user);
    const refreshToken = await generateRefreshToken(user);

    // return data
    return {
      ...basicDetails(user),
      role: user.role,
      token: jwtToken,
      refresh: refreshToken,
    };
  }
};

// refetching refresh token
export const refreshToken = async ({ token, ipAddress }: { token: string; ipAddress: string }) => {
  const refreshToken = await getRefreshToken(token);
  const { user } = refreshToken;

  // replace old refresh token with a new one and save
  const newRefreshToken = await generateRefreshToken(user);
  refreshToken.revoked = new Date();
  refreshToken.revokedByIp = ipAddress;
  // refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  await newRefreshToken.save();

  // generate new jwt
  const jwtToken = generateJwtToken(user);

  // return basic details and tokens
  return {
    ...basicDetails(user),
    jwtToken,
    refreshToken: newRefreshToken.token,
  };
};

// Create a new user
export const register = async (params: UserRegisterProp) => {
  try {
    const existedUser = await Users.findOne({
      where: {
        [Op.or]: [{ email: params.email }, { userName: params.userName }],
      },
    });
    if (existedUser) {
      throw new ValidationError('Username or email is already taken');
    }
    params.verified = false;
    const account = await Users.create(params);
    account.verificationToken = randomTokenString();
    account.password = hash(params.password);
    await account.save();
    return account;
  } catch (error: any) {
    console.debug(error);
    throw new ValidationError(error.message);
  }
};

const generateJwtToken = (account: Users) => {
  // create a jwt token containing the account id that expires in 15 minutes
  return jwt.sign({ account }, process.env.JWT_SECRET!, {
    expiresIn: '15m',
  });
};

export const randomTokenString = () => {
  return crypto.randomBytes(40).toString('hex');
};

const generateRefreshToken = async (account: Users) => {
  // create a refresh token that expires in 7 days
  return await RefreshToken.create({
    userId: account.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    isExpired: false,
    isActive: true,
    createdByIp: '127.0.0.1',
  });
};

const basicDetails = (account: Users) => {
  return {
    id: account.id,
    email: account.email,
  };
};

const getRefreshToken = async (token: string) => {
  const refreshToken = await RefreshToken.findOne({
    where: {
      token: token,
    },
    include: [Users],
  });
  if (!refreshToken || !refreshToken.isActive) throw new Error('Invalid token');
  return refreshToken;
};

// Hash password
export const hash = (password: string) => {
  return bcrypt.hashSync(password, 10);
};
