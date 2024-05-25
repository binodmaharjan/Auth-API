import Joi from 'joi';

export const UsersValidator = {
  addUsers: (data: any) => {
    const schema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      password: Joi.string().required(),
      bloodGroup: Joi.string().required(),
      gender: Joi.string().required(),
      status: Joi.string().required(),
      userType: Joi.string().required(),
      address: Joi.string().required(),
      userName: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      dateOfBirth: Joi.string().required(),
      userroleId: Joi.required(),
    });
    return schema.validate(data);
  },
  updateUsers: (data: any) => {
    const schema = Joi.object({
      id: Joi.number().forbidden(),
    })
      .min(1)
      .unknown(true);
    return schema.validate(data);
  },
};
