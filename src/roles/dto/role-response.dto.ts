import { UsersRole } from "../entities/role.entity";

export class RoleResponse{
    totalRows: number;
    data: UsersRole[];
}