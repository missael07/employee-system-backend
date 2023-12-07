import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const {roleName } = createRoleDto;
      
      const newRole = new this.roleModel({roleName});

      await newRole.save();

      const { ...Role} = newRole.toJSON();

      return Role;
      
    } catch (error) {
      if(error.code === 11000){
        throw new BadRequestException(`${ createRoleDto.roleName} already exists!`);
      }
      else {
        throw new BadRequestException(`Bad request! error: ${error}` );
      }
    }
  }

  async findAll() {
    return await this.roleModel.find();
  }

  async findOne(id: string) {
    return await this.roleModel.findById(id);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {

    const Role = await this.roleModel.findById(id)
    if(Role){
      Role.roleName = updateRoleDto.roleName;
      Role.save();
      return Role;
    }
    return this.roleModel.find();
  }

  async remove(id: string) {

    const Role = await this.roleModel.findById(id);
    if(Role){
      Role.isActive = false;
      Role.save();
      return Role;
    }

    throw new NotFoundException();
  }
}
