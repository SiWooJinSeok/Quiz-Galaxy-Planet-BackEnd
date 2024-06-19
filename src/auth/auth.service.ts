import { Injectable } from '@nestjs/common';
import { UserInfoEntity } from '../entity/userEntity';
import { PrismaService } from './../prisma.service';
import { convertToUserInfoEntity } from './../utils/convertEntity';

@Injectable()
export class AuthService {
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
