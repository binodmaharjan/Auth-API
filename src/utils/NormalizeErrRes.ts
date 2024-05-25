import { Response } from 'express';

interface IResp<T> {
  data: T;
  errorType: 'validation' | 'internal' | 'notFound';
  res: Response;
}

export const normalizeErr = <T>(args: IResp<T>) => {
  const { data, errorType, res } = args;

  if (errorType === 'validation') {
    res.status(400).json({
      status: 400,
      error: data,
      message: 'Validation error',
    });
  } else if (errorType === 'internal') {
    res.status(500).json({
      status: 500,
      error: data,
      message: 'Internal server error',
    });
  } else if (errorType === 'notFound') {
    res.status(404).json({
      status: 404,
      error: data,
      message: 'Not found',
    });
  } else if (errorType === 'auth') {
    res.status(401).json({
      status: 401,
      error: data,
      message: 'Unauthorized',
    });
  }
};
