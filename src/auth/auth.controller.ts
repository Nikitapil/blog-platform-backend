import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto.ts/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user-dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @Post('/login')
  async login(@Body() userDto: LoginUserDto, @Res() res) {
    const userData = await this.authService.login(userDto);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });
    return res.json(userData);
  }

  @ApiOperation({ summary: 'Registration' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @Post('/registration')
  async registration(@Body() userDto: CreateUserDto, @Res() res) {
    const userData = await this.authService.registration(userDto);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });
    return res.json(userData);
  }

  @ApiOperation({ summary: 'logout' })
  @Get('/logout')
  async logOut(@Req() req, @Res() res) {
    const { refreshToken } = req.cookies;
    const token = await this.authService.logOut(refreshToken);
    res.clearCookie('refreshToken');
    return res.json(token);
  }

  @ApiOperation({ summary: 'Check auth by refresh token' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @Get('/refresh')
  async refresh(@Req() req, @Res() res) {
    const { refreshToken } = req.cookies;
    const userData = await this.authService.refresh(refreshToken);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });
    return res.json(userData);
  }
}
