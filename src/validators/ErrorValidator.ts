import Joi from 'joi';

export const ErrorValidator = {
  addError: (data: any) => {
    const schema = Joi.object({
      errorData: Joi.string().required(),
    });
    return schema.validate(data);
  },
  updateError: (data: any) => {
    const schema = Joi.object({
      id: Joi.number().forbidden(),
    })
      .min(1)
      .unknown(true);
    return schema.validate(data);
  },
};
