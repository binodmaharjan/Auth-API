import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize-typescript';
import { RefreshToken } from '../models/refreshtoken';
import { Users } from '../models/users';
import { ResetPassword } from '../models/resetpassword';
import { UserDetails } from '../models/userdetails';

const dbconnection = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST as string,
  username: process.env.DB_USERNAME as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.NODE_ENV === 'test' ? (process.env.DB_DATABASE_NAME_TEST as string) : (process.env.DB_DATABASE_NAME as string),
  port: Number(process.env.DB_PORT || 5432),
  logging: false,
  models: [Users, RefreshToken, ResetPassword, UserDetails],
});
export default dbconnection;
