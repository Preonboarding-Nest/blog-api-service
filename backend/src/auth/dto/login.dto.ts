import { IsEmail, IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,20}$/, {
    message: '비밀번호 양식에 맞게 작성하세요.',
  })
  password: string;
}
