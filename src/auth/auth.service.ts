import { HttpException, Injectable } from '@nestjs/common';
import { UserInfoEntity } from '../entity/userEntity';
import { PrismaService } from './../prisma.service';
import { convertToUserInfoEntity } from './../utils/convertEntity';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { LoginDTO, SignupDTO } from '../dto/authDTO';

@Injectable()
export class AuthService {
  client = new CognitoIdentityProviderClient({ region: 'ap-northeast-2' });
  constructor(private readonly prismaService: PrismaService) {}

  async login(loginDTO: LoginDTO): Promise<UserInfoEntity> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: loginDTO.email,
      },
    });
    return convertToUserInfoEntity(user);
  }

  async signup(signupDTO: SignupDTO) {
    const { email, nickname, password } = signupDTO;

    // SignUpCommand로 가입시키기
    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Password: password,
      Username: email,
    });

    try {
      await this.client.send(command);
      await this.prismaService.user.create({
        data: {
          email,
          nickname,
          password,
        },
      });
    } catch (err) {
      return new HttpException(err.message, 500);
    }
  }
}
