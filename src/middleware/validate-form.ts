import { Request, Response, NextFunction } from 'express';
import { ObjectSchema, ValidationError } from 'yup';

export const validateForm = (schema: ObjectSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: true });
      next();
    } catch (error: any) {
      res.status(400).json({
        status: 400,
        error: (error as ValidationError).errors[0],
        message: 'Validation error',
      });
      return;
    }
  };
};
