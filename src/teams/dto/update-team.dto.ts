import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamDto } from './create-team.dto';
import { IsBoolean } from 'class-validator';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {
    @IsBoolean()
    isActive: boolean;
}
