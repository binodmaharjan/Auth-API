import { Request, Response, NextFunction } from 'express';

export const rateLimiter = () => async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.socket.remoteAddress;
  console.log(ip);
  // const [response] = await redisClient.multi().incr(ip).expire(ip, secondsLimit).exec();
  // if(response[1] > limitAmount) {
  //   res.status(429).json({ message: 'Too many requests' });
  //   return;
  // }
  next();
};
