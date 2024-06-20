import { ApiProperty } from '@nestjs/swagger';

export class UserInfoEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '닉네임' })
  nickname: string;

  @ApiProperty({ example: 'sample@naver.com' })
  email: string;

  @ApiProperty({ required: false, example: '' })
  profile_image?: string;

  @ApiProperty({ required: false, example: '' })
  introduction?: string;
}

export class UserJWTEntity extends UserInfoEntity {
  @ApiProperty({ example: '' })
  accessToken: string;

  @ApiProperty({ example: '' })
  refreshToken: string;
}
