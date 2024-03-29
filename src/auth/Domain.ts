import { Role } from '../roles/roles.model';

export type TUserData = {
  banReason: string;
  userName: string;
  email: string;
  id: number;
  roles: Role[];
  banned: boolean;
  avatar: string | null;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: TUserData;
};
