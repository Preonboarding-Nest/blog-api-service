import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { GENDER_ENUM } from '../entities/enums';

export class CreateUserDto {
  @ApiProperty({ description: '이메일' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '패스워드' })
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,20}$/, {
    message: '비밀번호 양식에 맞게 작성하세요.',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: '성별' })
  @IsEnum(GENDER_ENUM)
  gender: GENDER_ENUM;

  @ApiProperty({ description: '나이' })
  @IsNumber()
  @Min(1)
  @Max(200)
  age: number;

  @ApiProperty({ description: '연락처' })
  @Matches(/^\d{3}\d{3,4}\d{4}$/, {
    message: '휴대폰번호 양식에 맞게 작성하세요.',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
