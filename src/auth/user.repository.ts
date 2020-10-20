import { EntityRepository, Repository } from 'typeorm';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { appConfig } from '../config/app.config';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { name, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt(appConfig.saltRounds);
    const hash = await this.hashPassword(password, salt);

    const user = new User();
    user.name = name;
    user.password = hash;

    try {
      await user.save();

    } catch (error) {
      if (error.code === '23505') { // duplication name
        throw new ConflictException('User already exists');
      }

      throw new InternalServerErrorException();
    }

    return Promise.resolve();
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    const result = await bcrypt.hash(password, salt);
    return Promise.resolve(result);
  }

  async validateUser(authCredentialsDto: AuthCredentialsDto): Promise<boolean> {
    const { name, password } = authCredentialsDto;
    const user = await this.findOne({ name });
    if (!user) {
      return false;
    }

    return bcrypt.compare(password, user.password);
  }
}
