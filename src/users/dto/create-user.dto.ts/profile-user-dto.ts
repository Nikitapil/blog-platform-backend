import {User} from "../../users.model";

export class ProfileUserDto {
    userName: string;
    id: number;
    avatar: string;

    constructor(user: User) {
        this.userName = user.userName;
        this.id = user.id;
        this.avatar = user.avatar;
    }
}