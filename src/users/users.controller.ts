import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './users.dto';
import { AuthGuard } from './auth.guard';
import { LoggingInterceptor } from './log.interceptor';
import { PaginationDto } from './find.dto';
import { ResponseTime } from './time.decorator';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@ResponseTime()
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  find(): object {
    return this.service.find();
  }

  @Get('/paginate')
  findPaginate(@Query() pagination: PaginationDto): object {
    return this.service.findPaginate(pagination);
  }

  @Post()
  async create(@Body(new ValidationPipe()) user: UserDto): Promise<object> {
    try {
      return await this.service.create(user);
    } catch (error) {
      throw new BadRequestException({});
    }
  }

  @Post('/login')
  async login(@Body() body) {
    try {
      return await this.service.auth(body);
    } catch (error) {
      throw error;
    }
  }

  @Get('/special')
  @UseGuards(AuthGuard)
  authTest() {
    return {
      data: 'Access granted',
    };
  }
}
