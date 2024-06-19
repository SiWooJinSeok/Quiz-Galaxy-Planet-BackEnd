import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserInfoEntity } from '../entity/userEntity';
import { LoginDTO, SignupDTO } from '../dto/authDTO';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDTO: LoginDTO): Promise<UserInfoEntity> {
    return this.authService.login(loginDTO);
  }

  @Post('signup')
  async signup(@Body() signupDTO: SignupDTO) {
    return this.authService.signup(signupDTO);
  }
}
