import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto, RoleResponse, UpdateRoleDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersRole } from './entities/role.entity';
import { FilterConfigDto } from 'src/shared/dto/filter';

@Injectable()
export class RolesService {

  constructor(@InjectModel(UsersRole.name) private roleModel: Model<UsersRole>) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const {roleName} = createRoleDto;

      const t = await this.roleModel.find({roleName});
      console.log(t);

      const newRole = new this.roleModel({roleName});

      await newRole.save();

      const { ...Role} = newRole.toJSON();

      return Role;
      
    } catch (error) {
      if(error.code === 11000){        
        throw new BadRequestException(`${ createRoleDto.roleName} already exists!`);
      }
      else {
        throw new BadRequestException(`Bad request! ${error}` );
      }
    }
  }

  async findAll() {
    return await this.roleModel.find().select('_id roleName');
  }

  async findOne(id: string) {
    return await this.roleModel.findById(id);
  }

  async findRolesPaginated(filterConfigDto: FilterConfigDto){
    const { pageSize, pageIndex, sortBy, sortDirection, filterBy} = filterConfigDto;
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortBy] = sortDirection;

    const query = filterBy ? { ['roleName']: { $regex: filterBy, $options: 'i' }  } : {};

    const [totalRows, data] =  await Promise.all([
      this.roleModel.countDocuments(query),
      this.roleModel.find(query).sort(sortOptions).skip(pageSize * pageIndex).limit(pageSize).exec()
    ])
    
    const response = <RoleResponse> {
      totalRows,
      data
    }
    return response;
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

  async remove(id: string, statusDto: {status: boolean}) {

    const Role = await this.roleModel.findById(id);
    if(Role){
      let currentDate = new Date();

      Role.isActive = statusDto.status;
      Role.updatedAt = currentDate;
      Role.save();
      return Role;
    }

    throw new NotFoundException();
  }
}
