import { object, string, boolean, ref } from 'yup';

export const AuthValidator = {
  registerUser: () => {
    const schema = object({
      userName: string().required(),
      email: string().required(),
      password: string().required().min(5).max(255),
      role: string().required(),
      isActive: boolean().required(),
    });
    return schema;
  },

  loginUser: () => {
    const schema = object({
      email: string().required(),
      password: string().required().min(5).max(255),
    });
    return schema;
  },

  forgotPassword: () => {
    const schema = object({
      email: string().required(),
    });
    return schema;
  },
  resetPassword: () => {
    const schema = object({
      password: string().required().min(5).max(255),
    });
    return schema;
  },

  changePassword: () => {
    const schema = object({
      oldPassword: string().required().label('Required'),
      password: string().required().min(5).max(255).label('Password'),
      confirmPassword: string()
        .oneOf([ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    }).unknown(true);
    return schema;
  },
};
