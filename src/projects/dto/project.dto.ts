import { IsBoolean, IsString } from "class-validator";

export class ProjectDto {
    @IsString()
    _id?: string;
    
    @IsString()
    name: string;
    
    @IsBoolean()
    isActive: boolean;
}