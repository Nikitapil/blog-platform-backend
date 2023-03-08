import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    try {
      const request = ctx.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];
      if (bearer !== 'Bearer' || !token) {
        return null;
      }
      const jwtService = new JwtService();
      const user = jwtService.verify(token, {
        secret: process.env.ACCESS_SECRET
      });
      return user;
    } catch (e) {
      return null;
    }
  }
);
