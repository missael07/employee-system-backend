import { IsString } from "class-validator";

export class CreateTeamDto {

    @IsString()
    teamName: string;

    @IsString()
    projectId: string;
}
