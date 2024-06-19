import { Injectable } from '@nestjs/common';
import { UserInfoEntity } from '../entity/userEntity';
import { PrismaService } from './../prisma.service';
import { convertToUserInfoEntity } from './../utils/convertEntity';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class AuthService {
  client = new CognitoIdentityProviderClient({ region: 'ap-northeast-2' });
  constructor(private readonly prismaService: PrismaService) {}

  async login(): Promise<UserInfoEntity> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: 1,
      },
    });
    return convertToUserInfoEntity(user);
  }
}
