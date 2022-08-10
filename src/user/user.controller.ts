import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  //getMe(@Req() req: IGetUserAuthInfoRequest) {
  getMe(@GetUser() user: User) {
    console.log({ user });
    return user;
  }
}
