import { IsEmail, IsJSON, IsString, Matches } from 'class-validator';
import { GENDER_ENUM, ROLE_ENUM } from '../../users/entities/enums';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,20}$/, {
    message: '비밀번호 양식에 맞게 작성하세요.',
  })
  password: string;
}

export class LoginResponseDto {
  @IsJSON()
  user: {
    id: number;
    email: string;
    gender: GENDER_ENUM;
    age: number;
    phone: string;
    role: ROLE_ENUM;
  };
}
