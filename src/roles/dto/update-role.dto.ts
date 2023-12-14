import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsBoolean } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @IsBoolean()
    isActive: boolean;
}
