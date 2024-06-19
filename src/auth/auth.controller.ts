import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserInfoEntity } from '../entity/userEntity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(): Promise<UserInfoEntity> {
    return this.authService.login();
  }

  @Post('signup')
  async signup() {
    return this.authService.signup();
  }
}
