import { Request, Response, NextFunction } from 'express';

export const verifyRole = async (permission: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.params.role;
    if (permission.includes(userRole)) {
      next();
    } else {
      return res.status(401).json({ message: 'You dont have permission', status: 401 });
    }
  };
};
