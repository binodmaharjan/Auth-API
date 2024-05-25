import { Table, Model, Column, DataType, CreatedAt, UpdatedAt, BelongsTo } from 'sequelize-typescript';
import { Users } from './users';

@Table({
  timestamps: true,
  tableName: 'refreshTokens',
})
export class RefreshToken extends Model {
  @BelongsTo(() => Users, 'userId')
  user!: Users;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  token!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  expires!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  revokedByIp!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  revoked!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  createdByIp!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isExpired!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isActive!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}
