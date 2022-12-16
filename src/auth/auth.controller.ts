import {Body, Controller, Get, Post, Req, Res} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../users/dto/create-user.dto.ts/create-user.dto";
import {AuthService} from "./auth.service";

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @Post('/login')
    async login(@Body() userDto: CreateUserDto, @Res() res) {
        const userData = await this.authService.login(userDto)
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 *1000, httpOnly:true})
        return res.json(userData)
    }

    @Post('/registration')
    async registration(@Body() userDto: CreateUserDto, @Res() res) {
        const userData = await this.authService.registration(userDto)
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 *1000, httpOnly:true})
        return res.json(userData)
    }

    @Get('/logout')
    async logOut(@Req() req, @Res() res) {
        const { refreshToken } = req.cookies
        const token = await this.authService.logOut(refreshToken)
        res.clearCookie('refreshToken')
        return res.json(token)
    }

    @Get('/refresh')
    async refresh(@Req() req, @Res() res) {
        const { refreshToken } = req.cookies;
        const userData = await this.authService.refresh(refreshToken)
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 *1000, httpOnly:true})
        return res.json(userData)
    }
}
