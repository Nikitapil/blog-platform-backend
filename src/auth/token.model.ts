import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface TokenCreationAttrs {
  userId: number;
  token: string;
}

@Table({ tableName: 'tokens' })
export class Token extends Model<Token, TokenCreationAttrs> {
  @ApiProperty({ example: '1', description: 'unique id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @ApiProperty({ example: '1', description: 'user id' })
  @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
  userId: number;

  @ApiProperty({ example: 'qweqewefwadfsaddf', description: 'refresh token' })
  @Column({ type: DataType.STRING(2048), allowNull: false })
  token: string;
}
