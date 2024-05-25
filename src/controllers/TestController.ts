import { Request, Response } from 'express';

export const getAllTests = async (req: Request, res: Response) => {
  try {
    res.send({ message: 'All tests' });
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
};
