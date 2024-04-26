import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './users.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './users.dto';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from './find.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async find() {
    return this.usersRepository.find();
  }

  async findPaginate(options) {
    options.size = parseInt(options.size);
    options.page = parseInt(options.page);

    return this.usersRepository.find({
      take: options.size,
      skip: options.size * options.page,
    });
  }

  async create(user: UserDto) {
    user.password = await bcrypt.hash(user.password, 10);

    return this.usersRepository.save(user);
  }

  async auth(payload) {
    if (!payload.email || !payload.password) {
      throw new BadRequestException({
        msg: 'email & password must be provided',
      });
    }

    let user;

    try {
      user = await this.usersRepository.findOne({
        where: { email: payload.email },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!user) {
      throw new UnauthorizedException({ msg: 'Login failed' });
    }

    const isValid = await bcrypt.compare(payload.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException({
        msg: 'Login Failed, password missmatch',
      });
    }

    return {
      token: 'token',
    };
  }

  validateToken(token) {
    return token === 'token';
  }
}
