import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto.ts/create-user.dto";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import {User} from "../users/users.model";
import {InjectModel} from "@nestjs/sequelize";
import {Token} from "./token.model";
import {LoginUserDto} from "../users/dto/login-user-dto";
import {UserResponseDto} from "../users/dto/user-response.dto";
@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private jwtService: JwtService,
                @InjectModel(Token) private tokenRepository: typeof Token
    ) {
    }

    async login(userDto: LoginUserDto) {
        const user = await this.validateUser(userDto)
        const userData = await this.generateToken(user)
        await this.saveToken(userData.user.id, userData.refreshToken)
        return userData
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email)
        if (candidate) {
            throw new HttpException(`User with email ${userDto.email} already exists`, HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5)
        const user = await this.userService.createUser({...userDto, password: hashPassword})
        const userData = await this.generateToken(user)
        await this.saveToken(userData.user.id, userData.refreshToken)
        return userData
    }

    async logOut(refreshToken) {
        await this.tokenRepository.destroy({where: {token: refreshToken}})
        return refreshToken
    }

    async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, roles: user.roles, banned: user.banned}
        return {
            accessToken: this.jwtService.sign(payload, {
                secret: process.env.ACCESS_SECRET,
                expiresIn: '15m'
            }),
            refreshToken: this.jwtService.sign(payload, {
                secret: process.env.REFRESH_SECRET,
                expiresIn: '30d'
            }),
            user: {...new UserResponseDto(user)}
        }
    }

    private async validateUser(userDto: LoginUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email)
        if (!user) {
            throw new UnauthorizedException({message: 'Incorrect email or password'})
        }
        const passwordEquals = await bcrypt.compare(userDto.password, user.password)
        if (user && passwordEquals) {
            return user
        }
        throw new UnauthorizedException({message: 'Incorrect email or password'})
    }

    async saveToken(userId, refreshToken: string) {
        const tokenData = await this.tokenRepository.findOne({where: { userId }})
        if (tokenData) {
            await tokenData.update({token: refreshToken})
            return
        }
        await this.tokenRepository.create({userId,  token: refreshToken})
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new UnauthorizedException({message: 'Unauthorized'})
        }
        try {
            const userData = await this.jwtService.verify(refreshToken, {secret: process.env.REFRESH_SECRET})
            const tokenFromDb = await this.tokenRepository.findOne({where: { token: refreshToken }})

            if (!userData || !tokenFromDb) {
                throw new UnauthorizedException({message: 'Unauthorized'})
            }

            const user = await this.userService.getUserById(userData.id)
            const responseData = await this.generateToken(user)
            await this.saveToken(user.id, responseData.refreshToken)
            return responseData
        } catch (e) {
            throw new UnauthorizedException({message: 'Unauthorized'})
        }

    }
}
