import { Role } from '../../../roles/roles.model';
import { User } from '../../users.model';

export class UsersResponseDto {
  readonly id: number;
  readonly userName: string;
  readonly email: string;
  readonly banReason: string;
  readonly roles: Role[];
  readonly banned: boolean;
  readonly avatar: string;

  constructor(user: User) {
    this.id = user.id;
    this.userName = user.userName;
    this.email = user.email;
    this.banned = user.banned;
    this.banReason = user.banReason;
    this.avatar = user.avatar;
    this.roles = user.roles;
  }
}
