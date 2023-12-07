import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()  
    email: string;
    @IsString()
    name: string;
    @IsString()
    lastName: string;
    @IsString()
    teamId?: string;
    @IsString()
    roleId: string;
    
}
