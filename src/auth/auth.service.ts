import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignInResponseDto } from './dto/signIn-response.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<SignInResponseDto> {
    const { name } = authCredentialsDto;
    const isValid = await this.userRepository.validateUser(authCredentialsDto);
    if (!isValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    const payload: JwtPayload = { name };
    const accessToken = await this.jwtService.sign(payload);

    const result: SignInResponseDto = {
      accessToken,
    };
    this.logger.debug(`signIn. Payload: ${JSON.stringify(payload)}, accessToken: ${accessToken}`);
    
    return result;
  }
}
