import {Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto.ts/create-user.dto";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {AddRoleDto} from "./dto/add-role-dto";
import {BanUserDto} from "./dto/ban-user.dto";
import {ValidationPipe} from "../pipes/validation.pipe";
import {JwtAuthGuard} from "../auth/jwt.auth.guard";
import {UserResponseDto} from "./dto/user-response.dto";
import {FileInterceptor} from "@nestjs/platform-express";

@ApiTags('Users')
@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {
    }

    @ApiOperation({summary: 'Creating user'})
    @ApiResponse({status: 200, type: User})
    @UsePipes(ValidationPipe)
    @Post()
    create(@Body() userDto: CreateUserDto) {
        return this.userService.createUser(userDto);
    }

    @ApiOperation({summary: 'Get all users'})
    @ApiResponse({status: 200, type: [User]})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.userService.getAllUsers()
    }

    @ApiOperation({summary: 'add role to user'})
    @ApiResponse({status: 200})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post('/role')
    addRole(@Body() dto: AddRoleDto) {
        return this.userService.addRole(dto)
    }

    @ApiOperation({summary: 'Ban user'})
    @ApiResponse({status: 200})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post('/ban')
    banUser(@Body() dto: BanUserDto) {
        return this.userService.banUser(dto)
    }

    @ApiOperation({summary: 'Update Avatar'})
    @ApiResponse({status: 200, type: UserResponseDto})
    @UseGuards(JwtAuthGuard)
    @Post('/update-avatar')
    @UseInterceptors(FileInterceptor('image'))
    UpdateAvatar(@UploadedFile() image, @Req() req) {
        return this.userService.updateAvatar(image, req.user?.id)
    }
}
