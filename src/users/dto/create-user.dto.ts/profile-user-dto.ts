import {User} from "../../users.model";

export class ProfileUserDto {
    userName: string;
    id: number;

    constructor(user: User) {
        this.userName = user.userName;
        this.id = user.id;
    }
}