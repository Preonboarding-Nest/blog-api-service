import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { GENDER_ENUM } from '../entities/enums';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(GENDER_ENUM)
  @IsNotEmpty()
  gender: GENDER_ENUM;

  @IsNumber()
  age: number;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
