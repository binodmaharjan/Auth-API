import { Request, Response } from 'express';

export const errorHandler = (err: any, req: Request, res: Response) => {
  if (typeof err === 'string') {
    // custom application error
    const is404 = err.toLowerCase().endsWith('not found');
    const statusCode = is404 ? 404 : 400;
    res.status(statusCode).json({ status: 400, message: err });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({ message: err.message, status: 400 });
    return;
  }

  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'Unauthorized', status: 401 });
    return;
  }

  // default to 500 server error
  return res.status(500).json({ message: err.message, status: 500 });
};
