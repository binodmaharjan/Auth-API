import { Table, Model, Column, DataType, CreatedAt, UpdatedAt, HasMany, HasOne } from 'sequelize-typescript';

import { UserDetails } from './userdetails';
import { RefreshToken } from './refreshtoken';

@Table({
  timestamps: true,
  tableName: 'users',
})
export class Users extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  verified!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  verificationToken!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isActive!: boolean;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  // association

  @HasOne(() => UserDetails)
  userdetails!: UserDetails;

  @HasMany(() => RefreshToken, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  })
  refreshTokens!: RefreshToken[];
}
