import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    try {
      const request = ctx.switchToHttp().getRequest();
      return data ? request.cookies?.[data] : request.cookies;
    } catch (e) {
      console.log(e);
    }
  }
);
