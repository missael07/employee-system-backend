import { User } from "../entities/user.entity";

export class UserResponse{
    totalRows: number;
    data: User[];
}