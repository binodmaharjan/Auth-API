import { expressjwt as jwt } from 'express-jwt';

import { Response, NextFunction } from 'express';
import { Users } from '../models/users';
import { RefreshToken } from '../models/refreshtoken';

// const shouldMockReturn = process.env.NODE_ENV === "test";

export const authorize = () => {
  return [
    // authenticate JWT token and attach user to request object (req.auth)
    jwt({ secret: process.env.JWT_SECRET!, algorithms: ['HS256'] }),

    async (req: any, res: Response, next: NextFunction) => {
      const user = req.auth.account;
      const account = await Users.findByPk(user?.id);

      if (!account) {
        // account no longer exists or role not authorized
        return res.status(401).json({ message: 'Unauthorized', status: 401 });
      }

      const refreshTokens = await RefreshToken.findOne({
        where: { userId: account.id },
      });

      if (!refreshTokens) {
        return res.status(401).json({ message: 'Unauthorized', status: 401 });
      }

      user.ownsToken = refreshTokens.token;
      req.userId = account.id;
      next();
    },
  ];
};
