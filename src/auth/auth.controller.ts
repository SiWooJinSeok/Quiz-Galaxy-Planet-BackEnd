import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserInfoEntity } from '../entity/userEntity';
import { ConfirmEmailDTO, EmailDTO, LoginDTO, SignupDTO } from '../dto/authDTO';
import { ApiTags } from '@nestjs/swagger';
import {
  ConfirmEmailDecorator,
  LoginDecorator,
  PasswordForgotDecorator,
  ResendConfirmEmailDecorator,
  SignupDecorator,
} from '../decorator/authDecorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @LoginDecorator('login')
  async login(@Body() loginDTO: LoginDTO): Promise<UserInfoEntity> {
    return this.authService.login(loginDTO);
  }

  @SignupDecorator('signup')
  async signup(@Body() signupDTO: SignupDTO) {
    return this.authService.signup(signupDTO);
  }

  @ConfirmEmailDecorator('confirm-email')
  async confirmEmail(@Body() confirmEmailDTO: ConfirmEmailDTO) {
    return this.authService.confirmEmail(confirmEmailDTO);
  }

  @ResendConfirmEmailDecorator('resend-code')
  async resendConfirmEmail(@Body() emailDTO: EmailDTO) {
    return this.authService.resendConfirmEmail(emailDTO);
  }

  @PasswordForgotDecorator('password-forgot')
  async passwordForgot(@Body() emailDTO: EmailDTO) {
    return this.authService.passwordForgot(emailDTO);
  }
}
