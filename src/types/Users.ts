export type AddUserTypes = {
  userName: string;
  email: string;
  password: string;
  isActive: boolean;
  userTypeId: number;
};

export type UserTypes = AddUserTypes & { id: number };

export type UpdateUserTypes = AddUserTypes;

export type UserRegisterProp = {
  userName: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  verified: boolean;
};
