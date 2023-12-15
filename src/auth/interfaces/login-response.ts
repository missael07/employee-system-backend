import { UserVM } from "src/users/interfaces/userVM";

export interface LoginResponse{
    user: UserVM;
    token: string;
}