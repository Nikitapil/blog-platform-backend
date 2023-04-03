import { Role } from '../roles/roles.model';

export type TUserTokenPayload = {
  email: string;
  id: number;
  roles: Role[];
  banned: boolean;
};
