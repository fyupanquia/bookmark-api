import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { IGetUserAuthInfoRequest } from './IGetUserAuthInfoRequest';

export const GetUser = createParamDecorator(
  (
    field: string | undefined,
    ctx: ExecutionContext,
  ) => {
    const request: IGetUserAuthInfoRequest = ctx
      .switchToHttp()
      .getRequest();

    if (field) {
      return request.user[field];
    }
    return request.user;
  },
);
