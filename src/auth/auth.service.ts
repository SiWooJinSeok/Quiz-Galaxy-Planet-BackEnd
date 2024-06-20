import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserInfoEntity } from '../entity/userEntity';
import { PrismaService } from './../prisma.service';
import { convertToJWTUserInfoEntity } from './../utils/convertEntity';
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { ConfirmEmailDTO, LoginDTO, SignupDTO } from '../dto/authDTO';
import { AUTH_ERROR_MESSAGE } from 'src/constant/message';

@Injectable()
export class AuthService {
  private readonly client = new CognitoIdentityProviderClient({
    region: 'ap-northeast-2',
  });

  private readonly CLIENT_ID = process.env.COGNITO_CLIENT_ID;
  constructor(private readonly prismaService: PrismaService) {}

  async login(loginDTO: LoginDTO): Promise<UserInfoEntity> {
    const { email, password } = loginDTO;

    const input: InitiateAuthCommandInput = {
      AuthFlow: 'USER_PASSWORD_AUTH', // 사용자 이름과 비밀번호를 사용한 인증
      ClientId: this.CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };
    const command = new InitiateAuthCommand(input);

    try {
      const result = await this.client.send(command);
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });
      return convertToJWTUserInfoEntity(user, result?.AuthenticationResult);
    } catch (err) {
      if (err.name === 'NotAuthorizedException') {
        throw new HttpException(
          AUTH_ERROR_MESSAGE.EMAIL_OR_PASSWORD_NOT_MATCH,
          err.$metadata.httpStatusCode,
        );
      }

      if (err.name === 'UserNotConfirmedException') {
        throw new HttpException(
          AUTH_ERROR_MESSAGE.EMAIL_FORBIDDEN,
          HttpStatus.FORBIDDEN,
        );
      }

      throw new HttpException(err.message, err.$metadata.httpStatusCode);
    }
  }

  async signup(signupDTO: SignupDTO) {
    const { email, nickname, password } = signupDTO;

    // SignUpCommand로 가입시키기
    const command = new SignUpCommand({
      ClientId: this.CLIENT_ID,
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
      throw new HttpException(err.message, err.$metadata.httpStatusCode);
    }
  }

  async confirmEmail(confirmEmailDTO: ConfirmEmailDTO) {
    const { email, code } = confirmEmailDTO;
    // 이메일 인증 코드 확인하기
    const command = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    });

    try {
      await this.client.send(command);
    } catch (err) {
      if (err.name === 'CodeMismatchException') {
        throw new HttpException(
          AUTH_ERROR_MESSAGE.CONFIRM_BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(err.message, err.$metadata.httpStatusCode);
    }
  }
}
