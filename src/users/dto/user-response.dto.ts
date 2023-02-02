import {User} from "../users.model";
import {Role} from "../../roles/roles.model";

export class UserResponseDto {
    banReason: string;
    userName: string;
    email: string;
    id: number;
    roles: Role[];
    banned: boolean;
    avatar: string | null

    constructor(user: User) {
        this.banReason = user.banReason;
        this.userName = user.userName;
        this.email = user.email;
        this.id = user.id;
        this.roles = user.roles;
        this.banned = user.banned;
        this.avatar = user.avatar;
    }
}