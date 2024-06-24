import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class EmailDTO {
  @ApiProperty({ description: '이메일', type: 'string' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class SignupDTO extends EmailDTO {
  @ApiProperty({ description: '닉네임', type: 'string' })
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @ApiProperty({ description: '비밀번호', type: 'string' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class ConfirmEmailDTO extends EmailDTO {
  @ApiProperty({ description: '코드', type: 'string' })
  @IsNotEmpty()
  @IsString()
  code: string;
}

export class LoginDTO extends EmailDTO {
  @ApiProperty({ description: '비밀번호', type: 'string' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
