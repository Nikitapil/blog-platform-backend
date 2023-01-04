import {AuthResponse, TUserData} from "../Domain";
import {ApiProperty} from "@nestjs/swagger";
import {userDataExample} from "../../Swagger/examples";

export class AuthResponseDto implements AuthResponse{
    @ApiProperty({example: 'qweqwe.qweasdzxc.qweqwe', description: 'refresh toking for cookies'})
    accessToken: string;

    @ApiProperty({example: 'qweqwe.qweasdzxc.qweqwe', description: 'access token for auth required requests'})
    refreshToken: string;

    @ApiProperty({example: userDataExample, description: 'access token for auth required requests'})
    user: TUserData
}