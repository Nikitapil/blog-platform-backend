import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  async createRole(dto: CreateRoleDto) {
    const role = await this.roleRepository.create(dto);
    return role;
  }

  async getRole(value: string) {
    const role = await this.roleRepository.findOne({ where: { value } });
    return role;
  }

  async getAll() {
    const roles = await this.roleRepository.findAll();
    return roles;
  }
}
