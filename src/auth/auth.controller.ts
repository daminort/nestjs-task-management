import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignInResponseDto } from './dto/signIn-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto)
  }

  @Post('/signin')
  async signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<SignInResponseDto> {
    return this.authService.signIn(authCredentialsDto)
  }
}
