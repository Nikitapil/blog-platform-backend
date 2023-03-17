import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.ts/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { ChangeRoleDto } from './dto/change-role-dto';
import { BanUserDto } from './dto/ban-user.dto';
import { FilesService } from '../files/files.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UserNameDto } from './dto/create-user.dto.ts/user-name.dto';
import { UserPasswordDto } from './dto/create-user.dto.ts/user-password.dto';
import * as bcrypt from 'bcryptjs';
import { ProfileUserDto } from './dto/create-user.dto.ts/profile-user-dto';
import { UsersResponseDto } from './dto/create-user.dto.ts/users-response.dto';
import { UnbanUserDto } from './dto/unban-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
    private fileService: FilesService
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const role = await this.roleService.getRole('USER');
    await user.$set('roles', [role.id]);
    user.roles = [role];
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });
    return users.map((user) => new UsersResponseDto(user));
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true }
    });
    return user;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findByPk(id, {
      include: { all: true }
    });
    return user;
  }

  async changeRoles(dto: ChangeRoleDto) {
    let user = await this.userRepository.findByPk(dto.userId, {
      include: { all: true }
    });
    const roles = await this.roleService.getRolesByValues(dto.values);
    if (roles && user) {
      await user.$set(
        'roles',
        roles.map((role) => role.id)
      );
      user = await this.userRepository.findByPk(dto.userId, {
        include: { all: true }
      });
      return new UserResponseDto(user);
    }
    throw new HttpException('user or role not found', HttpStatus.NOT_FOUND);
  }

  async banUser(dto: BanUserDto) {
    const user = await this.userRepository.findByPk(dto.userId, {
      include: { all: true }
    });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    user.banned = true;
    user.banReason = dto.banReason;
    await user.save();
    return new UsersResponseDto(user);
  }

  async unbanUser(dto: UnbanUserDto) {
    const user = await this.userRepository.findByPk(dto.userId, {
      include: { all: true }
    });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    user.banned = false;
    user.banReason = '';
    await user.save();
    return new UsersResponseDto(user);
  }

  async updateAvatar(image, userId) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const avatarName = user.avatar || '';
    user.avatar = await this.fileService.updateFile(image, avatarName);
    await user.save();
    return { ...new UserResponseDto(user) };
  }

  async updateUsername(dto: UserNameDto, userId: number) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    user.userName = dto.userName;
    await user.save();
    return { ...new UserResponseDto(user) };
  }

  async deleteAvatar(userId: number) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    await this.fileService.deleteFile(user.avatar);
    user.avatar = null;
    await user.save();
    return { ...new UserResponseDto(user) };
  }

  async updatePassword(dto: UserPasswordDto, userId: number) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const passwordEquals = await bcrypt.compare(dto.oldPassword, user.password);
    if (!passwordEquals) {
      throw new HttpException('Wrong password', HttpStatus.FORBIDDEN);
    }
    const newPassword = await bcrypt.hash(dto.newPassword, 5);
    user.password = newPassword;
    await user.save();
    return { ...new UserResponseDto(user) };
  }

  async getUser(id: number) {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    return { ...new ProfileUserDto(user) };
  }

  async updateEmail(email: string, userId: number) {
    const user = await this.userRepository.findByPk(userId);

    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const userByEmail = await this.userRepository.findOne({ where: { email } });

    if (userByEmail) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    user.email = email;
    await user.save();
    return { ...new UserResponseDto(user) };
  }
}
